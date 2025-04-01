/* eslint-disable @typescript-eslint/no-unused-vars */
import { v } from "convex/values"
import { mutation, query, QueryCtx } from "./_generated/server"
import { getAuthUserId } from "@convex-dev/auth/server"
import { Id, Doc } from "./_generated/dataModel"
import { paginationOptsValidator } from "convex/server"

const populateUser = async (ctx: QueryCtx, userId: Id<"users">) => {
    const user = await ctx.db.get(userId)

    return user
}

const populateMember = async (ctx: QueryCtx, memberId: Id<"members">) => {
    const member = await ctx.db.get(memberId)
    return member
}

const populateReaction = async (ctx: QueryCtx, messageId: Id<"messages">) => {
    const reaction = await ctx.db
        .query("reactions")
        .withIndex("by_message_id", (q) => q.eq("messageId", messageId))
        .collect()
    return reaction
}

const populateThread = async (ctx: QueryCtx, messageId: Id<"messages">) => {
    const messages = await ctx.db
        .query("messages")
        .withIndex("by_parent_message_id", (q) => q.eq("parentMessageId", messageId))
        .collect()

    if (messages.length === 0) {
        return {
            count: 0,
            image: undefined,
            timeStamp: 0,
        }
    }

    const lastMessage = messages[messages.length - 1]
    const lastMessageMember = await populateMember(ctx, lastMessage.memberId)

    if (!lastMessageMember) {
        return {
            count: 0,
            image: undefined,
            timeStamp: 0,
        }
    }

    const lastMessageUser = await populateUser(ctx, lastMessageMember.userId)

    return {
        count: messages.length,
        image: lastMessageUser?.image,
        timeStamp: lastMessage?._creationTime,
    }
}

const getMember = async (ctx: QueryCtx, workspaceId: Id<"workspaces">, userId: Id<"users">) => {
    const member = await ctx.db
        .query("members")
        .withIndex("by_user_id_workspace_id", (q) => q.eq("userId", userId).eq("workspaceId", workspaceId))
        .unique()

    return member
}

export const create = mutation({
    args: {
        body: v.string(),
        image: v.optional(v.id("_storage")),
        workspaceId: v.id("workspaces"),
        channelId: v.optional(v.id("channels")),
        parentMessageId: v.optional(v.id("messages")),
        conversationId: v.optional(v.id("conversations")),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) {
            throw new Error("Unauthorized")
        }

        const member = await getMember(ctx, args.workspaceId, userId)

        if (!member) {
            throw new Error("Unauthorized")
        }

        let _conversationId = args.conversationId
        if (!args.conversationId && !args.channelId && args.parentMessageId) {
            const parentMessage = await ctx.db.get(args.parentMessageId)

            if (!parentMessage) {
                throw new Error("Parent message not found")
            }

            _conversationId = parentMessage.conversationId
        }

        const messageId = await ctx.db.insert("messages", {
            body: args.body,
            image: args.image,
            memberId: member._id,
            workspaceId: args.workspaceId,
            channelId: args.channelId,
            parentMessageId: args.parentMessageId,
            conversationId: _conversationId,
        })

        return messageId
    },
})

export const remove = mutation({
    args: {
        id: v.id("messages"),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) {
            throw new Error("Unauthorized")
        }

        const message = await ctx.db.get(args.id)

        if (!message) {
            throw new Error("Message not found")
        }

        const member = await getMember(ctx, message.workspaceId, userId)

        if (!member) {
            throw new Error("Unauthorized")
        }

        if (!member || member._id !== message.memberId) {
            throw new Error("Unauthorized")
        }

        await ctx.db.delete(args.id)

        return args.id
    },
})

export const update = mutation({
    args: {
        id: v.id("messages"),
        body: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) {
            throw new Error("Unauthorized")
        }

        const message = await ctx.db.get(args.id)

        if (!message) {
            throw new Error("Message not found")
        }

        const member = await getMember(ctx, message.workspaceId, userId)

        if (!member) {
            throw new Error("Unauthorized")
        }

        if (!member || member._id !== message.memberId) {
            throw new Error("Unauthorized")
        }

        await ctx.db.patch(args.id, {
            body: args.body,
            updatedAt: Date.now(),
        })

        return args.id
    },
})

export const get = query({
    args: {
        channelId: v.optional(v.id("channels")),
        conversationId: v.optional(v.id("conversations")),
        parentMessageId: v.optional(v.id("messages")),
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) {
            throw new Error("Unauthorized")
        }

        let _conversationId = args.conversationId
        if (!args.conversationId && !args.channelId && args.parentMessageId) {
            const parentMessage = await ctx.db.get(args.parentMessageId)

            if (!parentMessage) {
                throw new Error("Parent message not found")
            }

            _conversationId = parentMessage.conversationId
        }

        const results = await ctx.db
            .query("messages")
            .withIndex("by_channel_id_parent_message_id_conversation_id", (q) =>
                q
                    .eq("channelId", args.channelId)
                    .eq("parentMessageId", args.parentMessageId)
                    .eq("conversationId", _conversationId)
            )
            .order("desc")
            .paginate(args.paginationOpts)

        return {
            ...results,
            page: await Promise.all(
                results.page
                    .map(async (message) => {
                        const member = await populateMember(ctx, message.memberId)
                        const user = member ? await populateUser(ctx, member.userId) : null

                        if (!user || !user) {
                            return null
                        }
                        const reactions = await populateReaction(ctx, message._id)
                        const thread = await populateThread(ctx, message._id)
                        const image = message.image ? await ctx.storage.getUrl(message.image) : undefined
                        const reactionWithCounts = reactions.map((r) => ({
                            ...r,
                            count: reactions.filter((r) => r.value === r.value).length,
                        }))
                        const dedupedReactions = reactionWithCounts.reduce(
                            (acc, curr) => {
                                const existingReaction = acc.find((r) => r.value === curr.value)
                                if (existingReaction) {
                                    existingReaction.memberIds = Array.from(
                                        new Set([...existingReaction.memberIds, curr.memberId])
                                    )
                                } else {
                                    acc.push({ ...curr, memberIds: [curr.memberId] })
                                }
                                return acc
                            },
                            [] as (Doc<"reactions"> & { count: number; memberIds: Id<"members">[] })[]
                        )

                        const reactionsWithoutMemberId = dedupedReactions.map(
                            ({ memberIds, ...rest }) => rest
                        )
                        return {
                            ...message,
                            image,
                            member,
                            user,
                            reactions: reactionsWithoutMemberId,
                            threadCount: thread.count,
                            threadImage: thread.image,
                            thereadTimestamp: thread.timeStamp,
                        }
                    })
                    .filter((message): message is NonNullable<typeof message> => message !== null)
            ),
        }
    },
})

export const getById = query({
    args: {
        messageId: v.id("messages"),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) {
            return null
        }

        const message = await ctx.db.get(args.messageId)

        if (!message) {
            return null
        }

        const currentMember = await getMember(ctx, message.workspaceId, userId)

        if (!currentMember) {
            return null
        }

        const member = await populateMember(ctx, message.memberId)

        if (!member) {
            return null
        }

        const user = await populateUser(ctx, member.userId)

        if (!user) {
            return null
        }

        const reactions = await populateReaction(ctx, message._id)
        const reactionWithCounts = reactions.map((r) => ({
            ...r,
            count: reactions.filter((r) => r.value === r.value).length,
        }))
        const dedupedReactions = reactionWithCounts.reduce(
            (acc, curr) => {
                const existingReaction = acc.find((r) => r.value === curr.value)
                if (existingReaction) {
                    existingReaction.memberIds = Array.from(
                        new Set([...existingReaction.memberIds, curr.memberId])
                    )
                } else {
                    acc.push({ ...curr, memberIds: [curr.memberId] })
                }
                return acc
            },
            [] as (Doc<"reactions"> & { count: number; memberIds: Id<"members">[] })[]
        )
        const reactionsWithoutMemberId = dedupedReactions.map(({ memberIds, ...rest }) => rest)

        return {
            ...message,
            image: message.image ? await ctx.storage.getUrl(message.image) : undefined,
            user,
            member,
            reactions: reactionsWithoutMemberId,
        }
    },
})

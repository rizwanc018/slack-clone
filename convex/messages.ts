import { v } from "convex/values"
import { mutation, QueryCtx } from "./_generated/server"
import { getAuthUserId } from "@convex-dev/auth/server"
import { Id } from "./_generated/dataModel"

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
        // memberId: v.id("members"),
        workspaceId: v.id("workspaces"),
        channelId: v.optional(v.id("channels")),
        parentMessageId: v.optional(v.id("messages")),
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

        // Handle conversations

        const messageId = await ctx.db.insert("messages", {
            body: args.body,
            image: args.image,
            memberId: member._id,
            workspaceId: args.workspaceId,
            channelId: args.channelId,
            parentMessageId: args.parentMessageId,
            updatedAt: Date.now(),
        })

        return messageId
    },
})

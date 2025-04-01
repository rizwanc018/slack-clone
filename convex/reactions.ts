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

export const toggle = mutation({
    args: {
        messageId: v.id("messages"),
        value: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) {
            throw new Error("Unauthorized")
        }

        const message = await ctx.db.get(args.messageId)

        if (!message) {
            throw new Error("Message not found")
        }

        const member = await getMember(ctx, message.workspaceId, userId)

        if (!member) {
            throw new Error("Unauthorized")
        }

        const existingMessageReactionFromUser = await ctx.db
            .query("reactions")
            .filter((q) =>
                q.and(
                    q.eq(q.field("messageId"), args.messageId),
                    q.eq(q.field("memberId"), member._id),
                    q.eq(q.field("value"), args.value)
                )
            )
            .first()

        if (existingMessageReactionFromUser) {
            await ctx.db.delete(existingMessageReactionFromUser._id)
            return existingMessageReactionFromUser._id
        } else {
            const newReactionId = await ctx.db.insert("reactions", {
                messageId: args.messageId,
                memberId: member._id,
                value: args.value,
                workspaceId: message.workspaceId,
            })
            return newReactionId
        }
    },
})

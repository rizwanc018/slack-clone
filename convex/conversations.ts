import { v } from "convex/values"
import { mutation } from "./_generated/server"
import { getAuthUserId } from "@convex-dev/auth/server"

export const createOrGet = mutation({
    args: {
        workspaceId: v.id("workspaces"),
        memberId: v.id("members"),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) {
            throw new Error("Unauthorized")
        }

        const currentMember = await ctx.db

            .query("members")
            .withIndex("by_user_id_workspace_id", (q) =>
                q.eq("userId", userId).eq("workspaceId", args.workspaceId)
            )
            .unique()

        if (!currentMember) {
            throw new Error("Unauthorized")
        }

        const otherMember = await ctx.db.get(args.memberId)

        if (!otherMember) {
            throw new Error("Member not found")
        }

        const eixstingConversation = await ctx.db
            .query("conversations")
            .filter((q) => q.eq(q.field("workspaceId"), args.workspaceId))
            .filter((q) =>
                q.or(
                    q.and(
                        q.eq(q.field("memberOneId"), currentMember._id),
                        q.eq(q.field("memberTwoId"), otherMember._id)
                    ),
                    q.and(
                        q.eq(q.field("memberOneId"), otherMember._id),
                        q.eq(q.field("memberTwoId"), currentMember._id)
                    )
                )
            )
            .unique()

        if (eixstingConversation) {
            return eixstingConversation._id
        }

        const conversationId = await ctx.db.insert("conversations", {
            workspaceId: args.workspaceId,
            memberOneId: currentMember._id,
            memberTwoId: otherMember._id,
        })

        return conversationId
    },
})

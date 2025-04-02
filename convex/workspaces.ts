import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { getAuthUserId } from "@convex-dev/auth/server"

export const create = mutation({
    args: {
        name: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)
        if (userId === null) {
            throw new Error("Unauthorized")
        }
        const joinCode = Math.random().toString(36).substring(2, 8)
        const workspaceId = await ctx.db.insert("workspaces", {
            name: args.name,
            userId,
            joinCode,
        })
        await ctx.db.insert("members", {
            userId,
            workspaceId,
            role: "admin",
        })
        await ctx.db.insert("channels", {
            name: "general",
            workspaceId,
        })

        return workspaceId
    },
})

export const get = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) {
            return []
        }
        const members = await ctx.db
            .query("members")
            .withIndex("by_user_id", (q) => q.eq("userId", userId))
            .collect()
        const workspaceIds = members.map((m) => m.workspaceId)

        const workspaces = []

        for (const workspaceId of workspaceIds) {
            const workspace = await ctx.db.get(workspaceId)
            if (workspace) {
                workspaces.push(workspace)
            }
        }

        return workspaces
    },
})

export const getById = query({
    args: {
        workspaceId: v.id("workspaces"),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) {
            throw new Error("Unauthorized")
        }

        const member = await ctx.db
            .query("members")
            .withIndex("by_user_id_workspace_id", (q) =>
                q.eq("userId", userId).eq("workspaceId", args.workspaceId)
            )
            .unique()

        if (!member) {
            return null
        }
        return await ctx.db.get(args.workspaceId)
    },
})

export const update = mutation({
    args: {
        workspaceId: v.id("workspaces"),
        name: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) {
            throw new Error("Unauthorized")
        }

        const member = await ctx.db
            .query("members")
            .withIndex("by_user_id_workspace_id", (q) =>
                q.eq("userId", userId).eq("workspaceId", args.workspaceId)
            )
            .unique()

        if (!member || member.role !== "admin") {
            throw new Error("Unauthorized")
        }

        await ctx.db.patch(args.workspaceId, {
            name: args.name,
        })

        return args.workspaceId
    },
})

export const remove = mutation({
    args: {
        workspaceId: v.id("workspaces"),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) {
            throw new Error("Unauthorized")
        }

        const member = await ctx.db
            .query("members")
            .withIndex("by_user_id_workspace_id", (q) =>
                q.eq("userId", userId).eq("workspaceId", args.workspaceId)
            )
            .unique()

        if (!member || member.role !== "admin") {
            throw new Error("Unauthorized")
        }

        const [members, channels, conversations, messages, reactions] = await Promise.all([
            ctx.db
                .query("members")
                .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.workspaceId))
                .collect(),
            ctx.db
                .query("channels")
                .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.workspaceId))
                .collect(),
            ctx.db
                .query("conversations")
                .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.workspaceId))
                .collect(),
            ctx.db
                .query("messages")
                .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.workspaceId))
                .collect(),
            ctx.db
                .query("reactions")
                .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.workspaceId))
                .collect(),
        ])

        for (const member of members) {
            await ctx.db.delete(member._id)
        }

        for (const channel of channels) {
            await ctx.db.delete(channel._id)
        }

        for (const conversation of conversations) {
            await ctx.db.delete(conversation._id)
        }

        for (const message of messages) {
            await ctx.db.delete(message._id)
        }

        for (const reaction of reactions) {
            await ctx.db.delete(reaction._id)
        }

        await ctx.db.delete(args.workspaceId)

        return args.workspaceId
    },
})

export const newJoinCode = mutation({
    args: {
        workspaceId: v.id("workspaces"),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)

        if (!userId) {
            throw new Error("Unauthorized")
        }

        const member = await ctx.db
            .query("members")
            .withIndex("by_user_id_workspace_id", (q) =>
                q.eq("userId", userId).eq("workspaceId", args.workspaceId)
            )
            .unique()

        if (!member || member.role !== "admin") {
            throw new Error("Unauthorized")
        }

        const joinCode = Math.random().toString(36).substring(2, 8)
        await ctx.db.patch(args.workspaceId, {
            joinCode,
        })
        return args.workspaceId
    },
})

export const join = mutation({
    args: {
        joinCode: v.string(),
        workspaceId: v.id("workspaces"),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)

        if (!userId) {
            throw new Error("Unauthorized")
        }

        const workspace = await ctx.db.get(args.workspaceId)
        if (!workspace) {
            throw new Error("Workspace not found")
        }

        if (workspace.joinCode.toLowerCase() !== args.joinCode.toLowerCase()) {
            throw new Error("Invalid join code")
        }

        const existingMember = await ctx.db
            .query("members")
            .withIndex("by_user_id_workspace_id", (q) =>
                q.eq("userId", userId).eq("workspaceId", args.workspaceId)
            )
            .unique()

        if (existingMember) {
            throw new Error("Already member")
        }

        await ctx.db.insert("members", {
            userId,
            workspaceId: args.workspaceId,
            role: "member",
        })

        return args.workspaceId
    },
})

export const getInfoById = query({
    args: {
        workspaceId: v.id("workspaces"),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx)

        if (!userId) {
            return null
        }

        const member = await ctx.db
            .query("members")
            .withIndex("by_user_id_workspace_id", (q) =>
                q.eq("userId", userId).eq("workspaceId", args.workspaceId)
            )
            .unique()

        const workspace = await ctx.db.get(args.workspaceId)

        return {
            name: workspace?.name,
            isMember: !!member,
        }
    },
})

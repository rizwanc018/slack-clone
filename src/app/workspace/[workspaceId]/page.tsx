"use client"

import { useGetChannels } from "@/features/channels/api/use_get_channels"
import { useCreateChannelModal } from "@/features/channels/store/use_create_channel_modal"
import { useCurrentMember } from "@/features/members/api/use_current_memeber"
import { useGetWorkspace } from "@/features/workspaces/api/use_get_workspace"
import { useWorkspaceId } from "@/hooks/use_workspace_id"
import { Loader, TriangleAlert } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const WorkspaceIdPage = () => {
    const router = useRouter()
    const workspaceId = useWorkspaceId()
    const { data } = useGetWorkspace({ id: workspaceId })

    const [open, setOpen] = useCreateChannelModal()

    const { data: workspace, isLoading: isWorkspaceLoading } = useGetWorkspace({ id: workspaceId })
    const { data: channels, isLoading: isChannelsLoading } = useGetChannels({ workspaceId })
    const { data: member, isLoading: isMemberLoading } = useCurrentMember({ workspaceId })

    const channelId = channels?.[0]?._id
    const isAdmin = member?.role === "admin"

    useEffect(() => {
        if (isWorkspaceLoading || isChannelsLoading || !workspace || isMemberLoading || !member) return
        if (channelId) {
            router.replace(`/workspace/${workspaceId}/channel/${channelId}`)
        } else if (!open && isAdmin) {
            setOpen(true)
        }
    }, [workspaceId, isWorkspaceLoading, open, setOpen, router, channelId, isChannelsLoading, workspace, isMemberLoading, member, isAdmin])

    if (isWorkspaceLoading || isChannelsLoading) {
        return (
            <div className="h-full flex  items-center justify-center">
                <Loader className="size-6 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (!workspace) {
        return (
            <div className="h-full flex  items-center justify-center">
                <TriangleAlert className="size-6 text-muted-foreground" />
                <p className="text-md text-muted-foreground">Workspace not found</p>
            </div>
        )
    }

    return (
        <div className="h-full flex  items-center justify-center">
            <TriangleAlert className="size-6 text-muted-foreground" />
            <p className="text-md text-muted-foreground">Channels not found</p>
        </div>
    )
}

export default WorkspaceIdPage

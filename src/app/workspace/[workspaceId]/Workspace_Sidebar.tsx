import { useCurrentMember } from "@/features/members/api/use_current_memeber"
import { useGetWorkspace } from "@/features/workspaces/api/use_get_workspace"
import { useWorkspaceId } from "@/hooks/use_workspace_id"
import { AlertTriangle, HashIcon, Loader, MessageSquareText, SendHorizonal } from "lucide-react"
import WorkspaceHeader from "./Workspace_Header"
import { SidebarItem } from "./Sidebar_Item"
import { useGetChannels } from "@/features/channels/api/use_get_channels"
import { WorkspaceSection } from "./Workspace_Section"
import { UserItem } from "./User_item"
import { useCreateChannelModal } from "@/features/channels/store/use_create_channel_modal"
import { useGetMembers } from "@/features/members/api/use_get_memebers"
import { useMemberId } from "@/hooks/use_member_id"

const WorkspaceSidebar = () => {
    const workspaceId = useWorkspaceId()
    const memberId = useMemberId()
    const { data: member, isLoading: isMemberLoading } = useCurrentMember({ workspaceId })
    const { data: workspace, isLoading: isWorkspaceLoading } = useGetWorkspace({ id: workspaceId })
    const { data: channels, isLoading: isChannelsLoading } = useGetChannels({ workspaceId })
    const { data: members, isLoading: isMembersLoading } = useGetMembers({ workspaceId })
    const [, setOpen] = useCreateChannelModal()

    if (isWorkspaceLoading || isMemberLoading || isChannelsLoading || isMembersLoading) {
        return (
            <div className="flex flex-col bg-[#5e2c5f] h-full items-center justify-center">
                <Loader className="size-5 animate-spin text-white" />
            </div>
        )
    }

    if (!member || !workspace) {
        return (
            <div className="flex flex-col bg-[#5e2c5f] h-full items-center justify-center">
                <AlertTriangle className="size-5  text-white" />
                <p className="text-white text-sm">Workspace not found</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col bg-[#5e2c5f] h-full">
            <WorkspaceHeader workspace={workspace} isAdmin={member.role === "admin"} />
            <div className="flex flex-col px-2 mt-3">
                <SidebarItem label="Threads" icon={MessageSquareText} id="threads" />
                <SidebarItem label="Drafts & Sent" icon={SendHorizonal} id="drafts" />
            </div>
            <WorkspaceSection
                label="Channels"
                hint="New channel"
                onNew={member.role === "admin" ? setOpen : undefined}
            >
                {channels?.map((channel) => (
                    <SidebarItem key={channel._id} label={channel.name} icon={HashIcon} id={channel._id} />
                ))}
            </WorkspaceSection>
            <WorkspaceSection label="Members" hint="New channel" onNew={undefined}>
                {members?.map((member) => (
                    <UserItem
                        key={member._id}
                        label={member.user.name as string}
                        image={member.user.image as string}
                        id={member._id}
                        variant={member._id === memberId ? "active" : "default"}
                    />
                ))}
            </WorkspaceSection>
        </div>
    )
}

export default WorkspaceSidebar

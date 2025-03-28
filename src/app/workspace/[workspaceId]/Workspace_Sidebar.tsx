import { useCurrentMembers } from "@/features/members/api/use_current_memebers"
import { useGetWorkspace } from "@/features/workspaces/api/use_get_workspace"
import { useWorkspaceId } from "@/hooks/use_workspace_id"
import { AlertTriangle, Loader } from "lucide-react"
import WorkspaceHeader from "./Workspace_Header"

const WorkspaceSidebar = () => {
    const workspaceId = useWorkspaceId()
    const { data: member, isLoading: isMemberLoading } = useCurrentMembers({ workspaceId })
    const { data: workspace, isLoading: isWorkspaceLoading } = useGetWorkspace({ id: workspaceId })

    if (isWorkspaceLoading || isMemberLoading) {
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
        </div>
    )
}

export default WorkspaceSidebar

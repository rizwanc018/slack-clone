"use client"

import { useGetWorkspace } from "@/features/workspaces/api/use_get_workspace"
import { useWorkspaceId } from "@/hooks/use_workspace_id"

const WorkspaceIdPage = () => {
    const workspaceId = useWorkspaceId()
    const { data } = useGetWorkspace({ id: workspaceId })

    return <div>id {data?._id}</div>
}

export default WorkspaceIdPage

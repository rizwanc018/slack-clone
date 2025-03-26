"use client"

import { UserButton } from "@/features/auth/components/user_button"
import { useGetWorkspaces } from "@/features/workspaces/api/use_get_workspaces"
import { CreateWorkspaceModal } from "@/features/workspaces/components/create_workspace_modal"
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use_create_workspace_modal"
import { useEffect, useMemo } from "react"

export default function Home() {
    const { data, isLoading } = useGetWorkspaces()
    const workspaceId = useMemo(() => data?.[0]?.id, [data])
    const [open, setOpen] = useCreateWorkspaceModal()

    useEffect(() => {
        if (isLoading) return
        if (workspaceId) {
            console.log("workspaceId", workspaceId)
        } else if (!open) {
            setOpen(true)
            console.log("open workspace")
        }
    }, [workspaceId, isLoading, open, setOpen])

    return (
        <div>
            <CreateWorkspaceModal />
            <UserButton />
        </div>
    )
}

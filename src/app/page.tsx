"use client"

import { UserButton } from "@/features/auth/components/user_button"
import { useGetWorkspaces } from "@/features/workspaces/api/use_get_workspaces"
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use_create_workspace_modal"
import { useRouter } from "next/navigation"
import { useEffect, useMemo } from "react"

export default function Home() {
    const { data, isLoading } = useGetWorkspaces()
    
    const workspaceId = useMemo(() => data?.[0]?._id, [data])
    const [open, setOpen] = useCreateWorkspaceModal()
    const router = useRouter()

    useEffect(() => {
        if (isLoading) return
        if (workspaceId) {
            router.replace(`/workspace/${workspaceId}`)
        } else if (!open) {
            setOpen(true)
            console.log("open workspace")
        }
    }, [workspaceId, isLoading, open, setOpen, router])

    return (
        <div>
            <UserButton />
        </div>
    )
}

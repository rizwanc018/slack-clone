"use client"

import { CreateWorkspaceModal } from "@/features/workspaces/components/create_workspace_modal"
import { useEffect, useState } from "react"

export const Modals = () => {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <>
            <CreateWorkspaceModal />
        </>
    )
}

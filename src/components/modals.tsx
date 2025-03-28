"use client"

import { CreateWorkspaceModal } from "@/features/workspaces/components/create_workspace_modal"
import { CreateChannelModal } from "@/features/channels/components/create_channel_modal"
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
            <CreateChannelModal />
        </>
    )
}

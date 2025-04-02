"use client"

import { useCreateOrGetConversation } from "@/features/conversations/api/use_create_or_get_conversation"
import { useMemberId } from "@/hooks/use_member_id"
import { useWorkspaceId } from "@/hooks/use_workspace_id"
import { AlertTriangle, Loader } from "lucide-react"
import { useEffect, useState } from "react"
import { Id } from "../../../../../../convex/_generated/dataModel"
import { toast } from "sonner"
import Conversation from "./Conversation"

const MemeberPage = () => {
    const workspaceId = useWorkspaceId()
    const memeberId = useMemberId()

    const [conversationId, setConversationId] = useState<Id<"conversations"> | null>(null)

    const { mutate, isPending } = useCreateOrGetConversation()

    useEffect(() => {
        mutate(
            { memberId: memeberId, workspaceId },
            {
                onSuccess: (data) => {
                    setConversationId(data)
                },
                onError: (error) => {
                    console.log("🚀 ~ error🚀", error)
                    toast.error("Failed to create conversation")
                },
            }
        )
    }, [mutate, memeberId, workspaceId])

    if (isPending) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader className="size-4 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (!conversationId) {
        return (
            <div className="flex flex-col  h-full items-center justify-center">
                <AlertTriangle className="size-5  text-muted-foreground" />
                <p className="text-muted-foreground text-sm">Conversation not found</p>
            </div>
        )
    }

    return <Conversation conversationId={conversationId} />
}

export default MemeberPage

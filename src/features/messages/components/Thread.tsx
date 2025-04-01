import { Button } from "@/components/ui/button"
import { AlertTriangle, Loader, XIcon } from "lucide-react"
import { useGetMessage } from "../api/use_get_message"
import { Id } from "../../../../convex/_generated/dataModel"
import Message from "@/components/Message"
import { useWorkspaceId } from "@/hooks/use_workspace_id"
import { useCurrentMember } from "@/features/members/api/use_current_memeber"
import { current } from "../../../../convex/members"
import { useState } from "react"

interface ThreadProps {
    messageId: Id<"messages">
    onClose: () => void
}
const Thread = ({ messageId, onClose }: ThreadProps) => {
    const workspaceId = useWorkspaceId()
    const { data: currentMember } = useCurrentMember({ workspaceId })
    const { data: message, isLoading: loadingMessage } = useGetMessage({ messageId })
    const [editingId, setEditingId] = useState<Id<"messages"> | null>(null)

    if (loadingMessage) {
        return (
            <div className="flex flex-col h-full">
                <div className="flex justify-between items-center px-4 h-[49px]  border-b">
                    <p className="text-lg font-bold">Thread</p>
                    <Button onClick={onClose} size={"iconsSm"} variant={"ghost"}>
                        <XIcon className="size-5 stroke-[1.5]" />
                    </Button>
                </div>
                <div className="flex h-full items-center justify-center">
                    <Loader className="size-5 animate-spin text-muted-foreground" />
                </div>
            </div>
        )
    }

    if (!message) {
        return (
            <div className="flex flex-col h-full">
                <div className="flex justify-between items-center px-4 h-[49px]  border-b">
                    <p className="text-lg font-bold">Thread</p>
                    <Button onClick={onClose} size={"iconsSm"} variant={"ghost"}>
                        <XIcon className="size-5 stroke-[1.5]" />
                    </Button>
                </div>
                <div className="flex flex-col gap-y-2 h-full items-center justify-center">
                    <AlertTriangle className="size-5 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Message not found</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between items-center px-4 h-[49px]  border-b">
                <p className="text-lg font-bold">Thread</p>
                <Button onClick={onClose} size={"iconsSm"} variant={"ghost"}>
                    <XIcon className="size-5 stroke-[1.5]" />
                </Button>
            </div>
            <Message
                hideThreadButton
                id={message._id}
                memberId={message.memberId}
                authorImage={message.user.image}
                authorName={message.user.name}
                reactions={message.reactions}
                body={message.body}
                image={message.image}
                updatedAt={message.updatedAt}
                createdAt={message._creationTime}
                isEditing={editingId === message._id}
                setEditingId={setEditingId}
                isCompact={false}
                isAuthor={message.memberId === currentMember?._id}
            />
        </div>
    )
}

export default Thread

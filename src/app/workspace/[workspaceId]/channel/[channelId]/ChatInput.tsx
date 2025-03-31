import { useCreateMessage } from "@/features/messages/api/use_create_message"
import { useChannelId } from "@/hooks/use_channel_id"
import { useWorkspaceId } from "@/hooks/use_workspace_id"
import dynamic from "next/dynamic"
import Quill from "quill"
import { useRef, useState } from "react"

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false })

interface ChatInputProps {
    placeholder?: string
}

const ChatInput = ({ placeholder }: ChatInputProps) => {
    const [editorKey, setEditorKey] = useState(0)
    const editorRef = useRef<Quill | null>(null)
    const [isPending, setIsPending] = useState(false)

    const workspaceId = useWorkspaceId()
    const channelId = useChannelId()
    const { mutate: createMessage } = useCreateMessage()

    const handleSubmit = async ({ body, image }: { body: string; image: File | null }) => {
        try {
            setIsPending(true)
            createMessage({ body, workspaceId, channelId }, { throwError: true })
            setEditorKey(editorKey + 1)
        } catch (error) {
            console.log(error)
        } finally {
            setIsPending(false)
        }
    }

    return (
        <div className="px-5 w-full">
            <Editor
                key={editorKey}
                variant="create"
                placeholder={placeholder}
                onSubmit={handleSubmit}
                disabled={isPending}
                innerRef={editorRef}
            />
        </div>
    )
}

export default ChatInput

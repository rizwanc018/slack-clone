import { useCreateMessage } from "@/features/messages/api/use_create_message"
import { useGenerateUploadUrl } from "@/features/upload/api/use_generateUploadUrl"
import { useWorkspaceId } from "@/hooks/use_workspace_id"
import dynamic from "next/dynamic"
import Quill from "quill"
import { useRef, useState } from "react"
import { Id } from "../../../../../../convex/_generated/dataModel"
import { toast } from "sonner"

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false })

interface ChatInputProps {
    placeholder: string
    conversationId: Id<"conversations">
}

type CreateMessageValues = {
    body: string
    image?: Id<"_storage"> | undefined
    workspaceId: Id<"workspaces">
    conversationId: Id<"conversations">
}

const ChatInput = ({ placeholder, conversationId }: ChatInputProps) => {
    const [editorKey, setEditorKey] = useState(0)
    const editorRef = useRef<Quill | null>(null)
    const [isPending, setIsPending] = useState(false)

    const workspaceId = useWorkspaceId()
    const { mutate: createMessage } = useCreateMessage()
    const { mutate: generateUploadUrl } = useGenerateUploadUrl()

    const handleSubmit = async ({ body, image }: { body: string; image: File | null }) => {
        try {
            setIsPending(true)
            // editorRef?.current?.blur()
            editorRef?.current?.enable(false)

            const values: CreateMessageValues = {
                body,
                image: undefined,
                workspaceId,
                conversationId,
            }

            if (image) {
                const url = await generateUploadUrl({}, { throwError: true })
                if (typeof url !== "string" || !url) {
                    throw new Error("Url not found")
                }

                const result = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": image.type,
                    },
                    body: image,
                })

                if (!result.ok) {
                    throw new Error("Failed to upload image")
                }

                const { storageId } = await result.json()
                values.image = storageId
            }

            createMessage(values, { throwError: true })
            setEditorKey(editorKey + 1)
        } catch (error) {
            toast.error("Failed to send message")
            console.log(error)
        } finally {
            setIsPending(false)
            editorRef?.current?.enable(true)
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

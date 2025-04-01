import { Button } from "@/components/ui/button"
import { AlertTriangle, Loader, XIcon } from "lucide-react"
import { useGetMessage } from "../api/use_get_message"
import { Id } from "../../../../convex/_generated/dataModel"
import Message from "@/components/Message"
import { useWorkspaceId } from "@/hooks/use_workspace_id"
import { useCurrentMember } from "@/features/members/api/use_current_memeber"
import { useRef, useState } from "react"
import dynamic from "next/dynamic"
import Quill from "quill"
import { useCreateMessage } from "../api/use_create_message"
import { useGenerateUploadUrl } from "@/features/upload/api/use_generateUploadUrl"
import { useChannelId } from "@/hooks/use_channel_id"
import { toast } from "sonner"
import { GetMessagesReturnType, useGetMessages } from "../api/use_get_messages"
import { differenceInMinutes, format } from "date-fns"
import { formatDateLabel, TIME_THRESHOLD } from "@/components/Message_List"

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false })

interface ThreadProps {
    messageId: Id<"messages">
    onClose: () => void
}

type CreateMessageValues = {
    body: string
    image?: Id<"_storage"> | undefined
    workspaceId: Id<"workspaces">
    channelId?: Id<"channels">
    parentMessageId: Id<"messages">
}

const Thread = ({ messageId, onClose }: ThreadProps) => {
    const workspaceId = useWorkspaceId()
    const channelId = useChannelId()

    const { data: currentMember } = useCurrentMember({ workspaceId })
    const { data: message, isLoading: loadingMessage } = useGetMessage({ messageId })

    const { mutate: createMessage } = useCreateMessage()
    const { mutate: generateUploadUrl } = useGenerateUploadUrl()
    const { results, status, loadMore } = useGetMessages({ channelId, parentMessageId: messageId })

    const [editingId, setEditingId] = useState<Id<"messages"> | null>(null)

    const [editorKey, setEditorKey] = useState(0)
    const editorRef = useRef<Quill | null>(null)
    const [isPending, setIsPending] = useState(false)

    const canLoadMore = status === "CanLoadMore"
    const isLoadingMore = status === "LoadingMore"

    const handleSubmit = async ({ body, image }: { body: string; image: File | null }) => {
        try {
            setIsPending(true)
            // editorRef?.current?.blur()
            editorRef?.current?.enable(false)

            const values: CreateMessageValues = {
                body,
                image: undefined,
                workspaceId,
                channelId,
                parentMessageId: messageId,
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

    const groupedMessages = results?.reduce(
        (groups, message) => {
            const date = message?._creationTime ? new Date(message._creationTime) : null
            const dateKey = format(date, "yyyy-MM-dd")
            if (!groups[dateKey]) {
                groups[dateKey] = []
            }
            groups[dateKey].unshift(message)
            return groups
        },
        {} as Record<string, GetMessagesReturnType[]>
    )

    if (loadingMessage || status === "LoadingFirstPage") {
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
            <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
                {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => {
                    return (
                        <div key={dateKey}>
                            <div className="text-center my-2 relative">
                                <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
                                <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
                                    {formatDateLabel(dateKey)}
                                </span>
                            </div>
                            {messages.map((message, index) => {
                                const previousMessage = messages[index - 1]
                                const isCompact =
                                    previousMessage &&
                                    previousMessage.user.id === message.user.id &&
                                    differenceInMinutes(
                                        new Date(message._creationTime),
                                        new Date(previousMessage._creationTime)
                                    ) < TIME_THRESHOLD
                                return (
                                    <Message
                                        key={message._id}
                                        id={message._id}
                                        memberId={message.memberId}
                                        authorImage={message.user.image}
                                        authorName={message.user.name}
                                        reactions={message.reactions}
                                        body={message.body}
                                        image={message.image}
                                        updatedAt={message.updatedAt}
                                        createdAt={message._creationTime}
                                        hideThreadButton={true}
                                        threadCount={message.threadCount}
                                        threadImage={message.threadImage}
                                        thereadTimestamp={message.thereadTimestamp}
                                        isEditing={editingId === message._id}
                                        setEditingId={setEditingId}
                                        isCompact={isCompact}
                                        isAuthor={message.memberId === currentMember?._id}
                                    />
                                )
                            })}
                        </div>
                    )
                })}

            </div>
            <div className="px-4">
                <Editor
                    key={editorKey}
                    onSubmit={handleSubmit}
                    disabled={isPending}
                    innerRef={editorRef}
                    placeholder="Reply..."
                />
            </div>
        </div>
    )
}

export default Thread

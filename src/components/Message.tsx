import { format, isToday, isYesterday } from "date-fns"
import { Id, Doc } from "../../convex/_generated/dataModel"
import dynamic from "next/dynamic"
import { Hint } from "./Hint"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Thumbnail from "./Thumbnail"
import Toolbar from "./Toolbar"
import { useUpdateMessage } from "@/features/messages/api/use_update_message"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useRemoveMessage } from "@/features/messages/api/use_remove_message"
import { useConfirm } from "@/hooks/use_confirm"
import { useToggleReaction } from "@/features/reactions/api/use_toggle_reaction"
import Reactions from "./Reactions"
import { usePanel } from "@/hooks/use_pannel"

const Renderer = dynamic(() => import("./Renderer"), { ssr: false })
const Editor = dynamic(() => import("./Editor"), { ssr: false })

interface MessageProps {
    id: Id<"messages">
    memberId: string
    authorImage: string
    authorName: string
    reactions: Array<Omit<Doc<"reactions">, "memberId"> & { count: number; memberIds: Id<"members">[] }>
    body: Doc<"messages">["body"]
    image: string | null | undefined
    updatedAt: Doc<"messages">["updatedAt"]
    createdAt: Doc<"messages">["_creationTime"]
    hideThreadButton?: boolean
    threadCount?: number
    threadImage?: string
    thereadTimestamp?: string
    isEditing: boolean
    setEditingId: (id: Id<"messages"> | null) => void
    isCompact?: boolean
    isAuthor: boolean
}

const formatFullTime = (date: Date) => {
    return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "EEEE, MMMM")} ${format(
        date,
        "h:mm:ss a"
    )}`
}

const Message = ({
    id,
    memberId,
    authorImage,
    authorName = "Member",
    reactions,
    body,
    image,
    updatedAt,
    createdAt,
    hideThreadButton,
    threadCount,
    threadImage,
    thereadTimestamp,
    isEditing,
    setEditingId,
    isCompact,
    isAuthor,
}: MessageProps) => {
    const [ConfirmDialog, confirm] = useConfirm(
        "Delete Message",
        "Are you sure you want to delete this mesage?"
    )
    const { mutate: updateMessage, isPending: isUpdatingMessage } = useUpdateMessage()
    const { mutate: removeMessage, isPending: isRemovingMessage } = useRemoveMessage()
    const { mutate: toggleReaction, isPending: isTogglingReaction } = useToggleReaction()

    const {parentMessageId, onOpenMessage, onClose } = usePanel()

    const isPending = isUpdatingMessage

    const handleDelete = async () => {
        const ok = await confirm()
        if (!ok) {
            return
        }
        removeMessage(
            { id },
            {
                onSuccess: () => {
                    toast.success("Message deleted")
                    if(parentMessageId === id) {
                        onClose()
                    }
                },
                onError: () => toast.error("Failed to remove message"),
            }
        )
    }

    const handleUpdate = ({ body }: { body: string }) => {
        updateMessage(
            { id, body },
            {
                onSuccess: () => {
                    setEditingId(null)
                    toast.success("Message updated")
                },
                onError: () => {
                    toast.error("Failed to update message")
                },
            }
        )
    }

    const handleReaction = (value: string) => {
        toggleReaction(
            {
                value,
                messageId: id,
            },
            {
                onError: () => {
                    toast.error("Failed to toggle reaction")
                },
            }
        )
    }

    if (isCompact) {
        return (
            <>
                <ConfirmDialog />
                <div
                    className={cn(
                        "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
                        isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
                        isRemovingMessage &&
                            "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
                    )}
                >
                    <div className="flex items-start gap-2">
                        <Hint label={formatFullTime(new Date(createdAt))}>
                            <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline">
                                {format(new Date(createdAt), "hh:mm")}
                            </button>
                        </Hint>
                        {isEditing ? (
                            <div className="w-full h-full">
                                <Editor
                                    onSubmit={handleUpdate}
                                    disabled={isUpdatingMessage}
                                    defaultValue={JSON.parse(body)}
                                    onCancel={() => setEditingId(null)}
                                    variant={"update"}
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col w-full ">
                                <Renderer value={body} />
                                <Thumbnail url={image} />
                                {updatedAt ? (
                                    <span className="text-xs text-muted-foreground">edited</span>
                                ) : null}
                                <Reactions data={reactions} onChange={handleReaction} />
                            </div>
                        )}
                    </div>
                    {!isEditing && (
                        <Toolbar
                            isAuthor={isAuthor}
                            isPending={isPending}
                            handleEdit={() => setEditingId(id)}
                            handleThread={() => onOpenMessage(id)}
                            handleDelete={handleDelete}
                            handleReaction={handleReaction}
                            hideThreadButton={hideThreadButton}
                        />
                    )}
                </div>
            </>
        )
    }

    return (
        <>
            <ConfirmDialog />
            <div
                className={cn(
                    "flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative",
                    isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]",
                    isRemovingMessage &&
                        "bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
                )}
            >
                <div className="flex items-start gap-2">
                    <button>
                        <Avatar>
                            <AvatarImage className="rounded-md" src={authorImage} alt={authorName} />
                            <AvatarFallback>{authorName.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </button>
                    {isEditing ? (
                        <div className="w-full h-full">
                            <Editor
                                onSubmit={handleUpdate}
                                disabled={isUpdatingMessage}
                                defaultValue={JSON.parse(body)}
                                onCancel={() => setEditingId(null)}
                                variant={"update"}
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col w-full overflow-hidden">
                            <div className="text-sm">
                                <button className="font-bold text-primary hover:underline">
                                    {authorName}
                                </button>
                                <span>&nbsp;&nbsp;</span>
                                <Hint label={formatFullTime(new Date(createdAt))}>
                                    <button className="text-xs text-muted-foreground hover:underline">
                                        {formatFullTime(new Date(createdAt))}
                                    </button>
                                </Hint>
                            </div>
                            <Renderer value={body} />
                            <Thumbnail url={image} />
                            {updatedAt ? <span className="text-xs text-muted-foreground">edited</span> : null}
                            <Reactions data={reactions} onChange={handleReaction} />
                        </div>
                    )}
                </div>
                {!isEditing && (
                    <Toolbar
                        isAuthor={isAuthor}
                        isPending={isPending}
                        handleEdit={() => setEditingId(id)}
                        handleThread={() => onOpenMessage(id)}
                        handleDelete={handleDelete}
                        handleReaction={handleReaction}
                        hideThreadButton={hideThreadButton}
                    />
                )}
            </div>
        </>
    )
}

export default Message

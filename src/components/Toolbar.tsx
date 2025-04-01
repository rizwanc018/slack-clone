import { Brush, MessageSquareText, Pencil, Smile, Trash } from "lucide-react"
import { Button } from "./ui/button"
import { Hint } from "./Hint"
import { EmojiPopover } from "./emoji_popover"

interface ToolbarProps {
    isAuthor: boolean
    isPending: boolean
    handleEdit: () => void
    handleThread: () => void
    handleDelete: () => void
    handleReaction: (value: string) => void
    hideThreadButton?: boolean
}

const Toolbar = ({
    isAuthor,
    isPending,
    handleEdit,
    handleThread,
    handleDelete,
    handleReaction,
    hideThreadButton,
}: ToolbarProps) => {
    return (
        <div className="absolute top-0 right-5 ">
            <div className="group-hover:opacity-100 opacity-0 transition-opacity border bg-white rounde-md shadow-sm">
                <EmojiPopover hint="Add reactions" onEmojiSelect={(emoji) => handleReaction(emoji.native)}>
                    <Button variant={"ghost"} disabled={isPending} size={"iconsSm"}>
                        <Smile className="size-4" />
                    </Button>
                </EmojiPopover>
                {!hideThreadButton && (
                    <Hint label="Replay in thread">
                        <Button
                            variant={"ghost"}
                            disabled={isPending}
                            size={"iconsSm"}
                            onClick={handleThread}
                        >
                            <MessageSquareText className="size-4" />
                        </Button>
                    </Hint>
                )}
                {isAuthor && (
                    <>
                        <Hint label="Edit">
                            <Button
                                variant={"ghost"}
                                disabled={isPending}
                                size={"iconsSm"}
                                onClick={handleEdit}
                            >
                                <Pencil className="size-4" />
                            </Button>
                        </Hint>
                        <Hint label="Delete">
                            <Button
                                variant={"ghost"}
                                disabled={isPending}
                                size={"iconsSm"}
                                onClick={handleDelete}
                            >
                                <Trash className="size-4" />
                            </Button>
                        </Hint>
                    </>
                )}
            </div>
        </div>
    )
}

export default Toolbar

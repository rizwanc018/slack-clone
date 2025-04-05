import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { ChevronRight } from "lucide-react"

interface ThreadBarProps {
    count?: number
    image?: string
    thereadTimestamp?: number
    name?: string
    onClick?: () => void
}
const ThreadBar = ({ count, image, name = "Member", thereadTimestamp, onClick }: ThreadBarProps) => {
    if (!count || !thereadTimestamp) {
        return null
    }

    return (
        <button
            onClick={onClick}
            className="p-1 rounded-md hover:bg-white border border-transparent flex items-center justify-start group/thread-bar transition max-w-[600px]"
        >
            <div className="flex items-center gap-2 overflow-hidden">
                <Avatar className="size-6 shrink-0">
                    <AvatarImage src={image} alt="thread" />
                    <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-xs text-sky-700 hover:underline font-bold truncate">
                    {count} {count > 1 ? "replies" : "reply"}
                </span>
                <span className="text-xs text-muted-foreground truncate group-hover/thread-bar:hidden block">
                    Last reply {formatDistanceToNow(thereadTimestamp, { addSuffix: true })}
                </span>
                <span className="text-xs text-muted-foreground truncate group-hover/thread-bar:hidden">
                    View thread
                </span>
            </div>
            <ChevronRight className="size-4 text-muted-foreground group-hover/thread-bar:opacity-100 transition shrink-0 ml-auto" />
        </button>
    )
}

export default ThreadBar

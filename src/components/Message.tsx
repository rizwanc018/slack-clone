import { format, isToday, isYesterday } from "date-fns"
import { Id, Doc } from "../../convex/_generated/dataModel"
import dynamic from "next/dynamic"
import { Hint } from "./Hint"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const Renderer = dynamic(() => import("./Renderer"), { ssr: false })

interface MessageProps {
    id: string
    memberId: string
    authorImage: string
    authorName: string
    reactions: Array<Omit<Doc<"reactions">, "memberId"> & { count: number; memberIds: Id<"members">[] }>
    body: Doc<"messages">["body"]
    image: string | null | undefined
    updatedAt: Doc<"messages">["updatedAt"]
    cratedAt: Doc<"messages">["_creationTime"]
    hideThreadButton?: boolean
    threadCount?: number
    threadImage?: string
    thereadTimestamp?: string
    isEditing: boolean
    setEditing: (id: Id<"messages"> | null) => void
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
    cratedAt,
    hideThreadButton,
    threadCount,
    threadImage,
    thereadTimestamp,
    isEditing,
    setEditing,
    isCompact,
    isAuthor,
}: MessageProps) => {
    if (isCompact) {
        return (
            <div className="flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative">
                <div className="flex items-start gap-2">
                    <Hint label={formatFullTime(new Date(cratedAt))}>
                        <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline">
                            {format(new Date(cratedAt), "hh:mm")}
                        </button>
                    </Hint>
                    <div className="flex flex-col w-full ">
                        <Renderer value={body} />
                        {updatedAt ? <span className="text-xs text-muted-foreground">edited</span> : null}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative">
            <div className="flex items-start gap-2">
                <button>
                    <Avatar>
                        <AvatarImage className="rounded-md" src={authorImage} alt={authorName} />
                        <AvatarFallback>{authorName.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </button>
                <div className="flex flex-col w-full overflow-hidden">
                    <div className="text-sm">
                        <button className="font-bold text-primary hover:underline">{authorName}</button>
                        <span>&nbsp;&nbsp;</span>
                        <Hint label={formatFullTime(new Date(cratedAt))}>
                            <button className="text-xs text-muted-foreground hover:underline">
                                {formatFullTime(new Date(cratedAt))}
                            </button>
                        </Hint>
                    </div>
                    <Renderer value={body} />
                    {updatedAt ? <span className="text-xs text-muted-foreground">edited</span> : null}
                </div>
            </div>
        </div>
    )
}

export default Message

// import { Doc } from "@convex-dev/auth/server"
import { format, isToday, isYesterday } from "date-fns"
import { Id, Doc } from "../../convex/_generated/dataModel"
import dynamic from "next/dynamic"
import { Hint } from "./Hint"

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
    return `${isToday(date) ? "Today" : isYesterday(data) ? "Yesterday" : format(date, "EEEE, MMMM")} ${format(
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
    return (
        <div className="flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative">
            <div className="flex items-start gap-2">
                <Hint label={formatFullTime(new Date(cratedAt))}>

                <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline">
                    {format(new Date(cratedAt), "hh:mm")}
                </button>
                </Hint>
                <Renderer value={body} />
            </div>
        </div>
    )
}

export default Message

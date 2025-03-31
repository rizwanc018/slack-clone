import { GetMessagesReturnType } from "@/features/messages/api/use_get_messages"
import { compareAsc, differenceInMinutes, format, isToday, isYesterday } from "date-fns"
import Message from "./Message"

interface MessageListProps {
    memeberName?: string
    memberImage?: string
    channelName?: string
    channelCreationTime?: number
    variant?: "chat" | "thread" | "conversation"
    data: GetMessagesReturnType | undefined
    loadMore: () => void
    isLoadingMore: boolean
    canLoadMore: boolean
}

const TIME_THRESHOLD = 5

const formatDateLabel = (dateKey: string) => {
    const date = new Date(dateKey)
    if (isToday(date)) {
        return "Today"
    }
    if (isYesterday(date)) {
        return "Yesterday"
    }
    return format(date, "EEEE, MMMM")
}

export const MessageList = ({
    memeberName,
    memberImage,
    channelName,
    channelCreationTime,
    variant = "channel",
    data,
    loadMore,
    isLoadingMore,
    canLoadMore,
}: MessageListProps) => {
    const groupedMessages = data?.reduce(
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

    return (
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
                                    cratedAt={message._creationTime}
                                    threadCount={message.threadCount}
                                    threadImage={message.threadImage}
                                    thereadTimestamp={message.thereadTimestamp}
                                    isEditing={false}
                                    setEditing={() => {}}
                                    isCompact={isCompact}
                                    isAuthor={false}
                                />
                            )
                        })}
                    </div>
                )
            })}
        </div>
    )
}

"use client"

import { useChannelId } from "@/hooks/use_channel_id"
import { AlertTriangle, Loader } from "lucide-react"
import Header from "./Header"
import { useGetChannel } from "@/features/channels/api/use_get_channel"
import ChatInput from "./ChatInput"
import { useGetMessages } from "@/features/messages/api/use_get_messages"
import { MessageList } from "@/components/Message_List"

const ChannelIdPage = () => {
    const channelId = useChannelId()

    const { data: channel, isLoading: isChannelLoading } = useGetChannel({ channelId })
    const { results, status, loadMore } = useGetMessages({ channelId })

    if (isChannelLoading || status === "LoadingFirstPage") {
        return (
            <div className="h-full flex-1 flex items-center justify-center">
                <Loader className="size-5 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (!channel) {
        return (
            <div className="h-full flex-1 flex items-center justify-center">
                <div className="flex flex-col gap-y-2 items-center justify-center">
                    <AlertTriangle className="size-5  text-muted-foreground" />
                    <span>Channel not found</span>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full">
            <Header title={channel.name} />
            <MessageList
                channelName={channel.name}
                channelCreationTime={channel._creationTime}
                data={results}
                loadMore={loadMore}
                isLoadingMore={status === "LoadingMore"}
                canLoadMore={status === "CanLoadMore"}
            />
            <ChatInput placeholder={`Message # ${channel.name}`} />
        </div>
    )
}

export default ChannelIdPage

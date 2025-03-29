"use client"

import { useChannelId } from "@/hooks/use_channel_id"
import { AlertTriangle, Loader } from "lucide-react"
import Header from "./Header"
import { useGetChannel } from "@/features/channels/api/use_get_channel"
import ChatInput from "./ChatInput"

const ChannelIdPage = () => {
    const channelId = useChannelId()

    const { data: channel, isLoading: isChannelLoading } = useGetChannel({ channelId })

    if (isChannelLoading) {
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
            <div className="flex-1" />
            <ChatInput placeholder={`Message # ${channel.name}`} />
        </div>
    )
}

export default ChannelIdPage

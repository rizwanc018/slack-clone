import { useMemberId } from "@/hooks/use_member_id"
import { Id } from "../../../../../../convex/_generated/dataModel"
import { useGetMember } from "@/features/members/api/use_get_memeber"
import { useGetMessages } from "@/features/messages/api/use_get_messages"
import { Loader } from "lucide-react"
import Header from "./Header"
import ChatInput from "./ChatInput"
import { MessageList } from "@/components/Message_List"
import { usePanel } from "@/hooks/use_pannel"

interface ConversationProps {
    conversationId: Id<"conversations">
}

const Conversation = ({ conversationId }: ConversationProps) => {
    const memeberId = useMemberId()
    const { data: member, isLoading: memberLoading } = useGetMember({ memberId: memeberId })
    const { results, status, loadMore } = useGetMessages({ conversationId })

    const { onOpenProfile } = usePanel()

    if (memberLoading || status === "LoadingFirstPage") {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader className="size-4 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full">
            <Header
                memeberName={member?.user.name}
                memberImage={member?.user.image}
                onClick={() => onOpenProfile(memeberId)}
            />
            <MessageList
                data={results}
                variant="conversation"
                memberImage={member?.user.image}
                memberName={member?.user.name}
                isLoadingMore={status === "LoadingMore"}
                loadMore={loadMore}
                canLoadMore={status === "CanLoadMore"}
            />
            <ChatInput placeholder={`Message ${member?.user.name}`} conversationId={conversationId} />
        </div>
    )
}

export default Conversation

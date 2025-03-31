import { usePaginatedQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Id } from "../../../../convex/_generated/dataModel"

const BATCH_SIZE = 20

interface UseGetMessagesProps {
    channelId?: Id<"channels">
    conversationId?: Id<"conversations">
    parentMessageId?: Id<"messages">
}

export type GetMessagesReturnType = (typeof api.messages.get._returnType)["page"]

export const useGetMessages = ({ channelId, conversationId, parentMessageId }: UseGetMessagesProps) => {
    const query = api.messages.get
    const { results, status, loadMore } = usePaginatedQuery(
        query,
        {
            channelId,
            conversationId,
            parentMessageId,
        },
        {
            initialNumItems: BATCH_SIZE,
            // getNextPageParam: (lastPage) => {
            //     const nextPage = lastPage + 1
            //     return nextPage
            // },
            // getPreviousPageParam: (lastPage) => {
            //     const previousPage = lastPage - 1
            //     return previousPage
            // },
            // getPageParam: (lastPage) => {
            //     const page = lastPage + 1
            //     return page
            // },
        }
    )

    return {
        results,
        status,
        loadMore: () => loadMore(BATCH_SIZE),
    }
}

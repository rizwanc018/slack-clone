import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Id } from "../../../../convex/_generated/dataModel"

interface useCurrentMemberProps {
    memberId: Id<"members">
}

export const useGetMember = ({ memberId }: useCurrentMemberProps) => {
    const data = useQuery(api.members.getById, { memberId })
    const isLoading = data === undefined
    return { data, isLoading }
}

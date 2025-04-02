import { useParentMessageId } from "@/features/messages/store/use_parent_message_id"
import { useProfileMemberId } from "@/features/members/store/use_profile_member_id"

export const usePanel = () => {
    const [parentMessageId, setParentMessageId] = useParentMessageId()
    const [profileMemberId, setProfileMemberId] = useProfileMemberId()

    const onOpenProfile = (memberId: string) => {
        setProfileMemberId(memberId)
        setParentMessageId(null)
    }

    const onOpenMessage = (messageId: string) => {
        setParentMessageId(messageId)
        setProfileMemberId(null)
    }

    const onClose = () => {
        setParentMessageId(null)
        setProfileMemberId(null)
    }

    return {
        parentMessageId,
        profileMemberId,
        onOpenProfile,
        onOpenMessage,
        onClose,
    }
}

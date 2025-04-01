import { useWorkspaceId } from "@/hooks/use_workspace_id"
import { Doc, Id } from "../../convex/_generated/dataModel"
import { useCurrentMember } from "@/features/members/api/use_current_memeber"
import { cn } from "@/lib/utils"
import { EmojiPopover } from "./emoji_popover"
import { MdOutlineAddReaction } from "react-icons/md"

interface ReactionsProps {
    data: Array<Omit<Doc<"reactions">, "memberId"> & { count: number; memberIds: Id<"members">[] }>
    onChange: (value: string) => void
}

const Reactions = ({ data, onChange }: ReactionsProps) => {
    const workspaceId = useWorkspaceId()
    const { data: currentMember } = useCurrentMember({ workspaceId })
    const currentMemberId = currentMember?._id

    if (data.length === 0 || !currentMemberId) return null
    console.log("🚀 ~ Reactions ~ data🚀", data)

    return (
        <div className="flex gap-x-1">
            {data.map((reaction, i) => (
                <button
                    onClick={() => onChange(reaction.value)}
                    key={i}
                    className={cn(
                        "h-6 px-2 rounded-full bg-slate-200/70 border border-transparent text-slate-800 gap-x-1",
                        reaction.memberId.includes(currentMemberId) && "bg-blue-100/70 border-blue-500  "
                    )}
                >
                    {reaction.value}
                    <span
                        className={cn(
                            "text-xs font-semibold text-muted-foreground",
                            reaction.memberId.includes(currentMemberId) && " text-blue-500 "
                        )}
                    >
                        {reaction.count}
                    </span>
                </button>
            ))}
            <EmojiPopover hint="Add reaction" onEmojiSelect={(emoji) => onChange(emoji.native)}>
                <button className="h-6 px-3 rounded-full bg-slate-200/70 border border-transparent hover:border-slate-500 text-slate-800 flex items-center gap-x-1">
                    <MdOutlineAddReaction className="size-4" />
                </button>
            </EmojiPopover>
        </div>
    )
}

export default Reactions

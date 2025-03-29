import { Button } from "@/components/ui/button"
import { FaChevronDown } from "react-icons/fa"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"

import { Trash } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useConfirm } from "@/hooks/use_confirm"
import { useUpdateChannel } from "@/features/channels/api/use_update_channel"
import { useRemoveChannel } from "@/features/channels/api/use_remove_channel"
import { useChannelId } from "@/hooks/use_channel_id"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useWorkspaceId } from "@/hooks/use_workspace_id"
import { useCurrentMember } from "@/features/members/api/use_current_memeber"

interface HeaderProps {
    title: string
}

const Header = ({ title }: HeaderProps) => {
    const router = useRouter()

    const [value, setValue] = useState(title)
    const [editOpen, setEditOpen] = useState(false)

    const channelId = useChannelId()
    const workspaceId = useWorkspaceId()
    const { data: member } = useCurrentMember({ workspaceId })
    const { mutate: updateChannel, isPending: isUpdatingChannel } = useUpdateChannel()
    const { mutate: removeChannel, isPending: isRemovingChannel } = useRemoveChannel()
    const isAdmin = member?.role === "admin"

    const [ConfirmDialog, confirm] = useConfirm(
        "Remove Channel",
        "Are you sure you want to remove this channel?"
    )

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s+/g, "_").toLowerCase()
        setValue(value)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        updateChannel(
            { channelId, name: value },
            {
                onSuccess: () => {
                    setEditOpen(false)
                    toast.success("Channel name updated")
                },
                onError: () => toast.error("Failed to update channel name"),
            }
        )
    }

    const handleRemove = async () => {
        const ok = await confirm()
        if (!ok) {
            return
        }
        removeChannel(
            { channelId },
            {
                onSuccess: () => {
                    toast.success("Channel removed")
                    router.replace(`/workspace/${workspaceId}`)
                },
                onError: () => toast.error("Failed to remove channel"),
            }
        )
    }

    return (
        <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
            <ConfirmDialog />
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant={"ghost"}
                        size={"sm"}
                        className="text-lg font-semibold px-2 overflow-hidden w-auto"
                    >
                        <span className="truncate"># {title}</span>
                        <FaChevronDown className="size-2.5 ml-2" />
                    </Button>
                </DialogTrigger>

                <DialogContent className="p-0 bg-gray-50 overflow-hidden">
                    <DialogHeader className="p-4 border-b bg-white">
                        <DialogTitle># {title}</DialogTitle>
                    </DialogHeader>

                    <div className="px-4 pb-4 flex flex-col gap-y-2">
                        <Dialog open={editOpen} onOpenChange={setEditOpen}>
                            <DialogTrigger asChild>
                                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer  hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold">Channel name</p>
                                        {isAdmin && (
                                            <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                                                Edit
                                            </p>
                                        )}
                                    </div>
                                    <p className="text-sm"># {title}</p>
                                </div>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Edit workspace name</DialogTitle>
                                </DialogHeader>
                                <form className="space-y-4" onSubmit={handleSubmit}>
                                    <Input
                                        value={value}
                                        onChange={handleChange}
                                        required
                                        disabled={isUpdatingChannel}
                                        autoFocus
                                        minLength={3}
                                        maxLength={20}
                                        placeholder="Workspace name"
                                    />
                                    <DialogFooter>
                                        <DialogClose>
                                            <Button
                                                variant="outline"
                                                disabled={isUpdatingChannel}
                                                onClick={() => setEditOpen(false)}
                                            >
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <Button disabled={isUpdatingChannel}>Save</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                        {isAdmin && (
                            <button
                                disabled={isRemovingChannel}
                                onClick={() => {
                                    handleRemove()
                                }}
                                className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg  cursor-pointer hover:bg-gray-50 text-rose-600"
                            >
                                <Trash className="size-4" />
                                <p className="text-sm font-semibold">Delete channel</p>
                            </button>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Header

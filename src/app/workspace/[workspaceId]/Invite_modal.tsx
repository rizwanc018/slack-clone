import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useNewJoinCode } from "@/features/workspaces/api/use_new_join_code"
import { useConfirm } from "@/hooks/use_confirm"
import { useWorkspaceId } from "@/hooks/use_workspace_id"
import { Copy, RefreshCcw } from "lucide-react"
import { toast } from "sonner"

interface InviteModalProps {
    open: boolean
    setOpen: (open: boolean) => void
    name: string
    joinCode: string
}

export const InviteModal = ({ open, setOpen, name, joinCode }: InviteModalProps) => {
    const workspaceId = useWorkspaceId()
    const { mutate, isPending } = useNewJoinCode()
    const [ConfirmDialog, confirm] = useConfirm(
        "Change Invite Code",
        "Are you sure you want to change the invite code?"
    )

    const handleCopy = () => {
        const inviteLInk = `{window.location.origin}/join/${workspaceId}`
        navigator.clipboard.writeText(inviteLInk).then(() => {
            toast.success("Link copied to clipboard")
        })
    }

    const handleNewCode = async () => {
        const ok = await confirm()

        if (!ok) {
            return
        }
        mutate(
            { workspaceId },
            {
                onSuccess: () => {
                    toast.success("New code generated")
                },
                onError: () => {
                    toast.error("Failed to generate new code")
                },
            }
        )
    }

    return (
        <>
            <ConfirmDialog />
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Invite people to {name}</DialogTitle>
                    </DialogHeader>
                    <DialogDescription>Use code below to invite people to your workspace</DialogDescription>
                    <div className="flex flex-col gap-y-4  items-center justify-center py-10">
                        <p className="text-4xl font-bold tracking-widest uppercase">{joinCode}</p>
                        <Button variant={"ghost"} onClick={handleCopy}>
                            Copy link
                            <Copy className="ml-2 text-xl" />
                        </Button>
                    </div>
                    <div className="flex items-center justify-between w-full">
                        <Button
                            variant={"outline"}
                            onClick={() => {
                                handleNewCode()
                            }}
                            disabled={isPending}
                        >
                            New Code
                            <RefreshCcw className="ml-2 text-xl" />
                        </Button>
                        <DialogClose>
                            <Button>Close</Button>
                        </DialogClose>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useCreateWorkspaceModal } from "../store/use_create_workspace_modal"

export const CreateWorkspaceModal = () => {
    const [open, setOpen] = useCreateWorkspaceModal()

    const handleClose = () => {
        setOpen(false)
    }
    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a workspace</DialogTitle>
                    <DialogDescription>
                        Workspaces are where you can organize your projects and collaborate with your team.
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

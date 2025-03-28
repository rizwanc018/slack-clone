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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCreateWorkspaces } from "../api/use_create_workspace"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export const CreateWorkspaceModal = () => {
    const [open, setOpen] = useCreateWorkspaceModal()
    const [name, setName] = useState("")
    const { mutate, isPending } = useCreateWorkspaces()

    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        mutate(
            {
                name,
            },
            {
                onSuccess: (id) => {
                    toast.success("Workspace created successfully")
                    router.push(`/workspace/${id}`)
                    handleClose()
                },
            }
        )
    }

    const handleClose = () => {
        setOpen(false)
        setName("")
    }
    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a workspace</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <Input
                        type="text"
                        value={name}
                        placeholder="Workspace name"
                        required
                        autoFocus
                        minLength={3}
                        disabled={isPending}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <div className=" flex justify-end">
                        <Button type="submit" disabled={false}>
                            Create
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

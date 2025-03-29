import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { useCreateChannelModal } from "../store/use_create_channel_modal"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useCreateChannel } from "../api/use_create_channel"
import { toast } from "sonner"
import { useWorkspaceId } from "@/hooks/use_workspace_id"

export const CreateChannelModal = () => {
    const router = useRouter()
    const [open, setOpen] = useCreateChannelModal()
    const { mutate, isPending } = useCreateChannel()
    const workspaceId = useWorkspaceId()

    const [name, setName] = useState("")


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        mutate(
            {
                name,
                workspaceId,
            },
            {
                onSuccess: (id) => {
                    toast.success("Channel created successfully")
                    router.push(`/workspace/${workspaceId}/channel/${id}`)
                    handleClose()
                },
                onError: () => {
                    toast.error("Failed to create channel")
                },
            }
        )
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s+/g, "_").toLowerCase()
        setName(value)
    }

    const handleClose = () => {
        setOpen(false)
        setName("")
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a channel</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <Input
                        type="text"
                        value={name}
                        placeholder="Channel name"
                        required
                        autoFocus
                        minLength={3}
                        disabled={false}
                        onChange={(e) => handleChange(e)}
                    />
                    <div className=" flex justify-end">
                        <Button type="submit" disabled={false}>
                            Create
                        </Button>
                    </div>
                </form>{" "}
            </DialogContent>
        </Dialog>
    )
}

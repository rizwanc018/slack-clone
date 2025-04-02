import { Button } from "@/components/ui/button"
import { Id } from "../../../../convex/_generated/dataModel"
import { useGetMember } from "../api/use_get_memeber"
import { AlertTriangle, ChevronDown, Loader, MailIcon, XIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useUpdateMember } from "../api/use_update_member"
import { useRemoveMember } from "../api/use_remove_member"
import { useCurrentMember } from "../api/use_current_memeber"
import { useWorkspaceId } from "@/hooks/use_workspace_id"
import { toast } from "sonner"
import { useConfirm } from "@/hooks/use_confirm"
import { useRouter } from "next/navigation"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ProfileProps {
    memberId: Id<"members">
    onClose: () => void
}

const Profile = ({ memberId, onClose }: ProfileProps) => {
    const workspaceId = useWorkspaceId()
    const router = useRouter()

    const { data: currentMember, isLoading: loadingCurrentMember } = useCurrentMember({ workspaceId })
    const { data: member, isLoading: loadingMember } = useGetMember({ memberId })

    const { mutate: updateMember, isPending: isUpdatingMember } = useUpdateMember()
    const { mutate: removeMember, isPending: isRemovingMember } = useRemoveMember()

    const [LeaveDialog, leave] = useConfirm(
        "Leave Workspace",
        "Are you sure you want to leave this workspace?"
    )

    const [RemoveDialog, remove] = useConfirm("Remove Member", "Are you sure you want to remove this member?")

    const [UpdateDialog, update] = useConfirm(
        "Update Role",
        "Are you sure you want to update this member's role?"
    )

    const onRemove = async () => {
        const ok = await remove()
        if (!ok) {
            return
        }
        removeMember(
            { memberId },
            {
                onSuccess: () => {
                    router.replace("/")
                    toast.success("Member removed")
                    onClose()
                },
                onError: () => toast.error("Failed to remove member"),
            }
        )
    }

    const onLeave = async () => {
        const ok = await leave()
        if (!ok) {
            return
        }
        removeMember(
            { memberId },
            {
                onSuccess: () => {
                    router.replace("/")
                    toast.success("You left the workspace")
                    onClose()
                },
                onError: () => toast.error("Failed to leave the workspace"),
            }
        )
    }

    const onUpdateRole = async (role: "admin" | "member") => {
        const ok = await update()
        if (!ok) {
            return
        }
        updateMember(
            { memberId, role },
            {
                onSuccess: () => {
                    toast.success("Member role updated")
                },
                onError: () => toast.error("Failed to update member role"),
            }
        )
    }

    if (loadingMember || loadingCurrentMember) {
        return (
            <div className="flex flex-col h-full">
                <div className="flex justify-between items-center px-4 h-[49px]  border-b">
                    <p className="text-lg font-bold">Profile</p>
                    <Button onClick={onClose} size={"iconsSm"} variant={"ghost"}>
                        <XIcon className="size-5 stroke-[1.5]" />
                    </Button>
                </div>
                <div className="flex h-full items-center justify-center">
                    <Loader className="size-5 animate-spin text-muted-foreground" />
                </div>
            </div>
        )
    }

    if (!member) {
        return (
            <div className="flex flex-col h-full">
                <div className="flex justify-between items-center px-4 h-[49px]  border-b">
                    <p className="text-lg font-bold">Profile</p>
                    <Button onClick={onClose} size={"iconsSm"} variant={"ghost"}>
                        <XIcon className="size-5 stroke-[1.5]" />
                    </Button>
                </div>
                <div className="flex flex-col gap-y-2 h-full items-center justify-center">
                    <AlertTriangle className="size-5 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Profile not found</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <LeaveDialog />
            <RemoveDialog />
            <UpdateDialog />
            <div className="flex flex-col h-full">
                <div className="flex justify-between items-center px-4 h-[49px]  border-b">
                    <p className="text-lg font-bold">Profile</p>
                    <Button onClick={onClose} size={"iconsSm"} variant={"ghost"}>
                        <XIcon className="size-5 stroke-[1.5]" />
                    </Button>
                </div>
                <div className="flex flex-col p-4 items-center justify-center">
                    <Avatar className="max-w-[256] max-h-[256] size-full">
                        <AvatarImage src={member.user.image} alt={member.user.name} />
                        <AvatarFallback className="aspect-square text-6xl">
                            {(member?.user?.name ?? "M").charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </div>
                <div className="flex flex-col p-4">
                    <p className="text-xl font-bold">{member.user.name}</p>
                </div>
                {currentMember?.role === "admin" && currentMember._id !== member._id ? (
                    <div className="flex items-center gap-2 mt-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant={"outline"} className="w-full capitalize">
                                    {isUpdatingMember ? (
                                        <Loader className="size-4 animate-spin" />
                                    ) : (
                                        <>
                                            {member.role} <ChevronDown className="size-4 ml-2" />
                                        </>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-full">
                                <DropdownMenuRadioGroup
                                    value={member.role}
                                    onValueChange={(role) => onUpdateRole(role as "admin" | "member")}
                                >
                                    <DropdownMenuRadioItem value="admin">Admin</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="member">Member</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                            onClick={onRemove}
                            variant={"outline"}
                            className="w-full capitalize"
                            disabled={isRemovingMember}
                        >
                            Remove
                        </Button>
                    </div>
                ) : currentMember?._id === member._id && currentMember.role !== "admin" ? (
                    <div className="mt-4">
                        <Button onClick={onLeave} variant={"outline"} className="w-full capitalize">
                            Leave
                        </Button>
                    </div>
                ) : null}
                <Separator />
                <div className="flex flex-col p-4">
                    <p className="text-sm font-bold mb-4">Contact information</p>
                    <div className="flex items-center gap-2">
                        <div>
                            <MailIcon className="size-4" />
                        </div>
                        <div className="flex flex-col">
                            <p className="text-sm">Email</p>
                            <Link
                                href={`mailto:${member.user.email}`}
                                className="text-xs text-muted-foreground"
                            >
                                {member.user.email}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile

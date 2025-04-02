import { Button } from "@/components/ui/button"
import { Id } from "../../../../convex/_generated/dataModel"
import { useGetMember } from "../api/use_get_memeber"
import { AlertTriangle, Loader, MailIcon, XIcon } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

interface ProfileProps {
    memberId: Id<"members">
    onClose: () => void
}

const Profile = ({ memberId, onClose }: ProfileProps) => {
    const { data: member, isLoading: loadingMember } = useGetMember({ memberId })

    if (loadingMember) {
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
            <Separator />
            <div className="flex flex-col p-4">
                <p className="text-sm font-bold mb-4">Contact information</p>
                <div className="flex items-center gap-2">
                    <div>
                        <MailIcon className="size-4" />
                    </div>
                    <div className="flex flex-col">
                        <p className="text-sm">Email</p>
                        <Link href={`mailto:${member.user.email}`} className="text-xs text-muted-foreground">
                            {member.user.email}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile

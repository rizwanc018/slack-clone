import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Id } from "../../../../convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import Link from "next/link"

const userItemVariants = cva(
    "flex items-center gap-1.5 justify-start font-normal h-7 px-4 text-sm overflow-hidden ",
    {
        variants: {
            variant: {
                default: "text-[#f9edffcc]",
                active: "bg-white/90 hover:bg-white/90 text-[#481349]",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

interface UserItemProps {
    id: Id<"members">
    label?: string
    image?: string
    variant?: VariantProps<typeof userItemVariants>["variant"]
}

export const UserItem = ({ id, label = "Member", image, variant }: UserItemProps) => {
    return (
        <Button variant={"transparent"} className={cn(userItemVariants({ variant }))} size={"sm"} asChild>
            <Link href={`/workspace/${id}/members/${id}`}>
                <Avatar className=" size-5 rounded-md mr-1">
                    <AvatarImage className="rounded-md" src={image} />
                    <AvatarFallback className="rounded-md bg-sky-500 text-white text-xs">
                        {label.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <span className="text-sm truncate">{label}</span>
            </Link>
        </Button>
    )
}

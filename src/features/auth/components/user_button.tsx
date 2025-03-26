"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCurrentUser } from "../api/use_current_user"
import { Loader, LogOut } from "lucide-react"
import { useAction } from "convex/react"
import { useAuthActions } from "@convex-dev/auth/react"

export const UserButton = () => {
    const { signOut } = useAuthActions()
    const { data, isLoading } = useCurrentUser()

    if (isLoading) {
        return <Loader className="size-4 animate-spin text-muted-foreground" />
    }

    if (!data) {
        return null
    }

    const { name, image, email } = data
    const avatarFallback = name ? name[0] : email[0]

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild className="outline-none relative">
                <Avatar className="size-10 hover:opacity-75 transition">
                    <AvatarImage src={image} alt={name} />
                    <AvatarFallback className="bg-sky-500 text-white">{avatarFallback}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-60" side="right">
                <DropdownMenuItem onClick={() => signOut()} className="h-10">
                    <LogOut className="size-4 mr-2" />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

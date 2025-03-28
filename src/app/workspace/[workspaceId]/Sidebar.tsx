import { UserButton } from "@/features/auth/components/user_button"
import React from "react"
import WorkspaceSwitcher from "./WorkspaceSwitcher"
import SidebarButton from "./SidebarButton"
import { Bell, Home, MessageSquare, MoreHorizontal } from "lucide-react"
import { usePathname } from "next/navigation"

const Sidebar = () => {
    const pathname = usePathname()
    return (
        <aside className="w-[70px] h-full bg-[#481349] flex flex-col gap-y-4 items-center pt-[9px] pb-4">
            <WorkspaceSwitcher />
            <SidebarButton Icon={Home} label="Home" isActive={pathname.includes("/workspace")} />
            <SidebarButton Icon={MessageSquare} label="DMs" />
            <SidebarButton Icon={Bell} label="Activity" />
            <SidebarButton Icon={MoreHorizontal} label="More" />

            <div className="flex flex-col gap-y-1 items-center justify-center mt-auto">
                <UserButton />
            </div>
        </aside>
    )
}

export default Sidebar

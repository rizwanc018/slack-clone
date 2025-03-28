import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Doc } from "../../../../convex/_generated/dataModel"
import { ChevronDown, ListFilter, SquarePen } from "lucide-react"
import { Hint } from "@/components/Hint"
import { PreferencesModal } from "../Preferences_modal"
import { useState } from "react"
import { InviteModal } from "./Invite_modal"

interface WorkspaceHeaderProps {
    workspace: Doc<"workspaces">
    isAdmin?: boolean
}

const WorkspaceHeader = ({ workspace, isAdmin }: WorkspaceHeaderProps) => {
    const [preferencesOpen, setPreferencesOpen] = useState(false)
    const [inviteOpen, setInviteOpen] = useState(false)

    return (
        <>
            <InviteModal
                open={inviteOpen}
                setOpen={setInviteOpen}
                name={workspace.name}
                joinCode={workspace.joinCode}
            />
            <PreferencesModal
                open={preferencesOpen}
                setOpen={setPreferencesOpen}
                initialValue={workspace.name}
            />
            <div className="flex items-center justify-between px-4 h-[49px] gap-0.5">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant={"transparent"}
                            className="font-semibold text-lg w-auto p-1.5 overflow-hidden"
                            size={"sm"}
                        >
                            <span className="truncate">{workspace.name}</span>
                            <ChevronDown className="size-4 ml-1 shrink-0" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem className="cursor-pointer capitalize">
                            <div className="size-9 relative overflow-hidden bg-[#616061] text-white font-semibold text-xl rounded-md flex items-center justify-center ">
                                {workspace.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col items-start">
                                <p className="font-bold">{workspace.name}</p>
                                <p className="text-xs text-muted-foreground">Active workspace</p>
                            </div>
                        </DropdownMenuItem>
                        {isAdmin && (
                            <>
                                <DropdownMenuItem
                                    className="cursor-pointer py-2"
                                    onClick={() => {
                                        setInviteOpen(true)
                                    }}
                                >
                                    Invite people to {workspace.name}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="cursor-pointer py-2"
                                    onClick={() => {
                                        setPreferencesOpen(true)
                                    }}
                                >
                                    Preferences
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex items-center gap-0.5">
                    <Hint label="Filter conversations" side={"bottom"}>
                        <Button variant={"transparent"} size={"iconsSm"}>
                            <ListFilter className="size-4 text-white" />
                        </Button>
                    </Hint>
                    <Hint label="New message" side={"bottom"}>
                        <Button variant={"transparent"} size={"iconsSm"}>
                            <SquarePen className="size-4 text-white" />
                        </Button>
                    </Hint>
                </div>
            </div>
        </>
    )
}

export default WorkspaceHeader

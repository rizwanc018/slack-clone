import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useGetWorkspace } from "@/features/workspaces/api/use_get_workspace"
import { useGetWorkspaces } from "@/features/workspaces/api/use_get_workspaces"
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use_create_workspace_modal"
import { useWorkspaceId } from "@/hooks/use_workspace_id"
import { Loader, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

const WorkspaceSwitcher = () => {
    const router = useRouter()
    const workspaceId = useWorkspaceId()
    const [, setOpen] = useCreateWorkspaceModal()

    const { data: workspace, isLoading: isLoadingWorkspace } = useGetWorkspace({ id: workspaceId })
    const { data: workspaces, isLoading: isLoadingWorkspaces } = useGetWorkspaces()

    const filteredWorkspaces = workspaces?.filter((w) => w._id !== workspaceId)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="size-9 relative overflow-hidden bg-[#ababab] hover:bg-[#ababab]/80 text-slate-800 font-semibold text-xl">
                    {isLoadingWorkspace ? (
                        <Loader className="size-5 animate-spin shrink-0" />
                    ) : (
                        workspace?.name.charAt(0).toUpperCase()
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="start" className="w-64">
                <DropdownMenuItem className="cursor-pointer gap-0 flex-col justify-start items-start capitalize">
                    {workspace?.name}
                    <span className="text-xs text-muted-foreground">Active workspace</span>
                </DropdownMenuItem>
                {filteredWorkspaces?.map((w) => (
                    <DropdownMenuItem
                        key={w._id}
                        className="cursor-pointer gap-0  justify-start items-center capitalize overflow-hidden"
                        onClick={() => router.push(`/workspace/${w._id}`)}
                    >
                        <div className="size-9 relative overflow-hidden bg-[#616061] text-slate-800 font-semibold text-lg rounded-md flex items-center justify-center mr-2 ">
                            {w.name.charAt(0).toUpperCase()}
                        </div>
                        <p className="truncate">{w.name}</p>
                    </DropdownMenuItem>
                ))}
                <DropdownMenuItem className="cursor-pointer" onClick={() => setOpen(true)}>
                    <div className="size-9 relative overflow-hidden bg-[#f2f2f2] text-slate-800 font-semibold text-lg rounded-md flex items-center justify-center mr-2 ">
                        <Plus className="size-5 mr-2" />
                    </div>
                    Create new workspace
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default WorkspaceSwitcher

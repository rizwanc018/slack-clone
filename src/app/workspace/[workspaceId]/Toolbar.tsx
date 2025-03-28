import { Button } from "@/components/ui/button"
import { useGetWorkspace } from "@/features/workspaces/api/use_get_workspace"
import { useWorkspaceId } from "@/hooks/use_workspace_id"
import { Info, Search } from "lucide-react"
import React from "react"

const Toolbar = () => {
    const workspaceId = useWorkspaceId()
    const { data } = useGetWorkspace({ id: workspaceId })

    return (
        <nav className=" bg-[#481349] flex items-center justify-between h-10 p-1.5">
            <div className="flex-1" />
            <div className="min-w-[280px] max-w-[642px] grow-[2] shrink">
                <Button size={"sm"} className="bg-accent/25 hover:bg-accent-25 w-full justify-start h-7 px-2">
                    <Search className="size-4 mr-2 text-white" />
                    <span className="text-white text-xs">Search {data?.name}</span>
                </Button>
            </div>
            <div className=" ml-auto flex flex-1 items-center justify-end">
                <Button variant={"transparent"} size={"iconsSm"}>
                    <Info className="text-white size-5" />
                </Button>
            </div>
        </nav>
    )
}

export default Toolbar

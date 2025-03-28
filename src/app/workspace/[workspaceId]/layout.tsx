"use client"

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

import Sidebar from "./Sidebar"
import Toolbar from "./Toolbar"
import WorkspaceSidebar from "./Workspace_Sidebar"

interface WorkspaceIdLayoutProps {
    children: React.ReactNode
}

const WorkspaceIdLayout = ({ children }: WorkspaceIdLayoutProps) => {
    return (
        <div className="h-full ">
            <Toolbar />
            <div className="flex h-[calc(100vh-40px)] ">
                <Sidebar />
                <ResizablePanelGroup direction="horizontal" autoSaveId={"ri-workspace-layout"}>
                    <ResizablePanel defaultSize={20} minSize={11} className="bg-[#5e2c5f]">
                        <WorkspaceSidebar />
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel minSize={20}>{children}</ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </div>
    )
}

export default WorkspaceIdLayout

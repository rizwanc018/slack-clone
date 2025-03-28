import { Hint } from "@/components/Hint"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { FaCaretDown } from "react-icons/fa"
import { useToggle } from "@reactuses/core"
import { cn } from "@/lib/utils"

interface WorkspaceSectionProps {
    label: string
    hint: string
    onNew: () => void
    children: React.ReactNode
}

export const WorkspaceSection = ({ label, hint, onNew, children }: WorkspaceSectionProps) => {
    const [on, toggle] = useToggle(true)

    return (
        <div className="flex flex-col mt-3 px-2">
            <div className="flex items-center px-3.5 group ">
                <Button
                    variant={"transparent"}
                    className="p-0.5 text-sm text-[#f9edffcc] shrink-0 size-6"
                    onClick={toggle}
                >
                    <FaCaretDown className={cn("size-4  transition-transform" , { "-rotate-90": on })} />
                </Button>
                <Button
                    variant="transparent"
                    size="sm"
                    className="group px-1.5 text-sm text-[#f9edffcc] h-[28px] justify-start overflow-hidden"
                >
                    <span className="truncate">{label}</span>
                </Button>
                {onNew && (
                    <Hint label={hint} side={"top"} align="center">
                        <Button
                            variant={"transparent"}
                            size={"iconsSm"}
                            onClick={onNew}
                            className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto p-0.5 text-sm text-[#f9edffcc] shrink-0 size-6 "
                        >
                            <Plus className="size-5 ms-auto" />{" "}
                        </Button>
                    </Hint>
                )}
            </div>
            {on && children}
        </div>
    )
}

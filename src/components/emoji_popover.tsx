import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"

interface EmojiPopoverProps {
    children: React.ReactNode
    hint?: string
    onEmojiSelect: (emoji: any) => void
}

export const EmojiPopover = ({ children, hint, onEmojiSelect }: EmojiPopoverProps) => {
    const [popoverOpen, setPopoverOpen] = useState(false)
    const [tooltipOpen, setTooltipOpen] = useState(false)

    const onSelect = (emoji: any) => {
        setPopoverOpen(false)
        onEmojiSelect(emoji)

        setTimeout(() => {
            setTooltipOpen(false)
        }, 100)
    }

    return (
        <TooltipProvider>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen} delayDuration={50}>
                    <PopoverTrigger asChild>
                        <TooltipTrigger asChild>{children}</TooltipTrigger>
                    </PopoverTrigger>
                    <TooltipContent className="bg-black text-white border border-white/5">
                        <p className="font-medium text-xs ">{hint}</p>
                    </TooltipContent>
                </Tooltip>
                <PopoverContent className="p-0 border-0 shadow">
                    <Picker data={data} onEmojiSelect={onEmojiSelect} />
                </PopoverContent>
            </Popover>
        </TooltipProvider>
    )
}

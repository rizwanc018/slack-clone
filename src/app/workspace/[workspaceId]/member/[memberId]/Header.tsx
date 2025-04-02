import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FaChevronDown } from "react-icons/fa"

interface HeaderProps {
    memeberName?: string
    memberImage?: string
    onClick?: () => void
}

const Header = ({ memeberName, memberImage, onClick }: HeaderProps) => {
    const avatarFallback = memeberName?.charAt(0).toUpperCase()

    return (
        <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
            <Button
                variant={"ghost"}
                size={"sm"}
                className="text-lg font-semibold px-2 overflow-hidden w-auto"
                onClick={onClick}
            >
                <Avatar className="size-6 mr-2">
                    <AvatarImage src={memberImage} />
                    <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>
                <span className="truncate"># {memeberName}</span>
                <FaChevronDown className="size-2.5 ml-2" />
            </Button>
        </div>
    )
}

export default Header

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ConversationHeroProps {
    name?: string
    image?: string
}

const ConversationHero = ({ name, image }: ConversationHeroProps) => {
    return (
        <div className="mt-[88px] mb-4 mx-5">
            <div className="flex items-center gap-x-1 mb-2">
                <Avatar>
                    <AvatarImage src={image} />
                    <AvatarFallback>{name?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <p className="text-2xl font-bold "># {name}</p>
            </div>
            <p className="font-normal text-slate-800 mb-4"> This conversation is between you and {name}</p>
        </div>
    )
}

export default ConversationHero

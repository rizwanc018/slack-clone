import { format } from "date-fns"

interface ChannelHeroProps {
    channelName: string
    channelCreationTime: number
}

const ChannelHero = ({ channelName, channelCreationTime }: ChannelHeroProps) => {
    return (
        <div className="mt-[88px] mb-4 mx-5">
            <p className="text-2xl font-bold flex items-center mb-2"># {channelName}</p>
            <p className="font-normal text-slate-800 mb-4">
                This channel was created on {format(channelCreationTime, "MMMM do, yyyy")}, This is beginning
                of <strong>{channelName}</strong>
            </p>
        </div>
    )
}

export default ChannelHero

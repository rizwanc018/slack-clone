/* eslint-disable @next/next/no-img-element */
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"

interface ThumbnailProps {
    url: string | null | undefined
}
const Thumbnail = ({ url }: ThumbnailProps) => {
    if (!url) return null

    return (
        <Dialog>
            <DialogTrigger>
                <div className="relative overflow-hidden w-fit max-w-[360px] border rounded-lg my-2 cursor-zoom-in">
                    <img src={url} alt="Thumbnail" className="object-cover rounded-md" />
                </div>
            </DialogTrigger>
            <DialogContent className="max-w-[800px] border-none bg-transparent p-0 shadow-none">
                <img src={url} alt="Thumbnail" className="object-cover rounded-md" />
            </DialogContent>
        </Dialog>
    )
}

export default Thumbnail

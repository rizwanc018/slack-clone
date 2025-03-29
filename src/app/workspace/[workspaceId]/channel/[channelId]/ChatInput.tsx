import dynamic from "next/dynamic"
import Quill from "quill"
import { useRef } from "react"

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false })

interface ChatInputProps {
    placeholder?: string
}

const ChatInput = ({ placeholder }: ChatInputProps) => {
    const editorRef = useRef<Quill | null>(null)

    const handleSubmit = async ({ body, image }: { body: string; image: File | null }) => {
        console.log({ body, image })
    }

    return (
        <div className="px-5 w-full">
            <Editor
                variant="create"
                placeholder={placeholder}
                onSubmit={handleSubmit}
                disabled={false}
                innerRef={editorRef}
            />
        </div>
    )
}

export default ChatInput

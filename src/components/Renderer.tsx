import Quill from "quill"
import { useEffect, useRef, useState } from "react"

interface RendererProps {
    value: string
}

const Renderer = ({ value }: RendererProps) => {
    const [isEmpty, setIsEmpty] = useState(false)
    const rendererRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!rendererRef.current) return
        const container = rendererRef.current
        const quill = new Quill(document.createElement("div"), {
            theme: "snow",
        })
        quill.enable(false)
        // const contents = value ? JSON.parse(value) : ""
        const contents = JSON.parse(value)


        quill.setContents(contents)
        const isEmpty =
            quill
                .getText()
                .replace(/<(.|\n)*?>/gm, "")
                .trim().length === 0
        setIsEmpty(isEmpty)
        container.innerHTML = quill.root.innerHTML

        return () => {
            quill.off("text-change")
            if (container) {
                container.innerHTML = ""
            }
        }
    }, [value])

    return <div ref={rendererRef} className="ql-editor ql-renderer" />
}

export default Renderer

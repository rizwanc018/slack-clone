import Quill, { type Delta, type Op, type QuillOptions } from "quill"
import "quill/dist/quill.snow.css"
import { MutableRefObject, useEffect, useLayoutEffect, useRef, useState } from "react"
import { Button } from "./ui/button"
import { PiTextAa } from "react-icons/pi"
import { ImageIcon, Smile } from "lucide-react"
import { MdSend } from "react-icons/md"
import { Hint } from "./Hint"
import { cn } from "@/lib/utils"

type EditorValue = {
    image: File | null
    body: string
}

interface EditorProps {
    onSubmit: ({ image, body }: EditorValue) => void
    variant?: "create" | "update"
    placeholder?: string
    defaultValue?: Delta | Op[]
    onCancel?: () => void
    disabled?: boolean
    innerRef?: MutableRefObject<Quill | null>
}

const Editor = ({
    variant = "create",
    onCancel,
    onSubmit,
    disabled,
    defaultValue,
    innerRef,
    placeholder,
}: EditorProps) => {
    const [text, setText] = useState("")
    const [isToolbarVisible, setIsToolbarVisible] = useState(false)

    const containerRef = useRef<HTMLDivElement>(null)
    const submitRef = useRef(onSubmit)
    const placeholderRef = useRef(placeholder)
    const quillRef = useRef<Quill | null>(null)
    const defaultValueRef = useRef(defaultValue)
    const disabledRef = useRef(disabled)

    useLayoutEffect(() => {
        submitRef.current = onSubmit
        placeholderRef.current = placeholder
        defaultValueRef.current = defaultValue
        disabledRef.current = disabled
    })

    useEffect(() => {
        if (!containerRef.current) return

        const container = containerRef.current
        const editorContainer = container.appendChild(container.ownerDocument.createElement("div"))
        const options: QuillOptions = {
            theme: "snow",
            placeholder: placeholderRef.current,
            modules: {
                toolbar: [
                    ["bold", "italic", "underline", "strike", "blockquote"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["clean"],
                ],
                keyboard: {
                    bindings: {
                        enter: {
                            key: "Enter",
                            handler: () => {
                                return
                            },
                        },
                    },
                    shift_enter: {
                        key: "Enter",
                        shiftKey: true,
                        handler: () => {
                            quill.insertText(quill.getSelection()?.index || 0, "\n")
                        },
                    },
                },
            },
        }

        const quill = new Quill(editorContainer, options)
        quillRef.current = quill
        quillRef.current.focus()

        if (innerRef) {
            innerRef.current = quill
        }

        quill.setContents(defaultValueRef.current ?? [])
        setText(quill.getText())

        quill.on("text-change", () => {
            setText(quill.getText())
        })

        return () => {
            quill.off("text-change")
            if (container) {
                container.innerHTML = ""
            }
            if (quillRef.current) {
                quillRef.current = null
            }
            if (innerRef) {
                innerRef.current = null
            }
        }
    }, [innerRef])

    const toggleToolbar = () => {
        setIsToolbarVisible((prev) => !prev)
        const toolbarElement = containerRef.current?.querySelector(".ql-toolbar")
        if (toolbarElement) {
            toolbarElement.classList.toggle("hidden")
        }
    }
    const isEmpty = text.replace(/<(.|\n)*?>/gm, "").trim().length === 0

    console.log({ text, isEmpty })

    return (
        <div className="flex flex-col mb-1">
            <div className="flex flex-col border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white">
                <div ref={containerRef} className="h-full ql-custom" />
                <div className="flex px-2 pb-2 z-[5]">
                    <Hint label={isToolbarVisible ? "Show formating" : "Hide formating"}>
                        <Button
                            disabled={disabled}
                            size={"iconsSm"}
                            variant={"ghost"}
                            onClick={toggleToolbar}
                        >
                            <PiTextAa className="size-4" />
                        </Button>
                    </Hint>
                    <Hint label="Emojis">
                        <Button disabled={disabled} size={"iconsSm"} variant={"ghost"}>
                            <Smile className="size-4" />
                        </Button>
                    </Hint>
                    {variant === "create" && (
                        <Hint label="Image">
                            <Button disabled={disabled} size={"iconsSm"} variant={"ghost"}>
                                <ImageIcon className="size-4" />
                            </Button>
                        </Hint>
                    )}
                    {variant === "update" && (
                        <div className="ml-auto flex gap-x-2">
                            <Button disabled={disabled} size={"sm"} variant={"outline"}>
                                Cancel
                            </Button>
                            <Button
                                disabled={disabled || isEmpty}
                                size={"sm"}
                                className=" bg-[#007a5a] hover:bg-[#007a5a]/80 text-white"
                            >
                                Save
                            </Button>
                        </div>
                    )}
                    {variant === "create" && (
                        <Button
                            disabled={disabled || isEmpty}
                            size={"iconsSm"}
                            variant={"ghost"}
                            className={cn(
                                "ml-auto",
                                isEmpty
                                    ? "bg-white hover:bg-whit/80 text-muted-foreground"
                                    : "bg-[#007a5a] hover:bg-[#007a5a]/80 text-white"
                            )}
                        >
                            <MdSend className="size-4 " />
                        </Button>
                    )}
                </div>
            </div>
            <div className="p-2 text-[10px] text-muted-foreground flex justify-end">
                <p>
                    <strong>Shift + Return</strong>
                    to add a new line
                </p>
            </div>
        </div>
    )
}

export default Editor

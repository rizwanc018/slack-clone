"use client"

import { Button } from "@/components/ui/button"
import { useGetWorkspaceInfo } from "@/features/workspaces/api/use_get_workspace_info"
import { useJoin } from "@/features/workspaces/api/use_join"
import { useWorkspaceId } from "@/hooks/use_workspace_id"
import { cn } from "@/lib/utils"
import { Loader } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import VerificationInput from "react-verification-input"
import { toast } from "sonner"

const Join = () => {
    const workspaceId = useWorkspaceId()
    const router = useRouter()

    const { data, isLoading } = useGetWorkspaceInfo({ id: workspaceId })
    const { mutate, isPending } = useJoin()

    const isMember = data?.isMember

    useEffect(() => {
        if (isMember) {
            router.replace(`/workspace/${workspaceId}`)
        }
    }, [isMember, router, workspaceId])

    const handleComplete = async (value: string) => {
        await mutate(
            { joinCode: value, workspaceId },
            {
                onSuccess: () => {
                    toast.success("Joined workspace")
                    router.replace(`/workspace/${workspaceId}`)
                },
                onError: () => {
                    toast.error("Failed to join workspace")
                },
            }
        )
    }

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader className="size-4 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 ">
            <Image src={"/logo.svg"} alt={"logo"} width={60} height={60} />
            <div className="felx flex-col gap-y-4 items-center justify-center max-w-md">
                <div className="flex flex-col gap-y-2 items-center justify-center">
                    <h1 className="text-2xl font-bold"> Join {data?.name}</h1>
                    <p className="text-md text-muted-foreground">Enter the join code to join a workspace</p>
                </div>
                <VerificationInput
                    onComplete={handleComplete}
                    autoFocus
                    classNames={{
                        container: cn(
                            "flex  gap-x-2",
                            isPending && "animate-pulse opacity-50 cursor-not-allowed"
                        ),
                        character:
                            "uppercase h-auto rounded-md border border-gray-300 flex items-center justify-center text-lg font-medium  text-gray-500 ",
                        characterInactive: "bg-muted",
                        characterSelected: "bg-white text-black",
                        characterFilled: "bg-white text-black",
                    }}
                />
            </div>
            <div className="flex gap-x-4">
                <Button size={"lg"} variant={"outline"} asChild>
                    <Link href="/">Back to Home</Link>
                </Button>
            </div>
        </div>
    )
}

export default Join

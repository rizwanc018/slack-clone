import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"
import { SignInFlow } from "../types"
import { useState } from "react"
import { useAuthActions } from "@convex-dev/auth/react"
import { TriangleAlert } from "lucide-react"

interface SignInCardProps {
    setState: (state: SignInFlow) => void
}

const SignInCard = ({ setState }: SignInCardProps) => {
    const { signIn } = useAuthActions()
    // 1qwaZ2@90
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [pending, setPending] = useState(false)
    const [error, setError] = useState("")

    const handlePasswordSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setPending(true)
        signIn("password", {
            email,
            password,
            flow: "signIn",
        })
            .catch(() => {
                setError("Invalid email or password")
            })
            .finally(() => {
                setPending(false)
            })
    }

    const handleSignIn = async (provider: "github" | "google") => {
        setPending(true)
        signIn(provider)
        setPending(false)
    }

    return (
        <Card className="h-full w-full p-8">
            <CardHeader className="px-0 pt-0">
                <CardTitle>Login to continue</CardTitle>
                <CardDescription>Use your email or another service to continue</CardDescription>
            </CardHeader>
            {!!error && (
                <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
                    <TriangleAlert className="h-4 w-4" />
                    <p>{error}</p>
                </div>
            )}
            <CardContent className="space-y-5 px-0 pb-0">
                <form className="space-y-2.5" onSubmit={handlePasswordSignIn}>
                    <Input
                        disabled={pending}
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value)
                        }}
                        placeholder="Email"
                        type="email"
                        required
                    />
                    <Input
                        disabled={pending}
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value)
                        }}
                        placeholder="Password"
                        type="password"
                        required
                    />
                    <Button className="w-full" type="submit" size="lg" disabled={pending}>
                        Continue
                    </Button>
                </form>
                <Separator />
                <div className="flex flex-col gap-y-2.5">
                    <Button
                        className="w-full relative"
                        variant={"outline"}
                        size="lg"
                        disabled={pending}
                        onClick={() => {
                            handleSignIn("google")
                        }}
                    >
                        <FcGoogle className="size-5 absolute top-3 left-2.5" />
                        Continue with Google
                    </Button>
                    <Button
                        className="w-full relative"
                        variant={"outline"}
                        size="lg"
                        disabled={pending}
                        onClick={() => {
                            handleSignIn("github")
                        }}
                    >
                        <FaGithub className="size-5 absolute top-3 left-2.5" />
                        Continue with Github
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <span
                        className="text-sky-700 cursor-pointer hover:underline"
                        onClick={() => setState("signUp")}
                    >
                        Sign Up
                    </span>
                </p>
            </CardContent>
        </Card>
    )
}

export default SignInCard

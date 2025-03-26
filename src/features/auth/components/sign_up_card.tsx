import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"
import { SignInFlow } from "../types"
import { useState } from "react"
import { TriangleAlert } from "lucide-react"
import { useAuthActions } from "@convex-dev/auth/react"

interface SignUpCardProps {
    setState: (state: SignInFlow) => void
}

const SignUpCard = ({ setState }: SignUpCardProps) => {
    const { signIn } = useAuthActions()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [pending, setPending] = useState(false)
    const [error, setError] = useState("")

    const handlePasswordSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setError("")
        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        setPending(true)
        signIn("password", {
            name,
            email,
            password,
            flow: "signUp",
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
                <CardTitle>Sign up to continue</CardTitle>
                <CardDescription>Use your email or another service to continue</CardDescription>
            </CardHeader>
            {!!error && (
                <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
                    <TriangleAlert className="h-4 w-4" />
                    <p>{error}</p>
                </div>
            )}
            <CardContent className="space-y-5 px-0 pb-0">
                <form className="space-y-2.5" onSubmit={handlePasswordSignup}>
                    <Input
                        disabled={pending}
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value)
                        }}
                        placeholder="Full Name"
                        type="text"
                        required
                    />
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
                    <Input
                        disabled={pending}
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value)
                        }}
                        placeholder="Confirm Password"
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
                    Already have an account?{" "}
                    <span
                        className="text-sky-700 cursor-pointer hover:underline"
                        onClick={() => setState("signIn")}
                    >
                        Sign In
                    </span>
                </p>
            </CardContent>
        </Card>
    )
}

export default SignUpCard

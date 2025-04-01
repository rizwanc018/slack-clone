import type { Metadata } from "next"
import "./globals.css"
import { JotaiProvider } from "@/components/jotai_provider"
import { ConvexClientProvider } from "@/components/convex_client_provider"
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server"
import { Modals } from "@/components/modals"
import { Toaster } from "@/components/ui/sonner"
import { NuqsAdapter } from "nuqs/adapters/next/app"

export const metadata: Metadata = {
    title: "Slack Clone",
    description: "Slack Clone",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <ConvexAuthNextjsServerProvider>
            <html lang="en">
                <body className={``}>
                    <ConvexClientProvider>
                        <NuqsAdapter>
                            <JotaiProvider>
                                <Toaster />
                                <Modals />
                                {children}
                            </JotaiProvider>
                        </NuqsAdapter>
                    </ConvexClientProvider>
                </body>
            </html>
        </ConvexAuthNextjsServerProvider>
    )
}

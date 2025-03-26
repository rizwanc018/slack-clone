import type { Metadata } from "next"
import "./globals.css"
import { ConvexClientProvider } from "@/components/convex_client_provider"
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server"

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
                    <ConvexClientProvider>{children}</ConvexClientProvider>
                </body>
            </html>
        </ConvexAuthNextjsServerProvider>
    )
}

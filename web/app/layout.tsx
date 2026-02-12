import './globals.css'
import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import { WalletProvider } from '@/components/WalletProvider'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const metadata: Metadata = {
    metadataBase: new URL('http://localhost:3000'),
    title: 'Tokenized Kulture — Decentralized Cultural Archive',
    description: 'AI Video Vault, Kulture Wire origin tracking, and community-voted Best Video of the Year contest. Built on Solana + Arweave.',
    keywords: ['Solana', 'Arweave', 'AI', 'Cultural Archive', 'Decentralized', 'Fact Checking', 'Video Vault'],
    openGraph: {
        title: 'Tokenized Kulture',
        description: 'The decentralized Snopes for cultural moments. Trace viral origins, archive AI metadata, vote for the best.',
        type: 'website',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
            <body className="min-h-screen bg-kulture-noir">
                <WalletProvider>
                    {children}
                </WalletProvider>
            </body>
        </html>
    )
}

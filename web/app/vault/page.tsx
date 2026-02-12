import { Film } from 'lucide-react'

export default function VaultPage() {
    return (
        <div className="min-h-screen bg-street-black text-white p-8">
            <h1 className="text-6xl font-display font-black text-neon-pink mb-8">AI VIDEO VAULT</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Placeholder for video cards */}
                <div className="neon-box border-neon-pink p-6">
                    <Film className="w-12 h-12 text-neon-pink mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Video Title Project</h3>
                    <p className="text-gray-400">Metadata: Arweave Hash...</p>
                </div>
                <div className="neon-box border-neon-pink p-6 flex items-center justify-center min-h-[200px]">
                    <p className="text-xl text-gray-500">More videos coming soon...</p>
                </div>
            </div>
        </div>
    )
}

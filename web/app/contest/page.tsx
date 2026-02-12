'use client'

import { useState, useEffect } from 'react'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Trophy, Vote, Coins, Clock } from 'lucide-react'
import { VideoMetadata } from '@/types'

export default function ContestPage() {
    const { publicKey, sendTransaction } = useWallet()
    const { connection } = useConnection()
    const [videos, setVideos] = useState<VideoMetadata[]>([])
    const [prizePool, setPrizePool] = useState(0)
    const [loading, setLoading] = useState<string | null>(null)

    useEffect(() => {
        fetchStandings()
    }, [])

    const fetchStandings = async () => {
        try {
            const res = await fetch('/api/contest/standings')
            const data = await res.json()
            setVideos(data.videos)
            setPrizePool(data.prizePoolSol)
        } catch (error) {
            console.error('Failed to fetch standings:', error)
        }
    }

    const handleVote = async (videoId: string) => {
        if (!publicKey) {
            alert('Please connect your wallet first')
            return
        }

        setLoading(videoId)
        try {
            // In production: create and send Solana transaction
            // For hackathon: call backend API
            const res = await fetch('/api/contest/vote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    videoId,
                    voter: publicKey.toBase58(),
                }),
            })

            const data = await res.json()

            if (data.success) {
                alert(`Vote cast! TX: ${data.receipt.transactionSignature}`)
                fetchStandings()
            } else {
                alert(data.error || 'Vote failed')
            }
        } catch (error) {
            console.error('Vote error:', error)
            alert('Failed to cast vote')
        } finally {
            setLoading(null)
        }
    }

    return (
        <div className="min-h-screen py-12 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-display font-bold mb-4">
                        <span className="text-gradient">Best Video of the Year</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                        Vote for your favorite video. 0.0009 SOL per vote (~$0.18). Prize pool distributed annually.
                    </p>

                    <div className="flex justify-center">
                        <WalletMultiButton className="!bg-kulture-emerald hover:!bg-kulture-emerald/80 !rounded-xl !font-semibold !transition-all" />
                    </div>
                </div>

                {/* Prize Pool Stats */}
                <div className="grid md:grid-cols-4 gap-6 mb-12">
                    <div className="glass-panel p-6 text-center">
                        <Coins className="w-8 h-8 text-kulture-gold mx-auto mb-3" />
                        <div className="text-3xl font-bold text-kulture-gold mb-1">
                            {prizePool.toFixed(4)} SOL
                        </div>
                        <div className="text-sm text-gray-400">Prize Pool</div>
                    </div>

                    <div className="glass-panel p-6 text-center">
                        <Trophy className="w-8 h-8 text-kulture-gold mx-auto mb-3" />
                        <div className="text-3xl font-bold text-kulture-gold mb-1">40%</div>
                        <div className="text-sm text-gray-400">Grand Prize</div>
                    </div>

                    <div className="glass-panel p-6 text-center">
                        <Vote className="w-8 h-8 text-kulture-emerald mx-auto mb-3" />
                        <div className="text-3xl font-bold text-kulture-emerald mb-1">0.0009</div>
                        <div className="text-sm text-gray-400">SOL per Vote</div>
                    </div>

                    <div className="glass-panel p-6 text-center">
                        <Clock className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                        <div className="text-3xl font-bold text-white mb-1">Dec 31</div>
                        <div className="text-sm text-gray-400">Contest Ends</div>
                    </div>
                </div>

                {/* Leaderboard */}
                <div className="glass-panel p-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <Trophy className="w-7 h-7 text-kulture-gold" />
                        Leaderboard
                    </h2>

                    <div className="space-y-4">
                        {videos.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <Trophy className="w-16 h-16 mx-auto mb-4 opacity-30" />
                                <p>No videos registered yet. Be the first to upload!</p>
                            </div>
                        ) : (
                            videos.map((video, index) => (
                                <div
                                    key={video.arweaveTxId}
                                    className={`bg-white/5 rounded-xl p-6 border transition-all duration-300 ${index === 0
                                            ? 'border-kulture-gold glow-gold'
                                            : 'border-white/10 hover:border-kulture-emerald/30'
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-6">
                                        <div className="flex items-start gap-4 flex-1">
                                            {/* Rank Badge */}
                                            <div
                                                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${index === 0
                                                        ? 'bg-kulture-gold text-kulture-noir'
                                                        : index === 1
                                                            ? 'bg-gray-400 text-kulture-noir'
                                                            : index === 2
                                                                ? 'bg-orange-600 text-white'
                                                                : 'bg-white/10 text-gray-400'
                                                    }`}
                                            >
                                                {index === 0 ? '👑' : `#${index + 1}`}
                                            </div>

                                            {/* Video Info */}
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold mb-1">{video.title}</h3>
                                                <p className="text-sm text-gray-400 mb-3">
                                                    by <span className="text-kulture-emerald font-mono">{video.creator}</span>
                                                </p>

                                                <div className="flex gap-6 text-sm">
                                                    <span className="text-gray-400">
                                                        🗳️ <strong className="text-white">{video.votes}</strong> votes
                                                    </span>
                                                    <span className="text-gray-400">
                                                        ⭐ <strong className="text-kulture-gold">{video.kulturePoints}</strong> Kulture Points
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Vote Button */}
                                        <button
                                            onClick={() => handleVote(video.arweaveTxId || '')}
                                            disabled={!publicKey || loading === video.arweaveTxId}
                                            className="px-6 py-3 bg-kulture-emerald hover:bg-kulture-emerald/80 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-xl font-semibold transition-all duration-300 hover:glow-emerald whitespace-nowrap"
                                        >
                                            {loading === video.arweaveTxId ? 'Voting...' : 'Vote (0.0009 SOL)'}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Prize Distribution */}
                <div className="glass-panel p-8 mt-8">
                    <h3 className="text-xl font-bold mb-6">Prize Distribution</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                            <span className="text-gray-300">🥇 1st Place (Grand Prize)</span>
                            <span className="text-kulture-gold font-bold">40%</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                            <span className="text-gray-300">🥈 2nd–6th Place (Runners-up)</span>
                            <span className="text-kulture-emerald font-bold">30% (6% each)</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                            <span className="text-gray-300">🎨 Creator Fund (All Creators)</span>
                            <span className="text-kulture-gold font-bold">20%</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                            <span className="text-gray-300">🏦 Platform Reserve (Operations)</span>
                            <span className="text-gray-400 font-bold">10%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

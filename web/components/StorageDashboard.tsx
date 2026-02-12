'use client'

import { Info, Database, Link as LinkIcon, Shield, Infinity } from 'lucide-react'
import { motion } from 'framer-motion'

export default function StorageDashboard() {
    return (
        <div className="bg-street-gray/30 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
                <Database className="w-8 h-8 text-neon-cyan" />
                <h2 className="text-3xl font-display font-bold text-white">
                    Storage Architecture
                </h2>
            </div>

            <p className="text-gray-300 mb-8 text-lg">
                Your culture is stored across two permanent systems. Think of Solana as the <strong className="text-neon-yellow">Title Deed</strong> and Arweave as the <strong className="text-neon-cyan">Safe</strong>.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Arweave Card */}
                <motion.div
                    whileHover={{ y: -5 }}
                    className="neon-box border-neon-cyan p-6 bg-black/20"
                >
                    <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 bg-neon-cyan/10 rounded-xl">
                            <Infinity className="w-8 h-8 text-neon-cyan" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-neon-cyan mb-1">Arweave</h3>
                            <p className="text-sm text-gray-400">The Permaweb Storage</p>
                        </div>
                    </div>

                    <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-2">
                            <Shield className="w-4 h-4 text-neon-green mt-0.5 flex-shrink-0" />
                            <div>
                                <strong className="text-white">What's Stored:</strong>
                                <p className="text-gray-400">Your actual files (videos, music, art) + JSON metadata (title, tags, cinematic data)</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-2">
                            <LinkIcon className="w-4 h-4 text-neon-yellow mt-0.5 flex-shrink-0" />
                            <div>
                                <strong className="text-white">Permanence:</strong>
                                <p className="text-gray-400">Files can <strong>never be deleted</strong>. Once uploaded, they exist forever.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-2">
                            <Info className="w-4 h-4 text-neon-pink mt-0.5 flex-shrink-0" />
                            <div>
                                <strong className="text-white">Cost:</strong>
                                <p className="text-gray-400">One-time payment (fractions of a cent per MB). No recurring fees.</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/10">
                        <code className="text-xs text-neon-cyan bg-black/40 px-2 py-1 rounded">
                            https://arweave.net/TX_ID
                        </code>
                    </div>
                </motion.div>

                {/* Solana Card */}
                <motion.div
                    whileHover={{ y: -5 }}
                    className="neon-box border-neon-yellow p-6 bg-black/20"
                >
                    <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 bg-neon-yellow/10 rounded-xl">
                            <Database className="w-8 h-8 text-neon-yellow" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-neon-yellow mb-1">Solana</h3>
                            <p className="text-sm text-gray-400">The Ownership Layer</p>
                        </div>
                    </div>

                    <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-2">
                            <Shield className="w-4 h-4 text-neon-green mt-0.5 flex-shrink-0" />
                            <div>
                                <strong className="text-white">What's Stored:</strong>
                                <p className="text-gray-400">The NFT token (your "Title Deed") that points to the Arweave file</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-2">
                            <LinkIcon className="w-4 h-4 text-neon-yellow mt-0.5 flex-shrink-0" />
                            <div>
                                <strong className="text-white">Ownership:</strong>
                                <p className="text-gray-400">Proves you own the NFT. Enables buying, selling, and transferring.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-2">
                            <Info className="w-4 h-4 text-neon-pink mt-0.5 flex-shrink-0" />
                            <div>
                                <strong className="text-white">Wallet Capacity:</strong>
                                <p className="text-gray-400">Hold <strong>unlimited NFTs</strong> in one wallet. Each NFT is a separate SPL token.</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/10">
                        <code className="text-xs text-neon-yellow bg-black/40 px-2 py-1 rounded">
                            Kulture...abc123 (Mint Address)
                        </code>
                    </div>
                </motion.div>
            </div>

            {/* Flow Diagram */}
            <div className="mt-8 p-6 bg-black/40 rounded-xl border border-white/5">
                <h4 className="text-lg font-bold mb-4 text-center text-white">The Upload Flow</h4>
                <div className="flex items-center justify-center gap-4 flex-wrap">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-neon-pink/10 border-2 border-neon-pink rounded-full flex items-center justify-center mb-2 mx-auto">
                            <span className="text-2xl font-bold text-neon-pink">1</span>
                        </div>
                        <p className="text-xs text-gray-400 max-w-[100px]">Upload file to Arweave</p>
                    </div>

                    <div className="text-neon-cyan text-2xl">→</div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-neon-cyan/10 border-2 border-neon-cyan rounded-full flex items-center justify-center mb-2 mx-auto">
                            <span className="text-2xl font-bold text-neon-cyan">2</span>
                        </div>
                        <p className="text-xs text-gray-400 max-w-[100px]">Get permanent TX ID</p>
                    </div>

                    <div className="text-neon-cyan text-2xl">→</div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-neon-yellow/10 border-2 border-neon-yellow rounded-full flex items-center justify-center mb-2 mx-auto">
                            <span className="text-2xl font-bold text-neon-yellow">3</span>
                        </div>
                        <p className="text-xs text-gray-400 max-w-[100px]">Mint NFT on Solana</p>
                    </div>

                    <div className="text-neon-cyan text-2xl">→</div>

                    <div className="text-center">
                        <div className="w-16 h-16 bg-neon-green/10 border-2 border-neon-green rounded-full flex items-center justify-center mb-2 mx-auto">
                            <span className="text-2xl font-bold text-neon-green">✓</span>
                        </div>
                        <p className="text-xs text-gray-400 max-w-[100px]">NFT in your wallet</p>
                    </div>
                </div>
            </div>

            {/* Key Insight */}
            <div className="mt-6 p-4 bg-neon-cyan/5 border border-neon-cyan/20 rounded-lg">
                <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-neon-cyan mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                        <strong className="text-neon-cyan">Why This Matters:</strong>
                        <p className="text-gray-300 mt-1">
                            Even if Solana goes offline, your files still exist on Arweave forever.
                            Even if Arweave changes, your Solana NFT proves ownership.
                            This is <strong>true permanence</strong>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

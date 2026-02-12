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

            {/* Redesigned as single column for perfect alignment */}
            <div className="space-y-6">
                {/* Arweave Section */}
                <motion.div
                    whileHover={{ y: -2, boxShadow: "0 0 30px rgba(0, 255, 255, 0.2)" }}
                    className="bg-gradient-to-r from-neon-cyan/5 to-transparent border-l-4 border-neon-cyan p-6 rounded-lg shadow-[0_0_15px_rgba(0,255,255,0.1)]"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-neon-cyan/10 rounded-lg">
                            <Infinity className="w-8 h-8 text-neon-cyan drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-neon-cyan" style={{ textShadow: '0 0 20px rgba(0, 255, 255, 0.5), 0 0 10px rgba(0, 255, 255, 0.3)' }}>
                                Arweave
                            </h3>
                            <p className="text-gray-400 text-sm">Permanent File Storage</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-black/20 p-4 rounded-lg border border-white/5 hover:border-neon-green/30 transition-all">
                            <div className="flex items-center gap-2 mb-2">
                                <Shield className="w-4 h-4 text-neon-green drop-shadow-[0_0_4px_rgba(0,255,0,0.4)]" />
                                <p className="text-white font-bold text-sm">What's Stored</p>
                            </div>
                            <p className="text-gray-300 text-sm">Files + metadata</p>
                        </div>

                        <div className="bg-black/20 p-4 rounded-lg border border-white/5 hover:border-neon-yellow/30 transition-all">
                            <div className="flex items-center gap-2 mb-2">
                                <LinkIcon className="w-4 h-4 text-neon-yellow drop-shadow-[0_0_4px_rgba(255,255,0,0.4)]" />
                                <p className="text-white font-bold text-sm">Permanence</p>
                            </div>
                            <p className="text-gray-300 text-sm">Never deleted. Forever.</p>
                        </div>

                        <div className="bg-black/20 p-4 rounded-lg border border-white/5 hover:border-neon-pink/30 transition-all">
                            <div className="flex items-center gap-2 mb-2">
                                <Info className="w-4 h-4 text-neon-pink drop-shadow-[0_0_4px_rgba(255,0,255,0.4)]" />
                                <p className="text-white font-bold text-sm">Cost</p>
                            </div>
                            <p className="text-gray-300 text-sm">One-time fee only</p>
                        </div>
                    </div>

                    <div className="mt-4">
                        <code className="text-xs text-neon-cyan bg-black/40 px-3 py-2 rounded inline-block shadow-[0_0_10px_rgba(0,255,255,0.15)]">
                            arweave.net/TX_ID
                        </code>
                    </div>
                </motion.div>

                {/* Solana Section */}
                <motion.div
                    whileHover={{ y: -2, boxShadow: "0 0 30px rgba(255, 215, 0, 0.2)" }}
                    className="bg-gradient-to-r from-neon-yellow/5 to-transparent border-l-4 border-neon-yellow p-6 rounded-lg shadow-[0_0_15px_rgba(255,215,0,0.1)]"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-neon-yellow/10 rounded-lg">
                            <Database className="w-8 h-8 text-neon-yellow drop-shadow-[0_0_8px_rgba(255,215,0,0.6)]" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-neon-yellow" style={{ textShadow: '0 0 20px rgba(255, 215, 0, 0.5), 0 0 10px rgba(255, 215, 0, 0.3)' }}>
                                Solana
                            </h3>
                            <p className="text-gray-400 text-sm">Ownership Registry</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-black/20 p-4 rounded-lg border border-white/5 hover:border-neon-green/30 transition-all">
                            <div className="flex items-center gap-2 mb-2">
                                <Shield className="w-4 h-4 text-neon-green drop-shadow-[0_0_4px_rgba(0,255,0,0.4)]" />
                                <p className="text-white font-bold text-sm">What's Stored</p>
                            </div>
                            <p className="text-gray-300 text-sm">NFT "Title Deed"</p>
                        </div>

                        <div className="bg-black/20 p-4 rounded-lg border border-white/5 hover:border-neon-yellow/30 transition-all">
                            <div className="flex items-center gap-2 mb-2">
                                <LinkIcon className="w-4 h-4 text-neon-yellow drop-shadow-[0_0_4px_rgba(255,215,0,0.4)]" />
                                <p className="text-white font-bold text-sm">Ownership</p>
                            </div>
                            <p className="text-gray-300 text-sm">Buy, sell, transfer</p>
                        </div>

                        <div className="bg-black/20 p-4 rounded-lg border border-white/5 hover:border-neon-pink/30 transition-all">
                            <div className="flex items-center gap-2 mb-2">
                                <Info className="w-4 h-4 text-neon-pink drop-shadow-[0_0_4px_rgba(255,0,255,0.4)]" />
                                <p className="text-white font-bold text-sm">Capacity</p>
                            </div>
                            <p className="text-gray-300 text-sm">Unlimited NFTs</p>
                        </div>
                    </div>

                    <div className="mt-4">
                        <code className="text-xs text-neon-yellow bg-black/40 px-3 py-2 rounded inline-block shadow-[0_0_10px_rgba(255,215,0,0.15)]">
                            Kulture...abc123
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

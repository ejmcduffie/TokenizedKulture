'use client'

import { Film, Info, Database, Shield, Share2 } from 'lucide-react'
import { motion } from 'framer-motion'
import StorageDashboard from '@/components/StorageDashboard'

export default function VaultPage() {
    return (
        <div className="min-h-screen bg-street-black text-white pb-20">
            {/* Hero Section */}
            <div className="relative py-20 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#FF00FF_1px,transparent_1px),linear-gradient(to_bottom,#FF00FF_1px,transparent_1px)] bg-[size:40px_40px] opacity-10" />
                <div className="relative max-w-7xl mx-auto flex flex-col items-center text-center">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-neon-pink/10 p-4 rounded-full mb-6 border border-neon-pink/30"
                    >
                        <Film className="w-12 h-12 text-neon-pink" />
                    </motion.div>
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-7xl font-display font-black text-neon-pink mb-6 drop-shadow-[0_0_15px_rgba(255,0,255,0.5)]"
                    >
                        AI VIDEO VAULT
                    </motion.h1>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-2xl text-gray-300 max-w-3xl mb-12"
                    >
                        The permanent archive for cultural cinematic data. Every shot, every prompt, and every creative detail stored forever on Arweave.
                    </motion.p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Column: Featured Video */}
                <div className="lg:col-span-2 space-y-12">
                    <section>
                        <h2 className="text-3xl font-display font-bold text-white mb-6 flex items-center gap-3">
                            <span className="w-2 h-8 bg-neon-pink rounded-full inline-block"></span>
                            Featured Archive: Tokenized Kulture
                        </h2>

                        <div className="neon-box border-neon-pink p-2 bg-black/40 overflow-hidden group">
                            <div className="relative aspect-video bg-street-gray flex items-center justify-center">
                                <video
                                    src="/assets/TokenizeKulture.mp4"
                                    controls
                                    className="w-full h-full object-contain"
                                    poster="/images/hip-hop-left-top.jpg"
                                >
                                    Your browser does not support the video tag.
                                </video>
                                <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md border border-neon-pink/50 text-neon-pink text-xs font-mono px-3 py-1 rounded-full">
                                    ESTABLISHED ON ARWEAVE: 2026
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-1">Tokenized Kulture Manifesto</h3>
                                        <p className="text-neon-pink text-sm font-bold">Creator: Emmanuel EJ McDuffie Jr.</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="bg-neon-pink/10 border border-neon-pink/30 text-neon-pink text-[10px] px-2 py-1 rounded tracking-widest uppercase">4K Cinematic</span>
                                        <span className="bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-[10px] px-2 py-1 rounded tracking-widest uppercase">AI Enhanced</span>
                                    </div>
                                </div>
                                <p className="text-gray-400 mb-6 leading-relaxed">
                                    This visual manifesto outlines the vision of Tokenized Kulture — a bridge between the legends of the past and the technology of the future. It serves as the cornerstone of our AI Video Vault.
                                </p>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10">
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Permanence</p>
                                        <p className="text-sm font-bold text-white">ARWEAVE</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Ownership</p>
                                        <p className="text-sm font-bold text-white">SOLANA</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Resolution</p>
                                        <p className="text-sm font-bold text-white">2160p (4K)</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Genre</p>
                                        <p className="text-sm font-bold text-white">CULTURAL ARCHIVE</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Infographic Section */}
                    <section>
                        <h2 className="text-3xl font-display font-bold text-white mb-6 flex items-center gap-3">
                            <span className="w-2 h-8 bg-neon-cyan rounded-full inline-block"></span>
                            The Vision: Tokenized Kulture Info
                        </h2>
                        <div className="neon-box border-neon-cyan p-4 bg-black/40">
                            <img
                                src="/assets/TOkenizedKultureINFO.png"
                                alt="Tokenized Kulture Infographic"
                                className="w-full h-auto rounded-lg shadow-[0_0_30px_rgba(0,255,255,0.2)]"
                            />
                            <div className="mt-6 p-4 bg-neon-cyan/5 rounded-lg border border-neon-cyan/20">
                                <h4 className="text-neon-cyan font-bold mb-2 flex items-center gap-2">
                                    <Info className="w-4 h-4" />
                                    Archive Insight
                                </h4>
                                <p className="text-sm text-gray-300">
                                    This infographic details the multi-layered approach of Tokenized Kulture, from origin tracking to AI metadata preservation. It represents the architectural blueprint envisioned by Emmanuel EJ McDuffie Jr.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Right Column: Stats & Meta */}
                <div className="space-y-8">
                    <StorageDashboard />

                    <div className="neon-box border-neon-yellow p-8 bg-black/40">
                        <h3 className="text-2xl font-display font-bold text-neon-yellow mb-6">VAULT STATS</h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400">Total Archives</span>
                                <span className="text-2xl font-bold text-white">1,284</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400">Data Stored</span>
                                <span className="text-2xl font-bold text-white">4.2 TB</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400">Permanence Score</span>
                                <span className="text-2xl font-bold text-neon-green">100%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400">Arweave Nodes</span>
                                <span className="text-2xl font-bold text-white">842</span>
                            </div>
                        </div>

                        <button className="w-full mt-8 py-4 bg-neon-yellow text-black font-black uppercase tracking-widest hover:bg-white transition-colors rounded-lg">
                            UPLOAD TO VAULT
                        </button>
                    </div>

                    <div className="neon-box border-neon-magenta p-8 bg-black/40">
                        <Share2 className="w-10 h-10 text-neon-magenta mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">PARTITION ACCESS</h3>
                        <p className="text-sm text-gray-400 mb-6">
                            Verified AI models can access the vault to learn from production metadata while respecting creator ownership.
                        </p>
                        <div className="p-3 bg-black/60 rounded border border-white/10 font-mono text-[10px] text-neon-magenta">
                            kulture-vault-access: v1.0.4-beta
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

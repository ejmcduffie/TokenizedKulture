'use client'

import Link from 'next/link'
import { Film, Radio, Trophy } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function HomePage() {
    return (
        <div className="min-h-screen bg-street-black text-white relative">
            {/* Background Grid */}
            <div className="fixed inset-0 pointer-events-none opacity-20">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#00FFFF_1px,transparent_1px),linear-gradient(to_bottom,#00FFFF_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>

            {/* Side Characters - 80s Hip Hop Theme */}
            {/* Top Left Character */}
            <motion.div
                initial={{ x: -200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.7 }}
                className="fixed bottom-[500px] left-0 z-0 hidden xl:block w-[400px] h-[500px]"
            >
                <Image
                    src="/images/hip-hop-left-top.jpg"
                    alt="Hip Hop Character Left Top"
                    width={400}
                    height={500}
                    className="object-contain filter drop-shadow-[0_0_20px_rgba(57,255,20,0.5)]"
                />
            </motion.div>

            {/* Bottom Left Character */}
            <motion.div
                initial={{ x: -200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="fixed bottom-0 left-0 z-10 hidden xl:block w-[400px] h-[600px]"
            >
                <Image
                    src="/images/hip-hop-left.png"
                    alt="Hip Hop Character Left"
                    width={400}
                    height={600}
                    className="object-contain filter drop-shadow-[0_0_20px_rgba(57,255,20,0.5)]"
                />
            </motion.div>

            {/* Top Right Character */}
            <motion.div
                initial={{ x: 200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.7 }}
                className="fixed bottom-[500px] right-0 z-0 hidden xl:block w-[400px] h-[500px]"
            >
                <Image
                    src="/images/hip-hop-right-top.jpg"
                    alt="Hip Hop Character Right Top"
                    width={400}
                    height={500}
                    className="object-contain filter drop-shadow-[0_0_20px_rgba(255,20,147,0.5)]"
                />
            </motion.div>

            {/* Bottom Right Character */}
            <motion.div
                initial={{ x: 200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="fixed bottom-0 right-0 z-10 hidden xl:block w-[400px] h-[600px]"
            >
                <Image
                    src="/images/hip-hop-right.png"
                    alt="Hip Hop Character Right"
                    width={400}
                    height={600}
                    className="object-contain filter drop-shadow-[0_0_20px_rgba(255,20,147,0.5)]"
                />
            </motion.div>

            {/* Hero Section */}
            <section className="relative overflow-hidden py-32 px-6">
                <div className="absolute inset-0 bg-gradient-to-br from-retro-purple/20 via-transparent to-neon-cyan/20" />

                <div className="relative max-w-6xl mx-auto text-center">
                    <motion.h1
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-9xl font-display font-black mb-6 animate-neon-pulse text-neon-cyan text-neon tracking-tighter"
                    >
                        TOKENIZED
                    </motion.h1>
                    <motion.h1
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                        className="text-9xl font-graffiti mb-8 graffiti-text"
                    >
                        KULTURE
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="text-2xl text-neon-yellow mb-12 max-w-3xl mx-auto font-bold"
                    >
                        The blockchain archive for hip-hop culture. Trace viral origins, preserve AI metadata, vote for the dopest.
                    </motion.p>


                    <div className="flex gap-6 justify-center">
                        <Link
                            href="/vault"
                            className="neon-box border-neon-magenta px-10 py-5 hover:scale-110 transition-transform duration-300 group overflow-hidden relative"
                        >
                            <span className="relative z-10 text-neon-magenta font-bold text-2xl group-hover:text-white transition-colors">
                                EXPLORE VAULT →
                            </span>
                            <div className="absolute inset-0 bg-neon-magenta transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 opacity-20" />
                        </Link>

                        <Link
                            href="/market"
                            className="neon-box border-neon-cyan px-10 py-5 hover:scale-110 transition-transform duration-300 group overflow-hidden relative"
                        >
                            <span className="relative z-10 text-neon-cyan font-bold text-2xl group-hover:text-white transition-colors">
                                NFT MARKET →
                            </span>
                            <div className="absolute inset-0 bg-neon-cyan transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 opacity-20" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Three Pillars */}
            <section className="py-24 px-6 relative z-20">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-6xl font-display font-black text-center mb-20 text-neon-yellow drop-shadow-lg">
                        THREE PILLARS
                    </h2>

                    <div className="grid md:grid-cols-3 gap-10">
                        {/* Pillar 1: Video Vault */}
                        <motion.div whileHover={{ y: -10 }}>
                            <Link href="/vault" className="neon-box border-neon-pink p-10 block h-full group">
                                <Film className="w-20 h-20 text-neon-pink mb-6 group-hover:animate-bounce-slow" />
                                <h3 className="text-4xl font-bold mb-4 text-neon-pink font-display">AI VIDEO VAULT</h3>
                                <p className="text-gray-300 text-lg leading-relaxed">
                                    Permanent storage on Arweave. Camera angles, lighting, effects — all machine-readable for AI learning.
                                </p>
                            </Link>
                        </motion.div>

                        {/* Pillar 2: NFT Market */}
                        <motion.div whileHover={{ y: -10 }}>
                            <Link href="/market" className="neon-box border-neon-cyan p-10 block h-full group">
                                <Radio className="w-20 h-20 text-neon-cyan mb-6 group-hover:animate-bounce-slow" />
                                <h3 className="text-4xl font-bold mb-4 text-neon-cyan font-display">NFT MARKET</h3>
                                <p className="text-gray-300 text-lg leading-relaxed">
                                    Mint your art, music, photos, and merch. Own your culture and sell directly to your community.
                                </p>
                            </Link>
                        </motion.div>

                        {/* Pillar 3: Vote Contest */}
                        <motion.div whileHover={{ y: -10 }}>
                            <Link href="/contest" className="neon-box border-neon-yellow p-10 block h-full group">
                                <Trophy className="w-20 h-20 text-neon-yellow mb-6 group-hover:animate-bounce-slow" />
                                <h3 className="text-4xl font-bold mb-4 text-neon-yellow font-display">BEST VIDEO CONTEST</h3>
                                <p className="text-gray-300 text-lg leading-relaxed">
                                    Vote for your favorite (0.0009 SOL/vote). Annual prize pool: 40% Grand Prize, 30% Runners-up, 20% Creator Fund.
                                </p>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Cultural Moments That Needed This */}
            <section className="py-24 px-6 bg-gradient-to-b from-street-black to-street-gray relative z-20">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-5xl md:text-6xl font-display font-black text-center mb-6 text-neon-cyan drop-shadow-lg">
                        CULTURAL MOMENTS THAT NEEDED THIS
                    </h2>
                    <p className="text-xl text-center text-gray-300 mb-16 max-w-3xl mx-auto">
                        Every "Who did it first?" argument. Every stolen sound. Every viral moment with lost origins. <strong className="text-neon-yellow">This ends now.</strong>
                    </p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Example 1: DJ Kool Herc Myth */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="bg-black/60 backdrop-blur-sm border-2 border-neon-pink p-6 rounded-xl"
                        >
                            <div className="text-5xl mb-3">🎧</div>
                            <h3 className="text-xl font-bold text-neon-pink mb-2">
                                DJ KOOL HERC MYTH
                            </h3>
                            <p className="text-gray-300 text-sm mb-3">
                                For decades, he was called the "creator of hip-hop." Then Tariq Nasheed's <strong className="text-white">"Microphone Check"</strong> documented the <strong className="text-neon-yellow">actual originators</strong> of each element.
                            </p>
                            <div className="text-xs text-neon-green font-mono">
                                → Immutable timestamps<br />
                                → Archive the real originators<br />
                                → No more revisionist history
                            </div>
                        </motion.div>

                        {/* Example 2: Birdman "Bling Bling" */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="bg-black/60 backdrop-blur-sm border-2 border-neon-yellow p-6 rounded-xl"
                        >
                            <div className="text-5xl mb-3">💎</div>
                            <h3 className="text-xl font-bold text-neon-yellow mb-2">
                                BIRDMAN MISSED "BLING BLING"
                            </h3>
                            <p className="text-gray-300 text-sm mb-3">
                                Cash Money Records <strong className="text-white">coined "Bling Bling"</strong> in their music. But Birdman <strong className="text-neon-pink">missed the trademark window</strong>. With this platform, <strong className="text-neon-cyan">timestamped proof</strong> = IP rights.
                            </p>
                            <div className="text-xs text-neon-green font-mono">
                                → Immutable "first use" timestamp<br />
                                → Proof for trademark/copyright<br />
                                → Creators own their innovations
                            </div>
                        </motion.div>

                        {/* Example 3: Soulja Boy */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="bg-black/60 backdrop-blur-sm border-2 border-neon-cyan p-6 rounded-xl"
                        >
                            <div className="text-5xl mb-3">🎤</div>
                            <h3 className="text-xl font-bold text-neon-cyan mb-2">
                                "I DID IT FIRST"
                            </h3>
                            <p className="text-gray-300 text-sm mb-3">
                                Soulja Boy says he invented everything. With <strong className="text-white">Kulture Wire</strong>, we trace the <strong className="text-neon-yellow">actual first tweet</strong>, video, claim—permanently.
                            </p>
                            <div className="text-xs text-neon-green font-mono">
                                → Permanent proof on Arweave<br />
                                → Thread forensics via X API<br />
                                → Timestamp proof ≠ editable
                            </div>
                        </motion.div>

                        {/* Example 4: Viral Sounds */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="bg-black/60 backdrop-blur-sm border-2 border-neon-magenta p-6 rounded-xl"
                        >
                            <div className="text-5xl mb-3">🔊</div>
                            <h3 className="text-xl font-bold text-neon-magenta mb-2">
                                "FAWK!" & VIRAL SOUNDS
                            </h3>
                            <p className="text-gray-300 text-sm mb-3">
                                Who made that viral "faawwwk" sound? That beat everyone sampled? <strong className="text-white">Kulture Wire</strong> traces it to the <strong className="text-neon-pink">original creator</strong>.
                            </p>
                            <div className="text-xs text-neon-green font-mono">
                                → Track viral spread on X<br />
                                → Find origin (even if deleted)<br />
                                → Compensation for creators
                            </div>
                        </motion.div>
                    </div>

                    {/* Call to Action */}
                    <div className="mt-12 text-center">
                        <div className="inline-block bg-gradient-to-r from-neon-pink via-neon-cyan to-neon-yellow p-1 rounded-xl">
                            <div className="bg-street-black px-10 py-8 rounded-lg max-w-3xl">
                                <p className="text-3xl font-bold text-white mb-3">
                                    Culture moves fast. <span className="text-neon-cyan">Permanence</span> is power.
                                </p>
                                <p className="text-lg text-gray-300 mb-2">
                                    From now on, we have a platform to track <strong className="text-neon-yellow">world culture</strong>: slang, trends, news—all in one place.
                                </p>
                                <p className="text-sm text-gray-400">
                                    Every post archived. Every origin traceable. Every creator credited.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-24 px-6 border-t-8 border-neon-magenta bg-street-black/50 backdrop-blur-xl relative z-20">
                <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12 text-center">
                    <div>
                        <div className="text-8xl font-black text-neon-cyan mb-4 drop-shadow-xl">∞</div>
                        <div className="text-2xl text-neon-yellow font-bold uppercase tracking-widest drop-shadow-md">PERMANENT STORAGE</div>
                    </div>
                    <div>
                        <div className="text-8xl font-black text-neon-magenta mb-4 drop-shadow-xl">0.0009</div>
                        <div className="text-2xl text-neon-yellow font-bold uppercase tracking-widest drop-shadow-md">SOL PER VOTE</div>
                    </div>
                    <div>
                        <div className="text-8xl font-black text-neon-green mb-4 drop-shadow-xl">40%</div>
                        <div className="text-2xl text-neon-yellow font-bold uppercase tracking-widest drop-shadow-md">GRAND PRIZE</div>
                    </div>
                </div>
            </section>
        </div>
    )
}

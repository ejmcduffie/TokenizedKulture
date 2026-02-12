'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
    PlusCircle, ShoppingBag, Music, Image as ImageIcon, Shirt,
    Camera, Film, ArrowLeft, X, Loader2, Tag, Wallet, Sparkles, TrendingUp
} from 'lucide-react'

type AssetType = 'art' | 'music' | 'photo' | 'merch' | 'fashion' | 'video'

interface NFTListing {
    listingId: string
    mintAddress: string
    seller: string
    priceSol: number
    isActive: boolean
    listedAt: string
    nft: {
        name: string
        description: string
        assetType: AssetType
        creator: string
        assetUri: string
        royaltyBps: number
        tags: string[]
        mintedAt: string
    }
}

interface MintFormData {
    name: string
    description: string
    assetType: AssetType
    tags: string
    royaltyPercent: number
    priceSol: number
}

const assetTypeConfig: Record<AssetType, { label: string; icon: React.ReactNode; color: string; borderColor: string; bgHover: string }> = {
    art: { label: 'Art & Photos', icon: <ImageIcon className="w-12 h-12" />, color: 'text-neon-cyan', borderColor: 'border-neon-cyan', bgHover: 'hover:bg-neon-cyan/10' },
    music: { label: 'Music & Audio', icon: <Music className="w-12 h-12" />, color: 'text-neon-pink', borderColor: 'border-neon-pink', bgHover: 'hover:bg-neon-pink/10' },
    photo: { label: 'Photography', icon: <Camera className="w-12 h-12" />, color: 'text-neon-green', borderColor: 'border-neon-green', bgHover: 'hover:bg-neon-green/10' },
    merch: { label: 'Merch', icon: <ShoppingBag className="w-12 h-12" />, color: 'text-neon-yellow', borderColor: 'border-neon-yellow', bgHover: 'hover:bg-neon-yellow/10' },
    fashion: { label: 'Fashion', icon: <Shirt className="w-12 h-12" />, color: 'text-neon-magenta', borderColor: 'border-neon-magenta', bgHover: 'hover:bg-neon-magenta/10' },
    video: { label: 'Video', icon: <Film className="w-12 h-12" />, color: 'text-neon-cyan', borderColor: 'border-neon-cyan', bgHover: 'hover:bg-neon-cyan/10' },
}

const filterOptions: { value: AssetType | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'art', label: 'Art' },
    { value: 'music', label: 'Music' },
    { value: 'photo', label: 'Photo' },
    { value: 'merch', label: 'Merch' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'video', label: 'Video' },
]

export default function MarketPage() {
    const [listings, setListings] = useState<NFTListing[]>([])
    const [stats, setStats] = useState<{ totalNFTsMinted: number; activeListings: number; totalVolumeSol: number; totalCreators: number } | null>(null)
    const [filterType, setFilterType] = useState<AssetType | 'all'>('all')
    const [showMintModal, setShowMintModal] = useState(false)
    const [mintType, setMintType] = useState<AssetType>('art')
    const [minting, setMinting] = useState(false)
    const [mintSuccess, setMintSuccess] = useState<string | null>(null)
    const [form, setForm] = useState<MintFormData>({
        name: '',
        description: '',
        assetType: 'art',
        tags: '',
        royaltyPercent: 5,
        priceSol: 0,
    })

    useEffect(() => {
        fetchListings()
    }, [filterType])

    const fetchListings = async () => {
        try {
            const params = new URLSearchParams()
            if (filterType !== 'all') params.set('assetType', filterType)

            const res = await fetch(`/api/market/listings?${params}`)
            const data = await res.json()
            setListings(data.listings)
            setStats(data.stats)
        } catch (error) {
            console.error('Failed to fetch listings:', error)
        }
    }

    const openMintModal = (type: AssetType) => {
        setMintType(type)
        setForm(prev => ({ ...prev, assetType: type }))
        setShowMintModal(true)
        setMintSuccess(null)
    }

    const handleMint = async () => {
        if (!form.name.trim()) {
            alert('Please enter a name for your NFT')
            return
        }

        setMinting(true)
        try {
            const res = await fetch('/api/market/mint', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    description: form.description,
                    assetType: form.assetType,
                    creator: 'demo_wallet_' + Date.now(), // In production: from wallet adapter
                    tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
                    royaltyBps: form.royaltyPercent * 100,
                    priceSol: form.priceSol > 0 ? form.priceSol : undefined,
                }),
            })

            const data = await res.json()

            if (data.success) {
                setMintSuccess(data.receipt.mintAddress)
                fetchListings()
            } else {
                alert(data.error || 'Minting failed')
            }
        } catch (error) {
            console.error('Mint error:', error)
            alert('Failed to mint NFT')
        } finally {
            setMinting(false)
        }
    }

    const handleBuy = async (listing: NFTListing) => {
        try {
            const res = await fetch('/api/market/purchase', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    listingId: listing.listingId,
                    buyer: 'demo_buyer_' + Date.now(),
                }),
            })

            const data = await res.json()

            if (data.success) {
                alert(`🎉 Purchased "${listing.nft.name}" for ${listing.priceSol} SOL!\n\nTX: ${data.receipt.transactionSignature}`)
                fetchListings()
            }
        } catch (error) {
            console.error('Purchase error:', error)
            alert('Purchase failed')
        }
    }

    return (
        <div className="min-h-screen bg-street-black text-white">
            {/* Background Grid */}
            <div className="fixed inset-0 pointer-events-none opacity-10">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#FF00FF_1px,transparent_1px),linear-gradient(to_bottom,#FF00FF_1px,transparent_1px)] bg-[size:60px_60px]" />
            </div>

            <div className="relative z-10 p-8 max-w-7xl mx-auto">
                {/* Back to Home */}
                <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-neon-cyan transition-colors mb-6">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>

                {/* Header */}
                <header className="mb-12">
                    <motion.h1
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-6xl md:text-7xl font-display font-black text-neon-cyan mb-4 drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]"
                    >
                        NFT MARKETPLACE
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-xl text-gray-300 max-w-2xl"
                    >
                        Mint your art, music, photos, and merch. Own your culture — every wallet holds unlimited NFTs on Solana.
                    </motion.p>
                </header>

                {/* Stats Bar */}
                {stats && (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
                    >
                        <div className="neon-box border-neon-cyan/30 p-4 text-center">
                            <div className="text-2xl font-bold text-neon-cyan">{stats.totalNFTsMinted}</div>
                            <div className="text-xs text-gray-400 uppercase tracking-wider">NFTs Minted</div>
                        </div>
                        <div className="neon-box border-neon-pink/30 p-4 text-center">
                            <div className="text-2xl font-bold text-neon-pink">{stats.activeListings}</div>
                            <div className="text-xs text-gray-400 uppercase tracking-wider">Active Listings</div>
                        </div>
                        <div className="neon-box border-neon-yellow/30 p-4 text-center">
                            <div className="text-2xl font-bold text-neon-yellow">{stats.totalVolumeSol} SOL</div>
                            <div className="text-xs text-gray-400 uppercase tracking-wider">Total Volume</div>
                        </div>
                        <div className="neon-box border-neon-green/30 p-4 text-center">
                            <div className="text-2xl font-bold text-neon-green">{stats.totalCreators}</div>
                            <div className="text-xs text-gray-400 uppercase tracking-wider">Creators</div>
                        </div>
                    </motion.div>
                )}

                {/* Mint Options */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16"
                >
                    {(Object.entries(assetTypeConfig) as [AssetType, typeof assetTypeConfig[AssetType]][]).map(([type, config]) => (
                        <div
                            key={type}
                            onClick={() => openMintModal(type)}
                            className={`neon-box ${config.borderColor} p-6 group cursor-pointer ${config.bgHover} transition-all duration-300 hover:scale-105`}
                        >
                            <div className={`${config.color} mb-3 group-hover:scale-110 transition-transform`}>
                                {config.icon}
                            </div>
                            <h3 className="text-lg font-bold mb-1">{config.label}</h3>
                            <button className={`flex items-center gap-1 ${config.color} font-bold text-sm group-hover:text-white`}>
                                <PlusCircle className="w-4 h-4" /> MINT
                            </button>
                        </div>
                    ))}
                </motion.div>

                {/* Filter Bar */}
                <div className="flex items-center gap-3 mb-8 flex-wrap">
                    <TrendingUp className="w-5 h-5 text-neon-yellow" />
                    <span className="text-gray-400 font-bold text-sm uppercase tracking-wider mr-2">Filter:</span>
                    {filterOptions.map(opt => (
                        <button
                            key={opt.value}
                            onClick={() => setFilterType(opt.value)}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${filterType === opt.value
                                ? 'bg-neon-cyan text-black'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                {/* Marketplace Listings */}
                <section>
                    <h2 className="text-4xl font-display font-bold mb-8 text-white flex items-center gap-3">
                        <Sparkles className="w-8 h-8 text-neon-yellow" />
                        Featured Drops
                    </h2>

                    {listings.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">
                            <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-30" />
                            <p className="text-xl">No listings found for this filter.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {listings.map((listing, idx) => {
                                const typeConfig = assetTypeConfig[listing.nft.assetType] || assetTypeConfig.art
                                return (
                                    <motion.div
                                        key={listing.listingId}
                                        initial={{ y: 30, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className={`bg-street-gray/50 rounded-xl overflow-hidden border border-white/10 hover:${typeConfig.borderColor.replace('border-', 'border-')} transition-all duration-300 group hover:scale-[1.02]`}
                                    >
                                        {/* Preview Image Area */}
                                        <div className="h-56 bg-gradient-to-br from-black/80 to-gray-900 flex items-center justify-center relative overflow-hidden">
                                            <div className={`absolute inset-0 bg-gradient-to-br from-transparent ${typeConfig.color.replace('text-', 'to-')}/5`} />
                                            <div className={`${typeConfig.color} opacity-20 group-hover:opacity-40 transition-opacity`}>
                                                {React.cloneElement(typeConfig.icon as React.ReactElement, { className: 'w-24 h-24' })}
                                            </div>
                                            {/* Asset type badge */}
                                            <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold ${typeConfig.color} bg-black/60 backdrop-blur-sm border ${typeConfig.borderColor}/30`}>
                                                {typeConfig.label}
                                            </div>
                                            {/* Royalty badge */}
                                            <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-neon-yellow bg-black/60 backdrop-blur-sm">
                                                {listing.nft.royaltyBps / 100}% royalty
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <h3 className="text-xl font-bold mb-2 group-hover:text-neon-cyan transition-colors">
                                                {listing.nft.name}
                                            </h3>
                                            <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                                                {listing.nft.description}
                                            </p>
                                            <p className="text-gray-500 text-xs mb-4">
                                                By <span className="text-neon-green font-mono">{listing.nft.creator.slice(0, 12)}...</span>
                                            </p>

                                            {/* Tags */}
                                            {listing.nft.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mb-4">
                                                    {listing.nft.tags.slice(0, 3).map(tag => (
                                                        <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] bg-white/5 text-gray-400">
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                    {listing.nft.tags.length > 3 && (
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/5 text-gray-400">
                                                            +{listing.nft.tags.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            <div className="flex justify-between items-center pt-3 border-t border-white/5">
                                                <span className="text-neon-cyan font-bold text-lg">{listing.priceSol} SOL</span>
                                                <button
                                                    onClick={() => handleBuy(listing)}
                                                    className="px-5 py-2.5 bg-neon-cyan text-black font-bold rounded-lg hover:bg-white transition-colors duration-300 hover:scale-105 transform"
                                                >
                                                    BUY NOW
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    )}
                </section>

                {/* How It Works */}
                <section className="mt-20 mb-12">
                    <h2 className="text-3xl font-display font-bold mb-8 text-center text-neon-yellow">
                        How Solana NFTs Work
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                        <div className="neon-box border-neon-cyan/20 p-6 text-center">
                            <Wallet className="w-10 h-10 text-neon-cyan mx-auto mb-3" />
                            <h3 className="font-bold mb-2">One Wallet, Unlimited NFTs</h3>
                            <p className="text-sm text-gray-400">Every Solana wallet holds unlimited NFTs natively. Each NFT is its own SPL token.</p>
                        </div>
                        <div className="neon-box border-neon-pink/20 p-6 text-center">
                            <Tag className="w-10 h-10 text-neon-pink mx-auto mb-3" />
                            <h3 className="font-bold mb-2">5% Creator Royalties</h3>
                            <p className="text-sm text-gray-400">Creators earn royalties on every resale. Culture pays forward.</p>
                        </div>
                        <div className="neon-box border-neon-green/20 p-6 text-center">
                            <Sparkles className="w-10 h-10 text-neon-green mx-auto mb-3" />
                            <h3 className="font-bold mb-2">Permanent on Arweave</h3>
                            <p className="text-sm text-gray-400">Asset files stored permanently. Your culture can never be deleted.</p>
                        </div>
                    </div>
                </section>
            </div>

            {/* ─── Mint Modal ─── */}
            <AnimatePresence>
                {showMintModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowMintModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-street-gray border border-white/10 rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h2 className={`text-2xl font-bold ${assetTypeConfig[mintType].color}`}>
                                    Mint {assetTypeConfig[mintType].label}
                                </h2>
                                <button onClick={() => setShowMintModal(false)} className="text-gray-400 hover:text-white">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {mintSuccess ? (
                                /* Success State */
                                <div className="text-center py-8">
                                    <div className="text-6xl mb-4">🎉</div>
                                    <h3 className="text-2xl font-bold text-neon-green mb-2">NFT Minted!</h3>
                                    <p className="text-gray-400 mb-4">Your NFT has been created and stored permanently on Arweave.</p>
                                    <p className="text-xs text-gray-500 font-mono bg-black/30 p-3 rounded-lg break-all mb-6">
                                        Mint Address: {mintSuccess}
                                    </p>
                                    <button
                                        onClick={() => { setShowMintModal(false); setMintSuccess(null) }}
                                        className="px-6 py-3 bg-neon-cyan text-black font-bold rounded-lg hover:bg-white transition-colors"
                                    >
                                        Done
                                    </button>
                                </div>
                            ) : (
                                /* Mint Form */
                                <div className="space-y-5">
                                    {/* Asset Type Selector */}
                                    <div>
                                        <label className="text-sm text-gray-400 mb-2 block">Asset Type</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {(Object.entries(assetTypeConfig) as [AssetType, typeof assetTypeConfig[AssetType]][]).map(([type, config]) => (
                                                <button
                                                    key={type}
                                                    onClick={() => { setMintType(type); setForm(prev => ({ ...prev, assetType: type })) }}
                                                    className={`p-2 rounded-lg text-xs font-bold transition-all ${mintType === type
                                                        ? `${config.color} bg-white/10 border ${config.borderColor}`
                                                        : 'text-gray-500 bg-white/5 border border-transparent hover:bg-white/10'
                                                        }`}
                                                >
                                                    {config.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Name */}
                                    <div>
                                        <label className="text-sm text-gray-400 mb-2 block">Name *</label>
                                        <input
                                            type="text"
                                            value={form.name}
                                            onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                                            placeholder="My Awesome NFT"
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-neon-cyan focus:outline-none transition-colors"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="text-sm text-gray-400 mb-2 block">Description</label>
                                        <textarea
                                            value={form.description}
                                            onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                                            placeholder="Tell the story behind your creation..."
                                            rows={3}
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-neon-cyan focus:outline-none transition-colors resize-none"
                                        />
                                    </div>

                                    {/* Tags */}
                                    <div>
                                        <label className="text-sm text-gray-400 mb-2 block">Tags (comma separated)</label>
                                        <input
                                            type="text"
                                            value={form.tags}
                                            onChange={e => setForm(prev => ({ ...prev, tags: e.target.value }))}
                                            placeholder="hip-hop, culture, digital-art"
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:border-neon-cyan focus:outline-none transition-colors"
                                        />
                                    </div>

                                    {/* Royalty & Price Row */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm text-gray-400 mb-2 block">Royalty %</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="50"
                                                value={form.royaltyPercent}
                                                onChange={e => setForm(prev => ({ ...prev, royaltyPercent: parseFloat(e.target.value) || 0 }))}
                                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-neon-cyan focus:outline-none transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-400 mb-2 block">Price (SOL, 0 = not listed)</label>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.1"
                                                value={form.priceSol}
                                                onChange={e => setForm(prev => ({ ...prev, priceSol: parseFloat(e.target.value) || 0 }))}
                                                className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-neon-cyan focus:outline-none transition-colors"
                                            />
                                        </div>
                                    </div>

                                    {/* Info box */}
                                    <div className="bg-neon-cyan/5 border border-neon-cyan/20 rounded-lg p-4 text-sm text-gray-300">
                                        <p className="mb-1">🔗 <strong>Solana Metaplex Standard</strong></p>
                                        <p className="text-xs text-gray-400">Your NFT will be minted as an SPL token with metadata stored permanently on Arweave. You can hold unlimited NFTs in your wallet.</p>
                                    </div>

                                    {/* Mint Button */}
                                    <button
                                        onClick={handleMint}
                                        disabled={minting || !form.name.trim()}
                                        className="w-full py-4 bg-gradient-to-r from-neon-cyan to-neon-pink text-black font-bold text-lg rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
                                    >
                                        {minting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Minting on Solana...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-5 h-5" />
                                                MINT NFT
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

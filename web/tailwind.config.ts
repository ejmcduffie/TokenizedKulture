import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // 80s Hip-Hop Neon Palette
                'neon-cyan': '#00FFFF',
                'neon-magenta': '#FF00FF',
                'neon-yellow': '#FFFF00',
                'neon-pink': '#FF1493',
                'neon-green': '#39FF14',
                'retro-purple': '#9D00FF',
                'retro-orange': '#FF6B00',
                'street-black': '#0D0D0D',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Orbitron', 'Impact', 'sans-serif'],
                graffiti: ['Permanent Marker', 'cursive'],
            },
            animation: {
                'neon-pulse': 'neonPulse 2s ease-in-out infinite',
                'slide-in': 'slideIn 0.8s ease-out',
                'bounce-slow': 'bounce 3s infinite',
            },
            keyframes: {
                neonPulse: {
                    '0%, 100%': {
                        textShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
                    },
                    '50%': {
                        textShadow: '0 0 20px currentColor, 0 0 40px currentColor, 0 0 60px currentColor',
                    },
                },
                slideIn: {
                    '0%': { transform: 'translateX(-100%)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
export default config

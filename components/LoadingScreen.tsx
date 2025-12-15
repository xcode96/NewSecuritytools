import React, { useRef, useEffect } from 'react';

const LoadingScreen: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops: number[] = [];

        for (let x = 0; x < columns; x++) {
            drops[x] = Math.random() * -100; // Start at random random heights above screen
        }

        // Cyber-themed characters
        const chars = "01".split(""); // Binary is cleaner for background

        const draw = () => {
            // Fade effect for trails
            ctx.fillStyle = 'rgba(15, 23, 42, 0.1)'; // matching slate-900
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.font = `${fontSize}px 'Fira Code', monospace`;

            for (let i = 0; i < drops.length; i++) {
                // Randomize color for "glitch" effect rarely
                const isGlitch = Math.random() > 0.99;
                ctx.fillStyle = isGlitch ? '#f0abfc' : '#0ea5e9'; // Pink glitch or Sky Blue normal

                const text = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                // Reset drop to top randomly after it has crossed screen
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                drops[i]++;
            }
        };

        const animate = () => {
            draw();
            animationFrameId = window.requestAnimationFrame(animate);
        }

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.cancelAnimationFrame(animationFrameId);
        }

    }, []);

    return (
        <div className="relative h-screen w-full overflow-hidden bg-slate-900 flex items-center justify-center">
            {/* Background Data Rain */}
            <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0 opacity-40"></canvas>

            {/* Centered Glass Card */}
            <div className="relative z-10 flex flex-col items-center justify-center p-12 rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 shadow-2xl shadow-blue-500/10 max-w-sm w-full mx-4">

                {/* Animated Logo Container */}
                <div className="relative w-24 h-24 mb-8">
                    {/* Ring 1 */}
                    <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-blue-500/30 border-l-transparent animate-spin"></div>

                    {/* Ring 2 (Reverse) */}
                    <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-pink-500 border-b-transparent border-l-pink-500/30 animate-spin-reverse"></div>

                    {/* Center Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                        </svg>
                    </div>
                </div>

                {/* Text Content */}
                <h2 className="text-xl font-bold text-white tracking-wider mb-2">INITIALIZING</h2>

                <div className="flex items-center gap-1">
                    <span className="text-sm text-blue-400 font-mono">Loading Security Capabilities</span>
                    <span className="flex space-x-1">
                        <span className="w-1 h-1 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-1 h-1 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></span>
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1 bg-slate-800 rounded-full mt-8 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 w-[200%] animate-loading-bar"></div>
                </div>
            </div>

            <style>{`
                @keyframes spin-reverse {
                    from { transform: rotate(360deg); }
                    to { transform: rotate(0deg); }
                }
                .animate-spin-reverse {
                    animation: spin-reverse 2s linear infinite;
                }
                @keyframes loading-bar {
                    0% { transform: translateX(-50%); }
                    100% { transform: translateX(0%); }
                }
                .animate-loading-bar {
                     animation: loading-bar 1.5s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default LoadingScreen;
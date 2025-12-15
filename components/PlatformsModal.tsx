import React, { useEffect } from 'react';
import { platformsData } from '../data/platforms';
import {
    XMarkIcon,
    BugIcon,
    GlobeIcon,
    ShieldCheckIcon,
    UsersIcon,
    AwardIcon,
} from './IconComponents';
import { motion } from 'motion/react';

interface PlatformsModalProps {
    onClose: () => void;
    isOpen: boolean;
}

const PlatformsModal: React.FC<PlatformsModalProps> = ({ onClose, isOpen }) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-slate-50 dark:bg-[#0a0a0a] flex flex-col h-full overflow-y-auto">
            {/* Hero Header */}
            <motion.header
                initial={{ height: "40vh" }}
                animate={{ height: "35vh" }}
                className="relative overflow-hidden shrink-0"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-fuchsia-700 to-purple-900" />
                <div className="absolute inset-0 bg-black/20 backdrop-filter backdrop-blur-[2px]" />

                {/* Decorative Elements */}
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-50 dark:from-[#0a0a0a] to-transparent z-10" />

                <div className="container mx-auto px-6 relative z-20 h-full flex flex-col justify-center">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                                <BugIcon className="w-6 h-6 text-fuchsia-300" />
                            </div>
                            <span className="px-3 py-1 rounded-full bg-fuchsia-500/20 text-fuchsia-100 text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-fuchsia-400/30">
                                Bug Bounty
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-lg">
                            Bug Bounty Platforms
                        </h1>
                        <p className="text-xl text-fuchsia-100/80 max-w-2xl leading-relaxed">
                            Top platforms for security researchers to hunt vulnerabilities and earn rewards.
                        </p>
                    </motion.div>
                </div>
            </motion.header>

            {/* Main Content */}
            <main className="flex-grow -mt-10 relative z-20 container mx-auto px-4 sm:px-6 pb-20">
                <div className="bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-white/5 p-6 sm:p-8 min-h-[60vh] flex flex-col gap-8">

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { icon: <GlobeIcon />, val: "12", label: "Platforms", color: "text-blue-500", shadow: "shadow-blue-500/20" },
                            { icon: <UsersIcon />, val: "1.5M+", label: "Hackers", color: "text-green-500", shadow: "shadow-green-500/20" },
                            { icon: <AwardIcon />, val: "$100M+", label: "Paid Out", color: "text-amber-500", shadow: "shadow-amber-500/20" },
                            { icon: <ShieldCheckIcon />, val: "500K+", label: "Bugs Found", color: "text-purple-500", shadow: "shadow-purple-500/20" },
                        ].map((stat, idx) => (
                            <div key={idx} className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 flex items-center gap-4">
                                <div className={`p-2.5 rounded-xl bg-white dark:bg-white/10 ${stat.color} shadow-lg ${stat.shadow}`}>
                                    {React.cloneElement(stat.icon as any, { className: "w-5 h-5" })}
                                </div>
                                <div>
                                    <div className="text-lg font-black text-slate-800 dark:text-white leading-none mb-1">{stat.val}</div>
                                    <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Platforms Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {platformsData.map((platform) => (
                            <motion.div
                                key={platform.id}
                                whileHover={{ y: -5 }}
                                className="group flex flex-col bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-fuchsia-500/30 hover:shadow-xl hover:shadow-fuchsia-500/10 transition-all duration-300"
                            >
                                <div className="p-6 space-y-4 flex-1">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-fuchsia-500 transition-colors">
                                                {platform.name}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1.5">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${platform.type === 'Invite-Only' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 border-purple-200 dark:border-purple-800' :
                                                        platform.type === 'Free Platform' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' :
                                                            'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                                                    }`}>
                                                    {platform.type}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className={`text-sm font-black ${platform.rating === 'Excellent' ? 'text-emerald-500' : 'text-blue-500'
                                                }`}>
                                                {platform.rating}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-medium">Est. {platform.founded}</span>
                                        </div>
                                    </div>

                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {platform.description}
                                    </p>

                                    <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100 dark:border-white/10">
                                        <div>
                                            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Payout</div>
                                            <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{platform.payoutRange}</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Hackers</div>
                                            <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{platform.hackers}</div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Notable Companies</div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {platform.notableCompanies.slice(0, 3).map((company, idx) => (
                                                <span key={idx} className="text-xs px-2 py-1 bg-slate-100 dark:bg-white/5 rounded-md text-slate-600 dark:text-slate-400 font-medium border border-slate-200 dark:border-white/5">
                                                    {company}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <a
                                    href={platform.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-4 bg-slate-50 dark:bg-white/5 border-t border-slate-200 dark:border-white/10 flex items-center justify-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition-colors rounded-b-2xl"
                                >
                                    Visit Platform →
                                </a>
                            </motion.div>
                        ))}
                    </div>

                    {/* Getting Started Section */}
                    <div className="relative overflow-hidden rounded-3xl p-8 bg-slate-900 border border-slate-800">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 to-purple-900/50" />
                        <div className="absolute -top-40 -right-40 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl opacity-50" />

                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold mb-8 text-white flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-fuchsia-500 text-white text-lg">🚀</span>
                                Getting Started with Bug Bounty
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[
                                    { title: "Learn the Basics", text: "Start with web application security fundamentals, OWASP Top 10, and common vulnerability types." },
                                    { title: "Practice on Labs", text: "Use platforms like PortSwigger Web Security Academy, DVWA, and WebGoat to practice safely." },
                                    { title: "Start Hunting", text: "Begin with public programs on HackerOne or Bugcrowd. Focus on one target and one vulnerability class at a time." }
                                ].map((step, idx) => (
                                    <div key={idx} className="relative group">
                                        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-fuchsia-500 to-transparent opacity-30 group-hover:opacity-100 transition-opacity" />
                                        <div className="text-4xl font-black text-white/5 absolute -top-4 -right-4">{idx + 1}</div>
                                        <h4 className="font-bold text-lg text-white mb-2">{step.title}</h4>
                                        <p className="text-slate-400 text-sm leading-relaxed">
                                            {step.text}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PlatformsModal;

import React, { useState, useMemo, useEffect } from 'react';
import { certificationsData, CertificationCategory } from '../data/certifications';
import {
    XMarkIcon,
    AwardIcon,
    SearchIcon,
    ShieldCheckIcon,
} from './IconComponents';
import { motion } from 'motion/react';

interface CertificationsModalProps {
    onClose: () => void;
    isOpen: boolean;
}

const CertificationsModal: React.FC<CertificationsModalProps> = ({ onClose, isOpen }) => {
    const [activeCategory, setActiveCategory] = useState<CertificationCategory | 'All'>('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const filteredCerts = useMemo(() => {
        return certificationsData.filter(cert => {
            const matchesCategory = activeCategory === 'All' || cert.category === activeCategory;
            const matchesSearch = cert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                cert.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                cert.provider.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchQuery]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-slate-50 dark:bg-[#0a0a0a] flex flex-col h-full overflow-y-auto">
            {/* Hero Header */}
            <motion.header
                initial={{ height: "40vh" }}
                animate={{ height: "35vh" }}
                className="relative overflow-hidden shrink-0"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-sky-700 to-blue-900" />
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
                                <AwardIcon className="w-6 h-6 text-sky-300" />
                            </div>
                            <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-100 text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-sky-400/30">
                                Certifications
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-lg">
                            Professional Certifications
                        </h1>
                        <p className="text-xl text-sky-100/80 max-w-2xl leading-relaxed">
                            Structured career paths and industry-standard certifications for Red Team, Blue Team, and Security Management.
                        </p>
                    </motion.div>
                </div>
            </motion.header>

            {/* Main Content */}
            <main className="flex-grow -mt-10 relative z-20 container mx-auto px-4 sm:px-6 pb-20">
                <div className="bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-white/5 p-6 sm:p-8 min-h-[60vh] flex flex-col gap-8">

                    {/* Controls */}
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
                            {(['All', 'Red Team', 'Blue Team', 'Management'] as const).map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeCategory === cat
                                        ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-md transform scale-105'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                        }`}
                                >
                                    {cat === 'All' ? 'All' : cat}
                                </button>
                            ))}
                        </div>

                        <div className="relative w-full md:w-72 group">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <SearchIcon className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search certifications..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                            />
                        </div>
                    </div>

                    {/* Career Paths Visual */}
                    {activeCategory === 'All' && !searchQuery && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Red Team Path */}
                            <div className="relative overflow-hidden bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 p-6 rounded-2xl border border-red-100 dark:border-red-500/20">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <AwardIcon className="w-32 h-32 text-red-500" />
                                </div>
                                <h3 className="relative z-10 text-lg font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
                                    Red Team Path
                                </h3>
                                <div className="relative z-10 flex flex-wrap items-center gap-2 mb-6">
                                    <span className="px-3 py-1 bg-white/50 dark:bg-white/5 backdrop-blur-md text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 rounded text-xs font-bold">CEH</span>
                                    <span className="text-slate-300">→</span>
                                    <span className="px-3 py-1 bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 rounded text-xs font-bold">OSCP</span>
                                    <span className="text-slate-300">→</span>
                                    <span className="px-3 py-1 bg-white/50 dark:bg-white/5 backdrop-blur-md text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 rounded text-xs font-bold">OSEP</span>
                                    <span className="text-slate-300">→</span>
                                    <span className="px-3 py-1 bg-white/50 dark:bg-white/5 backdrop-blur-md text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 rounded text-xs font-bold">OSWE</span>
                                </div>
                            </div>

                            {/* Blue Team Path */}
                            <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 p-6 rounded-2xl border border-blue-100 dark:border-blue-500/20">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <ShieldCheckIcon className="w-32 h-32 text-blue-500" />
                                </div>
                                <h3 className="relative z-10 text-lg font-bold text-slate-900 dark:text-slate-100 mb-6 flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
                                    Blue Team Path
                                </h3>
                                <div className="relative z-10 flex flex-wrap items-center gap-2 mb-6">
                                    <span className="px-3 py-1 bg-white/50 dark:bg-white/5 backdrop-blur-md text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 rounded text-xs font-bold">BTLO</span>
                                    <span className="text-slate-300">→</span>
                                    <span className="px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 rounded text-xs font-bold">CySA+</span>
                                    <span className="text-slate-300">→</span>
                                    <span className="px-3 py-1 bg-white/50 dark:bg-white/5 backdrop-blur-md text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 rounded text-xs font-bold">GCIH</span>
                                    <span className="text-slate-300">→</span>
                                    <span className="px-3 py-1 bg-white/50 dark:bg-white/5 backdrop-blur-md text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 rounded text-xs font-bold">GCFA</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Cert Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredCerts.map((cert) => (
                            <motion.div
                                key={cert.id}
                                whileHover={{ y: -5 }}
                                className="group flex flex-col bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300"
                            >
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${cert.category === 'Red Team' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                                            cert.category === 'Blue Team' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                                                'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                                            }`}>
                                            {cert.category}
                                        </div>
                                        <div className="px-2 py-1 rounded-md bg-slate-100 dark:bg-white/10 text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider border border-slate-200 dark:border-white/5">
                                            {cert.level}
                                        </div>
                                    </div>

                                    <div className="mb-2">
                                        <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">{cert.code}</h3>
                                        <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">{cert.provider}</h4>
                                    </div>

                                    <h5 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 border-b border-slate-100 dark:border-white/5 pb-3">
                                        {cert.name}
                                    </h5>

                                    <div className="flex gap-1 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className={`text-sm ${i < cert.rating ? 'text-amber-400' : 'text-slate-200 dark:text-slate-800'}`}>★</span>
                                        ))}
                                    </div>

                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                                        {cert.description}
                                    </p>

                                    <div className="mt-auto pt-4 space-y-3">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-400 font-bold uppercase tracking-wider">Duration</span>
                                            <span className="text-slate-700 dark:text-slate-200 font-semibold">{cert.duration}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-400 font-bold uppercase tracking-wider">Cost</span>
                                            <span className="text-slate-700 dark:text-slate-200 font-semibold">{cert.cost}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-6 pb-6 space-y-2.5">
                                    {[
                                        { label: "Difficulty", val: cert.difficulty, color: "bg-red-400" },
                                        { label: "Popularity", val: cert.popularity, color: "bg-blue-400" },
                                        { label: "Job Market", val: cert.jobMarket, color: "bg-green-400" },
                                    ].map((stat, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <span className="w-16 text-[10px] text-slate-400 font-bold uppercase tracking-wider">{stat.label}</span>
                                            <div className="flex-1 h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                                                <div className={`h-full ${stat.color} rounded-full`} style={{ width: `${(stat.val / 5) * 100}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <a
                                    href={cert.link}
                                    className="block p-3 text-center bg-slate-50 dark:bg-white/5 border-t border-slate-200 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                                >
                                    VIEW DETAILS →
                                </a>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CertificationsModal;

import React, { useState, useMemo, useEffect } from 'react';
import { downloadsData, DownloadCategory, DownloadTeam } from '../data/downloads';
import {
    XMarkIcon,
    DownloadIcon,
    SearchIcon,
    LinuxIcon,
    WindowsIcon,
    UbuntuIcon,
    ToolIcon,
    CodeIcon,
    ForensicsIcon,
    ShieldCheckIcon,
    WarningTriangleIcon
} from './IconComponents';
import { motion } from 'motion/react';

interface DownloadsModalProps {
    onClose: () => void;
    isOpen: boolean;
}

const DownloadsModal: React.FC<DownloadsModalProps> = ({ onClose, isOpen }) => {
    const [activeCategory, setActiveCategory] = useState<DownloadCategory | 'All'>('All');
    const [activeTeam, setActiveTeam] = useState<DownloadTeam | 'All'>('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const filteredDownloads = useMemo(() => {
        return downloadsData.filter(item => {
            const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
            const matchesTeam = activeTeam === 'All' || item.team === activeTeam;
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesTeam && matchesSearch;
        });
    }, [activeCategory, activeTeam, searchQuery]);

    const quickAccess = [
        { icon: LinuxIcon, name: 'Linux Distros', category: 'Linux Security Distributions' as DownloadCategory, desc: 'ISO Images' },
        { icon: ForensicsIcon, name: 'Forensics', category: 'Digital Forensics' as DownloadCategory, desc: 'Investigation' },
        { icon: WindowsIcon, name: 'Windows', category: 'Windows Security Tools' as DownloadCategory, desc: 'Enterprise' },
        { icon: UbuntuIcon, name: 'Ubuntu', category: 'Ubuntu & Debian' as DownloadCategory, desc: 'LTS Versions' },
        { icon: ToolIcon, name: 'Specialized', category: 'Specialized Tools' as DownloadCategory, desc: 'Specific' },
        { icon: CodeIcon, name: 'Development', category: 'Development Tools' as DownloadCategory, desc: 'Coding' },
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-slate-50 dark:bg-[#0a0a0a] flex flex-col h-full overflow-y-auto">
            {/* Hero Header */}
            <motion.header
                initial={{ height: "40vh" }}
                animate={{ height: "35vh" }}
                className="relative overflow-hidden shrink-0"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-900" />
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
                                <DownloadIcon className="w-6 h-6 text-emerald-300" />
                            </div>
                            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-100 text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-emerald-400/30">
                                Resource Library
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-lg">
                            Downloads & Resources
                        </h1>
                        <p className="text-xl text-emerald-100/80 max-w-2xl leading-relaxed">
                            Essential ISOs, tools, and resources for cybersecurity professionals. Verified and curated for your lab environment.
                        </p>
                    </motion.div>
                </div>
            </motion.header>

            {/* Main Content */}
            <main className="flex-grow -mt-10 relative z-20 container mx-auto px-4 sm:px-6 pb-20">
                <div className="bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-white/5 p-6 sm:p-8 min-h-[60vh] flex flex-col gap-8">

                    {/* Important Notice */}
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3 backdrop-blur-sm">
                        <WarningTriangleIcon className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-slate-700 dark:text-amber-200/80">
                            <span className="font-bold block mb-0.5 text-slate-900 dark:text-amber-100">Educational Purpose Only</span>
                            These tools are provided for educational, research, and authorized security testing purposes only. Always verify checksums and use in controlled environments.
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left Column: Sidebar Filters */}
                        <div className="lg:w-64 flex-shrink-0 space-y-6">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <SearchIcon className="w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Quick Access</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {quickAccess.map((qa) => (
                                        <button
                                            key={qa.name}
                                            onClick={() => { setActiveCategory(qa.category); setActiveTeam('All'); }}
                                            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${activeCategory === qa.category
                                                ? 'bg-emerald-50 dark:bg-emerald-500/20 border-emerald-200 dark:border-emerald-500/30'
                                                : 'bg-white dark:bg-white/5 border-slate-100 dark:border-white/5 hover:border-emerald-500/30 hover:shadow-md'
                                                }`}
                                        >
                                            <qa.icon className={`w-6 h-6 mb-2 transition-colors ${activeCategory === qa.category ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                                            <span className={`text-[10px] font-bold ${activeCategory === qa.category ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-400'}`}>{qa.name}</span>
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setActiveCategory('All')}
                                    className={`w-full py-2 text-xs font-bold rounded-xl border transition-all ${activeCategory === 'All'
                                        ? 'bg-emerald-600 text-white border-transparent'
                                        : 'bg-transparent border-slate-200 dark:border-white/10 text-slate-500 hover:text-emerald-500'
                                        }`}
                                >
                                    Reset Filters
                                </button>
                            </div>

                            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-5 text-white shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-5">
                                    <ShieldCheckIcon className="w-24 h-24" />
                                </div>
                                <h3 className="font-bold mb-4 flex items-center gap-2 relative z-10 text-sm">
                                    <ShieldCheckIcon className="w-4 h-4 text-emerald-400" />
                                    Security Tips
                                </h3>
                                <ul className="space-y-3 text-[10px] text-slate-300 relative z-10">
                                    <li className="flex gap-2">
                                        <span className="text-emerald-400 font-bold">•</span>
                                        <span>Verify SHA256 checksums</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-emerald-400 font-bold">•</span>
                                        <span>Use isolated VMs</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-emerald-400 font-bold">•</span>
                                        <span>Create bootable media</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Right Column: Content Grid */}
                        <div className="flex-1">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                                <h3 className="font-bold text-xl text-slate-800 dark:text-white flex items-center gap-2">
                                    {activeCategory === 'All' ? 'All Downloads' : activeCategory}
                                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400">
                                        {filteredDownloads.length} items
                                    </span>
                                </h3>

                                <div className="flex p-1 bg-slate-100 dark:bg-white/5 rounded-lg">
                                    {(['All', 'Red Team', 'Blue Team'] as const).map((team) => (
                                        <button
                                            key={team}
                                            onClick={() => setActiveTeam(team)}
                                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap ${activeTeam === team
                                                ? 'bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-sm'
                                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                                }`}
                                        >
                                            {team}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                                {filteredDownloads.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        whileHover={{ y: -5 }}
                                        className="group bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 p-5 hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300 flex flex-col"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${item.team === 'Red Team' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                                                    item.team === 'Blue Team' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                                                        'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                                                }`}>
                                                {item.team}
                                            </div>
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded-full border border-slate-200 dark:border-white/5">
                                                {item.type}
                                            </div>
                                        </div>

                                        <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-1 group-hover:text-emerald-500 transition-colors">{item.name}</h4>
                                        <div className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 min-h-[2.5em] leading-relaxed">
                                            {item.description}
                                        </div>

                                        <div className="space-y-2 mb-5">
                                            <div className="w-full bg-slate-100 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
                                                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${item.popularity}%` }}></div>
                                            </div>
                                            <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                                <span>Popularity</span>
                                                <span>{item.popularity}%</span>
                                            </div>
                                        </div>

                                        <div className="mt-auto">
                                            <div className="flex flex-wrap gap-1.5 mb-4">
                                                {item.keyFeatures.slice(0, 3).map((feature, idx) => (
                                                    <span key={idx} className="text-[10px] px-1.5 py-0.5 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-md text-slate-500 dark:text-slate-400 font-medium">
                                                        {feature}
                                                    </span>
                                                ))}
                                            </div>
                                            <a
                                                href={item.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-600/20 hover:shadow-emerald-500/30 gap-2 transform active:scale-95"
                                            >
                                                <DownloadIcon className="w-4 h-4" />
                                                Download Official ISO
                                            </a>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DownloadsModal;

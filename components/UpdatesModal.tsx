import React, { useState, useMemo } from 'react';
import { securityUpdates, securityRSSFeeds } from '../data/updates';
import {
    XMarkIcon,
    SearchIcon,
    RssIcon,
    GlobeIcon,
    DatabaseIcon,
    NewspaperIcon,
    WarningTriangleIcon,
    BugIcon,
    FrameworkIcon,
    NistIcon,
    MicrosoftIcon,
    GoogleIcon,
    AppleIcon,
    AdobeIcon,
    OracleIcon,
    MozillaIcon,
    UbuntuIcon,
    RedHatIcon,
    DebianIcon,
    SuseIcon,
    CisaIcon,
    Rapid7Icon,
    TenableIcon,
    QualysIcon,
    MitreIcon,
    LinuxIcon
} from './IconComponents';
import { motion, AnimatePresence } from 'motion/react';

interface UpdatesModalProps {
    onClose: () => void;
    isOpen: boolean;
}

const UpdatesModal: React.FC<UpdatesModalProps> = ({ onClose, isOpen }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string>('All');
    const [activeTab, setActiveTab] = useState<'sources' | 'feeds'>('sources');

    const categories = Array.from(new Set(securityUpdates.map(u => u.category)));

    const filteredUpdates = useMemo(() => {
        return securityUpdates.filter(item => {
            const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.organization.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchQuery]);

    const filteredFeeds = useMemo(() => {
        return securityRSSFeeds.filter(feed =>
            feed.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    const getSourceIcon = (code: string) => {
        switch (code) {
            case 'NVD': return <NistIcon className="w-6 h-6 text-blue-600" />;
            case 'CVED':
            case 'CWE': return <MitreIcon className="w-6 h-6 text-blue-700" />;
            case 'EDB': return <BugIcon className="w-6 h-6 text-red-600" />;
            case 'MSRC':
            case 'WUH':
            case 'PTD': return <MicrosoftIcon className="w-6 h-6" />;
            case 'APSB': return <AdobeIcon className="w-6 h-6 text-red-600" />;
            case 'CPU': return <OracleIcon className="w-6 h-6 text-red-600" />;
            case 'GCR':
            case 'ASB': return <GoogleIcon className="w-6 h-6" />;
            case 'MFSA': return <MozillaIcon className="w-6 h-6" />;
            case 'USN': return <UbuntuIcon className="w-6 h-6 text-orange-600" />;
            case 'RHSA': return <RedHatIcon className="w-6 h-6 text-red-600" />;
            case 'DSA': return <DebianIcon className="w-6 h-6 text-pink-700" />;
            case 'SUSE-SU': return <SuseIcon className="w-6 h-6 text-green-600" />;
            case 'KEV': return <CisaIcon className="w-6 h-6 text-blue-800" />;
            case 'R7VED': return <Rapid7Icon className="w-6 h-6 text-orange-500" />;
            case 'TSF': return <TenableIcon className="w-6 h-6 text-blue-900" />;
            case 'QVTP': return <QualysIcon className="w-6 h-6 text-blue-500" />;
            case 'ASU': return <AppleIcon className="w-6 h-6" />;
            default: return <DatabaseIcon className="w-6 h-6 text-slate-500" />;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-slate-50 dark:bg-[#0a0a0a] flex flex-col h-full overflow-y-auto">
            {/* Hero Header */}
            <motion.header
                initial={{ height: "40vh" }}
                animate={{ height: "35vh" }}
                className="relative overflow-hidden shrink-0"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-slate-900" />
                <div className="absolute inset-0 bg-black/20 backdrop-filter backdrop-blur-[2px]" />

                <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-50 dark:from-[#0a0a0a] to-transparent z-10" />

                <div className="container mx-auto px-6 relative z-20 h-full flex flex-col justify-center">
                    <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                                <RssIcon className="w-6 h-6 text-blue-300" />
                            </div>
                            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-100 text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-blue-400/30">Live Intelligence</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-lg">Updates & Feeds</h1>
                        <p className="text-xl text-blue-100/80 max-w-2xl leading-relaxed">Real-time vulnerability databases, patch management, and security intelligence feeds.</p>

                        <div className="flex items-center gap-4 mt-6 text-sm text-blue-200/60 font-mono">
                            <span className="flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                Live Updates
                            </span>
                            <span>•</span>
                            <span>Last sync: {new Date().toLocaleString()}</span>
                        </div>
                    </motion.div>
                </div>
            </motion.header>

            {/* Main Content */}
            <main className="flex-grow -mt-10 relative z-20 container mx-auto px-4 sm:px-6 pb-20">
                <div className="bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-white/5 p-6 sm:p-8 min-h-[60vh] flex flex-col gap-8">

                    {/* Controls */}
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center sticky top-0 z-30 bg-white/80 dark:bg-[#111]/90 backdrop-blur-md py-4 -mx-4 px-4 border-b border-slate-200 dark:border-white/5">
                        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-white/5 rounded-xl">
                            <button
                                onClick={() => setActiveTab('sources')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'sources' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                            >
                                Update Sources
                            </button>
                            <button
                                onClick={() => setActiveTab('feeds')}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'feeds' ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                            >
                                RSS Feeds
                            </button>
                        </div>

                        {activeTab === 'sources' && (
                            <div className="flex overflow-x-auto gap-2 max-w-full pb-2 md:pb-0 scrollbar-hide">
                                <button onClick={() => setActiveCategory('All')} className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeCategory === 'All' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400'}`}>All Categories</button>
                                {categories.map((cat) => (
                                    <button key={cat} onClick={() => setActiveCategory(cat)} className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeCategory === cat ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400'}`}>{cat}</button>
                                ))}
                            </div>
                        )}

                        <div className="relative w-full md:w-64">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder={activeTab === 'sources' ? "Search updates..." : "Search feeds..."}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-100 dark:bg-white/5 border-none text-sm focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Stats Section (only on sources tab) */}
                    {activeTab === 'sources' && !searchQuery && activeCategory === 'All' && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col items-center text-center">
                                <div className="mb-2">
                                    <NistIcon className="w-8 h-8 text-blue-600" />
                                </div>
                                <span className="text-lg font-bold dark:text-white">NVD</span>
                                <span className="text-xs text-slate-500">Real-time CVEs</span>
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col items-center text-center">
                                <div className="mb-2">
                                    <MicrosoftIcon className="w-8 h-8" />
                                </div>
                                <span className="text-lg font-bold dark:text-white">MSRC</span>
                                <span className="text-xs text-slate-500">Patch Tuesday</span>
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col items-center text-center">
                                <div className="mb-2">
                                    <CisaIcon className="w-8 h-8 text-blue-800" />
                                </div>
                                <span className="text-lg font-bold dark:text-white">CISA KEV</span>
                                <span className="text-xs text-slate-500">Exploited CVEs</span>
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col items-center text-center">
                                <div className="mb-2">
                                    <BugIcon className="w-8 h-8 text-red-600" />
                                </div>
                                <span className="text-lg font-bold dark:text-white">Exploit-DB</span>
                                <span className="text-xs text-slate-500">Daily Exploits</span>
                            </div>
                        </div>
                    )}

                    {/* Content Grid */}
                    <AnimatePresence mode="wait">
                        {activeTab === 'sources' ? (
                            <motion.div
                                key="sources"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            >
                                {filteredUpdates.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        whileHover={{ y: -5 }}
                                        className="group relative bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 p-6 hover:border-blue-500/30 hover:shadow-xl transition-all duration-300 flex flex-col"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center shrink-0 p-1.5">
                                                    {getSourceIcon(item.code || '')}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900 dark:text-white leading-tight group-hover:text-blue-500 transition-colors">{item.name}</h3>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.organization}</p>
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase shrink-0 ${item.access === 'Free' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                                                {item.access}
                                            </span>
                                        </div>

                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 flex-grow">{item.description}</p>

                                        <div className="grid grid-cols-2 gap-4 mb-4 text-xs text-slate-500 dark:text-slate-400">
                                            <div>
                                                <span className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Frequency</span>
                                                {item.frequency}
                                            </div>
                                            <div>
                                                <span className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Coverage</span>
                                                {item.coverage}
                                            </div>
                                        </div>

                                        <div className="space-y-3 mb-6">
                                            <div>
                                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Key Features</h4>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {item.keyFeatures.map((feature, i) => (
                                                        <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                                                            {feature}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="mt-auto block w-full py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 text-center text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all flex items-center justify-center gap-2">
                                            Official Website <GlobeIcon className="w-4 h-4" />
                                        </a>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="feeds"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-4"
                            >
                                <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-xl text-amber-800 dark:text-amber-200 text-sm flex items-center gap-3">
                                    <RssIcon className="w-5 h-5 shrink-0" />
                                    These are raw RSS feed URLs for use in your aggregator of choice.
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    {filteredFeeds.map((feed, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-blue-500/30 transition-colors">
                                            <div className="p-2 rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                                                <RssIcon className="w-4 h-4" />
                                            </div>
                                            <div className="flex-grow min-w-0">
                                                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{feed}</p>
                                            </div>
                                            <a href={feed} target="_blank" rel="noopener noreferrer" className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                                                <GlobeIcon className="w-4 h-4" />
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default UpdatesModal;

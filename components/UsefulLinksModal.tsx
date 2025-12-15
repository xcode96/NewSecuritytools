import React, { useState, useMemo, useEffect } from 'react';
import { usefulLinksData, LinkCategory } from '../data/usefulLinks';
import {
    XMarkIcon,
    LinkIcon,
    SearchIcon,
    GlobeIcon,
    SparklesIcon
} from './IconComponents';
import { motion } from 'motion/react';

interface UsefulLinksModalProps {
    onClose: () => void;
    isOpen: boolean;
}

const UsefulLinksModal: React.FC<UsefulLinksModalProps> = ({ onClose, isOpen }) => {
    const [activeCategory, setActiveCategory] = useState<LinkCategory | 'All'>('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const filteredLinks = useMemo(() => {
        return usefulLinksData.filter(item => {
            const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchQuery]);

    const categories: (LinkCategory)[] = [
        'OSINT & Investigation', 'Web Security Testing', 'Malware Analysis',
        'Vulnerability Research', 'Privacy & Anonymity', 'Forensics & Analysis',
        'Social Engineering', 'Cryptography & Encoding', 'Network Analysis'
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
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 via-blue-700 to-indigo-900" />
                <div className="absolute inset-0 bg-black/20 backdrop-filter backdrop-blur-[2px]" />

                {/* Decorative Elements */}
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
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
                                <LinkIcon className="w-6 h-6 text-cyan-300" />
                            </div>
                            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-100 text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-cyan-400/30">
                                Resources
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-lg">
                            Useful Links
                        </h1>
                        <p className="text-xl text-cyan-100/80 max-w-2xl leading-relaxed">
                            Curated directory of {usefulLinksData.length} essential cybersecurity resources, tools, and platforms.
                        </p>
                    </motion.div>
                </div>
            </motion.header>

            {/* Main Content */}
            <main className="flex-grow -mt-10 relative z-20 container mx-auto px-4 sm:px-6 pb-20">
                <div className="bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-white/5 p-6 sm:p-8 min-h-[60vh] flex flex-col md:flex-row gap-8">

                    {/* Sidebar Filters */}
                    <div className="w-full md:w-72 shrink-0 space-y-6">
                        <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search resources..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-white/5 border-none focus:ring-2 focus:ring-cyan-500/50 text-sm transition-all"
                            />
                        </div>

                        <div className="space-y-1">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Categories</h3>
                            <button
                                onClick={() => setActiveCategory('All')}
                                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all flex justify-between items-center ${activeCategory === 'All'
                                        ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                                    }`}
                            >
                                <span>All Categories</span>
                                <span className={`text-xs px-2 py-0.5 rounded-md ${activeCategory === 'All' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-white/10'}`}>
                                    {usefulLinksData.length}
                                </span>
                            </button>
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category)}
                                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex justify-between items-center ${activeCategory === category
                                            ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                                        }`}
                                >
                                    <span className="truncate">{category}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Links Grid */}
                    <div className="flex-1">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                                {activeCategory === 'All' ? 'All Resources' : activeCategory}
                            </h2>
                            <span className="text-sm font-medium text-slate-500">
                                {filteredLinks.length} results
                            </span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                            {filteredLinks.map((item) => (
                                <motion.a
                                    key={item.id}
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ y: -5 }}
                                    className="group relative flex flex-col bg-white dark:bg-white/5 rounded-2xl p-5 border border-slate-200 dark:border-white/10 hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/10 text-2xl group-hover:scale-110 transition-transform duration-300">
                                            {item.icon}
                                        </div>
                                        <div className="p-2 rounded-full bg-slate-50 dark:bg-white/5 text-slate-400 group-hover:bg-cyan-500 group-hover:text-white transition-colors">
                                            <GlobeIcon className="w-4 h-4" />
                                        </div>
                                    </div>

                                    <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                                        {item.name}
                                    </h3>

                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed flex-grow">
                                        {item.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100 dark:border-white/5">
                                        {item.tags.slice(0, 3).map((tag, idx) => (
                                            <span key={idx} className="text-[10px] px-2 py-1 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 rounded-md font-medium">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </motion.a>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UsefulLinksModal;

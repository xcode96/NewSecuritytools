import React, { useState, useMemo, useEffect } from 'react';
import {
    youtubersData,
    channelStats
} from '../data/youtubers';
import {
    XMarkIcon,
    YoutubeIcon,
    SearchIcon,
    UsersIcon,
    TagIcon
} from './IconComponents';
import { motion } from 'motion/react';

interface YouTubersModalProps {
    onClose: () => void;
    isOpen: boolean;
}

const YouTubersModal: React.FC<YouTubersModalProps> = ({ onClose, isOpen }) => {
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const filteredYouTubers = useMemo(() => {
        return youtubersData.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesSearch;
        });
    }, [searchQuery]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-slate-50 dark:bg-[#0a0a0a] flex flex-col h-full overflow-y-auto">
            {/* Hero Header */}
            <motion.header
                initial={{ height: "40vh" }}
                animate={{ height: "35vh" }}
                className="relative overflow-hidden shrink-0"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF0000] via-[#cc0000] to-[#990000]" />
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
                                <YoutubeIcon className="w-6 h-6 text-white" />
                            </div>
                            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/30">
                                Content Creators
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-lg">
                            YouTubers & Educators
                        </h1>
                        <p className="text-xl text-red-50/80 max-w-2xl leading-relaxed">
                            Discover the best cybersecurity content creators, tutorials, and educational channels.
                        </p>
                    </motion.div>
                </div>
            </motion.header>

            {/* Main Content */}
            <main className="flex-grow -mt-10 relative z-20 container mx-auto px-4 sm:px-6 pb-20">
                <div className="bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-white/5 p-6 sm:p-8 min-h-[60vh] flex flex-col gap-8">

                    {/* Controls */}
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center border-b border-slate-200 dark:border-white/10 pb-6">
                        {/* Stats Summary */}
                        <div className="flex gap-6 text-sm bg-slate-50 dark:bg-white/5 p-3 rounded-xl border border-slate-100 dark:border-white/5">
                            <div className="flex items-center gap-2">
                                <UsersIcon className="w-4 h-4 text-slate-400" />
                                <span className="font-bold text-slate-700 dark:text-slate-300">{channelStats.total} Channels</span>
                            </div>
                            <div className="w-px h-4 bg-slate-300 dark:bg-white/10" />
                            <div className="flex items-center gap-2">
                                <TagIcon className="w-4 h-4 text-slate-400" />
                                <span className="font-bold text-slate-700 dark:text-slate-300">{channelStats.categories} Categories</span>
                            </div>
                            <div className="w-px h-4 bg-slate-300 dark:bg-white/10" />
                            <div className="flex items-center gap-2">
                                <span className="font-black text-red-500">{channelStats.audience}</span>
                                <span className="font-medium text-slate-500 dark:text-slate-400">Audience</span>
                            </div>
                        </div>

                        <div className="relative w-full md:w-96 group">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <SearchIcon className="w-4 h-4 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search creators, topics, tags..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredYouTubers.map((user) => (
                            <motion.div
                                key={user.id}
                                whileHover={{ y: -5 }}
                                className="group bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 p-6 hover:shadow-xl hover:shadow-red-500/10 hover:border-red-500/30 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-white/10 dark:to-white/5 flex items-center justify-center mb-4 shadow-inner">
                                    <span className="text-2xl font-black text-slate-400 dark:text-slate-500 select-none">
                                        {user.name.charAt(0)}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-tight group-hover:text-red-500 transition-colors">
                                    {user.name}
                                </h3>

                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 line-clamp-2 min-h-[2.5em] leading-relaxed px-2">
                                    {user.description}
                                </p>

                                <div className="flex flex-wrap justify-center gap-1.5 mb-6 w-full">
                                    {user.tags.slice(0, 3).map((tag, i) => (
                                        <span key={i} className="text-[10px] px-2 py-1 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-md text-slate-600 dark:text-slate-400">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <a
                                    href={user.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-auto w-full py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/30 transition-all flex items-center justify-center gap-2 transform active:scale-95"
                                >
                                    <YoutubeIcon className="w-4 h-4" />
                                    Visit Channel
                                </a>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default YouTubersModal;

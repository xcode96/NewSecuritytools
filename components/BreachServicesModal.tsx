import React, { useState, useMemo, useEffect } from 'react';
import {
    breachServices,
    ServiceCategory,
    breachStats,
    bestPractices,
    legalDisclaimer
} from '../data/breachServices';
import {
    XMarkIcon,
    ShieldCheckIcon,
    SearchIcon,
    GlobeIcon,
    InfoIcon
} from './IconComponents';
import { motion } from 'motion/react';

interface BreachServicesModalProps {
    onClose: () => void;
    isOpen: boolean;
}

const BreachServicesModal: React.FC<BreachServicesModalProps> = ({ onClose, isOpen }) => {
    const [activeCategory, setActiveCategory] = useState<ServiceCategory | 'All'>('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const filteredServices = useMemo(() => {
        return breachServices.filter(item => {
            const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchQuery]);

    const categories: ServiceCategory[] = [
        'Free Services',
        'Premium Services',
        'Intelligence Platforms',
        'Community Services'
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
                <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-crimson-700 to-rose-900" />
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
                                <ShieldCheckIcon className="w-6 h-6 text-red-300" />
                            </div>
                            <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-100 text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-red-400/30">
                                Data Breach Intelligence
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-lg">
                            Breach Check Services
                        </h1>
                        <p className="text-xl text-red-100/80 max-w-2xl leading-relaxed">
                            Identify and mitigate data exposure risks with these powerful tools and intelligence platforms.
                        </p>
                    </motion.div>
                </div>
            </motion.header>

            {/* Main Content */}
            <main className="flex-grow -mt-10 relative z-20 container mx-auto px-4 sm:px-6 pb-20">
                <div className="bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-white/5 p-6 sm:p-8 min-h-[60vh] flex flex-col gap-8">

                    {/* Controls */}
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center border-b border-slate-200 dark:border-white/10 pb-6">
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                            <button
                                onClick={() => setActiveCategory('All')}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeCategory === 'All'
                                    ? 'bg-red-600 text-white shadow-lg shadow-red-500/30 scale-105'
                                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
                                    }`}
                            >
                                All Services
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeCategory === cat
                                        ? 'bg-red-600 text-white shadow-lg shadow-red-500/30 scale-105'
                                        : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="relative w-full md:w-72 group">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <SearchIcon className="w-4 h-4 text-slate-400 group-focus-within:text-red-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search services..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar: Stats & Best Practices */}
                        <div className="lg:w-72 flex-shrink-0 space-y-6">
                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/10 text-center hover:border-red-500/30 transition-colors">
                                    <div className="text-2xl font-black text-slate-900 dark:text-white">{breachStats.total}</div>
                                    <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Total</div>
                                </div>
                                <div className="bg-white dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/10 text-center hover:border-green-500/30 transition-colors">
                                    <div className="text-2xl font-black text-green-500">{breachStats.free}</div>
                                    <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Free</div>
                                </div>
                                <div className="col-span-2 bg-gradient-to-r from-purple-900/10 to-purple-900/5 dark:bg-white/5 p-4 rounded-xl border border-purple-200 dark:border-white/10 text-center hover:border-purple-500/30 transition-colors">
                                    <div className="text-2xl font-black text-purple-600 dark:text-purple-400">{breachStats.premium}</div>
                                    <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Premium Services</div>
                                </div>
                            </div>

                            {/* Best Practices */}
                            <div className="bg-gradient-to-br from-slate-900 to-red-950 rounded-xl p-5 text-white shadow-xl border border-red-900/30">
                                <h3 className="font-bold mb-4 flex items-center gap-2 text-sm">
                                    <ShieldCheckIcon className="w-4 h-4 text-green-400" />
                                    Protection Tips
                                </h3>
                                <div className="space-y-4">
                                    {bestPractices.map((bp, i) => (
                                        <div key={i}>
                                            <div className="text-xs font-bold text-green-400 mb-0.5 uppercase tracking-wide">{bp.title}</div>
                                            <div className="text-[10px] text-slate-300 leading-relaxed">{bp.description}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="flex-1">
                            <div className="mb-4 flex justify-between items-center">
                                <h3 className="font-bold text-slate-700 dark:text-slate-300">
                                    {activeCategory === 'All' ? 'All Services' : activeCategory}
                                </h3>
                                <span className="text-xs font-medium text-slate-500 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-full border border-slate-200 dark:border-white/10">
                                    {filteredServices.length} entries
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {filteredServices.map((service) => (
                                    <motion.div
                                        key={service.id}
                                        whileHover={{ y: -5 }}
                                        className="group bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 p-6 hover:shadow-xl hover:shadow-red-500/10 hover:border-red-500/30 transition-all duration-300 flex flex-col"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="text-3xl group-hover:scale-110 transition-transform duration-300">{service.icon}</div>
                                                <div>
                                                    <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-red-500 transition-colors">{service.name}</h4>
                                                    <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{service.category}</div>
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase border ${service.type === 'Free' ? 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-300 dark:border-green-900/30' :
                                                'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-900/30'
                                                }`}>
                                                {service.type}
                                            </span>
                                        </div>

                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-5 line-clamp-3 leading-relaxed">
                                            {service.description}
                                        </p>

                                        <div className="mb-5 bg-slate-50 dark:bg-white/5 p-3 rounded-lg border border-slate-100 dark:border-white/5">
                                            <h5 className="text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-wider">Key Features</h5>
                                            <div className="flex flex-wrap gap-1.5">
                                                {service.keyFeatures.map((feature, i) => (
                                                    <span key={i} className="text-[10px] px-1.5 py-0.5 bg-white dark:bg-black/20 border border-slate-100 dark:border-white/5 rounded text-slate-600 dark:text-slate-400">
                                                        {feature}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mt-auto flex items-center justify-between pt-2">
                                            <div className="flex gap-2">
                                                {service.tags.slice(0, 3).map((tag, i) => (
                                                    <span key={i} className="text-[10px] text-slate-400 font-medium">#{tag}</span>
                                                ))}
                                            </div>
                                            <a href={service.link} className="flex items-center text-xs font-bold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg">
                                                Check Data →
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

export default BreachServicesModal;

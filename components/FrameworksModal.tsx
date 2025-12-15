import React, { useState, useMemo, useEffect } from 'react';
import {
    frameworksData,
    FrameworkCategory,
    frameworkStats,
    comparisonMatrix,
    bestPractices,
    selectionGuide,
    latestUpdates
} from '../data/frameworks';
import {
    XMarkIcon,
    FrameworkIcon,
    SearchIcon,
    GridIcon,
    BookIcon,
    GlobeIcon,
    CheckIcon,
    AwardIcon
} from './IconComponents';
import { motion } from 'motion/react';

interface FrameworksModalProps {
    onClose: () => void;
    isOpen: boolean;
}

const FrameworksModal: React.FC<FrameworksModalProps> = ({ onClose, isOpen }) => {
    const [activeTab, setActiveTab] = useState<'directory' | 'guides'>('directory');
    const [activeCategory, setActiveCategory] = useState<FrameworkCategory | 'All'>('All');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const filteredFrameworks = useMemo(() => {
        return frameworksData.filter(item => {
            const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.code.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchQuery]);

    const quickAccess = [
        { name: 'Risk & Governance', cat: 'Risk Management & Governance', icon: '🏛️' },
        { name: 'Industry Compliance', cat: 'Industry-Specific Compliance', icon: '🏥' },
        { name: 'Security Controls', cat: 'Security Controls & Benchmarks', icon: '🛡️' },
        { name: 'Threat Intelligence', cat: 'Threat Intelligence & Attack Frameworks', icon: '🎯' },
        { name: 'Pentesting', cat: 'Penetration Testing & Assessment', icon: '🔴' },
        { name: 'Application Security', cat: 'Application Security', icon: '💻' },
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
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-blue-800 to-indigo-900" />
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
                                <FrameworkIcon className="w-6 h-6 text-blue-300" />
                            </div>
                            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-100 text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-blue-400/30">
                                Governance & Standards
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-lg">
                            CyberSecurity Frameworks
                        </h1>
                        <p className="text-xl text-blue-100/80 max-w-2xl leading-relaxed">
                            Comprehensive collection of security frameworks, standards, and methodologies for compliance and risk management.
                        </p>
                    </motion.div>
                </div>
            </motion.header>

            {/* Main Content */}
            <main className="flex-grow -mt-10 relative z-20 container mx-auto px-4 sm:px-6 pb-20">
                <div className="bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-white/5 p-6 sm:p-8 min-h-[60vh] flex flex-col gap-8">

                    {/* Tabs */}
                    <div className="flex flex-col md:flex-row gap-6 items-center border-b border-slate-200 dark:border-white/10 pb-4">
                        <div className="flex w-full md:w-auto p-1 bg-slate-100 dark:bg-white/5 rounded-xl">
                            <button
                                onClick={() => setActiveTab('directory')}
                                className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'directory'
                                    ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-md'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                    }`}
                            >
                                <GridIcon className="w-4 h-4" />
                                Framework Directory
                            </button>
                            <button
                                onClick={() => setActiveTab('guides')}
                                className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'guides'
                                    ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-md'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                    }`}
                            >
                                <BookIcon className="w-4 h-4" />
                                Guides & Comparison
                            </button>
                        </div>

                        {activeTab === 'directory' && (
                            <div className="relative w-full md:w-96 ml-auto group">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                    <SearchIcon className="w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search frameworks..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                                />
                            </div>
                        )}
                    </div>

                    {activeTab === 'directory' ? (
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Filter Sidebar */}
                            <div className="lg:w-72 flex-shrink-0 space-y-6">
                                <div className="space-y-2">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Quick Access</h3>
                                    <div className="grid grid-cols-1 gap-2">
                                        {quickAccess.map((qa) => (
                                            <button
                                                key={qa.name}
                                                onClick={() => setActiveCategory(qa.cat as any)}
                                                className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left group ${activeCategory === qa.cat
                                                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                                                    : 'bg-white dark:bg-white/5 border-slate-100 dark:border-white/5 hover:border-blue-300 dark:hover:border-blue-700'
                                                    }`}
                                            >
                                                <span className="text-xl group-hover:scale-110 transition-transform">{qa.icon}</span>
                                                <span className={`text-xs font-bold ${activeCategory === qa.cat ? 'text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300'}`}>{qa.name}</span>
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => setActiveCategory('All')}
                                            className={`mt-2 w-full py-2.5 text-xs font-bold rounded-xl border transition-all ${activeCategory === 'All'
                                                ? 'bg-blue-600 text-white border-transparent'
                                                : 'bg-transparent border-slate-200 dark:border-white/10 text-slate-500 hover:text-blue-500'
                                                }`}
                                        >
                                            View All Frameworks
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-xl p-5 text-white shadow-lg">
                                    <h3 className="font-bold mb-4 text-sm flex items-center gap-2">
                                        <AwardIcon className="w-4 h-4 text-yellow-400" />
                                        Most Adopted
                                    </h3>
                                    <div className="space-y-4">
                                        {frameworkStats.mostAdopted.map((stat) => (
                                            <div key={stat.name}>
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="font-semibold text-blue-100">{stat.name}</span>
                                                    <span className="text-blue-200">{stat.adoption}%</span>
                                                </div>
                                                <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                                                    <div className="bg-blue-400 h-full rounded-full" style={{ width: `${stat.adoption}%` }}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Grid */}
                            <div className="flex-1">
                                <div className="mb-4 flex justify-between items-center">
                                    <h3 className="font-bold text-slate-700 dark:text-slate-300">
                                        {activeCategory === 'All' ? 'All Frameworks' : activeCategory}
                                    </h3>
                                    <span className="text-xs font-medium text-slate-500 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-full border border-slate-200 dark:border-white/10">
                                        {filteredFrameworks.length} entries
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {filteredFrameworks.map((fw) => (
                                        <motion.div
                                            key={fw.id}
                                            whileHover={{ y: -5 }}
                                            className="group bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 p-6 hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-500/30 transition-all duration-300 flex flex-col"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <div className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 tracking-wider mb-1">
                                                        {fw.code}
                                                    </div>
                                                    <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{fw.name}</h4>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{fw.organization}</div>
                                                </div>
                                                {fw.compliance !== 'Voluntary' && (
                                                    <span className="px-2 py-1 rounded bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30 text-[10px] font-bold uppercase">
                                                        {fw.compliance}
                                                    </span>
                                                )}
                                            </div>

                                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 line-clamp-3 leading-relaxed">
                                                {fw.description}
                                            </p>

                                            <div className="mt-auto space-y-5">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {fw.keyComponents.slice(0, 4).map((comp, i) => (
                                                        <span key={i} className="text-[10px] px-2 py-1 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-md text-slate-500 dark:text-slate-400 font-medium">
                                                            {comp}
                                                        </span>
                                                    ))}
                                                    {fw.keyComponents.length > 4 && (
                                                        <span className="text-[10px] px-2 py-1 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-md text-slate-500 dark:text-slate-400 font-medium">
                                                            +{fw.keyComponents.length - 4}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                                                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 font-medium">
                                                        <GlobeIcon className="w-3 h-3 mr-1.5 opacity-70" />
                                                        {fw.industry}
                                                    </div>
                                                    <a href={fw.link} className="flex items-center text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                                                        Official Site →
                                                    </a>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Sidebar Guides */}
                            <div className="lg:col-span-1 space-y-8">
                                <div className="bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 p-6">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                                        <AwardIcon className="w-5 h-5 text-blue-500" />
                                        Selection Guide
                                    </h3>

                                    <div className="space-y-6">
                                        {[
                                            { title: "For Beginners", items: selectionGuide.beginners, color: "bg-green-500" },
                                            { title: "For Compliance", items: selectionGuide.compliance, color: "bg-blue-500" },
                                            { title: "Advanced Teams", items: selectionGuide.advanced, color: "bg-red-500" }
                                        ].map((section) => (
                                            <div key={section.title}>
                                                <h4 className="text-xs font-bold uppercase text-slate-400 mb-3 tracking-wider">{section.title}</h4>
                                                <ul className="space-y-3">
                                                    {section.items.map(item => (
                                                        <li key={item.name} className="flex gap-3">
                                                            <div className={`w-1.5 h-1.5 rounded-full ${section.color} mt-1.5 flex-shrink-0 shadow-[0_0_8px_currentColor] opacity-80`}></div>
                                                            <div>
                                                                <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{item.name}</div>
                                                                <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</div>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-slate-800 to-black rounded-xl p-6 text-white border border-white/10">
                                    <h3 className="font-bold mb-4 flex items-center gap-2 text-sm">
                                        <CheckIcon className="w-4 h-4 text-green-400" />
                                        Implementation Tips
                                    </h3>
                                    <div className="space-y-4">
                                        {bestPractices.map((bp, i) => (
                                            <div key={i} className="flex gap-3">
                                                <div className="text-green-400 font-bold">•</div>
                                                <div>
                                                    <div className="text-sm font-bold text-white mb-0.5">{bp.title}</div>
                                                    <div className="text-xs text-slate-400 leading-relaxed">{bp.desc}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Matrix & Updates */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 p-6 overflow-hidden">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Framework Comparison Matrix</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left border-collapse">
                                            <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-white/5">
                                                <tr>
                                                    <th className="px-4 py-3 rounded-l-lg">Framework</th>
                                                    <th className="px-4 py-3">Industry</th>
                                                    <th className="px-4 py-3">Complexity</th>
                                                    <th className="px-4 py-3">Cost</th>
                                                    <th className="px-4 py-3">Adoption</th>
                                                    <th className="px-4 py-3 rounded-r-lg">Maturity</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                                                {comparisonMatrix.map((row, i) => (
                                                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                                        <td className="px-4 py-4 font-bold text-slate-900 dark:text-white">{row.framework}</td>
                                                        <td className="px-4 py-4 text-slate-600 dark:text-slate-400 text-xs">{row.industry}</td>
                                                        <td className="px-4 py-4">
                                                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase border ${row.complexity === 'High' ? 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-300 dark:border-red-900/30' :
                                                                row.complexity === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-900/30' :
                                                                    'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-300 dark:border-green-900/30'
                                                                }`}>{row.complexity}</span>
                                                        </td>
                                                        <td className="px-4 py-4 text-slate-600 dark:text-slate-400 text-xs">{row.cost}</td>
                                                        <td className="px-4 py-4 text-slate-600 dark:text-slate-400 text-xs">{row.adoption}</td>
                                                        <td className="px-4 py-4 text-slate-600 dark:text-slate-400 text-xs">{row.maturity}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 p-6">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Latest Updates</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {latestUpdates.map((update, i) => (
                                            <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                                                <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 mb-1 uppercase tracking-wider">{update.date}</div>
                                                <div className="font-bold text-slate-900 dark:text-white mb-2 text-sm">{update.name}</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{update.desc}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default FrameworksModal;

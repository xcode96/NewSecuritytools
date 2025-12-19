import React, { useState, useMemo, useEffect } from 'react';
import { platformsData, PlatformCategory } from '../data/platforms';
import { fetchPlatforms, addPlatform, updatePlatform, deletePlatform } from '../services/supabaseService';
import {
    XMarkIcon,
    GlobeIcon,
    SearchIcon,
    SparklesIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon
} from './IconComponents';
import { motion, AnimatePresence } from 'motion/react';

interface PlatformsModalProps {
    onClose: () => void;
    isOpen: boolean;
    isAdmin?: boolean;
}

const PlatformsModal: React.FC<PlatformsModalProps> = ({ onClose, isOpen, isAdmin = false }) => {
    const [platforms, setPlatforms] = useState<any[]>([]);
    const [activeCategory, setActiveCategory] = useState<PlatformCategory | 'All'>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<any>(null);

    const loadStartData = async () => {
        const data = await fetchPlatforms();
        if (data && data.length > 0) {
            const mapped = data.map((item: any) => {
                const staticItem = platformsData.find(p => p.name === item.name);
                const resolvedUrl = item.url || item.link || staticItem?.url || '';

                return {
                    ...item,
                    payoutRange: item.pricing_model,
                    notableCompanies: item.notable_companies,
                    url: resolvedUrl,
                    link: resolvedUrl
                };
            });
            setPlatforms(mapped);
        } else {
            setPlatforms(platformsData);
        }
    };

    useEffect(() => {
        loadStartData();
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const filteredPlatforms = useMemo(() => {
        return platforms.filter(item => {
            const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.tags || []).some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchQuery, platforms]);

    const categories: PlatformCategory[] = [
        'Salesforce',
        'ServiceNow',
        'SAP',
        'Workday',
        'Oracle',
        'Microsoft 365'
    ];

    const handleAddClick = () => {
        setEditForm({ name: '', description: '', category: 'Salesforce', url: '', tags: '', features: '' });
        setIsEditing(true);
    };

    const handleEditClick = (item: any) => {
        setEditForm({
            ...item,
            tags: Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || ''),
            features: Array.isArray(item.features) ? item.features.join('\n') : (item.features || '')
        });
        setIsEditing(true);
    };

    const handleDeleteClick = async (id: number) => {
        if (window.confirm('Delete this platform?')) {
            const success = await deletePlatform(id);
            if (success) {
                setPlatforms(prev => prev.filter(p => p.id !== id));
            } else {
                alert('Failed to delete');
            }
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            name: editForm.name,
            description: editForm.description,
            category: editForm.category,
            url: editForm.url,
            // tags? DB doesn't have tags column for platforms? 
            // My script added rating, founded, hackers, notable_companies.
            // Features exists.
            features: editForm.features.split('\n').map((f: string) => f.trim()).filter(Boolean)
        };

        if (editForm.id) {
            const success = await updatePlatform(editForm.id, payload);
            if (success) loadStartData();
        } else {
            const success = await addPlatform(payload);
            if (success) loadStartData();
        }
        setIsEditing(false);
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
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-fuchsia-700 to-purple-900" />
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
                                <GlobeIcon className="w-6 h-6 text-fuchsia-300" />
                            </div>
                            <span className="px-3 py-1 rounded-full bg-fuchsia-500/20 text-fuchsia-100 text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-fuchsia-400/30">Enterprise Security</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-lg">Enterprise Platforms</h1>
                        <p className="text-xl text-fuchsia-100/80 max-w-2xl leading-relaxed">Security guides and tools for major enterprise platforms like Salesforce, ServiceNow, SAP, and more.</p>
                    </motion.div>
                </div>
            </motion.header>

            {/* Main Content */}
            <main className="flex-grow -mt-10 relative z-20 container mx-auto px-4 sm:px-6 pb-20">
                <div className="bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-white/5 p-6 sm:p-8 min-h-[60vh] flex flex-col gap-8">

                    {/* Controls */}
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        {isAdmin && (
                            <button onClick={handleAddClick} className="px-4 py-2 rounded-lg bg-fuchsia-600 text-white font-bold flex items-center gap-2 hover:bg-fuchsia-700 transition-colors shadow-lg">
                                <PlusIcon className="w-4 h-4" /> Add Platform
                            </button>
                        )}
                        <div className="flex flex-wrap gap-2 justify-center">
                            <button onClick={() => setActiveCategory('All')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeCategory === 'All' ? 'bg-fuchsia-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400'}`}>All</button>
                            {categories.map((cat) => (
                                <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeCategory === cat ? 'bg-fuchsia-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400'}`}>{cat}</button>
                            ))}
                        </div>
                        <div className="relative w-full md:w-64">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input type="text" placeholder="Search platforms..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-100 dark:bg-white/5 border-none text-sm" />
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPlatforms.map((platform) => (
                            <motion.div key={platform.id} whileHover={{ y: -5 }} className="group relative bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 p-6 hover:border-fuchsia-500/30 hover:shadow-xl transition-all duration-300">
                                {isAdmin && (
                                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                        <button onClick={(e) => { e.stopPropagation(); handleEditClick(platform); }} className="p-1.5 bg-white dark:bg-slate-800 text-blue-500 rounded-lg shadow-sm hover:scale-110"><PencilIcon className="w-3 h-3" /></button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteClick(platform.id); }} className="p-1.5 bg-white dark:bg-slate-800 text-red-500 rounded-lg shadow-sm hover:scale-110"><TrashIcon className="w-3 h-3" /></button>
                                    </div>
                                )}
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-fuchsia-500 transition-colors">{platform.name}</h3>
                                    <span className="px-2 py-1 rounded text-xs font-bold bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-600 dark:text-fuchsia-400 uppercase">{platform.category}</span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">{platform.description}</p>
                                <div className="space-y-2 mb-6">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Key Features</h4>
                                    <ul className="grid grid-cols-2 gap-2">
                                        {(platform.features || []).slice(0, 4).map((feature: string, i: number) => (
                                            <li key={i} className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                                <div className="w-1 h-1 rounded-full bg-fuchsia-500" />
                                                <span className="truncate">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <a href={platform.url} target="_blank" rel="noopener noreferrer" className="block w-full py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 text-center text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:bg-fuchsia-600 group-hover:text-white transition-all">Explore Documentation</a>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Edit Modal */}
            <AnimatePresence>
                {isEditing && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
                            <h3 className="text-xl font-bold mb-4 dark:text-white">{editForm?.id ? 'Edit Platform' : 'Add Platform'}</h3>
                            <form onSubmit={handleSave} className="space-y-4">
                                <input placeholder="Name" required value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-none" />
                                <textarea placeholder="Description" required value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-none" />
                                <select value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-none">
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <textarea placeholder="Features (one per line)" value={editForm.features} onChange={e => setEditForm({ ...editForm, features: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-none" />
                                <input placeholder="URL" value={editForm.url} onChange={e => setEditForm({ ...editForm, url: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-none" />
                                <input placeholder="Tags (comma separated)" value={editForm.tags} onChange={e => setEditForm({ ...editForm, tags: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-none" />
                                <div className="flex justify-end gap-3"><button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-slate-500">Cancel</button><button type="submit" className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg">Save</button></div>
                            </form>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PlatformsModal;

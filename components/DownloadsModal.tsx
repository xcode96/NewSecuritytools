import React, { useState, useMemo, useEffect } from 'react';
import { downloadsData, DownloadCategory } from '../data/downloads';
import { fetchDownloads, addDownload, updateDownload, deleteDownload } from '../services/supabaseService';
import {
    XMarkIcon,
    DownloadIcon,
    SearchIcon,
    SparklesIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon
} from './IconComponents';
import { motion, AnimatePresence } from 'motion/react';

interface DownloadsModalProps {
    onClose: () => void;
    isOpen: boolean;
    isAdmin?: boolean;
}

const DownloadsModal: React.FC<DownloadsModalProps> = ({ onClose, isOpen, isAdmin = false }) => {
    const [downloads, setDownloads] = useState<any[]>([]);
    const [activeCategory, setActiveCategory] = useState<DownloadCategory | 'All'>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<any>(null);

    const loadStartData = async () => {
        const data = await fetchDownloads();
        if (data && data.length > 0) {
            // Map DB fields to Component fields
            // DB: code, type, team, popularity, key_features(text[]), size, version, os(text[])
            // Component: code, type, team, popularity, keyFeatures, size, format?, author?
            // Note: `format` and `author` were in the edit form but not explicitly in `DownloadItem` interface in `data/downloads.ts`?
            // Actually `DownloadItem` has: id, name, code, type, category, team, description, popularity, keyFeatures, link.
            // It DOES NOT have `format`, `size`, `author`.
            // But the UI `editForm` was using them. 
            // In the DB I added `code`, `type`, `team`, `popularity`, `key_features`.
            // `size` exists in DB.
            const mapped = data.map((item: any) => ({
                ...item,
                keyFeatures: item.key_features || item.os, // Fallback
                link: item.url
            }));
            setDownloads(mapped);
        } else {
            setDownloads(downloadsData);
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

    const filteredDownloads = useMemo(() => {
        return downloads.filter(item => {
            const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.tags || []).some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchQuery, downloads]);

    const handleAddClick = () => {
        setEditForm({ name: '', description: '', category: 'Linux Security Distributions', url: '', format: '', size: '', author: '', tags: '' });
        setIsEditing(true);
    };

    const handleEditClick = (item: any) => {
        setEditForm({
            ...item,
            tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || ''
        });
        setIsEditing(true);
    };

    const handleDeleteClick = async (id: number) => {
        if (window.confirm('Delete download?')) {
            const success = await deleteDownload(id);
            if (success) {
                setDownloads(prev => prev.filter(d => d.id !== id));
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
            // Map UI fields to DB columns
            size: editForm.size,
            // Tags? DB doesn't have tags column for downloads in my script... I added code, type, team, popularity, key_features.
            // Oh, the local component logic uses tags for search. "tags" might need to be stored in "key_features" or a new column?
            // "keyFeatures" in data was used.
            // I'll map 'tags' to 'key_features' for now or 'os' if appropriate?
            // Actually I'll just save it to `key_features` if tags are keyed in.
            key_features: editForm.tags.split(',').map((t: string) => t.trim()).filter(Boolean),

            // Add other fields if I can edit them?
            // The Edit form has: Name, Description, Category, Format(?!), Size, Author(?!), URL, Tags.
            // It seems the UI was a bit generic.
            // I'll attempt to save what matches.
        };

        if (editForm.id && typeof editForm.id !== 'string') { // Check if valid DB ID (number/bigint usually comes as number)
            const success = await updateDownload(editForm.id, payload);
            if (success) loadStartData();
        } else if (editForm.id) {
            const success = await updateDownload(editForm.id, payload);
            if (success) loadStartData();
        } else {
            const success = await addDownload(payload);
            if (success) loadStartData();
        }
        setIsEditing(false);
    };

    const categories: DownloadCategory[] = ['Linux Security Distributions', 'Digital Forensics', 'Windows Security Tools', 'Ubuntu & Debian', 'Specialized Tools', 'Development Tools'];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-slate-50 dark:bg-[#0a0a0a] flex flex-col h-full overflow-y-auto">
            {/* Hero Header */}
            <motion.header
                initial={{ height: "40vh" }}
                animate={{ height: "35vh" }}
                className="relative overflow-hidden shrink-0"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-700 to-green-900" />
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
                                <DownloadIcon className="w-6 h-6 text-emerald-300" />
                            </div>
                            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-100 text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-emerald-400/30">
                                Resource Center
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-lg">
                            Downloads
                        </h1>
                        <p className="text-xl text-emerald-100/80 max-w-2xl leading-relaxed">
                            Essential cheat sheets, wordlists, and scripts for your security assessment toolkit.
                        </p>
                    </motion.div>
                </div>
            </motion.header>

            {/* Main Content */}
            <main className="flex-grow -mt-10 relative z-20 container mx-auto px-4 sm:px-6 pb-20">
                <div className="bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-white/5 p-6 sm:p-8 min-h-[60vh] flex flex-col gap-8">

                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        {isAdmin && (
                            <button onClick={handleAddClick} className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold flex items-center gap-2 hover:bg-emerald-700 transition-colors shadow-lg">
                                <PlusIcon className="w-4 h-4" /> Add Download
                            </button>
                        )}
                        <div className="flex flex-wrap gap-2 justify-center">
                            <button onClick={() => setActiveCategory('All')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeCategory === 'All' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400'}`}>All</button>
                            {categories.map((cat) => (
                                <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeCategory === cat ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400'}`}>{cat}</button>
                            ))}
                        </div>
                        <div className="relative w-full md:w-64">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input type="text" placeholder="Search downloads..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-100 dark:bg-white/5 border-none text-sm" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDownloads.map((item) => (
                            <motion.div key={item.id} whileHover={{ y: -5 }} className="group relative bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 p-6 hover:border-emerald-500/30 hover:shadow-xl transition-all duration-300">
                                {isAdmin && (
                                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                        <button onClick={(e) => { e.stopPropagation(); handleEditClick(item); }} className="p-1.5 bg-white dark:bg-slate-800 text-blue-500 rounded-lg shadow-sm hover:scale-110"><PencilIcon className="w-3 h-3" /></button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteClick(item.id); }} className="p-1.5 bg-white dark:bg-slate-800 text-red-500 rounded-lg shadow-sm hover:scale-110"><TrashIcon className="w-3 h-3" /></button>
                                    </div>
                                )}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/10 text-2xl group-hover:scale-110 transition-transform">📄</div>
                                    <div className="text-right">
                                        <div className="text-xs font-bold text-slate-400">{item.format}</div>
                                        <div className="text-xs font-bold text-emerald-500">{item.size}</div>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-500 transition-colors">{item.name}</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">{item.description}</p>
                                <a href={item.url} className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 text-sm font-bold group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                    <DownloadIcon className="w-4 h-4" /> Download
                                </a>
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
                            <h3 className="text-xl font-bold mb-4 dark:text-white">{editForm?.id ? 'Edit Download' : 'Add Download'}</h3>
                            <form onSubmit={handleSave} className="space-y-4">
                                <input placeholder="Name" required value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-none" />
                                <textarea placeholder="Description" required value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-none" />
                                <select value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-none">
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <div className="grid grid-cols-2 gap-4">
                                    <input placeholder="Format (PDF, ZIP)" value={editForm.format} onChange={e => setEditForm({ ...editForm, format: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-none" />
                                    <input placeholder="Size (e.g. 2MB)" value={editForm.size} onChange={e => setEditForm({ ...editForm, size: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-none" />
                                </div>
                                <input placeholder="Author" value={editForm.author} onChange={e => setEditForm({ ...editForm, author: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-none" />
                                <input placeholder="URL" value={editForm.url} onChange={e => setEditForm({ ...editForm, url: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-none" />
                                <input placeholder="Tags (comma separated)" value={editForm.tags} onChange={e => setEditForm({ ...editForm, tags: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-none" />
                                <div className="flex justify-end gap-3"><button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-slate-500">Cancel</button><button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg">Save</button></div>
                            </form>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DownloadsModal;

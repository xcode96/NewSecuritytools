import React, { useState, useMemo, useEffect } from 'react';
import { frameworksData, FrameworkCategory } from '../data/frameworks';
import {
    XMarkIcon,
    ShieldCheckIcon,
    SearchIcon,
    SparklesIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon,
    ArrowRightIcon
} from './IconComponents';
import { motion, AnimatePresence } from 'motion/react';

interface FrameworksModalProps {
    onClose: () => void;
    isOpen: boolean;
    isAdmin?: boolean;
}

const FrameworksModal: React.FC<FrameworksModalProps> = ({ onClose, isOpen, isAdmin = false }) => {
    const [frameworks, setFrameworks] = useState<any[]>(frameworksData);
    const [activeTab, setActiveTab] = useState<'directory' | 'guides'>('directory');
    const [activeCategory, setActiveCategory] = useState<FrameworkCategory | 'All'>('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Admin State
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<any>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
            // loadFrameworks();
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // const loadFrameworks = async () => {
    //     try {
    //         const data = await fetchFrameworks();
    //         if (data && data.length > 0) setFrameworks(data);
    //         else setFrameworks(frameworksData);
    //     } catch (e) {
    //         console.error(e);
    //         setFrameworks(frameworksData);
    //     }
    // };

    const filteredFrameworks = useMemo(() => {
        return frameworks.filter(item => {
            const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.tags || []).some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchQuery, frameworks]);

    const categories: FrameworkCategory[] = [
        'Risk Management & Governance',
        'Industry-Specific Compliance',
        'Security Controls & Benchmarks',
        'Threat Intelligence & Attack Frameworks',
        'Penetration Testing & Assessment',
        'Application Security',
        'Cloud Security',
        'Incident Response & Forensics'
    ];

    // Admin Handlers
    const handleAddClick = () => {
        setEditForm({ name: '', description: '', category: 'Standards', url: '', author: '', tags: '' });
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
        if (window.confirm('Delete framework?')) {
            setFrameworks(prev => prev.filter(f => f.id !== id));
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            name: editForm.name,
            description: editForm.description,
            category: editForm.category,
            url: editForm.url,
            author: editForm.author,
            tags: editForm.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
        };
        if (editForm.id) {
            setFrameworks(prev => prev.map(f => f.id === editForm.id ? { ...f, ...payload } : f));
        } else {
            const newFramework = { ...payload, id: Date.now() };
            setFrameworks(prev => [...prev, newFramework]);
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
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-blue-800 to-slate-900" />
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
                                <ShieldCheckIcon className="w-6 h-6 text-blue-300" />
                            </div>
                            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-100 text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-blue-400/30">
                                Governance & Compliance
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-lg">
                            Cybersecurity Frameworks
                        </h1>
                        <p className="text-xl text-blue-100/80 max-w-2xl leading-relaxed">
                            Comprehensive directory of industry standards, regulatory frameworks, and security controls.
                        </p>
                    </motion.div>
                </div>
            </motion.header>

            {/* Main Content */}
            <main className="flex-grow -mt-10 relative z-20 container mx-auto px-4 sm:px-6 pb-20">
                <div className="bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-white/5 p-6 sm:p-8 min-h-[60vh] flex flex-col gap-8">

                    {/* Tabs */}
                    <div className="flex border-b border-slate-200 dark:border-white/10 mb-6">
                        <button onClick={() => setActiveTab('directory')} className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors ${activeTab === 'directory' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Directory</button>
                        <button onClick={() => setActiveTab('guides')} className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors ${activeTab === 'guides' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>Implementation Guides</button>
                    </div>

                    {activeTab === 'directory' ? (
                        <>
                            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                                {isAdmin && (
                                    <button onClick={handleAddClick} className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg">
                                        <PlusIcon className="w-4 h-4" /> Add Framework
                                    </button>
                                )}
                                <div className="flex flex-wrap gap-2 justify-center">
                                    <button onClick={() => setActiveCategory('All')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeCategory === 'All' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400'}`}>All</button>
                                    {categories.map((cat) => (
                                        <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeCategory === cat ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400'}`}>{cat}</button>
                                    ))}
                                </div>
                                <div className="relative w-full md:w-64">
                                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input type="text" placeholder="Search frameworks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-100 dark:bg-white/5 border-none text-sm" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredFrameworks.map((item) => (
                                    <motion.div key={item.id} whileHover={{ y: -5 }} className="group relative bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 p-6 hover:border-blue-500/30 hover:shadow-xl transition-all duration-300">
                                        {isAdmin && (
                                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                <button onClick={(e) => { e.stopPropagation(); handleEditClick(item); }} className="p-1.5 bg-white dark:bg-slate-800 text-blue-500 rounded-lg shadow-sm hover:scale-110"><PencilIcon className="w-3 h-3" /></button>
                                                <button onClick={(e) => { e.stopPropagation(); handleDeleteClick(item.id); }} className="p-1.5 bg-white dark:bg-slate-800 text-red-500 rounded-lg shadow-sm hover:scale-110"><TrashIcon className="w-3 h-3" /></button>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">{item.name}</h3>
                                            <span className="px-2 py-1 rounded text-xs font-bold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 uppercase">{item.category}</span>
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">{item.description}</p>
                                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 text-sm font-bold group-hover:bg-blue-600 group-hover:text-white transition-all">
                                            View Details <ArrowRightIcon className="w-4 h-4" />
                                        </a>
                                    </motion.div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="p-8 text-center text-slate-500">
                            <SparklesIcon className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                            <h3 className="text-lg font-bold mb-2">Guides Coming Soon</h3>
                            <p>Detailed implementation guides for these frameworks are currently being written.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Edit Modal */}
            <AnimatePresence>
                {isEditing && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
                            <h3 className="text-xl font-bold mb-4 dark:text-white">{editForm?.id ? 'Edit Framework' : 'Add Framework'}</h3>
                            <form onSubmit={handleSave} className="space-y-4">
                                <input placeholder="Name" required value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-none" />
                                <textarea placeholder="Description" required value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-none" />
                                <select value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-none">
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <input placeholder="Author" value={editForm.author} onChange={e => setEditForm({ ...editForm, author: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-none" />
                                <input placeholder="URL" value={editForm.url} onChange={e => setEditForm({ ...editForm, url: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-none" />
                                <input placeholder="Tags (comma separated)" value={editForm.tags} onChange={e => setEditForm({ ...editForm, tags: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-none" />
                                <div className="flex justify-end gap-3"><button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-slate-500">Cancel</button><button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save</button></div>
                            </form>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FrameworksModal;

import React, { useState, useMemo, useEffect } from 'react';
import { breachServices as breachServicesData, ServiceCategory as BreachServiceCategory } from '../data/breachServices';
import {
    XMarkIcon,
    ShieldExclamationIcon,
    SearchIcon,
    SparklesIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon,
    CheckCircleIcon
} from './IconComponents';
import { motion, AnimatePresence } from 'motion/react';

interface BreachServicesModalProps {
    onClose: () => void;
    isOpen: boolean;
    isAdmin?: boolean;
}

const BreachServicesModal: React.FC<BreachServicesModalProps> = ({ onClose, isOpen, isAdmin = false }) => {
    const [services, setServices] = useState<any[]>(breachServicesData);
    const [activeCategory, setActiveCategory] = useState<BreachServiceCategory | 'All'>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<any>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
            // loadServices();
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // loadServices removed

    const filteredServices = useMemo(() => {
        return services.filter(item => {
            const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.tags || []).some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchQuery, services]);

    const categories: BreachServiceCategory[] = ['Free Services', 'Premium Services', 'Intelligence Platforms', 'Community Services'];

    const handleAddClick = () => {
        setEditForm({ name: '', description: '', category: 'Free Services', url: '', type: 'Free', key_features: '', tags: '' });
        setIsEditing(true);
    };

    const handleEditClick = (item: any) => {
        setEditForm({
            ...item,
            tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || '',
            key_features: Array.isArray(item.key_features) ? item.key_features.join('\n') : item.key_features || ''
        });
        setIsEditing(true);
    };

    const handleDeleteClick = async (id: number) => {
        if (window.confirm('Delete service?')) {
            setServices(prev => prev.filter(s => s.id !== id));
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            name: editForm.name,
            description: editForm.description,
            category: editForm.category,
            url: editForm.url,
            type: editForm.type,
            tags: editForm.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
            key_features: editForm.key_features.split('\n').map((f: string) => f.trim()).filter(Boolean)
        };
        if (editForm.id) {
            setServices(prev => prev.map(s => s.id === editForm.id ? { ...s, ...payload } : s));
        } else {
            const newService = { ...payload, id: Date.now() };
            setServices(prev => [...prev, newService]);
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
                <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-rose-700 to-pink-900" />
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
                                <ShieldExclamationIcon className="w-6 h-6 text-rose-300" />
                            </div>
                            <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-100 text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-rose-400/30">
                                Threat Intelligence
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-lg">
                            Breach Services
                        </h1>
                        <p className="text-xl text-rose-100/80 max-w-2xl leading-relaxed">
                            Tools to check if your data has been compromised in known data breaches.
                        </p>
                    </motion.div>
                </div>
            </motion.header>

            {/* Main Content */}
            <main className="flex-grow -mt-10 relative z-20 container mx-auto px-4 sm:px-6 pb-20">
                <div className="bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-white/5 p-6 sm:p-8 min-h-[60vh] flex flex-col gap-8">

                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        {isAdmin && (
                            <button onClick={handleAddClick} className="px-4 py-2 rounded-lg bg-rose-600 text-white font-bold flex items-center gap-2 hover:bg-rose-700 transition-colors shadow-lg">
                                <PlusIcon className="w-4 h-4" /> Add Service
                            </button>
                        )}
                        <div className="flex flex-wrap gap-2 justify-center">
                            <button onClick={() => setActiveCategory('All')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeCategory === 'All' ? 'bg-rose-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400'}`}>All</button>
                            {categories.map((cat) => (
                                <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeCategory === cat ? 'bg-rose-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400'}`}>{cat}</button>
                            ))}
                        </div>
                        <div className="relative w-full md:w-64">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input type="text" placeholder="Search services..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-100 dark:bg-white/5 border-none text-sm" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredServices.map((item) => (
                            <motion.div key={item.id} whileHover={{ y: -5 }} className="group relative bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 p-6 hover:border-rose-500/30 hover:shadow-xl transition-all duration-300">
                                {isAdmin && (
                                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                        <button onClick={(e) => { e.stopPropagation(); handleEditClick(item); }} className="p-1.5 bg-white dark:bg-slate-800 text-blue-500 rounded-lg shadow-sm hover:scale-110"><PencilIcon className="w-3 h-3" /></button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteClick(item.id); }} className="p-1.5 bg-white dark:bg-slate-800 text-red-500 rounded-lg shadow-sm hover:scale-110"><TrashIcon className="w-3 h-3" /></button>
                                    </div>
                                )}
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-rose-500 transition-colors">{item.name}</h3>
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${item.type === 'Free' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{item.type}</span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">{item.description}</p>
                                <ul className="space-y-2 mb-6">
                                    {(item.key_features || []).slice(0, 3).map((feat: string, i: number) => (
                                        <li key={i} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                            <CheckCircleIcon className="w-3 h-3 text-rose-500" /> {feat}
                                        </li>
                                    ))}
                                </ul>
                                <a href={item.url} target="_blank" rel="noopener noreferrer" className="block w-full py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 text-center text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:bg-rose-600 group-hover:text-white transition-all">Check Now</a>
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
                            <h3 className="text-xl font-bold mb-4 dark:text-white">{editForm?.id ? 'Edit Service' : 'Add Service'}</h3>
                            <form onSubmit={handleSave} className="space-y-4">
                                <input placeholder="Name" required value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-none" />
                                <textarea placeholder="Description" required value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-none" />
                                <select value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-none">
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <select value={editForm.type} onChange={e => setEditForm({ ...editForm, type: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-none">
                                    <option value="Free">Free</option>
                                    <option value="Premium">Premium</option>
                                    <option value="Paid">Paid</option>
                                </select>
                                <textarea placeholder="Key Features (one per line)" value={editForm.key_features} onChange={e => setEditForm({ ...editForm, key_features: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-none" />
                                <input placeholder="URL" value={editForm.url} onChange={e => setEditForm({ ...editForm, url: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-none" />
                                <input placeholder="Tags (comma separated)" value={editForm.tags} onChange={e => setEditForm({ ...editForm, tags: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-none" />
                                <div className="flex justify-end gap-3"><button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-slate-500">Cancel</button><button type="submit" className="px-4 py-2 bg-rose-600 text-white rounded-lg">Save</button></div>
                            </form>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BreachServicesModal;

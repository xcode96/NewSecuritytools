import React, { useState, useEffect, useMemo } from 'react';
import { XMarkIcon, SearchIcon, PlusIcon, TrashIcon, PencilIcon, CheckIcon, LinkIcon, ShieldCheckIcon } from './IconComponents';
import { fetchBreachServices, addBreachService, updateBreachService, deleteBreachService } from '../services/supabaseService';
import { breachServices as staticBreachServices } from '../data/breachServices';
import { motion, AnimatePresence } from 'motion/react';

interface BreachService {
    id: string | number;
    name: string;
    description: string;
    url: string;
    icon: string;
    type: string;
    category: string;
    tags: string[];
    key_features: string[];
}

interface BreachServicesModalProps {
    isOpen: boolean;
    onClose: () => void;
    isAdmin: boolean;
}

const BreachServicesModal: React.FC<BreachServicesModalProps> = ({ isOpen, onClose, isAdmin }) => {
    const [services, setServices] = useState<BreachService[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [editingService, setEditingService] = useState<BreachService | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
            loadServices();
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    const loadServices = async () => {
        setIsLoading(true);
        try {
            const data = await fetchBreachServices();
            if (data && data.length > 0) {
                // @ts-ignore
                const mapped = data.map(item => {
                    const staticItem = staticBreachServices.find(s => s.name === item.name);
                    const resolvedUrl = item.url || item.link || staticItem?.url || '';
                    return {
                        ...item,
                        url: resolvedUrl,
                        link: resolvedUrl
                    };
                });
                setServices(mapped);
            } else {
                const mappedStatic = staticBreachServices.map(s => ({
                    ...s,
                    url: s.link,
                    key_features: s.keyFeatures
                })) as unknown as BreachService[];
                setServices(mappedStatic);
            }
        } catch (err) {
            console.error("Failed to load breach services", err);
            setError("Failed to load services");
        } finally {
            setIsLoading(false);
        }
    };

    const categories = useMemo(() => ['All', ...Array.from(new Set(services.map(s => s.category)))], [services]);

    const filteredServices = useMemo(() => {
        return services.filter(service => {
            const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                service.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesCategory = activeCategory === 'All' || service.category === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [services, searchTerm, activeCategory]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingService) return;

        setIsLoading(true);
        try {
            if (editingService.id && services.some(s => s.id === editingService.id)) {
                // @ts-ignore
                await updateBreachService(editingService.id, editingService);
            } else {
                // @ts-ignore
                await addBreachService(editingService);
            }
            await loadServices();
            setEditingService(null);
        } catch (err) {
            console.error("Error saving service:", err);
            setError("Failed to save service");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string | number) => {
        if (window.confirm('Are you sure checking to delete this service?')) {
            setIsLoading(true);
            try {
                await deleteBreachService(id.toString());
                await loadServices();
            } catch (err) {
                console.error("Error deleting service:", err);
                setError("Failed to delete service");
            } finally {
                setIsLoading(false);
            }
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
                <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-rose-700 to-pink-900" />
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
                                <ShieldCheckIcon className="w-6 h-6 text-rose-300" />
                            </div>
                            <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-100 text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-rose-400/30">
                                Cyber Defense
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-lg">
                            Breach Services
                        </h1>
                        <p className="text-xl text-rose-100/80 max-w-2xl leading-relaxed">
                            Monitor, analyze, and mitigate security breaches with advanced threat intelligence tools.
                        </p>
                        {isAdmin && (
                            <button
                                onClick={() => setEditingService({
                                    id: 0, name: '', description: '', url: '', icon: '🛡️', type: 'Breach Check',
                                    category: activeCategory !== 'All' ? activeCategory : 'General', tags: [], key_features: []
                                })}
                                className="mt-6 flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-md border border-white/20 transition-all font-bold"
                            >
                                <PlusIcon className="w-5 h-5" />
                                Add Service
                            </button>
                        )}
                    </motion.div>
                </div>
            </motion.header>

            {/* Main Content */}
            <main className="flex-grow -mt-10 relative z-20 container mx-auto px-4 sm:px-6 pb-20">
                <div className="bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-white/5 p-6 sm:p-8 min-h-[60vh] flex flex-col gap-8">

                    {/* Controls */}
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeCategory === cat
                                        ? 'bg-white dark:bg-zinc-800 text-rose-600 dark:text-rose-400 shadow-md transform scale-105'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="relative w-full md:w-72 group">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <SearchIcon className="w-4 h-4 text-slate-400 group-focus-within:text-rose-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search services..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                            />
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {filteredServices.map((service) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    key={service.id}
                                    whileHover={{ y: -5 }}
                                    className="group flex flex-col bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden hover:border-rose-500/30 hover:shadow-xl hover:shadow-rose-500/10 transition-all duration-300 relative"
                                >
                                    {isAdmin && (
                                        <div className="absolute top-2 right-2 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={(e) => { e.stopPropagation(); setEditingService(service) }} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white backdrop-blur-md">
                                                <PencilIcon className="w-4 h-4" />
                                            </button>
                                            <button onClick={(e) => { e.stopPropagation(); handleDelete(service.id) }} className="p-1.5 bg-red-500/80 hover:bg-red-500 rounded-lg text-white backdrop-blur-md">
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}

                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform">
                                                {service.icon}
                                            </div>
                                            <div className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5">
                                                {service.type}
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                                            {service.name}
                                        </h3>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                                            {service.description}
                                        </p>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {service.tags && service.tags.slice(0, 3).map(tag => (
                                                <span key={tag} className="px-2 py-1 bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 text-xs rounded-md font-medium">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="mt-auto space-y-2">
                                            {service.key_features && service.key_features.slice(0, 2).map((feature, i) => (
                                                <div key={i} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                                    <CheckIcon className="w-3 h-3 text-green-500 flex-shrink-0" />
                                                    <span className="truncate">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <a
                                        href={service.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block p-3 text-center bg-slate-50 dark:bg-white/5 border-t border-slate-200 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                                    >
                                        ACCESS SERVICE →
                                    </a>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </main>

            {/* Edit Modal */}
            {editingService && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-800 z-10">
                            <h3 className="text-xl font-bold dark:text-white">
                                {editingService.id ? 'Edit Service' : 'Add New Service'}
                            </h3>
                            <button
                                onClick={() => setEditingService(null)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-500"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={editingService.name}
                                        onChange={e => setEditingService({ ...editingService, name: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                                    <textarea
                                        required
                                        rows={3}
                                        value={editingService.description}
                                        onChange={e => setEditingService({ ...editingService, description: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                                    <select
                                        value={editingService.category}
                                        onChange={e => setEditingService({ ...editingService, category: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        {categories.filter(c => c !== 'All').concat(categories.includes(editingService.category) ? [] : [editingService.category]).map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">URL</label>
                                    <input
                                        type="url"
                                        required
                                        value={editingService.url}
                                        onChange={e => setEditingService({ ...editingService, url: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Icon (Emoji)</label>
                                    <input
                                        type="text"
                                        value={editingService.icon}
                                        onChange={e => setEditingService({ ...editingService, icon: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="e.g. 🛡️"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
                                    <input
                                        type="text"
                                        value={editingService.type}
                                        onChange={e => setEditingService({ ...editingService, type: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tags (comma separated)</label>
                                    <input
                                        type="text"
                                        value={(editingService.tags || []).join(', ')}
                                        onChange={e => setEditingService({ ...editingService, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="tag1, tag2, tag3"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Key Features (comma separated)</label>
                                    <input
                                        type="text"
                                        value={(editingService.key_features || []).join(', ')}
                                        onChange={e => setEditingService({ ...editingService, key_features: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Feature 1, Feature 2"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <button
                                    type="button"
                                    onClick={() => setEditingService(null)}
                                    className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm"
                                >
                                    {editingService.id ? 'Save Changes' : 'Create Service'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BreachServicesModal;

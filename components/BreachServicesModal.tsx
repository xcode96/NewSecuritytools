import React, { useState, useEffect } from 'react';
import { XMarkIcon, SearchIcon, PlusIcon, TrashIcon, PencilIcon, CheckIcon, FunnelIcon, LinkIcon } from './IconComponents';
import { fetchBreachServices, addBreachService, updateBreachService, deleteBreachService } from '../services/supabaseService';
import { breachServices as staticBreachServices } from '../data/breachServices';

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
        if (isOpen) {
            loadServices();
        }
    }, [isOpen]);

    const loadServices = async () => {
        setIsLoading(true);
        try {
            const data = await fetchBreachServices();
            if (data && data.length > 0) {
                setServices(data as unknown as BreachService[]);
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

    const categories = ['All', ...Array.from(new Set(services.map(s => s.category)))];

    const filteredServices = services.filter(service => {
        const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = activeCategory === 'All' || service.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

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
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-50 dark:bg-slate-900 w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl flex overflow-hidden ring-1 ring-slate-900/5 relative">

                {/* Sidebar */}
                <div className={`absolute md:relative z-20 h-full w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                    <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <FunnelIcon className="w-5 h-5 text-blue-500" />
                            Categories
                        </h3>
                        <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-1 text-slate-500 hover:text-slate-700">
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="overflow-y-auto h-[calc(100%-60px)] p-2 space-y-1">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => { setActiveCategory(category); setIsSidebarOpen(false); }}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory === category
                                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-900">
                    {/* Header */}
                    <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between gap-4">
                        <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                            <FunnelIcon className="w-6 h-6" />
                        </button>
                        <div className="relative flex-1 max-w-md">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search services..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-700 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            {isAdmin && (
                                <button
                                    onClick={() => setEditingService({
                                        id: 0, name: '', description: '', url: '', icon: '🛡️', type: 'Breach Check',
                                        category: activeCategory !== 'All' ? activeCategory : 'General', tags: [], key_features: []
                                    })}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-sm"
                                >
                                    <PlusIcon className="w-5 h-5" />
                                    <span className="hidden sm:inline">Add Service</span>
                                </button>
                            )}
                            <button onClick={onClose} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {isLoading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredServices.map((service) => (
                                    <div key={service.id} className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg transition-all duration-300 flex flex-col">
                                        <div className="p-5 flex-1">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform">
                                                    {service.icon}
                                                </div>
                                                {isAdmin && (
                                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => setEditingService(service)}
                                                            className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                                        >
                                                            <PencilIcon className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(service.id)}
                                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {service.name}
                                            </h3>
                                            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">
                                                {service.description}
                                            </p>

                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {service.tags && service.tags.slice(0, 3).map(tag => (
                                                    <span key={tag} className="px-2 py-1 bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 text-xs rounded-md font-medium">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="space-y-2">
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
                                            className="p-4 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors rounded-b-xl"
                                        >
                                            Visit Service <LinkIcon className="w-4 h-4" />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

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
                                        value={editingService.tags.join(', ')}
                                        onChange={e => setEditingService({ ...editingService, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="tag1, tag2, tag3"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Key Features (comma separated)</label>
                                    <input
                                        type="text"
                                        value={editingService.key_features.join(', ')}
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

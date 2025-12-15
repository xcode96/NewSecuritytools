import React, { useState, useEffect, useMemo } from 'react';
import { booksData, BookCategory } from '../data/books';
import {
    XMarkIcon,
    BookIcon,
    SearchIcon,
    SparklesIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon
} from './IconComponents';
import { motion, AnimatePresence } from 'motion/react';

interface BooksModalProps {
    onClose: () => void;
    isOpen: boolean;
    isAdmin?: boolean;
}

const BooksModal: React.FC<BooksModalProps> = ({ onClose, isOpen, isAdmin = false }) => {
    const [books, setBooks] = useState<any[]>(booksData);
    const [activeCategory, setActiveCategory] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Edit State
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<any>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    const filteredBooks = useMemo(() => {
        return books.filter(book => {
            const matchesCategory = activeCategory === 'All' || book.category === activeCategory;
            const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                book.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchQuery, books]);

    const stats = useMemo(() => {
        return {
            total: books.length,
            redTeam: books.filter(b => b.category === 'Red Team').length,
            blueTeam: books.filter(b => b.category === 'Blue Team').length,
            // Parse "300 pages" -> 300
            totalPages: books.reduce((acc, curr) => {
                const pages = parseInt((curr.pages || '0').toString().split(' ')[0].replace(/,/g, '')) || 0;
                return acc + pages;
            }, 0)
        };
    }, [books]);

    // Admin Handlers
    const handleAddClick = () => {
        setEditForm({
            title: '',
            author: '',
            description: '',
            category: 'General',
            pages: '',
            year: new Date().getFullYear().toString(),
            amazon_link: '',
            tags: ''
        });
        setIsEditing(true);
    };

    const handleEditClick = (book: any) => {
        setEditForm({
            ...book,
            tags: Array.isArray(book.tags) ? book.tags.join(', ') : book.tags || ''
        });
        setIsEditing(true);
    };

    const handleDeleteClick = async (id: number) => {
        if (window.confirm('Delete this book?')) {
            setBooks(prev => prev.filter(b => b.id !== id));
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            title: editForm.title,
            author: editForm.author,
            description: editForm.description,
            category: editForm.category,
            pages: editForm.pages,
            year: editForm.year,
            amazon_link: editForm.amazon_link,
            tags: editForm.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
        };

        if (editForm.id) {
            setBooks(prev => prev.map(b => b.id === editForm.id ? { ...b, ...payload } : b));
        } else {
            const newBook = { ...payload, id: Date.now() }; // Local ID
            setBooks(prev => [...prev, newBook]);
        }
        setIsEditing(false);
        setEditForm(null);
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
                <div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-orange-700 to-red-900" />
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
                                <BookIcon className="w-6 h-6 text-amber-300" />
                            </div>
                            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-100 text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-amber-400/30">
                                Library
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-lg">
                            Cybersecurity Library
                        </h1>
                        <p className="text-xl text-amber-100/80 max-w-2xl leading-relaxed">
                            Curated collection of {books.length} essential books for Red Team, Blue Team, and General security studies.
                        </p>
                    </motion.div>
                </div>
            </motion.header>

            {/* Main Content */}
            <main className="flex-grow -mt-10 relative z-20 container mx-auto px-4 sm:px-6 pb-20">
                <div className="bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-white/5 p-6 sm:p-8 min-h-[60vh] flex flex-col gap-8">

                    {/* Top Bar: Stats & Filters */}
                    <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-center justify-between">
                        {/* Stats Pills */}
                        <div className="flex flex-wrap gap-3">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-white/5 rounded-full border border-slate-200 dark:border-white/10 shadow-sm backdrop-blur-sm">
                                <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
                                <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">{stats.redTeam} Red Team</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-white/5 rounded-full border border-slate-200 dark:border-white/10 shadow-sm backdrop-blur-sm">
                                <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
                                <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">{stats.blueTeam} Blue Team</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/50 dark:bg-white/5 rounded-full border border-slate-200 dark:border-white/10 shadow-sm backdrop-blur-sm">
                                <BookIcon className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                                <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">{stats.totalPages.toLocaleString()} Pages</span>
                            </div>
                        </div>

                        {/* Search & Category Tabs */}
                        <div className="flex flex-col md:flex-row gap-4 w-full xl:w-auto">
                            {isAdmin && (
                                <button
                                    onClick={handleAddClick}
                                    className="px-4 py-2 rounded-lg bg-amber-600 text-white font-bold flex items-center gap-2 hover:bg-amber-700 transition-colors shadow-lg shadow-amber-500/30"
                                >
                                    <PlusIcon className="w-4 h-4" /> Add Book
                                </button>
                            )}
                            <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
                                {(['All', 'Blue Team', 'Red Team', 'General'] as const).map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setActiveCategory(cat)}
                                        className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeCategory === cat
                                            ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-sm'
                                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                            }`}
                                    >
                                        {cat === 'All' ? 'All' : cat}
                                    </button>
                                ))}
                            </div>
                            <div className="relative">
                                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search library..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full md:w-64 pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border-none focus:ring-2 focus:ring-amber-500/50 text-sm transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Book Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredBooks.map((book) => (
                            <motion.div
                                key={book.id}
                                whileHover={{ y: -5 }}
                                className="group flex flex-col bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden hover:border-amber-500/30 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 relative"
                            >
                                {isAdmin && (
                                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                        <button onClick={(e) => { e.stopPropagation(); handleEditClick(book); }} className="p-1.5 bg-white dark:bg-slate-800 text-blue-500 rounded-lg shadow-sm hover:scale-110"><PencilIcon className="w-3 h-3" /></button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteClick(book.id); }} className="p-1.5 bg-white dark:bg-slate-800 text-red-500 rounded-lg shadow-sm hover:scale-110"><TrashIcon className="w-3 h-3" /></button>
                                    </div>
                                )}

                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="px-2 py-1 rounded-md bg-slate-100 dark:bg-white/10 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            {book.year}
                                        </div>
                                        <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${book.category === 'Red Team' ? 'bg-red-500/10 text-red-600 dark:text-red-400' :
                                            book.category === 'Blue Team' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                                                'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                            }`}>
                                            {book.category}
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 leading-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                        {book.title}
                                    </h3>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">
                                        by <span className="text-slate-700 dark:text-slate-300">{book.author}</span>
                                    </p>

                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed line-clamp-3">
                                        {book.description}
                                    </p>

                                    <div className="mt-auto space-y-4">
                                        <div className="flex flex-wrap gap-2">
                                            {(book.tags || []).slice(0, 3).map((tag: string, i: number) => (
                                                <span key={i} className="text-[10px] font-bold px-2 py-1 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 rounded-md">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/10">
                                            <div className="text-xs font-semibold text-slate-400">
                                                {book.pages}
                                            </div>
                                            <div className="flex text-amber-500 text-xs gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <span key={i}>★</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <a
                                    href={book.amazonLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-4 bg-slate-50 dark:bg-white/5 border-t border-slate-200 dark:border-white/10 flex items-center justify-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                                >
                                    <span className="text-lg">🛒</span> Buy on Amazon
                                </a>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Edit Modal Overlay */}
            <AnimatePresence>
                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    >
                        <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-y-auto max-h-[90vh]">
                            <h3 className="text-xl font-bold mb-4 dark:text-white">{editForm?.id ? 'Edit Book' : 'Add New Book'}</h3>
                            <form onSubmit={handleSave} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-slate-300">Title</label>
                                    <input required type="text" value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-amber-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-slate-300">Author</label>
                                    <input required type="text" value={editForm.author} onChange={e => setEditForm({ ...editForm, author: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-amber-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-slate-300">Description</label>
                                    <textarea required value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-amber-500" rows={3} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1 dark:text-slate-300">Category</label>
                                        <select value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-amber-500">
                                            {['Blue Team', 'Red Team', 'General'].map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 dark:text-slate-300">Year</label>
                                        <input required type="text" value={editForm.year} onChange={e => setEditForm({ ...editForm, year: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-amber-500" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1 dark:text-slate-300">Pages (e.g. 500 pages)</label>
                                        <input required type="text" value={editForm.pages} onChange={e => setEditForm({ ...editForm, pages: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-amber-500" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-slate-300">Amazon/Buy Link</label>
                                    <input required type="text" value={editForm.amazon_link} onChange={e => setEditForm({ ...editForm, amazon_link: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-amber-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-slate-300">Tags (comma separated)</label>
                                    <input type="text" value={editForm.tags} onChange={e => setEditForm({ ...editForm, tags: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-amber-500" />
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">Cancel</button>
                                    <button type="submit" className="px-4 py-2 rounded-lg bg-amber-600 text-white font-bold hover:bg-amber-700">Save Book</button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BooksModal;

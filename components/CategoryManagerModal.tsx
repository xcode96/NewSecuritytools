
import React, { useState, useEffect } from 'react';
import type { CategoryInfo } from '../types';
import { XMarkIcon, PlusIcon, PencilIcon, TrashIcon } from './IconComponents';

interface CategoryManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
    categories: CategoryInfo[];
    onAddCategory: (category: CategoryInfo) => void;
    onEditCategory: (originalName: string, updatedCategory: CategoryInfo) => void;
    onDeleteCategory: (categoryName: string) => void;
}

const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
    isOpen,
    onClose,
    categories,
    onAddCategory,
    onEditCategory,
    onDeleteCategory,
}) => {
    const [editingName, setEditingName] = useState<string | null>(null);
    const [formData, setFormData] = useState<CategoryInfo>({ name: '', color: '#3b82f6' });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) {
            setEditingName(null);
            setFormData({ name: '', color: '#3b82f6' });
            setError(null);
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            setError('Category name is required');
            return;
        }

        if (editingName) {
            if (formData.name !== editingName && categories.some(c => c.name.toLowerCase() === formData.name.toLowerCase())) {
                setError('Category name already exists');
                return;
            }
            onEditCategory(editingName, formData);
            setEditingName(null);
        } else {
            if (categories.some(c => c.name.toLowerCase() === formData.name.toLowerCase())) {
                setError('Category already exists');
                return;
            }
            onAddCategory(formData);
        }
        setFormData({ name: '', color: '#3b82f6' });
        setError(null);
    };

    const handleEditClick = (category: CategoryInfo) => {
        setEditingName(category.name);
        setFormData({ ...category });
        setError(null);
    };

    const handleDeleteClick = (categoryName: string) => {
        if (window.confirm(`Are you sure you want to delete category "${categoryName}"? Tools in this category will not be deleted but may become uncategorized.`)) {
            onDeleteCategory(categoryName);
            if (editingName === categoryName) {
                setEditingName(null);
                setFormData({ name: '', color: '#3b82f6' });
            }
        }
    };

    const handleCancelEdit = () => {
        setEditingName(null);
        setFormData({ name: '', color: '#3b82f6' });
        setError(null);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Manage Categories</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            {editingName ? 'Edit Category' : 'Add New Category'}
                        </h3>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="Category Name"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Color Tag</label>
                            <div className="flex gap-2 items-center">
                                <input
                                    type="color"
                                    value={formData.color}
                                    onChange={e => setFormData({ ...formData, color: e.target.value })}
                                    className="h-10 w-14 rounded cursor-pointer bg-transparent"
                                />
                                <span className="text-xs text-slate-500 font-mono">{formData.color}</span>
                            </div>
                        </div>

                        {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

                        <div className="flex gap-2 pt-2">
                            <button
                                type="submit"
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                {editingName ? <PencilIcon className="w-4 h-4" /> : <PlusIcon className="w-4 h-4" />}
                                {editingName ? 'Update' : 'Add'}
                            </button>
                            {editingName && (
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>

                    {/* List */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
                            Existing Categories
                        </h3>
                        <div className="space-y-2">
                            {categories.map(category => (
                                <div key={category.name} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: category.color }}></div>
                                        <span className="font-medium text-slate-700 dark:text-slate-200">{category.name}</span>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEditClick(category)}
                                            className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                                            title="Edit"
                                        >
                                            <PencilIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(category.name)}
                                            className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                            title="Delete"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CategoryManagerModal;

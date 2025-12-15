import React, { useState, useEffect } from 'react';
import { XMarkIcon, PlusIcon, TagIcon } from './IconComponents';
import type { ToolSubmissionFormData, CategoryInfo } from '../types';
import { submitTool } from '../services/submissionService';

interface ToolSubmissionModalProps {
    onClose: () => void;
    categories: CategoryInfo[];
    onSuccess: () => void;
}

export const ToolSubmissionModal: React.FC<ToolSubmissionModalProps> = ({
    onClose,
    categories,
    onSuccess
}) => {
    const [formData, setFormData] = useState<ToolSubmissionFormData>({
        tool_name: '',
        description: '',
        category: '',
        tags: [],
        color: '#64748b'
    });
    const [tagInput, setTagInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    const handleAddTag = () => {
        const trimmedTag = tagInput.trim();
        if (trimmedTag && !formData.tags?.includes(trimmedTag)) {
            setFormData({
                ...formData,
                tags: [...(formData.tags || []), trimmedTag]
            });
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setFormData({
            ...formData,
            tags: formData.tags?.filter(t => t !== tagToRemove) || []
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        if (!formData.tool_name.trim() || !formData.description.trim() || !formData.category) {
            setError(' Please fill in all required fields');
            setIsSubmitting(false);
            return;
        }

        const result = await submitTool(formData);

        if (result.success) {
            setSuccess(true);
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 2000);
        } else {
            setError(result.error || 'Failed to submit tool');
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div
                className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <header className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-800 z-10">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                            Submit a Tool
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            Suggest a cybersecurity tool for the community
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        aria-label="Close modal"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
                            <p className="font-medium">Error</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded" role="alert">
                            <p className="font-medium">Success!</p>
                            <p className="text-sm">Your tool submission has been received and is pending review.</p>
                        </div>
                    )}

                    <div>
                        <label
                            htmlFor="tool_name"
                            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                        >
                            Tool Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="tool_name"
                            type="text"
                            value={formData.tool_name}
                            onChange={(e) => setFormData({ ...formData, tool_name: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Nmap"
                            required
                            disabled={isSubmitting || success}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="description"
                            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                        >
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                            placeholder="Describe what this tool does and its main features..."
                            required
                            disabled={isSubmitting || success}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="category"
                            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                        >
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="category"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            disabled={isSubmitting || success}
                        >
                            <option value="">Select a category...</option>
                            {categories.map((cat) => (
                                <option key={cat.name} value={cat.name}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="tags"
                            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                        >
                            Tags (Optional)
                        </label>
                        <div className="flex gap-2">
                            <input
                                id="tags"
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                                className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., network-scanning, port-scanner"
                                disabled={isSubmitting || success}
                            />
                            <button
                                type="button"
                                onClick={handleAddTag}
                                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
                                disabled={isSubmitting || success}
                            >
                                <PlusIcon className="w-5 h-5" />
                                Add
                            </button>
                        </div>
                        {formData.tags && formData.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {formData.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm"
                                    >
                                        <TagIcon className="w-4 h-4" />
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTag(tag)}
                                            className="ml-1 hover:text-red-600"
                                            disabled={isSubmitting || success}
                                        >
                                            <XMarkIcon className="w-4 h-4" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-medium"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSubmitting || success}
                        >
                            {isSubmitting ? 'Submitting...' : success ? 'Submitted!' : 'Submit Tool'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

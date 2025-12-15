import React, { useState, useEffect } from 'react';
import { Certification, CertificationCategory, CertificationLevel } from '../data/certifications';
import { XMarkIcon } from './IconComponents';

interface CertificationFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (cert: Omit<Certification, 'id'> | Certification) => void;
    initialData?: Certification;
}

const CertificationFormModal: React.FC<CertificationFormModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState<Partial<Certification>>({
        code: '',
        name: '',
        provider: '',
        category: 'Red Team',
        level: 'Intermediate',
        rating: 0,
        difficulty: 0,
        popularity: 0,
        jobMarket: 0,
        description: '',
        duration: '',
        cost: '',
        prerequisites: '',
        examFormat: '',
        keySkills: [],
        careerPaths: [],
        link: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                code: '',
                name: '',
                provider: '',
                category: 'Red Team',
                level: 'Intermediate',
                rating: 0,
                difficulty: 0,
                popularity: 0,
                jobMarket: 0,
                description: '',
                duration: '',
                cost: '',
                prerequisites: '',
                examFormat: '',
                keySkills: [],
                careerPaths: [],
                link: ''
            });
        }
    }, [initialData, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    };

    const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'keySkills' | 'careerPaths') => {
        const values = e.target.value.split(',').map(item => item.trim());
        setFormData(prev => ({ ...prev, [field]: values }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as Certification);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-white/10 shadow-xl">
                <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        {initialData ? 'Edit Certification' : 'Add New Certification'}
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                        <XMarkIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Code</label>
                            <input required name="code" value={formData.code} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. OSCP" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Provider</label>
                            <input required name="provider" value={formData.provider} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Name</label>
                        <input required name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Category</label>
                            <select name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option value="Red Team">Red Team</option>
                                <option value="Blue Team">Blue Team</option>
                                <option value="Management">Management</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Level</label>
                            <select name="level" value={formData.level} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Description</label>
                        <textarea required name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full px-3 py-2 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['rating', 'difficulty', 'popularity', 'jobMarket'].map((field) => (
                            <div key={field} className="space-y-1">
                                <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{field}</label>
                                <input type="number" min="0" max="5" step="0.5" name={field} value={formData[field as keyof Certification] as number} onChange={handleNumberChange} className="w-full px-3 py-2 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Duration</label>
                            <input required name="duration" value={formData.duration} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Cost</label>
                            <input required name="cost" value={formData.cost} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Prerequisites</label>
                        <input name="prerequisites" value={formData.prerequisites} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Exam Format</label>
                        <input name="examFormat" value={formData.examFormat} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Key Skills (comma separated)</label>
                        <input name="keySkills" value={formData.keySkills?.join(', ')} onChange={(e) => handleArrayChange(e, 'keySkills')} className="w-full px-3 py-2 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Career Paths (comma separated)</label>
                        <input name="careerPaths" value={formData.careerPaths?.join(', ')} onChange={(e) => handleArrayChange(e, 'careerPaths')} className="w-full px-3 py-2 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Link</label>
                        <input name="link" value={formData.link} onChange={handleChange} className="w-full px-3 py-2 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-lg hover:shadow-indigo-500/25 transition-all">
                            Save Certification
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CertificationFormModal;

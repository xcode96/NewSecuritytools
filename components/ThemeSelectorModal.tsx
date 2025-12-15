import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { XMarkIcon, CheckIcon } from './IconComponents';
import { THEMES, Theme } from '../data/themes';

interface ThemeSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentThemeId: string;
    onSelectTheme: (theme: Theme) => void;
}

const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({ isOpen, onClose, currentThemeId, onSelectTheme }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[80vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200 dark:border-white/10"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-50/50 dark:bg-black/20">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Choose Theme</h2>
                            <p className="text-slate-500 dark:text-slate-400">Select an interface appearance</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-slate-500 dark:text-slate-400"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Grid */}
                    <div className="overflow-y-auto p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {THEMES.map((theme) => {
                            const bgClass = theme.background.includes('bg-') ? theme.background : `bg-[${theme.background}]`;
                            const isActive = currentThemeId === theme.id;

                            return (
                                <button
                                    key={theme.id}
                                    onClick={() => onSelectTheme(theme)}
                                    className={`
                    relative group flex flex-col gap-3 p-3 rounded-xl border-2 transition-all duration-200
                    ${isActive
                                            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
                                            : 'border-transparent hover:border-slate-200 dark:hover:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5'
                                        }
                  `}
                                >
                                    {/* Preview Box */}
                                    <div className={`
                    w-full aspect-video rounded-lg shadow-sm border border-black/5 dark:border-white/5 overflow-hidden relative
                    ${theme.background}
                  `}>
                                        {/* Mock UI Elements for preview */}
                                        <div className="absolute inset-0 p-2 flex flex-col gap-1.5 opacity-60">
                                            <div className={`w-1/3 h-2 rounded-full ${theme.type === 'dark' ? 'bg-white/20' : 'bg-black/10'}`} />
                                            <div className="flex gap-1">
                                                <div className={`w-8 h-8 rounded-md ${theme.type === 'dark' ? 'bg-white/10' : 'bg-black/5'}`} />
                                                <div className="flex-1 flex flex-col gap-1">
                                                    <div className={`w-full h-2 rounded-full ${theme.type === 'dark' ? 'bg-white/10' : 'bg-black/5'}`} />
                                                    <div className={`w-2/3 h-2 rounded-full ${theme.type === 'dark' ? 'bg-white/10' : 'bg-black/5'}`} />
                                                </div>
                                            </div>
                                        </div>

                                        {isActive && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
                                                <div className="bg-blue-500 rounded-full p-1 shadow-lg">
                                                    <CheckIcon className="w-4 h-4 text-white" />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Label */}
                                    <div className="text-left w-full">
                                        <span className={`block text-sm font-semibold truncate ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-200'}`}>
                                            {theme.name}
                                        </span>
                                        <span className="text-xs text-slate-500 capitalize">{theme.type}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ThemeSelectorModal;


import React, { useState, useEffect } from 'react';
import { NotesIcon } from './IconComponents';

export const Cheatsheets: React.FC = () => {
    const [content, setContent] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('userCheatsheets');
        if (saved) setContent(saved);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newVal = e.target.value;
        setContent(newVal);
        localStorage.setItem('userCheatsheets', newVal);
    };

    return (
        <div className="w-full h-[calc(100vh-100px)] flex flex-col p-4 animate-in fade-in duration-300">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-yellow-500/20 rounded-xl">
                    <NotesIcon className="w-8 h-8 text-yellow-500" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Cheatsheets</h2>
                    <p className="text-slate-500 text-sm">Your personal quick reference notes</p>
                </div>
            </div>

            <div className="flex-1 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xl overflow-hidden backdrop-blur-sm">
                <textarea
                    value={content}
                    onChange={handleChange}
                    placeholder="# Quick Reference&#10;&#10;- nmap -sC -sV localhost&#10;- python3 -m http.server 8000"
                    className="w-full h-full p-6 bg-transparent text-slate-700 dark:text-slate-200 resize-none focus:outline-none font-mono text-sm leading-relaxed"
                    spellCheck={false}
                />
            </div>
        </div>
    );
};

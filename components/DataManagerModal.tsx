import React, { useState } from 'react';
import { XMarkIcon, DownloadIcon, UploadIcon, CertificateIcon } from './IconComponents';
import { motion } from 'motion/react';

// Import all data
// Remove static tools import to avoid confusion, use prop instead
import { booksData } from '../data/books';
import { usefulLinksData } from '../data/usefulLinks';
import { platformsData } from '../data/platforms';
import { certificationsData } from '../data/certifications';
import { downloadsData } from '../data/downloads';
import { frameworksData } from '../data/frameworks';
import { breachServices } from '../data/breachServices';
import { youtubersData } from '../data/youtubers';
import { Tool } from '../types';

// Import Supabase functions
// The following imports are removed as per the instruction to replace Supabase calls with static data usage.
// import {
//     addTool, addBook, addUsefulLink, addPlatform, addCertification,
//     addDownload, addFramework, addBreachService, addYouTuber
// } from '../services/supabaseService';

interface DataManagerModalProps {
    onClose: () => void;
    isOpen: boolean;
    tools?: Tool[]; // Accept tools from parent (live data)
}

const DataManagerModal: React.FC<DataManagerModalProps> = ({ onClose, isOpen, tools = [] }) => {
    const [status, setStatus] = useState('');
    const [exporting, setExporting] = useState(false);

    const downloadConstants = () => {
        try {
            // Generate valid TypeScript file content
            const content = `import { Tool } from '../types';\n\nexport const TOOLS: Tool[] = ${JSON.stringify(tools, null, 2)};\n`;

            const blob = new Blob([content], { type: 'text/typescript' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'constants.ts';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            setStatus('✅ constants.ts downloaded!');
        } catch (e) {
            console.error(e);
            setStatus('❌ Failed to download constants.ts');
        }
    };

    const exportAllData = () => {
        setExporting(true);
        setStatus('Preparing export...');

        const allData = {
            tools: tools, // Use live tools
            books: booksData,
            usefulLinks: usefulLinksData,
            platforms: platformsData,
            certifications: certificationsData,
            downloads: downloadsData,
            frameworks: frameworksData,
            breachServices: breachServices,
            youtubers: youtubersData,
            exportDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(allData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `toolkit-data-export-${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setStatus('✅ Export complete!');
        setExporting(false);
    };

    const handleImport = (file: File) => {
        if (!confirm("This will overwrite your current data with the imported file. Are you sure?")) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target?.result as string);

                // Import Logic
                // We expect keys like: tools, categories, favorites, etc.
                // Or maybe just tools for now, but better to be generic if possible or check known keys.

                let importCount = 0;

                if (json.tools && Array.isArray(json.tools)) {
                    localStorage.setItem('tools', JSON.stringify(json.tools));
                    importCount++;
                }

                if (json.categories && Array.isArray(json.categories)) {
                    localStorage.setItem('categories', JSON.stringify(json.categories));
                    importCount++;
                }

                if (json.favorites && Array.isArray(json.favorites)) {
                    localStorage.setItem('favorites', JSON.stringify(json.favorites));
                    importCount++;
                }

                // Add other potential keys if they become dynamic (books, links, etc.)
                // For now, mostly tools/categories/favorites are the main dynamic ones people edit in this app context
                // But if the export includes everything, we could theoretically save everything to LS
                // However, the App needs to be updated to READ everything from LS.

                setStatus(`✅ Imported successfully! Reloading...`);

                // Give a moment to see the message then reload to apply changes
                setTimeout(() => {
                    window.location.reload();
                }, 1000);

            } catch (err) {
                console.error(err);
                setStatus('❌ Failed to parse JSON file');
            }
        };
        reader.readAsText(file);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold dark:text-white">Data Manager</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Download Source constants.ts */}
                    <div className="p-6 border-2 border-dashed border-purple-300 dark:border-purple-700 rounded-xl bg-purple-50 dark:bg-purple-900/10">
                        <div className="flex items-center gap-3 mb-4">
                            <CertificateIcon className="w-6 h-6 text-purple-600" />
                            <h3 className="text-lg font-bold dark:text-white">Download Source Code</h3>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                            Download the current tools data as <code>constants.ts</code> to manually replace the file in your project.
                        </p>
                        <button
                            onClick={downloadConstants}
                            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium"
                        >
                            Download constants.ts
                        </button>
                    </div>

                    {/* Export */}
                    <div className="p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <DownloadIcon className="w-6 h-6 text-blue-500" />
                            <h3 className="text-lg font-bold dark:text-white">Export All Data</h3>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                            Download all your data as a JSON file for backup or migration.
                        </p>
                        <button
                            onClick={exportAllData}
                            disabled={exporting}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50"
                        >
                            {exporting ? 'Exporting...' : 'Export to JSON'}
                        </button>
                    </div>

                    {/* Import */}
                    <div className="p-6 border-2 border-dashed border-green-300 dark:border-green-700 rounded-xl bg-green-50 dark:bg-green-900/10">
                        <div className="flex items-center gap-3 mb-4">
                            <UploadIcon className="w-6 h-6 text-green-600" />
                            <h3 className="text-lg font-bold dark:text-white">Import Data</h3>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                            Restore data from a JSON backup. <strong>Warning: This will overwrite your current local data.</strong>
                        </p>
                        <div className="flex gap-4">
                            <input
                                type="file"
                                id="import-file"
                                accept=".json"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleImport(file);
                                    // Reset input so same file can be selected again
                                    e.target.value = '';
                                }}
                            />
                            <button
                                onClick={() => document.getElementById('import-file')?.click()}
                                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
                            >
                                Import JSON
                            </button>
                        </div>
                    </div>

                    {/* Status */}
                    {status && (
                        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                            <p className="text-sm dark:text-white">{status}</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default DataManagerModal;

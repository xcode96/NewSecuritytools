import React, { useEffect, useState } from 'react';
import type { Tool, GeneratedToolDetails, SubArticle } from '../types';
import { generateToolDetails } from '../services/geminiService';
import { CodeBlock } from './CodeBlock';
import { ArrowLeftIcon, PencilIcon, PlusIcon, SparklesIcon, XMarkIcon } from './IconComponents';
import CheatSheetRenderer from './CheatSheetRenderer';
import { motion, AnimatePresence } from 'motion/react';

interface ToolDetailModalProps {
  tool: Tool;
  onClose: () => void;
  cache: Map<string, GeneratedToolDetails>;
  onCacheUpdate: (toolName: string, details: GeneratedToolDetails) => void;
  isAdmin?: boolean;
  onEditArticle?: (mode: 'add' | 'edit', tool: Tool, articleIndex?: number) => void;
}

const ToolDetailModal: React.FC<ToolDetailModalProps> = ({
  tool,
  onClose,
  cache,
  onCacheUpdate,
  isAdmin = false,
  onEditArticle = (mode, tool, articleIndex) => { }
}) => {
  const [details, setDetails] = useState<GeneratedToolDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeArticle, setActiveArticle] = useState<SubArticle | null>(null);

  const hasArticles = tool.articles && tool.articles.length > 0;

  useEffect(() => {
    setActiveArticle(null);
    setDetails(null);
    setError(null);
    setIsLoading(false);

    const fetchDetails = async () => {
      if (hasArticles) return;

      if (cache.has(tool.name)) {
        setDetails(cache.get(tool.name)!);
        return;
      }

      setIsLoading(true);
      const result = await generateToolDetails(tool);

      if (result.data) {
        setDetails(result.data);
        onCacheUpdate(tool.name, result.data);
      } else {
        setError(result.error || 'An unknown error occurred.');
      }
      setIsLoading(false);
    };

    fetchDetails();
  }, [tool, cache, onCacheUpdate, hasArticles]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Back component for reuse
  const BackButton = ({ onClick, label = "Back" }: { onClick: () => void, label?: string }) => (
    <button
      onClick={onClick}
      className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-500 transition-colors group mb-4"
    >
      <div className="p-1 rounded-full bg-slate-100 group-hover:bg-blue-100 dark:bg-slate-800 dark:group-hover:bg-blue-900/30 transition-colors">
        <ArrowLeftIcon className="w-4 h-4" />
      </div>
      {label}
    </button>
  );

  const renderContent = () => {
    if (hasArticles) {
      if (activeArticle) {
        const articleIndex = tool.articles?.findIndex(a => a.title === activeArticle.title && a.content === activeArticle.content);
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="pb-10"
          >
            <div className="flex justify-between items-center mb-6">
              <BackButton onClick={() => setActiveArticle(null)} label="Back to Guides" />
              {isAdmin && (
                <button
                  onClick={() => onEditArticle('edit', tool, articleIndex)}
                  className="flex items-center gap-2 text-sm font-bold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                >
                  <PencilIcon className="w-4 h-4" />
                  <span>Edit Guide</span>
                </button>
              )}
            </div>
            <div className="bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-white/5 shadow-sm">
              <CheatSheetRenderer content={activeArticle.content} />
            </div>
          </motion.div>
        );
      }
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-end border-b border-slate-200 dark:border-white/10 pb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-yellow-500" />
                Available Guides
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Select a guide to master this tool.
              </p>
            </div>
            {isAdmin && (
              <button
                onClick={() => onEditArticle('add', tool, undefined)}
                className="flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 shadow-lg hover:shadow-xl transition-all"
              >
                <PlusIcon className="w-3 h-3" />
                <span>New Guide</span>
              </button>
            )}
          </div>

          <div className="grid gap-3">
            {tool.articles?.map((article, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.01, x: 4 }}
                whileTap={{ scale: 0.99 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300" />

                <button
                  onClick={() => setActiveArticle(article)}
                  className="w-full flex items-center justify-between p-4 bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl hover:border-blue-500/30 hover:shadow-md transition-all text-left relative z-10"
                >
                  <span className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {article.title}
                  </span>

                  {isAdmin && (
                    <div
                      onClick={(e) => { e.stopPropagation(); onEditArticle('edit', tool, index); }}
                      className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </div>
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      );
    }

    if (isLoading) {
      return (
        <div className="space-y-6 animate-pulse p-4">
          <div className="h-8 bg-slate-200 dark:bg-white/10 rounded w-1/3"></div>
          <div className="h-32 bg-slate-200 dark:bg-white/10 rounded-xl"></div>
          <div className="h-8 bg-slate-200 dark:bg-white/10 rounded w-1/4 mt-8"></div>
          <div className="h-24 bg-slate-200 dark:bg-white/10 rounded-xl"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-full mb-4">
            <XMarkIcon className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Failed to load details</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm">{error}</p>
        </div>
      );
    }

    if (details) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8 pb-10"
        >
          <div className="bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-white/5 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
              Common Command
            </h3>
            <CodeBlock code={details.command} />
          </div>

          <div className="bg-white/50 dark:bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 dark:border-white/5 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-purple-500 rounded-full" />
              Use Case
            </h3>
            <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>{details.exploit}</p>
            </div>
          </div>
        </motion.div>
      );
    }

    return null;
  };

  return (
    <div className="w-full flex-grow flex flex-col bg-slate-50 dark:bg-[#0a0a0a] h-full overflow-y-auto">
      {/* Hero Header */}
      <motion.header
        initial={{ height: "40vh" }}
        animate={{ height: activeArticle ? "15vh" : "40vh" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="relative overflow-hidden shrink-0"
      >
        {/* Dynamic Blurred Background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: `linear-gradient(135deg, ${tool.color}, #1e293b)`,
          }}
        />
        <div className="absolute inset-0 bg-black/20 backdrop-filter backdrop-blur-[2px] z-0" />

        {/* Decorative Circles */}
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-50 dark:from-[#0a0a0a] to-transparent z-10" />

        <div className="container mx-auto px-6 relative z-20 h-full flex flex-col justify-center">
          <motion.div
            layout
            className="flex flex-col items-start gap-4 max-w-4xl"
          >
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all absolute top-6 right-0"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            {!activeArticle && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <span className="px-3 py-1 rounded-full bg-white/20 text-white/90 text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-white/10">
                  {tool.category}
                </span>
              </motion.div>
            )}

            <motion.h2 layout="position" className={`font-black text-white leading-tight drop-shadow-lg ${activeArticle ? 'text-4xl' : 'text-5xl sm:text-7xl'}`}>
              {tool.name}
              {activeArticle && <span className="opacity-50 font-medium ml-4 text-2xl">/ Guide</span>}
            </motion.h2>

            {!activeArticle && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-lg sm:text-xl text-white/80 max-w-2xl leading-relaxed"
              >
                {tool.description}
              </motion.p>
            )}

            {!activeArticle && tool.tags && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-2 mt-2"
              >
                {tool.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 text-xs font-semibold text-white/80 bg-black/20 border border-white/5 rounded-lg">
                    #{tag}
                  </span>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.header>

      <main className="flex-grow -mt-10 relative z-20 container mx-auto px-4 sm:px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-white/5 p-6 sm:p-10 min-h-[400px]"
        >
          {renderContent()}
        </motion.div>
      </main>
    </div>
  );
};

export default ToolDetailModal;
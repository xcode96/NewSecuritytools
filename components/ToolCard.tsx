import React from 'react';
import type { Tool } from '../types';
import { PencilIcon, HeartIcon, HeartSolidIcon, EyeIcon, EyeSlashIcon, SparklesIcon } from './IconComponents';
import { motion } from 'motion/react';

interface ToolCardProps {
  tool: Tool;
  onClick: () => void;
  isAdmin?: boolean;
  onEdit?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  isHidden?: boolean;
  onToggleVisibility?: () => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  onClick,
  isAdmin = false,
  onEdit = () => { },
  isFavorite = false,
  onToggleFavorite = () => { },
  isHidden = false,
  onToggleVisibility = () => { }
}) => {
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite();
  };

  const handleVisibilityClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleVisibility();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isHidden ? 0.6 : 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={`relative group h-full ${isHidden ? 'grayscale' : ''}`}
    >
      {isHidden && isAdmin && (
        <div className="absolute -top-2 -right-2 z-30 bg-amber-500/80 backdrop-blur-md text-white border border-amber-400/50 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
          HIDDEN
        </div>
      )}

      <button
        onClick={onClick}
        className={`
            w-full h-full flex flex-col text-left 
            bg-white/5 dark:bg-black/20 
            backdrop-blur-xl border border-white/20 dark:border-white/10
            rounded-2xl overflow-hidden shadow-lg 
            hover:shadow-2xl hover:shadow-[color:var(--tool-color)]/20 
            transition-all duration-300
        `}
        style={{
          ['--tool-color' as any]: tool.color
        }}
        aria-label={`View details for ${tool.name}`}
      >
        {/* Hover Border & Shadow Effect */}
        <div className="absolute inset-0 border border-transparent group-hover:border-[color:var(--tool-color)] rounded-2xl transition-colors duration-300 pointer-events-none opacity-50" />

        {/* Header Section */}
        <div className="p-5 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-300"
            style={{
              background: `linear-gradient(135deg, ${tool.color}, transparent)`,
              filter: 'saturate(1.5)'
            }}
          />

          <div className="relative z-10 flex justify-between items-start">
            <div>
              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/10 text-white/90 backdrop-blur-sm border border-white/10 mb-2">
                {tool.category}
              </span>
              <h3 className="text-xl font-bold text-white tracking-tight drop-shadow-md pr-8">
                {tool.name}
              </h3>
            </div>
          </div>

          <motion.div
            role="button"
            tabIndex={0}
            whileTap={{ scale: 0.8 }}
            onClick={handleFavoriteClick}
            className={`
                    absolute top-4 right-4 p-2 rounded-full 
                    bg-black/20 backdrop-blur-md border border-white/10
                    hover:bg-white/20 transition-all z-20
                    ${isFavorite ? 'text-red-500' : 'text-white/60 hover:text-white'}
                `}
          >
            {isFavorite ? <HeartSolidIcon className="w-5 h-5 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" /> : <HeartIcon className="w-5 h-5" />}
          </motion.div>
        </div>

        {/* Content Body */}
        <div className="p-5 flex flex-col flex-grow">
          <p className="text-sm text-slate-600 dark:text-slate-300/80 leading-relaxed flex-grow line-clamp-3 mb-4">
            {tool.description}
          </p>

          <div className="pt-2 border-t border-dashed border-slate-200 dark:border-white/10 flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {tool.tags?.slice(0, 2).map(tag => (
                <span key={tag} className="text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-md">
                  #{tag}
                </span>
              ))}
            </div>
            <span className="text-xs font-semibold text-blue-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
              View <SparklesIcon className="w-3 h-3" />
            </span>
          </div>
        </div>
      </button>

      {isAdmin && (
        <div className="absolute bottom-4 right-4 flex items-center gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleVisibilityClick}
            className={`p-2 rounded-full backdrop-blur-md text-white hover:scale-110 transition-transform shadow-lg ${isHidden ? 'bg-red-500/80 border border-red-400' : 'bg-slate-700/50 border border-white/10'}`}
          >
            {isHidden ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
          </button>
          <button
            onClick={handleEditClick}
            className="p-2 rounded-full bg-blue-600/80 backdrop-blur-md border border-blue-400/50 text-white hover:scale-110 transition-transform shadow-lg"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
        </div>
      )}
    </motion.div>
  );
};
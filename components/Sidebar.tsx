import React, { useState } from 'react';
import type { CategoryInfo } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import {
  AllCategoriesIcon, NetworkIcon, WebAppIcon, PasswordIcon, WirelessIcon, ExploitIcon, ForensicsIcon,
  ReverseEngIcon, CryptoIcon, OsintIcon, MalwareIcon, SocialEngIcon, CloudIcon, SearchIcon, FavoritesIcon, NotesIcon, MenuIcon
} from './IconComponents';

interface SidebarProps {
  isOpen: boolean;
  categories: CategoryInfo[];
  activeCategory: string;
  onSelectCategory: (categoryName: string) => void;
  onToggle: () => void;
}

const getCategoryIcon = (categoryName: string): React.ReactElement => {
  switch (categoryName) {
    case 'Network Scanning & Analysis': return <NetworkIcon className="w-6 h-6" />;
    case 'Web Application Security': return <WebAppIcon className="w-6 h-6" />;
    case 'Password Attacks': return <PasswordIcon className="w-6 h-6" />;
    case 'Wireless Hacking': return <WirelessIcon className="w-6 h-6" />;
    case 'Exploitation Frameworks': return <ExploitIcon className="w-6 h-6" />;
    case 'Forensics': return <ForensicsIcon className="w-6 h-6" />;
    case 'Reverse Engineering': return <ReverseEngIcon className="w-6 h-6" />;
    case 'Cryptography Tools': return <CryptoIcon className="w-6 h-6" />;
    case 'OSINT': return <OsintIcon className="w-6 h-6" />;
    case 'Malware Analysis': return <MalwareIcon className="w-6 h-6" />;
    case 'Social Engineering': return <SocialEngIcon className="w-6 h-6" />;
    case 'Cloud Security': return <CloudIcon className="w-6 h-6" />;
    case 'Notes': return <NotesIcon className="w-6 h-6" />;
    default: return <AllCategoriesIcon className="w-6 h-6" />;
  }
};

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, categories, activeCategory, onSelectCategory, onToggle }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = categories.filter(cat =>
    cat && cat.name && typeof cat.name === 'string' && cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            className="fixed inset-0 z-[45] bg-black/60 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed left-0 top-0 bottom-0 z-[50] flex flex-col flex-shrink-0 
          bg-slate-900/95 backdrop-blur-xl w-72
          border-r border-white/10 shadow-2xl
          transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-6 relative overflow-hidden border-b border-white/5">
          <h1 className="text-2xl font-bold tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
            xcode96
          </h1>
          <button
            onClick={onToggle}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <MenuIcon className="w-6 h-6 rotate-90" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 mb-4">
          <div className="relative group">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 dark:bg-black/20 border border-white/10 rounded-xl 
              text-sm text-slate-200 placeholder-slate-400
              focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent
              transition-all duration-200"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <ul className="space-y-1">
            <SidebarItem
              icon={<AllCategoriesIcon className="w-6 h-6" />}
              label="All Categories"
              isActive={activeCategory === 'All'}
              onClick={() => onSelectCategory('All')}
              isOpen={isOpen}
              color="blue"
            />
            <SidebarItem
              icon={<FavoritesIcon className="w-6 h-6" />}
              label="Favorites"
              isActive={activeCategory === 'Favorites'}
              onClick={() => onSelectCategory('Favorites')}
              isOpen={isOpen}
              color="pink"
            />

            <div className="my-4 border-b border-white/10 mx-2" />

            {filteredCategories.map((cat) => (
              <SidebarItem
                key={cat.name}
                icon={getCategoryIcon(cat.name)}
                label={cat.name}
                isActive={activeCategory === cat.name}
                onClick={() => onSelectCategory(cat.name)}
                isOpen={isOpen}
              />
            ))}
          </ul>
        </nav>

        {/* Decorative flair at bottom */}
        <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-md">
          {/* Could put user abstract or settings here if desired */}
          <div className="w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50 rounded-full" />
        </div>

      </aside>
    </>
  );
};

// Sub-component for individual items to keep main clean
const SidebarItem = ({ icon, label, isActive, onClick, isOpen, color = 'blue' }: any) => {
  return (
    <li>
      <motion.button
        whileHover={{ scale: 1.02, x: 5 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`
          relative w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group
          ${isActive
            ? `bg-gradient-to-r from-${color}-500/20 to-purple-500/20 text-white border border-${color}-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]`
            : 'text-slate-400 hover:text-white hover:bg-white/5 active:bg-white/10'
          }
          ${!isOpen && 'justify-center'}
        `}
        title={!isOpen ? label : ''}
      >
        {/* Active Indicator Line */}
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-${color}-500 rounded-r-full shadow-[0_0_10px_currentColor]`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          />
        )}

        <div className={`relative z-10 ${isActive ? 'text-white drop-shadow-md' : 'text-current'}`}>
          {icon}
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className={`text-sm font-medium tracking-wide truncate flex-1 text-left ${isActive ? 'text-white' : ''}`}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Glow effect on hover */}
        <div className={`absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${isActive ? 'hidden' : ''}`} />
      </motion.button>
    </li>
  )
}
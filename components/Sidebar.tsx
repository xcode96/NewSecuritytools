import React, { useState } from 'react';
import type { CategoryInfo } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import {
  AllCategoriesIcon, NetworkIcon, WebAppIcon, PasswordIcon, WirelessIcon, ExploitIcon, ForensicsIcon,
  ReverseEngIcon, CryptoIcon, OsintIcon, MalwareIcon, SocialEngIcon, CloudIcon, SearchIcon, FavoritesIcon, NotesIcon, MenuIcon, GridIcon
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
    case 'Cheatsheets': return <NotesIcon className="w-6 h-6" />;
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
          bg-slate-900 w-72
          border-r border-white/10 shadow-xl
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
          <h1 className="text-xl font-bold tracking-wide text-white">
            xcode<span className="text-blue-500">96</span>
          </h1>
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <MenuIcon className="w-6 h-6 rotate-90" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <ul className="space-y-1">
            <SidebarItem
              icon={<AllCategoriesIcon className="w-5 h-5" />}
              label="All Categories"
              isActive={activeCategory === 'All'}
              onClick={() => onSelectCategory('All')}
              isOpen={isOpen}
            />
            <SidebarItem
              icon={<FavoritesIcon className="w-5 h-5" />}
              label="Favorites"
              isActive={activeCategory === 'Favorites'}
              onClick={() => onSelectCategory('Favorites')}
              isOpen={isOpen}
            />
            <SidebarItem
              icon={<NotesIcon className="w-5 h-5" />}
              label="Cheatsheets"
              isActive={activeCategory === 'Cheatsheets'}
              onClick={() => onSelectCategory('Cheatsheets')}
              isOpen={isOpen}
            />

            <div className="my-4 border-b border-white/10 mx-2" />

            {categories
              .filter(cat => !['All', 'Favorites', 'Cheatsheets'].includes(cat.name))
              .map((cat) => (
                <SidebarItem
                  key={cat.name}
                  icon={getCategoryIcon(cat.name)}
                  label={cat.name}
                  isActive={activeCategory === cat.name}
                  onClick={() => onSelectCategory(cat.name)}
                  isOpen={isOpen}
                />
              ))}

            {/* If closed, show nothing or just icons? 
                If sidebar is closed, 'isOpen' is false. 
                But logic says 'isOpen' prop on sidebar controls width/translated?
                Actually sidebar is hidden when !isOpen (translate-x-full). 
                So we don't need to worry about collapsed state visualization.
            */}

          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="text-xs text-center text-slate-500">
            v1.0.0
          </div>
        </div>

      </aside>
    </>
  );
};

// Sub-component for individual items
const SidebarItem = ({ icon, label, isActive, onClick, isOpen }: any) => {
  return (
    <li>
      <button
        onClick={onClick}
        className={`
          w-full flex items-center gap-3 p-3 rounded-lg transition-colors duration-200
          ${isActive
            ? 'bg-blue-600/10 text-blue-500 border border-blue-500/20'
            : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
          }
          ${!isOpen && 'justify-center'}
        `}
        title={!isOpen ? label : ''}
      >
        <div className="flex-shrink-0">
          {icon}
        </div>

        {isOpen && (
          <span className="text-sm font-medium truncate">
            {label}
          </span>
        )}
      </button>
    </li>
  )
}
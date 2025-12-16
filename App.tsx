import React, { useState, useMemo, useEffect } from 'react';
import { categoryInfo } from './data/tools';
import {
  fetchTools, addTool, updateTool, deleteTool,
  fetchCategories, addCategory, updateCategory, deleteCategory,
  fetchBreachServices, addBreachService, updateBreachService, deleteBreachService
} from './services/supabaseService';
import { ToolCard } from './components/ToolCard';
import ToolDetailModal from './components/ToolDetailModal';
import AdminLoginModal from './components/AdminLoginModal';
import AdminBar from './components/AdminBar';
import ArticleEditorModal from './components/ArticleEditorModal';
import LoadingScreen from './components/LoadingScreen';
import { Sidebar } from './components/Sidebar';
import CategoryManagerModal from './components/CategoryManagerModal';

import AboutModal from './components/AboutModal';
import UsefulLinksModal from './components/UsefulLinksModal';
import BooksModal from './components/BooksModal';
import PlatformsModal from './components/PlatformsModal';
import CertificationsModal from './components/CertificationsModal';
import DownloadsModal from './components/DownloadsModal';
import FrameworksModal from './components/FrameworksModal';
import BreachServicesModal from './components/BreachServicesModal';
import YouTubersModal from './components/YouTubersModal';
import DataManagerModal from './components/DataManagerModal';
import { Cheatsheets } from './components/Cheatsheets';

import type { Tool, GeneratedToolDetails, ToolFormData, SubArticle, CategoryInfo, UserProfile } from './types';
import { TOOLS } from './data/constants';
import { signInWithGoogle, signOut as authSignOut, getUserProfile, onAuthStateChange, getSession, signInWithEmail, isAdmin, signOut } from './services/authService';
import { UserAuthButton } from './components/UserAuthButton';
import { ToolSubmissionModal } from './components/ToolSubmissionModal';
import { ToolFormModal } from './components/ToolFormModal';
import Dock from './components/Dock';
import {
  AllCategoriesIcon,
  FavoritesIcon,
  UserIcon,
  LinkIcon,
  BookIcon,
  GlobeIcon,
  CertificateIcon,
  DownloadIcon,
  FrameworkIcon,
  ShieldCheckIcon,
  YoutubeIcon,
  SunIcon,
  MoonIcon,
  GridIcon,
  SearchIcon,
  PlusIcon,
  LoginIcon,
  LogoutIcon,
  DownloadIcon as DataIcon,
  UploadIcon,
  MenuIcon
} from './components/IconComponents';

interface ArticleEditorState {
  mode: 'add' | 'edit';
  toolName: string;
  articleIndex?: number;
  articleData?: SubArticle;
}

type Theme = 'light' | 'dark';

const App: React.FC = () => {

  console.log('App component rendering...');
  const [tools, setTools] = useState<Tool[]>([]);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [aiCache, setAiCache] = useState<Map<string, GeneratedToolDetails>>(new Map());
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isAdminLoggedIn') === 'true';
    }
    return false;
  });
  const [showAdminLogin, setShowAdminLogin] = useState<boolean>(false);
  const [articleEditorState, setArticleEditorState] = useState<ArticleEditorState | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Theme State
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const storedTheme = window.localStorage.getItem('theme') as Theme;
        if (storedTheme) return storedTheme;
      } catch (e) {
        console.warn("Failed to parse theme from localStorage", e);
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('favorites');
        return saved ? JSON.parse(saved) : [];
      } catch (e) {
        console.warn("Failed to parse favorites from localStorage", e);
        return [];
      }
    }
    return [];
  });
  const [categories, setCategories] = useState<CategoryInfo[]>([]);

  // Modals state
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showDataManager, setShowDataManager] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); // Check on mount
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch Data from Supabase
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [fetchedTools, fetchedCategories] = await Promise.all([
          fetchTools(),
          fetchCategories()
        ]);
        setTools(fetchedTools);
        // Fallback to static categories if DB is empty (rare, but safe)
        setCategories(fetchedCategories.length > 0 ? fetchedCategories : categoryInfo);
      } catch (err) {
        console.error("Failed to load data:", err);
        setLoadingError("Failed to load data from server.");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Apply Theme Effect
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };


  useEffect(() => {
    const initAuth = async () => {
      // Subscribe to changes
      // onAuthStateChange returns subscription object directly
      const subscription = onAuthStateChange((event, session) => {
        setUserProfile(session?.user ? {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata.full_name,
          avatar_url: session.user.user_metadata.avatar_url
        } : null);
      });

      // Get initial session
      const session = await getSession();
      if (session?.user) {
        setUserProfile({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata.full_name,
          avatar_url: session.user.user_metadata.avatar_url
        });
      }

      return () => {
        subscription.unsubscribe();
      };
    };
    initAuth();
  }, []);

  const handleToolClick = (tool: Tool) => {
    setSelectedTool(tool);
  };

  const handleCloseModal = () => {
    setSelectedTool(null);
  };

  const handleAdminLogin = async (code: string) => {
    // Super Admin Code Bypass
    if (code === 'dqadm') {
      console.log("🚀 Super Admin Code accepted. Bypassing verification.");
      setIsAdminLoggedIn(true);
      setShowAdminLogin(false);
      localStorage.setItem('isAdminLoggedIn', 'true');
      return true;
    }

    // Standard Login (for other codes if properly implemented later)
    // Currently only supporting the super admin bypass as requested
    return false;
  };

  const handleEditTool = (tool: Tool) => {
    setEditingTool(tool);
  };

  const handleSaveTool = async (formData: ToolFormData) => {
    setIsLoading(true);
    try {
      let success = false;
      if (editingTool && editingTool.id) {
        // Update
        const mergedTool: Tool = { ...editingTool, ...formData, articles: editingTool.articles || [], isHidden: editingTool.isHidden || false };
        success = await updateTool(editingTool.name, mergedTool);
      } else {
        // Add
        const newToolPayload: Tool = {
          ...formData,
          articles: [],
          isHidden: false
        } as Tool;
        success = await addTool(newToolPayload);
      }

      if (success) {
        const fetchedTools = await fetchTools();
        setTools(fetchedTools);
        setEditingTool(null);
        if (activeCategory !== 'All' && activeCategory !== formData.category) {
          setActiveCategory('All');
        }
        setSearchQuery('');
      } else {
        alert('Failed to save tool. Please check the console.');
      }
    } catch (e) {
      console.error("Error saving tool:", e);
    } finally {
      setIsLoading(false);
    }
  };



  // Keep selectedTool in sync with tools array
  useEffect(() => {
    if (selectedTool) {
      const updatedTool = tools.find(t => t.id === selectedTool.id);
      if (updatedTool && JSON.stringify(updatedTool) !== JSON.stringify(selectedTool)) {
        console.log('🔄 Syncing selectedTool:', selectedTool.name);
        console.log('🔄 Old articles count:', selectedTool.articles?.length || 0);
        console.log('🔄 New articles count:', updatedTool.articles?.length || 0);
        setSelectedTool(updatedTool);
        console.log('✅ selectedTool synced');
      }
    }
  }, [tools, selectedTool]);

  // Persist Categories



  const handleDeleteTool = async (toolId: string) => {
    const tool = tools.find(t => t.id === toolId);
    if (!tool) return;

    if (window.confirm(`Are you sure you want to delete ${tool.name}?`)) {
      setIsLoading(true);
      try {
        await deleteTool(tool.name);
        const fetchedTools = await fetchTools();
        setTools(fetchedTools);
        if (selectedTool?.id === toolId) {
          setSelectedTool(null);
        }
      } catch (e) {
        console.error("Error deleting tool:", e);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEditArticle = (mode: 'add' | 'edit', tool: Tool, articleIndex?: number) => {
    let articleData: SubArticle | undefined;
    if (mode === 'edit' && typeof articleIndex === 'number' && tool.articles) {
      articleData = tool.articles[articleIndex];
    }
    setArticleEditorState({ mode, toolName: tool.name, articleIndex, articleData });
    setSelectedTool(null);
  };

  const handleSaveArticle = async (toolName: string, articles: SubArticle[]) => {
    const toolToUpdate = tools.find(t => t.name === toolName);
    if (!toolToUpdate) return;

    const updatedToolObj: Tool = { ...toolToUpdate, articles };
    setIsLoading(true);
    try {
      await updateTool(toolName, updatedToolObj);
      const fetchedTools = await fetchTools();
      setTools(fetchedTools);

      setArticleEditorState(null);

      const refreshedTool = fetchedTools.find(t => t.name === toolName);
      if (refreshedTool) setSelectedTool(refreshedTool);
    } catch (e) {
      console.error("Error saving article:", e);
    } finally {
      setIsLoading(false);
    }
  };


  const toggleFavorite = (toolName: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(toolName)
        ? prev.filter(f => f !== toolName)
        : [...prev, toolName];
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const handleCacheUpdate = (toolName: string, details: GeneratedToolDetails) => {
    setAiCache(prev => new Map(prev).set(toolName, details));
  };

  // Category Management Handlers
  // Category Management Handlers
  const handleAddCategory = async (category: CategoryInfo) => {
    setIsLoading(true);
    try {
      await addCategory(category);
      const cats = await fetchCategories();
      setCategories(cats);
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  };

  const handleUpdateCategory = async (originalName: string, updatedCategory: CategoryInfo) => {
    setIsLoading(true);
    try {
      await updateCategory(originalName, updatedCategory);
      const [cats, fetchedTools] = await Promise.all([fetchCategories(), fetchTools()]);
      setCategories(cats);
      setTools(fetchedTools); // Tools category names might have changed
      if (activeCategory === originalName) {
        setActiveCategory(updatedCategory.name);
      }
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  };

  const handleDeleteCategory = async (categoryName: string) => {
    if (window.confirm(`Delete category ${categoryName}?`)) {
      setIsLoading(true);
      try {
        await deleteCategory(categoryName);
        const cats = await fetchCategories();
        setCategories(cats);
        if (activeCategory === categoryName) setActiveCategory('All');
      } catch (e) { console.error(e); } finally { setIsLoading(false); }
    }
  };

  // No loadData effect needed for static


  const filteredTools = useMemo(() => {
    let filtered = tools;

    if (activeCategory === 'Favorites') {
      filtered = filtered.filter(tool => favorites.includes(tool.name));
    } else if (activeCategory !== 'All') {
      filtered = filtered.filter(tool => tool.category === activeCategory);
    }

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(tool =>
        tool.name.toLowerCase().includes(lowerQuery) ||
        tool.description.toLowerCase().includes(lowerQuery) ||
        tool.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    }
    // Filter out hidden tools if not admin
    if (!isAdminLoggedIn) {
      filtered = filtered.filter(tool => !tool.isHidden);
    }

    return filtered;
  }, [tools, activeCategory, searchQuery, favorites, isAdminLoggedIn]);

  // Dock items configuration
  const dockItems = [
    { icon: <MenuIcon className="w-6 h-6" />, label: 'Menu', onClick: () => setIsSidebarOpen(true) },
    { icon: <AllCategoriesIcon className="w-6 h-6" />, label: 'Home', onClick: () => { window.scrollTo({ top: 0, behavior: 'smooth' }); setActiveCategory('All'); } },
    { icon: <FavoritesIcon className="w-6 h-6" />, label: 'Favorites', onClick: () => setActiveCategory('Favorites') },
    {
      icon: theme === 'dark' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />,
      label: theme === 'dark' ? 'Light Mode' : 'Dark Mode',
      onClick: toggleTheme
    },
    { icon: <UserIcon className="w-6 h-6" />, label: 'About', onClick: () => setActiveModal('about') },
    { icon: <LinkIcon className="w-6 h-6" />, label: 'Links', onClick: () => setActiveModal('links') },
    { icon: <BookIcon className="w-6 h-6" />, label: 'Books', onClick: () => setActiveModal('books') },
    { icon: <GlobeIcon className="w-6 h-6" />, label: 'Platforms', onClick: () => setActiveModal('platforms') },
    { icon: <CertificateIcon className="w-6 h-6" />, label: 'Certs', onClick: () => setActiveModal('certs') },
    { icon: <DownloadIcon className="w-6 h-6" />, label: 'Downloads', onClick: () => setActiveModal('downloads') },
    { icon: <FrameworkIcon className="w-6 h-6" />, label: 'Frameworks', onClick: () => setActiveModal('frameworks') },
    { icon: <ShieldCheckIcon className="w-6 h-6" />, label: 'Breach', onClick: () => setActiveModal('breach') },
    { icon: <YoutubeIcon className="w-6 h-6" />, label: 'YouTubers', onClick: () => setActiveModal('youtubers') },
    ...(isAdminLoggedIn
      ? [
        { icon: <GridIcon className="w-6 h-6" />, label: 'Manage', onClick: () => setActiveModal('categoryManager') },
        { icon: <DataIcon className="w-6 h-6" />, label: 'Data', onClick: () => setShowDataManager(true) },
        { icon: <LogoutIcon className="w-6 h-6" />, label: 'Sign Out', onClick: () => setIsAdminLoggedIn(false) }
      ]
      : [{ icon: <LoginIcon className="w-6 h-6" />, label: 'Admin', onClick: () => setShowAdminLogin(true) }]
    )
  ];

  const handleArticleSaveWrapper = (newArticle: SubArticle) => {
    if (!articleEditorState) return;

    const tool = tools.find(t => t.name === articleEditorState.toolName);
    if (!tool) return;

    let updatedArticles = [...(tool.articles || [])];
    if (articleEditorState.mode === 'edit' && typeof articleEditorState.articleIndex === 'number') {
      updatedArticles[articleEditorState.articleIndex] = newArticle;
    } else {
      updatedArticles.push(newArticle);
    }
    handleSaveArticle(articleEditorState.toolName, updatedArticles);
  };

  if (isLoading) {
    return null;
  }



  return (
    <div className={`min - h - screen flex flex - col transition - colors duration - 300`}>
      <Sidebar
        isOpen={isSidebarOpen}
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setSearchQuery(''); // Clear search when switching category
          setIsSidebarOpen(false); // Close mobile sidebar on selection
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex-1 flex flex-col min-h-screen transition-all duration-300">

        <main className="flex-1 container mx-auto px-4 pb-32 pt-32">
          {activeCategory === 'Cheatsheets' ? (
            // ... rest of main content ...
            <Cheatsheets />
          ) : (
            /* Tool Grid */
            filteredTools.length > 0 || isAdminLoggedIn ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTools.map(tool => (
                  <div key={tool.id} className="h-[280px]"> {/* Fixed height container */}
                    <ToolCard
                      tool={tool}
                      onClick={() => handleToolClick(tool)}
                      isAdmin={isAdminLoggedIn}
                      onEdit={() => handleEditTool(tool)}
                      isFavorite={favorites.includes(tool.name)}
                      onToggleFavorite={() => toggleFavorite(tool.name)}
                      isHidden={tool.isHidden}
                      onToggleVisibility={async () => {
                        // Optimistic + Service call
                        try {
                          const updated = { ...tool, isHidden: !tool.isHidden };
                          setTools(prev => prev.map(t => t.id === tool.id ? updated : t));
                        } catch (e) { console.error(e); }
                      }}
                    />
                  </div>
                ))}
                {/* Add New Tool Card (Admin Only) */}
                {isAdminLoggedIn && (
                  <button
                    onClick={() => setEditingTool({
                      id: '', name: '', category: activeCategory !== 'All' && activeCategory !== 'Favorites' ? activeCategory : 'Network Scanning & Analysis',
                      description: '', url: '', color: '#3b82f6', command: '',
                      tags: []
                    } as Tool)}
                    className="h-[280px] rounded-2xl border-2 border-dashed border-slate-300 dark:border-white/10 flex flex-col items-center justify-center text-slate-400 hover:text-blue-500 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all gap-4 group"
                  >
                    <div className="p-4 rounded-full bg-slate-100 dark:bg-white/5 group-hover:scale-110 transition-transform">
                      <PlusIcon className="w-8 h-8" />
                    </div>
                    <span className="font-bold">Add New Tool</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-24 h-24 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                  <SearchIcon className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">No tools found</h3>
                <p className="text-slate-500 dark:text-slate-400">Try adjusting your search or category filter.</p>
              </div>
            )
          )}
        </main>

        {/* Dock - Top Positioned */}
        <div className="fixed top-6 z-40 flex justify-center w-full pointer-events-none transition-all duration-300">
          <div className="pointer-events-auto">
            <Dock
              items={dockItems}
              baseItemSize={isMobile ? 36 : 50}
              magnification={isMobile ? 50 : 70}
              distance={isMobile ? 100 : 200}
            />
          </div>
        </div>
      </div>

      {/* All Modals */}
      {selectedTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div onClick={(e) => e.stopPropagation()} className="w-full h-full bg-white dark:bg-slate-900 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <ToolDetailModal
              tool={selectedTool}
              onClose={handleCloseModal}
              cache={aiCache}
              onCacheUpdate={handleCacheUpdate}
              isAdmin={isAdminLoggedIn}
              onEditArticle={handleEditArticle}
            />
          </div>
        </div>
      )}

      {showAdminLogin && (
        <AdminLoginModal onClose={() => setShowAdminLogin(false)} onLogin={handleAdminLogin} />
      )}

      {editingTool && (
        <ToolFormModal
          key={editingTool.id || 'new-tool'}
          tool={editingTool.id ? editingTool : null}
          categories={categories}
          onClose={() => setEditingTool(null)}
          onSave={handleSaveTool}
        />
      )}

      {articleEditorState && (
        <ArticleEditorModal
          onClose={() => setArticleEditorState(null)}
          article={articleEditorState.articleData || null}
          onSave={handleArticleSaveWrapper}
        />
      )}

      <AboutModal isOpen={activeModal === 'about'} onClose={() => setActiveModal(null)} />
      <UsefulLinksModal isOpen={activeModal === 'links'} onClose={() => setActiveModal(null)} isAdmin={isAdminLoggedIn} />
      <BooksModal isOpen={activeModal === 'books'} onClose={() => setActiveModal(null)} isAdmin={isAdminLoggedIn} />
      <PlatformsModal isOpen={activeModal === 'platforms'} onClose={() => setActiveModal(null)} isAdmin={isAdminLoggedIn} />
      <CertificationsModal isOpen={activeModal === 'certs'} onClose={() => setActiveModal(null)} isAdmin={isAdminLoggedIn} />
      <DownloadsModal isOpen={activeModal === 'downloads'} onClose={() => setActiveModal(null)} isAdmin={isAdminLoggedIn} />
      <FrameworksModal isOpen={activeModal === 'frameworks'} onClose={() => setActiveModal(null)} isAdmin={isAdminLoggedIn} />
      <BreachServicesModal isOpen={activeModal === 'breach'} onClose={() => setActiveModal(null)} isAdmin={isAdminLoggedIn} />
      <YouTubersModal isOpen={activeModal === 'youtubers'} onClose={() => setActiveModal(null)} isAdmin={isAdminLoggedIn} />
      <CategoryManagerModal isOpen={activeModal === 'categoryManager'} onClose={() => setActiveModal(null)} categories={categories} onAddCategory={handleAddCategory} onEditCategory={handleUpdateCategory} onDeleteCategory={handleDeleteCategory} />

      {activeModal === 'submission' && (
        <ToolSubmissionModal
          categories={categories}
          onSuccess={() => {
            setActiveModal(null);
            alert("Tool submitted for review!");
          }}
          onClose={() => setActiveModal(null)}
        />
      )}

      <DataManagerModal isOpen={showDataManager} onClose={() => setShowDataManager(false)} tools={tools} />

    </div>
  );
};

export default App;
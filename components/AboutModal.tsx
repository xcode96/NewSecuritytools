import React, { useEffect } from 'react';
import {
    XMarkIcon,
    ShieldCheckIcon,
    GlobeIcon,
    UsersIcon,
    SearchIcon,
    GridIcon,
    SmartphoneIcon,
    GitHubIcon,
    LinkedInIcon
} from './IconComponents';
import { motion } from 'motion/react';

interface AboutModalProps {
    onClose: () => void;
    isOpen: boolean;
}

const AboutModal: React.FC<AboutModalProps> = ({ onClose, isOpen }) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-slate-50 dark:bg-[#0a0a0a] flex flex-col h-full overflow-y-auto">
            {/* Hero Header */}
            <motion.header
                initial={{ height: "40vh" }}
                animate={{ height: "45vh" }}
                className="relative overflow-hidden shrink-0"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-zinc-900 to-black" />
                <div className="absolute inset-0 bg-black/20 backdrop-filter backdrop-blur-[2px]" />

                {/* Decorative Elements */}
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-50 dark:from-[#0a0a0a] to-transparent z-10" />

                <div className="container mx-auto px-6 relative z-20 h-full flex flex-col justify-center text-center">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-wider mb-6">
                            <ShieldCheckIcon className="w-4 h-4 text-blue-400" />
                            <span>Empowering Security Professionals</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-2xl">
                            Tools.xocode.info
                        </h1>
                        <p className="text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
                            A centralized hub for the best cybersecurity tools, fostering collaboration and strengthening digital defense.
                        </p>
                    </motion.div>
                </div>
            </motion.header>

            {/* Main Content */}
            <main className="flex-grow -mt-20 relative z-20 container mx-auto px-4 sm:px-6 pb-20">
                <div className="bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-white/5 p-8 sm:p-12 min-h-[60vh] flex flex-col gap-12">

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatsCard number="240+" label="Tools Curated" color="text-blue-500" />
                        <StatsCard number="10+" label="Categories" color="text-purple-500" />
                        <StatsCard number="Global" label="Community Reach" color="text-pink-500" icon={<GlobeIcon className="w-8 h-8 mx-auto" />} />
                    </div>

                    {/* Developer Profile - Wide Card */}
                    <div className="bg-gradient-to-br from-slate-900 to-zinc-900 rounded-2xl p-8 md:p-10 border border-slate-800 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-colors duration-500"></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left">
                            <div className="flex-shrink-0">
                                <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-4xl font-bold text-white shadow-xl shadow-blue-900/50">
                                    M
                                </div>
                            </div>
                            <div className="flex-1 space-y-4">
                                <div>
                                    <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Lead Developer & Researcher</h3>
                                    <h2 className="text-3xl font-black text-white mb-1">Manibharathi P</h2>
                                    <p className="text-slate-400 font-medium">System Security Engineer</p>
                                </div>
                                <p className="text-slate-300 leading-relaxed max-w-2xl text-lg">
                                    Information Security Tool Developer with Foundational Expertise in Cybersecurity and AI. Passionate about creating robust tools that empower the infosec community to detect, analyze, and mitigate threats effectively.
                                </p>
                                <div className="flex flex-wrap gap-4 pt-2 justify-center md:justify-start">
                                    <SocialLink href="https://linktree.com/xcode96" icon={<GlobeIcon className="w-4 h-4" />} label="My Links" color="bg-blue-600 hover:bg-blue-500" />
                                    <SocialLink href="https://github.com/xcode96" icon={<GitHubIcon className="w-4 h-4" />} label="Open Source" color="bg-zinc-700 hover:bg-zinc-600" />
                                    <SocialLink href="https://www.linkedin.com/in/manibharathi96" icon={<LinkedInIcon className="w-4 h-4" />} label="LinkedIn" color="bg-[#0077b5] hover:bg-[#006399]" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="space-y-8">
                        <div className="text-center">
                            <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Platform Features</h3>
                            <p className="text-slate-500 dark:text-slate-400">Designed for efficiency and discovery</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <FeatureCard
                                icon={<SearchIcon className="w-6 h-6 text-blue-500" />}
                                title="Smart Search"
                                description="Instantly find tools by name, functionality, or keywords with our optimized search engine."
                            />
                            <FeatureCard
                                icon={<UsersIcon className="w-6 h-6 text-indigo-500" />}
                                title="Community Driven"
                                description="A platform built by researchers for researchers, fostering a culture of knowledge sharing."
                            />
                            <FeatureCard
                                icon={<GitHubIcon className="w-6 h-6 text-slate-700 dark:text-slate-300" />}
                                title="Open Contribution"
                                description="Submit your own tools or suggest improvements to help the repository grow."
                            />
                            <FeatureCard
                                icon={<GridIcon className="w-6 h-6 text-purple-500" />}
                                title="Structured Data"
                                description="Tools organized into logical categories and teams (Red/Blue) for intuitive navigation."
                            />
                            <FeatureCard
                                icon={<ShieldCheckIcon className="w-6 h-6 text-green-500" />}
                                title="Verified Resources"
                                description="Curated content to ensure relevance, safety, and utility for security assessments."
                            />
                            <FeatureCard
                                icon={<SmartphoneIcon className="w-6 h-6 text-pink-500" />}
                                title="Mobile Optimized"
                                description="Access critical toolkit information on-the-go with a fully responsive interface."
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8 text-slate-500 dark:text-slate-400 text-sm font-medium">
                    &copy; {new Date().getFullYear()} Tools.xocode.info • Developed with ❤️ for the Community
                </div>
            </main>
        </div>
    );
};

const StatsCard = ({ number, label, color, icon }: { number: string; label: string; color: string; icon?: React.ReactNode }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-white dark:bg-white/5 p-8 rounded-2xl border border-slate-100 dark:border-white/10 text-center shadow-lg shadow-slate-200/50 dark:shadow-none"
    >
        <div className={`text-5xl font-black ${color} mb-2 flex justify-center items-center`}>
            {icon || number}
        </div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</div>
    </motion.div>
);

const SocialLink = ({ href, icon, label, color }: { href: string; icon: React.ReactNode; label: string; color: string }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-sm transition-all shadow-lg active:scale-95 ${color}`}
    >
        {icon}
        <span>{label}</span>
    </a>
);

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/50 transition-all duration-300"
    >
        <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center mb-4">
            {icon}
        </div>
        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h4>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
    </motion.div>
);

export default AboutModal;

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
        <div className="fixed inset-0 z-50 bg-white flex flex-col h-full overflow-y-auto">
            {/* Header - Simple & Clean */}
            <header className="relative py-20 bg-white">
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <button
                        onClick={onClose}
                        className="absolute top-0 right-6 p-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>

                    <div className="max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[11px] font-bold uppercase tracking-wider mb-8">
                            <ShieldCheckIcon className="w-3.5 h-3.5" />
                            <span>Security Professionals</span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 tracking-tight leading-tight">
                            ↄxCODE96---•
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto leading-relaxed font-light">
                            Tools.xocode.info exists to centralize the best cybersecurity tools. Our platform is a collaborative hub where professionals, researchers, and enthusiasts find, share, and evaluate essential resources. We believe digital security is a shared responsibility, and by sharing knowledge, we strengthen the defenses of the entire community.
                        </p>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow container mx-auto px-4 sm:px-6 pb-20">
                <div className="flex flex-col gap-16">

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatsCard number="240+" label="Tools Curated" color="text-blue-600" />
                        <StatsCard number="10+" label="Categories" color="text-purple-600" />
                        <StatsCard number="Global" label="Reach" color="text-pink-600" icon={<GlobeIcon className="w-8 h-8 mx-auto" />} />
                    </div>

                    {/* Developer Profile - Wide Card (White Theme, No Icon) */}
                    <div className="bg-slate-50 rounded-2xl p-8 md:p-12 border border-slate-100 text-slate-900 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-60"></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left">
                            <div className="flex-1 space-y-6">
                                <div>
                                    <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">Developer & Researcher</h3>
                                    <h2 className="text-3xl font-black text-slate-900 mb-2">Manibharathi P</h2>
                                    <p className="text-slate-500 font-medium">System Security Engineer & Independent Security Researcher</p>
                                </div>
                                <p className="text-slate-600 leading-relaxed max-w-3xl text-lg">
                                    As a principled builder, I see that cybersecurity and policy are too often discussed in isolation from the human experience. As a systems-level thinker, I believe it's time to reframe the conversation — placing resilience, empathy, and ethics at its core..                                </p>
                                <div className="flex flex-wrap gap-3 pt-2 justify-center md:justify-start">
                                    <SocialLink href="https://linktr.ee/Xcode96" icon={<GlobeIcon className="w-4 h-4" />} label="My Links" color="bg-blue-600 hover:bg-blue-500 text-white" />
                                    <SocialLink href="https://github.com/Xcode96" icon={<GitHubIcon className="w-4 h-4" />} label="Open Source" color="bg-slate-800 hover:bg-slate-700 text-white" />
                                    <SocialLink href="https://www.linkedin.com/in/manibharathi96" icon={<LinkedInIcon className="w-4 h-4" />} label="LinkedIn" color="bg-[#0077b5] hover:bg-[#006399] text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="space-y-10">
                        <div className="text-center">
                            <h3 className="text-2xl font-black text-slate-900 mb-3">Platform Features</h3>
                            <p className="text-slate-500">Designed for efficiency and discovery</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <FeatureCard
                                icon={<SearchIcon className="w-5 h-5 text-blue-600" />}
                                title="Advanced Search"
                                description="An intelligent search system that allows you to find tools by name, category, or functionality."
                            />
                            <FeatureCard
                                icon={<UsersIcon className="w-5 h-5 text-indigo-600" />}
                                title="Active Community"
                                description="Connect with other professionals, share experiences, and discover new tools."
                            />
                            <FeatureCard
                                icon={<GitHubIcon className="w-5 h-5 text-slate-700" />}
                                title="Contributions"
                                description="Add your favorite tools and help expand our knowledge base."
                            />
                            <FeatureCard
                                icon={<GridIcon className="w-5 h-5 text-purple-600" />}
                                title="Categorization"
                                description="Tools organized into specific categories for easy navigation."
                            />
                            <FeatureCard
                                icon={<ShieldCheckIcon className="w-5 h-5 text-green-600" />}
                                title="Security"
                                description="All tools are reviewed and validated by the community before being published."
                            />
                            <FeatureCard
                                icon={<SmartphoneIcon className="w-5 h-5 text-pink-600" />}
                                title="Responsive Design"
                                description="Access the platform from any device with a mobile-optimized interface."
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-16 text-slate-400 text-sm font-medium">
                    &copy; 2025 Tools.xocode.info - Developed with ❤️ for the Community
                </div>
            </main>
        </div>
    );
};

const StatsCard = ({ number, label, color, icon }: { number: string; label: string; color: string; icon?: React.ReactNode }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-slate-50 p-8 rounded-2xl border border-slate-100 text-center"
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
        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-slate-200/50 active:scale-95 ${color}`}
    >
        {icon}
        <span>{label}</span>
    </a>
);

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="p-8 rounded-2xl bg-white border border-slate-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
    >
        <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center mb-5 text-slate-600">
            {icon}
        </div>
        <h4 className="text-lg font-bold text-slate-900 mb-2">{title}</h4>
        <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
    </motion.div>
);

export default AboutModal;

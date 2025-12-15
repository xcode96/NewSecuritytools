import React, { useEffect } from 'react';
import {
    XMarkIcon,
    ShieldCheckIcon,
    GlobeIcon,
    UsersIcon,
    SearchIcon,
    CheckIcon,
    GridIcon,
    SmartphoneIcon,
    GitHubIcon,
    LinkedInIcon
} from './IconComponents';

interface AboutModalProps {
    onClose: () => void;
    isOpen: boolean;
}

const AboutModal: React.FC<AboutModalProps> = ({ onClose, isOpen }) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300">
            <div
                className="bg-white dark:bg-slate-900 w-full h-full overflow-y-auto rounded-none shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                    <div>
                        <h2 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Tools.xocode.info
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                            Cybersecurity Tools Platform
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 space-y-12">

                    {/* Mission Section */}
                    <section className="text-center max-w-2xl mx-auto space-y-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-2">
                            <ShieldCheckIcon className="w-8 h-8" />
                        </div>
                        <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Our Mission</h3>
                        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                            <span className="font-semibold text-slate-800 dark:text-slate-100">tools.xocode.info</span> exists to centralize the best cybersecurity tools. Our platform is a collaborative hub where professionals, researchers, and enthusiasts find, share, and evaluate essential resources. We believe digital security is a shared responsibility, and by sharing knowledge, we strengthen the defenses of the entire community.
                        </p>
                    </section>

                    {/* Stats Grid */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 text-center space-y-2 hover:scale-105 transition-transform duration-300">
                            <div className="text-4xl font-black text-blue-600 dark:text-blue-400">240+</div>
                            <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tools</div>
                        </div>
                        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 text-center space-y-2 hover:scale-105 transition-transform duration-300">
                            <div className="text-4xl font-black text-purple-600 dark:text-purple-400">10+</div>
                            <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Categories</div>
                        </div>
                        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 text-center space-y-2 hover:scale-105 transition-transform duration-300">
                            <div className="flex items-center justify-center gap-2 text-4xl font-black text-pink-600 dark:text-pink-400">
                                <GlobeIcon className="w-8 h-8" />
                            </div>
                            <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Global Reach</div>
                        </div>
                    </section>

                    {/* Developer Section */}
                    <section className="border-t border-slate-200 dark:border-slate-800 pt-10">
                        <div className="flex flex-col md:flex-row items-center gap-8 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-700">

                            <div className="text-center md:text-left space-y-3 w-full">
                                <div>
                                    <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">Developed By</h4>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Manibharathi P</h3>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium">System Security Engineer & Independent Security Researcher</p>
                                </div>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                                    Information Security Tool Developer with Foundational Expertise in Cybersecurity and AI. Passionate about technology and security, dedicated to creating tools that empower the information security professional community.
                                </p>
                                <div className="flex flex-wrap gap-4 pt-4 justify-center md:justify-start">
                                    <a href="https://linktree.com/xcode96" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm">
                                        <GlobeIcon className="w-4 h-4" />
                                        <span>My Links</span>
                                    </a>
                                    <a href="https://github.com/xcode96" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium text-sm">
                                        <GitHubIcon className="w-4 h-4" />
                                        <span>Open Source</span>
                                    </a>
                                    <a href="https://www.linkedin.com/in/manibharathi96" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors font-medium text-sm">
                                        <LinkedInIcon className="w-4 h-4" />
                                        <span>LinkedIn</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Features Grid */}
                    <section className="space-y-6">
                        <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 text-center">Platform Features</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <FeatureCard
                                icon={<SearchIcon className="w-6 h-6 text-blue-500" />}
                                title="Advanced Search"
                                description="An intelligent search system that allows you to find tools by name, category, or functionality."
                            />
                            <FeatureCard
                                icon={<UsersIcon className="w-6 h-6 text-indigo-500" />}
                                title="Active Community"
                                description="Connect with other professionals, share experiences, and discover new tools."
                            />
                            <FeatureCard
                                icon={<GitHubIcon className="w-6 h-6 text-slate-700 dark:text-slate-300" />}
                                title="Contributions"
                                description="Add your favorite tools and help expand our knowledge base."
                            />
                            <FeatureCard
                                icon={<GridIcon className="w-6 h-6 text-purple-500" />}
                                title="Categorization"
                                description="Tools organized into specific categories for easy navigation."
                            />
                            <FeatureCard
                                icon={<ShieldCheckIcon className="w-6 h-6 text-green-500" />}
                                title="Security"
                                description="All tools are reviewed and validated by the community before being published."
                            />
                            <FeatureCard
                                icon={<SmartphoneIcon className="w-6 h-6 text-pink-500" />}
                                title="Responsive Design"
                                description="Access the platform from any device with a mobile-optimized interface."
                            />
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-center text-slate-500 dark:text-slate-400 text-sm">
                    &copy; {new Date().getFullYear()} Tools.xocode.info - Developed with ❤️ for the Community
                </div>
            </div>
        </div>
    );
};

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
    <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-start gap-4">
            <div className="flex-shrink-0 p-2 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                {icon}
            </div>
            <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">{title}</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
            </div>
        </div>
    </div>
);

export default AboutModal;

import React, { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
// use your own icon import if react-icons is not available
import { GoArrowUpRight, GoSearch } from 'react-icons/go';
import { SearchIcon } from './IconComponents';
import './CardNav.css';

interface LinkItem {
    label: string;
    href?: string;
    onClick?: () => void;
    ariaLabel?: string;
}

interface CardItem {
    label: string;
    bgColor: string;
    textColor: string;
    links: LinkItem[];
}

interface CardNavProps {
    logo?: string;
    logoAlt?: string;
    items: CardItem[];
    className?: string;
    ease?: string;
    baseColor?: string;
    menuColor?: string;
    buttonBgColor?: string;
    buttonTextColor?: string;
    onCtaClick?: () => void;
}

const CardNav = ({
    logo,
    logoAlt = 'Logo',
    items,
    className = '',
    ease = 'power3.out',
    baseColor = '#fff',
    menuColor,
    buttonBgColor,
    buttonTextColor,
    onCtaClick
}: CardNavProps) => {
    const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState(''); // New State
    const navRef = useRef<HTMLElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const tlRef = useRef<gsap.core.Timeline | null>(null);

    const calculateHeight = () => {
        const navEl = navRef.current;
        if (!navEl) return 260;

        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        // Always calculate height based on scrollHeight to support variable content
        const contentEl = navEl.querySelector('.card-nav-content') as HTMLElement;
        if (contentEl) {
            const wasVisible = contentEl.style.visibility;
            const wasPointerEvents = contentEl.style.pointerEvents;
            const wasPosition = contentEl.style.position;
            const wasHeight = contentEl.style.height;

            contentEl.style.visibility = 'visible';
            contentEl.style.pointerEvents = 'auto';
            contentEl.style.position = 'static';
            contentEl.style.height = 'auto';

            // Force layout
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            contentEl.offsetHeight;

            const topBar = 60;
            const padding = isMobile ? 32 : 16; // Extra padding for safety
            const contentHeight = contentEl.scrollHeight;

            // Reset styles
            contentEl.style.visibility = wasVisible;
            contentEl.style.pointerEvents = wasPointerEvents;
            contentEl.style.position = wasPosition;
            contentEl.style.height = wasHeight;

            return topBar + contentHeight + padding;
        }
        return 260;
    };

    const createTimeline = () => {
        const navEl = navRef.current;
        if (!navEl) return null;

        gsap.set(navEl, { height: 60, overflow: 'hidden' });
        gsap.set(cardsRef.current, { y: 50, opacity: 0 });

        const tl = gsap.timeline({ paused: true });

        tl.to(navEl, {
            height: calculateHeight,
            duration: 0.4,
            ease
        });

        tl.to(cardsRef.current, { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 }, '-=0.1');

        return tl;
    };

    useLayoutEffect(() => {
        const tl = createTimeline();
        tlRef.current = tl;

        return () => {
            tl?.kill();
            tlRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ease, items]);

    useLayoutEffect(() => {
        const handleResize = () => {
            if (!tlRef.current) return;

            if (isExpanded) {
                // If expanded, update height dynamically
                const newHeight = calculateHeight();
                gsap.to(navRef.current, { height: newHeight, duration: 0.2 });
            } else {
                // Reset timeline if resize happens while closed
                tlRef.current.kill();
                const newTl = createTimeline();
                if (newTl) {
                    tlRef.current = newTl;
                }
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isExpanded]);

    // Filter Items Logic
    const filteredItems = items.map(card => ({
        ...card,
        links: card.links.filter(link =>
            link.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(card => card.links.length > 0); // Hide empty cards if search excludes all

    const toggleMenu = () => {
        const tl = tlRef.current;
        if (!tl) return;
        if (!isExpanded) {
            setIsHamburgerOpen(true);
            setIsExpanded(true);
            tl.play(0);
        } else {
            setIsHamburgerOpen(false);
            tl.eventCallback('onReverseComplete', () => setIsExpanded(false));
            tl.reverse();
        }
    };

    const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
        if (el) cardsRef.current[i] = el;
    };

    const handleLinkClick = (e: React.MouseEvent, cb?: () => void) => {
        e.preventDefault();
        if (cb) cb();
        toggleMenu(); // Auto close on click
    };

    return (
        <div className={`card-nav-container ${className}`}>
            <nav ref={navRef} className={`card-nav ${isExpanded ? 'open' : ''}`} style={{ backgroundColor: baseColor }}>
                <div className="card-nav-top">
                    <div
                        className={`hamburger-menu ${isHamburgerOpen ? 'open' : ''}`}
                        onClick={toggleMenu}
                        role="button"
                        aria-label={isExpanded ? 'Close menu' : 'Open menu'}
                        tabIndex={0}
                        style={{ color: menuColor || '#000' }}
                    >
                        <div className="hamburger-line" />
                        <div className="hamburger-line" />
                    </div>

                    <div className="logo-container">
                        {logo && <img src={logo} alt={logoAlt} className="logo" />}
                        {!logo && <span className="text-xl font-bold tracking-tighter" style={{ color: menuColor }}>xcode<span className="text-blue-500">96</span></span>}
                    </div>
                </div>

                <div className="card-nav-content" aria-hidden={!isExpanded}>
                    {/* SEARCH BAR SECTION */}
                    <div className="col-span-1 md:col-span-3 mb-4 px-2">
                        <div className="relative group w-full max-w-md mx-auto">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                                <SearchIcon className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search categories..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl
                                  text-base text-slate-900 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500/50"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>

                    {(filteredItems || []).slice(0, 3).map((item, idx) => (
                        <div
                            key={`${item.label}-${idx}`}
                            className="nav-card"
                            ref={setCardRef(idx)}
                            style={{ backgroundColor: item.bgColor, color: item.textColor }}
                        >
                            <div className="nav-card-label">{item.label}</div>
                            <div className="nav-card-links">
                                {item.links?.map((lnk, i) => (
                                    <a
                                        key={`${lnk.label}-${i}`}
                                        className="nav-card-link cursor-pointer"
                                        href={lnk.href || '#'}
                                        onClick={(e) => handleLinkClick(e, lnk.onClick)}
                                        aria-label={lnk.ariaLabel}
                                    >
                                        <GoArrowUpRight className="nav-card-link-icon" aria-hidden="true" />
                                        {lnk.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </nav>
        </div>
    );
};

export default CardNav;

import React, { useState, useRef, useEffect } from 'react';
import { UserIcon, LogoutIcon, FileTextIcon } from './IconComponents';
import type { UserProfile } from '../types';

interface UserAuthButtonProps {
    userProfile: UserProfile | null;
    onSignIn: () => void;
    onSignOut: () => void;
    onViewSubmissions: () => void;
}

export const UserAuthButton: React.FC<UserAuthButtonProps> = ({
    userProfile,
    onSignIn,
    onSignOut,
    onViewSubmissions
}) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!userProfile) {
        return (
            <button
                onClick={onSignIn}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors text-sm"
                aria-label="Sign in with Google"
            >
                <UserIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Sign In</span>
            </button>
        );
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-200/70 dark:hover:bg-slate-700/70 transition-colors"
                aria-label="User menu"
            >
                {userProfile.avatarUrl ? (
                    <img
                        src={userProfile.avatarUrl}
                        alt={userProfile.fullName || 'User'}
                        className="w-8 h-8 rounded-full"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                        {(userProfile.fullName || userProfile.email || 'U')[0].toUpperCase()}
                    </div>
                )}
            </button>

            {showDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50">
                    <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                            {userProfile.fullName || 'User'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {userProfile.email}
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            onViewSubmissions();
                            setShowDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                    >
                        <FileTextIcon className="w-4 h-4" />
                        My Submissions
                    </button>

                    <button
                        onClick={() => {
                            onSignOut();
                            setShowDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                    >
                        <LogoutIcon className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            )}
        </div>
    );
};

export interface Theme {
    id: string;
    name: string;
    type: 'light' | 'dark';
    background: string; // Tailwind classes for the background
    primaryColor?: string; // Hex for accent color usage if needed
}

export const THEMES: Theme[] = [
    {
        id: 'dark',
        name: 'Dark',
        type: 'dark',
        background: 'bg-slate-900',
        primaryColor: '#3b82f6'
    },
    {
        id: 'light',
        name: 'Light',
        type: 'light',
        background: 'bg-slate-50',
        primaryColor: '#3b82f6'
    },
    {
        id: 'purple',
        name: 'Purple',
        type: 'dark',
        background: 'bg-gradient-to-br from-purple-900 via-purple-950 to-black',
        primaryColor: '#a855f7'
    },
    {
        id: 'ocean',
        name: 'Ocean',
        type: 'dark',
        background: 'bg-gradient-to-br from-blue-900 via-cyan-900 to-teal-900',
        primaryColor: '#06b6d4'
    },
    {
        id: 'midnight',
        name: 'Midnight',
        type: 'dark',
        background: 'bg-gradient-to-br from-blue-950 via-slate-950 to-black',
        primaryColor: '#6366f1'
    },
    {
        id: 'arctic',
        name: 'Arctic',
        type: 'light',
        background: 'bg-gradient-to-br from-cyan-50 via-blue-50 to-white',
        primaryColor: '#0ea5e9'
    },
    {
        id: 'cyberpunk',
        name: 'Cyberpunk',
        type: 'dark',
        background: 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900 via-slate-900 to-black',
        // Ideally we put some neon accents, but background-wise dark is better for contrast. 
        // Let's try a more vibrant gradient.
        // bg-gradient-to-br from-yellow-400/20 via-pink-500/20 to-purple-600/20 bg-slate-900
        // Simplified for class string:
        background: 'bg-slate-900 bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-purple-900 via-slate-900 to-yellow-900/50',
        primaryColor: '#f472b6'
    },
    {
        id: 'terminal',
        name: 'Terminal',
        type: 'dark',
        background: 'bg-black',
        primaryColor: '#22c55e'
    },
    {
        id: 'light-purple',
        name: 'Light Purple',
        type: 'light',
        background: 'bg-gradient-to-br from-purple-50 via-fuchsia-50 to-white',
        primaryColor: '#c084fc'
    },
    {
        id: 'muted-dark',
        name: 'Muted Dark',
        type: 'dark',
        background: 'bg-zinc-900',
        primaryColor: '#71717a'
    },
    {
        id: 'solarized',
        name: 'Solarized',
        type: 'light',
        background: 'bg-[#fdf6e3]',
        primaryColor: '#b58900'
    },
    {
        id: 'nord',
        name: 'Nord',
        type: 'dark',
        background: 'bg-[#2e3440]',
        primaryColor: '#88c0d0'
    },
    {
        id: 'gruvbox',
        name: 'Gruvbox',
        type: 'dark',
        background: 'bg-[#282828]',
        primaryColor: '#fe8019'
    },
    {
        id: 'tokyo-night',
        name: 'Tokyo Night',
        type: 'dark',
        background: 'bg-[#1a1b26]',
        primaryColor: '#7aa2f7'
    },
    {
        id: 'catppuccin',
        name: 'Catppuccin',
        type: 'dark',
        background: 'bg-[#1e1e2e]',
        primaryColor: '#cba6f7'
    },
    {
        id: 'everforest',
        name: 'Everforest',
        type: 'dark',
        background: 'bg-[#2b3339]',
        primaryColor: '#a7c080'
    },
    {
        id: 'sunset',
        name: 'Sunset',
        type: 'dark',
        background: 'bg-gradient-to-br from-orange-900 via-rose-900 to-slate-900',
        primaryColor: '#f97316'
    },
    {
        id: 'dracula',
        name: 'Dracula',
        type: 'dark',
        background: 'bg-[#282a36]',
        primaryColor: '#ff79c6'
    }
];

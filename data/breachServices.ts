export type ServiceType = 'Free' | 'Premium' | 'Paid';
export type ServiceCategory = 'Free Services' | 'Premium Services' | 'Intelligence Platforms' | 'Community Services';

export interface BreachService {
    id: string;
    name: string;
    category: ServiceCategory;
    type: ServiceType;
    description: string;
    icon: string;
    keyFeatures: string[];
    tags: string[];
    url: string;
}

export const breachServices: BreachService[] = [
    {
        id: '1',
        name: 'Have I Been Pwned',
        category: 'Free Services',
        type: 'Free',
        description: 'The most comprehensive breach notification service. Check if your email or phone has been compromised in data breaches.',
        icon: '🛡️',
        keyFeatures: ['Email Check', 'Phone Check', 'Password Check', 'Breach Database'],
        tags: ['Email', 'Breach Check', 'Free', 'Popular'],
        url: 'https://haveibeenpwned.com/'
    },
    {
        id: '2',
        name: 'LeakCheck',
        category: 'Premium Services',
        type: 'Premium',
        description: 'Advanced data breach search engine with detailed information about compromised accounts and credentials.',
        icon: '🔍',
        keyFeatures: ['Email Search', 'Domain Search', 'API Access', 'Detailed Results'],
        tags: ['API', 'Detailed', 'Domain Search', 'Professional'],
        url: 'https://breachdirectory.org/'
    },
    {
        id: '3',
        name: 'DeHashed',
        category: 'Premium Services',
        type: 'Paid',
        description: 'Professional breach search platform providing comprehensive data leak investigation tools for security professionals.',
        icon: '🔐',
        keyFeatures: ['Advanced Search', 'API Integration', 'Bulk Queries', 'Professional Tools'],
        tags: ['Professional', 'API', 'Bulk Search', 'Advanced'],
        url: 'https://www.dehashed.com/'
    },
    {
        id: '4',
        name: 'Intelligence X',
        category: 'Intelligence Platforms',
        type: 'Premium',
        description: 'Search engine and data archive for cybersecurity professionals, including breach data and dark web content.',
        icon: '🕵️',
        keyFeatures: ['Dark Web Search', 'Historical Data', 'OSINT Tools', 'Archive Access'],
        tags: ['OSINT', 'Dark Web', 'Intelligence', 'Archive'],
        url: 'https://intelx.io/'
    },
    {
        id: '5',
        name: 'SnusBase',
        category: 'Premium Services',
        type: 'Paid',
        description: 'Database search engine for leaked credentials and personal information with extensive coverage.',
        icon: '💾',
        keyFeatures: ['Credential Search', 'Personal Info', 'Multiple Formats', 'Regular Updates'],
        tags: ['Credentials', 'Personal Info', 'Extensive', 'Updated'],
        url: 'https://snusbase.com/'
    },
    {
        id: '6',
        name: 'Leak Lookup',
        category: 'Free Services',
        type: 'Free',
        description: 'Simple and effective breach lookup service for checking if accounts have been compromised in data breaches.',
        icon: '🔎',
        keyFeatures: ['Email Lookup', 'Simple Interface', 'Quick Results', 'Basic Search'],
        tags: ['Simple', 'Quick', 'Basic', 'Free'],
        url: 'https://leak-lookup.com/'
    },
    {
        id: '7',
        name: 'Breach Directory',
        category: 'Community Services',
        type: 'Free',
        description: 'Community-driven breach database providing access to leaked data for security research purposes.',
        icon: '📚',
        keyFeatures: ['Community Driven', 'Research Focus', 'Open Access', 'Educational'],
        tags: ['Community', 'Research', 'Educational', 'Open'],
        url: 'https://breachdirectory.org/'
    }
];

export const breachStats = {
    total: 7,
    free: 3,
    premium: 4
};

export const bestPractices = [
    {
        title: 'Use Unique Passwords',
        description: 'Never reuse passwords across multiple accounts. Use a password manager.'
    },
    {
        title: 'Enable 2FA',
        description: 'Two-factor authentication adds an extra layer of security to your accounts.'
    },
    {
        title: 'Monitor Regularly',
        description: 'Check these services regularly to stay informed about new breaches.'
    },
    {
        title: 'Update Compromised Accounts',
        description: 'If found in a breach, immediately change passwords and review account activity.'
    }
];

export const legalDisclaimer = [
    'These services are provided for legitimate security research and personal data protection purposes only.',
    'Always respect privacy laws, terms of service, and ethical boundaries when using these tools.',
    'Only check data that you own or have explicit permission to investigate.',
    'RedTeam.Blue is not responsible for the misuse of these services or any legal consequences.',
    'Some services may require payment or registration to access full features.'
];

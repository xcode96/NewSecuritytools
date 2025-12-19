export type DownloadCategory = 'Linux Security Distributions' | 'Digital Forensics' | 'Windows Security Tools' | 'Ubuntu & Debian' | 'Specialized Tools' | 'Development Tools';
export type DownloadTeam = 'Red Team' | 'Blue Team' | 'Development';

export interface DownloadItem {
    id: string;
    name: string;
    code: string; // e.g. "WIN", "Kali Linux"
    type: string; // e.g. "ISO", "Tool" - actually user data doesn't explicitly have "Type" column but imply it. 
    // "All Types" filter implies it. 
    // "14 ISO Images" stat implies most are ISOs.
    // Node.js/Python are likely "Installer" or "Tool".
    // Let's infer: Distros/Windows/Specialized = "ISO", Dev = "Installer" or "Tool".
    category: DownloadCategory;
    team: DownloadTeam;
    description: string;
    popularity: number; // percentage
    keyFeatures: string[];
    url: string;
}

export const downloadsData: DownloadItem[] = [
    // Linux Security Distributions
    {
        id: '1',
        name: 'Kali Linux',
        code: 'Kali Linux',
        type: 'ISO',
        category: 'Linux Security Distributions',
        team: 'Red Team',
        description: 'Advanced Penetration Testing Distribution',
        url: 'https://www.kali.org/get-kali/',
        popularity: 5,
        keyFeatures: ['600+ Tools', 'Rolling Release', 'Wide Support']
    },
    {
        id: '2',
        name: 'Parrot OS',
        code: 'Parrot OS',
        description: 'Security-oriented operating system focused on Pentesting and Privacy',
        link: 'https://parrotsec.org/download/',
        category: 'Linux Security Distributions',
        type: 'ISO',
        team: 'Red Team',
        popularity: 4.5,
        keyFeatures: ['Lightweight', 'Privacy Focused', 'Dev Tools']
    },
    {
        id: '3',
        name: 'Tails',
        code: 'Tails',
        description: 'The Amnesic Incognito Live System used to preserve privacy and anonymity',
        link: 'https://tails.boum.org/install/',
        category: 'Linux Security Distributions',
        type: 'ISO',
        team: 'Red Team',
        popularity: 4.5,
        keyFeatures: ['Anonymity', 'Tor Integrated', 'Amnezia']
    },
    {
        id: '4',
        name: 'BlackArch',
        code: 'BlackArch',
        description: 'Arch Linux-based penetration testing distribution',
        link: 'https://blackarch.org/downloads.html',
        category: 'Linux Security Distributions',
        type: 'ISO',
        team: 'Red Team',
        popularity: 4,
        keyFeatures: ['2800+ Tools', 'Modular', 'Arch Based']
    },
    {
        id: '5',
        name: 'SIFT Workstation',
        code: 'SIFT Workstation',
        description: 'SANS Investigative Forensic Toolkit',
        link: 'https://www.sans.org/tools/sift-workstation/',
        category: 'Digital Forensics',
        type: 'VM',
        team: 'Blue Team',
        popularity: 5,
        keyFeatures: ['Forensics', 'Incident Response', 'Free']
    },
    {
        id: '6',
        name: 'Autopsy',
        code: 'Autopsy',
        description: 'Digital Forensics Platform',
        link: 'https://www.autopsy.com/download/',
        category: 'Digital Forensics',
        type: 'Installer',
        team: 'Blue Team',
        popularity: 4.5,
        keyFeatures: ['User Friendly', 'Analysis', 'Reporting']
    },
    {
        id: '7',
        name: 'Wireshark',
        code: 'Wireshark',
        description: 'Network Protocol Analyzer',
        link: 'https://www.wireshark.org/download.html',
        category: 'Specialized Tools',
        type: 'Installer',
        team: 'Blue Team',
        popularity: 5,
        keyFeatures: ['Packet Analysis', 'Deep Inspection', 'Multi-Platform']
    },
    {
        id: '8',
        name: 'Nmap',
        code: 'Nmap',
        description: 'Network Mapper',
        link: 'https://nmap.org/download.html',
        category: 'Specialized Tools',
        type: 'Installer',
        team: 'Red Team',
        popularity: 5,
        keyFeatures: ['Network Discovery', 'Security Auditing', 'Scriptable']
    },
    {
        id: '9',
        name: 'Burp Suite Community',
        code: 'Burp Suite',
        description: 'Web Application Security Testing',
        link: 'https://portswigger.net/burp/communitydownload',
        category: 'Specialized Tools',
        type: 'Installer',
        team: 'Red Team',
        popularity: 5,
        keyFeatures: ['Web Proxy', 'Scanner', 'Repeater']
    },
    {
        id: '10',
        name: 'Ghidra',
        code: 'Ghidra',
        description: 'Software Reverse Engineering Suite',
        link: 'https://ghidra-sre.org/',
        category: 'Specialized Tools',
        type: 'ZIP',
        team: 'Red Team',
        popularity: 4.5,
        keyFeatures: ['Decompiler', 'Multi-Arch', 'Scriptable']
    },
    {
        id: '11',
        name: 'Metasploit Framework',
        code: 'Metasploit',
        description: 'Penetration Testing Framework',
        link: 'https://www.metasploit.com/download',
        category: 'Specialized Tools',
        type: 'Installer',
        team: 'Red Team',
        popularity: 5,
        keyFeatures: ['Exploitation', 'Payloads', 'Evading']
    },
    {
        id: '12',
        name: 'Windows 11 Enterprise',
        code: 'WIN',
        type: 'ISO',
        category: 'Windows Security Tools',
        team: 'Blue Team',
        description: 'Latest Windows 11 Enterprise edition with advanced security features.',
        popularity: 90,
        keyFeatures: ['Windows Defender', 'BitLocker', 'Windows Hello', 'Credential Guard', 'Device Guard'],
        link: 'https://www.microsoft.com/en-us/evalcenter/evaluate-windows-11-enterprise'
    },
    {
        id: '13',
        name: 'Windows Server 2022',
        code: 'WIN',
        type: 'ISO',
        category: 'Windows Security Tools',
        team: 'Blue Team',
        description: 'Enterprise-grade server operating system with enhanced security.',
        popularity: 85,
        keyFeatures: ['Secured-core', 'Windows Admin Center', 'Hyper-V', 'Storage Spaces', 'Failover Clustering'],
        link: 'https://www.microsoft.com/en-us/evalcenter/evaluate-windows-server-2022'
    },
    // Ubuntu & Debian
    {
        id: '14',
        name: 'Ubuntu Server LTS',
        code: 'Ubuntu Server LTS',
        type: 'ISO',
        category: 'Ubuntu & Debian',
        team: 'Blue Team',
        description: 'Long Term Support server edition perfect for security infrastructure.',
        popularity: 95,
        keyFeatures: ['LTS Support', 'Security Updates', 'Container Ready', 'Cloud Integration', 'Snap Packages'],
        link: 'https://ubuntu.com/download/server'
    },
    {
        id: '15',
        name: 'Ubuntu Desktop LTS',
        code: 'Ubuntu Desktop LTS',
        type: 'ISO',
        category: 'Ubuntu & Debian',
        team: 'Blue Team',
        description: 'User-friendly Linux distribution with excellent security tools support.',
        popularity: 90,
        keyFeatures: ['GNOME Desktop', 'Snap Store', 'Firefox', 'LibreOffice', 'Security Center'],
        link: 'https://ubuntu.com/download/desktop'
    },
    {
        id: '16',
        name: 'Debian Security',
        code: 'Debian Security',
        type: 'ISO',
        category: 'Ubuntu & Debian',
        team: 'Blue Team',
        description: 'Rock-solid Linux distribution with excellent security track record.',
        popularity: 85,
        keyFeatures: ['Stability', 'Security Focus', 'Package Management', 'Free Software', 'Community Support'],
        link: 'https://www.debian.org/download'
    },
    // Specialized Tools
    {
        id: '17',
        name: 'pfSense',
        code: 'pfSense',
        type: 'ISO',
        category: 'Specialized Tools',
        team: 'Blue Team',
        description: 'Open source firewall and router platform based on FreeBSD.',
        popularity: 90,
        keyFeatures: ['Firewall', 'VPN Server', 'Traffic Shaping', 'Load Balancing', 'Intrusion Detection'],
        link: 'https://shop.netgate.com/products/netgate-installer'
    },
    {
        id: '18',
        name: 'Security Onion',
        code: 'Security Onion',
        type: 'ISO',
        category: 'Specialized Tools',
        team: 'Blue Team',
        description: 'Linux distribution for threat hunting, enterprise security monitoring, and log management.',
        popularity: 80,
        keyFeatures: ['Elasticsearch', 'Logstash', 'Kibana', 'Suricata', 'Zeek'],
        link: 'https://securityonionsolutions.com/software/'
    },
    {
        id: '19',
        name: 'REMnux',
        code: 'REMnux',
        type: 'ISO',
        category: 'Specialized Tools',
        team: 'Blue Team',
        description: 'Linux toolkit for reverse-engineering and analyzing malicious software.',
        popularity: 75,
        keyFeatures: ['Malware Analysis', 'Reverse Engineering', 'Memory Forensics', 'Network Analysis', 'Static Analysis'],
        link: 'https://remnux.org/get-the-remnux-distro/'
    },
    // Development Tools
    {
        id: '20',
        name: 'Node.js LTS',
        code: 'Node.js LTS',
        type: 'Tool',
        category: 'Development Tools',
        team: 'Development',
        description: 'JavaScript runtime for building security tools and applications.',
        popularity: 95,
        keyFeatures: ['NPM Package Manager', 'Security Modules', 'Async Programming', 'Cross-platform', 'Large Ecosystem'],
        link: 'https://nodejs.org/en/download'
    },
    {
        id: '21',
        name: 'Python Security',
        code: 'Python Security',
        type: 'Tool',
        category: 'Development Tools',
        team: 'Development',
        description: 'Python distribution with security-focused libraries and tools.',
        popularity: 100,
        keyFeatures: ['Scapy', 'Requests', 'Cryptography', 'Paramiko', 'Beautiful Soup'],
        link: 'https://www.python.org/downloads/'
    }
];

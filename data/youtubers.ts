export interface YouTuber {
    id: string;
    name: string;
    description: string; // inferred or generic since not strictly provided, but tags help.
    tags: string[];
    link: string;
}

export const youtubersData: YouTuber[] = [
    {
        id: '1',
        name: 'John Hammond',
        description: 'Cybersecurity researcher and educator focusing on CTF challenges and malware analysis.',
        tags: ['CTF', 'Malware', 'Tutorials'],
        link: 'https://www.youtube.com/c/JohnHammond010'
    },
    {
        id: '2',
        name: 's4vitar',
        description: 'Expert in Red Team operations and advanced hacking tutorials.',
        tags: ['Red Team', 'Hacking', 'Tutorials'],
        link: 'https://www.youtube.com/c/s4vitar'
    },
    {
        id: '3',
        name: 'NetworkChuck',
        description: 'Making complex networking and IT career topics easy to understand.',
        tags: ['Networking', 'Career', 'Tutorials'],
        link: 'https://www.youtube.com/c/NetworkChuck'
    },
    {
        id: '4',
        name: 'IppSec',
        description: 'Detailed walkthroughs of HackTheBox machines and penetration testing techniques.',
        tags: ['HackTheBox', 'PenTest', 'Walkthroughs'],
        link: 'https://www.youtube.com/c/ippsec'
    },
    {
        id: '5',
        name: 'The Cyber Mentor',
        description: 'Ethical hacking training and career advice for aspiring cybersecurity professionals.',
        tags: ['Ethical Hacking', 'Career', 'Training'],
        link: 'https://www.youtube.com/c/TheCyberMentor'
    },
    {
        id: '6',
        name: 'STÖK',
        description: 'Bug bounty hunting adventures and web security research.',
        tags: ['Bug Bounty', 'Web Security', 'Research'],
        link: 'https://www.youtube.com/c/STOKfredrik'
    },
    {
        id: '7',
        name: 'Null Byte',
        description: 'Short, practical tutorials on hacking and security tools.',
        tags: ['Tutorials', 'Hacking', 'Security'],
        link: 'https://www.youtube.com/c/NullByte'
    },
    {
        id: '8',
        name: 'HackerSploit',
        description: 'Comprehensive training on penetration testing and Linux security.',
        tags: ['PenTest', 'Linux', 'Training'],
        link: 'https://www.youtube.com/c/HackerSploit'
    },
    {
        id: '9',
        name: 'David Bombal',
        description: 'Networking expert covering CCNA, Python, and IT career paths.',
        tags: ['Networking', 'Career', 'Demos'],
        link: 'https://www.youtube.com/c/DavidBombal'
    },
    {
        id: '10',
        name: 'Professor Messer',
        description: 'High-quality training videos for CompTIA certifications.',
        tags: ['CompTIA', 'Certification', 'Training'],
        link: 'https://www.youtube.com/c/professormesser'
    },
    {
        id: '11',
        name: 'Cybr',
        description: 'News and analysis on the latest cybersecurity trends and professional advice.',
        tags: ['News', 'Analysis', 'Professional'],
        link: 'https://www.youtube.com/c/Cybr'
    },
    {
        id: '12',
        name: 'InsiderPhD',
        description: 'Educational content on bug bounty hunting and web security for beginners.',
        tags: ['Bug Bounty', 'Beginner', 'Web Security'],
        link: 'https://www.youtube.com/user/InsiderPhD'
    },
    {
        id: '13',
        name: 'Nahamsec',
        description: 'Bug bounty live streams, interviews, and research disclosure.',
        tags: ['Bug Bounty', 'Research', 'Disclosure'],
        link: 'https://www.youtube.com/c/Nahamsec'
    },
    {
        id: '14',
        name: 'Cybersecurity Meg',
        description: 'Insights into security leadership, incident response, and cloud security.',
        tags: ['Leadership', 'Incident Response', 'Cloud Security'],
        link: '#'
    },
    {
        id: '15',
        name: 'Cybercrime Magazine',
        description: 'Covering cybercrime, data breaches, and the human side of security.',
        tags: ['Cybercrime', 'AI', 'Data Breaches'],
        link: 'https://www.youtube.com/c/CybercrimeMagazine'
    },
    {
        id: '16',
        name: 'Jim Browning',
        description: 'Investigating and exposing scammers through social engineering and technical skills.',
        tags: ['Scammers', 'Social Engineering'],
        link: 'https://www.youtube.com/c/JimBrowning'
    },
    {
        id: '17',
        name: 'HC2P',
        description: 'Focusing on the human factors and social aspects of cybersecurity.',
        tags: ['Human Factors', 'Social Aspects', 'Research'],
        link: '#'
    },
    {
        id: '18',
        name: 'Bug Bounty Reports',
        description: 'Analysis and breakdown of interesting bug bounty reports.',
        tags: ['Bug Bounty', 'Research'],
        link: '#' // specific link not provided/well-known, keeping generic
    },
    {
        id: '19',
        name: 'The Weekly Purple Team',
        description: 'Discussing purple team tactics and cybersecurity strategies.',
        tags: ['Purple Team', 'CyberSecurity'],
        link: '#'
    },
    {
        id: '20',
        name: 'Rajneesh Gupta',
        description: 'Expertise in both Red Team and Blue Team methodologies.',
        tags: ['Red Team', 'Blue Team'],
        link: '#'
    },
    {
        id: '21',
        name: 'Taylor Walton',
        description: 'Cybersecurity discussions and insights.',
        tags: ['CyberSecurity'],
        link: '#'
    },
    {
        id: '22',
        name: 'ConsoleCowboys',
        description: 'Deep dives into IoT security and hardware hacking.',
        tags: ['CyberSecurity', 'IoT Security'],
        link: 'https://www.youtube.com/c/ConsoleCowboys'
    },
    {
        id: '23',
        name: 'Andreas Spiess',
        description: 'Electronics and IoT covering security aspects.',
        tags: ['CyberSecurity', 'IoT Security'],
        link: 'https://www.youtube.com/c/AndreasSpiess'
    },
    {
        id: '24',
        name: 'HACKADAY',
        description: 'Engineering hacks, conference talks, and security projects.',
        tags: ['CyberSecurity', 'Engineering', 'Conferences'],
        link: 'https://www.youtube.com/c/hackaday'
    },
    {
        id: '25',
        name: 'GreatScott',
        description: 'Electronics projects including IoT and security engineering.',
        tags: ['CyberSecurity', 'IoT Security', 'Engineering'],
        link: 'https://www.youtube.com/c/GreatScottLab'
    },
    {
        id: '26',
        name: 'Seytonic',
        description: 'Cybersecurity news and hardware projects.',
        tags: ['CyberSecurity', 'PenTest'],
        link: 'https://www.youtube.com/c/Seytonic'
    },
    {
        id: '27',
        name: 'DEFCONConference',
        description: 'Talks and presentations from the world\'s largest hacker conference.',
        tags: ['CyberSecurity'],
        link: 'https://www.youtube.com/user/DEFCONConference'
    },
    {
        id: '28',
        name: 'IoT Village',
        description: 'Talks and demos focused specifically on IoT security.',
        tags: ['CyberSecurity', 'IoT Security'],
        link: 'https://www.youtube.com/c/IoTVillage'
    },
    {
        id: '29',
        name: 'ÆTHER Security Lab',
        description: 'Advanced cybersecurity research and penetration testing.',
        tags: ['CyberSecurity', 'PenTest'],
        link: '#'
    },
    {
        id: '30',
        name: 'Vikram Salunke',
        description: 'Cybersecurity tutorials and penetration testing guides.',
        tags: ['CyberSecurity', 'PenTest'],
        link: '#'
    }
];

export const channelStats = {
    total: 30,
    categories: 17,
    audience: '10M+'
};

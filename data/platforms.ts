export interface Platform {
    id: string;
    name: string;
    type: string;
    rating: string;
    founded: string;
    description: string;
    payoutRange: string;
    hackers: string;
    features: string[];
    notableCompanies: string[];
    link: string;
}

export const platformsData: Platform[] = [
    {
        id: '1',
        name: "HackerOne",
        type: "Platform",
        rating: "Excellent",
        founded: "2012",
        description: "The world's largest hacker community with over 800,000 hackers finding vulnerabilities.",
        payoutRange: "$50 - $100,000+",
        hackers: "800,000+",
        features: ["Private Programs", "Public Programs", "Live Hacking Events", "Bounty Splitting"],
        notableCompanies: ["Twitter", "Uber", "Shopify", "GitLab", "Dropbox"],
        link: "https://www.hackerone.com/"
    },
    {
        id: '2',
        name: "Bugcrowd",
        type: "Platform",
        rating: "Excellent",
        founded: "2012",
        description: "Crowdsourced cybersecurity platform connecting organizations with security researchers.",
        payoutRange: "$50 - $50,000+",
        hackers: "500,000+",
        features: ["Bug Bounty", "VDP", "Penetration Testing", "Security Assessments"],
        notableCompanies: ["Tesla", "Mozilla", "Western Union", "MasterCard", "Fitbit"],
        link: "https://www.bugcrowd.com/"
    },
    {
        id: '3',
        name: "Synack",
        type: "Invite-Only",
        rating: "Excellent",
        founded: "2013",
        description: "Invite-only platform combining human intelligence with advanced technology.",
        payoutRange: "$100 - $75,000+",
        hackers: "1,500+",
        features: ["Red Team", "Continuous Testing", "AI-Powered", "Elite Researchers"],
        notableCompanies: ["DoD", "Fortune 500", "Government", "Financial Services"],
        link: "https://www.synack.com/"
    },
    {
        id: '4',
        name: "Intigriti",
        type: "Platform",
        rating: "Very Good",
        founded: "2016",
        description: "European bug bounty platform focusing on ethical hacking and responsible disclosure.",
        payoutRange: "$25 - $25,000+",
        hackers: "100,000+",
        features: ["Bug Bounty", "VDP", "Compliance", "Training"],
        notableCompanies: ["European Commission", "ING", "Atos", "Proximus"],
        link: "https://www.intigriti.com/"
    },
    {
        id: '5',
        name: "YesWeHack",
        type: "Platform",
        rating: "Very Good",
        founded: "2013",
        description: "European crowdsourced cybersecurity platform with global reach.",
        payoutRange: "$50 - $30,000+",
        hackers: "50,000+",
        features: ["Bug Bounty", "VDP", "Pentest", "Compliance"],
        notableCompanies: ["Orange", "BNP Paribas", "Société Générale", "Airbus"],
        link: "https://www.yeswehack.com/"
    },
    {
        id: '6',
        name: "Cobalt",
        type: "PtaaS",
        rating: "Very Good",
        founded: "2013",
        description: "Pentest as a Service platform with on-demand security testing.",
        payoutRange: "$100 - $15,000+",
        hackers: "400+",
        features: ["Pentest as a Service", "Agile Pentesting", "Continuous Testing"],
        notableCompanies: ["Veracrypt", "Recorded Future", "DataSite", "Kenna Security"],
        link: "https://www.cobalt.io/"
    },
    {
        id: '7',
        name: "Open Bug Bounty",
        type: "Free Platform",
        rating: "Good",
        founded: "2014",
        description: "Free platform for responsible disclosure of website vulnerabilities.",
        payoutRange: "Recognition Only",
        hackers: "20,000+",
        features: ["Free Service", "Responsible Disclosure", "Website Scanning"],
        notableCompanies: ["Any Website Owner", "Non-profit", "Educational"],
        link: "https://www.openbugbounty.org/"
    },
    {
        id: '8',
        name: "Zerocopter",
        type: "Platform",
        rating: "Good",
        founded: "2015",
        description: "Dutch crowdsourced security platform focusing on continuous security testing.",
        payoutRange: "$50 - $10,000+",
        hackers: "15,000+",
        features: ["Continuous Testing", "Compliance", "Managed Programs"],
        notableCompanies: ["Dutch Government", "Financial Institutions", "Healthcare"],
        link: "https://www.zerocopter.com/"
    },
    {
        id: '9',
        name: "SafeHats",
        type: "Platform",
        rating: "Good",
        founded: "2017",
        description: "Indian bug bounty platform connecting security researchers with organizations.",
        payoutRange: "$25 - $5,000+",
        hackers: "10,000+",
        features: ["Bug Bounty", "VDP", "Security Consulting"],
        notableCompanies: ["Indian Startups", "Government", "SMEs"],
        link: "https://www.safehats.com/"
    },
    {
        id: '10',
        name: "Detectify",
        type: "Scanner + Crowdsource",
        rating: "Very Good",
        founded: "2013",
        description: "Automated web application security scanner with crowdsourced modules.",
        payoutRange: "$500 - $30,000+",
        hackers: "300+",
        features: ["Automated Scanning", "Crowdsourced Modules", "Continuous Monitoring"],
        notableCompanies: ["Spotify", "Trello", "King", "Minecraft"],
        link: "https://detectify.com/"
    },
    {
        id: '11',
        name: "BugHunt",
        type: "Platform",
        rating: "Good",
        founded: "2019",
        description: "Brazilian bug bounty platform focusing on local and international programs.",
        payoutRange: "$50 - $10,000+",
        hackers: "20,000+",
        features: ["Bug Bounty", "VDP", "Security Research"],
        notableCompanies: ["Brazilian Companies", "Latin America"],
        link: "https://www.bughunt.com.br/"
    },
    {
        id: '12',
        name: "Federacy",
        type: "Platform",
        rating: "Good",
        founded: "2017",
        description: "Continuous security testing platform for modern development teams.",
        payoutRange: "$100 - $20,000+",
        hackers: "5,000+",
        features: ["Continuous Testing", "DevSecOps Integration", "Expert Network"],
        notableCompanies: ["Startups", "Scale-ups", "Enterprise"],
        link: "https://www.federacy.com/"
    }
];

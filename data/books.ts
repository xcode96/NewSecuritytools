export type BookCategory = 'Red Team' | 'Blue Team' | 'General' | 'Enterprise Platforms';

export interface Book {
    id: string;
    title: string;
    author: string;
    description: string;
    year: string;
    pages: string;
    category: BookCategory;
    tags: string[];
    amazonLink: string;
    rating: number;
}

export const booksData: Book[] = [
    {
        id: '1',
        title: "The Hacker Playbook 3: Practical Guide To Penetration Testing",
        author: "Peter Kim",
        description: "Advanced penetration testing techniques and methodologies used by professional red teams.",
        year: "2018",
        pages: "289 pages",
        category: "Red Team",
        tags: ["Penetration Testing", "Practical", "Advanced"],
        amazonLink: "#",
        rating: 5
    },
    {
        id: '2',
        title: "Red Team Field Manual",
        author: "Ben Clark",
        description: "A comprehensive reference guide for red team operations, penetration testing, and security assessments.",
        year: "2014",
        pages: "96 pages",
        category: "Red Team",
        tags: ["Reference", "Field Manual", "Quick Reference"],
        amazonLink: "#",
        rating: 5
    },
    {
        id: '3',
        title: "Advanced Penetration Testing: Hacking the World's Most Secure Networks",
        author: "Wil Allsopp",
        description: "Advanced techniques for penetrating highly secured networks and systems.",
        year: "2017",
        pages: "288 pages",
        category: "Red Team",
        tags: ["Advanced", "Network Security", "Professional"],
        amazonLink: "#",
        rating: 5
    },
    {
        id: '4',
        title: "Social Engineering: The Art of Human Hacking",
        author: "Christopher Hadnagy",
        description: "Comprehensive guide to social engineering techniques and psychological manipulation.",
        year: "2010",
        pages: "410 pages",
        category: "Red Team",
        tags: ["Social Engineering", "Psychology", "Human Factor"],
        amazonLink: "#",
        rating: 5
    },
    {
        id: '5',
        title: "Metasploit: The Penetration Tester's Guide",
        author: "David Kennedy, Jim O'Gorman",
        description: "Complete guide to using Metasploit framework for penetration testing and exploitation.",
        year: "2011",
        pages: "328 pages",
        category: "Red Team",
        tags: ["Metasploit", "Exploitation", "Framework"],
        amazonLink: "#",
        rating: 5
    },
    {
        id: '6',
        title: "Blue Team Field Manual (BTFM)",
        author: "Alan J White, Ben Clark",
        description: "Essential reference for incident response, digital forensics, and security operations.",
        year: "2017",
        pages: "134 pages",
        category: "Blue Team",
        tags: ["Incident Response", "Reference", "SOC"],
        amazonLink: "#",
        rating: 5
    },
    {
        id: '7',
        title: "The Practice of Network Security",
        author: "Richard Bejtlich",
        description: "Comprehensive guide to network security monitoring, analysis, and incident response.",
        year: "2013",
        pages: "376 pages",
        category: "Blue Team",
        tags: ["Network Monitoring", "Analysis", "NSM"],
        amazonLink: "#",
        rating: 5
    },
    {
        id: '8',
        title: "IR & Computer Forensics",
        author: "Jason T. Luttgens, Matthew Pepe",
        description: "Complete guide to incident response procedures and digital forensics techniques.",
        year: "2014",
        pages: "544 pages",
        category: "Blue Team",
        tags: ["Incident Response", "Digital Forensics", "Investigation"],
        amazonLink: "#",
        rating: 5
    },
    {
        id: '9',
        title: "Applied Network Security Monitoring",
        author: "Chris Sanders, Jason Smith",
        description: "Practical approach to network security monitoring and threat detection.",
        year: "2013",
        pages: "496 pages",
        category: "Blue Team",
        tags: ["Network Security", "Monitoring", "Threat Detection"],
        amazonLink: "#",
        rating: 5
    },
    {
        id: '10',
        title: "The Art of Memory Forensics",
        author: "Michael Hale Ligh, Andrew Case, Jamie Levy, AAron Walters",
        description: "Advanced techniques for memory analysis and digital forensics investigations.",
        year: "2014",
        pages: "912 pages",
        category: "Blue Team",
        tags: ["Memory Forensics", "Digital Forensics", "Advanced"],
        amazonLink: "#",
        rating: 5
    },
    {
        id: '11',
        title: "Security Operations Center",
        author: "Joseph Muniz, Gary McIntyre, Nadhem AlFardan",
        description: "Complete guide to building and operating a Security Operations Center.",
        year: "2015",
        pages: "464 pages",
        category: "Blue Team",
        tags: ["SOC", "Operations", "Management"],
        amazonLink: "#",
        rating: 5
    },
    {
        id: '12',
        title: "The Web Application Hacker's Handbook",
        author: "Dafydd Stuttard, Marcus Pinto",
        description: "Comprehensive guide to finding and exploiting security flaws in web applications.",
        year: "2011",
        pages: "912 pages",
        category: "General",
        tags: ["Web Security", "Application Security", "Hacking"],
        amazonLink: "#",
        rating: 5
    },
    {
        id: '13',
        title: "Practical Malware Analysis",
        author: "Michael Sikorski, Andrew Honig",
        description: "Hands-on guide to malware analysis and reverse engineering techniques.",
        year: "2012",
        pages: "800 pages",
        category: "General",
        tags: ["Malware Analysis", "Reverse Engineering", "Practical"],
        amazonLink: "#",
        rating: 5
    },
    // Enterprise Platforms
    {
        id: '14',
        title: "Mastering Active Directory",
        author: "Dishan Francis",
        description: "Design, deploy, and protect Active Directory Domain Services for Windows Server 2022.",
        year: "2021",
        pages: "830 pages",
        category: "Enterprise Platforms",
        tags: ["Active Directory", "Windows Server", "Identity Management"],
        amazonLink: "https://www.amazon.com/Mastering-Active-Directory-deploy-Services/dp/1801077716",
        rating: 5
    },
    {
        id: '15',
        title: "Cloud Security: A Comprehensive Guide to Secure Cloud Computing",
        author: "Ronald L. Krutz, Russell Dean Vines",
        description: "Comprehensive overview of cloud security concepts, data protection, and compliance.",
        year: "2010",
        pages: "384 pages",
        category: "Enterprise Platforms",
        tags: ["Cloud Security", "AWS", "Azure"],
        amazonLink: "https://www.amazon.com/Cloud-Security-Comprehensive-Secure-Computing/dp/0470589876",
        rating: 5
    },
    {
        id: '16',
        title: "Kubernetes Security",
        author: "Liz Rice, Michael Hausenblas",
        description: "Operating Kubernetes clusters and applications safely and securely.",
        year: "2019",
        pages: "158 pages",
        category: "Enterprise Platforms",
        tags: ["Kubernetes", "Container Security", "DevSecOps"],
        amazonLink: "https://www.amazon.com/Kubernetes-Security-Operating-Clusters-Applications/dp/1492039089",
        rating: 5
    },
    {
        id: '17',
        title: "Enterprise Security Architecture",
        author: "Nicholas Sherwood, Andrew Clark, David Lynas",
        description: "A Business-Driven Approach to enterprise security architecture using the SABSA framework.",
        year: "2005",
        pages: "600 pages",
        category: "Enterprise Platforms",
        tags: ["Architecture", "SABSA", "Strategy"],
        amazonLink: "https://www.amazon.com/Enterprise-Security-Architecture-Business-Driven-Approach/dp/157820318X",
        rating: 5
    },
    {
        id: '18',
        title: "Docker Security",
        author: "Adrian Mouat",
        description: "Using Docker Safely: A guide to container security for developers and ops.",
        year: "2015",
        pages: "120 pages",
        category: "Enterprise Platforms",
        tags: ["Docker", "Containers", "DevOps"],
        amazonLink: "https://www.amazon.com/Using-Docker-Safely-Adrian-Mouat/dp/1491932595",
        rating: 5
    },
    {
        id: '19',
        title: "Microsoft Azure Security",
        author: "Michael Howard, Yaniv Shaked",
        description: "Designing and building secure cloud solutions on Microsoft Azure.",
        year: "2020",
        pages: "400 pages",
        category: "Enterprise Platforms",
        tags: ["Azure", "Microsoft", "Cloud"],
        amazonLink: "https://www.amazon.com/Microsoft-Azure-Security-Michael-Howard/dp/1509303534",
        rating: 5
    }
];

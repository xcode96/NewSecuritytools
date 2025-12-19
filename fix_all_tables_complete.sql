-- MASTER FIX SCRIPT: Schema Sync, Unique Constraints & Data Population (FIXED)
-- Run this script in Top-Level Supabase SQL Editor.

-- ==========================================
-- 1. DOWNLOADS TABLE
-- ==========================================
-- A. cleanup duplicates
DELETE FROM downloads a USING downloads b WHERE a.id < b.id AND a.name = b.name;

-- B. Ensure Unique Constraint exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'downloads_name_key') THEN
        ALTER TABLE downloads ADD CONSTRAINT downloads_name_key UNIQUE (name);
    END IF;
END $$;

-- C. Ensure columns exist (INCLUDING CATEGORY)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'downloads' AND column_name = 'category') THEN
        ALTER TABLE downloads ADD COLUMN category text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'downloads' AND column_name = 'url') THEN
        ALTER TABLE downloads ADD COLUMN url text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'downloads' AND column_name = 'link') THEN
        ALTER TABLE downloads ADD COLUMN link text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'downloads' AND column_name = 'key_features') THEN
        ALTER TABLE downloads ADD COLUMN key_features text[];
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'downloads' AND column_name = 'size') THEN
        ALTER TABLE downloads ADD COLUMN size text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'downloads' AND column_name = 'format') THEN
        ALTER TABLE downloads ADD COLUMN format text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'downloads' AND column_name = 'author') THEN
        ALTER TABLE downloads ADD COLUMN author text;
    END IF;
END $$;

-- D. Populate/Update Data
INSERT INTO downloads (name, category, description, url, link, size, format, author, key_features)
VALUES
('Kali Linux', 'Linux Security Distributions', 'The most advanced penetration testing distribution. Proven, secure, and packed with tools.', 'https://www.kali.org/get-kali/', 'https://www.kali.org/get-kali/', '4GB', 'ISO', 'OffSec', ARRAY['Metasploit', 'Nmap', 'Wireshark', 'Burp Suite']),
('Parrot OS', 'Linux Security Distributions', 'Security-focused operating system designed for pentesting, computer forensics and reverse engineering.', 'https://parrotsec.org/download/', 'https://parrotsec.org/download/', '5GB', 'ISO', 'Parrot Sec', ARRAY['Anonsurf', 'Ghidra', 'Powersploit']),
('Tails', 'Linux Security Distributions', 'The amnesic incognito live system. Preserves privacy and anonymity.', 'https://tails.boum.org/install/', 'https://tails.boum.org/install/', '1.2GB', 'ISO', 'Tails Project', ARRAY['Tor Browser', 'Onion Circuits', 'KeePassXC']),
('BlackArch', 'Linux Security Distributions', 'Arch Linux-based penetration testing distribution with huge tool repository.', 'https://blackarch.org/downloads.html', 'https://blackarch.org/downloads.html', '15GB', 'ISO', 'BlackArch Team', ARRAY['2800+ Tools', 'Modular', 'Arch Based']),
('SIFT Workstation', 'Digital Forensics', 'SANS Investigative Forensic Toolkit. A collection of forensic tools.', 'https://www.sans.org/tools/sift-workstation/', 'https://www.sans.org/tools/sift-workstation/', 'Varies', 'VM/ISO', 'SANS Institute', ARRAY['Volatility', 'Plaso', 'Sleuth Kit']),
('Autopsy', 'Digital Forensics', 'The premier open source digital forensics platform.', 'https://www.autopsy.com/download/', 'https://www.autopsy.com/download/', '500MB', 'EXE', 'Brian Carrier', ARRAY['Timeline Analysis', 'Keyword Search', 'Web Artifacts']),
('Wireshark', 'Network Analysis', 'The world''s most popular network protocol analyzer.', 'https://www.wireshark.org/download.html', 'https://www.wireshark.org/download.html', '75MB', 'Installer', 'Wireshark Foundation', ARRAY['Deep Inspection', 'Live Capture', 'Decryption']),
('Nmap', 'Network Scanning', 'Free and open source utility for network discovery and security auditing.', 'https://nmap.org/download.html', 'https://nmap.org/download.html', '30MB', 'Installer', 'Gordon Lyon', ARRAY['Port Scanning', 'OS Detection', 'Scriptable']),
('Burp Suite Community', 'Web Application Security', 'The class-leading platform for web security testing.', 'https://portswigger.net/burp/communitydownload', 'https://portswigger.net/burp/communitydownload', '300MB', 'Installer', 'PortSwigger', ARRAY['Proxy', 'Repeater', 'Intruder']),
('Ghidra', 'Reverse Engineering', 'A software reverse engineering (SRE) suite of tools developed by NSA.', 'https://ghidra-sre.org/', 'https://ghidra-sre.org/', '300MB', 'ZIP', 'NSA', ARRAY['Disassembler', 'Decompiler', 'Graphing']),
('Metasploit Framework', 'Exploitation', 'The world''s most used penetration testing framework.', 'https://www.metasploit.com/download', 'https://www.metasploit.com/download', '500MB', 'Installer', 'Rapid7', ARRAY['Exploits', 'Payloads', 'Encoders']),
('Windows 11 Enterprise', 'Windows Security Tools', 'Evaluation version of Windows 11 Enterprise.', 'https://www.microsoft.com/en-us/evalcenter/evaluate-windows-11-enterprise', 'https://www.microsoft.com/en-us/evalcenter/evaluate-windows-11-enterprise', 'Varies', 'ISO', 'Microsoft', ARRAY['Enterprise Security', 'VBS', 'BitLocker']),
('Windows Server 2022', 'Windows Security Tools', 'Evaluation version of Windows Server 2022.', 'https://www.microsoft.com/en-us/evalcenter/evaluate-windows-server-2022', 'https://www.microsoft.com/en-us/evalcenter/evaluate-windows-server-2022', 'Varies', 'ISO', 'Microsoft', ARRAY['Secured-core', 'HTTPS/TLS 1.3', 'Azure Arc'])
ON CONFLICT (name) DO UPDATE SET
    url = EXCLUDED.url,
    link = EXCLUDED.link,
    key_features = EXCLUDED.key_features;


-- ==========================================
-- 2. PLATFORMS TABLE
-- ==========================================
-- NOTE: We will use UPDATE/INSERT (UPSERT) here, but first clean duplicates
DELETE FROM platforms a USING platforms b WHERE a.id < b.id AND a.name = b.name;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'platforms_name_key') THEN
        ALTER TABLE platforms ADD CONSTRAINT platforms_name_key UNIQUE (name);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'platforms' AND column_name = 'category') THEN
        ALTER TABLE platforms ADD COLUMN category text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'platforms' AND column_name = 'url') THEN
        ALTER TABLE platforms ADD COLUMN url text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'platforms' AND column_name = 'features') THEN
        ALTER TABLE platforms ADD COLUMN features text[];
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'platforms' AND column_name = 'notable_companies') THEN
        ALTER TABLE platforms ADD COLUMN notable_companies text[];
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'platforms' AND column_name = 'pricing_model') THEN
        ALTER TABLE platforms ADD COLUMN pricing_model text;
    END IF;
    -- ADDED: difficulty and topics
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'platforms' AND column_name = 'difficulty') THEN
        ALTER TABLE platforms ADD COLUMN difficulty text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'platforms' AND column_name = 'topics') THEN
        ALTER TABLE platforms ADD COLUMN topics text[];
    END IF;
END $$;

INSERT INTO platforms (name, category, description, url, pricing_model, difficulty, topics, features)
VALUES
('HackTheBox', 'Platform', 'Premium penetration testing labs with retired and active machines, challenges, and certification paths.', 'https://www.hackthebox.com/', 'Free/Premium', 'Beginner to Expert', ARRAY['Web', 'Pwn', 'Reverse', 'Crypto', 'Forensics', 'OSINT'], ARRAY['Active Machines', 'Retired Machines', 'Challenges', 'Academy']),
('TryHackMe', 'Platform', 'Beginner-friendly cybersecurity learning platform with guided rooms and learning paths.', 'https://tryhackme.com/', 'Free/Premium', 'Beginner to Advanced', ARRAY['Web', 'Network', 'Forensics', 'Crypto', 'OSINT', 'Malware'], ARRAY['Learning Paths', 'Guided Rooms', 'King of the Hill', 'Certificates']),
('PicoCTF', 'Educational', 'Educational CTF platform designed for high school and college students with progressive difficulty.', 'https://picoctf.org/', 'Free', 'Beginner to Intermediate', ARRAY['Web', 'Crypto', 'Reverse', 'Pwn', 'Forensics', 'General'], ARRAY['Annual Competition', 'Practice Problems', 'Educational Content', 'Hints System']),
('OverTheWire', 'Wargames', 'Classic wargames platform offering various security challenges through SSH connections.', 'https://overthewire.org/wargames/', 'Free', 'Beginner to Expert', ARRAY['Linux', 'Pwn', 'Crypto', 'Web', 'Reverse', 'Network'], ARRAY['SSH-based', 'Progressive Levels', 'Multiple Wargames', 'Community']),
('CTFtime', 'Directory', 'Central hub for CTF competitions worldwide, tracking events, teams, and rankings.', 'https://ctftime.org/', 'Free', 'All Levels', ARRAY['Competition Tracker', 'Team Rankings', 'Event Calendar'], ARRAY['Event Calendar', 'Team Rankings', 'Writeups', 'Statistics']),
('VulnHub', 'VM Collection', 'Collection of vulnerable virtual machines for hands-on penetration testing practice.', 'https://www.vulnhub.com/', 'Free', 'Beginner to Expert', ARRAY['Web', 'Privilege Escalation', 'Network', 'Boot2Root'], ARRAY['Downloadable VMs', 'Walkthroughs', 'Difficulty Ratings', 'Community']),
('Root-Me', 'Platform', 'French platform offering challenges in various cybersecurity domains with skill validation.', 'https://www.root-me.org/', 'Free', 'Beginner to Expert', ARRAY['Web', 'Crypto', 'Steganography', 'Network', 'Programming', 'Cracking'], ARRAY['Skill Validation', 'Challenges', 'Forums', 'Tutorials']),
('Pwnable.tw', 'Specialized', 'Taiwan-based platform focusing on binary exploitation and pwn challenges.', 'https://pwnable.tw/', 'Free', 'Intermediate to Expert', ARRAY['Pwn', 'Binary Exploitation', 'Reverse Engineering'], ARRAY['Binary Challenges', 'Scoring System', 'Leaderboard', 'Writeups']),
('CyberDefenders', 'Blue Team', 'Blue team focused platform with incident response and digital forensics challenges.', 'https://cyberdefenders.org/', 'Free/Premium', 'Beginner to Expert', ARRAY['Digital Forensics', 'Incident Response', 'Malware Analysis', 'Network Analysis'], ARRAY['Blue Team Focus', 'Real Scenarios', 'Detailed Writeups', 'Skill Assessment']),
('Cryptohack', 'Specialized', 'Specialized platform dedicated to cryptography challenges and learning.', 'https://cryptohack.org/', 'Free', 'Beginner to Expert', ARRAY['Cryptography', 'Mathematics', 'Algorithms'], ARRAY['Crypto Focus', 'Learning Modules', 'Interactive Challenges', 'Community']),
('WebGoat', 'Educational', 'OWASP project providing deliberately insecure web application for learning web security.', 'https://owasp.org/www-project-webgoat/', 'Free', 'Beginner to Intermediate', ARRAY['Web Security', 'OWASP Top 10', 'Application Security'], ARRAY['Self-hosted', 'Guided Lessons', 'OWASP Focus', 'Open Source']),
('DVWA', 'Educational', 'Damn Vulnerable Web Application - PHP/MySQL web application for security testing.', 'https://dvwa.co.uk/', 'Free', 'Beginner to Intermediate', ARRAY['Web Security', 'SQL Injection', 'XSS', 'CSRF'], ARRAY['Self-hosted', 'Multiple Difficulty Levels', 'Documentation', 'Open Source']),
('Pwnable.kr', 'Specialized', 'Korean platform offering pwn challenges with a focus on system exploitation.', 'https://pwnable.kr/', 'Free', 'Beginner to Expert', ARRAY['Pwn', 'System Exploitation', 'Binary Analysis'], ARRAY['SSH Access', 'Progressive Difficulty', 'Source Code', 'Community']),
('RingZer0 CTF', 'Platform', 'Canadian CTF platform with diverse challenges and an active community.', 'https://ringzer0ctf.com/', 'Free', 'Beginner to Expert', ARRAY['Web', 'Crypto', 'Steganography', 'Programming', 'Jail Escaping'], ARRAY['Diverse Challenges', 'Team Support', 'Statistics', 'Forums']),
('Exploit.Education', 'Educational', 'Educational platform providing vulnerable programs for learning exploitation techniques.', 'https://exploit.education/', 'Free', 'Beginner to Advanced', ARRAY['Binary Exploitation', 'Memory Corruption', 'Format Strings', 'Heap'], ARRAY['VM Downloads', 'Detailed Tutorials', 'Progressive Learning', 'Open Source'])
ON CONFLICT (name) DO UPDATE SET
    url = EXCLUDED.url,
    category = EXCLUDED.category,
    pricing_model = EXCLUDED.pricing_model,
    difficulty = EXCLUDED.difficulty,
    topics = EXCLUDED.topics,
    features = EXCLUDED.features,
    description = EXCLUDED.description;


-- ==========================================
-- 3. CERTIFICATIONS TABLE
-- ==========================================
DELETE FROM certifications a USING certifications b WHERE a.id < b.id AND a.code = b.code;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'certifications_code_key') THEN
        ALTER TABLE certifications ADD CONSTRAINT certifications_code_key UNIQUE (code);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'certifications' AND column_name = 'category') THEN
        ALTER TABLE certifications ADD COLUMN category text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'certifications' AND column_name = 'link') THEN
        ALTER TABLE certifications ADD COLUMN link text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'certifications' AND column_name = 'key_skills') THEN
        ALTER TABLE certifications ADD COLUMN key_skills text[];
    END IF;
     IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'certifications' AND column_name = 'career_paths') THEN
        ALTER TABLE certifications ADD COLUMN career_paths text[];
    END IF;
    
    -- ADDED: Missing rich data columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'certifications' AND column_name = 'duration') THEN
        ALTER TABLE certifications ADD COLUMN duration text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'certifications' AND column_name = 'cost') THEN
        ALTER TABLE certifications ADD COLUMN cost text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'certifications' AND column_name = 'difficulty') THEN
        ALTER TABLE certifications ADD COLUMN difficulty integer;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'certifications' AND column_name = 'popularity') THEN
        ALTER TABLE certifications ADD COLUMN popularity integer;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'certifications' AND column_name = 'job_market') THEN
        ALTER TABLE certifications ADD COLUMN job_market integer;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'certifications' AND column_name = 'rating') THEN
        ALTER TABLE certifications ADD COLUMN rating numeric;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'certifications' AND column_name = 'prerequisites') THEN
        ALTER TABLE certifications ADD COLUMN prerequisites text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'certifications' AND column_name = 'exam_format') THEN
        ALTER TABLE certifications ADD COLUMN exam_format text;
    END IF;
    -- Note: 'description' column usually exists by default or created, but let's be safe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'certifications' AND column_name = 'description') THEN
        ALTER TABLE certifications ADD COLUMN description text;
    END IF;
END $$;

INSERT INTO certifications (code, name, provider, category, link, key_skills, career_paths, duration, cost, difficulty, popularity, job_market, rating, description, prerequisites, exam_format)
VALUES
('OSCP', 'Offensive Security Certified Professional', 'Offensive Security', 'Red Team', 'https://www.offsec.com/courses/pen-200/', ARRAY['Pen Testing', 'Exploitation'], ARRAY['Pentester'], '90 days lab + exam', '$1,499', 5, 5, 5, 4, 'Hands-on penetration testing certification focusing on practical exploitation skills.', 'Basic networking and Linux knowledge', '24-hour practical exam + 24-hour report'),
('CEH', 'Certified Ethical Hacker', 'EC-Council', 'Red Team', 'https://www.eccouncil.org/programs/certified-ethical-hacker-ceh/', ARRAY['Scanning', 'Enumeration'], ARRAY['Junior Pentester'], '5 days training', '$1,199', 5, 3, 4, 2, 'Entry-level ethical hacking certification covering basic penetration testing concepts.', 'Basic IT security knowledge', '4-hour multiple choice exam'),
('CISSP', 'Certified Information Systems Security Professional', 'ISC2', 'Management', 'https://www.isc2.org/Certifications/CISSP', ARRAY['Risk Mgmt', 'Security Ops'], ARRAY['CISO', 'Security Manager'], 'Self-paced', '$749', 5, 5, 5, 4, 'Management-level security certification covering eight security domains.', '5 years of security experience', '100-150 questions, 3 hours'),
('CISM', 'Certified Information Security Manager', 'ISACA', 'Management', 'https://www.isaca.org/credentialing/cism', ARRAY['Governance', 'Risk'], ARRAY['Security Manager'], 'Self-paced', '$760', 4, 4, 5, 4, 'Information security management and governance certification.', '5 years of security experience', '150 questions, 4 hours'),
('GCIH', 'GIAC Certified Incident Handler', 'SANS', 'Blue Team', 'https://www.giac.org/certifications/certified-incident-handler-gcih/', ARRAY['Incident Response', 'Forensics'], ARRAY['IR Analyst'], '6 days training', '$7,000+', 4, 5, 5, 3, 'Incident response and digital forensics certification.', 'Basic security knowledge', '4-hour proctored exam'),
('OSEP', 'Offensive Security Experienced Penetration Tester', 'Offensive Security', 'Red Team', 'https://www.offsec.com/courses/pen-300/', ARRAY['Evasion', 'Advanced Exp'], ARRAY['Senior Pentester'], '90 days lab + exam', '$1,499', 4, 5, 5, 5, 'Advanced evasion techniques and modern penetration testing methodologies.', 'OSCP or equivalent experience', '48-hour practical exam + 24-hour report'),
('OSWE', 'Offensive Security Web Expert', 'Offensive Security', 'Red Team', 'https://www.offsec.com/courses/web-300/', ARRAY['Web App Sec', 'Code Review'], ARRAY['Web Pentester'], '90 days lab + exam', '$1,499', 3, 4, 5, 5, 'Advanced web application security testing and source code review.', 'Web development and OSCP knowledge', '48-hour practical exam + 24-hour report'),
('CRTP', 'Certified Red Team Professional', 'PentesterAcademy', 'Red Team', 'https://www.alteredsecurity.com/adlab', ARRAY['Active Directory', 'Kerberos'], ARRAY['Red Team Op'], '30 days lab + exam', '$249', 3, 4, 4, 3, 'Active Directory focused red team certification with practical labs.', 'Basic Windows and AD knowledge', '24-hour practical exam'),
('GPEN', 'GIAC Penetration Tester', 'SANS/GIAC', 'Red Team', 'https://www.giac.org/certifications/penetration-tester-gpen/', ARRAY['Pen Testing'], ARRAY['Pentester'], '6 days training', '$7,000+', 4, 4, 5, 3, 'Comprehensive penetration testing certification from SANS Institute.', 'Basic security and networking knowledge', '4-hour proctored exam'),
('GCFA', 'GIAC Certified Forensic Analyst', 'SANS/GIAC', 'Blue Team', 'https://www.giac.org/certifications/certified-forensic-analyst-gcfa/', ARRAY['Forensics', 'Threat Hunting'], ARRAY['Forensic Analyst'], '6 days training', '$7,000+', 3, 4, 5, 4, 'Advanced digital forensics and incident response certification.', 'GCIH or equivalent experience', '4-hour proctored exam'),
('GSEC', 'GIAC Security Essentials', 'SANS/GIAC', 'Blue Team', 'https://www.giac.org/certifications/security-essentials-gsec/', ARRAY['Sec Fundamentals'], ARRAY['Sec Analyst'], '6 days training', '$7,000+', 5, 4, 4, 2, 'Foundation-level security certification covering essential security concepts.', 'Basic IT knowledge', '4-hour proctored exam'),
('GNFA', 'GIAC Network Forensic Analyst', 'SANS/GIAC', 'Blue Team', 'https://www.giac.org/certifications/network-forensic-analyst-gnfa/', ARRAY['Network Forensics'], ARRAY['Forensic Analyst'], '6 days training', '$7,000+', 2, 3, 4, 4, 'Network traffic analysis and forensics certification.', 'Network and security fundamentals', '4-hour proctored exam'),
('CySA+', 'CompTIA Cybersecurity Analyst', 'CompTIA', 'Blue Team', 'https://www.comptia.org/certifications/cybersecurity-analyst', ARRAY['Threat Intel', 'Monitoring'], ARRAY['SOC Analyst'], 'Self-paced', '$370', 4, 4, 5, 3, 'Cybersecurity analyst certification focusing on threat detection and analysis.', 'Network+ and Security+ recommended', '165 questions, 165 minutes'),
('BTLO', 'Blue Team Level 1', 'Security Blue Team', 'Blue Team', 'https://securityblue.team/', ARRAY['SOC', 'Analysis'], ARRAY['SOC Analyst'], 'Self-paced', '$399', 3, 4, 4, 2, 'Entry-level blue team certification with hands-on labs.', 'Basic IT knowledge', '24-hour practical exam')
ON CONFLICT (code) DO UPDATE SET
    link = EXCLUDED.link,
    duration = EXCLUDED.duration,
    cost = EXCLUDED.cost,
    difficulty = EXCLUDED.difficulty,
    popularity = EXCLUDED.popularity,
    job_market = EXCLUDED.job_market,
    rating = EXCLUDED.rating,
    description = EXCLUDED.description,
    prerequisites = EXCLUDED.prerequisites,
    exam_format = EXCLUDED.exam_format;


-- ==========================================
-- 4. YOUTUBERS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS youtubers (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL, 
    description TEXT,
    category TEXT,
    url TEXT,
    link TEXT, 
    topics TEXT[],
    tags TEXT[],
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

DELETE FROM youtubers a USING youtubers b WHERE a.id < b.id AND a.name = b.name;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'youtubers_name_key') THEN
        ALTER TABLE youtubers ADD CONSTRAINT youtubers_name_key UNIQUE (name);
    END IF;
END $$;

DO $$
BEGIN
    -- Just in case table existed without category
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'youtubers' AND column_name = 'category') THEN
        ALTER TABLE youtubers ADD COLUMN category text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'youtubers' AND column_name = 'url') THEN
        ALTER TABLE youtubers ADD COLUMN url text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'youtubers' AND column_name = 'link') THEN
        ALTER TABLE youtubers ADD COLUMN link text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'youtubers' AND column_name = 'tags') THEN
        ALTER TABLE youtubers ADD COLUMN tags text[];
    END IF;
     IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'youtubers' AND column_name = 'topics') THEN
        ALTER TABLE youtubers ADD COLUMN topics text[];
    END IF;
END $$;

INSERT INTO youtubers (name, description, category, url, link, tags, topics)
VALUES
('John Hammond', 'Cybersecurity researcher and educator.', 'Educational', 'https://www.youtube.com/c/JohnHammond010', 'https://www.youtube.com/c/JohnHammond010', ARRAY['CTF', 'Malware'], ARRAY['CTF', 'Malware']),
('NetworkChuck', 'Making complex networking easy.', 'Career', 'https://www.youtube.com/c/NetworkChuck', 'https://www.youtube.com/c/NetworkChuck', ARRAY['Networking', 'Career'], ARRAY['Networking', 'Career']),
('IppSec', 'HackTheBox walkthroughs.', 'Tutorials', 'https://www.youtube.com/c/ippsec', 'https://www.youtube.com/c/ippsec', ARRAY['HTB', 'PenTest'], ARRAY['HTB', 'PenTest']),
('The Cyber Mentor', 'Ethical hacking training.', 'Educational', 'https://www.youtube.com/c/TheCyberMentor', 'https://www.youtube.com/c/TheCyberMentor', ARRAY['Ethical Hacking', 'Career'], ARRAY['Ethical Hacking', 'Career']),
('LiveOverflow', 'Hacking and CTF videos.', 'Educational', 'https://www.youtube.com/c/LiveOverflow', 'https://www.youtube.com/c/LiveOverflow', ARRAY['CTF', 'Binary Exploitation'], ARRAY['CTF', 'Binary Exploitation']),
('Null Byte', 'Detailed tutorials.', 'Tutorials', 'https://www.youtube.com/c/NullByte', 'https://www.youtube.com/c/NullByte', ARRAY['Tutorials'], ARRAY['Tutorials']),
('HackerSploit', 'Linux and Pentesting.', 'Tutorials', 'https://www.youtube.com/c/HackerSploit', 'https://www.youtube.com/c/HackerSploit', ARRAY['Linux'], ARRAY['Linux']),
('David Bombal', 'Networking expert.', 'Career', 'https://www.youtube.com/c/DavidBombal', 'https://www.youtube.com/c/DavidBombal', ARRAY['Networking'], ARRAY['Networking']),
('Professor Messer', 'CompTIA training.', 'Educational', 'https://www.youtube.com/c/professormesser', 'https://www.youtube.com/c/professormesser', ARRAY['CompTIA'], ARRAY['CompTIA']),
('Seytonic', 'Hardware and News.', 'News', 'https://www.youtube.com/c/Seytonic', 'https://www.youtube.com/c/Seytonic', ARRAY['Hardware'], ARRAY['Hardware'])
ON CONFLICT (name) DO UPDATE SET
    url = EXCLUDED.url,
    link = EXCLUDED.link;


-- ==========================================
-- 5. BREACH SERVICES TABLE
-- ==========================================
DELETE FROM breach_services a USING breach_services b WHERE a.id < b.id AND a.name = b.name;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'breach_services_name_key') THEN
        ALTER TABLE breach_services ADD CONSTRAINT breach_services_name_key UNIQUE (name);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'breach_services' AND column_name = 'category') THEN
        ALTER TABLE breach_services ADD COLUMN category text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'breach_services' AND column_name = 'url') THEN
        ALTER TABLE breach_services ADD COLUMN url text;
    END IF;
    -- ADDED: Check for 'icon'
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'breach_services' AND column_name = 'icon') THEN
        ALTER TABLE breach_services ADD COLUMN icon text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'breach_services' AND column_name = 'key_features') THEN
        ALTER TABLE breach_services ADD COLUMN key_features text[];
    END IF;
END $$;

INSERT INTO breach_services (name, category, type, description, url, icon, key_features)
VALUES
('Have I Been Pwned', 'Free Services', 'Free', 'The most comprehensive breach notification service. Check if your email or phone has been compromised in data breaches.', 'https://haveibeenpwned.com/', '🛡️', ARRAY['Email Check', 'Phone Check', 'Password Check', 'Breach Database']),
('LeakCheck', 'Premium Services', 'Freemium', 'Advanced data breach search engine with detailed information about compromised accounts and credentials.', 'https://leakcheck.io/', '🔍', ARRAY['Email Search', 'Domain Search', 'API Access', 'Detailed Results']),
('DeHashed', 'Premium Services', 'Paid', 'Professional breach search platform providing comprehensive data leak investigation tools for security professionals.', 'https://www.dehashed.com/', '🔐', ARRAY['Advanced Search', 'API Integration', 'Bulk Queries', 'Professional Tools']),
('Intelligence X', 'Intelligence Platforms', 'Freemium', 'Search engine and data archive for cybersecurity professionals, including breach data and dark web content.', 'https://intelx.io/', '🕵️', ARRAY['Dark Web Search', 'Historical Data', 'OSINT Tools', 'Archive Access']),
('SnusBase', 'Premium Services', 'Paid', 'Database search engine for leaked credentials and personal information with extensive coverage.', 'https://snusbase.com/', '💾', ARRAY['Credential Search', 'Personal Info', 'Multiple Formats', 'Regular Updates']),
('Leak Lookup', 'Free Services', 'Free', 'Simple and effective breach lookup service for checking if accounts have been compromised in data breaches.', 'https://leak-lookup.com/', '🔎', ARRAY['Email Lookup', 'Simple Interface', 'Quick Results', 'Basic Search']),
('Breach Directory', 'Community Services', 'Free', 'Community-driven breach database providing access to leaked data for security research purposes.', 'https://breachdirectory.org/', '📚', ARRAY['Community Driven', 'Research Focus', 'Open Access', 'Educational'])
ON CONFLICT (name) DO UPDATE SET
    url = EXCLUDED.url,
    icon = EXCLUDED.icon,
    key_features = EXCLUDED.key_features,
    description = EXCLUDED.description,
    type = EXCLUDED.type;


-- ==========================================
-- 6. SECURITY UPDATES TABLE (NEW)
-- ==========================================
CREATE TABLE IF NOT EXISTS security_updates (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    organization TEXT,
    frequency TEXT,
    access TEXT,
    coverage TEXT,
    url TEXT,
    formats TEXT[],
    key_features TEXT[],
    use_cases TEXT[],
    code TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

DELETE FROM security_updates a USING security_updates b WHERE a.id < b.id AND a.name = b.name;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'security_updates_name_key') THEN
        ALTER TABLE security_updates ADD CONSTRAINT security_updates_name_key UNIQUE (name);
    END IF;
END $$;

INSERT INTO security_updates (name, code, organization, category, frequency, access, coverage, formats, key_features, use_cases, url, description)
VALUES
('National Vulnerability Database (NVD)', 'NVD', 'NIST', 'Vulnerability Databases', 'Real-time', 'Free', 'Global', ARRAY['JSON', 'XML', 'RSS'], ARRAY['CVE Database', 'CVSS Scores', 'CPE Dictionary', 'CWE Mapping'], ARRAY['Vulnerability Management', 'Risk Assessment', 'Compliance Reporting', 'Security Research'], 'https://nvd.nist.gov/', 'Official U.S. government repository of standards-based vulnerability management data.'),
('CVE Details', 'CVED', 'CVE Details Team', 'Vulnerability Databases', 'Daily', 'Free', 'Global', ARRAY['HTML', 'RSS', 'CSV'], ARRAY['CVE Statistics', 'Vendor Analysis', 'Product Vulnerabilities', 'CVSS Trends'], ARRAY['Vendor Assessment', 'Product Security Analysis', 'Trend Analysis', 'Research'], 'https://www.cvedetails.com/', 'Comprehensive CVE security vulnerability database with detailed statistics and analysis.'),
('Common Weakness Enumeration', 'CWE', 'MITRE Corporation', 'Vulnerability Databases', 'Quarterly', 'Free', 'Global', ARRAY['XML', 'HTML', 'PDF'], ARRAY['Weakness Categories', 'CWE Top 25', 'Mapping to CVE', 'Mitigation Strategies'], ARRAY['Secure Development', 'Code Review', 'Security Testing', 'Training'], 'https://cwe.mitre.org/', 'Community-developed list of common software and hardware weakness types.'),
('Exploit Database', 'EDB', 'Offensive Security', 'Vulnerability Databases', 'Daily', 'Free', 'Global', ARRAY['HTML', 'CSV', 'JSON'], ARRAY['Exploit Archive', 'Shellcode Database', 'Papers', 'Google Hacking Database'], ARRAY['Penetration Testing', 'Vulnerability Research', 'Security Training', 'Proof of Concept'], 'https://www.exploit-db.com/', 'Archive of public exploits and corresponding vulnerable software.'),
('Microsoft Security Response Center', 'MSRC', 'Microsoft Corporation', 'Vendor Security Updates', 'Monthly (Patch Tuesday)', 'Free', 'Microsoft Products', ARRAY['HTML', 'RSS', 'JSON', 'XML'], ARRAY['Patch Tuesday', 'Security Advisories', 'CVE Information', 'Severity Ratings'], ARRAY['Patch Management', 'Vulnerability Assessment', 'Incident Response', 'Compliance'], 'https://msrc.microsoft.com/', 'Official Microsoft security updates, advisories, and Patch Tuesday releases.'),
('Adobe Security Bulletins', 'APSB', 'Adobe Inc.', 'Vendor Security Updates', 'Monthly', 'Free', 'Adobe Products', ARRAY['HTML', 'RSS'], ARRAY['Security Bulletins', 'Product Updates', 'Severity Ratings', 'Affected Versions'], ARRAY['Adobe Patch Management', 'Creative Suite Security', 'Enterprise Updates', 'Risk Assessment'], 'https://helpx.adobe.com/security/security-bulletin.html', 'Adobe Product Security Incident Response Team (PSIRT) security bulletins and updates.'),
('Oracle Critical Patch Updates', 'CPU', 'Oracle Corporation', 'Vendor Security Updates', 'Quarterly', 'Free', 'Oracle Products', ARRAY['HTML', 'PDF', 'RSS'], ARRAY['Critical Patch Updates', 'Security Alerts', 'CVSS Scores', 'Product Coverage'], ARRAY['Oracle Patch Management', 'Database Security', 'Enterprise Planning', 'Compliance'], 'https://www.oracle.com/security-alerts/', 'Oracle''s quarterly Critical Patch Updates and security alerts for all Oracle products.'),
('Google Chrome Releases', 'GCR', 'Google LLC', 'Vendor Security Updates', 'Weekly', 'Free', 'Chrome Browser', ARRAY['HTML', 'RSS'], ARRAY['Release Notes', 'Security Fixes', 'Version History', 'Beta Updates'], ARRAY['Browser Security', 'Enterprise Deployment', 'Security Research', 'Update Planning'], 'https://chromereleases.googleblog.com/', 'Official Google Chrome release blog with security updates and new features.'),
('Mozilla Security Advisories', 'MFSA', 'Mozilla Foundation', 'Vendor Security Updates', 'Monthly', 'Free', 'Mozilla Products', ARRAY['HTML', 'RSS', 'JSON'], ARRAY['Security Advisories', 'CVE Mapping', 'Severity Ratings', 'Affected Products'], ARRAY['Firefox Security', 'Open Source Security', 'Browser Management', 'Research'], 'https://www.mozilla.org/en-US/security/advisories/', 'Mozilla Foundation Security Advisories for Firefox, Thunderbird, and other Mozilla products.'),
('Ubuntu Security Notices', 'USN', 'Canonical Ltd.', 'Linux & Open Source Updates', 'Daily', 'Free', 'Ubuntu Linux', ARRAY['HTML', 'RSS', 'JSON'], ARRAY['Security Notices', 'Package Updates', 'CVE Mapping', 'Release Coverage'], ARRAY['Ubuntu Patch Management', 'Linux Security', 'Server Maintenance', 'Compliance'], 'https://ubuntu.com/security/notices', 'Official Ubuntu Security Notices for all supported Ubuntu releases.'),
('Red Hat Security Advisories', 'RHSA', 'Red Hat Inc.', 'Linux & Open Source Updates', 'Daily', 'Free', 'Red Hat Products', ARRAY['HTML', 'RSS', 'XML', 'JSON'], ARRAY['Security Advisories', 'Errata', 'CVE Database', 'CVSS Scores'], ARRAY['RHEL Security', 'Enterprise Linux', 'Patch Management', 'Vulnerability Tracking'], 'https://access.redhat.com/security/security-updates/#/', 'Red Hat Security Advisories for RHEL, Fedora, and other Red Hat products.'),
('Debian Security Advisories', 'DSA', 'Debian Project', 'Linux & Open Source Updates', 'As needed', 'Free', 'Debian Linux', ARRAY['HTML', 'RSS', 'Mailing List'], ARRAY['Security Advisories', 'Package Updates', 'Vulnerability Info', 'Stable/Testing Updates'], ARRAY['Debian Security', 'Server Hardening', 'Package Management', 'Security Research'], 'https://www.debian.org/security/', 'Debian Security Advisories for the Debian GNU/Linux distribution.'),
('SUSE Security Updates', 'SUSE-SU', 'SUSE LLC', 'Linux & Open Source Updates', 'Weekly', 'Free', 'SUSE Products', ARRAY['HTML', 'RSS', 'XML'], ARRAY['Security Updates', 'CVE Information', 'CVSS Scores', 'Product Coverage'], ARRAY['SUSE Security', 'Enterprise Linux', 'Patch Planning', 'Risk Assessment'], 'https://www.suse.com/support/update/', 'SUSE Security Updates for SUSE Linux Enterprise and openSUSE distributions.'),
('CISA Known Exploited Vulnerabilities', 'KEV', 'CISA', 'Security Intelligence & Feeds', 'Weekly', 'Free', 'Global', ARRAY['JSON', 'CSV', 'HTML'], ARRAY['Exploited CVEs', 'Due Dates', 'Vendor Info', 'Product Details'], ARRAY['Priority Patching', 'Risk Assessment', 'Compliance', 'Threat Intelligence'], 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog', 'CISA''s catalog of vulnerabilities known to be exploited in the wild.'),
('Rapid7 Vulnerability & Exploit Database', 'R7VED', 'Rapid7', 'Security Intelligence & Feeds', 'Daily', 'Free', 'Global', ARRAY['HTML', 'JSON', 'API'], ARRAY['Vulnerability Database', 'Exploit Modules', 'Metasploit Integration', 'Research'], ARRAY['Penetration Testing', 'Vulnerability Research', 'Security Testing', 'Exploit Development'], 'https://www.rapid7.com/db/', 'Rapid7''s vulnerability and exploit database with Metasploit integration.'),
('Tenable Security Feed', 'TSF', 'Tenable Inc.', 'Security Intelligence & Feeds', 'Daily', 'Partial', 'Global', ARRAY['HTML', 'RSS', 'API'], ARRAY['Security Research', 'Vulnerability Analysis', 'Threat Intelligence', 'Plugin Updates'], ARRAY['Vulnerability Scanning', 'Risk Assessment', 'Security Research', 'Compliance'], 'https://www.tenable.com/security/research', 'Tenable''s security research and vulnerability intelligence feed.'),
('Patch Tuesday Dashboard', 'PTD', 'Community Driven', 'Patch Management Resources', 'Monthly', 'Free', 'Microsoft Products', ARRAY['HTML', 'RSS'], ARRAY['Patch Tuesday Tracking', 'Release Analysis', 'Historical Data', 'Statistics'], ARRAY['Patch Planning', 'Microsoft Updates', 'Historical Analysis', 'Community Discussion'], 'https://patchtuesdaydashboard.com/', 'Community-driven dashboard tracking Microsoft Patch Tuesday releases and analysis.'),
('Windows Update History', 'WUH', 'Microsoft Corporation', 'Patch Management Resources', 'Monthly', 'Free', 'Windows OS', ARRAY['HTML'], ARRAY['Update History', 'Known Issues', 'Release Notes', 'Version Information'], ARRAY['Windows Management', 'Update Planning', 'Issue Tracking', 'Version Control'], 'https://support.microsoft.com/en-us/windows/windows-10-update-history-85c6c6f2-78u6-6638-8924-2c709d6b2c26', 'Official Microsoft Windows Update history and release information.'),
('Qualys VMDR Threat Protection', 'QVTP', 'Qualys Inc.', 'Patch Management Resources', 'Daily', 'Partial', 'Global', ARRAY['HTML', 'API'], ARRAY['Threat Research', 'Vulnerability Analysis', 'QID Database', 'Detection Logic'], ARRAY['Vulnerability Management', 'Threat Detection', 'Risk Assessment', 'Compliance'], 'https://www.qualys.com/research/security-alerts/', 'Qualys vulnerability research and threat protection intelligence.'),
('Android Security Bulletins', 'ASB', 'Google LLC', 'Mobile & IoT Security Updates', 'Monthly', 'Free', 'Android OS', ARRAY['HTML', 'RSS'], ARRAY['Security Bulletins', 'CVE Information', 'Severity Levels', 'Patch Levels'], ARRAY['Android Security', 'Mobile Device Management', 'Enterprise Mobility', 'Security Research'], 'https://source.android.com/security/bulletin', 'Official Android Security Bulletins with monthly security updates.'),
('Apple Security Updates', 'ASU', 'Apple Inc.', 'Mobile & IoT Security Updates', 'As needed', 'Free', 'Apple Products', ARRAY['HTML', 'RSS'], ARRAY['Security Updates', 'CVE Information', 'Product Coverage', 'Release Notes'], ARRAY['Apple Device Management', 'iOS Security', 'Enterprise Apple', 'Mobile Security'], 'https://support.apple.com/en-us/HT201222', 'Apple security updates for iOS, macOS, watchOS, tvOS, and other Apple products.')
ON CONFLICT (name) DO UPDATE SET
    url = EXCLUDED.url,
    category = EXCLUDED.category,
    organization = EXCLUDED.organization,
    frequency = EXCLUDED.frequency,
    access = EXCLUDED.access,
    coverage = EXCLUDED.coverage,
    formats = EXCLUDED.formats,
    key_features = EXCLUDED.key_features,
    use_cases = EXCLUDED.use_cases,
    code = EXCLUDED.code,
    description = EXCLUDED.description;

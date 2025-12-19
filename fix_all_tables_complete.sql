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
END $$;

INSERT INTO platforms (name, category, description, url, pricing_model, notable_companies, features)
VALUES
('Salesforce', 'CRM', 'Global CRM leader.', 'https://www.salesforce.com', 'Paid', ARRAY['Fortune 500'], ARRAY['Apex Security', 'Shield Encryption']),
('ServiceNow', 'ITSM', 'Digital workflows.', 'https://www.servicenow.com', 'Paid', ARRAY['Enterprises'], ARRAY['ACLs', 'Instance Hardening']),
('SAP', 'ERP', 'Enterprise application software.', 'https://www.sap.com', 'Paid', ARRAY['Global Corps'], ARRAY['NetWeaver Security', 'HANA Security']),
('Workday', 'HR', 'Finance and HR cloud.', 'https://www.workday.com', 'Paid', ARRAY['Large Orgs'], ARRAY['Cloud Security', 'Auditing']),
('Oracle', 'Database', 'Cloud infrastructure and databases.', 'https://www.oracle.com', 'Paid', ARRAY['Governments', 'Banks'], ARRAY['TDE', 'Vault']),
('Microsoft 365 Enterprise', 'Productivity', 'Integrated cloud service.', 'https://www.microsoft.com/microsoft-365/enterprise', 'Paid', ARRAY['Everyone'], ARRAY['Defender', 'Compliance']),
('HackerOne', 'Bug Bounty', 'Vulnerability coordination.', 'https://www.hackerone.com/', 'Bounty', ARRAY['Airbnb', 'GM'], ARRAY['Triage', 'Reports']),
('Bugcrowd', 'Bug Bounty', 'Crowdsourced security.', 'https://www.bugcrowd.com/', 'Bounty', ARRAY['Tesla', 'Mastercard'], ARRAY['VRT', 'Crowdcontrol'])
ON CONFLICT (name) DO UPDATE SET
    url = EXCLUDED.url,
    features = EXCLUDED.features;


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
END $$;

INSERT INTO certifications (code, name, provider, category, link, key_skills, career_paths, duration, cost, difficulty, popularity, job_market, rating)
VALUES
('OSCP', 'Offensive Security Certified Professional', 'Offensive Security', 'Red Team', 'https://www.offsec.com/courses/pen-200/', ARRAY['Pen Testing', 'Exploitation'], ARRAY['Pentester'], '90 days lab + exam', '$1,499', 5, 5, 5, 4),
('CEH', 'Certified Ethical Hacker', 'EC-Council', 'Red Team', 'https://www.eccouncil.org/programs/certified-ethical-hacker-ceh/', ARRAY['Scanning', 'Enumeration'], ARRAY['Junior Pentester'], '5 days training', '$1,199', 5, 3, 4, 2),
('CISSP', 'Certified Information Systems Security Professional', 'ISC2', 'Management', 'https://www.isc2.org/Certifications/CISSP', ARRAY['Risk Mgmt', 'Security Ops'], ARRAY['CISO', 'Security Manager'], 'Self-paced', '$749', 5, 5, 5, 4),
('CISM', 'Certified Information Security Manager', 'ISACA', 'Management', 'https://www.isaca.org/credentialing/cism', ARRAY['Governance', 'Risk'], ARRAY['Security Manager'], 'Self-paced', '$760', 4, 4, 5, 4),
('GCIH', 'GIAC Certified Incident Handler', 'SANS', 'Blue Team', 'https://www.giac.org/certifications/certified-incident-handler-gcih/', ARRAY['Incident Response', 'Forensics'], ARRAY['IR Analyst'], '6 days training', '$7,000+', 4, 5, 5, 3),
('OSEP', 'Offensive Security Experienced Penetration Tester', 'Offensive Security', 'Red Team', 'https://www.offsec.com/courses/pen-300/', ARRAY['Evasion', 'Advanced Exp'], ARRAY['Senior Pentester'], '90 days lab + exam', '$1,499', 4, 5, 5, 5),
('OSWE', 'Offensive Security Web Expert', 'Offensive Security', 'Red Team', 'https://www.offsec.com/courses/web-300/', ARRAY['Web App Sec', 'Code Review'], ARRAY['Web Pentester'], '90 days lab + exam', '$1,499', 3, 4, 5, 5),
('CRTP', 'Certified Red Team Professional', 'PentesterAcademy', 'Red Team', 'https://www.alteredsecurity.com/adlab', ARRAY['Active Directory', 'Kerberos'], ARRAY['Red Team Op'], '30 days lab + exam', '$249', 3, 4, 4, 3),
('GPEN', 'GIAC Penetration Tester', 'SANS/GIAC', 'Red Team', 'https://www.giac.org/certifications/penetration-tester-gpen/', ARRAY['Pen Testing'], ARRAY['Pentester'], '6 days training', '$7,000+', 4, 4, 5, 3),
('GCFA', 'GIAC Certified Forensic Analyst', 'SANS/GIAC', 'Blue Team', 'https://www.giac.org/certifications/certified-forensic-analyst-gcfa/', ARRAY['Forensics', 'Threat Hunting'], ARRAY['Forensic Analyst'], '6 days training', '$7,000+', 3, 4, 5, 4),
('GSEC', 'GIAC Security Essentials', 'SANS/GIAC', 'Blue Team', 'https://www.giac.org/certifications/security-essentials-gsec/', ARRAY['Sec Fundamentals'], ARRAY['Sec Analyst'], '6 days training', '$7,000+', 5, 4, 4, 2),
('GNFA', 'GIAC Network Forensic Analyst', 'SANS/GIAC', 'Blue Team', 'https://www.giac.org/certifications/network-forensic-analyst-gnfa/', ARRAY['Network Forensics'], ARRAY['Forensic Analyst'], '6 days training', '$7,000+', 2, 3, 4, 4),
('CySA+', 'CompTIA Cybersecurity Analyst', 'CompTIA', 'Blue Team', 'https://www.comptia.org/certifications/cybersecurity-analyst', ARRAY['Threat Intel', 'Monitoring'], ARRAY['SOC Analyst'], 'Self-paced', '$370', 4, 4, 5, 3),
('BTLO', 'Blue Team Level 1', 'Security Blue Team', 'Blue Team', 'https://securityblue.team/', ARRAY['SOC', 'Analysis'], ARRAY['SOC Analyst'], 'Self-paced', '$399', 3, 4, 4, 2)
ON CONFLICT (code) DO UPDATE SET
    link = EXCLUDED.link,
    duration = EXCLUDED.duration,
    cost = EXCLUDED.cost,
    difficulty = EXCLUDED.difficulty,
    popularity = EXCLUDED.popularity,
    job_market = EXCLUDED.job_market,
    rating = EXCLUDED.rating;


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
('Have I Been Pwned', 'Free Services', 'Free', 'Check if your email is in a data breach.', 'https://haveibeenpwned.com/', '🛡️', ARRAY['Email Check', 'Password Check']),
('DeHashed', 'Premium Services', 'Paid', 'Search engine for viewable assets.', 'https://www.dehashed.com/', '🔍', ARRAY['Asset Search', 'API']),
('Intelligence X', 'Intelligence Platforms', 'Premium', 'Intelligence X is a search engine and data archive.', 'https://intelx.io/', '🕵️', ARRAY['Darknet', 'Archive']),
('LeakCheck', 'Premium Services', 'Premium', 'Data breach search engine.', 'https://leakcheck.io/', '🔎', ARRAY['Email Search', 'Domain Search']),
('SnusBase', 'Premium Services', 'Paid', 'Database search engine.', 'https://snusbase.com/', '💾', ARRAY['Credential Search']),
('Leak Lookup', 'Free Services', 'Free', 'Simple breach lookup.', 'https://leak-lookup.com/', '🔎', ARRAY['Email Lookup']),
('Breach Directory', 'Community Services', 'Free', 'Community driven breach database.', 'https://breachdirectory.org/', '📚', ARRAY['Community'])
ON CONFLICT (name) DO UPDATE SET
    url = EXCLUDED.url,
    icon = EXCLUDED.icon,
    key_features = EXCLUDED.key_features;

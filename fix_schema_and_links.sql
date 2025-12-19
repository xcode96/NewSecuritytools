-- Fix Schema and Links for All Modals

-- 1. Platforms (assume 'url' exists or add it)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'platforms' AND column_name = 'url') THEN
        ALTER TABLE platforms ADD COLUMN url text;
    END IF;
END $$;

UPDATE platforms SET url = 'https://www.salesforce.com' WHERE name = 'Salesforce';
UPDATE platforms SET url = 'https://www.servicenow.com' WHERE name = 'ServiceNow';
UPDATE platforms SET url = 'https://www.sap.com' WHERE name = 'SAP';
UPDATE platforms SET url = 'https://www.workday.com' WHERE name = 'Workday';
UPDATE platforms SET url = 'https://www.oracle.com' WHERE name = 'Oracle';
UPDATE platforms SET url = 'https://www.microsoft.com/microsoft-365/enterprise' WHERE name = 'Microsoft 365 Enterprise';
UPDATE platforms SET url = 'https://www.federacy.com/' WHERE name = 'Federacy';
UPDATE platforms SET url = 'https://www.hackerone.com/' WHERE name = 'HackerOne';
UPDATE platforms SET url = 'https://www.bugcrowd.com/' WHERE name = 'Bugcrowd';
UPDATE platforms SET url = 'https://www.synack.com/' WHERE name = 'Synack';
UPDATE platforms SET url = 'https://www.intigriti.com/' WHERE name = 'Intigriti';
UPDATE platforms SET url = 'https://www.yeswehack.com/' WHERE name = 'YesWeHack';
UPDATE platforms SET url = 'https://www.cobalt.io/' WHERE name = 'Cobalt';
UPDATE platforms SET url = 'https://www.openbugbounty.org/' WHERE name = 'Open Bug Bounty';


-- 2. Downloads (Add 'url' column if missing, update it)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'downloads' AND column_name = 'url') THEN
        ALTER TABLE downloads ADD COLUMN url text;
    END IF;
END $$;

-- If 'link' column exists, copy data from 'link' to 'url' just in case, but we will overwrite with official links anyway specific items
-- UPDATE downloads SET url = link WHERE url IS NULL AND link IS NOT NULL; -- (Optional, if syntax was valid in data)

UPDATE downloads SET url = 'https://www.kali.org/get-kali/' WHERE name = 'Kali Linux';
UPDATE downloads SET url = 'https://parrotsec.org/download/' WHERE name = 'Parrot OS';
UPDATE downloads SET url = 'https://tails.boum.org/install/' WHERE name = 'Tails';
UPDATE downloads SET url = 'https://blackarch.org/downloads.html' WHERE name = 'BlackArch';
UPDATE downloads SET url = 'https://www.sans.org/tools/sift-workstation/' WHERE name = 'SIFT Workstation';
UPDATE downloads SET url = 'https://www.autopsy.com/download/' WHERE name = 'Autopsy';
UPDATE downloads SET url = 'https://www.wireshark.org/download.html' WHERE name = 'Wireshark';
UPDATE downloads SET url = 'https://nmap.org/download.html' WHERE name = 'Nmap';
UPDATE downloads SET url = 'https://portswigger.net/burp/communitydownload' WHERE name = 'Burp Suite Community';
UPDATE downloads SET url = 'https://ghidra-sre.org/' WHERE name = 'Ghidra';
UPDATE downloads SET url = 'https://www.metasploit.com/download' WHERE name = 'Metasploit Framework';
UPDATE downloads SET url = 'https://www.microsoft.com/en-us/evalcenter/evaluate-windows-11-enterprise' WHERE name = 'Windows 11 Enterprise';
UPDATE downloads SET url = 'https://www.microsoft.com/en-us/evalcenter/evaluate-windows-server-2022' WHERE name = 'Windows Server 2022';
UPDATE downloads SET url = 'https://ubuntu.com/download/server' WHERE name = 'Ubuntu Server LTS';
UPDATE downloads SET url = 'https://ubuntu.com/download/desktop' WHERE name = 'Ubuntu Desktop LTS';
UPDATE downloads SET url = 'https://www.debian.org/download' WHERE name = 'Debian Security';
UPDATE downloads SET url = 'https://shop.netgate.com/products/netgate-installer' WHERE name = 'pfSense';
UPDATE downloads SET url = 'https://securityonionsolutions.com/software/' WHERE name = 'Security Onion';
UPDATE downloads SET url = 'https://remnux.org/get-the-remnux-distro/' WHERE name = 'REMnux';
UPDATE downloads SET url = 'https://nodejs.org/en/download' WHERE name = 'Node.js LTS';
UPDATE downloads SET url = 'https://www.python.org/downloads/' WHERE name = 'Python Security';


-- 3. Certifications (Uses 'link' column typically)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'certifications' AND column_name = 'link') THEN
        ALTER TABLE certifications ADD COLUMN link text;
    END IF;
END $$;

UPDATE certifications SET link = 'https://www.offsec.com/courses/pen-200/' WHERE code = 'OSCP';
UPDATE certifications SET link = 'https://www.offsec.com/courses/pen-300/' WHERE code = 'OSEP';
UPDATE certifications SET link = 'https://www.offsec.com/courses/web-300/' WHERE code = 'OSWE';
UPDATE certifications SET link = 'https://www.eccouncil.org/programs/certified-ethical-hacker-ceh/' WHERE code = 'CEH';
UPDATE certifications SET link = 'https://www.alteredsecurity.com/adlab' WHERE code = 'CRTP';
UPDATE certifications SET link = 'https://www.giac.org/certifications/penetration-tester-gpen/' WHERE code = 'GPEN';
UPDATE certifications SET link = 'https://www.giac.org/certifications/certified-incident-handler-gcih/' WHERE code = 'GCIH';
UPDATE certifications SET link = 'https://www.giac.org/certifications/certified-forensic-analyst-gcfa/' WHERE code = 'GCFA';
UPDATE certifications SET link = 'https://www.giac.org/certifications/security-essentials-gsec/' WHERE code = 'GSEC';
UPDATE certifications SET link = 'https://www.giac.org/certifications/network-forensic-analyst-gnfa/' WHERE code = 'GNFA';
UPDATE certifications SET link = 'https://www.comptia.org/certifications/cybersecurity-analyst' WHERE code = 'CySA+';
UPDATE certifications SET link = 'https://securityblue.team/' WHERE code = 'BTLO';
UPDATE certifications SET link = 'https://www.isc2.org/Certifications/CISSP' WHERE code = 'CISSP';
UPDATE certifications SET link = 'https://www.isaca.org/credentialing/cism' WHERE code = 'CISM';


-- 4. Breach Services (Add 'url' column if missing)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'breach_services' AND column_name = 'url') THEN
        ALTER TABLE breach_services ADD COLUMN url text;
    END IF;
END $$;

UPDATE breach_services SET url = 'https://haveibeenpwned.com/' WHERE name = 'Have I Been Pwned';
UPDATE breach_services SET url = 'https://leakcheck.io/' WHERE name = 'LeakCheck';
UPDATE breach_services SET url = 'https://www.dehashed.com/' WHERE name = 'DeHashed';
UPDATE breach_services SET url = 'https://intelx.io/' WHERE name = 'Intelligence X';
UPDATE breach_services SET url = 'https://snusbase.com/' WHERE name = 'SnusBase';
UPDATE breach_services SET url = 'https://leak-lookup.com/' WHERE name = 'Leak Lookup';
UPDATE breach_services SET url = 'https://breachdirectory.org/' WHERE name = 'Breach Directory';

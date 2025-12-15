const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'data', 'downloads.ts');
let content = fs.readFileSync(filePath, 'utf8');

const updates = {
    'Kali Linux': 'https://www.kali.org/get-kali/',
    'Parrot Security OS': 'https://parrotsec.org/download/',
    'BlackArch Linux': 'https://blackarch.org/downloads.html',
    'Pentoo Linux': 'https://pentoo.ch/downloads/',
    'CAINE Linux': 'https://www.caine-live.net/',
    'DEFT Linux': 'http://www.deftlinux.net/',
    'PALADIN': 'https://sumuri.com/software/paladin/',
    'Windows 11 Enterprise': 'https://www.microsoft.com/en-us/evalcenter/evaluate-windows-11-enterprise',
    'Windows Server 2022': 'https://www.microsoft.com/en-us/evalcenter/evaluate-windows-server-2022',
    'Ubuntu Server LTS': 'https://ubuntu.com/download/server',
    'Ubuntu Desktop LTS': 'https://ubuntu.com/download/desktop',
    'Debian Security': 'https://www.debian.org/download',
    'pfSense': 'https://shop.netgate.com/products/netgate-installer',
    'Security Onion': 'https://securityonionsolutions.com/software/',
    'SIFT Workstation': 'https://www.sans.org/tools/sift-workstation/',
    'REMnux': 'https://remnux.org/get-the-remnux-distro/',
    'Node.js LTS': 'https://nodejs.org/en/download',
    'Python Security': 'https://www.python.org/downloads/'
};

// Iterate through the updates and replace the link for the corresponding name
for (const [name, url] of Object.entries(updates)) {
    // Regex to find the object with the specific name and then its link property
    // We match name: 'Name', then any characters until link: '#'
    const regex = new RegExp(`(name:\\s*'${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}',[\\s\\S]*?link:\\s*)'#'`, 'g');

    if (regex.test(content)) {
        content = content.replace(regex, `$1'${url}'`);
        console.log(`Updated ${name}`);
    } else {
        console.log(`Could not find entry for ${name}`);
    }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done!');

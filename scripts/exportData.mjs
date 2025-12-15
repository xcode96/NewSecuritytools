// Simple export script - run with: node scripts/exportData.mjs
import { writeFileSync, mkdirSync, existsSync } from 'fs';

// Simple data - you can manually copy from your data files
const OUTPUT_DIR = './data-export';

// Create output directory
if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('📦 Data Export Utility\n');
console.log('Since TypeScript imports are complex, please use the browser console method:\n');
console.log('1. Open your app in the browser');
console.log('2. Open DevTools Console (F12)');
console.log('3. Run these commands:\n');

const commands = `
// Export Tools
copy(JSON.stringify(window.toolsData || [], null, 2));
// Paste into data-export/tools.json

// Export Books  
copy(JSON.stringify(window.booksData || [], null, 2));
// Paste into data-export/books.json

// Export Useful Links
copy(JSON.stringify(window.usefulLinksData || [], null, 2));
// Paste into data-export/useful-links.json

// Export Platforms
copy(JSON.stringify(window.platformsData || [], null, 2));
// Paste into data-export/platforms.json

// Export Certifications
copy(JSON.stringify(window.certificationsData || [], null, 2));
// Paste into data-export/certifications.json

// Export Downloads
copy(JSON.stringify(window.downloadsData || [], null, 2));
// Paste into data-export/downloads.json

// Export Frameworks
copy(JSON.stringify(window.frameworksData || [], null, 2));
// Paste into data-export/frameworks.json

// Export Breach Services
copy(JSON.stringify(window.breachServices || [], null, 2));
// Paste into data-export/breach-services.json

// Export YouTubers
copy(JSON.stringify(window.youtubersData || [], null, 2));
// Paste into data-export/youtubers.json
`;

console.log(commands);
console.log('\n✨ Alternative: Use the web-based export tool I\'ll create next!');

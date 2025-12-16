// Script to export all data from TypeScript files to JSON format
import * as fs from 'fs';
import * as path from 'path';

// Import all data
// Import all data
import { TOOLS } from '../data/constants';
import { booksData } from '../data/books';
import { usefulLinksData } from '../data/usefulLinks';
import { platformsData } from '../data/platforms';
import { certificationsData } from '../data/certifications';
import { downloadsData } from '../data/downloads';
import { frameworksData } from '../data/frameworks';
import { breachServices } from '../data/breachServices';
import { youtubersData } from '../data/youtubers';

const OUTPUT_DIR = './data-export';

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Export function
function exportToJSON(data: any[], filename: string) {
    const filePath = path.join(OUTPUT_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`✅ Exported ${data.length} items to ${filename}`);
}

// Export all data
console.log('🚀 Starting data export...\n');

exportToJSON(TOOLS, 'tools.json');
exportToJSON(booksData, 'books.json');
exportToJSON(usefulLinksData, 'useful-links.json');
exportToJSON(platformsData, 'platforms.json');
exportToJSON(certificationsData, 'certifications.json');
exportToJSON(downloadsData, 'downloads.json');
exportToJSON(frameworksData, 'frameworks.json');
exportToJSON(breachServices, 'breach-services.json');
exportToJSON(youtubersData, 'youtubers.json');

console.log('\n✨ Export complete! All files saved to ./data-export/');

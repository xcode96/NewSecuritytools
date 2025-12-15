// Script to import JSON data into Supabase
import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

const DATA_DIR = './data-export';

// Import function
async function importFromJSON(filename: string, tableName: string) {
    const filePath = path.join(DATA_DIR, filename);

    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${filename}`);
        return;
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    console.log(`📥 Importing ${data.length} items to ${tableName}...`);

    // Delete existing data (optional - comment out to keep existing data)
    // await supabase.from(tableName).delete().neq('id', 0);

    // Insert data in batches
    const batchSize = 100;
    for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        const { error } = await supabase.from(tableName).insert(batch);

        if (error) {
            console.error(`❌ Error importing to ${tableName}:`, error.message);
        } else {
            console.log(`   ✅ Imported batch ${Math.floor(i / batchSize) + 1}`);
        }
    }

    console.log(`✅ Completed ${tableName}\n`);
}

// Main import function
async function importAll() {
    console.log('🚀 Starting data import to Supabase...\n');

    await importFromJSON('tools.json', 'tools');
    await importFromJSON('books.json', 'books');
    await importFromJSON('useful-links.json', 'useful_links');
    await importFromJSON('platforms.json', 'platforms');
    await importFromJSON('certifications.json', 'certifications');
    await importFromJSON('downloads.json', 'downloads');
    await importFromJSON('frameworks.json', 'frameworks');
    await importFromJSON('breach-services.json', 'breach_services');
    await importFromJSON('youtubers.json', 'youtubers');

    console.log('✨ Import complete!');
}

importAll().catch(console.error);

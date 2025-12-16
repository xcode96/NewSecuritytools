// Script to import JSON data into Supabase
import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

const DATA_DIR = './data-export';

// Helper to read JSON
function readJSON(filename: string) {
    const filePath = path.join(DATA_DIR, filename);
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  File not found: ${filename}`);
        return [];
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

// Map Category Names to IDs
let categoryIdMap: Record<string, string> = {};

async function importCategories() {
    console.log('📥 Importing Categories...');

    // 1. Get unique categories from Tools data (source of truth for categories used) plus fixed list?
    // Actually we should import from a categories source or just infer them. 
    // The current exportData.ts DOES NOT export categories explicitly, only tools. 
    // We should extract unique categories from tools.json.
    const tools = readJSON('tools.json');
    const uniqueCategories = Array.from(new Set(tools.map((t: any) => t.category))).filter(Boolean);

    console.log(`   Found ${uniqueCategories.length} unique categories.`);

    for (const catName of uniqueCategories) {
        // Upsert categories
        const { data, error } = await supabase
            .from('categories')
            .upsert({ name: catName }, { onConflict: 'name' })
            .select('id, name')
            .single();

        if (error) {
            console.error(`   ❌ Error importing category ${catName}:`, error.message);
        } else if (data) {
            categoryIdMap[data.name] = data.id;
        }
    }
    console.log('✅ Categories imported.\n');
}

async function importTools() {
    console.log('📥 Importing Tools...');
    const tools = readJSON('tools.json');
    const toolsToInsert = tools.map((t: any) => ({
        name: t.name,
        description: t.description,
        category_id: categoryIdMap[t.category], // Link!
        url: t.url,
        color: t.color,
        command: t.command,
        tags: t.tags,
        is_hidden: t.isHidden, // map camelCase
        articles: t.articles
    }));

    const { error } = await supabase.from('tools').insert(toolsToInsert);
    if (error) console.error(`❌ Error importing tools:`, error.message);
    else console.log(`✅ Imported ${tools.length} tools.\n`);
}

async function importGeneric(filename: string, tableName: string) {
    const data = readJSON(filename);
    if (data.length === 0) return;

    console.log(`📥 Importing ${tableName} (${data.length} items)...`);

    // Batch insert
    const batchSize = 50;
    for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        // Clean data if needed (e.g. remove IDs if auto-generated, but we generally want to keep them if they match standard types?)
        // Our schema uses generated IDs for some, but specific types for others?
        // Let's rely on Supabase handling 'id' if generic.

        // Exclude 'id' to let Supabase generate new ones? Or keep?
        // Let's exclude 'id' to restart fresh IDs in cloud.
        const cleanBatch = batch.map(({ id, ...rest }: any) => {
            // Handle case conversions if needed
            // Certifications: jobMarket -> job_market
            if (tableName === 'certifications') {
                return {
                    ...rest,
                    job_market: rest.jobMarket,
                    exam_format: rest.examFormat,
                    key_skills: rest.keySkills,
                    career_paths: rest.careerPaths
                };
            }
            return rest;
        });

        const { error } = await supabase.from(tableName).insert(cleanBatch);
        if (error) console.error(`   ❌ Batch error:`, error.message);
    }
    console.log(`✅ Completed ${tableName}.\n`);
}

async function importAll() {
    console.log('🚀 Starting Supabase Migration...\n');

    await importCategories();
    await importTools();

    await importGeneric('books.json', 'books');
    await importGeneric('useful-links.json', 'useful_links');
    await importGeneric('platforms.json', 'platforms');
    await importGeneric('certifications.json', 'certifications');
    await importGeneric('downloads.json', 'downloads');
    await importGeneric('frameworks.json', 'frameworks');
    await importGeneric('breach-services.json', 'breach_services');
    await importGeneric('youtubers.json', 'youtubers');

    console.log('✨ Migration complete!');
}

importAll().catch(console.error);

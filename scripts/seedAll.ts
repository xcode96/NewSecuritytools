import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { youtubersData } from '../data/youtubers';
import { downloadsData } from '../data/downloads';
import { platformsData } from '../data/platforms';
import { usefulLinksData } from '../data/usefulLinks';
import { certificationsData } from '../data/certifications';
import { breachServices as breachServicesData } from '../data/breachServices';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env file');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedYouTubers() {
    console.log('Seeding YouTubers...');
    const items = youtubersData.map(item => ({
        name: item.name,
        description: item.description,
        url: item.link,
        category: item.category,
        subscribers: null,
        topics: item.tags,
    }));

    const { error } = await supabase.from('youtubers').insert(items);
    if (error) console.error('Error seeding YouTubers:', error);
    else console.log(`Seeded ${items.length} YouTubers.`);
}

async function seedDownloads() {
    console.log('Seeding Downloads...');
    const items = downloadsData.map(item => ({
        name: item.name,
        description: item.description,
        url: item.link,
        category: item.category,
        code: item.code,
        type: item.type,
        team: item.team,
        popularity: item.popularity,
        key_features: item.keyFeatures,
    }));

    const { error } = await supabase.from('downloads').insert(items);
    if (error) console.error('Error seeding Downloads:', error);
    else console.log(`Seeded ${items.length} Downloads.`);
}

async function seedPlatforms() {
    console.log('Seeding Platforms...');
    const items = platformsData.map(item => ({
        name: item.name,
        description: item.description,
        url: item.link,
        features: item.features,
        rating: item.rating,
        founded: item.founded,
        hackers: item.hackers,
        notable_companies: item.notableCompanies,
        pricing_model: item.payoutRange,
        type: item.type
    }));

    const { error } = await supabase.from('platforms').insert(items);
    if (error) console.error('Error seeding Platforms:', error);
    else console.log(`Seeded ${items.length} Platforms.`);
}

async function seedUsefulLinks() {
    console.log('Seeding Useful Links...');
    const items = usefulLinksData.map(item => ({
        name: item.name,
        description: item.description,
        url: item.url,
        category: item.category,
        tags: item.tags,
        icon: item.icon,
        icon_name: item.icon_name
    }));

    const { error } = await supabase.from('useful_links').insert(items);
    if (error) console.error('Error seeding Useful Links:', error);
    else console.log(`Seeded ${items.length} Useful Links.`);
}

async function seedCertifications() {
    console.log('Seeding Certifications...');
    const items = certificationsData.map(item => ({
        code: item.code,
        name: item.name,
        provider: item.provider,
        category: item.category,
        level: item.level,
        rating: item.rating,
        difficulty: item.difficulty,
        popularity: item.popularity,
        job_market: item.jobMarket,
        description: item.description,
        duration: item.duration,
        cost: item.cost,
        prerequisites: item.prerequisites,
        exam_format: item.examFormat,
        key_skills: item.keySkills,
        career_paths: item.careerPaths,
        link: item.link
    }));

    const { error } = await supabase.from('certifications').insert(items);
    if (error) console.error('Error seeding Certifications:', error);
    else console.log(`Seeded ${items.length} Certifications.`);
}

async function seedBreachServices() {
    console.log('Seeding Breach Services...');
    const items = breachServicesData.map(item => ({
        name: item.name,
        description: item.description,
        url: item.link,
        category: item.category,
        type: item.type,
        tags: item.tags,
        key_features: item.keyFeatures,
        icon: item.icon
    }));

    const { error } = await supabase.from('breach_services').insert(items);
    if (error) console.error('Error seeding Breach Services:', error);
    else console.log(`Seeded ${items.length} Breach Services.`);
}

async function seedAll() {
    console.log('Starting full seed...');

    // Optional: Delete all first to avoid duplicates if run multiple times?
    // Not doing delete automatically to be safe, but user can truncate if needed.

    await seedYouTubers();
    await seedDownloads();
    await seedPlatforms();
    await seedUsefulLinks();
    await seedCertifications();
    await seedBreachServices();
    await seedBooks();

    console.log('Done!');
}


async function seedBooks() {
    console.log('Seeding Books...');
    const { booksData } = await import('../data/books');
    const items = booksData.map(item => ({
        title: item.title,
        author: item.author,
        description: item.description,
        url: item.amazonLink,
        category: item.category,
        tags: item.tags,
        year: item.year,
        pages: item.pages
    }));

    const { error } = await supabase.from('books').insert(items);
    if (error) console.error('Error seeding Books:', error);
    else console.log(`Seeded ${items.length} Books.`);
}

seedAll().catch(console.error);

import { supabase } from '../src/lib/supabase';
import type { Tool, CategoryInfo } from '../types';

// Categories
export const fetchCategories = async (): Promise<CategoryInfo[]> => {
    const { data, error } = await supabase
        .from('categories')
        .select('name, color')
        .order('name');

    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }

    // Default order matches the original static list
    const order = [
        'Network Scanning & Analysis',
        'Web Application Security',
        'Password Attacks',
        'Wireless Hacking',
        'Exploitation Frameworks',
        'Forensics',
        'Reverse Engineering',
        'Cryptography Tools',
        'OSINT',
        'Malware Analysis',
        'Social Engineering',
        'Cloud Security'
    ];

    const sortedData = (data || []).sort((a, b) => {
        const indexA = order.indexOf(a.name);
        const indexB = order.indexOf(b.name);

        // If both are in the known list, sort by list index
        if (indexA !== -1 && indexB !== -1) {
            return indexA - indexB;
        }
        // If only A is in list, A comes first
        if (indexA !== -1) return -1;
        // If only B is in list, B comes first
        if (indexB !== -1) return 1;
        // If neither, sort alphabetically
        return a.name.localeCompare(b.name);
    });

    return sortedData;
};

export const addCategory = async (category: CategoryInfo): Promise<boolean> => {
    const { error } = await supabase
        .from('categories')
        .insert([category]);

    if (error) {
        console.error('Error adding category:', error);
        return false;
    }
    return true;
};

export const updateCategory = async (originalName: string, category: CategoryInfo): Promise<boolean> => {
    // 1. Get ID
    const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('id')
        .eq('name', originalName)
        .single();

    if (catError || !catData) {
        console.error('Error finding category to update:', catError);
        return false;
    }

    const { error } = await supabase
        .from('categories')
        .update({ name: category.name, color: category.color })
        .eq('id', catData.id);

    if (error) {
        console.error('Error updating category:', error);
        return false;
    }
    return true;
};

export const deleteCategory = async (categoryName: string): Promise<boolean> => {
    const { error } = await supabase
        .from('categories')
        .delete()
        .eq('name', categoryName);

    if (error) {
        console.error('Error deleting category:', error);
        return false;
    }
    return true;
};

// Tools
export const fetchTools = async (): Promise<Tool[]> => {
    const { data, error } = await supabase
        .from('tools')
        .select(`
      id,
      name,
      description,
      color,
      tags,
      is_hidden,
      articles,
      categories (
        name
      )
    `)
        .order('name');

    if (error) {
        console.error('Error fetching tools:', error);
        return [];
    }

    return (data || []).map((item: any) => ({
        ...item,
        category: item.categories?.name || 'Uncategorized', // Flatten the relation
        isHidden: item.is_hidden // Map snake_case to camelCase
    }));
};

export const addTool = async (tool: Tool): Promise<boolean> => {
    // First, find the category ID
    let { data: catData, error: catError } = await supabase
        .from('categories')
        .select('id')
        .eq('name', tool.category)
        .single();

    // If category not found, create it
    if (!catData) {
        console.log(`Category '${tool.category}' not found, creating it...`);
        // Default color if we don't have one handy (though tool.category is just a string here)
        // We'd ideally want the color from the UI, but for now specific valid logic:
        const { data: newCat, error: createError } = await supabase
            .from('categories')
            .insert([{ name: tool.category, color: '#64748b' }]) // Default slate color
            .select('id')
            .single();

        if (createError || !newCat) {
            console.error('Error creating missing category:', createError);
            return false;
        }
        catData = newCat;
    }

    const { error } = await supabase
        .from('tools')
        .insert([{
            name: tool.name,
            description: tool.description,
            category_id: catData.id,
            color: tool.color,
            tags: tool.tags,
            articles: tool.articles || [],
            is_hidden: tool.isHidden
        }]);

    if (error) {
        console.error('Error adding tool:', error);
        return false;
    }
    return true;
};

export const updateTool = async (originalName: string, tool: Tool): Promise<boolean> => {
    // 1. Get Category ID
    let { data: catData, error: catError } = await supabase
        .from('categories')
        .select('id')
        .eq('name', tool.category)
        .single();

    if (!catData) {
        // Create it
        const { data: newCat, error: createError } = await supabase
            .from('categories')
            .insert([{ name: tool.category, color: '#64748b' }])
            .select('id')
            .single();

        if (createError || !newCat) {
            console.error('Error creating missing category during update:', createError);
            return false;
        }
        catData = newCat;
    }

    // 2. Update Tool
    // First need to get the tool ID because passing name to update is risky if name changes? 
    // But duplicate names are not handled well yet.
    // Ideally we should use ID. But for now relying on originalName.

    // We update based on the original name
    const { error } = await supabase
        .from('tools')
        .update({
            name: tool.name,
            description: tool.description,
            category_id: catData.id,
            color: tool.color,
            tags: tool.tags,
            articles: tool.articles,
            is_hidden: tool.isHidden
        })
        .eq('name', originalName);

    if (error) {
        console.error('Error updating tool:', error);
        return false;
    }
    return true;
};

export const deleteTool = async (toolName: string): Promise<boolean> => {
    const { error } = await supabase
        .from('tools')
        .delete()
        .eq('name', toolName);

    if (error) {
        console.error('Error deleting tool:', error);
        return false;
    }
    return true;
};

// Books
export const fetchBooks = async (): Promise<any[]> => {
    const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('title');

    if (error) {
        console.error('Error fetching books:', error);
        return [];
    }
    // Map snake_case to camelCase for the UI
    return (data || []).map((item: any) => ({
        ...item,
        amazonLink: item.url, // Map url to amazonLink
        coverImage: item.cover_image
    }));
};

export const addBook = async (book: any): Promise<{ success: boolean; error?: any }> => {
    // Map camelCase to snake_case
    const dbItem = {
        title: book.title,
        author: book.author,
        description: book.description,
        url: book.amazonLink || book.url,
        cover_image: book.coverImage,
        category: book.category,
        tags: book.tags,
        year: book.year,
        pages: book.pages
    };

    const { error } = await supabase
        .from('books')
        .insert([dbItem]);

    if (error) {
        console.error('Error adding book:', error);
        return { success: false, error };
    }
    return { success: true };
};

export const updateBook = async (id: number, book: any): Promise<boolean> => {
    // Map camelCase to snake_case
    const dbItem = {
        title: book.title,
        author: book.author,
        description: book.description,
        url: book.amazonLink || book.url,
        cover_image: book.coverImage,
        category: book.category,
        tags: book.tags,
        year: book.year,
        pages: book.pages
    };

    const { error } = await supabase
        .from('books')
        .update(dbItem)
        .eq('id', id);

    if (error) {
        console.error('Error updating book:', error);
        return false;
    }
    return true;
};

export const deleteBook = async (id: number): Promise<boolean> => {
    const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting book:', error);
        return false;
    }
    return true;
};

// Useful Links
export const fetchUsefulLinks = async (): Promise<any[]> => {
    const { data, error } = await supabase
        .from('useful_links')
        .select('*')
        .order('name');

    if (error) {
        console.error('Error fetching useful links:', error);
        return [];
    }
    return data || [];
};

export const addUsefulLink = async (link: any): Promise<boolean> => {
    const { error } = await supabase
        .from('useful_links')
        .insert([link]);

    if (error) {
        console.error('Error adding useful link:', error);
        return false;
    }
    return true;
};

export const updateUsefulLink = async (id: number, link: any): Promise<boolean> => {
    const { error } = await supabase
        .from('useful_links')
        .update(link)
        .eq('id', id);

    if (error) {
        console.error('Error updating useful link:', error);
        return false;
    }
    return true;
};

export const deleteUsefulLink = async (id: number): Promise<boolean> => {
    const { error } = await supabase
        .from('useful_links')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting useful link:', error);
        return false;
    }
    return true;
};

// --- Platforms ---
export const fetchPlatforms = async () => {
    const { data, error } = await supabase.from('platforms').select('*').order('name');
    if (error) return console.error('Error fetching platforms:', error), [];
    return data || [];
};
export const addPlatform = async (item: any) => {
    const { error } = await supabase.from('platforms').insert([item]);
    return !error;
};
export const updatePlatform = async (id: number, item: any) => {
    const { error } = await supabase.from('platforms').update(item).eq('id', id);
    return !error;
};
export const deletePlatform = async (id: number) => {
    const { error } = await supabase.from('platforms').delete().eq('id', id);
    return !error;
};

// --- Certifications ---
export const fetchCertifications = async () => {
    const { data, error } = await supabase.from('certifications').select('*').order('name');
    if (error) return console.error('Error fetching certifications:', error), [];

    // Map snake_case to camelCase
    return (data || []).map((item: any) => ({
        ...item,
        jobMarket: Number(item.job_market || item.jobMarket || 0),
        examFormat: item.exam_format || item.examFormat,
        keySkills: item.key_skills || item.keySkills || [],
        careerPaths: item.career_paths || item.careerPaths || [],
        rating: Number(item.rating || 0),
        difficulty: Number(item.difficulty || 0),
        popularity: Number(item.popularity || 0)
    }));
};

export const addCertification = async (item: any) => {
    // Map camelCase to snake_case
    const dbItem = {
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
    };

    const { error } = await supabase.from('certifications').insert([dbItem]);
    return !error;
};

export const updateCertification = async (id: number, item: any) => {
    // Map camelCase to snake_case
    const dbItem = {
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
    };

    const { error } = await supabase.from('certifications').update(dbItem).eq('id', id);
    return !error;
};

export const deleteCertification = async (id: number) => {
    const { error } = await supabase.from('certifications').delete().eq('id', id);
    return !error;
};

// --- Downloads ---
export const fetchDownloads = async () => {
    const { data, error } = await supabase.from('downloads').select('*').order('name');
    if (error) return console.error('Error fetching downloads:', error), [];
    return data || [];
};
export const addDownload = async (item: any) => {
    const { error } = await supabase.from('downloads').insert([item]);
    return !error;
};
export const updateDownload = async (id: number, item: any) => {
    const { error } = await supabase.from('downloads').update(item).eq('id', id);
    return !error;
};
export const deleteDownload = async (id: number) => {
    const { error } = await supabase.from('downloads').delete().eq('id', id);
    return !error;
};

// --- Frameworks ---
export const fetchFrameworks = async () => {
    const { data, error } = await supabase.from('frameworks').select('*').order('name');
    if (error) return console.error('Error fetching frameworks:', error), [];
    return data || [];
};
export const addFramework = async (item: any) => {
    const { error } = await supabase.from('frameworks').insert([item]);
    return !error;
};
export const updateFramework = async (id: number, item: any) => {
    const { error } = await supabase.from('frameworks').update(item).eq('id', id);
    return !error;
};
export const deleteFramework = async (id: number) => {
    const { error } = await supabase.from('frameworks').delete().eq('id', id);
    return !error;
};

// --- Breach Services ---
export const fetchBreachServices = async () => {
    const { data, error } = await supabase.from('breach_services').select('*').order('name');
    if (error) return console.error('Error fetching breach services:', error), [];
    return data || [];
};
export const addBreachService = async (item: any) => {
    const { error } = await supabase.from('breach_services').insert([item]);
    return !error;
};
export const updateBreachService = async (id: number, item: any) => {
    const { error } = await supabase.from('breach_services').update(item).eq('id', id);
    return !error;
};
export const deleteBreachService = async (id: number) => {
    const { error } = await supabase.from('breach_services').delete().eq('id', id);
    return !error;
};

// --- YouTubers ---
export const fetchYouTubers = async () => {
    const { data, error } = await supabase.from('youtubers').select('*').order('name');
    if (error) return console.error('Error fetching youtubers:', error), [];
    return data || [];
};
export const addYouTuber = async (item: any) => {
    const { error } = await supabase.from('youtubers').insert([item]);
    return !error;
};
export const updateYouTuber = async (id: number, item: any) => {
    const { error } = await supabase.from('youtubers').update(item).eq('id', id);
    return !error;
};
export const deleteYouTuber = async (id: number) => {
    const { error } = await supabase.from('youtubers').delete().eq('id', id);
    return !error;
};


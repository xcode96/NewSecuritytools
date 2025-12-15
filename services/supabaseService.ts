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

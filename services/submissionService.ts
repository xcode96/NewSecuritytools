import { supabase } from '../src/lib/supabase';
import type { ToolSubmission, ToolSubmissionFormData } from '../types';

/**
 * Submit a new tool for review
 */
export const submitTool = async (
    submissionData: ToolSubmissionFormData
): Promise<{ success: boolean; error?: string }> => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            return { success: false, error: 'You must be signed in to submit a tool' };
        }

        const { error } = await supabase
            .from('tool_submissions')
            .insert([{
                user_id: user.id,
                user_email: user.email || 'unknown',
                tool_name: submissionData.tool_name,
                description: submissionData.description,
                category: submissionData.category,
                tags: submissionData.tags || [],
                color: submissionData.color || '#64748b',
                status: 'pending'
            }]);

        if (error) {
            console.error('Error submitting tool:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err) {
        console.error('Unexpected error submitting tool:', err);
        return { success: false, error: 'An unexpected error occurred' };
    }
};

/**
 * Get current user's submissions
 */
export const getUserSubmissions = async (): Promise<ToolSubmission[]> => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            return [];
        }

        const { data, error } = await supabase
            .from('tool_submissions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching user submissions:', error);
            return [];
        }

        return data || [];
    } catch (err) {
        console.error('Unexpected error fetching submissions:', err);
        return [];
    }
};

/**
 * Get all submissions (admin only)
 */
export const getAllSubmissions = async (statusFilter?: 'pending' | 'approved' | 'rejected'): Promise<ToolSubmission[]> => {
    try {
        let query = supabase
            .from('tool_submissions')
            .select('*')
            .order('created_at', { ascending: false });

        if (statusFilter) {
            query = query.eq('status', statusFilter);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching all submissions:', error);
            return [];
        }

        return data || [];
    } catch (err) {
        console.error('Unexpected error fetching all submissions:', err);
        return [];
    }
};

/**
 * Get count of pending submissions (admin only)
 */
export const getPendingCount = async (): Promise<number> => {
    try {
        const { count, error } = await supabase
            .from('tool_submissions')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'pending');

        if (error) {
            console.error('Error fetching pending count:', error);
            return 0;
        }

        return count || 0;
    } catch (err) {
        console.error('Unexpected error fetching pending count:', err);
        return 0;
    }
};

/**
 * Approve a submission and create the tool (admin only)
 */
export const approveSubmission = async (
    submissionId: number,
    notes?: string
): Promise<{ success: boolean; error?: string }> => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            return { success: false, error: 'You must be signed in as admin' };
        }

        // First, get the submission details
        const { data: submission, error: fetchError } = await supabase
            .from('tool_submissions')
            .select('*')
            .eq('id', submissionId)
            .single();

        if (fetchError || !submission) {
            return { success: false, error: 'Submission not found' };
        }

        // Get or create category
        let { data: catData, error: catError } = await supabase
            .from('categories')
            .select('id')
            .eq('name', submission.category)
            .single();

        if (!catData) {
            const { data: newCat, error: createError } = await supabase
                .from('categories')
                .insert([{ name: submission.category, color: submission.color }])
                .select('id')
                .single();

            if (createError || !newCat) {
                return { success: false, error: 'Failed to create category' };
            }
            catData = newCat;
        }

        // Create the tool
        const { error: toolError } = await supabase
            .from('tools')
            .insert([{
                name: submission.tool_name,
                description: submission.description,
                category_id: catData.id,
                color: submission.color,
                tags: submission.tags || [],
                articles: [],
                is_hidden: false
            }]);

        if (toolError) {
            return { success: false, error: `Failed to create tool: ${toolError.message}` };
        }

        // Update submission status
        const { error: updateError } = await supabase
            .from('tool_submissions')
            .update({
                status: 'approved',
                reviewed_at: new Date().toISOString(),
                reviewed_by: user.id,
                review_notes: notes
            })
            .eq('id', submissionId);

        if (updateError) {
            return { success: false, error: 'Failed to update submission status' };
        }

        return { success: true };
    } catch (err) {
        console.error('Unexpected error approving submission:', err);
        return { success: false, error: 'An unexpected error occurred' };
    }
};

/**
 * Reject a submission (admin only)
 */
export const rejectSubmission = async (
    submissionId: number,
    notes?: string
): Promise<{ success: boolean; error?: string }> => {
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            return { success: false, error: 'You must be signed in as admin' };
        }

        const { error } = await supabase
            .from('tool_submissions')
            .update({
                status: 'rejected',
                reviewed_at: new Date().toISOString(),
                reviewed_by: user.id,
                review_notes: notes
            })
            .eq('id', submissionId);

        if (error) {
            console.error('Error rejecting submission:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err) {
        console.error('Unexpected error rejecting submission:', err);
        return { success: false, error: 'An unexpected error occurred' };
    }
};

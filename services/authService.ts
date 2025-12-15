import { supabase } from '../src/lib/supabase';
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js';

export interface UserProfile {
    id: string;
    email: string | null;
    fullName: string | null;
    avatarUrl: string | null;
}

/**
 * Sign in with Google OAuth
 */
export const signInWithGoogle = async (): Promise<{ error: Error | null }> => {
    try {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}`,
            },
        });

        if (error) {
            console.error('Error signing in with Google:', error);
            return { error };
        }

        return { error: null };
    } catch (err) {
        console.error('Unexpected error during Google sign-in:', err);
        return { error: err as Error };
    }
};

/**
 * Sign out the current user
 */
export const signOut = async (): Promise<{ error: Error | null }> => {
    try {
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error('Error signing out:', error);
            return { error };
        }

        return { error: null };
    } catch (err) {
        console.error('Unexpected error during sign-out:', err);
        return { error: err as Error };
    }
};

/**
 * Get the current authenticated user
 */
export const getCurrentUser = async (): Promise<User | null> => {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) {
            console.error('Error getting current user:', error);
            return null;
        }

        return user;
    } catch (err) {
        console.error('Unexpected error getting user:', err);
        return null;
    }
};

/**
 * Get user profile information
 */
export const getUserProfile = async (): Promise<UserProfile | null> => {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return null;
        }

        return {
            id: user.id,
            email: user.email || null,
            fullName: user.user_metadata?.full_name || user.user_metadata?.name || null,
            avatarUrl: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
        };
    } catch (err) {
        console.error('Error getting user profile:', err);
        return null;
    }
};

/**
 * Check if the current user is an admin
 */
export const isAdmin = async (): Promise<boolean> => {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return false;
        }

        const { data, error } = await supabase
            .from('admin_users')
            .select('id')
            .eq('user_id', user.id)
            .single();

        if (error || !data) {
            return false;
        }

        return true;
    } catch (err) {
        console.error('Error checking admin status:', err);
        return false;
    }
};

/**
 * Listen for authentication state changes
 */
export const onAuthStateChange = (
    callback: (event: AuthChangeEvent, session: Session | null) => void
) => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
    return subscription;
};

/**
 * Get current session
 */
export const getSession = async (): Promise<Session | null> => {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
            console.error('Error getting session:', error);
            return null;
        }

        return session;
    } catch (err) {
        console.error('Unexpected error getting session:', err);
        return null;
    }
};

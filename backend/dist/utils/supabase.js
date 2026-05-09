import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
}
// Global admin client for operations that bypass RLS or need higher privileges
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
/**
 * Creates a scoped Supabase client using the user's JWT.
 * This ensures that RLS policies are applied correctly for the user.
 */
export const createScopedClient = (token) => {
    return createClient(supabaseUrl, supabaseServiceKey, {
        global: {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    });
};

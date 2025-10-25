import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'User' | 'Moderator';
  avatar?: string;
  phone?: string;
  gender?: string;
  dob?: string;
  address?: string;
  domicile?: string;
  education?: {
    college?: string;
    degree?: string;
    course?: string;
    year?: string;
    grade?: string;
  };
  skills?: string[];
  projects?: string[];
  experience?: {
    domain?: string;
    subDomain?: string;
    years?: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface NewUserProfile {
  name: string;
  email: string;
  role: 'Admin' | 'User' | 'Moderator';
  avatar?: string;
  phone?: string;
  gender?: string;
  dob?: string;
  address?: string;
  domicile?: string;
  education?: {
    college?: string;
    degree?: string;
    course?: string;
    year?: string;
    grade?: string;
  };
  skills?: string[];
  projects?: string[];
  experience?: {
    domain?: string;
    subDomain?: string;
    years?: string;
  };
}

export const userService = {
  async getAllUsers(): Promise<UserProfile[]> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      return data || [];
    } catch (error) {
      console.error('Failed to fetch users:', error);
      // Return mock data for demo purposes when Supabase is not configured
      return [
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'Admin' as const,
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'User' as const,
          created_at: new Date().toISOString(),
        }
      ];
    }
  },

  async getUserById(id: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async createUser(user: NewUserProfile): Promise<UserProfile> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert([user])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to create user:', error);
      // Return mock created user for demo
      return {
        id: Date.now().toString(),
        ...user,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
  },

  async updateUser(id: string, updates: Partial<NewUserProfile>): Promise<UserProfile> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  },

  async deleteUser(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw error;
    }
  }
};

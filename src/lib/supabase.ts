import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
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
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([user])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateUser(id: string, updates: Partial<NewUserProfile>): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteUser(id: string): Promise<void> {
    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

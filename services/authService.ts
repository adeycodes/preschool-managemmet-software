
import { createClient } from '@supabase/supabase-js';
import { User } from '../types';

// ==========================================
// 🔴 SUPABASE KEYS 🔴
// ==========================================
// Using the keys provided in your file
const SUPABASE_URL = 'https://hblypgjnzkuxnoqvptws.supabase.co'; 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhibHlwZ2puemt1eG5vcXZwdHdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU0NDY0NTcsImV4cCI6MjA4MTAyMjQ1N30._oENzEoCbnn3gxbgFyw3a30rP3_H3JhE7OdX6oV5Rf4';

// Initialize Client
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const mapSupabaseUser = (u: any): User => {
  return {
    id: u.id,
    email: u.email || '',
    name: u.user_metadata?.name || 'Teacher',
    username: u.user_metadata?.username || u.email?.split('@')[0],
    role: u.user_metadata?.role || 'teacher'
  };
};

const checkConfig = () => {
  if (SUPABASE_URL.includes('your-project-id') || SUPABASE_KEY.includes('your-anon-key')) {
    throw new Error('Supabase Not Configured. Please open "services/authService.ts" and add your SUPABASE_URL and SUPABASE_KEY.');
  }
};

export const authService = {
  // Login with Email & Password
  login: async (email: string, password: string): Promise<User> => {
    checkConfig();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Supabase Login Error:", error);
      throw new Error(error.message);
    }

    if (data.user) {
      const user = mapSupabaseUser(data.user);
      localStorage.setItem('kinderReport_currentUser', JSON.stringify(user));
      return user;
    }

    throw new Error('Login failed');
  },

  // Signup
  signup: async (name: string, username: string, email: string, password: string): Promise<User> => {
    checkConfig();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          username,
          role: 'teacher'
        }
      }
    });

    if (error) {
      console.error("Supabase Signup Error:", error);
      throw new Error(error.message);
    }

    if (data.user) {
      const user = mapSupabaseUser(data.user);
      localStorage.setItem('kinderReport_currentUser', JSON.stringify(user));
      return user;
    }

    throw new Error('Signup failed');
  },

  // Reset Password
  resetPassword: async (email: string, newPassword?: string): Promise<void> => {
    checkConfig();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });

    if (error) throw new Error(error.message);

    alert("Password reset email sent! Check your inbox.");
  },

  // Login as Guest (Offline Mode)
  loginAsGuest: async (): Promise<User> => {
    const guestUser: User = {
        id: 'guest-user',
        name: 'Guest Teacher',
        username: 'guest',
        email: 'guest@kinderreport.com',
        role: 'teacher'
    };
    localStorage.setItem('kinderReport_currentUser', JSON.stringify(guestUser));
    return guestUser;
  },

  // Logout
  logout: async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('kinderReport_currentUser');
  },

  // Get Current User
  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem('kinderReport_currentUser');
    if (stored) return JSON.parse(stored);
    return null;
  }
};


import { supabase } from './authService';
import { StudentData, AppSettings } from '../types';

/**
 * Database Service
 * Handles syncing data between the app and Supabase (PostgreSQL).
 * 
 * REQUIRED SUPABASE SCHEMA:
 * 
 * 1. Table: students
 *    - id: text (primary key)
 *    - user_id: uuid (references auth.users)
 *    - data: jsonb
 * 
 * 2. Table: settings
 *    - user_id: uuid (primary key, references auth.users)
 *    - data: jsonb
 */

export const db = {
  // --- Students ---

  async fetchStudents(userId: string): Promise<StudentData[]> {
    const { data, error } = await supabase
      .from('students')
      .select('data')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
    return data.map((row: any) => row.data);
  },

  async upsertStudent(userId: string, student: StudentData) {
    // We store the entire student object in the 'data' JSONB column
    const { error } = await supabase
      .from('students')
      .upsert({
        id: student.id,
        user_id: userId,
        data: student,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error saving student:', error);
      throw error;
    }
  },

  async deleteStudent(studentId: string) {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', studentId);

    if (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  },

  // --- Settings ---

  async fetchSettings(userId: string): Promise<AppSettings | null> {
    const { data, error } = await supabase
      .from('settings')
      .select('data')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "Row not found"
      console.error('Error fetching settings:', error);
      throw error;
    }
    
    return data ? data.data : null;
  },

  async saveSettings(userId: string, settings: AppSettings) {
    const { error } = await supabase
      .from('settings')
      .upsert({
        user_id: userId,
        data: settings,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  }
};

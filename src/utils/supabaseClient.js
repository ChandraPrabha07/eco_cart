import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gjhnirwszisttfauwdpn.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqaG5pcndzemlzdHRmYXV3ZHBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NDc3NzEsImV4cCI6MjA2NTMyMzc3MX0.acWWnpS-xVW0YL3wPQj1Qe-2QbmzIWq8pewTBQFL3fU'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

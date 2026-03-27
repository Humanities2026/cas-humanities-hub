import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://jawmpnzvdiznomgfsxza.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imphd21wbnp2ZGl6bm9tZ2ZzeHphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MDU2MTgsImV4cCI6MjA5MDE4MTYxOH0.ZzpEsIzK3RiLtHeeOcWzDvSK2F_s2D8KZJP6W3cpRNU";

export const supabase = createClient(supabaseUrl, supabaseKey);

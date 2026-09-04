import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://usixupqhrniunlxbgyem.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzaXh1cHFocm5pdW5seGJneWVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ5ODg2NTIsImV4cCI6MjEwMDU2NDY1Mn0.KexMaytTkm8Dr5FwiJ41uXAvOliU82gI0rw9cIWtLKo";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
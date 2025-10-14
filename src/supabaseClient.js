import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nnmwtggmqpytnanwqdri.supabase.co"; // ✅ correct project URL
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ubXd0Z2dtcXB5dG5hbndxZHJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NDMyODAsImV4cCI6MjA3NjAxOTI4MH0.XPPv_Tmaqg8LFb7PqQAmrtRTW7KCVxRnGdIv6ToIkrY"; // ✅ your anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

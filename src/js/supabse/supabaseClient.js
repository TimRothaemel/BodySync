console.log("Supabase client initialized");

import { createClient } from 'https://esm.sh/@supabase/supabase-js';

const supabase = createClient(
  "https://rptmuyzeiupavmuscrqs.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwdG11eXplaXVwYXZtdXNjcnFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0OTAzNzcsImV4cCI6MjA3NjA2NjM3N30.8j6FajKlzwmj2RJ_EKV8ElCKVwTXoAChWEx2wuFGt0s"
);

export default supabase;

console.log("Supabase client exported");
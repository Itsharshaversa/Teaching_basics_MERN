import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qwrwfqsafokimqtguahs.supabase.co";
const supabaseKey = "sb_publishable_u-hCeScMuN-xNSgUsiNbsA_O9eFSxBn";
export const supabase = createClient(supabaseUrl, supabaseKey);
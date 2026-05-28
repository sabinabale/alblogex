import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/supabase";

// Uses the service role key — bypasses RLS. Server-only: never import in client components.
export const createAdminClient = () => {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
};

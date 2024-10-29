import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/supabase";

let clientInstance: ReturnType<
  typeof createClientComponentClient<Database>
> | null = null;

export const createClient = () => {
  if (!clientInstance) {
    clientInstance = createClientComponentClient<Database>();
  }
  return clientInstance;
};

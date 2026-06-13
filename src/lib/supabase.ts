import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function readEnv(names: string[]) {
  return names.map((name) => process.env[name]).find(Boolean);
}

function createLazySupabaseClient(keyNames: string[]): SupabaseClient {
  let client: SupabaseClient | null = null;

  return new Proxy({} as SupabaseClient, {
    get(_target, prop) {
      if (!client) {
        const supabaseUrl = readEnv(["SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_URL"]);
        const supabaseKey = readEnv(keyNames);

        if (!supabaseUrl) {
          throw new Error("Supabase URL is required. Set SUPABASE_URL in your environment.");
        }

        if (!supabaseKey) {
          throw new Error(`Supabase key is required. Set one of: ${keyNames.join(", ")}.`);
        }

        client = createClient(supabaseUrl, supabaseKey);
      }

      const value = Reflect.get(client, prop);
      return typeof value === "function" ? value.bind(client) : value;
    },
  });
}

export const supabase = createLazySupabaseClient([
  "SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_PUBLISHABLE_KEY",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
]);

export const supabaseAdmin = createLazySupabaseClient([
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_SECRET_KEY",
]);

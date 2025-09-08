import { supabaseAdmin } from "../../lib/supabaseServer";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    // Check if we have the required environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing Supabase environment variables");
      return res.status(500).json({ 
        error: "Server configuration error",
        details: "Missing Supabase environment variables"
      });
    }

    // Fetch gallery items from Supabase without authentication check
    // Return all published items for the public gallery
    const { data, error } = await supabaseAdmin()
      .from("media_asset")
      .select("*")
      .eq("published", true) // Only fetch published items
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error fetching gallery items:", error);
      return res.status(500).json({ 
        error: "Database error",
        details: error.message 
      });
    }

    console.log(`Gallery API: Found ${data?.length || 0} published items`);
    
    // Return the gallery items
    res.json(data || []);
  } catch (error) {
    console.error("Unexpected error in gallery API:", error);
    res.status(500).json({ 
      error: "Failed to load gallery items",
      details: error.message 
    });
  }
}

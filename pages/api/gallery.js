import { supabaseAdmin } from "../../lib/supabaseServer";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    // Fetch gallery items from Supabase without authentication check
    // Return all published items for the public gallery
    const { data, error } = await supabaseAdmin()
      .from("media_asset")
      .select("*")
      .eq("published", true) // Only fetch published items
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching gallery items:", error);
      throw error;
    }

    // Return the gallery items
    res.json(data || []);
  } catch (error) {
    console.error("Error in gallery API:", error);
    res.status(500).json({ error: "Failed to load gallery items" });
  }
}

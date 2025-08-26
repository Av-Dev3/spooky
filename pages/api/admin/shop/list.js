import { supabaseAdmin } from "../../../../lib/supabaseServer";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  // Check authentication directly in the route
  const cookie = req.cookies.admin_auth;
  if (!cookie || cookie !== "ok") {
    return res.status(401).json({ error: "Not authorized" });
  }

  try {
    console.log("Fetching shop items from shop_items table...");
    
    const { data, error } = await supabaseAdmin()
      .from("shop_items")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase select error:", error);
      throw error;
    }
    
    console.log(`Successfully fetched ${data.length} shop items`);
    res.json(data);
  } catch (error) {
    console.error("Error fetching shop items:", error);
    res.status(500).json({ 
      error: "Failed to fetch shop items",
      details: error.message 
    });
  }
}

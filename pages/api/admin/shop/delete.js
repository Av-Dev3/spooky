import { supabaseAdmin } from "../../../../lib/supabaseServer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  // Check authentication directly in the route
  const cookie = req.cookies.admin_auth;
  if (!cookie || cookie !== "ok") {
    return res.status(401).json({ error: "Not authorized" });
  }

  const { id } = req.body;
  console.log("Received shop delete request for ID:", id);
  
  if (!id) {
    console.log("Missing required field: id");
    return res.status(400).json({ error: "Missing required field: id" });
  }

  try {
    console.log("Attempting to delete from shop_items table...");
    
    const { data, error } = await supabaseAdmin()
      .from("shop_items")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase delete error:", error);
      throw error;
    }
    
    console.log("Successfully deleted shop item:", data);
    res.json({ success: true, deletedItem: data });
  } catch (error) {
    console.error("Error deleting shop item:", error);
    res.status(500).json({ 
      error: "Failed to delete shop item",
      details: error.message 
    });
  }
}

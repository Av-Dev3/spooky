import { supabaseAdmin } from "../../../../lib/supabaseServer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  // Check authentication directly in the route
  const cookie = req.cookies.admin_auth;
  if (!cookie || cookie !== "ok") {
    return res.status(401).json({ error: "Not authorized" });
  }

  const { title, price, description, imageUrl, tags, processorUrl } = req.body;
  console.log("Received shop commit request:", { title, price, description, imageUrl, tags, processorUrl });
  
  if (!title || !price || !imageUrl || !processorUrl) {
    console.log("Missing required fields:", { title, price, imageUrl, processorUrl });
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    console.log("Attempting to insert into shop_items table...");
    const insertData = {
      title,
      price: parseFloat(price),
      description: description || "",
      image_url: imageUrl,
      tags: tags || [],
      processor_url: processorUrl
    };
    console.log("Insert data:", insertData);
    
    console.log("About to call Supabase with table: shop_items");
    const { data, error } = await supabaseAdmin()
      .from("shop_items")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      throw error;
    }
    
    console.log("Successfully inserted shop item:", data);
    res.json(data);
  } catch (error) {
    console.error("Error committing shop item:", error);
    res.status(500).json({ 
      error: "Failed to commit shop item",
      details: error.message 
    });
  }
}

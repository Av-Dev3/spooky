import { supabaseAdmin } from "../../../../lib/supabaseServer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  // Check authentication directly in the route
  const cookie = req.cookies.admin_auth;
  if (!cookie || cookie !== "ok") {
    return res.status(401).json({ error: "Not authorized" });
  }

  const { title, description, imageUrl, locked } = req.body;
  console.log("Received commit request:", { title, description, imageUrl, locked });
  
  if (!title || !imageUrl) {
    console.log("Missing required fields:", { title, imageUrl });
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    console.log("Attempting to insert into media_asset table...");
    const insertData = {
      storage_path: imageUrl,
      title,
      description: description || "",
      tags: [],
      content_type: "image/jpeg",
      kind: 'image',
      locked: locked || false
    };
    
    console.log("Insert data:", insertData);
    
    console.log("About to call Supabase with table: media_asset");
    const { data, error } = await supabaseAdmin()
      .from("media_asset")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      throw error;
    }
    
    console.log("Successfully inserted media asset:", data);
    res.json(data);
  } catch (error) {
    console.error("Error committing media:", error);
    res.status(500).json({ 
      error: "Failed to commit media",
      details: error.message 
    });
  }
}

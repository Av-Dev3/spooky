import { supabaseAdmin } from "../../../../lib/supabaseServer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  // Check authentication directly in the route
  const cookie = req.cookies.admin_auth;
  if (!cookie || cookie !== "ok") {
    return res.status(401).json({ error: "Not authorized" });
  }

  const { storagePath, title, description, tags, contentType, type, price, processorUrl } = req.body;
  console.log("Received commit request:", { storagePath, title, description, tags, contentType, type, price, processorUrl });
  
  if (!storagePath || !title) {
    console.log("Missing required fields:", { storagePath, title });
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    console.log("Attempting to insert into media_asset table...");
    const insertData = {
      storage_path: storagePath,
      title,
      description: description || "",
      tags: tags || [],
      content_type: contentType || "unknown",
      kind: 'image'
    };
    
    // For shop items, add additional data to tags or description
    if (type === 'shop') {
      const shopData = {
        price: price,
        processorUrl: processorUrl,
        type: 'shop'
      };
      // Store shop data as JSON in the description field
      insertData.description = JSON.stringify(shopData);
    }
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

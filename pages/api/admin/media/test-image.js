import { supabaseAdmin } from "../../../../lib/supabaseServer";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  // Check authentication directly in the route
  const cookie = req.cookies.admin_auth;
  if (!cookie || cookie !== "ok") {
    return res.status(401).json({ error: "Not authorized" });
  }

  const { filename } = req.query;
  if (!filename) return res.status(400).json({ error: "Missing filename" });

  try {
    console.log("Testing image access for:", filename);
    
    // Try to get the public URL
    const { data: publicUrlData } = supabaseAdmin().storage
      .from("media")
      .getPublicUrl(filename);
    
    console.log("Public URL data:", publicUrlData);
    
    // Also try to list files to see what's in the bucket
    const { data: listData, error: listError } = await supabaseAdmin().storage
      .from("media")
      .list("", {
        limit: 10,
        offset: 0
      });
    
    if (listError) {
      console.error("Error listing files:", listError);
    } else {
      console.log("Files in bucket:", listData);
    }
    
    res.json({
      filename,
      publicUrl: publicUrlData?.publicUrl,
      bucketFiles: listData || [],
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL
    });
  } catch (error) {
    console.error("Error testing image:", error);
    res.status(500).json({ 
      error: "Failed to test image",
      details: error.message 
    });
  }
}

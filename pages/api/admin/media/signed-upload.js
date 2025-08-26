import { supabaseAdmin } from "../../../../lib/supabaseServer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  // Check authentication directly in the route
  const cookie = req.cookies.admin_auth;
  if (!cookie || cookie !== "ok") {
    return res.status(401).json({ error: "Not authorized" });
  }

  const { filename, contentType } = req.body;
  if (!filename || !contentType) {
    return res.status(400).json({ error: "Missing filename or content type" });
  }

  try {
    console.log("Creating signed upload URL for filename:", filename);
    console.log("Using bucket: media");
    
    const { data, error } = await supabaseAdmin().storage
      .from("media")
      .createSignedUploadUrl(filename);

    console.log("Supabase response:", { data, error });
    
    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }
    
    if (!data || !data.signedUrl) {
      console.error("No signed URL in response:", data);
      throw new Error("No signed URL received from Supabase");
    }
    
    // Return the data in the expected format
    res.json({
      uploadUrl: data.signedUrl,
      fileId: filename
    });
  } catch (error) {
    console.error("Error creating signed upload URL:", error);
    res.status(500).json({ 
      error: "Failed to create signed upload URL",
      details: error.message 
    });
  }
}

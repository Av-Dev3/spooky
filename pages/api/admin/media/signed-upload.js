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
    // Generate unique filename to avoid conflicts
    const timestamp = Date.now();
    const fileExtension = filename.split('.').pop();
    const baseName = filename.replace(`.${fileExtension}`, '');
    const uniqueFilename = `${baseName}_${timestamp}.${fileExtension}`;
    
    console.log("Original filename:", filename);
    console.log("Unique filename:", uniqueFilename);
    console.log("Using bucket: media");
    
    const { data, error } = await supabaseAdmin().storage
      .from("media")
      .createSignedUploadUrl(uniqueFilename);

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
      fileId: uniqueFilename
    });
  } catch (error) {
    console.error("Error creating signed upload URL:", error);
    res.status(500).json({ 
      error: "Failed to create signed upload URL",
      details: error.message 
    });
  }
}

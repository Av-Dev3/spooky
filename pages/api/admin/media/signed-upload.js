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
    const { data, error } = await supabaseAdmin().storage
      .from("media")
      .createSignedUploadUrl(filename);

    if (error) throw error;
    
    // Log the actual response structure
    console.log("Supabase response:", { data, error });
    
    // Return the data in the expected format
    res.json({
      uploadUrl: data.signedUrl,
      fileId: filename
    });
  } catch (error) {
    console.error("Error creating signed upload URL:", error);
    res.status(500).json({ error: "Failed to create signed upload URL" });
  }
}

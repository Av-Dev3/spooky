import { supabaseAdmin } from "../../../../lib/supabaseServer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  // Check authentication directly in the route
  const cookie = req.cookies.admin_auth;
  if (!cookie || cookie !== "ok") {
    return res.status(401).json({ error: "Not authorized" });
  }

  const { storagePath, title, description, tags, contentType } = req.body;
  if (!storagePath || !title) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const { data, error } = await supabaseAdmin()
      .from("media_asset")
      .insert({
        storage_path: storagePath,
        title,
        description: description || "",
        tags: tags || [],
        content_type: contentType || "unknown"
      })
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error("Error committing media:", error);
    res.status(500).json({ error: "Failed to commit media" });
  }
}

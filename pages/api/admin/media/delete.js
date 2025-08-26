import { supabaseAdmin } from "../../../../lib/supabaseServer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  // Check authentication directly in the route
  const cookie = req.cookies.admin_auth;
  if (!cookie || cookie !== "ok") {
    return res.status(401).json({ error: "Not authorized" });
  }

  const { id } = req.body;
  if (!id) return res.status(400).json({ error: "Missing media ID" });

  try {
    const { error } = await supabaseAdmin()
      .from("media_asset")
      .delete()
      .eq("id", id);

    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting media:", error);
    res.status(500).json({ error: "Failed to delete media" });
  }
}

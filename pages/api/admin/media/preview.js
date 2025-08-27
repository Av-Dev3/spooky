import { supabaseAdmin } from "../../../../lib/supabaseServer";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  // Check authentication directly in the route
  const cookie = req.cookies.admin_auth;
  if (!cookie || cookie !== "ok") {
    return res.status(401).json({ error: "Not authorized" });
  }

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "Missing media ID" });

  try {
    const { data, error } = await supabaseAdmin()
      .from("media_asset")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    
    // Also try to get the public URL from storage
    const { data: publicUrlData } = supabaseAdmin().storage
      .from("media")
      .getPublicUrl(id);
    
    res.json({
      ...data,
      publicUrl: publicUrlData?.publicUrl
    });
  } catch (error) {
    console.error("Error getting media preview:", error);
    res.status(500).json({ error: "Failed to get media preview" });
  }
}

import { supabaseAdmin } from "../../../../lib/supabaseServer";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  if (!isAuthed(req)) return res.status(401).json({ error: "Not authorized" });

  const supa = supabaseAdmin();
  const { data, error } = await supa
    .from("media_asset")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return res.status(400).json({ error: error.message });

  res.json({ items: data });
}

function isAuthed(req) {
  return (req.cookies && req.cookies.admin_auth === "ok") ||
         (req.headers.cookie || "").includes("admin_auth=ok");
}

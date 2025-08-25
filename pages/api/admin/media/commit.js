import { supabaseAdmin } from "../../../../lib/supabaseServer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  if (!isAuthed(req)) return res.status(401).json({ error: "Not authorized" });

  const { title, tags = [], kind, storagePath, published = true } = req.body || {};
  if (!kind || !storagePath) return res.status(400).json({ error: "kind and storagePath required" });

  const supa = supabaseAdmin();
  const { error } = await supa.from("media_asset").insert({
    title, tags, kind, storage_path: storagePath, published
  });
  if (error) return res.status(400).json({ error: error.message });
  res.json({ ok: true });
}

function isAuthed(req) {
  return (req.cookies && req.cookies.admin_auth === "ok") ||
         (req.headers.cookie || "").includes("admin_auth=ok");
}

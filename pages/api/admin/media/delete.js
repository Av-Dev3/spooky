import { supabaseAdmin } from "../../../../lib/supabaseServer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  if (!isAuthed(req)) return res.status(401).json({ error: "Not authorized" });

  const { id } = req.body || {};
  if (!id) return res.status(400).json({ error: "id required" });

  const supa = supabaseAdmin();

  const { data: row, error: findErr } = await supa
    .from("media_asset").select("storage_path").eq("id", id).single();
  if (findErr) return res.status(400).json({ error: findErr.message });

  const { error: delObjErr } = await supa.storage.from("media").remove([row.storage_path]);
  if (delObjErr) return res.status(400).json({ error: delObjErr.message });

  const { error: delRowErr } = await supa.from("media_asset").delete().eq("id", id);
  if (delRowErr) return res.status(400).json({ error: delRowErr.message });

  res.json({ ok: true });
}

function isAuthed(req) {
  return (req.cookies && req.cookies.admin_auth === "ok") ||
         (req.headers.cookie || "").includes("admin_auth=ok");
}

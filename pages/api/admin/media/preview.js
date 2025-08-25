import { supabaseAdmin } from "../../../../lib/supabaseServer";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  if (!isAuthed(req)) return res.status(401).json({ error: "Not authorized" });

  const path = req.query.path;
  if (!path) return res.status(400).json({ error: "path required" });

  const supa = supabaseAdmin();
  const { data, error } = await supa.storage.from("media").createSignedUrl(path, 60 * 60);
  if (error) return res.status(400).json({ error: error.message });

  res.writeHead(302, { Location: data.signedUrl }).end();
}

function isAuthed(req) {
  return (req.cookies && req.cookies.admin_auth === "ok") ||
         (req.headers.cookie || "").includes("admin_auth=ok");
}

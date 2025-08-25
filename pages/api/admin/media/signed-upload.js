import { supabaseAdmin } from "../../../../lib/supabaseServer";
import { randomUUID } from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  if (!isAuthed(req)) return res.status(401).json({ error: "Not authorized" });

  const { contentType } = req.body || {};
  if (!contentType) return res.status(400).json({ error: "contentType required" });

  const folder = contentType.startsWith("video/") ? "videos" : "images";
  const ext = (contentType.split("/")[1] || "bin").toLowerCase();
  const storagePath = `${folder}/${randomUUID()}.${ext}`;

  const supa = supabaseAdmin();
  const { data, error } = await supa.storage.from("media").createSignedUploadUrl(storagePath);
  if (error) return res.status(400).json({ error: error.message });

  res.json({ uploadUrl: data.signedUrl, storagePath });
}

function isAuthed(req) {
  return (req.cookies && req.cookies.admin_auth === "ok") ||
         (req.headers.cookie || "").includes("admin_auth=ok");
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  // Accept JSON or form POST
  let pw = req.body?.password;
  if (!pw) pw = await readFormPassword(req);

  const next = (req.query?.next && decodeURIComponent(req.query.next)) || "/admin/panel.html";

  if (pw !== process.env.ADMIN_PASSWORD) {
    return res.writeHead(302, { Location: "/management/login.html?error=1" }).end();
  }

  const isProd = process.env.NODE_ENV === "production";
  const cookie = [
    `admin_auth=ok`,
    `HttpOnly`,
    `Path=/`,
    `SameSite=Lax`,
    `Max-Age=${60 * 60 * 8}`, // 8h
    isProd ? `Secure` : ``,
  ].filter(Boolean).join("; ");

  res.setHeader("Set-Cookie", cookie);
  res.writeHead(302, { Location: next }).end();
}

async function readFormPassword(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const body = Buffer.concat(chunks).toString("utf8");
  const m = body.match(/(?:^|&)password=([^&]*)/);
  return m ? decodeURIComponent(m[1].replace(/\+/g, " ")) : "";
}

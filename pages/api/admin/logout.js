export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  res.setHeader("Set-Cookie", "admin_auth=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax");
  res.writeHead(302, { Location: "/management/login.html" }).end();
}

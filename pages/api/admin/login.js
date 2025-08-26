export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Get password from request body (Next.js parses this automatically)
  const { password } = req.body;
  
  // Debug logging
  console.log("Received password:", password);
  console.log("Expected password:", process.env.ADMIN_PASSWORD);
  console.log("Password match:", password === process.env.ADMIN_PASSWORD);
  
  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }

  const next = (req.query?.next && decodeURIComponent(req.query.next)) || "/management/panel.html";

  if (password !== process.env.ADMIN_PASSWORD) {
    console.log("Password mismatch - returning error");
    return res.status(401).json({ error: "Invalid password", redirect: "/management/login.html?error=1" });
  }

  console.log("Password correct - setting cookie and returning success");
  
  // Set cookie without HttpOnly so JavaScript can read it
  res.setHeader('Set-Cookie', [
    'admin_auth=ok; Path=/; SameSite=Lax; Max-Age=28800'
  ]);
  
  return res.status(200).json({ 
    success: true, 
    redirect: next,
    message: "Login successful"
  });
}

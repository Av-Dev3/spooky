export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  // Check authentication directly in the route
  const cookie = req.cookies.admin_auth;
  if (!cookie || cookie !== "ok") {
    return res.status(401).json({ error: "Not authorized" });
  }

  try {
    // Return configuration that the client needs
    res.json({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co',
      storageBucket: 'media'  // Changed from 'uploads' to 'media' to match signed-upload API
    });
  } catch (error) {
    console.error("Error getting config:", error);
    res.status(500).json({ 
      error: "Failed to get configuration",
      details: error.message 
    });
  }
}

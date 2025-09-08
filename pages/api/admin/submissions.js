import { supabaseAdmin } from "../../../lib/supabaseServer";

export default async function handler(req, res) {
  // Check authentication directly in the route
  const cookie = req.cookies.admin_auth;
  if (!cookie || cookie !== "ok") {
    return res.status(401).json({ error: "Not authorized" });
  }

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabaseAdmin()
        .from("customs_submissions")
        .select("*")
        .order("timestamp", { ascending: false });

      if (error) {
        console.error("Supabase error fetching submissions:", error);
        return res.status(500).json({ 
          error: "Database error",
          details: error.message 
        });
      }

      res.status(200).json({ 
        success: true, 
        submissions: data || [] 
      });

    } catch (error) {
      console.error('Unexpected error reading submissions:', error);
      res.status(500).json({ 
        error: 'Failed to read submissions',
        message: error.message 
      });
    }
  } 
  
  else if (req.method === 'PATCH') {
    // Update submission status
    try {
      const { id, status } = req.body;
      
      if (!id || !status) {
        return res.status(400).json({ error: 'ID and status are required' });
      }

      const { data, error } = await supabaseAdmin()
        .from("customs_submissions")
        .update({ 
          status: status,
          updated_at: new Date().toISOString()
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Supabase error updating submission:", error);
        return res.status(500).json({ 
          error: "Database error",
          details: error.message 
        });
      }

      if (!data) {
        return res.status(404).json({ error: 'Submission not found' });
      }
      
      res.status(200).json({ 
        success: true, 
        message: 'Submission updated successfully' 
      });

    } catch (error) {
      console.error('Unexpected error updating submission:', error);
      res.status(500).json({ 
        error: 'Failed to update submission',
        message: error.message 
      });
    }
  }
  
  else if (req.method === 'DELETE') {
    // Delete submission
    try {
      const { id } = req.body;
      
      if (!id) {
        return res.status(400).json({ error: 'ID is required' });
      }

      const { data, error } = await supabaseAdmin()
        .from("customs_submissions")
        .delete()
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Supabase error deleting submission:", error);
        return res.status(500).json({ 
          error: "Database error",
          details: error.message 
        });
      }

      if (!data) {
        return res.status(404).json({ error: 'Submission not found' });
      }
      
      res.status(200).json({ 
        success: true, 
        message: 'Submission deleted successfully' 
      });

    } catch (error) {
      console.error('Unexpected error deleting submission:', error);
      res.status(500).json({ 
        error: 'Failed to delete submission',
        message: error.message 
      });
    }
  }
  
  else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

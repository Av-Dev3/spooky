import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Check if user is authenticated (simple cookie check)
  const cookies = req.headers.cookie || '';
  const adminAuth = cookies.split(';').find(cookie => 
    cookie.trim().startsWith('admin_auth=')
  );
  
  if (!adminAuth || adminAuth.split('=')[1] !== 'ok') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const submissionsFile = path.join(process.cwd(), 'data', 'submissions.json');
      
      try {
        const data = await fs.readFile(submissionsFile, 'utf8');
        const submissions = JSON.parse(data);
        
        res.status(200).json({ 
          success: true, 
          submissions: submissions 
        });
      } catch (error) {
        // File doesn't exist yet
        res.status(200).json({ 
          success: true, 
          submissions: [] 
        });
      }

    } catch (error) {
      console.error('Error reading submissions:', error);
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

      const submissionsFile = path.join(process.cwd(), 'data', 'submissions.json');
      const data = await fs.readFile(submissionsFile, 'utf8');
      let submissions = JSON.parse(data);
      
      // Find and update the submission
      const submissionIndex = submissions.findIndex(sub => sub.id === id);
      if (submissionIndex === -1) {
        return res.status(404).json({ error: 'Submission not found' });
      }
      
      submissions[submissionIndex].status = status;
      submissions[submissionIndex].updatedAt = new Date().toISOString();
      
      // Write back to file
      await fs.writeFile(submissionsFile, JSON.stringify(submissions, null, 2));
      
      res.status(200).json({ 
        success: true, 
        message: 'Submission updated successfully' 
      });

    } catch (error) {
      console.error('Error updating submission:', error);
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

      const submissionsFile = path.join(process.cwd(), 'data', 'submissions.json');
      const data = await fs.readFile(submissionsFile, 'utf8');
      let submissions = JSON.parse(data);
      
      // Filter out the submission to delete
      const originalLength = submissions.length;
      submissions = submissions.filter(sub => sub.id !== id);
      
      if (submissions.length === originalLength) {
        return res.status(404).json({ error: 'Submission not found' });
      }
      
      // Write back to file
      await fs.writeFile(submissionsFile, JSON.stringify(submissions, null, 2));
      
      res.status(200).json({ 
        success: true, 
        message: 'Submission deleted successfully' 
      });

    } catch (error) {
      console.error('Error deleting submission:', error);
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

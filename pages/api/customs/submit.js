import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const submissionData = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...req.body,
      status: 'new'
    };

    // Ensure the data directory exists
    const dataDir = path.join(process.cwd(), 'data');
    try {
      await fs.access(dataDir);
    } catch {
      await fs.mkdir(dataDir, { recursive: true });
    }

    // Read existing submissions
    const submissionsFile = path.join(dataDir, 'submissions.json');
    let submissions = [];
    
    try {
      const data = await fs.readFile(submissionsFile, 'utf8');
      submissions = JSON.parse(data);
    } catch (error) {
      // File doesn't exist yet, start with empty array
      submissions = [];
    }

    // Add new submission
    submissions.unshift(submissionData); // Add to beginning for newest first

    // Write back to file
    await fs.writeFile(submissionsFile, JSON.stringify(submissions, null, 2));

    res.status(200).json({ 
      success: true, 
      message: 'Submission saved successfully',
      id: submissionData.id
    });

  } catch (error) {
    console.error('Error saving submission:', error);
    res.status(500).json({ 
      error: 'Failed to save submission',
      message: error.message 
    });
  }
}

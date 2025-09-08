import { supabaseAdmin } from "../../../lib/supabaseServer";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if we have the required environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing Supabase environment variables");
      return res.status(500).json({ 
        error: "Server configuration error",
        details: "Missing Supabase environment variables"
      });
    }

    const submissionData = {
      timestamp: new Date().toISOString(),
      platform: req.body.platform,
      handle: req.body.handle,
      onlyfans_username: req.body.onlyfansUsername,
      email: req.body.email,
      request_type: req.body.requestType,
      dick_rate_prices: req.body.dickRatePrices,
      nude_pictures: req.body.nudePictures,
      nude_videos: req.body.nudeVideos,
      extras: req.body.extras,
      details: req.body.details,
      age_confirm: req.body.ageConfirm,
      status: 'new'
    };

    // Insert submission into Supabase
    const { data, error } = await supabaseAdmin()
      .from("customs_submissions")
      .insert(submissionData)
      .select()
      .single();

    if (error) {
      console.error("Supabase error saving submission:", error);
      return res.status(500).json({ 
        error: "Database error",
        details: error.message 
      });
    }

    console.log("Customs submission saved successfully:", data.id);

    res.status(200).json({ 
      success: true, 
      message: 'Submission saved successfully',
      id: data.id
    });

  } catch (error) {
    console.error('Unexpected error saving submission:', error);
    res.status(500).json({ 
      error: 'Failed to save submission',
      message: error.message 
    });
  }
}

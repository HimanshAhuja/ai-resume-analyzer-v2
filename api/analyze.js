module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { field, resumeText } = req.body;

    if (!field) {
      return res.status(400).json({ error: 'Field is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error('GEMINI_API_KEY not found');
      return res.status(500).json({ error: 'API key not configured' });
    }

    const fieldNames = {
      'software': 'Software Engineering',
      'data': 'Data Science',
      'design': 'UI/UX Design',
      'marketing': 'Digital Marketing',
      'finance': 'Finance',
      'hr': 'Human Resources'
    };

    const fieldName = fieldNames[field] || field;

    const prompt = `You are an expert ATS (Applicant Tracking System) analyzer. Analyze this resume for the ${fieldName} field.

Resume content: ${resumeText || 'Sample resume for ' + fieldName}

Provide:
1. An ATS score out of 100 (be realistic, typically 65-85 for most resumes)
2. Exactly 5 specific, actionable improvements with priority levels (high/medium/low)

Return ONLY valid JSON in this exact format (no markdown, no code blocks, no extra text):
{
  "score": 75,
  "improvements": [
    {
      "title": "improvement title here",
      "description": "detailed explanation here",
      "priority": "high"
    }
  ]
}

Be specific, actionable, and tailored to ${fieldName}.`;

    // Call Gemini REST API directly
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`API responded with ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;

    // Parse JSON from response
    let analysis;
    try {
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysis = JSON.parse(cleanText);
    } catch (parseError) {
      console.error('Failed to parse AI response:', text);
      analysis = {
        score: 75,
        improvements: generateFallbackImprovements(field)
      };
    }

    if (!analysis.score || !analysis.improvements || !Array.isArray(analysis.improvements)) {
      analysis = {
        score: 75,
        improvements: generateFallbackImprovements(field)
      };
    }

    return res.status(200).json(analysis);

  } catch (error) {
    console.error('Error analyzing resume:', error);
    
    return res.status(200).json({
      score: 75,
      improvements: generateFallbackImprovements(req.body.field || 'software')
    });
  }
};

function generateFallbackImprovements(field) {
  const improvements = {
    'software': [
      { title: 'Add Technical Keywords', description: 'Include specific programming languages, frameworks, and technologies relevant to job descriptions.', priority: 'high' },
      { title: 'Quantify Achievements', description: 'Add metrics to your accomplishments to demonstrate measurable impact.', priority: 'high' },
      { title: 'Include Certifications', description: 'Add technical certifications to stand out in automated screenings.', priority: 'medium' },
      { title: 'Format Projects', description: 'Use clear project titles, tech stacks, and bullet points.', priority: 'medium' },
      { title: 'Optimize Skills', description: 'Organize technical skills into categories for better ATS parsing.', priority: 'low' }
    ]
  };
  return improvements[field] || improvements['software'];
}

const pdf = require('pdf-parse');
const mammoth = require('mammoth');

module.exports = async (req, res) => {
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
    const { field, fileName, fileData, fileType } = req.body;

    if (!field || !fileData) {
      return res.status(400).json({ error: 'Field and file data required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error('GEMINI_API_KEY not found');
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Extract text from file
    let resumeText = '';
    try {
      const buffer = Buffer.from(fileData, 'base64');
      
      if (fileType === 'application/pdf') {
        const data = await pdf(buffer);
        resumeText = data.text;
      } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const result = await mammoth.extractRawText({ buffer });
        resumeText = result.value;
      } else if (fileType === 'application/msword') {
        // Basic DOC support (limited)
        resumeText = buffer.toString('utf-8');
      }
    } catch (extractError) {
      console.error('Text extraction error:', extractError);
      resumeText = 'Unable to extract text from resume';
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

    const prompt = `You are an expert ATS (Applicant Tracking System) analyzer. Analyze this ACTUAL resume for the ${fieldName} field.

RESUME CONTENT:
${resumeText}

Based on the ACTUAL content above, provide:
1. An ATS score out of 100 (be realistic and accurate based on the resume content)
2. Exactly 5 specific, actionable improvements with priority levels (high/medium/low)

IMPORTANT: Analyze the ACTUAL resume content provided. If the resume doesn't match the ${fieldName} field at all, give a low score (20-40). If it's perfect for the field, give a high score (85-95).

Return ONLY valid JSON in this exact format (no markdown, no code blocks):
{
  "score": 75,
  "improvements": [
    {
      "title": "specific improvement based on their resume",
      "description": "detailed explanation referencing actual content from their resume",
      "priority": "high"
    }
  ]
}

Be specific and reference actual content from the resume.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
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
      { title: 'Add Technical Keywords', description: 'Include specific programming languages, frameworks, and technologies.', priority: 'high' },
      { title: 'Quantify Achievements', description: 'Add metrics to demonstrate measurable impact.', priority: 'high' },
      { title: 'Include Certifications', description: 'Add technical certifications.', priority: 'medium' },
      { title: 'Format Projects', description: 'Use clear project titles and tech stacks.', priority: 'medium' },
      { title: 'Optimize Skills', description: 'Organize skills into categories.', priority: 'low' }
    ]
  };
  return improvements[field] || improvements['software'];
}

// api/analyze.js - Vercel Serverless Function
const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { field, resumeText } = req.body;

    if (!field) {
      return res.status(400).json({ error: 'Field is required' });
    }

    // Get API key from environment variable
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error('GEMINI_API_KEY not found in environment variables');
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const fieldNames = {
      'software': 'Software Engineering',
      'data': 'Data Science',
      'design': 'UI/UX Design',
      'marketing': 'Digital Marketing',
      'finance': 'Finance',
      'hr': 'Human Resources'
    };

    const fieldName = fieldNames[field] || field;

    // Create the prompt
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

Be specific, actionable, and tailored to ${fieldName}. Focus on ATS optimization, keywords, formatting, and quantifiable achievements.`;

    // Call Gemini API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Try to parse the JSON response
    let analysis;
    try {
      // Remove markdown code blocks if present
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysis = JSON.parse(cleanText);
    } catch (parseError) {
      console.error('Failed to parse AI response:', text);
      // Fallback to structured data
      analysis = {
        score: 75,
        improvements: generateFallbackImprovements(field)
      };
    }

    // Validate the response structure
    if (!analysis.score || !analysis.improvements || !Array.isArray(analysis.improvements)) {
      analysis = {
        score: 75,
        improvements: generateFallbackImprovements(field)
      };
    }

    return res.status(200).json(analysis);

  } catch (error) {
    console.error('Error analyzing resume:', error);
    
    // Return fallback data instead of error
    return res.status(200).json({
      score: 75,
      improvements: generateFallbackImprovements(req.body.field || 'software')
    });
  }
};

function generateFallbackImprovements(field) {
  const improvements = {
    'software': [
      { title: 'Add Technical Keywords', description: 'Include specific programming languages, frameworks, and technologies (e.g., React, Python, AWS) relevant to job descriptions to improve ATS matching.', priority: 'high' },
      { title: 'Quantify Achievements', description: 'Add metrics to your accomplishments (e.g., "Improved API response time by 40%" or "Led team of 5 developers") to demonstrate measurable impact.', priority: 'high' },
      { title: 'Include Certifications Section', description: 'Add a dedicated section for technical certifications (AWS, Azure, Google Cloud) to stand out in automated screenings.', priority: 'medium' },
      { title: 'Format Project Descriptions', description: 'Use clear project titles, tech stacks, and bullet points to describe your contributions and technologies used in each project.', priority: 'medium' },
      { title: 'Optimize Skills Section', description: 'Organize technical skills into categories (Languages, Frameworks, Tools, Databases) for better ATS parsing and readability.', priority: 'low' }
    ],
    'data': [
      { title: 'Highlight Statistical Tools', description: 'Explicitly mention data science tools (Python, R, SQL, TensorFlow, PyTorch) and statistical methods you\'ve used in your work.', priority: 'high' },
      { title: 'Showcase Data Impact', description: 'Quantify your data-driven results (e.g., "Built model with 95% accuracy" or "Analyzed dataset of 10M+ records") to demonstrate real-world value.', priority: 'high' },
      { title: 'Add Visualization Skills', description: 'Include data visualization tools (Tableau, Power BI, matplotlib) and examples of dashboards or reports you\'ve created.', priority: 'medium' },
      { title: 'Include ML/AI Projects', description: 'Detail machine learning projects with clear problem statements, approaches, and measurable outcomes to stand out in technical screenings.', priority: 'medium' },
      { title: 'List Domain Expertise', description: 'Mention specific industry domains (healthcare, finance, e-commerce) where you\'ve applied data science to add context to your experience.', priority: 'low' }
    ],
    'design': [
      { title: 'Add Design Tools', description: 'List all design software proficiency (Figma, Sketch, Adobe XD, Photoshop) as ATS systems specifically scan for these keywords.', priority: 'high' },
      { title: 'Include Portfolio Link', description: 'Add a prominent link to your online portfolio or Behance/Dribbble profile - many design ATSs prioritize candidates with visible portfolios.', priority: 'high' },
      { title: 'Describe Design Process', description: 'Use design-specific terminology (user research, wireframing, prototyping, usability testing) to demonstrate your methodology and process.', priority: 'medium' },
      { title: 'Quantify User Impact', description: 'Add metrics about design outcomes (e.g., "Increased user engagement by 35%" or "Reduced bounce rate by 20%") to show business value.', priority: 'medium' },
      { title: 'Mention Collaboration Tools', description: 'Include tools for cross-functional work (Jira, Miro, Slack, Notion) to show you can work effectively with product and engineering teams.', priority: 'low' }
    ],
    'marketing': [
      { title: 'Add Marketing Platforms', description: 'List specific platforms and tools (Google Ads, Facebook Ads, HubSpot, Mailchimp, SEMrush) to match common ATS keyword searches.', priority: 'high' },
      { title: 'Show Campaign Results', description: 'Quantify marketing impact with concrete metrics (ROI, conversion rates, CTR, lead generation numbers) to demonstrate effectiveness.', priority: 'high' },
      { title: 'Include Analytics Skills', description: 'Highlight data analytics capabilities (Google Analytics, Data Studio, A/B testing) as data-driven marketing is highly valued.', priority: 'medium' },
      { title: 'Detail Channel Expertise', description: 'Specify which marketing channels you excel in (SEO, SEM, Social Media, Email, Content) to match specific job requirements.', priority: 'medium' },
      { title: 'Add Certifications', description: 'Include relevant certifications (Google Ads, HubSpot, Meta Blueprint) in a dedicated section to boost credibility in automated screenings.', priority: 'low' }
    ],
    'finance': [
      { title: 'Include Financial Software', description: 'List specific financial tools and systems (Excel, SAP, Oracle, Bloomberg Terminal, QuickBooks) that are commonly searched by ATS.', priority: 'high' },
      { title: 'Quantify Financial Impact', description: 'Add concrete numbers (budget sizes managed, cost savings achieved, revenue increases) to demonstrate your financial responsibility and success.', priority: 'high' },
      { title: 'Highlight Certifications', description: 'Prominently display finance certifications (CFA, CPA, FRM) as these are often mandatory or preferred requirements in ATS filters.', priority: 'medium' },
      { title: 'Detail Regulatory Knowledge', description: 'Mention specific regulations and compliance frameworks (GAAP, IFRS, SOX) you\'ve worked with to match industry-specific searches.', priority: 'medium' },
      { title: 'Add Analysis Techniques', description: 'Include financial analysis methods (DCF, ratio analysis, variance analysis) and modeling skills to showcase technical competency.', priority: 'low' }
    ],
    'hr': [
      { title: 'List HR Systems', description: 'Include HRIS platforms (Workday, BambooHR, ADP, SAP SuccessFactors) as these are key ATS keywords for HR roles.', priority: 'high' },
      { title: 'Quantify HR Metrics', description: 'Add measurable results (retention rates improved, time-to-hire reduced, employee satisfaction scores) to show your impact on the organization.', priority: 'high' },
      { title: 'Highlight Compliance', description: 'Mention employment laws and regulations (FMLA, ADA, EEO) you\'ve worked with to demonstrate legal knowledge and risk management.', priority: 'medium' },
      { title: 'Detail HR Functions', description: 'Specify areas of expertise (recruitment, onboarding, performance management, L&D, compensation) to match specific HR role requirements.', priority: 'medium' },
      { title: 'Add HR Certifications', description: 'Include professional certifications (SHRM-CP, PHR, CIPD) in a dedicated section as these boost credibility in automated screenings.', priority: 'low' }
    ]
  };

  return improvements[field] || improvements['software'];
}

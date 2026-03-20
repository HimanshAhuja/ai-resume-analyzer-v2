# 🤖 AI Resume Analyzer

An intelligent resume analyzer powered by Google's Gemini 2.5 AI that provides instant ATS (Applicant Tracking System) scores and personalized career improvement suggestions.

## 🌐 Live Demo
**[Try it Live](https://ai-resume-analyzer-v2-nu.vercel.app/)**

---

## ✨ Features

- 📄 **Smart Resume Analysis** - Upload PDF, DOC, or DOCX files for instant AI-powered analysis
- 🎯 **ATS Score Calculation** - Get accurate ATS compatibility scores (0-100) based on actual resume content
- 💼 **Field-Specific Insights** - Tailored suggestions for 6 career fields:
  - Software Engineering
  - Data Science
  - UI/UX Design
  - Digital Marketing
  - Finance
  - Human Resources
- 🔍 **Real Content Analysis** - AI reads and analyzes your actual resume text, not just generic advice
- 📊 **Prioritized Improvements** - Get 5 actionable suggestions ranked by priority (High/Medium/Low)
- 👁️ **File Preview** - Click on uploaded files to preview or download
- 🎨 **Beautiful UI** - Modern dark theme with smooth animations
- ⚡ **Lightning Fast** - Results in 3-5 seconds
- 🆓 **100% Free** - No credit card required, 1,500 analyses per day

---

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Custom properties, animations, gradients
- **JavaScript (ES6+)** - Async/await, Fetch API
- **Google Fonts** - Clash Display, General Sans

### Backend
- **Node.js** - Runtime environment
- **Vercel Serverless Functions** - API endpoints
- **Google Gemini 2.5 Flash API** - AI analysis
- **pdf-parse** - PDF text extraction
- **mammoth** - DOCX text extraction

### Deployment
- **Vercel** - Hosting and CI/CD
- **GitHub** - Version control

## 🔑 API Setup

### Get Your Google Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Select or create a project
5. Copy your API key 
6. Enable the **Generative Language API** at [Google Cloud Console](https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com)

### Add to Vercel (for deployment)

1. Go to your Vercel project → Settings → Environment Variables
2. Add variable:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** Your API key
   - **Environments:** Production, Preview, Development (all checked)
3. Redeploy your project

---

## 📖 How It Works

### 1. **File Upload**
User uploads resume (PDF/DOC/DOCX, max 5MB)

### 2. **Field Selection**
User selects target career field

### 3. **Text Extraction**
- PDFs → `pdf-parse` library
- DOCX → `mammoth` library
- Extract actual resume content

### 4. **AI Analysis**
- Send resume text + field to Google Gemini 2.5 Flash API
- AI analyzes content for relevance, keywords, formatting
- Generates personalized score and improvements

### 5. **Display Results**
- ATS score with animated counter
- 5 prioritized improvement suggestions
- Field-specific, actionable advice

---

## 📂 Project Structure
```
ai-resume-analyzer-v2/
├── api/
│   └── analyze.js          # Serverless function for AI analysis
├── index.html              # Main HTML structure
├── style.css               # Styling and animations
├── script.js               # Frontend logic
├── package.json            # Dependencies
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

---

## 🎯 Key Features Explained

### Real Content Analysis
Unlike generic resume tools, this analyzer:
- ✅ Extracts actual text from your resume
- ✅ Sends real content to AI for analysis
- ✅ Provides personalized suggestions based on YOUR experience
- ✅ Scores accurately based on field relevance

**Example:**
- Software Engineer resume for Software Engineering field: **85-95** (high match)
- Software Engineer resume for Finance field: **20-40** (low match)

### File Preview
- Click on uploaded filename to preview/download
- PDFs open in new tab
- DOC files trigger download

---
## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Himansh Ahuja**

- GitHub: [@HimanshAhuja](https://github.com/HimanshAhuja)
- Project Link: [https://github.com/HimanshAhuja/ai-resume-analyzer-v2](https://github.com/HimanshAhuja/ai-resume-analyzer-v2)
- Live Demo: [https://ai-resume-analyzer-v2-nu.vercel.app/](https://ai-resume-analyzer-v2-nu.vercel.app/)

---

## 🙏 Acknowledgments

- Google Gemini AI for powerful language models
- Vercel for seamless deployment
- pdf-parse and mammoth for document parsing

---

## 📊 Project Stats

- **Built:** March 2026
- **AI Model:** Google Gemini 2.5 Flash
- **Free Tier:** 1,500 analyses/day
- **Response Time:** 3-5 seconds
- **Supported Formats:** PDF, DOC, DOCX
- **Max File Size:** 5MB

---

**⭐ Star this repo if you found it helpful!**

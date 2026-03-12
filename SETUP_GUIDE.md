# 🚀 FREE AI Resume Analyzer Setup Guide

This guide will help you deploy your Resume Analyzer with **FREE Google Gemini AI** in about 15 minutes!

## 📋 What You'll Need
- GitHub account (free)
- Vercel account (free)
- Google account (free)
- About 15 minutes

---

## Step 1: Get Your FREE Google Gemini API Key

1. **Go to Google AI Studio**
   - Visit: **https://aistudio.google.com/app/apikey**
   - Sign in with your Google account

2. **Create API Key**
   - Click **"Create API Key"**
   - Select **"Create API key in new project"** (or use existing project)
   - Copy the API key (starts with `AIza...`)
   - **IMPORTANT**: Save this somewhere safe! You'll need it in Step 4

3. **Note about free tier**
   - ✅ 1,500 requests per day FREE
   - ✅ No credit card required
   - ✅ Never expires
   - This is MORE than enough for a personal project!

---

## Step 2: Upload to GitHub

1. **Create a new repository on GitHub**
   - Go to https://github.com
   - Click the **"+"** icon → **"New repository"**
   - Name it: `resume-analyzer`
   - Make it **Public**
   - Click **"Create repository"**

2. **Upload ALL these files**
   - Click **"uploading an existing file"**
   - Drag and drop these files:
     - `index.html`
     - `style.css`
     - `script.js`
     - `package.json`
     - `vercel.json`
     - `api/analyze.js` (create `api` folder first if needed)
   - Commit the files

**IMPORTANT**: Make sure the folder structure looks like this:
```
resume-analyzer/
├── index.html
├── style.css
├── script.js
├── package.json
├── vercel.json
└── api/
    └── analyze.js
```

---

## Step 3: Deploy to Vercel (FREE Hosting)

1. **Create Vercel account**
   - Go to **https://vercel.com/signup**
   - Click **"Continue with GitHub"**
   - Authorize Vercel to access your GitHub

2. **Import your project**
   - Click **"Add New..."** → **"Project"**
   - Find your `resume-analyzer` repository
   - Click **"Import"**

3. **Configure the project**
   - **Framework Preset**: Leave as "Other"
   - **Root Directory**: Leave as `./`
   - Click **"Deploy"**

4. **Wait for deployment**
   - It will take 1-2 minutes
   - You'll see "Congratulations! 🎉" when done

---

## Step 4: Add Your API Key (CRITICAL!)

This is the most important step - without this, the AI won't work!

1. **Go to your project settings**
   - On Vercel, click on your project
   - Click **"Settings"** tab at the top
   - Click **"Environment Variables"** in the left sidebar

2. **Add the Gemini API key**
   - **Key**: `GEMINI_API_KEY`
   - **Value**: Paste your API key from Step 1 (starts with `AIza...`)
   - **Environment**: Select all (Production, Preview, Development)
   - Click **"Save"**

3. **Redeploy** (Important!)
   - Go to **"Deployments"** tab
   - Click the **three dots** on the latest deployment
   - Click **"Redeploy"**
   - Wait for it to finish

---

## Step 5: Test Your Website! 🎉

1. **Find your URL**
   - Vercel will give you a URL like: `https://resume-analyzer-abc123.vercel.app`
   - Click **"Visit"** or copy the URL

2. **Test the analyzer**
   - Upload a test resume (any PDF/DOC file)
   - Select a field
   - Click **"Analyze Resume with AI"**
   - Wait 3-5 seconds
   - You should see AI-generated results! 🤖

---

## ✅ Troubleshooting

### "API key not configured" error
- Make sure you added `GEMINI_API_KEY` in Vercel settings
- Check spelling (must be exactly `GEMINI_API_KEY`)
- Make sure you redeployed after adding the key

### "Failed to analyze" or timeout
- Check if you've exceeded the free tier (1,500 requests/day)
- Wait a few seconds and try again
- The fallback system will still show results

### Website doesn't load
- Check that all files are uploaded to GitHub
- Make sure folder structure is correct (api/analyze.js)
- Redeploy in Vercel

### Results are not AI-generated
- Verify API key is set correctly in Vercel
- Check browser console for errors (F12 → Console tab)
- Make sure you redeployed after adding environment variables

---

## 🎨 Customization Ideas

Once it's working, you can:
- Change colors in `style.css`
- Add more career fields in `index.html` and `script.js`
- Modify the AI prompt in `api/analyze.js`
- Add actual PDF text extraction
- Add user authentication
- Store analysis history

---

## 💰 Costs

- **GitHub**: FREE forever
- **Vercel**: FREE forever (for personal projects)
- **Google Gemini API**: FREE (1,500 requests/day)

**Total cost: $0** 🎉

---

## 📊 Usage Limits

With the free tier, you can analyze:
- **1,500 resumes per day**
- **45,000 resumes per month**

This is MORE than enough for personal use or a portfolio project!

---

## 🔒 Security Note

Never commit your API key to GitHub! That's why we use Vercel environment variables - they're kept secret and secure.

---

## 🆘 Need Help?

If you get stuck:
1. Check the Vercel deployment logs (Deployments → Click on deployment → View Function Logs)
2. Check browser console (F12 → Console)
3. Make sure all files are uploaded correctly
4. Verify API key is set in Vercel environment variables

---

## 🎉 You're Done!

Your AI Resume Analyzer is now live with real Google Gemini AI, completely FREE!

Share your website URL with friends and add it to your portfolio! 🚀

**Example URL**: `https://your-username-resume-analyzer.vercel.app`

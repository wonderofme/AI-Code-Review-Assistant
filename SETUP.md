# 🚀 Quick Setup Guide

Follow these steps to get your AI Code Review Assistant running in minutes!

## Step 1: Get Your API Keys

### Groq API Key (Required)
1. Go to [console.groq.com](https://console.groq.com)
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key (starts with `gsk_...`)


## Step 2: Install and Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Step 3: Configure the App

### Option A: Environment Variables (Recommended)
Create a `.env` file in the root directory:

```env
VITE_GROQ_API_KEY=gsk_your_groq_api_key_here
```

### Option B: Direct Input
1. Open the app in your browser
2. Enter your Groq API key in the input field
3. Start reviewing code!

## Step 4: Test It Out

Try pasting this sample code:

```javascript
function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}
```

## 🎯 What You'll Get

The AI will provide instant feedback on:
- **Security issues** (SQL injection, XSS, etc.)
- **Performance problems** (inefficient loops, memory leaks)
- **Code quality** (best practices, maintainability)
- **Potential bugs** (edge cases, error handling)

## 🔧 Troubleshooting

### "Please enter your Groq API key"
- Make sure you've entered a valid Groq API key
- Check that the key starts with `gsk_`


### API rate limits
- Groq free tier has generous limits
- If you hit limits, wait a few minutes and try again

## 🚀 Next Steps

- Customize the AI prompt for your specific needs
- Add support for different programming languages
- Integrate with GitHub for automatic PR reviews
- Deploy to production with Vercel or Netlify

Happy coding! 🎉


# AI Code Review Assistant

A lightning-fast AI-powered code review tool built with React and powered by Groq's ultra-fast LLM models. Get instant, professional code reviews with security, performance, and best practice insights.

![AI Code Review Assistant](https://img.shields.io/badge/AI-Powered-blue) ![React](https://img.shields.io/badge/React-18.2.0-blue) ![Groq](https://img.shields.io/badge/Groq-API-green) ![Firebase](https://img.shields.io/badge/Firebase-10.7.1-orange)

## 🚀 Features

- **Lightning-fast AI reviews** using Groq's `llama-3.1-8b-instant` model
- **Real-time streaming** responses for instant feedback
- **Professional code analysis** focusing on security, performance, and best practices
- **Clean, focused interface** for immediate code review
- **Markdown-formatted** AI responses with clear structure
- **Responsive design** with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **AI**: Groq API (llama-3.1-8b-instant)
- **Styling**: Tailwind CSS
- **Markdown**: Marked.js

## 📋 Prerequisites

Before you begin, ensure you have:

1. **Node.js** (v16 or higher)
2. **Groq API Key** - Get your free API key from [console.groq.com](https://console.groq.com)

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd ai-code-review-assistant

# Install dependencies
npm install
```

### 2. Configure Groq API

1. Get your API key from [Groq Console](https://console.groq.com)
2. Either:
   - Replace the `GROQ_API_KEY` constant in `src/App.jsx`, OR
   - Enter it directly in the app's API key input field

### 3. Run the Application

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 🎯 How to Use

1. **Enter your Groq API key** in the input field (or set it in the code)
2. **Paste your code** into the text area - any programming language works
3. **Click "Review Code"** to get instant AI feedback
4. **View the results** in real-time as they stream in
5. **Get instant feedback** - professional AI analysis in seconds

### Example Code to Test

```javascript
function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}
```

## 🔧 Configuration Options

### Groq Model Selection

You can change the AI model in `src/App.jsx`:

```javascript
const GROQ_MODEL = "llama-3.1-8b-instant"; // Fast and free
// Alternative models:
// "llama-3.1-70b-versatile" // More capable but slower
// "mixtral-8x7b-32768" // Good balance
```

### Review Prompt Customization

Modify the `systemPrompt` in the `performGroqReview` function to customize the AI's review style:

```javascript
const systemPrompt = `You are an elite, production-level Senior Software Engineer...`;
```

## 📁 Project Structure

```
ai-code-review-assistant/
├── src/
│   ├── App.jsx          # Main application component
│   └── main.jsx         # React entry point
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
└── README.md           # This file
```

## 🔒 Security Notes

- **API Keys**: Never commit your API keys to version control
- **Firebase Rules**: Configure Firestore security rules for production
- **Environment Variables**: Consider using environment variables for sensitive data

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables for API keys
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports React:
- Netlify
- Firebase Hosting
- AWS Amplify
- Heroku

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Groq](https://groq.com) for providing ultra-fast AI inference
- [Firebase](https://firebase.google.com) for backend services
- [React](https://reactjs.org) and [Vite](https://vitejs.dev) for the frontend framework
- [Tailwind CSS](https://tailwindcss.com) for styling

## 📞 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Make sure your API keys are correctly configured

---

**Happy coding! 🎉**


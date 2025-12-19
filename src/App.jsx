import React, { useState, useEffect } from 'react';

// Groq API configuration
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || ""; // Your Groq API key
const GROQ_MODEL = "llama-3.1-8b-instant";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

function App() {
  const [codeInput, setCodeInput] = useState('');
  const [reviewResult, setReviewResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiKey, setApiKey] = useState(GROQ_API_KEY);
  const [showApiKey, setShowApiKey] = useState(false);

  const performGroqReview = async (code) => {
    if (!apiKey) {
      setError('Please enter your Groq API key');
      return;
    }

    setIsLoading(true);
    setError('');
    setReviewResult('');

    const systemPrompt = `You are an elite, production-level Senior Software Engineer specialized in code review. Your role is to analyze the provided code snippet or GitHub diff.

Instructions:
1. Identify up to 5 critical or high-impact issues related to security, performance, or potential bugs.
2. Provide a brief, actionable suggestion for each issue.
3. If the code is good, provide 1-2 positive comments.
4. Always structure your response in Markdown, using clear headings and bullet points for easy reading.
5. Do NOT include any filler text outside the review structure.

Focus on:
- Security vulnerabilities
- Performance bottlenecks
- Code maintainability
- Best practices
- Potential bugs or edge cases`;

    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Please review this code:\n\n\`\`\`\n${code}\n\`\`\`` }
          ],
          temperature: 0.2,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                fullResponse += content;
                setReviewResult(fullResponse);
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }

      // Review completed successfully

    } catch (error) {
      console.error('Error calling Groq API:', error);
      setError(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (codeInput.trim()) {
      performGroqReview(codeInput.trim());
    }
  };


  const clearAll = () => {
    setCodeInput('');
    setReviewResult('');
    setError('');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-600 via-pink-600 via-blue-600 to-cyan-500 animate-gradient-xy"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
      
      {/* Animated Blobs */}
      <div className="fixed top-0 -left-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="fixed top-0 -right-4 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="fixed -bottom-8 left-20 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <style>{`
        @keyframes gradient-xy {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-xy {
          background-size: 200% 200%;
          animation: gradient-xy 15s ease infinite;
        }
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(168, 85, 247, 0.4);
          }
          50% {
            box-shadow: 0 0 40px rgba(168, 85, 247, 0.8), 0 0 60px rgba(236, 72, 153, 0.4);
          }
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>

      <div className="relative z-10 container mx-auto px-4 py-6 lg:py-12">
        {/* Vibrant Header */}
        <header className="text-center mb-10 lg:mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-400 rounded-3xl shadow-2xl mb-6 transform hover:scale-110 transition-transform duration-300 animate-float animate-pulse-glow">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold mb-4 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-pink-200 drop-shadow-2xl">
              Code Review
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-200 via-blue-200 to-purple-200">
              Assistant
            </span>
          </h1>
          <p className="text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto font-medium mb-8 drop-shadow-lg">
            ⚡ Instant professional code analysis with AI-powered insights
          </p>
          
          {/* Animated Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <span className="px-5 py-2.5 bg-white/20 backdrop-blur-md text-white text-sm font-bold rounded-full border-2 border-white/30 shadow-xl hover:bg-white/30 hover:scale-110 transition-all duration-300 cursor-default">
              🔒 Security Analysis
            </span>
            <span className="px-5 py-2.5 bg-white/20 backdrop-blur-md text-white text-sm font-bold rounded-full border-2 border-white/30 shadow-xl hover:bg-white/30 hover:scale-110 transition-all duration-300 cursor-default">
              ⚡ Performance Review
            </span>
            <span className="px-5 py-2.5 bg-white/20 backdrop-blur-md text-white text-sm font-bold rounded-full border-2 border-white/30 shadow-xl hover:bg-white/30 hover:scale-110 transition-all duration-300 cursor-default">
              ✨ Best Practices
            </span>
            <span className="px-5 py-2.5 bg-white/20 backdrop-blur-md text-white text-sm font-bold rounded-full border-2 border-white/30 shadow-xl hover:bg-white/30 hover:scale-110 transition-all duration-300 cursor-default">
              🚀 Instant Feedback
            </span>
          </div>
        </header>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-white/20 p-6 lg:p-8 transform hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white drop-shadow-lg">Code Input</h2>
              </div>
              
              {/* API Key Input */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-white/90 mb-2 drop-shadow">
                  🔑 API Key
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your API key"
                    className="w-full px-4 py-3.5 bg-white/20 backdrop-blur-md border-2 border-white/30 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-400/50 focus:border-purple-400 transition-all text-white placeholder-white/60 font-medium shadow-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors"
                  >
                    {showApiKey ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-xs text-white/70 mt-2">
                  Get your free API key from{' '}
                  <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200 font-bold underline">
                    console.groq.com
                  </a>
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-white/90 mb-2 drop-shadow">
                    💻 Code to Review
                  </label>
                  <textarea
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    placeholder="// Paste your code here...&#10;&#10;function example() {&#10;  // Your code&#10;}"
                    className="w-full h-72 px-4 py-3 bg-black/30 backdrop-blur-md border-2 border-white/20 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-400/50 focus:border-purple-400 font-mono text-sm text-white placeholder-white/50 resize-none shadow-xl transition-all"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isLoading || !codeInput.trim()}
                    className="flex-1 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-purple-500 hover:via-pink-500 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 active:scale-95"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-3">
                        <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Analyzing Code...</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>🚀 Review Code</span>
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={clearAll}
                    className="px-6 py-4 bg-white/20 backdrop-blur-md border-2 border-white/30 text-white rounded-xl font-bold hover:bg-white/30 hover:border-white/50 transition-all shadow-lg transform hover:scale-105 active:scale-95"
                  >
                    Clear
                  </button>
                </div>
              </form>

              {error && (
                <div className="mt-4 p-4 bg-red-500/20 backdrop-blur-md border-2 border-red-400 rounded-xl">
                  <div className="flex items-center gap-2">
                    <svg className="w-6 h-6 text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-100 font-bold">{error}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-white/20 p-6 lg:p-8 transform hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-green-400 to-cyan-500 rounded-xl">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white drop-shadow-lg">Review Results</h2>
              </div>
              
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-white/30 border-t-cyan-400 rounded-full animate-spin shadow-2xl"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <p className="mt-6 text-white font-bold text-lg drop-shadow">Analyzing your code...</p>
                  <p className="mt-2 text-sm text-white/80">🔍 Checking security • ⚡ Performance • ✨ Best practices</p>
                </div>
              )}

              {reviewResult && (
                <div className="prose prose-invert max-w-none prose-headings:text-white prose-headings:font-bold prose-p:text-white/90 prose-ul:text-white/90 prose-li:text-white/90 prose-strong:text-white prose-code:text-cyan-300 prose-code:bg-black/30 prose-code:px-2 prose-code:py-1 prose-code:rounded-lg prose-code:font-mono prose-a:text-cyan-300 prose-a:no-underline hover:prose-a:underline">
                  <div 
                    className="markdown-content"
                    dangerouslySetInnerHTML={{ 
                      __html: window.marked ? window.marked.parse(reviewResult) : reviewResult 
                    }}
                  />
                </div>
              )}

              {!reviewResult && !isLoading && (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500/30 to-pink-500/30 backdrop-blur-md rounded-full mb-6 border-2 border-white/20 shadow-xl">
                    <svg className="w-10 h-10 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-white font-bold text-lg mb-2 drop-shadow">✨ Ready for Review</p>
                  <p className="text-sm text-white/70">Enter your code and click "Review Code" to get instant professional feedback</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Vibrant Footer */}
        <footer className="text-center mt-12 pt-8 border-t border-white/20">
          <p className="text-white/80 text-sm font-medium">
            Built with <span className="text-white font-bold">React</span> • <span className="text-white font-bold">Vite</span> • <span className="text-white font-bold">Tailwind CSS</span>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;

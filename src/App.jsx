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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-6 lg:py-12">
        {/* Professional Header */}
        <header className="text-center mb-10 lg:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
            Code Review Assistant
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Professional code analysis with instant feedback on security, performance, and best practices
          </p>
          
          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <span className="px-3 py-1 bg-white/80 backdrop-blur-sm text-gray-700 text-sm font-medium rounded-full border border-gray-200 shadow-sm">
              Security Analysis
            </span>
            <span className="px-3 py-1 bg-white/80 backdrop-blur-sm text-gray-700 text-sm font-medium rounded-full border border-gray-200 shadow-sm">
              Performance Review
            </span>
            <span className="px-3 py-1 bg-white/80 backdrop-blur-sm text-gray-700 text-sm font-medium rounded-full border border-gray-200 shadow-sm">
              Best Practices
            </span>
            <span className="px-3 py-1 bg-white/80 backdrop-blur-sm text-gray-700 text-sm font-medium rounded-full border border-gray-200 shadow-sm">
              Instant Feedback
            </span>
          </div>
        </header>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6 lg:p-8">
              <div className="flex items-center gap-2 mb-6">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <h2 className="text-xl font-semibold text-gray-900">Code Input</h2>
              </div>
              
              {/* API Key Input */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  API Key
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your API key"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
                <p className="text-xs text-gray-500 mt-2">
                  Get your API key from{' '}
                  <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-medium underline">
                    console.groq.com
                  </a>
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Code to Review
                  </label>
                  <textarea
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    placeholder="// Paste your code here...&#10;&#10;function example() {&#10;  // Your code&#10;}"
                    className="w-full h-72 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm bg-gray-50/50 resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isLoading || !codeInput.trim()}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Review Code
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={clearAll}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all"
                  >
                    Clear
                  </button>
                </div>
              </form>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-6 lg:p-8">
              <div className="flex items-center gap-2 mb-6">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-xl font-semibold text-gray-900">Review Results</h2>
              </div>
              
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-600 font-medium">Analyzing your code...</p>
                  <p className="mt-1 text-sm text-gray-500">Checking security, performance, and best practices</p>
                </div>
              )}

              {reviewResult && (
                <div className="prose prose-sm max-w-none prose-headings:font-semibold prose-headings:text-gray-900 prose-p:text-gray-700 prose-ul:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900 prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
                  <div 
                    className="markdown-content"
                    dangerouslySetInnerHTML={{ 
                      __html: window.marked ? window.marked.parse(reviewResult) : reviewResult 
                    }}
                  />
                </div>
              )}

              {!reviewResult && !isLoading && (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 font-medium mb-1">Ready for Review</p>
                  <p className="text-sm text-gray-500">Enter your code and click "Review Code" to get professional feedback</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Professional Footer */}
        <footer className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            Built with <span className="text-gray-700 font-medium">React</span> and modern web technologies
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;

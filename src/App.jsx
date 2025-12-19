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
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 lg:py-12 max-w-7xl">
        {/* Clean Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-3xl lg:text-4xl font-semibold text-gray-900 tracking-tight">
              Code Review
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl">
            Get instant, professional code analysis with actionable feedback on security, performance, and best practices.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 lg:p-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Input</h2>
              
              {/* API Key Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your API key"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code
                  </label>
                  <textarea
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    placeholder="// Paste your code here...&#10;&#10;function example() {&#10;  // Your code&#10;}"
                    className="w-full h-64 px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent font-mono text-sm resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isLoading || !codeInput.trim()}
                    className="flex-1 bg-gray-900 text-white py-2.5 px-4 rounded-md font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing...
                      </span>
                    ) : (
                      'Review Code'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={clearAll}
                    className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors text-sm"
                  >
                    Clear
                  </button>
                </div>
              </form>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Output Section */}
          <div>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 lg:p-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Results</h2>
              
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-600 text-sm font-medium">Analyzing code...</p>
                </div>
              )}

              {reviewResult && (
                <div className="prose prose-sm max-w-none prose-headings:font-semibold prose-headings:text-gray-900 prose-p:text-gray-700 prose-ul:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900 prose-code:text-gray-900 prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-a:text-gray-900 prose-a:no-underline hover:prose-a:underline">
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
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-600 font-medium mb-1">Ready for review</p>
                  <p className="text-sm text-gray-500">Enter your code and click "Review Code" to get feedback</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

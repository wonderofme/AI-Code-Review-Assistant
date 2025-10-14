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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI Code Review Assistant
          </h1>
          <p className="text-gray-600">
            Powered by Groq's lightning-fast AI models
          </p>
        </header>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Code Input</h2>
              
              {/* API Key Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Groq API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your Groq API key"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Get your free API key from{' '}
                  <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    console.groq.com
                  </a>
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Paste your code or diff here:
                  </label>
                  <textarea
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    placeholder="// Example: function calculateTotal(items) {&#10;  var total = 0;&#10;  for (var i = 0; i < items.length; i++) {&#10;    total += items[i].price;&#10;  }&#10;  return total;&#10;}"
                    className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={isLoading || !codeInput.trim()}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? 'Reviewing...' : 'Review Code'}
                  </button>
                  <button
                    type="button"
                    onClick={clearAll}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </form>

              {error && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                  {error}
                </div>
              )}
            </div>

          </div>

          {/* Output Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">AI Review Results</h2>
              
              {isLoading && (
                <div className="flex items-center space-x-2 text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span>AI is analyzing your code...</span>
                </div>
              )}

              {reviewResult && (
                <div className="prose max-w-none">
                  <div 
                    className="markdown-content"
                    dangerouslySetInnerHTML={{ 
                      __html: window.marked ? window.marked.parse(reviewResult) : reviewResult 
                    }}
                  />
                </div>
              )}

              {!reviewResult && !isLoading && (
                <div className="text-gray-500 text-center py-8">
                  <p>Enter your code above and click "Review Code" to get AI-powered feedback</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>
            Built with React and powered by{' '}
            <a href="https://groq.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Groq AI
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;

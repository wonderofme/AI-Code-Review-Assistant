#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 AI Code Review Assistant Setup Helper\n');

// Check if .env file exists
const envPath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file...');
  const envContent = `# Groq API Configuration
VITE_GROQ_API_KEY=your_groq_api_key_here
`;
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created! Please update it with your API keys.\n');
} else {
  console.log('✅ .env file already exists\n');
}

// Check if node_modules exists
const nodeModulesPath = path.join(process.cwd(), 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 Installing dependencies...');
  console.log('Run: npm install\n');
} else {
  console.log('✅ Dependencies already installed\n');
}

console.log('🎯 Next Steps:');
console.log('1. Get your Groq API key from: https://console.groq.com');
console.log('2. Update the .env file with your API key');
console.log('3. Run: npm run dev');
console.log('4. Open http://localhost:3000 in your browser\n');

console.log('📚 For detailed setup instructions, see SETUP.md');
console.log('📖 For full documentation, see README.md\n');

console.log('Happy coding! 🎉');
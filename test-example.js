// Test code for the AI Code Review Assistant
// Copy and paste this into the application to see the AI in action!

function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}

// This code has several issues the AI should catch:
// 1. Using 'var' instead of 'const' or 'let'
// 2. No input validation
// 3. Could use more modern array methods
// 4. No error handling

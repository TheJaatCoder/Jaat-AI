/**
 * Main application file for Jaat-AI
 * Initializes the application and connects components
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the storage
  chatStorage.init();
  
  // Initialize the UI
  chatUI.init();
  
  // Initialize the chat AI
  jaatAI.init();
  
  // Log welcome message to console
  console.log('Jaat-AI initialized successfully');
});

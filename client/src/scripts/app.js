/**
 * Main application file for Jaat-AI
 * Initializes the application and connects components
 * Created by Rohit Sangwan
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the storage
  chatStorage.init();
  
  // Initialize the UI
  chatUI.init();
  
  // Initialize the chat AI
  jaatAI.init();
  
  // Log welcome message to console
  console.log('Jaat-AI by Rohit Sangwan initialized successfully');
});

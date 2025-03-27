/**
 * Main application file for Jaat-AI
 * Initializes the application and connects components
 * Created by Rohit Sangwan
 */

// Import dependencies
import storage from './storage.js';
import jaatAI from './chat.js';
import ui from './ui.js';

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize components
  ui.init(jaatAI);
  jaatAI.init(storage, ui);
  
  // Update conversation list
  ui.updateConversationList();
  
  console.log('Jaat-AI initialized successfully!');
});
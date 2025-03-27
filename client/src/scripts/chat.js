/**
 * Chat functionality for the Jaat-AI application
 * Handles the core chat logic, message processing, and AI responses
 */
class JaatAI {
  constructor() {
    this.isGenerating = false;
    this.currentConversationId = null;
    this.welcomeMessage = "Hello! I'm Jaat-AI, your AI assistant. How can I help you today?";
    
    // Predefined responses for the AI assistant
    this.responses = {
      default: "I'm a demo version with limited capabilities. The full version will have more advanced features. Join our waitlist to get access when we launch!",
      greeting: "Hello! How can I assist you today?",
      help: "I can answer questions, provide information, and help with various tasks. What would you like assistance with?",
      about: "I'm Jaat-AI, an AI assistant designed to be helpful, harmless, and honest. I'm currently in demo mode, but our full version will be launching soon!",
      features: "The full version will include advanced capabilities like answering complex questions, writing content, providing summaries, code assistance, and much more.",
      capabilities: "I can help with writing, research, creative ideas, problem-solving, and more. In this demo, I have limited functionality, but the full version will be much more capable.",
      goodbye: "Goodbye! Feel free to come back when you have more questions.",
      thanks: "You're welcome! Is there anything else I can help you with?",
      waitlist: "You can join our waitlist by clicking the 'Join Waitlist' button in the sidebar. We'll notify you when the full version launches!"
    };
  }

  /**
   * Initialize the chat interface
   */
  init() {
    // Set up the active conversation or create a new one
    const activeId = chatStorage.getActiveConversation();
    const conversations = chatStorage.getConversations();
    
    if (activeId && conversations.find(c => c.id === activeId)) {
      this.loadConversation(activeId);
    } else if (conversations.length > 0) {
      this.loadConversation(conversations[0].id);
    } else {
      this.startNewConversation();
    }
  }

  /**
   * Start a new conversation
   */
  startNewConversation() {
    const newConversation = chatStorage.createConversation('New Chat');
    this.currentConversationId = newConversation.id;
    
    // Clear the chat display
    chatUI.clearMessages();
    
    // Add welcome message
    this.addAIMessage(this.welcomeMessage);
  }

  /**
   * Load an existing conversation
   * @param {String} conversationId The ID of the conversation to load
   */
  loadConversation(conversationId) {
    const conversation = chatStorage.getConversation(conversationId);
    if (!conversation) return;
    
    this.currentConversationId = conversationId;
    chatStorage.setActiveConversation(conversationId);
    
    // Clear the current messages and display the loaded conversation
    chatUI.clearMessages();
    
    // Display all messages in the conversation
    conversation.messages.forEach(message => {
      if (message.role === 'user') {
        chatUI.addUserMessage(message.content);
      } else {
        chatUI.addAIMessage(message.content);
      }
    });
    
    // If no messages, add the welcome message
    if (conversation.messages.length === 0) {
      this.addAIMessage(this.welcomeMessage);
    }
    
    // Update sidebar to show the active conversation
    chatUI.updateConversationList();
    chatUI.closeMobileSidebar();
  }

  /**
   * Process a user message and generate a response
   * @param {String} userMessage The user's message text
   */
  async processMessage(userMessage) {
    if (!userMessage.trim() || this.isGenerating) return;
    
    // Add user message to UI and storage
    chatUI.addUserMessage(userMessage);
    chatStorage.addMessage(this.currentConversationId, {
      role: 'user',
      content: userMessage
    });
    
    // Start AI response generation
    this.isGenerating = true;
    chatUI.setInputDisabled(true);
    
    // Show the typing indicator
    chatUI.showTypingIndicator();
    
    // Determine which response to use based on user message
    const response = await this.generateResponse(userMessage);
    
    // Simulate AI thinking time (0.5-2.5 seconds)
    const thinkTime = Math.floor(Math.random() * 2000) + 500;
    setTimeout(() => {
      chatUI.removeTypingIndicator();
      
      // Add AI response
      this.addAIMessage(response);
      
      // Reset state
      this.isGenerating = false;
      chatUI.setInputDisabled(false);
      chatUI.focusInput();
      
      // Update the conversation list to reflect any title changes
      chatUI.updateConversationList();
    }, thinkTime);
  }

  /**
   * Add an AI message to the chat and storage
   * @param {String} message The AI's response message
   */
  addAIMessage(message) {
    chatUI.addAIMessage(message);
    chatStorage.addMessage(this.currentConversationId, {
      role: 'assistant',
      content: message
    });
  }

  /**
   * Generate an AI response based on the user's message
   * @param {String} userMessage The user's message
   * @returns {String} The AI's response
   */
  async generateResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for specific keywords and return appropriate responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return this.responses.greeting;
    } else if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
      return this.responses.help;
    } else if (lowerMessage.includes('about you') || lowerMessage.includes('who are you')) {
      return this.responses.about;
    } else if (lowerMessage.includes('feature') || lowerMessage.includes('capabilities') || lowerMessage.includes('able to')) {
      return this.responses.features;
    } else if (lowerMessage.includes('goodbye') || lowerMessage.includes('bye')) {
      return this.responses.goodbye;
    } else if (lowerMessage.includes('thank')) {
      return this.responses.thanks;
    } else if (lowerMessage.includes('waitlist') || lowerMessage.includes('sign up') || lowerMessage.includes('join')) {
      return this.responses.waitlist;
    }
    
    // For more complex responses that don't match keywords
    if (lowerMessage.length > 30) {
      return this.responses.capabilities;
    }
    
    // Default response
    return this.responses.default;
  }
}

// Create a global chat instance
const jaatAI = new JaatAI();

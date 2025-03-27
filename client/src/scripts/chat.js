/**
 * Chat functionality for the Jaat-AI application
 * Handles the core chat logic, message processing, and AI responses
 * Created by Rohit Sangwan
 */
class JaatAI {
  constructor() {
    this.storage = null;
    this.ui = null;
    this.activeConversationId = null;
    
    // These are some witty responses that will be used in demo mode
    this.staticResponses = [
      "I'm just a demo version, but I'd be happy to help with that in the full version!",
      "That's an interesting question! The full version of Jaat-AI would have a great answer for you.",
      "In the complete version, I could provide detailed information about that. Join our waitlist to access it soon!",
      "I appreciate your curiosity! The full version will have comprehensive answers to questions like this.",
      "That's something I'd love to help with in the full version. Join the waitlist to be among the first to use it!",
      "Great question! The complete Jaat-AI will provide thorough responses to inquiries like yours.",
      "I'm currently in demo mode, but the full version will have a wealth of knowledge on this topic!",
      "Thanks for asking! The enhanced version of Jaat-AI will be able to assist with that in detail.",
      "I wish I could give you a complete answer in this demo. The full version will have that capability!",
      "In the full version, I'll be able to analyze that question and provide extensive insights."
    ];
  }
  
  /**
   * Initialize the chat interface
   */
  init(storage, ui) {
    this.storage = storage;
    this.ui = ui;
    
    // Initialize storage and get all conversations
    const conversations = this.storage.init();
    
    // Check if there's an active conversation
    this.activeConversationId = this.storage.getActiveConversation();
    
    // If no active conversation but conversations exist, set the first one as active
    if (!this.activeConversationId && conversations.length > 0) {
      this.activeConversationId = conversations[0].id;
      this.storage.setActiveConversation(this.activeConversationId);
    }
    
    // Load the active conversation if it exists
    if (this.activeConversationId) {
      this.loadConversation(this.activeConversationId);
    } else {
      // Otherwise show empty state
      this.ui.showEmptyState();
    }
    
    return this;
  }
  
  /**
   * Start a new conversation
   */
  startNewConversation() {
    // Create a new conversation in storage
    const conversation = this.storage.createConversation();
    this.activeConversationId = conversation.id;
    
    // Update UI
    this.ui.clearMessages();
    this.ui.updateConversationList();
    
    return conversation;
  }
  
  /**
   * Load an existing conversation
   * @param {String} conversationId The ID of the conversation to load
   */
  loadConversation(conversationId) {
    const conversation = this.storage.getConversation(conversationId);
    
    if (!conversation) {
      console.error(`Conversation with ID ${conversationId} not found`);
      return null;
    }
    
    // Set as active conversation
    this.activeConversationId = conversationId;
    this.storage.setActiveConversation(conversationId);
    
    // Update UI
    this.ui.clearMessages();
    
    // Add all messages to the UI
    conversation.messages.forEach(message => {
      if (message.role === 'user') {
        this.ui.addUserMessage(message.content);
      } else {
        this.ui.addAIMessage(message.content);
      }
    });
    
    // Update conversation list to highlight the active one
    this.ui.updateConversationList();
    
    return conversation;
  }
  
  /**
   * Process a user message and generate a response
   * @param {String} userMessage The user's message text
   */
  async processMessage(userMessage) {
    if (!userMessage.trim()) return;
    
    // If there's no active conversation, create one
    if (!this.activeConversationId) {
      const newConversation = this.startNewConversation();
      this.activeConversationId = newConversation.id;
    }
    
    // Add user message to UI
    this.ui.addUserMessage(userMessage);
    
    // Save the user message to storage
    this.storage.addMessage(this.activeConversationId, {
      role: 'user',
      content: userMessage
    });
    
    // Update conversation list in case the title changed
    this.ui.updateConversationList();
    
    // Show the AI is thinking
    this.ui.showTypingIndicator();
    
    try {
      // Generate AI response
      const aiResponse = await this.generateResponse(userMessage);
      
      // Remove typing indicator and add AI response
      this.ui.removeTypingIndicator();
      this.addAIMessage(aiResponse);
    } catch (error) {
      console.error('Error generating response:', error);
      this.ui.removeTypingIndicator();
      this.addAIMessage("I'm sorry, I encountered an error. Please try again.");
    }
  }
  
  /**
   * Add an AI message to the chat and storage
   * @param {String} message The AI's response message
   */
  addAIMessage(message) {
    // Add AI message to UI
    this.ui.addAIMessage(message);
    
    // Save the AI message to storage
    this.storage.addMessage(this.activeConversationId, {
      role: 'assistant',
      content: message
    });
  }
  
  /**
   * Generate an AI response based on the user's message
   * @param {String} userMessage The user's message
   * @returns {Promise<String>} The AI's response
   */
  async generateResponse(userMessage) {
    // Simulate network delay for a more realistic experience
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // In this demo version, just return a random response from the static list
    // In a real implementation, this would call an API
    const randomIndex = Math.floor(Math.random() * this.staticResponses.length);
    return this.staticResponses[randomIndex];
  }
  
  /**
   * Delete a conversation
   * @param {String} conversationId The ID of the conversation to delete
   */
  deleteConversation(conversationId) {
    const success = this.storage.deleteConversation(conversationId);
    
    if (success) {
      // If we deleted the active conversation, clear the messages
      if (conversationId === this.activeConversationId) {
        this.activeConversationId = this.storage.getActiveConversation();
        
        if (this.activeConversationId) {
          // Load the new active conversation
          this.loadConversation(this.activeConversationId);
        } else {
          // No conversations left, show empty state
          this.ui.clearMessages();
          this.ui.showEmptyState();
        }
      }
      
      // Update the conversation list
      this.ui.updateConversationList();
    }
    
    return success;
  }
}

// Export a singleton instance
const jaatAI = new JaatAI();
export default jaatAI;
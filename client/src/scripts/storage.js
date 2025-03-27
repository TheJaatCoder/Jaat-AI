/**
 * Storage functionality for the Jaat-AI chat application
 * Handles saving and retrieving conversations from localStorage
 * Created by Rohit Sangwan
 */
class ChatStorage {
  constructor() {
    this.storageKey = 'jaat-ai-conversations';
    this.activeConversationKey = 'jaat-ai-active-conversation';
  }

  /**
   * Initialize the storage
   * @returns {Array} Array of saved conversations
   */
  init() {
    if (!this.getConversations()) {
      this.saveConversations([]);
    }
    return this.getConversations();
  }

  /**
   * Get all saved conversations
   * @returns {Array} Array of conversation objects
   */
  getConversations() {
    const saved = localStorage.getItem(this.storageKey);
    return saved ? JSON.parse(saved) : null;
  }

  /**
   * Save conversations to localStorage
   * @param {Array} conversations Array of conversation objects
   */
  saveConversations(conversations) {
    localStorage.setItem(this.storageKey, JSON.stringify(conversations));
  }

  /**
   * Create a new conversation
   * @param {String} title Initial title for the conversation
   * @returns {Object} Newly created conversation object
   */
  createConversation(title = 'New Chat') {
    const conversations = this.getConversations();
    const newConversation = {
      id: Date.now().toString(),
      title: title,
      messages: [],
      createdAt: new Date().toISOString()
    };
    
    conversations.unshift(newConversation);
    this.saveConversations(conversations);
    this.setActiveConversation(newConversation.id);
    return newConversation;
  }

  /**
   * Get a conversation by ID
   * @param {String} id Conversation ID
   * @returns {Object|null} Conversation object or null if not found
   */
  getConversation(id) {
    const conversations = this.getConversations();
    return conversations.find(conv => conv.id === id) || null;
  }

  /**
   * Add a message to a conversation
   * @param {String} conversationId Conversation ID
   * @param {Object} message Message object {role, content}
   * @returns {Object|null} Updated conversation or null if conversation not found
   */
  addMessage(conversationId, message) {
    const conversations = this.getConversations();
    const index = conversations.findIndex(conv => conv.id === conversationId);
    
    if (index === -1) return null;
    
    // Add message to conversation
    conversations[index].messages.push({
      ...message,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    });
    
    // Update conversation title if it's the first user message
    if (message.role === 'user' && conversations[index].messages.length <= 2) {
      const title = message.content.length > 30 
        ? message.content.substring(0, 27) + '...' 
        : message.content;
      conversations[index].title = title;
    }
    
    this.saveConversations(conversations);
    return conversations[index];
  }

  /**
   * Delete a conversation
   * @param {String} id Conversation ID to delete
   * @returns {Boolean} True if successfully deleted
   */
  deleteConversation(id) {
    const conversations = this.getConversations();
    const filteredConversations = conversations.filter(conv => conv.id !== id);
    
    if (filteredConversations.length === conversations.length) {
      return false; // Nothing was deleted
    }
    
    this.saveConversations(filteredConversations);
    
    // If deleted the active conversation, set a new active one
    if (this.getActiveConversation() === id) {
      this.setActiveConversation(
        filteredConversations.length > 0 ? filteredConversations[0].id : null
      );
    }
    
    return true;
  }

  /**
   * Get the active conversation ID
   * @returns {String|null} Active conversation ID or null
   */
  getActiveConversation() {
    return localStorage.getItem(this.activeConversationKey);
  }

  /**
   * Set the active conversation ID
   * @param {String|null} id Conversation ID or null
   */
  setActiveConversation(id) {
    if (id) {
      localStorage.setItem(this.activeConversationKey, id);
    } else {
      localStorage.removeItem(this.activeConversationKey);
    }
  }

  /**
   * Clear all conversations
   */
  clearAll() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.activeConversationKey);
    this.init();
  }
}

// Create a global storage instance
const chatStorage = new ChatStorage();

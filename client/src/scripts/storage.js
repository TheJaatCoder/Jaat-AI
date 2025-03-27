/**
 * Storage functionality for the Jaat-AI chat application
 * Handles saving and retrieving conversations from localStorage
 * Created by Rohit Sangwan
 */
class ChatStorage {
  constructor() {
    this.STORAGE_KEY = 'jaat_ai_conversations';
    this.ACTIVE_CONVERSATION_KEY = 'jaat_ai_active_conversation';
  }
  
  /**
   * Initialize the storage
   * @returns {Array} Array of saved conversations
   */
  init() {
    // If no conversations exist in storage, create an empty array
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
    }
    
    return this.getConversations();
  }
  
  /**
   * Get all saved conversations
   * @returns {Array} Array of conversation objects
   */
  getConversations() {
    const conversations = localStorage.getItem(this.STORAGE_KEY);
    return conversations ? JSON.parse(conversations) : [];
  }
  
  /**
   * Save conversations to localStorage
   * @param {Array} conversations Array of conversation objects
   */
  saveConversations(conversations) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(conversations));
  }
  
  /**
   * Create a new conversation
   * @param {String} title Initial title for the conversation
   * @returns {Object} Newly created conversation object
   */
  createConversation(title = 'New Chat') {
    const conversations = this.getConversations();
    
    const newConversation = {
      id: this.generateId(),
      title: title,
      messages: [],
      createdAt: Date.now()
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
    return conversations.find(conversation => conversation.id === id) || null;
  }
  
  /**
   * Add a message to a conversation
   * @param {String} conversationId Conversation ID
   * @param {Object} message Message object {role, content}
   * @returns {Object|null} Updated conversation or null if conversation not found
   */
  addMessage(conversationId, message) {
    const conversations = this.getConversations();
    const index = conversations.findIndex(c => c.id === conversationId);
    
    if (index === -1) return null;
    
    // Add message to conversation
    conversations[index].messages.push(message);
    
    // Update conversation title if it's the first user message
    if (message.role === 'user' && conversations[index].messages.length === 1) {
      const titleText = message.content.slice(0, 30);
      conversations[index].title = titleText + (titleText.length < message.content.length ? '...' : '');
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
    let conversations = this.getConversations();
    const initialLength = conversations.length;
    
    conversations = conversations.filter(c => c.id !== id);
    
    if (conversations.length < initialLength) {
      this.saveConversations(conversations);
      
      // If the active conversation was deleted, set active to null
      if (this.getActiveConversation() === id) {
        this.setActiveConversation(conversations.length > 0 ? conversations[0].id : null);
      }
      
      return true;
    }
    
    return false;
  }
  
  /**
   * Get the active conversation ID
   * @returns {String|null} Active conversation ID or null
   */
  getActiveConversation() {
    return localStorage.getItem(this.ACTIVE_CONVERSATION_KEY);
  }
  
  /**
   * Set the active conversation ID
   * @param {String|null} id Conversation ID or null
   */
  setActiveConversation(id) {
    if (id) {
      localStorage.setItem(this.ACTIVE_CONVERSATION_KEY, id);
    } else {
      localStorage.removeItem(this.ACTIVE_CONVERSATION_KEY);
    }
  }
  
  /**
   * Clear all conversations
   */
  clearAll() {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.ACTIVE_CONVERSATION_KEY);
    this.init();
  }
  
  /**
   * Generate a unique ID
   * @returns {String} Unique ID
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }
}

// Export a singleton instance
const storage = new ChatStorage();
export default storage;
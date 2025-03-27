/**
 * UI functionality for the Jaat-AI chat application
 * Handles DOM manipulation, event handling, and UI updates
 * Created by Rohit Sangwan
 */
class ChatUI {
  constructor() {
    // Main elements
    this.chatArea = null;
    this.messageForm = null;
    this.userInput = null;
    this.sendButton = null;
    this.menuToggle = null;
    this.sidebar = null;
    this.conversations = null;
    
    // Mobile elements
    this.mobileSidebar = null;
    this.mobileMenuClose = null;
    
    // Chat elements
    this.newChatBtn = null;
    this.mobileNewChat = null;
    
    // Waitlist elements
    this.waitlistBtn = null;
    this.mobileWaitlistBtn = null;
    this.waitlistModal = null;
    this.closeModalBtn = null;
    this.waitlistForm = null;
    
    // Chat state
    this.isGenerating = false;
    this.chatApp = null;
  }
  
  /**
   * Initialize the UI and event listeners
   */
  init(chatApp) {
    this.chatApp = chatApp;
    
    // Get DOM elements
    this.chatArea = document.getElementById('chat-messages');
    this.messageForm = document.getElementById('chat-form');
    this.userInput = document.getElementById('message-input');
    this.sendButton = document.getElementById('send-button');
    this.menuToggle = document.getElementById('menu-toggle');
    this.sidebar = document.querySelector('.sidebar');
    this.conversations = {
      desktop: document.getElementById('conversation-list'),
      mobile: document.getElementById('mobile-conversation-list')
    };
    
    // Mobile elements
    this.mobileSidebar = document.querySelector('.mobile-sidebar');
    this.mobileMenuClose = document.getElementById('mobile-menu-close');
    
    // Chat elements
    this.newChatBtn = document.getElementById('new-chat');
    this.mobileNewChat = document.getElementById('mobile-new-chat');
    
    // Waitlist elements
    this.waitlistBtn = document.getElementById('join-waitlist');
    this.mobileWaitlistBtn = document.getElementById('mobile-join-waitlist');
    this.waitlistModal = document.getElementById('waitlist-modal');
    this.closeModalBtn = document.getElementById('close-modal');
    this.waitlistForm = document.getElementById('waitlist-form');
    
    // Set up event listeners
    this.messageForm.addEventListener('submit', this.handleSubmit.bind(this));
    this.userInput.addEventListener('input', this.autoResizeInput.bind(this));
    this.userInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (!this.isGenerating && this.userInput.value.trim()) {
          this.messageForm.dispatchEvent(new Event('submit'));
        }
      }
    });
    
    // Enable/disable send button based on input
    this.userInput.addEventListener('input', () => {
      this.sendButton.disabled = !this.userInput.value.trim();
    });
    
    // Mobile menu
    this.menuToggle.addEventListener('click', this.openMobileSidebar.bind(this));
    this.mobileMenuClose.addEventListener('click', this.closeMobileSidebar.bind(this));
    
    // New chat
    this.newChatBtn.addEventListener('click', () => {
      this.chatApp.startNewConversation();
      this.focusInput();
    });
    
    this.mobileNewChat.addEventListener('click', () => {
      this.chatApp.startNewConversation();
      this.closeMobileSidebar();
      this.focusInput();
    });
    
    // Waitlist
    this.waitlistBtn.addEventListener('click', this.openWaitlistModal.bind(this));
    this.mobileWaitlistBtn.addEventListener('click', this.openWaitlistModal.bind(this));
    this.closeModalBtn.addEventListener('click', this.closeWaitlistModal.bind(this));
    this.waitlistForm.addEventListener('submit', this.handleWaitlistSubmit.bind(this));
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
      if (e.target === this.waitlistModal) {
        this.closeWaitlistModal();
      }
    });
    
    // Close mobile sidebar when clicking outside
    window.addEventListener('click', (e) => {
      if (e.target === this.mobileSidebar) {
        this.closeMobileSidebar();
      }
    });
    
    // Initial focus
    this.focusInput();
    
    return this;
  }
  
  /**
   * Auto-resize the message input field as user types
   */
  autoResizeInput() {
    // Reset height to auto to correctly calculate new height
    this.userInput.style.height = 'auto';
    
    // Set new height based on scrollHeight, with a maximum height
    const newHeight = Math.min(this.userInput.scrollHeight, 150);
    this.userInput.style.height = `${newHeight}px`;
  }
  
  /**
   * Handle chat form submission
   * @param {Event} e Form submission event
   */
  handleSubmit(e) {
    e.preventDefault();
    
    if (this.isGenerating) return;
    
    const message = this.userInput.value.trim();
    if (!message) return;
    
    // Clear input and reset height
    this.userInput.value = '';
    this.userInput.style.height = 'auto';
    this.sendButton.disabled = true;
    
    // Set generating state
    this.isGenerating = true;
    
    // Process the message
    this.chatApp.processMessage(message).finally(() => {
      this.isGenerating = false;
      this.focusInput();
    });
  }
  
  /**
   * Add a user message to the chat display
   * @param {String} message The user's message
   */
  addUserMessage(message) {
    const messageEl = document.createElement('div');
    messageEl.className = 'message user';
    messageEl.innerHTML = `
      <div class="message-content">${this.formatMessage(message)}</div>
    `;
    this.chatArea.appendChild(messageEl);
    this.scrollToBottom();
  }
  
  /**
   * Add an AI message to the chat display
   * @param {String} message The AI's response
   */
  addAIMessage(message) {
    const messageEl = document.createElement('div');
    messageEl.className = 'message assistant';
    messageEl.innerHTML = `
      <div class="message-content">${this.formatMessage(message)}</div>
    `;
    this.chatArea.appendChild(messageEl);
    this.scrollToBottom();
  }
  
  /**
   * Format a message for display (convert line breaks, etc.)
   * @param {String} message The message to format
   * @returns {String} The formatted message
   */
  formatMessage(message) {
    return message
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .replace(/\n/g, '<br>');
  }
  
  /**
   * Show the typing indicator while the AI is "thinking"
   */
  showTypingIndicator() {
    const indicatorEl = document.createElement('div');
    indicatorEl.className = 'typing-indicator';
    indicatorEl.id = 'typing-indicator';
    indicatorEl.innerHTML = `
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    `;
    this.chatArea.appendChild(indicatorEl);
    this.scrollToBottom();
  }
  
  /**
   * Remove the typing indicator
   */
  removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
      indicator.remove();
    }
  }
  
  /**
   * Scroll the chat to the bottom
   */
  scrollToBottom() {
    this.chatArea.scrollTop = this.chatArea.scrollHeight;
  }
  
  /**
   * Clear all messages from the chat display
   */
  clearMessages() {
    this.chatArea.innerHTML = '';
  }
  
  /**
   * Show empty state when no conversations
   */
  showEmptyState() {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.innerHTML = `
      <div class="empty-state-icon">
        <i class="fas fa-comments"></i>
      </div>
      <h2 class="empty-state-title">Welcome to Jaat-AI</h2>
      <p class="empty-state-text">
        Start a new conversation by typing a message below or clicking the "New chat" button.
      </p>
    `;
    this.chatArea.appendChild(emptyState);
  }
  
  /**
   * Enable/disable the input field and send button
   * @param {Boolean} disabled Whether the input should be disabled
   */
  setInputDisabled(disabled) {
    this.userInput.disabled = disabled;
    this.sendButton.disabled = disabled || !this.userInput.value.trim();
  }
  
  /**
   * Focus the input field
   */
  focusInput() {
    this.userInput.focus();
  }
  
  /**
   * Open the waitlist modal
   */
  openWaitlistModal() {
    this.waitlistModal.style.display = 'block';
    
    // Close mobile sidebar if open
    this.closeMobileSidebar();
  }
  
  /**
   * Close the waitlist modal
   */
  closeWaitlistModal() {
    this.waitlistModal.style.display = 'none';
  }
  
  /**
   * Handle waitlist form submission
   * @param {Event} e Form submission event
   */
  handleWaitlistSubmit(e) {
    e.preventDefault();
    
    // In a real application, this would send the form data to a server
    // Here we'll just show a success message
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    
    // Reset form
    e.target.reset();
    
    // Close modal
    this.closeWaitlistModal();
    
    // Show success toast
    this.showToast(`Thanks, ${name}! We've added you to our waitlist.`, 'success');
  }
  
  /**
   * Show a toast notification
   * @param {String} message The message to display
   * @param {String} type The type of toast ('success' or 'error')
   */
  showToast(message, type = 'success') {
    // Remove any existing toasts
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
      existingToast.remove();
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    // Add to body
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
  
  /**
   * Open the mobile sidebar
   */
  openMobileSidebar() {
    this.mobileSidebar.style.display = 'block';
  }
  
  /**
   * Close the mobile sidebar
   */
  closeMobileSidebar() {
    this.mobileSidebar.style.display = 'none';
  }
  
  /**
   * Update the conversation list in the sidebar
   */
  updateConversationList() {
    // Get conversations from storage
    const conversations = this.chatApp.storage.getConversations();
    const activeId = this.chatApp.activeConversationId;
    
    // Update both desktop and mobile conversation lists
    ['desktop', 'mobile'].forEach(type => {
      const list = this.conversations[type];
      list.innerHTML = '';
      
      conversations.forEach(conversation => {
        const item = document.createElement('div');
        item.className = `conversation-item ${conversation.id === activeId ? 'active' : ''}`;
        item.dataset.id = conversation.id;
        item.innerHTML = `
          <i class="fas fa-comment"></i>
          <div class="conversation-title">${conversation.title}</div>
          <button class="delete-chat" data-id="${conversation.id}">
            <i class="fas fa-trash"></i>
          </button>
        `;
        
        // Add click event to load conversation
        item.addEventListener('click', (e) => {
          // Don't trigger if delete button was clicked
          if (e.target.closest('.delete-chat')) return;
          
          this.chatApp.loadConversation(conversation.id);
          
          // Close mobile sidebar if open
          if (type === 'mobile') {
            this.closeMobileSidebar();
          }
        });
        
        // Add event for delete button
        const deleteBtn = item.querySelector('.delete-chat');
        deleteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.chatApp.deleteConversation(conversation.id);
        });
        
        list.appendChild(item);
      });
    });
  }
}

// Export a singleton instance
const ui = new ChatUI();
export default ui;
/**
 * UI functionality for the Jaat-AI chat application
 * Handles DOM manipulation, event handling, and UI updates
 * Created by Rohit Sangwan
 */
class ChatUI {
  constructor() {
    // DOM elements
    this.messageInput = document.getElementById('message-input');
    this.chatForm = document.getElementById('chat-form');
    this.sendButton = document.getElementById('send-button');
    this.chatMessages = document.getElementById('chat-messages');
    this.modalBackdrop = document.getElementById('modal-backdrop');
    this.waitlistModal = document.getElementById('waitlist-modal');
    this.closeModalBtn = document.getElementById('close-modal');
    this.waitlistForm = document.getElementById('waitlist-form');
    this.formSuccess = document.getElementById('form-success');
    this.formError = document.getElementById('form-error');
    this.joinWaitlistBtn = document.getElementById('join-waitlist-btn');
    this.mobileJoinWaitlist = document.getElementById('mobile-join-waitlist');
    this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
    this.mobileSidebar = document.getElementById('mobile-sidebar');
    this.closeMobileMenu = document.getElementById('close-mobile-menu');
    this.newChatBtn = document.getElementById('new-chat-btn');
    this.mobileNewChat = document.getElementById('mobile-new-chat');
    this.conversationList = document.getElementById('conversation-list');
    this.mobileConversationList = document.getElementById('mobile-conversation-list');
  }

  /**
   * Initialize the UI and event listeners
   */
  init() {
    // Auto-resize input field
    this.messageInput.addEventListener('input', this.autoResizeInput.bind(this));
    
    // Chat form submission
    this.chatForm.addEventListener('submit', this.handleSubmit.bind(this));
    
    // Waitlist modal events
    this.joinWaitlistBtn.addEventListener('click', this.openWaitlistModal.bind(this));
    this.mobileJoinWaitlist.addEventListener('click', this.openWaitlistModal.bind(this));
    this.closeModalBtn.addEventListener('click', this.closeWaitlistModal.bind(this));
    this.modalBackdrop.addEventListener('click', (e) => {
      if (e.target === this.modalBackdrop) {
        this.closeWaitlistModal();
      }
    });
    
    // Waitlist form submission
    this.waitlistForm.addEventListener('submit', this.handleWaitlistSubmit.bind(this));
    
    // Mobile menu events
    this.mobileMenuBtn.addEventListener('click', this.openMobileSidebar.bind(this));
    this.closeMobileMenu.addEventListener('click', this.closeMobileSidebar.bind(this));
    
    // New chat button
    this.newChatBtn.addEventListener('click', () => jaatAI.startNewConversation());
    this.mobileNewChat.addEventListener('click', () => {
      this.closeMobileSidebar();
      jaatAI.startNewConversation();
    });
    
    // Update the conversation list
    this.updateConversationList();
    
    // Focus input on desktop
    if (window.innerWidth >= 768) {
      this.messageInput.focus();
    }
  }

  /**
   * Auto-resize the message input field as user types
   */
  autoResizeInput() {
    this.messageInput.style.height = 'auto';
    this.messageInput.style.height = `${this.messageInput.scrollHeight}px`;
    
    // Enable/disable the send button based on input
    this.sendButton.disabled = this.messageInput.value.trim() === '';
  }

  /**
   * Handle chat form submission
   * @param {Event} e Form submission event
   */
  handleSubmit(e) {
    e.preventDefault();
    const message = this.messageInput.value.trim();
    if (message) {
      jaatAI.processMessage(message);
      this.messageInput.value = '';
      this.messageInput.style.height = 'auto';
      this.sendButton.disabled = true;
    }
  }

  /**
   * Add a user message to the chat display
   * @param {String} message The user's message
   */
  addUserMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user-message message-appear';
    
    messageDiv.innerHTML = `
      <div class="message-content">
        <div class="avatar user-avatar">
          <i class="fas fa-user"></i>
        </div>
        <div class="message-bubble">
          <p>${this.formatMessage(message)}</p>
        </div>
      </div>
    `;
    
    this.chatMessages.appendChild(messageDiv);
    this.scrollToBottom();
  }

  /**
   * Add an AI message to the chat display
   * @param {String} message The AI's response
   */
  addAIMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ai-message message-appear';
    
    messageDiv.innerHTML = `
      <div class="message-content">
        <div class="avatar ai-avatar">
          <i class="fas fa-robot"></i>
        </div>
        <div class="message-bubble">
          <p>${this.formatMessage(message)}</p>
        </div>
      </div>
    `;
    
    this.chatMessages.appendChild(messageDiv);
    this.scrollToBottom();
  }

  /**
   * Format a message for display (convert line breaks, etc.)
   * @param {String} message The message to format
   * @returns {String} The formatted message
   */
  formatMessage(message) {
    // Replace line breaks with <br> tags
    return message.replace(/\n/g, '<br>');
  }

  /**
   * Show the typing indicator while the AI is "thinking"
   */
  showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'message ai-message message-appear';
    
    typingDiv.innerHTML = `
      <div class="message-content">
        <div class="avatar ai-avatar">
          <i class="fas fa-robot"></i>
        </div>
        <div class="message-bubble">
          <div class="typing-animation">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
          </div>
        </div>
      </div>
    `;
    
    this.chatMessages.appendChild(typingDiv);
    this.scrollToBottom();
  }

  /**
   * Remove the typing indicator
   */
  removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  /**
   * Scroll the chat to the bottom
   */
  scrollToBottom() {
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  /**
   * Clear all messages from the chat display
   */
  clearMessages() {
    this.chatMessages.innerHTML = '';
  }

  /**
   * Enable/disable the input field and send button
   * @param {Boolean} disabled Whether the input should be disabled
   */
  setInputDisabled(disabled) {
    this.messageInput.disabled = disabled;
    this.sendButton.disabled = disabled;
  }

  /**
   * Focus the input field
   */
  focusInput() {
    this.messageInput.focus();
  }

  /**
   * Open the waitlist modal
   */
  openWaitlistModal() {
    this.modalBackdrop.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    this.waitlistForm.classList.remove('hidden');
    this.formSuccess.classList.add('hidden');
    this.formError.classList.add('hidden');
  }

  /**
   * Close the waitlist modal
   */
  closeWaitlistModal() {
    this.modalBackdrop.classList.add('hidden');
    document.body.style.overflow = '';
  }

  /**
   * Handle waitlist form submission
   * @param {Event} e Form submission event
   */
  handleWaitlistSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    
    // Simple validation
    if (!name || !email) return;
    
    // In a real app, this would send data to a server
    // For this demo, just show the success message
    
    this.waitlistForm.classList.add('hidden');
    this.formSuccess.classList.remove('hidden');
    
    // Reset form fields
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
  }

  /**
   * Open the mobile sidebar
   */
  openMobileSidebar() {
    this.mobileSidebar.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  /**
   * Close the mobile sidebar
   */
  closeMobileSidebar() {
    this.mobileSidebar.classList.add('hidden');
    document.body.style.overflow = '';
  }

  /**
   * Update the conversation list in the sidebar
   */
  updateConversationList() {
    const conversations = chatStorage.getConversations();
    const activeId = chatStorage.getActiveConversation();
    
    // Clear the lists
    this.conversationList.innerHTML = '';
    this.mobileConversationList.innerHTML = '';
    
    // Add conversations to both lists
    conversations.forEach(conversation => {
      // Create desktop item
      const item = document.createElement('button');
      item.className = 'conversation-item';
      if (conversation.id === activeId) {
        item.classList.add('active-conversation');
      }
      
      item.innerHTML = `
        <i class="fas fa-comment"></i>
        <span class="conversation-text">${conversation.title}</span>
      `;
      
      item.addEventListener('click', () => {
        jaatAI.loadConversation(conversation.id);
      });
      
      this.conversationList.appendChild(item);
      
      // Create mobile item (clone of desktop item)
      const mobileItem = item.cloneNode(true);
      mobileItem.addEventListener('click', () => {
        jaatAI.loadConversation(conversation.id);
      });
      
      this.mobileConversationList.appendChild(mobileItem);
    });
    
    // If no conversations, show a message
    if (conversations.length === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.className = 'empty-conversations';
      emptyMessage.textContent = 'No conversations yet';
      
      this.conversationList.appendChild(emptyMessage);
      
      // Clone for mobile
      const mobileEmptyMessage = emptyMessage.cloneNode(true);
      this.mobileConversationList.appendChild(mobileEmptyMessage);
    }
  }
}

// Create a global UI instance
const chatUI = new ChatUI();

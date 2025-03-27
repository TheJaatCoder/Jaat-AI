import { setupSidebar } from '@/components/ui/sidebar';
import { setupChatBubbles } from '@/components/ui/chatbubble';
import { setupWaitlistModal } from '@/components/ui/waitlist-modal';
import { getChat, saveChat, getChatHistory, createNewChat } from '@/lib/storage';
import { getAIResponse } from '@/lib/responses';

export default function Chat() {
  let currentChatId: string | null = null;
  
  // DOM elements that will be accessed throughout the component
  let chatArea: HTMLElement;
  let messageForm: HTMLFormElement;
  let userInput: HTMLTextAreaElement;
  let sendButton: HTMLButtonElement;
  let menuToggle: HTMLButtonElement;
  let sidebar: HTMLElement;
  let newChatBtn: HTMLButtonElement;
  let mobileNewChat: HTMLButtonElement;
  
  // Initialize the chat interface
  const initialize = () => {
    // Create the main container
    const container = document.createElement('div');
    container.className = 'flex h-screen overflow-hidden';
    
    // Setup sidebar
    const { sidebarElement, updateConversationList } = setupSidebar({
      onNewChat: startNewChat,
      onSelectChat: loadChat,
      onOpenWaitlist: openWaitlistModal
    });
    sidebar = sidebarElement;
    container.appendChild(sidebar);
    
    // Create main content area
    const mainContent = document.createElement('div');
    mainContent.className = 'flex-1 flex flex-col bg-main-dark overflow-hidden relative';
    
    // Create mobile header
    const mobileHeader = document.createElement('header');
    mobileHeader.className = 'md:hidden flex items-center justify-between p-4 border-b border-white/10';
    mobileHeader.innerHTML = `
      <button id="menuToggle" class="text-white">
        <i class="fas fa-bars h-6 w-6"></i>
      </button>
      <h1 class="text-lg font-semibold text-white">Jaat-AI</h1>
      <button id="mobileNewChat" class="text-white">
        <i class="fas fa-plus h-6 w-6"></i>
      </button>
    `;
    mainContent.appendChild(mobileHeader);
    
    // Create chat area
    chatArea = document.createElement('div');
    chatArea.id = 'chatArea';
    chatArea.className = 'flex-1 overflow-y-auto px-4 md:px-8 py-4';
    mainContent.appendChild(chatArea);
    
    // Create message input area
    const messageInputArea = document.createElement('div');
    messageInputArea.className = 'border-t border-white/10 bg-main-dark p-4';
    messageInputArea.innerHTML = `
      <div class="max-w-3xl mx-auto">
        <form id="messageForm" class="flex items-end gap-2">
          <div class="flex-1 bg-[#40414F] rounded-lg border border-white/10">
            <textarea 
              id="userInput" 
              placeholder="Message Jaat-AI..." 
              class="w-full bg-transparent border-0 resize-none px-4 py-3 focus:outline-none focus:ring-0 text-white min-h-input max-h-input"
              rows="1"
            ></textarea>
          </div>
          <button 
            type="submit" 
            id="sendButton" 
            class="bg-accent-green text-white p-2 rounded-lg enabled:hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <i class="fas fa-paper-plane h-5 w-5"></i>
          </button>
        </form>
        <p class="text-xs text-center mt-2 text-text-secondary">
          This is a demo of Jaat-AI. Join the waitlist to get early access.
        </p>
      </div>
    `;
    mainContent.appendChild(messageInputArea);
    
    // Add main content to container
    container.appendChild(mainContent);
    
    // Setup waitlist modal
    const { modalElement, openModal } = setupWaitlistModal();
    document.body.appendChild(modalElement);
    
    // Get DOM references now that elements are created
    messageForm = messageInputArea.querySelector('#messageForm') as HTMLFormElement;
    userInput = messageInputArea.querySelector('#userInput') as HTMLTextAreaElement;
    sendButton = messageInputArea.querySelector('#sendButton') as HTMLButtonElement;
    menuToggle = mobileHeader.querySelector('#menuToggle') as HTMLButtonElement;
    newChatBtn = sidebarElement.querySelector('#newChatBtn') as HTMLButtonElement;
    mobileNewChat = mobileHeader.querySelector('#mobileNewChat') as HTMLButtonElement;
    
    // Add event listeners
    setupEventListeners(openModal);
    
    // Initialize chat
    startNewChat();
    
    // Update conversation list in sidebar
    updateConversationList(getChatHistory());
    
    return container;
  };
  
  // Setup event listeners for the chat interface
  const setupEventListeners = (openWaitlistModal: () => void) => {
    // Auto-resize textarea
    userInput.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = (this.scrollHeight) + 'px';
    });
    
    // Handle form submission
    messageForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const message = userInput.value.trim();
      if (!message) return;
      
      // Add user message to chat
      addMessage('user', message);
      
      // Clear input
      userInput.value = '';
      userInput.style.height = 'auto';
      
      // Disable send button while "AI is thinking"
      sendButton.disabled = true;
      
      // Show typing indicator
      showTypingIndicator();
      
      // Save user message to chat history
      if (currentChatId) {
        saveChat(currentChatId, { role: 'user', content: message });
      }
      
      // Simulate AI response after a delay
      setTimeout(() => {
        removeTypingIndicator();
        sendButton.disabled = false;
        
        // Get AI response based on user message
        const response = getAIResponse(message);
        
        // Add AI response to chat
        addMessage('ai', response);
        
        // Save AI response to chat history
        if (currentChatId) {
          saveChat(currentChatId, { role: 'assistant', content: response });
        }
        
        // Scroll to bottom
        chatArea.scrollTop = chatArea.scrollHeight;
      }, 1500);
      
      // Scroll to bottom
      chatArea.scrollTop = chatArea.scrollHeight;
    });
    
    // Toggle mobile sidebar
    menuToggle.addEventListener('click', function() {
      sidebar.classList.toggle('hidden');
      sidebar.classList.toggle('fixed');
      sidebar.classList.toggle('inset-0');
      sidebar.classList.toggle('z-40');
    });
    
    // New chat button functionality
    newChatBtn.addEventListener('click', startNewChat);
    mobileNewChat.addEventListener('click', startNewChat);
    
    // Auto-focus input on page load
    setTimeout(() => {
      userInput.focus();
    }, 500);
  };
  
  // Add a message to the chat
  const addMessage = (sender: 'user' | 'ai', content: string) => {
    const { createChatBubble } = setupChatBubbles();
    const bubble = createChatBubble(sender, content);
    chatArea.appendChild(bubble);
  };
  
  // Show typing indicator while AI is "thinking"
  const showTypingIndicator = () => {
    const indicator = document.createElement('div');
    indicator.className = 'max-w-3xl mx-auto';
    indicator.id = 'typingIndicator';
    
    indicator.innerHTML = `
      <div class="flex items-start gap-4 mb-8 message-appear">
        <div class="w-8 h-8 rounded-full bg-accent-green flex items-center justify-center flex-shrink-0 text-white">
          AI
        </div>
        <div class="flex-1">
          <div class="bg-ai-bubble p-4 rounded-lg text-text-primary">
            <div class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    `;
    
    chatArea.appendChild(indicator);
    chatArea.scrollTop = chatArea.scrollHeight;
  };
  
  // Remove typing indicator once AI responds
  const removeTypingIndicator = () => {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
      indicator.remove();
    }
  };
  
  // Start a new chat
  const startNewChat = () => {
    // Clear chat area
    chatArea.innerHTML = '';
    
    // Create a new chat in storage
    currentChatId = createNewChat();
    
    // Add welcome message
    addMessage('ai', 
      `👋 Welcome to Jaat-AI! I'm here to help you with any questions you have.
      
      I can assist with:
      • Answering questions on various topics
      • Generating creative content
      • Providing recommendations
      • Solving problems
      
      Feel free to ask me anything or join our waitlist to get notified when we launch!`
    );
    
    // Save welcome message to chat history
    if (currentChatId) {
      saveChat(currentChatId, { 
        role: 'assistant', 
        content: `👋 Welcome to Jaat-AI! I'm here to help you with any questions you have.` 
      });
    }
    
    // Add mobile waitlist button
    const mobileWaitlistContainer = document.createElement('div');
    mobileWaitlistContainer.className = 'md:hidden py-4 max-w-3xl mx-auto message-appear';
    mobileWaitlistContainer.innerHTML = `
      <button id="mobileWaitlistBtn" class="w-full bg-accent-green hover:bg-opacity-90 text-white font-medium py-3 px-4 rounded-md transition-colors">
        Join Waitlist
      </button>
    `;
    chatArea.appendChild(mobileWaitlistContainer);
    
    // Add event listener for mobile waitlist button
    const mobileWaitlistBtn = mobileWaitlistContainer.querySelector('#mobileWaitlistBtn');
    if (mobileWaitlistBtn) {
      mobileWaitlistBtn.addEventListener('click', openWaitlistModal);
    }
    
    // Close mobile sidebar if open
    sidebar.classList.add('hidden');
    sidebar.classList.remove('fixed', 'inset-0', 'z-40');
  };
  
  // Load an existing chat
  const loadChat = (chatId: string) => {
    // Clear chat area
    chatArea.innerHTML = '';
    
    // Set current chat ID
    currentChatId = chatId;
    
    // Get chat messages from storage
    const chat = getChat(chatId);
    
    // Add messages to chat area
    if (chat && chat.messages) {
      chat.messages.forEach(message => {
        addMessage(message.role === 'user' ? 'user' : 'ai', message.content);
      });
    }
    
    // Close mobile sidebar
    sidebar.classList.add('hidden');
    sidebar.classList.remove('fixed', 'inset-0', 'z-40');
    
    // Scroll to bottom
    chatArea.scrollTop = chatArea.scrollHeight;
  };
  
  // Open the waitlist modal
  const openWaitlistModal = () => {
    // This function is passed as a callback to the waitlist modal component
    const { openModal } = setupWaitlistModal();
    openModal();
  };
  
  return {
    initialize
  };
}

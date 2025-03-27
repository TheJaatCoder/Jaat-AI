import { getChatHistory, deleteChat } from '@/lib/storage';

// Interface for sidebar callbacks
interface SidebarCallbacks {
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onOpenWaitlist: () => void;
}

// Set up the sidebar component
export function setupSidebar(callbacks: SidebarCallbacks) {
  const { onNewChat, onSelectChat, onOpenWaitlist } = callbacks;
  
  // Create the sidebar element
  const sidebarElement = document.createElement('div');
  sidebarElement.id = 'sidebar';
  sidebarElement.className = 'hidden md:flex md:flex-col bg-sidebar-dark w-64 p-2 overflow-y-auto';
  
  // Add content to sidebar
  sidebarElement.innerHTML = `
    <!-- New Chat Button -->
    <button id="newChatBtn" class="flex items-center justify-between w-full px-3 py-3 mb-2 border border-white/20 rounded-md hover:bg-white/10 transition-colors text-white">
      <div class="flex items-center">
        <i class="fas fa-plus text-xs mr-2"></i>
        <span>New chat</span>
      </div>
    </button>
    
    <!-- Conversation History -->
    <div class="mb-4">
      <h2 class="text-xs uppercase tracking-wider text-text-secondary px-3 mb-2">Recent conversations</h2>
      <div id="conversationList" class="space-y-1">
        <!-- Conversation items will be inserted here -->
      </div>
    </div>
    
    <!-- Waitlist CTA -->
    <div class="mt-auto">
      <button id="joinWaitlistBtn" class="w-full bg-accent-green hover:bg-opacity-90 text-white font-medium py-2 px-3 rounded-md transition-colors">
        Join Waitlist
      </button>
      <div class="flex items-center mt-4 px-3 py-2 text-sm hover:bg-white/5 rounded-md cursor-pointer">
        <i class="fas fa-info-circle text-xs mr-2"></i>
        <span>About Jaat-AI</span>
      </div>
    </div>
  `;
  
  // Set up event listeners
  const setupEventListeners = () => {
    const newChatBtn = sidebarElement.querySelector('#newChatBtn');
    const joinWaitlistBtn = sidebarElement.querySelector('#joinWaitlistBtn');
    
    if (newChatBtn) {
      newChatBtn.addEventListener('click', onNewChat);
    }
    
    if (joinWaitlistBtn) {
      joinWaitlistBtn.addEventListener('click', onOpenWaitlist);
    }
  };
  
  // Update the conversation list in the sidebar
  const updateConversationList = (chats: any[]) => {
    const conversationList = sidebarElement.querySelector('#conversationList');
    if (!conversationList) return;
    
    // Clear existing list
    conversationList.innerHTML = '';
    
    // Add chats to list
    chats.forEach(chat => {
      const chatItem = document.createElement('div');
      chatItem.className = 'flex items-center px-3 py-2 text-sm text-white rounded-md hover:bg-white/5 group relative';
      chatItem.dataset.chatId = chat.id;
      
      chatItem.innerHTML = `
        <i class="fas fa-comment text-xs mr-2 text-text-secondary"></i>
        <span class="truncate flex-1">${chat.title}</span>
        <button class="delete-chat opacity-0 group-hover:opacity-100 transition-opacity text-text-secondary hover:text-white">
          <i class="fas fa-trash text-xs"></i>
        </button>
      `;
      
      // Add click event to load chat
      chatItem.addEventListener('click', (e) => {
        // Prevent triggering when clicking the delete button
        if (!(e.target as HTMLElement).closest('.delete-chat')) {
          onSelectChat(chat.id);
          
          // Add selected style
          const selectedChats = conversationList.querySelectorAll('.bg-white/10');
          selectedChats.forEach(item => item.classList.remove('bg-white/10'));
          chatItem.classList.add('bg-white/10');
        }
      });
      
      // Add click event for delete button
      const deleteBtn = chatItem.querySelector('.delete-chat');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          deleteChat(chat.id);
          updateConversationList(getChatHistory());
        });
      }
      
      conversationList.appendChild(chatItem);
    });
    
    // If no chats, show a message
    if (chats.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'px-3 py-2 text-sm text-text-secondary';
      emptyState.textContent = 'No conversations yet';
      conversationList.appendChild(emptyState);
    }
  };
  
  // Initialize event listeners
  setupEventListeners();
  
  return {
    sidebarElement,
    updateConversationList
  };
}

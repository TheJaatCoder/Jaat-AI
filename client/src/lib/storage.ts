// Types for chat storage
export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

// Storage keys
const CHAT_HISTORY_KEY = 'jaat-ai-chat-history';
const CHAT_PREFIX = 'jaat-ai-chat-';

// Get all chats from local storage
export function getChatHistory(): Chat[] {
  const chatIds = localStorage.getItem(CHAT_HISTORY_KEY);
  if (!chatIds) return [];
  
  try {
    const ids = JSON.parse(chatIds) as string[];
    return ids.map(id => {
      const chat = getChat(id);
      return chat || { 
        id, 
        title: 'Untitled conversation', 
        messages: [], 
        createdAt: Date.now() 
      };
    }).sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error('Error parsing chat history:', error);
    return [];
  }
}

// Get a specific chat by ID
export function getChat(id: string): Chat | null {
  const chatData = localStorage.getItem(`${CHAT_PREFIX}${id}`);
  if (!chatData) return null;
  
  try {
    return JSON.parse(chatData) as Chat;
  } catch (error) {
    console.error(`Error parsing chat ${id}:`, error);
    return null;
  }
}

// Create a new chat
export function createNewChat(): string {
  const id = generateId();
  const chat: Chat = {
    id,
    title: 'New conversation',
    messages: [],
    createdAt: Date.now()
  };
  
  saveFullChat(chat);
  
  // Add to chat history
  const chatHistory = getChatHistory();
  const newChatHistory = [id, ...chatHistory.map(c => c.id)];
  
  // Save chat history
  localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(newChatHistory));
  
  return id;
}

// Save a message to a chat
export function saveChat(id: string, message: Message): void {
  const chat = getChat(id);
  if (!chat) return;
  
  // Add message to chat
  chat.messages.push(message);
  
  // Update chat title if it's the first user message
  if (chat.title === 'New conversation' && message.role === 'user') {
    chat.title = message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '');
  }
  
  // Save updated chat
  saveFullChat(chat);
}

// Save a full chat object
function saveFullChat(chat: Chat): void {
  localStorage.setItem(`${CHAT_PREFIX}${chat.id}`, JSON.stringify(chat));
}

// Generate a random ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Delete a chat
export function deleteChat(id: string): void {
  // Remove from local storage
  localStorage.removeItem(`${CHAT_PREFIX}${id}`);
  
  // Remove from chat history
  const chatHistory = getChatHistory();
  const newChatHistory = chatHistory.filter(chat => chat.id !== id).map(chat => chat.id);
  
  // Save updated chat history
  localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(newChatHistory));
}

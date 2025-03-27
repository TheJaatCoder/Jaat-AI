// Set up chat bubbles for user and AI messages
export function setupChatBubbles() {
  // Create a chat bubble for user or AI message
  const createChatBubble = (sender: 'user' | 'ai', content: string) => {
    const messageContainer = document.createElement('div');
    messageContainer.className = 'max-w-3xl mx-auto';
    
    let avatar, bgColor;
    
    if (sender === 'user') {
      avatar = '<div class="w-8 h-8 rounded-full bg-accent-green opacity-70 flex items-center justify-center flex-shrink-0 text-white">U</div>';
      bgColor = 'bg-user-bubble';
    } else {
      avatar = '<div class="w-8 h-8 rounded-full bg-accent-green flex items-center justify-center flex-shrink-0 text-white">AI</div>';
      bgColor = 'bg-ai-bubble';
    }
    
    messageContainer.innerHTML = `
      <div class="flex items-start gap-4 mb-8 message-appear">
        ${avatar}
        <div class="flex-1">
          <div class="${bgColor} p-4 rounded-lg text-text-primary">
            ${formatMessage(content)}
          </div>
        </div>
      </div>
    `;
    
    return messageContainer;
  };
  
  // Format message text with markdown-like features
  const formatMessage = (text: string) => {
    // Replace newlines with <br> or new paragraphs
    let formatted = text.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>');
    
    // Convert bullet points
    formatted = formatted.replace(/•\s+([^\n]+)/g, '<li>$1</li>');
    
    // Wrap bullet points in unordered lists
    if (formatted.includes('<li>')) {
      formatted = formatted.replace(/(<li>.*?<\/li>)/gs, '<ul class="list-disc list-inside mb-3 space-y-1">$1</ul>');
    }
    
    // Wrap in paragraph if not already
    if (!formatted.startsWith('<p>') && !formatted.startsWith('<ul>')) {
      formatted = `<p>${formatted}</p>`;
    }
    
    return formatted;
  };
  
  return {
    createChatBubble
  };
}

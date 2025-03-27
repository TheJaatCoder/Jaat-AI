// Predefined responses for the AI
const predefinedResponses: Record<string, string> = {
  default: "I'm not sure I understand. Could you clarify what you'd like to know about Jaat-AI?",
  greeting: "Hello! How can I help you today? I'm Jaat-AI, your friendly AI assistant.",
  features: `Jaat-AI comes with several powerful features:

1. Natural language processing for human-like conversations
2. Advanced knowledge across various domains
3. Creative content generation capabilities
4. Personalized responses based on conversation history
5. Quick and accurate information retrieval

Which feature would you like to learn more about?`,
  
  pricing: `We offer several flexible pricing tiers:

• Free tier: Basic access with limited monthly usage
• Pro ($29/month): Increased usage limits and additional features
• Team ($79/month): Collaboration tools and admin controls
• Enterprise: Custom pricing based on your organization's needs

Join our waitlist to get notified about early access and special launch discounts!`,
  
  waitlist: "Great! To join our waitlist, click the 'Join Waitlist' button in the sidebar. You'll be among the first to experience Jaat-AI when it launches, and we'll send you exclusive updates and offers.",
  launch: "We're planning to launch in Q1 2023. Join our waitlist to get notified as soon as we're ready!",
  competitors: "While there are several AI assistants in the market, Jaat-AI stands out with its intuitive design, powerful capabilities, and focus on user privacy. We've built it from the ground up to be more accessible and effective than alternatives.",
  thanks: "You're welcome! Is there anything else you'd like to know about Jaat-AI?",
  about: `Jaat-AI is a next-generation AI assistant designed to help you with a wide range of tasks. 

Our mission is to make artificial intelligence accessible, helpful, and safe for everyone. Whether you need information, creative content, or problem-solving assistance, Jaat-AI is here to help.

We prioritize:
• Accuracy and reliability
• User privacy and data security
• Continuous learning and improvement
• Ethical AI development

Feel free to ask me anything else about Jaat-AI!`
};

// Get an appropriate response based on user input
export function getAIResponse(message: string): string {
  const lowerMsg = message.toLowerCase();
  
  // Check for specific patterns in the message
  if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
    return predefinedResponses.greeting;
  } else if (lowerMsg.includes('feature') || lowerMsg.includes('what can') || lowerMsg.includes('capabilities') || lowerMsg.includes('do')) {
    return predefinedResponses.features;
  } else if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('pricing') || lowerMsg.includes('subscription')) {
    return predefinedResponses.pricing;
  } else if (lowerMsg.includes('waitlist') || lowerMsg.includes('sign up') || lowerMsg.includes('join') || lowerMsg.includes('register')) {
    return predefinedResponses.waitlist;
  } else if (lowerMsg.includes('launch') || lowerMsg.includes('release') || lowerMsg.includes('when') || lowerMsg.includes('available')) {
    return predefinedResponses.launch;
  } else if (lowerMsg.includes('competitor') || lowerMsg.includes('alternative') || lowerMsg.includes('similar') || lowerMsg.includes('chatgpt')) {
    return predefinedResponses.competitors;
  } else if (lowerMsg.includes('thank')) {
    return predefinedResponses.thanks;
  } else if (lowerMsg.includes('about') || lowerMsg.includes('who') || lowerMsg.includes('what is') || lowerMsg.includes('purpose')) {
    return predefinedResponses.about;
  }
  
  // Default response
  return predefinedResponses.default;
}

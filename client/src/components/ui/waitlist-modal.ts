// Set up the waitlist modal component
export function setupWaitlistModal() {
  let modalElement: HTMLElement;
  let isInitialized = false;
  
  // Create the modal element if it doesn't exist
  const initialize = () => {
    if (isInitialized) return;
    
    modalElement = document.createElement('div');
    modalElement.id = 'waitlistModal';
    modalElement.className = 'waitlist-modal fixed inset-0 z-50 flex items-center justify-center hidden';
    
    modalElement.innerHTML = `
      <div class="relative bg-sidebar-dark rounded-lg max-w-md w-full p-6 shadow-xl message-appear">
        <button id="closeModal" class="absolute top-4 right-4 text-text-secondary hover:text-white">
          <i class="fas fa-times h-6 w-6"></i>
        </button>
        <h2 class="text-xl font-semibold text-white mb-4">Join the Waitlist</h2>
        <p class="mb-6 text-text-secondary">Be among the first to experience Jaat-AI. Sign up now to secure your spot!</p>
        
        <form id="waitlistForm" class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-text-secondary mb-1">Name</label>
            <input type="text" id="name" name="name" class="w-full px-3 py-2 bg-main-dark border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-accent-green text-white" required>
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-text-secondary mb-1">Email</label>
            <input type="email" id="email" name="email" class="w-full px-3 py-2 bg-main-dark border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-accent-green text-white" required>
          </div>
          <div>
            <label for="reason" class="block text-sm font-medium text-text-secondary mb-1">Why are you interested?</label>
            <textarea id="reason" name="reason" rows="3" class="w-full px-3 py-2 bg-main-dark border border-border-color rounded-md focus:outline-none focus:ring-2 focus:ring-accent-green text-white"></textarea>
          </div>
          <button type="submit" class="w-full bg-accent-green hover:bg-opacity-90 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out">Join Waitlist</button>
        </form>
        
        <div id="formSuccess" class="hidden text-center py-4">
          <i class="fas fa-check-circle text-accent-green text-4xl mb-2"></i>
          <h3 class="text-lg font-medium text-white mb-1">Thank you for joining!</h3>
          <p class="text-text-secondary">We'll notify you as soon as we're ready.</p>
        </div>
      </div>
    `;
    
    // Add event listeners
    setupEventListeners();
    
    isInitialized = true;
  };
  
  // Set up event listeners for the modal
  const setupEventListeners = () => {
    const closeModalBtn = modalElement.querySelector('#closeModal');
    const waitlistForm = modalElement.querySelector('#waitlistForm') as HTMLFormElement;
    const formSuccess = modalElement.querySelector('#formSuccess');
    
    // Close button
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', closeModal);
    }
    
    // Click outside to close
    modalElement.addEventListener('click', (e) => {
      if (e.target === modalElement) {
        closeModal();
      }
    });
    
    // Form submission
    if (waitlistForm && formSuccess) {
      waitlistForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Simple form validation
        const nameInput = waitlistForm.querySelector('#name') as HTMLInputElement;
        const emailInput = waitlistForm.querySelector('#email') as HTMLInputElement;
        
        if (!nameInput.value.trim() || !emailInput.value.trim()) {
          return;
        }
        
        // Simulate form submission
        setTimeout(() => {
          waitlistForm.classList.add('hidden');
          formSuccess.classList.remove('hidden');
          
          // Reset form
          waitlistForm.reset();
          
          // Close modal after delay
          setTimeout(() => {
            closeModal();
            // Reset form display after modal is closed
            waitlistForm.classList.remove('hidden');
            formSuccess.classList.add('hidden');
          }, 3000);
        }, 1000);
      });
    }
  };
  
  // Open the modal
  const openModal = () => {
    if (!isInitialized) {
      initialize();
    }
    
    modalElement.classList.remove('hidden');
  };
  
  // Close the modal
  const closeModal = () => {
    modalElement.classList.add('hidden');
  };
  
  // Initialize when first called
  initialize();
  
  return {
    modalElement,
    openModal,
    closeModal
  };
}

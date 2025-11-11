let currentStep = 1;
let formData = {
    fullname: '',
    email: '',
    message: ''
};

// Store event listeners for cleanup
let eventListeners = [];

// Cleanup function to remove all event listeners
function cleanupEventListeners() {
    eventListeners.forEach(({ element, event, handler }) => {
        if (element) {
            element.removeEventListener(event, handler);
        }
    });
    eventListeners = [];
}

// Helper to track event listeners
function addTrackedListener(element, event, handler) {
    if (element) {
        element.addEventListener(event, handler);
        eventListeners.push({ element, event, handler });
    }
}

export function loadContact(container) {
    if (!container) return;

    // Cleanup previous listeners if any
    cleanupEventListeners();

    container.innerHTML = `
        <section class="contact-hero">
            <div class="contact-hero-content">
                <h1 class="contact-hero-title">Get In Touch</h1>
                <p class="contact-hero-subtitle">Let's bring your ideas to life</p>
            </div>
        </section>

        <section class="contact-form-section">
            <div class="form-container">
                <div class="form-step active" id="step-1">
                    <div class="step-content">
                        <div class="step-icon">
                            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <h2 class="step-title">Let's Start With Your Name</h2>
                        <p class="step-description">I'd like to know who I'm talking to</p>
                        
                        <div class="input-group">
                            <label class="input-label">Your Name</label>
                            <input 
                                type="text" 
                                id="fullname-input" 
                                class="form-input" 
                                placeholder="Enter your name..."
                                autocomplete="name"
                                required
                            />
                            <span class="input-error" id="name-error"></span>
                        </div>
                        
                        <button class="btn-continue" id="btn-step-1">
                            Continue
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="form-step" id="step-2">
                    <div class="step-content">
                        <h2 class="step-title"><span id="greeting-time"></span> <span id="user-name" class="highlight-name"></span>!</h2>
                        <p class="step-description">Great to meet you! Now let's get your message</p>
                        
                        <div class="input-group">
                            <label class="input-label">Your Email</label>
                            <input 
                                type="email" 
                                id="email-input" 
                                class="form-input" 
                                placeholder="john@example.com"
                                autocomplete="email"
                                required
                            />
                            <span class="input-error" id="email-error"></span>
                        </div>
                        
                        <div class="input-group">
                            <label class="input-label">Your Message</label>
                            <textarea 
                                id="message-input" 
                                class="form-textarea" 
                                placeholder="Tell me about your project..."
                                rows="5"
                                required
                            ></textarea>
                            <div class="textarea-footer">
                                <span class="input-error" id="message-error"></span>
                                <span class="char-count"><span id="char-count">0</span> / 1000</span>
                            </div>
                        </div>
                        
                        <button class="btn-submit" id="btn-submit">
                            <span class="btn-text">Send Message</span>
                            <span class="btn-loading" style="display: none;">
                                <svg class="spinner-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" opacity="0.25"/>
                                    <path d="M12 2C6.48 2 2 6.48 2 12" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
                                </svg>
                                Sending...
                            </span>
                        </button>
                    </div>
                </div>

                <div class="form-step" id="step-success">
                    <div class="step-content success-content">
                        <div class="success-icon">
                            <svg class="checkmark" width="80" height="80" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
                                <circle class="checkmark-circle" cx="26" cy="26" r="24" fill="none"/>
                                <path class="checkmark-check" fill="none" d="M14 27l7 7 17-17"/>
                            </svg>
                        </div>
                        <h2 class="success-title">Message Sent Successfully!</h2>
                        <p class="success-text">Thank you <span id="success-name" class="highlight-name"></span>! I'll get back to you soon.</p>
                        <button class="btn-continue" id="btn-reset">
                            Send Another Message
                        </button>
                    </div>
                </div>
            </div>
        </section>
    `;

    initializeContactForm();
}

function getTimeBasedGreeting() {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
        return 'Good Morning';
    } else if (hour >= 12 && hour < 18) {
        return 'Good Afternoon';
    } else {
        return 'Good Evening';
    }
}

function toTitleCase(str) {
    return str.toLowerCase().split(' ').map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
}

function initializeContactForm() {
    // Reset state
    currentStep = 1;
    formData = { fullname: '', email: '', message: '' };

    // Get elements - cache them once
    const step1Btn = document.getElementById('btn-step-1');
    const submitBtn = document.getElementById('btn-submit');
    const resetBtn = document.getElementById('btn-reset');

    const fullnameInput = document.getElementById('fullname-input');
    const emailInput = document.getElementById('email-input');
    const messageInput = document.getElementById('message-input');
    const charCount = document.getElementById('char-count');

    // Character counter for message - use passive listener for better performance
    if (messageInput && charCount) {
        const handleInput = () => {
            const count = messageInput.value.length;
            charCount.textContent = count > 1000 ? '1000' : count;
            
            if (count > 1000) {
                messageInput.value = messageInput.value.substring(0, 1000);
            }
        };
        addTrackedListener(messageInput, 'input', handleInput);
    }

    // Step 1: Name validation and transition
    if (step1Btn && fullnameInput) {
        const handleStep1 = () => {
            const name = fullnameInput.value.trim();
            const error = document.getElementById('name-error');

            if (!name) {
                error.textContent = 'Please enter your name';
                fullnameInput.classList.add('error');
                return;
            }

            if (name.length < 2) {
                error.textContent = 'Name must be at least 2 characters';
                fullnameInput.classList.add('error');
                return;
            }

            formData.fullname = name;
            error.textContent = '';
            fullnameInput.classList.remove('error');
            goToStep(2);
        };

        addTrackedListener(step1Btn, 'click', handleStep1);
        
        const handleKeypress = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleStep1();
            }
        };
        addTrackedListener(fullnameInput, 'keypress', handleKeypress);

        const handleNameInput = () => {
            const error = document.getElementById('name-error');
            if (error && error.textContent) {
                error.textContent = '';
                fullnameInput.classList.remove('error');
            }
        };
        addTrackedListener(fullnameInput, 'input', handleNameInput);

        // Auto-focus on name input - use requestAnimationFrame for better performance
        requestAnimationFrame(() => {
            setTimeout(() => fullnameInput.focus(), 300);
        });
    }

    // Step 2: Combined email + message validation and submit
    if (submitBtn && emailInput && messageInput) {
        const handleSubmit = async () => {
            const email = emailInput.value.trim();
            const message = messageInput.value.trim();
            const emailError = document.getElementById('email-error');
            const messageError = document.getElementById('message-error');
            const emailRegex = /^[\w\.-]+@[\w\.-]+\.\w{2,}$/;
            
            let hasError = false;

            // Validate email
            if (!email) {
                emailError.textContent = 'Please enter your email';
                emailInput.classList.add('error');
                hasError = true;
            } else if (!emailRegex.test(email)) {
                emailError.textContent = 'Please enter a valid email address';
                emailInput.classList.add('error');
                hasError = true;
            } else {
                emailError.textContent = '';
                emailInput.classList.remove('error');
            }

            // Validate message
            if (!message) {
                messageError.textContent = 'Please enter a message';
                messageInput.classList.add('error');
                hasError = true;
            } else if (message.length < 10) {
                messageError.textContent = 'Message must be at least 10 characters';
                messageInput.classList.add('error');
                hasError = true;
            } else {
                messageError.textContent = '';
                messageInput.classList.remove('error');
            }

            if (hasError) return;

            formData.email = email;
            formData.message = message;

            // Show loading state
            submitBtn.disabled = true;
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');
            if (btnText) btnText.style.display = 'none';
            if (btnLoading) btnLoading.style.display = 'flex';

            try {
                const response = await fetch('./backend/form-handler.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        fullname: formData.fullname,
                        email: formData.email,
                        message: formData.message
                    })
                });

                const result = await response.json();

                if (result.status === 'success') {
                    goToStep('success');
                } else {
                    throw new Error(result.message || 'Failed to send message');
                }
            } catch (err) {
                if (messageError) {
                    messageError.textContent = 'Failed to send message. Please try again.';
                }
                console.error('Form submission error:', err);
            } finally {
                submitBtn.disabled = false;
                if (btnText) btnText.style.display = 'inline';
                if (btnLoading) btnLoading.style.display = 'none';
            }
        };

        addTrackedListener(submitBtn, 'click', handleSubmit);

        const handleEmailInput = () => {
            const error = document.getElementById('email-error');
            if (error && error.textContent) {
                error.textContent = '';
                emailInput.classList.remove('error');
            }
        };
        addTrackedListener(emailInput, 'input', handleEmailInput);

        const handleMessageInput = () => {
            const error = document.getElementById('message-error');
            if (error && error.textContent) {
                error.textContent = '';
                messageInput.classList.remove('error');
            }
        };
        addTrackedListener(messageInput, 'input', handleMessageInput);
    }

    // Reset button
    if (resetBtn) {
        const handleReset = () => {
            formData = { fullname: '', email: '', message: '' };
            if (fullnameInput) fullnameInput.value = '';
            if (emailInput) emailInput.value = '';
            if (messageInput) messageInput.value = '';
            if (charCount) charCount.textContent = '0';
            goToStep(1);
            requestAnimationFrame(() => {
                setTimeout(() => {
                    if (fullnameInput) fullnameInput.focus();
                }, 300);
            });
        };
        addTrackedListener(resetBtn, 'click', handleReset);
    }
}

function goToStep(step) {
    const steps = document.querySelectorAll('.form-step');

    // Remove active class from all steps
    steps.forEach(s => s.classList.remove('active'));

    if (step === 'success') {
        document.getElementById('step-success').classList.add('active');
        const successName = document.getElementById('success-name');
        if (successName) {
            successName.textContent = toTitleCase(formData.fullname);
        }
        return;
    }

    // Add active class to current step
    document.getElementById(`step-${step}`).classList.add('active');

    // Update greeting name in step 2
    if (step === 2) {
        const userName = document.getElementById('user-name');
        const greetingTime = document.getElementById('greeting-time');
        
        if (userName) {
            userName.textContent = toTitleCase(formData.fullname);
        }
        if (greetingTime) {
            greetingTime.textContent = getTimeBasedGreeting();
        }
        
        // Focus email input - use requestAnimationFrame
        requestAnimationFrame(() => {
            setTimeout(() => {
                const emailInput = document.getElementById('email-input');
                if (emailInput) emailInput.focus();
            }, 300);
        });
    }

    currentStep = step;
}
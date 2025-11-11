// Toggle password visibility
const togglePassword = document.getElementById('toggle-password');
const passwordInput = document.getElementById('password');
const eyeOpen = document.getElementById('eye-open');
const eyeClosed = document.getElementById('eye-closed');

if (togglePassword) {
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        if (type === 'text') {
            eyeOpen.style.display = 'none';
            eyeClosed.style.display = 'block';
        } else {
            eyeOpen.style.display = 'block';
            eyeClosed.style.display = 'none';
        }
    });
}

// Handle form submission
const loginForm = document.getElementById('login-form');
const submitBtn = document.getElementById('submit-btn');
const btnText = submitBtn.querySelector('.btn-text');
const btnIcon = submitBtn.querySelector('.btn-icon'); // May be null if not exists
const btnLoader = submitBtn.querySelector('.btn-loader');
const alertBox = document.getElementById('alert');
const alertMessage = document.getElementById('alert-message');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Clear previous alerts
    hideAlert();
    
    // Get form data
    const formData = new FormData(loginForm);
    
    // Show loading state
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    if (btnIcon) btnIcon.style.display = 'none';
    btnLoader.style.display = 'block';
    
    try {
        const response = await fetch('../backend/login.php', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            showAlert('success', data.message);
            
            // Redirect after short delay
            setTimeout(() => {
                window.location.href = data.redirect;
            }, 1000);
        } else {
            showAlert('error', data.message);
            resetButton();
        }
    } catch (error) {
        console.error('Login error:', error);
        showAlert('error', 'Connection error. Please try again.');
        resetButton();
    }
});

function showAlert(type, message) {
    alertBox.className = 'alert alert-' + type;
    alertMessage.textContent = message;
    alertBox.style.display = 'flex';
    alertBox.style.opacity = '0';
    alertBox.style.transform = 'translateY(-10px)';
    
    // Animate in
    setTimeout(() => {
        alertBox.style.opacity = '1';
        alertBox.style.transform = 'translateY(0)';
    }, 10);
    
    // Auto-hide only success messages after 5 seconds, keep errors visible
    if (type === 'success') {
        setTimeout(() => {
            hideAlert();
        }, 5000);
    }
}

function hideAlert() {
    if (alertBox.style.display === 'none') return;
    
    alertBox.style.opacity = '0';
    alertBox.style.transform = 'translateY(-10px)';
    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 300);
}

function resetButton() {
    submitBtn.disabled = false;
    btnText.style.display = 'block';
    if (btnIcon) btnIcon.style.display = 'block';
    btnLoader.style.display = 'none';
}

// Add focus effects
const inputs = document.querySelectorAll('.form-input');
inputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
        if (!input.value) {
            input.parentElement.classList.remove('focused');
        }
    });
});

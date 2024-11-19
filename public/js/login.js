// Handle login form submission
const loginFormHandler = async (event) => {
    event.preventDefault();

    // Get values from login form
    const email = document.querySelector('#email-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();

    // Validate form input
    if (email && password) {
        try {
            // Send POST request to login endpoint
            const response = await fetch('/api/users/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                // If successful, redirect to dashboard
                document.location.replace('/dashboard');
            } else {
                // Get error message from response
                const data = await response.json();
                throw new Error(data.message || 'Failed to log in');
            }
        } catch (err) {
            showAlert(err.message, 'danger');
        }
    } else {
        showAlert('Please fill in all fields', 'warning');
    }
};

// Handle signup form submission
const signupFormHandler = async (event) => {
    event.preventDefault();

    // Get values from signup form
    const username = document.querySelector('#username-signup').value.trim();
    const email = document.querySelector('#email-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();
    const confirmPassword = document.querySelector('#confirm-password-signup').value.trim();

    // Validate form input
    if (username && email && password) {
        // Check password length
        if (password.length < 8) {
            showAlert('Password must be at least 8 characters long', 'warning');
            return;
        }
        
        // Check if passwords match
        if (password !== confirmPassword) {
            showAlert('Passwords do not match', 'warning');
            return;
        }

        try {
            // Send POST request to create user
            const response = await fetch('/api/users', {
                method: 'POST',
                body: JSON.stringify({ username, email, password }),
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                // If successful, redirect to dashboard
                document.location.replace('/dashboard');
            } else {
                // Get error message from response
                const data = await response.json();
                throw new Error(data.message || 'Failed to sign up');
            }
        } catch (err) {
            showAlert(err.message, 'danger');
        }
    } else {
        showAlert('Please fill in all fields', 'warning');
    }
};

// Show alert message
const showAlert = (message, type) => {
    // Create alert element
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.textContent = message;
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.className = 'btn-close';
    closeButton.setAttribute('data-bs-dismiss', 'alert');
    alertDiv.appendChild(closeButton);
    
    // Insert alert at top of form container
    const container = document.querySelector('.auth-container');
    container.insertBefore(alertDiv, container.firstChild);
    
    // Auto-remove alert after 5 seconds
    setTimeout(() => alertDiv.remove(), 5000);
};

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add form submission handlers
    document.querySelector('.login-form')
        ?.addEventListener('submit', loginFormHandler);
    document.querySelector('.signup-form')
        ?.addEventListener('submit', signupFormHandler);
});

console.log('Logout script loaded');

const logout = async () => {
    try {
        const response = await fetch('/api/users/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            document.location.replace('/login');
        } else {
            throw new Error('Failed to log out.');
        }
    } catch (error) {
        console.error('Logout error:', error);
        alert('Failed to log out.');
    }
};

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.querySelector('#logout-btn');
    if (logoutButton) {
        console.log('Logout button found');
        logoutButton.addEventListener('click', logout);
    } else {
        console.log('Logout button not found');
    }
}); 
console.log('Logout script loaded');

const logout = async () => {
    try {
        const response = await fetch('/api/users/logout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            document.location.replace('/');
        } else {
            throw new Error('Failed to log out.');
        }
    } catch (error) {
        console.error('Logout error:', error);
        alert('Failed to log out.');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.querySelector('#logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
}); 
// Global variables for DOM elements
let tipForm;
let tipList;

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    tipForm = document.querySelector('#new-tip-form');
    tipList = document.querySelector('.tip-list');
    
    // Add event listeners
    initializeEventListeners();
    
    // Load initial data
    loadTipData();
    
    // Set up modal initialization
    const newTipModal = document.getElementById('newTipModal');
    newTipModal.addEventListener('show.bs.modal', setDefaultDate);
});

// Initialize all event listeners
const initializeEventListeners = () => {
    // Handle new tip submission
    document.querySelector('#save-tip').addEventListener('click', newTipHandler);
    
    // Handle tip deletion
    document.querySelectorAll('.delete-tip').forEach(button => {
        button.addEventListener('click', deleteTipHandler);
    });
    
    // Handle tip edit buttons
    document.querySelectorAll('.edit-tip').forEach(button => {
        button.addEventListener('click', editTipHandler);
    });
};

// Handle new tip submission
const newTipHandler = async (event) => {
    event.preventDefault();

    // Get values from form
    const amount = document.querySelector('#tip-amount').value.trim();
    const shift_type = document.querySelector('#shift-type').value.trim();
    const shift_date = document.querySelector('#shift-date').value.trim();
    const hours_worked = document.querySelector('#hours-worked').value.trim();
    const notes = document.querySelector('#notes').value.trim();

    // Validate form data
    if (amount && shift_type && shift_date && hours_worked) {
        try {
            // Send POST request to API
            const response = await fetch('/api/tips', {
                method: 'POST',
                body: JSON.stringify({
                    amount,
                    shift_type,
                    shift_date,
                    hours_worked,
                    notes
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // If successful, reload page to show new tip
            if (response.ok) {
                document.location.reload();
            } else {
                throw new Error('Failed to create tip entry');
            }
        } catch (err) {
            showAlert(err.message, 'danger');
        }
    }
};

// Handle tip deletion
const deleteTipHandler = async (event) => {
    // Check if clicked element has a data-id attribute
    if (event.target.hasAttribute('data-id')) {
        const id = event.target.getAttribute('data-id');
        
        try {
            // Send DELETE request to API
            const response = await fetch(`/api/tips/${id}`, {
                method: 'DELETE',
            });

            // If successful, reload page to update tip list
            if (response.ok) {
                document.location.reload();
            } else {
                throw new Error('Failed to delete tip');
            }
        } catch (err) {
            showAlert(err.message, 'danger');
        }
    }
};

// Show alert message to user
const showAlert = (message, type) => {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.textContent = message;
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.className = 'btn-close';
    closeButton.setAttribute('data-bs-dismiss', 'alert');
    alertDiv.appendChild(closeButton);
    
    // Insert alert at top of container
    const container = document.querySelector('.dashboard-container');
    container.insertBefore(alertDiv, container.firstChild);
    
    // Auto-remove alert after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
};

// Add this new function
const setDefaultDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    
    document.querySelector('#shift-date').value = formattedDate;
};

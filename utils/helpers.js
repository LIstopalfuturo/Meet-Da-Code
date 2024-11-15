module.exports = {
    // Format date
    format_date: (date) => {
        return date.toLocaleDateString();
    },
    // Format currency
    format_amount: (amount) => {
        // Convert to number and handle any invalid values
        const num = Number(amount);
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(isNaN(num) ? 0 : num);
    },
    // Calculate hourly rate
    calc_hourly: (amount, hours) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount / hours);
    }
};

module.exports = {
    // Format date
    format_date: (date) => {
        return date.toLocaleDateString();
    },
    // Format currency
    format_amount: (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    },
    // Calculate hourly rate
    calc_hourly: (amount, hours) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount / hours);
    }
};

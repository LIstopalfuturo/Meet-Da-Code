// Global variables for charts
let earningsChart;
let shiftChart;
let currentTimeRange = 'week';

// Initialize analytics when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize charts
    initializeCharts();
    
    // Add event listeners
    document.querySelector('#time-range').addEventListener('change', (e) => {
        currentTimeRange = e.target.value;
        updateCharts();
    });
    
    // Load initial data
    updateCharts();
});

// Initialize chart objects
const initializeCharts = () => {
    // Set up earnings line chart
    const earningsCtx = document.getElementById('earningsChart').getContext('2d');
    earningsChart = new Chart(earningsCtx, {
        type: 'line',
        data: {
            labels: [], // Will be populated with dates
            datasets: [{
                label: 'Daily Tips',
                data: [], // Will be populated with amounts
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                fill: false
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        // Format ticks as currency
                        callback: (value) => '$' + value.toFixed(2)
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        // Format tooltip values as currency
                        label: (context) => '$' + context.raw.toFixed(2)
                    }
                }
            }
        }
    });

    // Set up shift comparison pie chart
    const shiftCtx = document.getElementById('shiftChart').getContext('2d');
    shiftChart = new Chart(shiftCtx, {
        type: 'pie',
        data: {
            labels: ['Day Shift', 'Night Shift'],
            datasets: [{
                data: [0, 0], // Will be populated with shift totals
                backgroundColor: [
                    'rgb(255, 205, 86)',
                    'rgb(54, 162, 235)'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        // Format tooltip values as currency
                        label: (context) => '$' + context.raw.toFixed(2)
                    }
                }
            }
        }
    });
};

// Fetch and update chart data
async function updateCharts() {
    try {
        // Fetch tip data from API
        const response = await fetch(`/api/tips/analytics/${currentTimeRange}`);
        if (!response.ok) {
            throw new Error('Failed to fetch tip data');
        }
        
        const tipData = await response.json();
        
        // Process data for charts
        const processedData = processChartData(tipData);
        
        // Update charts with new data
        updateEarningsChart(processedData.dailyTotals);
        updateShiftChart(processedData.shiftTotals);
        updateSummaryStats(processedData.stats);
        
    } catch (err) {

        console.error('Error updating charts:', err);
        showAlert('Failed to load analytics data. Please try again later.', 'danger');

        

    }
}

// Process raw tip data for charts
function processChartData(tipData) {
    // Initialize data structures
    const dailyTotals = {};
    const shiftTotals = { day: 0, night: 0 };
    let totalAmount = 0;
    let totalHours = 0;
    let dayShiftCount = 0;
    let nightShiftCount = 0;

    // Additional statistics for detailed table
    let bestDayShift = { date: null, amount: 0 };
    let bestNightShift = { date: null, amount: 0 };
    let bestOverall = { date: null, amount: 0 };
    let dayShiftHours = 0;
    let nightShiftHours = 0;

    // Process each tip entry
    tipData.forEach(tip => {
        // Convert amount and hours to numbers
        const amount = parseFloat(tip.amount);
        const hours = parseFloat(tip.hours_worked);
        
        // Format date for consistency
        const date = new Date(tip.shift_date).toLocaleDateString();
        
        // Accumulate daily totals
        dailyTotals[date] = (dailyTotals[date] || 0) + amount;
        totalAmount += amount;
        totalHours += hours;

        // Accumulate shift totals
        if (tip.shift_type.toLowerCase() === 'day') {
            shiftTotals.day += amount;
            dayShiftCount++;
            dayShiftHours += hours;
            if (amount > bestDayShift.amount) {
                bestDayShift = { date: tip.shift_date, amount };
            }
        } else if (tip.shift_type.toLowerCase() === 'night') {
            shiftTotals.night += amount;
            nightShiftCount++;
            nightShiftHours += hours;
            if (amount > bestNightShift.amount) {
                bestNightShift = { date: tip.shift_date, amount };
            }
        }

        if (amount > bestOverall.amount) {
            bestOverall = { date: tip.shift_date, amount };
        }
    });

    // Calculate averages
    const averageRate = totalHours > 0 ? totalAmount / totalHours : 0;
    const averagePerShift = (dayShiftCount + nightShiftCount) > 0 ? 
        totalAmount / (dayShiftCount + nightShiftCount) : 0;
    const dayShiftAvg = dayShiftCount > 0 ? shiftTotals.day / dayShiftCount : 0;
    const nightShiftAvg = nightShiftCount > 0 ? shiftTotals.night / nightShiftCount : 0;

    // Return processed data
    return {
        dailyTotals,
        shiftTotals,
        stats: {
            totalAmount: parseFloat(totalAmount),
            averageRate: parseFloat(averageRate),
            averagePerShift: parseFloat(averagePerShift),
            totalHours: parseFloat(totalHours),
            dayShiftAvg: parseFloat(dayShiftAvg),
            nightShiftAvg: parseFloat(nightShiftAvg),
            // Add new statistics
            dayShiftHours: parseFloat(dayShiftHours),
            nightShiftHours: parseFloat(nightShiftHours),
            bestDayShift,
            bestNightShift,
            bestOverall
        }
    };
}

// Update earnings chart with new data
function updateEarningsChart(dailyTotals) {
    const dates = Object.keys(dailyTotals);
    const amounts = Object.values(dailyTotals);
    
    earningsChart.data.labels = dates;
    earningsChart.data.datasets[0].data = amounts;
    earningsChart.update();
}

// Update shift chart with new data
function updateShiftChart(shiftTotals) {
    shiftChart.data.datasets[0].data = [
        shiftTotals.day,
        shiftTotals.night
    ];
    shiftChart.update();
}

// Update summary statistics
function updateSummaryStats(stats) {
    // Update the summary cards with new data
    document.getElementById('total-tips').textContent = `$${stats.totalAmount.toFixed(2)}`;
    document.getElementById('avg-per-shift').textContent = `$${stats.averagePerShift.toFixed(2)}`;
    document.getElementById('avg-per-hour').textContent = `$${stats.averageRate.toFixed(2)}`;
    document.getElementById('total-hours').textContent = `${stats.totalHours.toFixed(1)}`;

    // Update detailed statistics table
    document.querySelector('[data-stat="day-avg"]').textContent = `$${stats.dayShiftAvg.toFixed(2)}`;
    document.querySelector('[data-stat="night-avg"]').textContent = `$${stats.nightShiftAvg.toFixed(2)}`;
    document.querySelector('[data-stat="overall-avg"]').textContent = `$${stats.averagePerShift.toFixed(2)}`;

    document.querySelector('[data-stat="day-best-date"]').textContent = new Date(stats.bestDayShift.date).toLocaleDateString();
    document.querySelector('[data-stat="day-best-amount"]').textContent = `$${stats.bestDayShift.amount.toFixed(2)}`;
    
    document.querySelector('[data-stat="night-best-date"]').textContent = new Date(stats.bestNightShift.date).toLocaleDateString();
    document.querySelector('[data-stat="night-best-amount"]').textContent = `$${stats.bestNightShift.amount.toFixed(2)}`;
    
    document.querySelector('[data-stat="overall-best-date"]').textContent = new Date(stats.bestOverall.date).toLocaleDateString();
    document.querySelector('[data-stat="overall-best-amount"]').textContent = `$${stats.bestOverall.amount.toFixed(2)}`;

    document.querySelector('[data-stat="day-hours"]').textContent = stats.dayShiftHours.toFixed(1);
    document.querySelector('[data-stat="night-hours"]').textContent = stats.nightShiftHours.toFixed(1);
    document.querySelector('[data-stat="total-hours"]').textContent = stats.totalHours.toFixed(1);
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.querySelector('.analytics-container').prepend(alertDiv);
    
    setTimeout(() => alertDiv.remove(), 5000);
}

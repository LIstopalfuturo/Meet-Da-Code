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
        // showAlert(err.message, 'danger');
    }
}

// Process raw tip data for charts
function processChartData(tipData) {
    // Initialize data structures
    const dailyTotals = {};
    const shiftTotals = { day: 0, night: 0 };
    let totalAmount = 0;
    let totalHours = 0;

    // Process each tip entry
    tipData.forEach(tip => {
        // Format date for consistency
        const date = new Date(tip.shift_date).toLocaleDateString();
        
        // Accumulate daily totals
        dailyTotals[date] = dailyTotals[date] ? dailyTotals[date] + tip.amount : tip.amount;
        totalAmount += tip.amount;
        totalHours += tip.hours;

        // Accumulate shift totals
        if (tip.shift === 'Day') {
            shiftTotals.day += tip.amount;
        } else if (tip.shift === 'Night') {
            shiftTotals.night += tip.amount;
        }
    });

    // Calculate average hourly rate
    const averageRate = totalAmount / totalHours;

    // Return processed data
    return {
        dailyTotals,
        shiftTotals,
        stats: {
            totalAmount,
            averageRate
        }
    };
}

(() => {
    'use strict'
  
    // Graphs
    const ctx = document.getElementById('chart-watch-report')
    // eslint-disable-next-line no-unused-vars
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [
                '2024.12.30',
                '2024.12.31',
                '2025.01.01',
                '2025.01.02',
                '2025.01.03',
                '2025.01.04',
                '2025.01.05'
            ],
            datasets: [{
                data: [
                    64.5,
                    63.1,
                    65.6,
                    68.9,
                    63.1,
                    64.8,
                    62.5
                ],
                lineTension: 0,
                backgroundColor: 'transparent',
                borderColor: '#007bff',
                borderWidth: 4,
                pointBackgroundColor: '#007bff'
            }]
        },
        options: {
            plugins: {
                legend: { display: false },
                tooltip: { boxPadding: 3 }
            }
        }
    })
  })()
// Load the CSV file using D3.js
// const { GoogleGenerativeAI } = require("@google/generative-ai");

// async function generateStory() {
//     const genAI = new GoogleGenerativeAI('jbdfwiebfiw'); // Your API key here

//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     const prompt = "Write a story about a magic backpack.";

//     const result = await model.generateContent(prompt);
//     console.log(result.response.text());
// }

// generateStory();


d3.csv('ListofTrades.csv').then(function(data) { // Adjust path here
    const tradeNumbers = [];
    const profits = [];
    const cumProfits = [];
    const dates = [];

    // Parse the CSV data
    data.forEach(row => {
        tradeNumbers.push(row['Trade #']);
        profits.push(parseFloat(row['Profit INR']));
        cumProfits.push(parseFloat(row['Cum. Profit INR']));
        dates.push(new Date(row['Date/Time'])); // Parse date
    });

    let tradeChart; // Declare a variable for the chart
    let tradeChart2; // Declare a variable for the chart

    function createChart(filteredData) {
        const ctx = document.getElementById('tradeChart').getContext('2d');

        // If the chart already exists, destroy it before creating a new one
        if (tradeChart) {
            tradeChart.destroy();
        }

        const tradeNumbersFiltered = filteredData.map(row => row['Trade #']);
        const profitsFiltered = filteredData.map(row => parseFloat(row['Profit INR']));
        const cumProfitsFiltered = filteredData.map(row => parseFloat(row['Cum. Profit INR']));

        tradeNumbersFiltered.reverse();
        profitsFiltered.reverse();
        cumProfitsFiltered.reverse();


        tradeChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: tradeNumbersFiltered,
                datasets: [
                    {
                        label: 'Profit INR',
                        data: profitsFiltered,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                        fill: false,
                    },
                    {
                        label: 'Cumulative Profit INR',
                        data: cumProfitsFiltered,
                        backgroundColor: 'rgba(153, 102, 255, 0.2)',
                        borderColor: 'rgba(153, 102, 255, 1)',
                        borderWidth: 1,
                        fill: false,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Trade #'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Profit INR'
                        }
                    }
                }
            }
        });
    }

    function createChart2(filteredData) {
        const ctx = document.getElementById('tradeChart2').getContext('2d');
    
        // If the chart already exists, destroy it before creating a new one
        if (tradeChart2) {
            tradeChart2.destroy();
        }
    
        const datesFiltered = filteredData.map(row => row['Date/Time']);
        const runUpPercentagesFiltered = filteredData.map(row => parseFloat(row['Run-up %']));
    
        // Reverse the data for proper chronological plotting (if needed)
        datesFiltered.reverse();
        runUpPercentagesFiltered.reverse();
    
        tradeChart2 = new Chart(ctx, {
            type: 'line',
            data: {
                labels: datesFiltered,  // X-axis labels (dates)
                datasets: [{
                    label: 'Run-up %',
                    data: runUpPercentagesFiltered,  // Y-axis data
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Date/Time'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Run-up %'
                        }
                    }
                }
            }
        });
    }
    
    
    // Call createChart2 with data passed from Python
    
    

    // function createChart2(filteredData) {
    //     const ctx = document.getElementById('tradeChart2').getContext('2d');

    //     // If the chart already exists, destroy it before creating a new one
    //     if (tradeChart2) {
    //         tradeChart2.destroy();
    //     }

    //     const tradeNumbersFiltered = filteredData.map(row => row['Trade #']);
    //     const profitsFiltered = filteredData.map(row => parseFloat(row['Profit INR']));
    //     const cumProfitsFiltered = filteredData.map(row => parseFloat(row['Cum. Profit INR']));

    //     tradeNumbersFiltered.reverse();
    //     profitsFiltered.reverse();
    //     cumProfitsFiltered.reverse();


    //     tradeChart2 = new Chart(ctx, {
    //         type: 'line',
    //         data: {
    //             labels: tradeNumbersFiltered,
    //             datasets: [
    //                 {
    //                     label: 'Profit INR',
    //                     data: profitsFiltered,
    //                     backgroundColor: 'rgba(75, 192, 192, 0.2)',
    //                     borderColor: 'rgba(75, 192, 192, 1)',
    //                     borderWidth: 1,
    //                     fill: false,
    //                 },
    //                 {
    //                     label: 'Cumulative Profit INR',
    //                     data: cumProfitsFiltered,
    //                     backgroundColor: 'rgba(153, 102, 255, 0.2)',
    //                     borderColor: 'rgba(153, 102, 255, 1)',
    //                     borderWidth: 1,
    //                     fill: false,
    //                 }
    //             ]
    //         },
    //         options: {
    //             responsive: true,
    //             maintainAspectRatio: false,
    //             scales: {
    //                 x: {
    //                     title: {
    //                         display: true,
    //                         text: 'Trade #'
    //                     }
    //                 },
    //                 y: {
    //                     beginAtZero: true,
    //                     title: {
    //                         display: true,
    //                         text: 'Profit INR'
    //                     }
    //                 }
    //             }
    //         }
    //     });
    // }

    function calculateProfitFactor(filteredData) {
        let grossProfit = 0;
        let grossLoss = 0;
    
        filteredData.forEach(row => {
            const profit = parseFloat(row['Profit INR']);
            if (profit > 0) {
                grossProfit += profit; // Sum profits
            } else if (profit < 0) {
                grossLoss += profit; // Sum losses (this will be negative)
            }
        });
    
        grossLoss = Math.abs(grossLoss); // Make gross loss positive for the profit factor calculation
        const profitFactor = grossLoss === 0 ? Infinity : grossProfit / grossLoss; // Avoid division by zero
    
        console.log(`Gross Profit: ${grossProfit}`);
        console.log(`Gross Loss: ${grossLoss}`);
        console.log(`Profit Factor: ${profitFactor}`);

        document.getElementsByClassName('metrics1-value')[0].innerHTML = profitFactor.toFixed(2);
    }

    function calculateWinRate(data) {
        const winCount = data.filter(row => parseFloat(row['Profit INR']) > 0).length;
        const winRate = (winCount / data.length) * 100;
        console.log(`Win Rate: ${winRate.toFixed(2)}%`);

        document.getElementsByClassName('metrics2-value')[0].innerHTML = winRate.toFixed(2);

    }

    function calculateAverageTradeProfit(data) {
        const totalProfit = data.reduce((sum, row) => sum + parseFloat(row['Profit INR']), 0);
        const averageTradeProfit = totalProfit / data.length;
        console.log(`Average Trade Profit: ${averageTradeProfit.toFixed(2)} INR`);
        document.getElementsByClassName('metrics3-value')[0].innerHTML = averageTradeProfit.toFixed(2);
    }

    function calculateMaxDrawdown(data) {
        let cumProfit = 0;
        let peak = -Infinity;
        let maxDrawdown = 0;
    
        data.forEach(row => {
            cumProfit += parseFloat(row['Profit INR']);
            peak = Math.max(peak, cumProfit);
            const drawdown = cumProfit - peak;
            maxDrawdown = Math.min(maxDrawdown, drawdown);
        });
    
        console.log(`Maximum Drawdown: ${maxDrawdown.toFixed(2)} INR`);

        document.getElementsByClassName('metrics4-value')[0].innerHTML = maxDrawdown.toFixed(2);
    }
    
    function calculateSharpeRatio(data, riskFreeRate = 0.01) {
        const meanReturn = data.reduce((sum, row) => sum + parseFloat(row['Profit %']), 0) / data.length;
        const variance = data.reduce((sum, row) => sum + Math.pow(parseFloat(row['Profit %']) - meanReturn, 2), 0) / data.length;
        const stdDev = Math.sqrt(variance);
    
        const sharpeRatio = stdDev === 0 ? Infinity : (meanReturn - riskFreeRate) / stdDev;
        console.log(`Sharpe Ratio: ${sharpeRatio.toFixed(2)}`);
    }

    function calculateAverageWinLoss(data) {
        const wins = data.filter(row => parseFloat(row['Profit INR']) > 0);
        const losses = data.filter(row => parseFloat(row['Profit INR']) < 0);
    
        const averageWin = wins.length > 0 ? 
            wins.reduce((sum, row) => sum + parseFloat(row['Profit INR']), 0) / wins.length : 0;
        const averageLoss = losses.length > 0 ? 
            losses.reduce((sum, row) => sum + parseFloat(row['Profit INR']), 0) / losses.length : 0;
    
        console.log(`Average Win: ${averageWin.toFixed(2)} INR`);
        console.log(`Average Loss: ${averageLoss.toFixed(2)} INR`);
    }
    
    function calculateExpectancy(data) {
        const winCount = data.filter(row => parseFloat(row['Profit INR']) > 0).length;
        const totalTrades = data.length;
    
        const winRate = winCount / totalTrades;
        
        const wins = data.filter(row => parseFloat(row['Profit INR']) > 0);
        const losses = data.filter(row => parseFloat(row['Profit INR']) < 0);
    
        const averageWin = wins.length > 0 ? 
            wins.reduce((sum, row) => sum + parseFloat(row['Profit INR']), 0) / wins.length : 0;
        const averageLoss = losses.length > 0 ? 
            losses.reduce((sum, row) => sum + parseFloat(row['Profit INR']), 0) / losses.length : 0;
    
        const expectancy = (winRate * averageWin) - ((1 - winRate) * Math.abs(averageLoss));
        
        console.log(`Expectancy: ${expectancy.toFixed(2)} INR`);

        document.getElementsByClassName('metrics5-value')[0].innerHTML = expectancy.toFixed(2);
    }
    

    // Initial chart creation with all data
    createChart(data);
    // createChart2(data);
    calculateProfitFactor(data);
    calculateWinRate(data);
    calculateAverageTradeProfit(data);
    calculateMaxDrawdown(data);
    calculateSharpeRatio(data);
    calculateAverageWinLoss(data);
    calculateExpectancy(data);


    // Filter button functionality
    document.getElementById('filterBtn').addEventListener('click', function() {
        const startDate = new Date(document.getElementById('startDate').value);
        const endDate = new Date(document.getElementById('endDate').value);

        // Filter the data based on date range
        const filteredData = data.filter(row => {
            const rowDate = new Date(row['Date/Time']);
            return rowDate >= startDate && rowDate <= endDate;
        });

        createChart(filteredData);
        // createChart2(filteredData);
        calculateProfitFactor(filteredData);
        calculateWinRate(filteredData);
        calculateAverageTradeProfit(filteredData);
        calculateMaxDrawdown(filteredData);
        calculateSharpeRatio(filteredData);
        calculateAverageWinLoss(filteredData);
        calculateExpectancy(filteredData);
        
    });

}).catch(function(error) {
    console.error('Error loading CSV data:', error);
});




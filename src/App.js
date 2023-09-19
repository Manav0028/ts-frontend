import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { createChart } from 'lightweight-charts';

function CandlestickChart() {
    const [candlestickData, setCandlestickData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [chartInstance, setChartInstance] = useState(null); // Track the chart instance

    useEffect(() => {
        // Fetch candlestick data from your API or source
        axios.get('http://localhost:8080/api/charts/NASDAQ/AAPL')
            .then((response) => {
                setCandlestickData(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        if (!isLoading && !chartInstance) {
            // Create a new chart instance
            const chart = createChart('chart-container', { width: 800, height: 400 });

            // Create a new candlestick series
            const candlestickSeries = chart.addCandlestickSeries();

            // Add candlestick data to the series
            candlestickSeries.setData(candlestickData);

            // Save the chart instance
            setChartInstance(chart);
        }
    }, [candlestickData, isLoading, chartInstance]);

    return (
        <div>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div id="chart-container" />
            )}
        </div>
    );
}

export default CandlestickChart;

import './App.css';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { createChart } from 'lightweight-charts';

function CandlestickChart() {
    const [candlestickData, setCandlestickData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [chartInstance, setChartInstance] = useState(null);
    const [loadCount, setLoadCount] = useState(0);
    const chartContainerRef = useRef(null);

    // Function to fetch candlestick data
    const fetchCandlestickData = () => {
        // Fetch candlestick data from your API or source
        axios
            .get(`http://localhost:8080/api/charts/NASDAQ/AAPL/${loadCount}`)
            .then((response) => {
                // Prepend the new data to the existing data
                setCandlestickData((prevData) => [...response.data, ...prevData]);
                console.log(loadCount);
                console.log(candlestickData);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setIsLoading(false);
            });
    };

    // Initial data fetch
    // useEffect(() => {
    //     if(loadCount === 0) {
    //         fetchCandlestickData();
    //         setLoadCount((prevCount) => prevCount + 1);
    //     }
    // }, []);

    useEffect(() => {
        if (!isLoading && !chartInstance) {
            // Create a new chart instance
            const chart = createChart(chartContainerRef.current, { width: 800, height: 400 });

            // Create a new candlestick series
            const candlestickSeries = chart.addCandlestickSeries();

            // Add candlestick data to the series
            candlestickSeries.setData(candlestickData);

            // Save the chart instance
            setChartInstance(chart);
        }
    }, [candlestickData, isLoading, chartInstance]);

    // Function to handle loading more data on button click
    const handleLoadMoreClick = () => {
        setIsLoading(true);

        // Fetch more data
        fetchCandlestickData();
        setLoadCount((prevCount) => prevCount + 1);
        // updateChart();
    };

    // Function to update the chart with new data
    const updateChart = () => {
        if (chartInstance) {
            // Remove the existing chart
            // chartInstance.remove();
        }
        // handleLoadMoreClick();
        // Create a new chart instance
        const chart = createChart(chartContainerRef.current, { width: 800, height: 400 });

        // Create a new candlestick series
        const candlestickSeries = chart.addCandlestickSeries();

        // Add candlestick data to the series
        candlestickSeries.setData(candlestickData);

        // Save the chart instance
        setChartInstance(chart);
    };

    return (
        <div>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div
                    id="chart-container"
                    ref={chartContainerRef}
                    style={{
                        width: '800px',
                        height: '400px',
                        overflowX: 'scroll',
                        position: 'relative',
                    }}
                />
            )}
            <button onClick={handleLoadMoreClick}>Load More</button>
            <button onClick={updateChart}>Update Chart</button>
        </div>
    );
}

export default CandlestickChart;

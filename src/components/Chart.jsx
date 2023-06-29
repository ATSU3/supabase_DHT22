import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import supabase from "../config/supabaseClient"

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Supabase Sensor Data',
        },
    },
    scales: {
        y: {
            ticks: {
                stepSize: 10,  // Set the step size
                beginAtZero: true, // start the scale at 0
            }
        }
    }
};

const Chart = () => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            let { data: sensorData, error } = await supabase
                .from('test')
                .select('temperature, humidity, created_at')
                .order('created_at', { ascending: false })
                .limit(8);

            if (error) console.error('Error fetching sensor data', error);
            else {
                sensorData.reverse();
                const chartData = {
                    labels: sensorData.map(data => new Date(data.created_at).toLocaleString()),
                    datasets: [
                        {
                            label: 'Temperature',
                            data: sensorData.map(data => data.temperature),
                            borderColor: 'rgb(255, 99, 132)',
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        },
                        {
                            label: 'Humidity',
                            data: sensorData.map(data => data.humidity),
                            borderColor: 'rgb(53, 162, 235)',
                            backgroundColor: 'rgba(53, 162, 235, 0.5)',
                        },
                    ],
                };
                setChartData(chartData);
            }
        };

        fetchData();
    }, []);

    if (!chartData) {
        return null;
    }

    return (
        <div style={{ overflowX: 'scroll', width: '100%' }}>
            <Line options={options} data={chartData} />
        </div>
    );
};

export default Chart





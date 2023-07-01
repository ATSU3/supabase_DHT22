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
                stepSize: 10,
                beginAtZero: true,
            }
        }
    }
};

const Chart = () => {
    const [sensorData, setSensorData] = useState(null);
    const [startIdx, setStartIdx] = useState(0);
    const MAX_DISPLAY_ITEMS = 6;

    useEffect(() => {
        const fetchData = async () => {
            let { data, error } = await supabase
                .from('test')
                .select('temperature, humidity, created_at')
                .order('created_at', { ascending: false });

            if (error) console.error('Error fetching sensor data', error);
            else {
                data.reverse();
                setSensorData(data);
                setStartIdx(data.length > MAX_DISPLAY_ITEMS ? data.length - MAX_DISPLAY_ITEMS : 0);
            }
        };

        fetchData();
    }, []);

    if (!sensorData) {
        return null;
    }

    const chartData = {
        labels: sensorData.slice(startIdx, startIdx + MAX_DISPLAY_ITEMS).map(data => new Date(data.created_at).toLocaleString()),
        datasets: [
            {
                label: 'Temperature',
                data: sensorData.slice(startIdx, startIdx + MAX_DISPLAY_ITEMS).map(data => data.temperature),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Humidity',
                data: sensorData.slice(startIdx, startIdx + MAX_DISPLAY_ITEMS).map(data => data.humidity),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    return (
        <div style={{ overflowX: 'scroll', width: '100%' }}>
            <Line options={options} data={chartData} />
            <button disabled={startIdx <= 0} onClick={() => setStartIdx(startIdx - 1)}>Previous</button>
            <button disabled={startIdx + MAX_DISPLAY_ITEMS >= sensorData.length} onClick={() => setStartIdx(startIdx + 1)}>Next</button>
        </div>
    );
};

export default Chart

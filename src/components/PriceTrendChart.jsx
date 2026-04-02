import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PriceTrendChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="chart-placeholder">No price data available for trends.</div>;
  }

  const chartData = {
    labels: data.map(d => d.month),
    datasets: [
      {
        label: 'Price Trend (INR)',
        data: data.map(d => d.price),
        borderColor: '#0071e3', // Apple Blue
        backgroundColor: 'rgba(0, 113, 227, 0.05)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: '#0071e3',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1d1d1f',
        bodyColor: '#1d1d1f',
        borderColor: 'rgba(0,0,0,0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 12,
        callbacks: {
          label: (context) => `Price: ₹${context.parsed.y.toLocaleString()}`
        }
      }
    },
    scales: {
      y: {
        grid: { color: 'rgba(0,0,0,0.03)' },
        ticks: { 
          color: '#86868b',
          callback: (value) => `₹${value.toLocaleString()}`,
          font: { size: 11 }
        },
        border: { display: false },
        // Ensure the chart doesn't collapse if prices are low
        suggestedMin: 0,
        suggestedMax: Math.max(...data.map(d => d.price)) + 100
      },
      x: {
        grid: { display: false },
        ticks: { color: '#86868b', font: { size: 11 } },
        border: { display: false }
      }
    }
  };

  return (
    <div className="chart-container animate-spring">
      <Line data={chartData} options={options} />
      <style>{`
        .chart-container {
          width: 100%;
          min-height: 350px;
          height: 350px;
          margin-top: 2rem;
          padding: 1rem;
          background: rgba(0,0,0,0.015);
          border-radius: 16px;
          border: 1px solid rgba(0,0,0,0.02);
        }
        .chart-placeholder {
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #86868b;
          font-size: 0.9rem;
          background: rgba(0,0,0,0.02);
          border-radius: 12px;
          margin-top: 2rem;
        }
      `}</style>
    </div>
  );
};

export default PriceTrendChart;

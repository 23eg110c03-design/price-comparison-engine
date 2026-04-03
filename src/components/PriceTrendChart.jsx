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
        borderColor: '#00ffd2', // Luminous Teal
        backgroundColor: (context) => {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          if (!chartArea) return null;
          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, 'rgba(0, 255, 210, 0)');
          gradient.addColorStop(1, 'rgba(0, 255, 210, 0.2)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        borderWidth: 4,
        pointBackgroundColor: '#00ffd2',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#00ffd2',
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
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1d1d1f',
        bodyColor: '#1d1d1f',
        borderColor: 'rgba(0, 255, 210, 0.3)',
        borderWidth: 1,
        padding: 14,
        cornerRadius: 12,
        callbacks: {
          label: (context) => `Price: ₹${context.parsed.y.toLocaleString('en-IN')}`
        }
      }
    },
    scales: {
      y: {
        grid: { color: 'rgba(0,0,0,0.03)', drawTicks: false },
        ticks: { 
          color: '#86868b',
          callback: (value) => `₹${value.toLocaleString('en-IN')}`,
          font: { size: 10, weight: '500' },
          padding: 10
        },
        border: { display: false },
        suggestedMin: 0,
        suggestedMax: Math.max(...data.map(d => d.price)) * 1.1
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

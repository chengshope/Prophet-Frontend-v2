import { useMemo, useRef, useEffect } from 'react';
import { Card } from 'antd';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './LineChart.less';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const LineChart = ({
  data,
  dataKey,
  title,
  color = '#1890ff',
  strokeWidth = 1,
  formatter,
  tooltipLabel,
  height = 320,
  domain = null,
  style = {},
  ...props
}) => {
  const chartData = {
    labels: data.map((item) => item.formattedDate),
    datasets: [
      {
        label: tooltipLabel || dataKey,
        data: data.map((item) => item[dataKey]),
        borderColor: color,
        backgroundColor: `${color}20`,
        borderWidth: strokeWidth,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: color,
        pointBorderColor: color,
        pointRadius: 2,
        pointHoverRadius: 3,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10,
      },
    },
    plugins: {
      legend: {
        display: false, // Hide legend since we only have one dataset
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function (context) {
            const value = context.parsed.y;
            const formattedValue = formatter ? formatter(value) : value;
            return `${tooltipLabel || dataKey}: ${formattedValue}`;
          },
        },
        backgroundColor: 'white',
        titleColor: '#262626',
        bodyColor: '#262626',
        borderColor: '#d9d9d9',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: '#e0e0e0',
          drawBorder: true,
        },
        ticks: {
          color: '#595959',
          fontSize: 12,
        },
        border: {
          color: '#d9d9d9',
          width: 1,
        },
      },
      y: {
        min: domain && domain[0] !== undefined ? domain[0] : 0, // Respect domain or default to 0
        beginAtZero: true, // Always start from zero for occupancy charts
        suggestedMax: domain && domain[1] && domain[1] !== 'dataMax + 4' ? domain[1] : 100, // Respect domain or suggest 100%
        grid: {
          drawBorder: true,
          drawOnChartArea: true,
          lineWidth: function (context) {
            // Make the zero line more prominent
            return context.tick.value === 0 ? 2 : 1;
          },
          color: function (context) {
            // Make the zero line darker
            return context.tick.value === 0 ? '#999999' : '#e0e0e0';
          },
        },
        ticks: {
          color: '#595959',
          fontSize: 12,
          callback: function (value) {
            return formatter ? formatter(value) : value;
          },
        },
        border: {
          color: '#d9d9d9',
          width: 1,
        },
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };

  return (
    <Card
      title={title}
      style={{ height: '100%', ...style }}
      styles={{ body: { padding: '16px' } }}
      {...props}
      className="line-chart-container"
    >
      <div style={{ height: `${height}px`, width: '100%', position: 'relative' }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </Card>
  );
};

export default LineChart;

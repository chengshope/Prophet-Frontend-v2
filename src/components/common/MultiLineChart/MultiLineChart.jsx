import { useMemo, useRef, useEffect, useState } from 'react';
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
import './MultiLineChart.less';

// Register Chart.js components once
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

const MultiLineChart = ({
  data = [],
  dataKey = 'value',
  title = 'Chart',
  height = 320,
  formatter = (value) => value,
  domain = [0, 'dataMax'],
  style = {},
  ...props
}) => {
  const chartRef = useRef(null);

  // Generate a palette of colors
  const generateColors = (count) => {
    const baseColors = [
      '#1890ff',
      '#52c41a',
      '#fa8c16',
      '#722ed1',
      '#eb2f96',
      '#13c2c2',
      '#faad14',
      '#f5222d',
      '#2f54eb',
      '#a0d911',
    ];
    // Repeat colors if more series than baseColors
    return Array.from({ length: count }, (_, i) => baseColors[i % baseColors.length]);
  };

  // Prepare datasets & labels
  const chartData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return { labels: [], datasets: [] };
    }

    // Collect and sort all unique dates
    const allDates = new Set();
    data.forEach((facility) => {
      facility.data?.forEach((item) => {
        allDates.add(item.formattedDate || item.date);
      });
    });
    const sortedDates = [...allDates].sort();

    const colors = generateColors(data.length);

    const datasets = data.map((facility, index) => {
      const facilityData = sortedDates.map((date) => {
        const found = facility.data?.find((item) => (item.formattedDate || item.date) === date);
        return found ? found[dataKey] : null;
      });

      return {
        label: facility.facilityName || `Facility ${facility.facilityId || index + 1}`,
        data: facilityData,
        borderColor: colors[index],
        backgroundColor: `${colors[index]}20`,
        borderWidth: 1,
        pointBackgroundColor: colors[index],
        pointBorderColor: colors[index],
        pointRadius: 2,
        pointHoverRadius: 3,
        fill: false,
        tension: 0.4,
        spanGaps: true,
      };
    });

    return { labels: sortedDates, datasets };
  }, [data, dataKey]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: 10 },
      plugins: {
        legend: {
          position: 'top',
          labels: { usePointStyle: true, pointStyle: 'rect' },
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'white',
          titleColor: '#262626',
          bodyColor: '#262626',
          borderColor: '#d9d9d9',
          borderWidth: 1,
          callbacks: {
            label: (context) => `${context.dataset.label || ''}: ${formatter(context.parsed.y)}`,
          },
        },
      },
      interaction: { mode: 'index', intersect: false },
      scales: {
        x: {
          grid: { color: '#bbbbbb60', drawBorder: true },
          ticks: { color: '#595959', font: { size: 12 } },
          border: { color: '#bbbbbb60', width: 1 },
        },
        y: {
          min: domain?.[0] ?? 0,
          beginAtZero: true,
          suggestedMax: domain?.[1] && domain[1] !== 'dataMax + 4' ? domain[1] : 100,
          grid: {
            drawBorder: true,
            drawOnChartArea: true,
            lineWidth: (ctx) => (ctx.tick.value === 0 ? 2 : 1),
            color: (ctx) => (ctx.tick.value === 0 ? '#999999' : '#bbbbbb60'),
          },
          ticks: {
            color: '#595959',
            font: { size: 12 },
            callback: (value) => formatter(value),
          },
          border: { color: '#bbbbbb60', width: 1 },
        },
      },
    }),
    [formatter, domain]
  );

  return (
    <Card
      title={title}
      style={{ height: '100%', ...style }}
      styles={{ padding: 16 }}
      className="multi-line-chart-container"
      {...props}
    >
      <div style={{ height: `${height}px`, width: '100%', position: 'relative' }}>
        <Line ref={chartRef} data={chartData} options={chartOptions} />
      </div>
    </Card>
  );
};

export default MultiLineChart;

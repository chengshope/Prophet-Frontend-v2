import { Card } from 'antd';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import './LineChart.less';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const LineChart = ({
  data = [],
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
  const safeData = Array.isArray(data) ? data : [];

  const chartData = useMemo(
    () => ({
      labels: safeData.map((item) => item.formattedDate),
      datasets: [
        {
          label: tooltipLabel || dataKey,
          data: safeData.map((item) => item[dataKey]),
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
    }),
    [safeData, dataKey, color, strokeWidth, tooltipLabel]
  );

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: 10 },
      plugins: {
        legend: { display: false },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: (context) => {
              const value = context.parsed.y;
              return `${tooltipLabel || dataKey}: ${formatter ? formatter(value) : value}`;
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
            callback: (v) => (formatter ? formatter(v) : v),
          },
          border: { color: '#bbbbbb60', width: 1 },
        },
      },
      interaction: { mode: 'index', intersect: false },
    }),
    [dataKey, tooltipLabel, formatter, domain]
  );

  return (
    <Card
      title={title}
      style={{ height: '100%', ...style }}
      styles={{ padding: 16 }}
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

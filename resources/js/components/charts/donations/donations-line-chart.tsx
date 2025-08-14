import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface DonationData {
  month: string;
  count?: number;
  fulfilled?: number;
  year: number;
}

interface DonationsLineChartProps {
  data: DonationData[];
}

export default function DonationsLineChart({ data }: DonationsLineChartProps) {
  // Custom tooltip to show more detailed information
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{`${label} ${data.year}`}</p>
          <p className="text-rose-600">
            <span className="font-medium">Donations: </span>
            <span className="font-bold">{payload[0].value || 0}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Handle empty data case
  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p>No donation data available</p>
        </div>
      </div>
    );
  }

  // Calculate some stats for better visualization
  const counts = data.map(d => d.count || 0);
  const maxValue = Math.max(...counts);
  const minValue = Math.min(...counts);
  const avgValue = Math.round(counts.reduce((sum, count) => sum + count, 0) / counts.length);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: '#e0e0e0' }}
            tickLine={{ stroke: '#e0e0e0' }}
          />
          <YAxis 
            allowDecimals={false}
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: '#e0e0e0' }}
            tickLine={{ stroke: '#e0e0e0' }}
            domain={[0, maxValue + Math.ceil(maxValue * 0.1)]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="count" 
            stroke="#e11d48" 
            strokeWidth={3}
            dot={{ fill: '#e11d48', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#e11d48', strokeWidth: 2, fill: '#fff' }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
      
      {/* Quick stats below the chart */}
      <div className="mt-2 flex justify-between text-xs text-gray-600">
        <span>Avg: {avgValue}</span>
        <span>Min: {minValue}</span>
        <span>Max: {maxValue}</span>
      </div>
    </div>
  );
}
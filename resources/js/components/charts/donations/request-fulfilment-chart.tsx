import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface FulfillmentData {
  month: string;
  count?: number;
  fulfilled?: number;
  year: number;
}

interface RequestFulfilmentChartProps {
  data: FulfillmentData[];
}

export default function RequestFulfilmentChart({ data }: RequestFulfilmentChartProps) {
  // Custom tooltip to show more detailed information
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{`${label} ${data.year}`}</p>
          <p className="text-emerald-600">
            <span className="font-medium">Fulfilled: </span>
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
          <p>No fulfillment data available</p>
        </div>
      </div>
    );
  }

  // Calculate some stats for better visualization
  const fulfilledCounts = data.map(d => d.fulfilled || 0);
  const maxValue = Math.max(...fulfilledCounts);
  const minValue = Math.min(...fulfilledCounts);
  const totalFulfilled = fulfilledCounts.reduce((sum, count) => sum + count, 0);
  const avgValue = Math.round(totalFulfilled / fulfilledCounts.length);

  // Calculate trend
  const firstHalf = data.slice(0, Math.ceil(data.length / 2));
  const secondHalf = data.slice(Math.ceil(data.length / 2));
  const firstHalfAvg = firstHalf.reduce((sum, d) => sum + (d.fulfilled || 0), 0) / firstHalf.length;
  const secondHalfAvg = secondHalf.reduce((sum, d) => sum + (d.fulfilled || 0), 0) / secondHalf.length;
  const trendDirection = secondHalfAvg > firstHalfAvg ? 'up' : secondHalfAvg < firstHalfAvg ? 'down' : 'stable';
  const trendPercentage = firstHalfAvg > 0 ? Math.abs(((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100) : 0;

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
          <Area 
            type="monotone" 
            dataKey="fulfilled" 
            stroke="#10b981" 
            fill="#d1fae5" 
            strokeWidth={3}
            fillOpacity={0.6}
            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2, fill: '#fff' }}
          />
        </AreaChart>
      </ResponsiveContainer>
      
      {/* Quick stats and trend indicator */}
      <div className="mt-2 flex justify-between items-center text-xs">
        <div className="flex gap-4 text-gray-600">
          <span>Total: {totalFulfilled.toLocaleString()}</span>
          <span>Avg: {avgValue}</span>
          <span>Range: {minValue}-{maxValue}</span>
        </div>
        
        {/* Trend indicator */}
        <div className={`flex items-center gap-1 ${
          trendDirection === 'up' ? 'text-green-600' : 
          trendDirection === 'down' ? 'text-red-600' : 
          'text-gray-600'
        }`}>
          <span className="text-xs font-medium">
            {trendDirection === 'up' && '↗ '}
            {trendDirection === 'down' && '↘ '}
            {trendDirection === 'stable' && '→ '}
            {trendDirection !== 'stable' && `${trendPercentage.toFixed(1)}%`}
            {trendDirection === 'stable' && 'Stable'}
          </span>
        </div>
      </div>
    </div>
  );
}
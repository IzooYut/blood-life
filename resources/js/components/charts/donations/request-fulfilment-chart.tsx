import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function RequestFulfilmentChart({ data }: { data: { month: string; fulfilled: number }[] }) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Area type="monotone" dataKey="fulfilled" stroke="#10b981" fill="#d1fae5" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

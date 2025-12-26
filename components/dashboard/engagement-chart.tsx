"use client";

import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, Tooltip } from "recharts";

interface Props {
  data: { date: string; reach: number; engagement: number }[];
}

export function EngagementChart({ data }: Props) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="reach" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#37acf6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#37acf6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="engagement" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis
            dataKey="date"
            stroke="#94a3b8"
            tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
          />
          <Tooltip
            contentStyle={{ background: "#020617", borderRadius: 12, border: "1px solid #1f2937", color: "#e2e8f0" }}
          />
          <Area type="monotone" dataKey="reach" stroke="#38bdf8" fillOpacity={1} fill="url(#reach)" />
          <Area type="monotone" dataKey="engagement" stroke="#a855f7" fillOpacity={1} fill="url(#engagement)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

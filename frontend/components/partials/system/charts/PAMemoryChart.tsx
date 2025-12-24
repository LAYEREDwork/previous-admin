import { BiChip } from 'react-icons/bi';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Metrics } from '../../../../hooks/useSystem';
import { Translations } from '../../../../lib/translations';
import { padDataToWindow, formatBytes } from '../../../../lib/utils';

interface MemoryChartProps {
  metrics: Metrics | null;
  translation: Translations;
}

/**
 * Memory usage chart component displaying memory utilization over time
 */
export function MemoryChart({ metrics, translation }: MemoryChartProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <BiChip size={20} className="text-green-600 dark:text-green-400" />
          {translation.system.memory}
        </h3>
        <div className="text-right">
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{metrics?.memory.current}%</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{formatBytes(metrics?.memory.used || 0)} / {formatBytes(metrics?.memory.total || 0)}</p>
        </div>
      </div>
      {metrics && metrics.memory.history.length >= 1 ? (() => {
        const paddedData = padDataToWindow(metrics.memory.history, 60, { value: undefined });
        const indexedData = paddedData.map((item, index) => ({ ...item, index }));
        return (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={indexedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-200 dark:text-gray-700" />
              <XAxis dataKey="index" hide />
              <YAxis domain={[0, 100]} label={{ value: '%', angle: -90, position: 'insideLeft', style: { fill: '#6b7280' } }} tick={{ fill: '#6b7280' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }}
                formatter={(value: number | undefined) => [`${(value ?? 0).toFixed(1)}%`, 'Memory']}
                labelFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
              />
              <Line type="monotone" dataKey="value" stroke="#10b981" dot={false} strokeWidth={2} isAnimationActive={false} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        );
      })() : (
        <div className="h-48 flex items-center justify-center text-gray-400">{translation.system.collectingData}</div>
      )}
    </div>
  );
}
import { BiChip } from 'react-icons/bi';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Metrics } from '../../../hooks/useSystemMetrics';
import { Translations } from '../../../lib/translations';
import { padDataToWindow } from '../../../../lib/utils';

interface CpuLoadChartProps {
  metrics: Metrics | null;
  translation: Translations;
}

/**
 * CPU Load Chart component displaying 1min, 5min, and 15min load averages
 */
export function CpuLoadChart({ metrics, translation }: CpuLoadChartProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <BiChip size={20} className="text-next-accent" />
          {translation.system.cpuLoadAverage}
        </h3>
        <div className="text-right">
          <p className="text-sm font-semibold flex items-center justify-end gap-2">
            <span style={{ color: '#ea580c' }}>{metrics?.cpuLoad.current.fifteenMin.toFixed(2)}</span>
            <span className="text-gray-400">/</span>
            <span style={{ color: '#16a34a' }}>{metrics?.cpuLoad.current.fiveMin.toFixed(2)}</span>
            <span className="text-gray-400">/</span>
            <span style={{ color: '#2563eb' }}>{metrics?.cpuLoad.current.oneMin.toFixed(2)}</span>
          </p>
        </div>
      </div>
      {metrics && metrics.cpuLoad.history.length >= 1 ? (() => {
        const paddedData = padDataToWindow(metrics.cpuLoad.history, 60, { oneMin: undefined, fiveMin: undefined, fifteenMin: undefined });
        const indexedData = paddedData.map((item, index) => ({ ...item, index }));
        return (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={indexedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-200 dark:text-gray-700" />
              <XAxis dataKey="index" hide tick={false} />
              <YAxis domain={[0, 'auto']} label={{ value: 'Load', angle: -90, position: 'insideLeft', style: { fill: '#6b7280' } }} tick={{ fill: '#6b7280' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }}
                formatter={(value: number | undefined, name: string | undefined) => {
                  const numValue = value ?? 0;
                  const labels: Record<string, string> = {
                    oneMin: '1 min',
                    fiveMin: '5 min',
                    fifteenMin: '15 min'
                  };
                  return [`${numValue.toFixed(2)}`, labels[name || ''] || name || ''];
                }}
                labelFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
              />
              <Legend
                wrapperStyle={{ paddingTop: '20px', color: '#6b7280' }}
                formatter={(value) => {
                  const labels: Record<string, string> = {
                    oneMin: '1 min',
                    fiveMin: '5 min',
                    fifteenMin: '15 min'
                  };
                  return labels[value] || value;
                }}
              />
              <Line type="monotone" dataKey="oneMin" stroke="#2563eb" dot={false} strokeWidth={2} isAnimationActive={false} name="oneMin" />
              <Line type="monotone" dataKey="fiveMin" stroke="#16a34a" dot={false} strokeWidth={2} isAnimationActive={false} name="fiveMin" />
              <Line type="monotone" dataKey="fifteenMin" stroke="#ea580c" dot={false} strokeWidth={2} isAnimationActive={false} name="fifteenMin" connectNulls />
            </LineChart>
          </ResponsiveContainer>
        );
      })() : (
        <div className="h-48 flex items-center justify-center text-gray-400">{translation.system.collectingData}</div>
      )}
    </div>
  );
}
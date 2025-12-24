import { BiHdd } from 'react-icons/bi';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Metrics } from '../../../../hooks/useSystem';
import { Translations } from '../../../../lib/translations';
import { padDataToWindow, getOptimalUnit } from '../../../../lib/utils';

interface DiskIOChartProps {
  metrics: Metrics | null;
  translation: Translations;
}

/**
 * Disk I/O chart component displaying read and write operations over time
 */
export function DiskIOChart({ metrics, translation }: DiskIOChartProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
        <BiHdd size={20} className="text-orange-600 dark:text-orange-400" />
        Disk I/O
      </h3>
      {metrics && metrics.diskIO.history.length >= 1 ? (() => {
        const paddedData = padDataToWindow(metrics.diskIO.history, 60, { read: undefined, write: undefined });
        const diskUnit = getOptimalUnit(paddedData.filter(d => d.read !== null));
        const convertedDiskData = paddedData.map((item, index) => ({
          ...item,
          index,
          read: item.read !== null ? item.read / diskUnit.divisor : null,
          write: item.write !== null ? item.write / diskUnit.divisor : null,
        }));
        return (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={convertedDiskData}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-200 dark:text-gray-700" />
              <XAxis dataKey="index" hide />
              <YAxis domain={[0, 'auto']} label={{ value: diskUnit.unit, angle: -90, position: 'insideLeft', style: { fill: '#6b7280' } }} tick={{ fill: '#6b7280' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }}
                formatter={(value: number | undefined, name: string | undefined) => [`${(value ?? 0).toFixed(2)} ${diskUnit.unit}`, name || '']}
                labelFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
              />
              <Legend wrapperStyle={{ paddingTop: '20px', color: '#6b7280' }} />
              <Line type="monotone" dataKey="read" stroke="#3b82f6" name="Read" dot={false} strokeWidth={2} isAnimationActive={false} connectNulls />
              <Line type="monotone" dataKey="write" stroke="#ef4444" name="Write" dot={false} strokeWidth={2} isAnimationActive={false} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        );
      })() : (
        <div className="h-48 flex items-center justify-center text-gray-400">{translation.system.collectingData}</div>
      )}
    </div>
  );
}
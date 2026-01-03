import { BiHdd } from 'react-icons/bi';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import { Metrics } from '../../../../hooks/useSystemMetrics';
import { Translations } from '../../../../lib/translations';
import { padDataToWindow, getOptimalUnit } from '../../../../lib/utils';
import { PACard } from '../../../controls/PACard';

interface DiskIOChartProps {
  metrics: Metrics | null;
  translation: Translations;
}

/**
 * Disk I/O chart component displaying read and write operations over time
 */
export function DiskIOChart({ metrics, translation }: DiskIOChartProps) {
  return (
    <PACard
      bgColorScheme="surface"
      header={
        <h3 className="text-lg font-semibold text-[var(--rs-text-primary)] flex items-center gap-2 m-0 leading-none">
          <BiHdd size={20} className="text-[var(--rs-primary-500)]" />
          Disk I/O
        </h3>
      }
    >
      <div className="p-2">
        {metrics && metrics.diskIO.history.length >= 1 ? (() => {
          const paddedData = padDataToWindow(metrics.diskIO.history, 60, { read: undefined, write: undefined });
          const diskUnit = getOptimalUnit(paddedData.filter(d => d.read !== null));
          const convertedDiskData = paddedData.map((item, index) => ({
            ...item,
            index,
            read: item.read != null ? item.read / diskUnit.divisor : null,
            write: item.write != null ? item.write / diskUnit.divisor : null,
          }));
          return (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={convertedDiskData}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-[var(--rs-border-primary)]" />
                <XAxis dataKey="index" hide />
                <YAxis domain={[0, 'auto']} label={{ value: diskUnit.unit, angle: -90, position: 'insideLeft', style: { fill: 'var(--rs-text-secondary)' } }} tick={{ fill: 'var(--rs-text-secondary)' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--rs-bg-card)',
                    border: '1px solid var(--rs-border-primary)',
                    borderRadius: '8px',
                    color: 'var(--rs-text-primary)'
                  }}
                  itemStyle={{ color: 'var(--rs-text-primary)' }}
                  formatter={(value: number | undefined, name: string | undefined) => [`${(value ?? 0).toFixed(2)} ${diskUnit.unit}`, name || '']}
                  labelFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
                />
                <Legend wrapperStyle={{ paddingTop: '20px', color: 'var(--rs-text-secondary)' }} />
                <Line type="monotone" dataKey="read" stroke="#3b82f6" name="Read" dot={false} strokeWidth={2} isAnimationActive={false} connectNulls />
                <Line type="monotone" dataKey="write" stroke="#ef4444" name="Write" dot={false} strokeWidth={2} isAnimationActive={false} connectNulls />
              </LineChart>
            </ResponsiveContainer>
          );
        })() : (
          <div className="h-48 flex items-center justify-center text-[var(--rs-text-secondary)]">{translation.system.collectingData}</div>
        )}
      </div>
    </PACard>
  );
}
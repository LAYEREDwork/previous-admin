import { BiChip } from 'react-icons/bi';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Metrics } from '../../../../hooks/useSystemMetrics';
import { Translations } from '../../../../lib/translations';
import { padDataToWindow, formatBytes } from '../../../../lib/utils';
import { PACard } from '../../../controls/PACard';

interface MemoryChartProps {
  metrics: Metrics | null;
  translation: Translations;
}

/**
 * Memory usage chart component displaying memory utilization over time
 */
export function MemoryChart({ metrics, translation }: MemoryChartProps) {
  return (
    <PACard
      bgColorScheme="surface"
      header={
        <div className="flex items-center justify-between w-full">
          <h3 className="text-lg font-semibold text-[var(--rs-text-primary)] flex items-center gap-2 m-0 leading-none">
            <BiChip size={20} className="text-[var(--rs-text-success)]" />
            {translation.system.memory}
          </h3>
          <div className="text-right">
            <p className="text-2xl font-bold text-[var(--rs-text-success)]">{metrics?.memory.current}%</p>
            <p className="text-xs text-[var(--rs-text-secondary)]">{formatBytes(metrics?.memory.used || 0)} / {formatBytes(metrics?.memory.total || 0)}</p>
          </div>
        </div>
      }
    >
      <div className="p-2">
        {metrics && metrics.memory.history.length >= 1 ? (() => {
          const paddedData = padDataToWindow(metrics.memory.history, 60, { value: undefined });
          const indexedData = paddedData.map((item, index) => ({ ...item, index }));
          return (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={indexedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-[var(--rs-border-primary)]" />
                <XAxis dataKey="index" hide />
                <YAxis domain={[0, 100]} label={{ value: '%', angle: -90, position: 'insideLeft', style: { fill: 'var(--rs-text-secondary)' } }} tick={{ fill: 'var(--rs-text-secondary)' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--rs-bg-card)',
                    border: '1px solid var(--rs-border-primary)',
                    borderRadius: '8px',
                    color: 'var(--rs-text-primary)'
                  }}
                  itemStyle={{ color: 'var(--rs-text-primary)' }}
                  formatter={(value: number | undefined) => [`${(value ?? 0).toFixed(1)}%`, 'Memory']}
                  labelFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
                />
                <Line type="monotone" dataKey="value" stroke="#10b981" dot={false} strokeWidth={2} isAnimationActive={false} connectNulls />
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
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import { SFCpu } from '@frontend/components/sf-symbols';

import { Metrics } from '../../../../hooks/useSystemMetrics';
import { Translations } from '../../../../lib/translations';
import { padDataToWindow } from '../../../../lib/utils';
import { PACard } from '../../../controls/PACard';

interface CpuLoadChartProps {
  metrics: Metrics | null;
  translation: Translations;
}

/**
 * CPU Load Chart component displaying 1min, 5min, and 15min load averages
 */
export function CpuLoadChart({ metrics, translation }: CpuLoadChartProps) {
  return (
    <PACard
      bgColorScheme="surface"
      header={
        <div className="flex items-center justify-between w-full">
          <h3 className="text-base font-semibold text-[var(--rs-text-primary)] flex items-center gap-2 m-0 leading-none">
            <SFCpu size="md" className="text-[var(--rs-text-primary)]" />
            {translation.system.cpuLoadAverage}
          </h3>
          <div className="text-right">
            <p className="text-sm font-semibold flex items-center justify-end gap-2">
              <span style={{ color: '#ea580c' }}>{metrics?.cpuLoad.current.fifteenMin.toFixed(2)}</span>
              <span className="text-[var(--rs-text-secondary)]">/</span>
              <span style={{ color: '#16a34a' }}>{metrics?.cpuLoad.current.fiveMin.toFixed(2)}</span>
              <span className="text-[var(--rs-text-secondary)]">/</span>
              <span style={{ color: '#2563eb' }}>{metrics?.cpuLoad.current.oneMin.toFixed(2)}</span>
            </p>
          </div>
        </div>
      }
    >
      <div className="p-2">
        {metrics && metrics.cpuLoad.history.length >= 1 ? (() => {
          const paddedData = padDataToWindow(metrics.cpuLoad.history, 60, { oneMin: undefined, fiveMin: undefined, fifteenMin: undefined });
          const indexedData = paddedData.map((item: any, index: number) => ({ ...item, index }));
          return (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={indexedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-[var(--rs-border-primary)]" />
                <XAxis dataKey="index" hide tick={false} />
                <YAxis domain={[0, 'auto']} label={{ value: 'Load', angle: -90, position: 'insideLeft', style: { fill: 'var(--rs-text-secondary)' } }} tick={{ fill: 'var(--rs-text-secondary)' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--rs-bg-card)',
                    border: '1px solid var(--rs-border-primary)',
                    borderRadius: '8px',
                    color: 'var(--rs-text-primary)'
                  }}
                  itemStyle={{ color: 'var(--rs-text-primary)' }}
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
                  wrapperStyle={{ paddingTop: '20px', color: 'var(--rs-text-secondary)' }}
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
          <div className="h-48 flex items-center justify-center text-[var(--rs-text-secondary)]">{translation.system.collectingData}</div>
        )}
      </div>
    </PACard>
  );
}
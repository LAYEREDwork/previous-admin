import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

import { SFNetwork } from '@frontend/components/sf-symbols';

import { Metrics } from '../../../../hooks/useSystemMetrics';
import { Translations } from '../../../../lib/translations';
import { padDataToWindow, getOptimalUnit } from '../../../../lib/utils';
import { PACard } from '../../../controls/PACard';

interface NetworkTrafficChartProps {
  metrics: Metrics | null;
  translation: Translations;
}

/**
 * Network traffic chart component displaying received and sent data over time
 */
export function NetworkTrafficChart({ metrics, translation }: NetworkTrafficChartProps) {
  return (
    <PACard
      bgColorScheme="surface"
      header={
        <h3 className="text-base font-semibold text-[var(--rs-text-primary)] flex items-center gap-2 m-0 leading-none">
          <SFNetwork size="md" className="text-[var(--rs-text-primary)]" />
          {translation.system.networkTraffic}
        </h3>
      }
    >
      <div className="p-2">
        {metrics && metrics.networkTraffic.history.length >= 1 ? (() => {
          const paddedData = padDataToWindow(metrics.networkTraffic.history, 60, { received: undefined, sent: undefined });
          const networkUnit = getOptimalUnit(paddedData.filter(d => d.received !== null));
          const convertedNetworkData = paddedData.map((item, index) => ({
            ...item,
            index,
            received: item.received != null ? item.received / networkUnit.divisor : null,
            sent: item.sent != null ? item.sent / networkUnit.divisor : null,
          }));
          return (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={convertedNetworkData}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-[var(--rs-border-primary)]" />
                <XAxis dataKey="index" hide />
                <YAxis domain={[0, 'auto']} label={{ value: networkUnit.unit, angle: -90, position: 'insideLeft', style: { fill: 'var(--rs-text-secondary)' } }} tick={{ fill: 'var(--rs-text-secondary)' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--rs-bg-card)',
                    border: '1px solid var(--rs-border-primary)',
                    borderRadius: '8px',
                    color: 'var(--rs-text-primary)'
                  }}
                  itemStyle={{ color: 'var(--rs-text-primary)' }}
                  formatter={(value: number | undefined, name: string | undefined) => [`${(value ?? 0).toFixed(2)} ${networkUnit.unit}`, name || '']}
                  labelFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
                />
                <Legend wrapperStyle={{ paddingTop: '20px', color: 'var(--rs-text-secondary)' }} />
                <Line type="monotone" dataKey="received" stroke="#06b6d4" name="Received" dot={false} strokeWidth={2} isAnimationActive={false} connectNulls />
                <Line type="monotone" dataKey="sent" stroke="#f97316" name="Sent" dot={false} strokeWidth={2} isAnimationActive={false} connectNulls />
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
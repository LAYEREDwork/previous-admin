import { BiGlobe } from 'react-icons/bi';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Metrics } from '../../../../hooks/useSystem';
import { Translations } from '../../../../lib/translations';
import { padDataToWindow, getOptimalUnit } from '../../../../lib/utils';

interface NetworkTrafficChartProps {
  metrics: Metrics | null;
  translation: Translations;
}

/**
 * Network traffic chart component displaying received and sent data over time
 */
export function NetworkTrafficChart({ metrics, translation }: NetworkTrafficChartProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
        <BiGlobe size={20} className="text-cyan-600 dark:text-cyan-400" />
        {translation.system.networkTraffic}
      </h3>
      {metrics && metrics.networkTraffic.history.length >= 1 ? (() => {
        const paddedData = padDataToWindow(metrics.networkTraffic.history, 60, { received: undefined, sent: undefined });
        const networkUnit = getOptimalUnit(paddedData.filter(d => d.received !== null));
        const convertedNetworkData = paddedData.map((item, index) => ({
          ...item,
          index,
          received: item.received !== null ? item.received / networkUnit.divisor : null,
          sent: item.sent !== null ? item.sent / networkUnit.divisor : null,
        }));
        return (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={convertedNetworkData}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-200 dark:text-gray-700" />
              <XAxis dataKey="index" hide />
              <YAxis domain={[0, 'auto']} label={{ value: networkUnit.unit, angle: -90, position: 'insideLeft', style: { fill: '#6b7280' } }} tick={{ fill: '#6b7280' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }}
                formatter={(value: number | undefined, name: string | undefined) => [`${(value ?? 0).toFixed(2)} ${networkUnit.unit}`, name || '']}
                labelFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
              />
              <Legend wrapperStyle={{ paddingTop: '20px', color: '#6b7280' }} />
              <Line type="monotone" dataKey="received" stroke="#06b6d4" name="Received" dot={false} strokeWidth={2} isAnimationActive={false} connectNulls />
              <Line type="monotone" dataKey="sent" stroke="#f97316" name="Sent" dot={false} strokeWidth={2} isAnimationActive={false} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        );
      })() : (
        <div className="h-48 flex items-center justify-center text-gray-400">{translation.system.collectingData}</div>
      )}
    </div>
  );
}
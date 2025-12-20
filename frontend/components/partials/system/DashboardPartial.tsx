import { BiChip, BiGlobe, BiHdd } from 'react-icons/bi';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { AnimatedSegmentedControl } from '../../controls/AnimatedSegmentedControl';
import { METRICS_UPDATE_FREQUENCIES } from '../../../lib/constants';
import { Metrics } from '../../../hooks/useSystem';
import { Translations } from '../../../lib/translations';
import { padDataToWindow, formatBytes, getOptimalUnit } from '../../../lib/utils';

interface DashboardPartialProps {
    metrics: Metrics | null;
    updateFrequency: number;
    setUpdateFrequency: (freq: number) => void;
    translation: Translations;
}

export function DashboardPartial({
    metrics,
    updateFrequency,
    setUpdateFrequency,
    translation
}: DashboardPartialProps) {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Dashboard
                </h3>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {translation.system.updateFrequency}
                    </span>
                    <AnimatedSegmentedControl
                        options={METRICS_UPDATE_FREQUENCIES.map(freq => ({
                            value: freq.toString(),
                            label: `${freq}s`
                        }))}
                        value={updateFrequency.toString()}
                        onChange={(val) => setUpdateFrequency(parseFloat(val))}
                        size="sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* CPU Load Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
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

                {/* Memory Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
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

                {/* Network Traffic Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
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

                {/* Disk IO Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
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
            </div>
        </div>
    );
}

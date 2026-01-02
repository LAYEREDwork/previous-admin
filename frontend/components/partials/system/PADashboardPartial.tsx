import { PASegmentedControl } from '../../controls/PASegmentedControl';
import { PACard } from '../../controls/PACard';
import { metricsUpdateFrequencies } from '../../../lib/constants';
import { Metrics } from '../../../hooks/useSystemMetrics';
import { Translations } from '../../../lib/translations';
import { CpuLoadChart } from './charts/PACpuLoadChart';
import { MemoryChart } from './charts/PAMemoryChart';
import { NetworkTrafficChart } from './charts/PANetworkTrafficChart';
import { DiskIOChart } from './charts/PADiskIOChart';

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
        <PACard
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                    <h3 className="text-xl font-bold text-[var(--rs-text-primary)]">
                        Dashboard
                    </h3>
                    <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-[var(--rs-text-secondary)] uppercase tracking-wider">
                        {translation.system.updateFrequency}
                    </span>
                    <PASegmentedControl
                        options={metricsUpdateFrequencies.map(freq => ({
                            value: freq.toString(),
                            label: `${freq}s`
                        }))}
                        value={updateFrequency.toString()}
                        onChange={(val) => setUpdateFrequency(parseFloat(val))}
                        size="sm"
                    />
                    </div>
                </div>
            }
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* CPU Load Chart */}
                <CpuLoadChart metrics={metrics} translation={translation} />

                {/* Memory Chart */}
                <MemoryChart metrics={metrics} translation={translation} />

                {/* Network Traffic Chart */}
                <NetworkTrafficChart metrics={metrics} translation={translation} />

                {/* Disk IO Chart */}
                <DiskIOChart metrics={metrics} translation={translation} />
            </div>
        </PACard>
    );
}

import { PACard } from '../../controls/PACard';
import { Metrics } from '../../../hooks/useSystemMetrics';
import { Translations } from '../../../lib/translations';
import { CpuLoadChart } from './charts/PACpuLoadChart';
import { MemoryChart } from './charts/PAMemoryChart';
import { NetworkTrafficChart } from './charts/PANetworkTrafficChart';
import { DiskIOChart } from './charts/PADiskIOChart';

interface DashboardPartialProps {
    metrics: Metrics | null;
    translation: Translations;
}

export function DashboardPartial({
    metrics,
    translation
}: DashboardPartialProps) {
    return (
        <PACard
            header={
                <h3 className="text-xl font-bold text-[var(--rs-text-primary)] leading-none m-0">
                    Dashboard
                </h3>
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

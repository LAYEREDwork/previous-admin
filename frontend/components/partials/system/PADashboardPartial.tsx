import { PACard } from '@frontend/components/controls/PACard';
import { SFDesktopcomputer } from '@frontend/components/sf-symbols';
import { Metrics } from '@frontend/hooks/useSystemMetrics';
import { Translations } from '@frontend/lib/translations';

import { CpuLoadChart } from './charts/PACpuLoadChart';
import { DiskIOChart } from './charts/PADiskIOChart';
import { MemoryChart } from './charts/PAMemoryChart';
import { NetworkTrafficChart } from './charts/PANetworkTrafficChart';

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
                <div className="flex items-center gap-2 m-0 leading-none">
                    <SFDesktopcomputer size="lg" className="text-[var(--rs-text-primary)]" />
                    <h3 className="text-base font-semibold text-[var(--rs-text-primary)] m-0">
                        Dashboard
                    </h3>
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

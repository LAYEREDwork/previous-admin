import { SystemInfo } from '@shared/previous-config/types';

import { PACard } from '@frontend/components/controls/PACard';
import { PADiskSpace } from '@frontend/components/controls/PADiskSpace';
import { SFExternaldrive } from 'sf-symbols-lib';
import { Translations } from '@frontend/lib/translations';

interface DiskSpacePartialProps {
    disks: SystemInfo['disks'];
    translation: Translations;
}

/**
 * Disk space display component showing mounted disks with usage visualization
 * Uses RSuite ProgressCircle to display disk usage percentage
 */
export function DiskSpacePartial({ disks, translation }: DiskSpacePartialProps) {
    if (!disks || disks.length === 0) return null;

    return (
        <PACard
            header={
                <div className="flex items-center gap-2 m-0 leading-none">
                    <SFExternaldrive size="lg" className="text-[var(--rs-text-primary)]" />
                    <h3 className="text-sm font-semibold text-[var(--rs-text-primary)] m-0">
                        {translation.system.disks}
                    </h3>
                </div>
            }
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {disks
                    .reduce((uniqueDisks: typeof disks, disk: typeof disks[0]) => {
                        const exists = uniqueDisks.some((d: typeof disks[0]) => d.mountpoint === disk.mountpoint);
                        if (!exists) uniqueDisks.push(disk);
                        return uniqueDisks;
                    }, [])
                    .map((disk: typeof disks[0], idx: number) => {
                        return (
                            <div key={idx} className="border border-[var(--rs-border-primary)] rounded-lg p-6 flex flex-col items-center">
                                <PADiskSpace
                                    disk={disk}
                                    strokeWidth={10}
                                    size={120}
                                    sublabel={translation.system.used}
                                />
                            </div>
                        );
                    })}
            </div>
        </PACard>
    );
}

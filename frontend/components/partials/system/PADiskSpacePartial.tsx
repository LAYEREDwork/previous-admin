import { BiHdd } from 'react-icons/bi';
import { SystemInfo } from '../../../../shared/types';
import { Translations } from '../../../lib/translations';
import { PACard } from '../../controls/PACard';
import { PADiskSpace } from '../../controls/PADiskSpace';

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
                    <BiHdd size={20} className="text-[var(--rs-primary-500)]" />
                    {translation.system.disks}
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
                                    sublabel="used"
                                />
                            </div>
                        );
                    })}
            </div>
        </PACard>
    );
}

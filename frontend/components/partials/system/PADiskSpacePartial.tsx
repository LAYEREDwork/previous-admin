import { BiHdd } from 'react-icons/bi';
import { SystemInfo } from '../../../../shared/types';
import { Translations } from '../../../lib/translations';
import { PACard } from '../../controls/PACard';

interface DiskSpacePartialProps {
    disks: SystemInfo['disks'];
    translation: Translations;
}

export function DiskSpacePartial({ disks, translation }: DiskSpacePartialProps) {
    if (!disks || disks.length === 0) return null;

    return (
        <PACard
            header={
                <div className="flex items-center gap-2">
                    <BiHdd size={20} className="text-[var(--rs-primary-500)]" />
                    {translation.system.disks}
                </div>
            }
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {disks
                    .reduce((uniqueDisks: typeof disks, disk: typeof disks[0]) => {
                        const exists = uniqueDisks.some((d: typeof disks[0]) => d.mountpoint === disk.mountpoint);
                        if (!exists) uniqueDisks.push(disk);
                        return uniqueDisks;
                    }, [])
                    .map((disk: typeof disks[0], idx: number) => {
                        return (
                            <div key={idx} className="border border-[var(--rs-border-primary)] rounded-lg p-4 flex flex-col gap-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-medium text-[var(--rs-text-primary)]">{disk.filesystem}</p>
                                        <p className="text-xs text-[var(--rs-text-secondary)]">{disk.mountpoint}</p>
                                    </div>
                                    <p className="text-sm font-semibold text-[var(--rs-text-primary)]">{disk.usePercent}</p>
                                </div>
                                <div className="w-full bg-[var(--rs-bg-active)] rounded-full h-2">
                                    <div
                                        className="bg-[var(--rs-primary-500)] h-2 rounded-full"
                                        style={{ width: disk.usePercent }}
                                    ></div>
                                </div>
                                <div className="text-xs text-[var(--rs-text-secondary)] flex justify-between">
                                    <span>{disk.used} / {disk.size}</span>
                                    <span>{disk.available} free</span>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </PACard>
    );
}

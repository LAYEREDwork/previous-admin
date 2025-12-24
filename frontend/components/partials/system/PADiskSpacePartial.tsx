import { BiHdd } from 'react-icons/bi';
import { SystemInfo } from '../../../../shared/types';
import { Translations } from '../../../lib/translations';

interface DiskSpacePartialProps {
    disks: SystemInfo['disks'];
    translation: Translations;
}

export function DiskSpacePartial({ disks, translation }: DiskSpacePartialProps) {
    if (!disks || disks.length === 0) return null;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                <BiHdd size={20} className="text-orange-600 dark:text-orange-400" />
                {translation.system.disks}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {disks
                    .reduce((uniqueDisks: typeof disks, disk: typeof disks[0]) => {
                        const exists = uniqueDisks.some((d: typeof disks[0]) => d.mountpoint === disk.mountpoint);
                        if (!exists) uniqueDisks.push(disk);
                        return uniqueDisks;
                    }, [])
                    .map((disk: typeof disks[0], idx: number) => {
                        return (
                            <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col gap-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{disk.filesystem}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{disk.mountpoint}</p>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{disk.usePercent}</p>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                        className="bg-orange-600 dark:bg-orange-400 h-2 rounded-full"
                                        style={{ width: disk.usePercent }}
                                    ></div>
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400 flex justify-between">
                                    <span>{disk.used} / {disk.size}</span>
                                    <span>{disk.available} free</span>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}

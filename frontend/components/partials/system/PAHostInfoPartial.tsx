import { BiHdd, BiChip, BiGlobe, BiDesktop } from 'react-icons/bi';
import { SystemInfo } from '../../../shared/types';
import { Translations } from '../../../lib/translations';
import { formatUptime } from '../../../lib/utils';

interface HostInfoPartialProps {
    systemInfo: SystemInfo;
    translation: Translations;
}

export function HostInfoPartial({ systemInfo, translation }: HostInfoPartialProps) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <BiHdd size={20} className="text-gray-600 dark:text-gray-400" />
                {translation.system.hostInfo}
            </h3>

            <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    <div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{translation.system.os}</span>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-0.5">{systemInfo.os}</p>
                    </div>
                    <div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{translation.system.host}</span>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-0.5">{systemInfo.hostname}</p>
                    </div>
                    <div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Model</span>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-0.5">{systemInfo.hostModel.name}</p>
                    </div>
                    <div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{translation.system.kernel}</span>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-0.5">{systemInfo.kernel}</p>
                    </div>
                    <div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{translation.system.uptime}</span>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-0.5">
                            {formatUptime(systemInfo.uptime, {
                                days: translation.system.days,
                                hours: translation.system.hours,
                                minutes: translation.system.minutes,
                                seconds: translation.system.seconds
                            })}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                            <BiChip size={16} className="text-next-accent" />
                            {translation.system.cpu}
                        </h4>
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">{translation.system.model}</span>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate mt-0.5">{systemInfo.cpu.model}</p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">{translation.system.cores}</span>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-0.5">{systemInfo.cpu.cores}</p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">Speed</span>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-0.5">{systemInfo.cpu.speed} MHz</p>
                            </div>
                        </div>
                    </div>

                    {systemInfo.gpu && systemInfo.gpu.length > 0 && systemInfo.gpu[0] !== 'N/A' && (
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                                <BiChip size={16} className="text-green-600 dark:text-green-400" />
                                {translation.system.gpu}
                            </h4>
                            <div className="space-y-2">
                                {systemInfo.gpu.map((gpu, idx) => (
                                    <p key={idx} className="text-sm text-gray-900 dark:text-gray-100 break-words">{gpu}</p>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* IP & Display */}
                {(systemInfo.ipAddresses?.length > 0 || systemInfo.monitorResolution) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                        {systemInfo.ipAddresses && systemInfo.ipAddresses.length > 0 && (
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                                    <BiGlobe size={16} className="text-cyan-600 dark:text-cyan-400" />
                                    {translation.system.ipAddresses}
                                </h4>
                                <div className="flex flex-wrap gap-4">
                                    {systemInfo.ipAddresses.map((ip, idx) => (
                                        <div key={idx} className="text-sm">
                                            <span className="text-xs text-gray-500 dark:text-gray-400">{ip.interface}:</span>
                                            <p className="text-sm font-mono font-medium text-gray-900 dark:text-gray-100 break-all mt-0.5">{ip.address}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {systemInfo.monitorResolution && (
                            <div>
                                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
                                    <BiDesktop size={16} className="text-indigo-600 dark:text-indigo-400" />
                                    {translation.system.display}
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">{translation.system.resolution}</span>
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{systemInfo.monitorResolution.width} x {systemInfo.monitorResolution.height}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">{translation.system.source}</span>
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{systemInfo.monitorResolution.source}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

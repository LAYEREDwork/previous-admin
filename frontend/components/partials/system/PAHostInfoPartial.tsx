import { BiHdd, BiChip, BiGlobe, BiDesktop } from 'react-icons/bi';

import { SystemInfo } from '../../../../shared/previous-config/types';
import { Translations } from '../../../lib/translations';
import { formatUptime } from '../../../lib/utils';
import { PACard } from '../../controls/PACard';

interface HostInfoPartialProps {
    systemInfo: SystemInfo;
    translation: Translations;
}

export function HostInfoPartial({ systemInfo, translation }: HostInfoPartialProps) {
    return (
        <PACard
            header={
                <div className="flex items-center gap-2 m-0 leading-none">
                    <BiHdd size={20} className="text-[var(--rs-text-secondary)]" />
                    {translation.system.hostInfo}
                </div>
            }
        >

            <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    <div>
                        <span className="text-xs text-[var(--rs-text-secondary)]">{translation.system.os}</span>
                        <p className="text-sm font-medium text-[var(--rs-text-primary)] mt-0.5">{systemInfo.os}</p>
                    </div>
                    <div>
                        <span className="text-xs text-[var(--rs-text-secondary)]">{translation.system.host}</span>
                        <p className="text-sm font-medium text-[var(--rs-text-primary)] mt-0.5">{systemInfo.hostname}</p>
                    </div>
                    <div>
                        <span className="text-xs text-[var(--rs-text-secondary)]">Model</span>
                        <p className="text-sm font-medium text-[var(--rs-text-primary)] mt-0.5">{systemInfo.hostModel.name}</p>
                    </div>
                    <div>
                        <span className="text-xs text-[var(--rs-text-secondary)]">{translation.system.kernel}</span>
                        <p className="text-sm font-medium text-[var(--rs-text-primary)] mt-0.5">{systemInfo.kernel}</p>
                    </div>
                    <div>
                        <span className="text-xs text-[var(--rs-text-secondary)]">{translation.system.uptime}</span>
                        <p className="text-sm font-medium text-[var(--rs-text-primary)] mt-0.5">
                            {formatUptime(systemInfo.uptime, {
                                days: translation.system.days,
                                hours: translation.system.hours,
                                minutes: translation.system.minutes,
                                seconds: translation.system.seconds
                            })}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-[var(--rs-border-primary)] pt-4">
                    <div>
                        <h4 className="text-sm font-semibold text-[var(--rs-text-primary)] mb-2 flex items-center gap-2">
                            <BiChip size={16} className="text-[var(--rs-primary-500)]" />
                            {translation.system.cpu}
                        </h4>
                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <span className="text-xs text-[var(--rs-text-secondary)]">{translation.system.model}</span>
                                <p className="text-sm font-medium text-[var(--rs-text-primary)] truncate mt-0.5">{systemInfo.cpu.model}</p>
                            </div>
                            <div>
                                <span className="text-xs text-[var(--rs-text-secondary)]">{translation.system.cores}</span>
                                <p className="text-sm font-medium text-[var(--rs-text-primary)] mt-0.5">{systemInfo.cpu.cores}</p>
                            </div>
                            <div>
                                <span className="text-xs text-[var(--rs-text-secondary)]">Speed</span>
                                <p className="text-sm font-medium text-[var(--rs-text-primary)] mt-0.5">{systemInfo.cpu.speed} MHz</p>
                            </div>
                        </div>
                    </div>

                    {systemInfo.gpu && systemInfo.gpu.length > 0 && systemInfo.gpu[0] !== 'N/A' && (
                        <div>
                            <h4 className="text-sm font-semibold text-[var(--rs-text-primary)] mb-2 flex items-center gap-2">
                                <BiChip size={16} className="text-[var(--rs-primary-500)]" />
                                {translation.system.gpu}
                            </h4>
                            <div className="space-y-2">
                                {systemInfo.gpu.map((gpu: string, idx: number) => (
                                    <p key={idx} className="text-sm text-[var(--rs-text-primary)] break-words">{gpu}</p>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* IP & Display */}
                {(systemInfo.ipAddresses?.length > 0 || systemInfo.monitorResolution) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-[var(--rs-border-primary)] pt-4">
                        {systemInfo.ipAddresses && systemInfo.ipAddresses.length > 0 && (
                            <div>
                                <h4 className="text-sm font-semibold text-[var(--rs-text-primary)] mb-2 flex items-center gap-2">
                                    <BiGlobe size={16} className="text-[var(--rs-primary-500)]" />
                                    {translation.system.ipAddresses}
                                </h4>
                                <div className="flex flex-wrap gap-4">
                                    {systemInfo.ipAddresses.map((ip: { interface: string; address: string }, idx: number) => (
                                        <div key={idx} className="text-sm">
                                            <span className="text-xs text-[var(--rs-text-secondary)]">{ip.interface}:</span>
                                            <p className="text-sm font-mono font-medium text-[var(--rs-text-primary)] break-all mt-0.5">{ip.address}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {systemInfo.monitorResolution && (
                            <div>
                                <h4 className="text-sm font-semibold text-[var(--rs-text-primary)] mb-2 flex items-center gap-2">
                                    <BiDesktop size={16} className="text-[var(--rs-primary-500)]" />
                                    {translation.system.display}
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <span className="text-xs text-[var(--rs-text-secondary)]">{translation.system.resolution}</span>
                                        <p className="text-sm font-medium text-[var(--rs-text-primary)]">{systemInfo.monitorResolution.width} x {systemInfo.monitorResolution.height}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-[var(--rs-text-secondary)]">{translation.system.source}</span>
                                        <p className="text-sm font-medium text-[var(--rs-text-primary)]">{systemInfo.monitorResolution.source}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </PACard>
    );
}

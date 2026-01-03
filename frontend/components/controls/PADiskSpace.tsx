import { Progress } from 'rsuite';
import { SystemInfo } from '../../../shared/types';

interface PADiskSpaceProps {
    /**
     * Percentage value (0-100)
     * Optional if disk is provided (will be calculated from disk.usePercent)
     */
    percent?: number;

    /**
     * Disk information to display
     * If provided, percent is calculated from disk.usePercent
     */
    disk?: SystemInfo['disks'][0];

    /**
     * Stroke width of the progress circle
     * @default 10
     */
    strokeWidth?: number;

    /**
     * Size of the circle in pixels
     * @default 100
     */
    size?: number;

    /**
     * Sublabel displayed below the percentage
     * @default "used"
     */
    sublabel?: string;
}

/**
 * Generic disk space progress circle component
 *
 * Displays a circular progress indicator with customizable stroke width and size.
 * Shows usage percentage with color coding based on the percent value.
 * Optionally displays disk information below the progress circle.
 *
 * @component
 * @example
 * ```tsx
 * // With disk object (percent is calculated automatically)
 * <PADiskSpace
 *   disk={diskInfo}
 *   strokeWidth={10}
 *   size={120}
 *   sublabel="used"
 * />
 *
 * // Or with explicit percent value
 * <PADiskSpace
 *   percent={30}
 *   strokeWidth={10}
 *   size={120}
 * />
 * ```
 */
export function PADiskSpace({
    percent: percentProp,
    disk,
    strokeWidth = 10,
    size = 100,
    sublabel = 'used',
}: PADiskSpaceProps) {
    // Calculate percent from disk if provided, otherwise use the passed percent value
    const percentValue = disk ? parseInt(disk.usePercent, 10) : (percentProp ?? 0);

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            <div
                className="relative flex items-center justify-center"
                style={{ width: size, height: size }}
            >
                <Progress.Circle
                    percent={percentValue}
                    showInfo={false}
                    strokeLinecap="round"
                    strokeWidth={strokeWidth}
                    w={size - 20}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-xl font-bold text-[var(--rs-text-primary)]">
                        {percentValue}%
                    </p>
                    <p className="text-xs text-[var(--rs-text-secondary)]">{sublabel}</p>
                </div>
            </div>

            {/* Disk information section */}
            {disk && (
                <div className="text-center w-full">
                    <p className="text-sm font-semibold text-[var(--rs-text-primary)]">
                        {disk.filesystem}
                    </p>
                    <p className="text-xs text-[var(--rs-text-secondary)] mb-3">
                        {disk.mountpoint}
                    </p>

                    <div className="space-y-2 text-xs text-[var(--rs-text-secondary)]">
                        <div className="flex justify-between">
                            <span>Used:</span>
                            <span className="font-medium">{disk.used}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Total:</span>
                            <span className="font-medium">{disk.size}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Free:</span>
                            <span className="font-medium text-[var(--rs-success-500)]">
                                {disk.available}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

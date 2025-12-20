import React, { useState, useEffect } from 'react';
import { BiTrash, BiEdit, BiCheckCircle, BiCircle, BiUpload, BiCopy } from 'react-icons/bi';
import { PAIconButton } from '../../controls/PAIconButton';
import { Configuration } from '../../../lib/database';
import { Translations } from '../../../lib/translations';

interface ConfigListItemPartialProps {
    config: Configuration;
    index: number;
    totalConfigs: number;
    draggedIndex: number | null;
    dragOverIndex: number | null;
    handleDragStart: (index: number) => void;
    handleDragOver: (e: React.DragEvent, index: number) => void;
    handleDragEnd: () => void;
    handleDragLeave: () => void;
    setActiveConfig: (id: string) => void;
    exportSingleConfig: (config: Configuration) => void;
    duplicateConfig: (config: Configuration) => void;
    onEdit: (config: Configuration) => void;
    deleteConfig: (id: string) => void;
    translation: Translations;
}

export function ConfigListItemPartial({
    config,
    index,
    totalConfigs,
    draggedIndex,
    dragOverIndex,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragLeave,
    setActiveConfig,
    exportSingleConfig,
    duplicateConfig,
    onEdit,
    deleteConfig,
    translation
}: ConfigListItemPartialProps) {
    const isDragged = draggedIndex === index;
    const isDragOver = dragOverIndex === index && draggedIndex !== index;
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 640);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div className="relative">
            {isDragOver && (
                <div className="absolute -top-1 left-0 right-0 h-1 bg-next-accent rounded-full z-10"></div>
            )}
            <div
                draggable={totalConfigs > 1}
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                onDragLeave={handleDragLeave}
                className={`bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-2 sm:p-4 hover:shadow-lg transition-all ${totalConfigs > 1 ? 'cursor-move' : ''
                    } ${isDragged ? 'opacity-50 scale-95' : ''} ${isDragOver ? 'border-next-accent' : ''
                    } relative overflow-hidden flex flex-col sm:min-h-[100px] ${isMobile ? 'min-h-[80px]' : ''}`}
            >
                {/* Active Badge - Top Right */}
                {config.is_active && (
                    <div className="absolute -top-px -right-px z-10">
                        <span className="inline-block px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300 rounded-bl-lg rounded-tr-lg border-b border-l border-green-200 dark:border-green-800 shadow-sm">
                            {translation.configList.active.toUpperCase()}
                        </span>
                    </div>
                )}

                {/* Main Content Area */}
                <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0 pr-14 sm:pr-0">
                    <div className="flex items-center justify-center min-w-[34px] sm:min-w-[40px]">
                        {!config.is_active ? (
                            <PAIconButton
                                onClick={() => setActiveConfig(config.id)}
                                icon={<BiCircle size={isMobile ? 22 : 26} />}
                                appearance="subtle"
                                size={isMobile ? 'xs' : 'sm'}
                                title={translation.configList.setActive}
                                className="text-gray-400 hover:text-next-accent dark:hover:text-next-accent transition-colors"
                            />
                        ) : (
                            <div className="flex items-center justify-center text-green-600 dark:text-green-400 p-1">
                                <BiCheckCircle size={isMobile ? 24 : 28} />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white truncate">
                            {config.name}
                        </h3>
                        {config.description ? (
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-1 sm:line-clamp-2 mt-0.5">
                                {config.description}
                            </p>
                        ) : (
                            <p className="text-xs sm:text-sm italic text-gray-400 dark:text-gray-500 mt-0.5">
                                {translation.configList.description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Action Buttons - Bottom Right */}
                <div className="flex items-center justify-end gap-1.5 sm:gap-2 mt-2 sm:mt-0 sm:absolute sm:bottom-3 sm:right-3">
                    <PAIconButton
                        icon={<BiUpload size={isMobile ? 16 : 18} className="transition-colors group-hover:text-next-accent" />}
                        size={isMobile ? 'xs' : 'sm'}
                        appearance="default"
                        onClick={() => exportSingleConfig(config)}
                        title={translation.configList.export}
                        className="group"
                    />
                    <PAIconButton
                        icon={<BiCopy size={16} className="transition-colors group-hover:text-next-accent" />}
                        size={isMobile ? 'xs' : 'sm'}
                        appearance="default"
                        onClick={() => duplicateConfig(config)}
                        title={translation.configList.duplicate}
                        className="group"
                    />
                    <PAIconButton
                        icon={<BiEdit size={16} className="transition-colors group-hover:text-next-accent" />}
                        size={isMobile ? 'xs' : 'sm'}
                        appearance="default"
                        onClick={() => onEdit(config)}
                        title={translation.configList.edit}
                        className="group"
                    />
                    <PAIconButton
                        icon={<BiTrash size={16} className="transition-colors group-hover:text-red-500" />}
                        size={isMobile ? 'xs' : 'sm'}
                        appearance="default"
                        onClick={() => deleteConfig(config.id)}
                        title={translation.configList.delete}
                        className="group hover:!bg-red-50 dark:hover:!bg-red-900/20"
                    />
                </div>
            </div>
        </div>
    );
}

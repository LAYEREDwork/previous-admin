import { BiSave, BiChevronUp, BiChevronDown } from 'react-icons/bi';
import { Button } from 'rsuite';
import { AnimatedSegmentedControl } from '../../controls/AnimatedSegmentedControl';
import { Translations } from '../../../lib/translations';

interface EditorControlsPartialProps {
    viewMode: 'editor' | 'raw';
    setViewMode: (mode: 'editor' | 'raw') => void;
    saving: boolean;
    handleSave: () => void;
    expandedSections: Record<string, boolean>;
    toggleAllSections: () => void;
    controlSize: 'sm' | 'md' | 'lg';
    translation: Translations;
}

export function EditorControlsPartial({
    viewMode,
    setViewMode,
    saving,
    handleSave,
    expandedSections,
    toggleAllSections,
    controlSize,
    translation
}: EditorControlsPartialProps) {
    const allExpanded = Object.values(expandedSections).every(expanded => expanded);

    return (
        <div className="flex flex-col gap-3 sm:gap-4">
            <div className="w-full">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {translation.configEditor.title}
                </h2>
            </div>

            <div className="flex flex-row justify-between items-center gap-3 sm:gap-4">
                <Button
                    onClick={toggleAllSections}
                    size={controlSize}
                    className="flex items-center gap-2 flex-shrink-0"
                >
                    {allExpanded ? <BiChevronUp size={16} /> : <BiChevronDown size={16} />}
                    {allExpanded
                        ? translation.configEditor.sectionsCollapseAll
                        : translation.configEditor.sectionsExpandAll}
                </Button>

                <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
                    <AnimatedSegmentedControl
                        options={[
                            { value: 'editor', label: translation.configEditor.viewModeEditor },
                            { value: 'raw', label: translation.configEditor.viewModeRaw },
                        ]}
                        value={viewMode}
                        onChange={(val) => setViewMode(val as 'editor' | 'raw')}
                        size={controlSize}
                        className="flex flex-nowrap"
                    />
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        loading={saving}
                        appearance="primary"
                        className="flex items-center gap-2"
                        size={controlSize}
                        title={saving ? translation.configEditor.saving : translation.configEditor.save}
                    >
                        <BiSave size={16} />
                        <span className="hidden sm:inline">
                            {saving ? translation.configEditor.saving : translation.configEditor.save}
                        </span>
                    </Button>
                </div>
            </div>
        </div>
    );
}

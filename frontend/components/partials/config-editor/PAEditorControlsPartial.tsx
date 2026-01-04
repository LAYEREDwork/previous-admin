import { Translations } from '../../../lib/translations';
import { PASize } from '../../../lib/types/sizes';
import { PAButton } from '../../controls/PAButton';
import { PASegmentedControl } from '../../controls/PASegmentedControl';
import { 
    SFChevronDownCircleFill, 
    SFLongTextPageAndPencilFill, 
    SFSquareAndArrowDownOnSquareFill, 
    SFTextRectangleFill 
} from '../../sf-symbols';

interface EditorControlsPartialProps {
    viewMode: 'editor' | 'raw';
    setViewMode: (mode: 'editor' | 'raw') => void;
    saving: boolean;
    handleSave: () => void;
    expandedSections: Record<string, boolean>;
    toggleAllSections: () => void;
    controlSize: PASize;
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
                <h2 className="text-sm sm:text-base font-semibold text-[var(--rs-text-primary)]">
                    {translation.configEditor.title}
                </h2>
            </div>

            <div className="flex flex-row justify-between items-center gap-3 sm:gap-4">
                <PAButton
                    onClick={() => toggleAllSections()}
                    size={controlSize}
                    className="flex items-center gap-2 flex-shrink-0"
                >
                    <div style={{ transform: `rotate(${allExpanded ? -180 : 0}deg)`, transition: 'transform 300ms ease-out' }}>
                        <SFChevronDownCircleFill size={18} />
                    </div>
                    {allExpanded
                        ? translation.configEditor.sectionsCollapseAll
                        : translation.configEditor.sectionsExpandAll}
                </PAButton>

                <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
                    <PASegmentedControl
                        options={[
                            { value: 'editor', label: translation.configEditor.viewModeEditor, icon: SFLongTextPageAndPencilFill },
                            { value: 'raw', label: translation.configEditor.viewModeRaw, icon: SFTextRectangleFill },
                        ]}
                        value={viewMode}
                        onChange={(val) => setViewMode(val as 'editor' | 'raw')}
                        size={controlSize}
                        className="flex flex-nowrap"
                    />
                    <PAButton
                        onClick={handleSave}
                        disabled={saving}
                        loading={saving}
                        appearance="primary"
                        className="flex items-center gap-2"
                        size={controlSize}
                        title={saving ? translation.configEditor.saving : translation.configEditor.save}
                    >
                        <SFSquareAndArrowDownOnSquareFill size={18} />
                        <span className="hidden sm:inline">
                            {saving ? translation.configEditor.saving : translation.configEditor.save}
                        </span>
                    </PAButton>
                </div>
            </div>
        </div>
    );
}

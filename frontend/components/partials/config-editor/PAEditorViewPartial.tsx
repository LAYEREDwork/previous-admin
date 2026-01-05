import { Input, Toggle } from 'rsuite';

import type { PreviousConfig } from '@shared/previous-config/types';

import { useConfigSchema } from '../../../hooks/useConfigSchema';
import { Translations } from '../../../lib/translations';
import { PASize } from '../../../lib/types';
import { 
    SFCpu,
} from '../../sf-symbols';

import { PAEditorDropdownPartial } from './PAEditorDropdownPartial';
import { EditorFieldPartial } from './PAEditorFieldPartial';
import { EditorSectionPartial } from './PAEditorSectionPartial';

interface EditorViewPartialProps {
    configData: PreviousConfig;
    updateConfigField: (path: string[], value: string | number | boolean) => void;
    expandedSections: Record<string, boolean>;
    setExpandedSections: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
    controlSize: PASize;
    translation: Translations;
}

export function EditorViewPartial({
    configData,
    updateConfigField,
    expandedSections,
    setExpandedSections,
    controlSize,
    translation
}: EditorViewPartialProps) {
    const { schema, loading, error } = useConfigSchema();
    const rsuiteSize = controlSize === PASize.xs ? PASize.sm : controlSize === PASize.xl ? PASize.lg : controlSize;

    const renderParameter = (sectionName: string, param: any) => {
        let value = (configData as any)[sectionName]?.[param.name];
        
        // Use default value if not set in configData
        if (value === undefined && param.default !== undefined) {
            value = param.default;
        }
        
        const label = param.translationKey ? translation.configEditor.parameters[param.translationKey.split('.').pop() || ''] : param.displayName || param.name;

        switch (param.type) {
            case 'boolean':
                return (
                    <EditorFieldPartial key={param.name} label={label}>
                        <Toggle
                            checked={value}
                            onChange={(checked) => updateConfigField([sectionName, param.name], checked)}
                            size={rsuiteSize}
                        />
                    </EditorFieldPartial>
                );
            case 'number':
                return (
                    <EditorFieldPartial key={param.name} label={label}>
                        <Input
                            type="number"
                            value={value?.toString() || ''}
                            onChange={(val) => updateConfigField([sectionName, param.name], parseInt(val) || 0)}
                            min={param.min}
                            max={param.max}
                            size={rsuiteSize}
                        />
                    </EditorFieldPartial>
                );
            case 'enum': {
                // Convert value to string for display and comparison
                const stringValue = value?.toString() ?? '';
                
                return (
                    <EditorFieldPartial key={param.name} label={label}>
                        <PAEditorDropdownPartial
                            value={stringValue}
                            possibleValues={param.possibleValues || []}
                            labels={param.labels}
                            onChange={(selectedValue) => updateConfigField([sectionName, param.name], selectedValue)}
                            size={rsuiteSize}
                        />
                    </EditorFieldPartial>
                );
            }
            case 'string':
            default:
                return (
                    <EditorFieldPartial key={param.name} label={label}>
                        <Input
                            value={value || ''}
                            onChange={(val) => updateConfigField([sectionName, param.name], val)}
                            size={rsuiteSize}
                        />
                    </EditorFieldPartial>
                );
        }
    };

    if (loading) return <div>Loading schema...</div>;
    if (error) return <div>Error loading schema: {error}</div>;
    if (!schema) return <div>No schema available</div>;

    return (
        <div className="grid gap-4">
            {Object.values(schema.sections).map((section) => (
                <EditorSectionPartial
                    key={section.name}
                    title={section.translationKey ? translation.configEditor.sections[section.translationKey.split('.').pop() || ''] : section.displayName}
                    expanded={expandedSections[section.name]}
                    onToggle={(expanded) => setExpandedSections((prev) => ({ ...prev, [section.name]: expanded }))}
                    icon={<SFCpu size={22} />} // TODO: Use section.sfSymbol
                >
                    {section.parameters.map((param) => renderParameter(section.name, param))}
                </EditorSectionPartial>
            ))}
        </div>
    );
}

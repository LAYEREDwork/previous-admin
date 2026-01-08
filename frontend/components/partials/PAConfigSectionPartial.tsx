/**
 * Config Section Partial Component
 * 
 * Renders an entire configuration section with header,
 * icon, and all parameters.
 * 
 * @module frontend/components/partials/PAConfigSectionPartial
 */

import { useState } from 'react';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';
import { IconButton, Panel, Stack } from 'rsuite';

import type { ParameterSchema, SectionSchema } from '@shared/previous-config/schema-types';

import { PASize } from '@frontend/lib/types/sizes';

import { PAConfigFieldPartial } from './PAConfigFieldPartial';

interface PAConfigSectionPartialProps {
  /** Section schema */
  schema: SectionSchema;
  
  /** Current configuration values for this section */
  values: Record<string, string | number | boolean>;
  
  /** Callback when any parameter changes */
  onChange: (parameterName: string, value: string | number | boolean) => void;
  
  /** Whether section is disabled */
  disabled?: boolean;
  
  /** Validation errors by parameter name */
  errors?: Record<string, string>;
  
  /** Whether section is initially expanded */
  defaultExpanded?: boolean;
}

/**
 * Configuration section component
 * 
 * Collapsible panel containing all parameters for a section.
 * Displays section icon, name, and parameters with validation.
 * 
 * @example
 * <PAConfigSectionPartial
 *   schema={sectionSchema}
 *   values={sectionValues}
 *   onChange={(param, val) => updateConfig(section.name, param, val)}
 *   disabled={saving}
 *   errors={validationErrors}
 *   defaultExpanded={true}
 * />
 */
export function PAConfigSectionPartial({
  schema,
  values,
  onChange,
  disabled,
  errors = {},
  defaultExpanded = true,
}: PAConfigSectionPartialProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  
  // Use displayName from schema, fallback to section name
  const sectionLabel = schema.displayName || schema.name;
  
  return (
    <Panel
      expanded={expanded}
      collapsible
      bordered
      className="mb-4"
      header={
        <Stack
          justifyContent="space-between"
          alignItems="center"
          className="cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <Stack spacing={12} alignItems="center">
            {/* Section icon - TODO: Add SF Symbol support */}
            
            <span className="font-semibold text-base">
              {sectionLabel}
            </span>
            
            {/* Parameter count badge */}
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({schema.parameters.length} Parameter)
            </span>
          </Stack>
          
          <IconButton
            icon={expanded ? <MdExpandLess /> : <MdExpandMore />}
            appearance="subtle"
            size={PASize.sm}
            circle
          />
        </Stack>
      }
    >
      {/* Section description */}
      {schema.description && (
        <div className="text-sm text-gray-600 dark:text-gray-300 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          {schema.description}
        </div>
      )}
      
      {/* Render all parameters */}
      <div className="space-y-4">
        {schema.parameters.map((param: ParameterSchema) => {
          // Get current value, fallback to default from schema
          const currentValue = values[param.name] !== undefined
            ? values[param.name]
            : param.default;
          
          return (
            <PAConfigFieldPartial
              key={param.name}
              schema={param}
              value={currentValue}
              onChange={(value) => onChange(param.name, value)}
              disabled={disabled}
              errorMessage={errors[param.name]}
            />
          );
        })}
      </div>
    </Panel>
  );
}

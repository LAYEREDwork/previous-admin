import { useEffect, useState } from 'react';
import { BiCopy } from 'react-icons/bi';

import type { PreviousConfig } from '@shared/previous-config/types';

import { PAButton } from '@frontend/components/controls/PAButton';
import { PACard } from '@frontend/components/controls/PACard';
import { Translations } from '@frontend/lib/translations';
import { PASize } from '@frontend/lib/types/sizes';

interface RawViewPartialProps {
    configData: PreviousConfig;
    convertToConfigFile: (config: PreviousConfig) => Promise<string>;
    copyToClipboard: () => void;
    translation: Translations;
}

export function RawViewPartial({
    configData,
    convertToConfigFile,
    copyToClipboard,
    translation
}: RawViewPartialProps) {
    const [cfgContent, setCfgContent] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [createdDate, setCreatedDate] = useState<string | null>(null);

    // Extract creation date from CFG content
    const extractCreatedDate = (content: string): string | null => {
        const match = content.match(/Created:\s+(.+?)(?:\n|$)/);
        if (match) {
            return match[1];
        }
        return null;
    };

    // Convert config to CFG format whenever configData changes
    useEffect(() => {
        // Only convert if configData is available
        if (!configData) {
            setCfgContent('');
            setCreatedDate(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        convertToConfigFile(configData)
            .then(content => {
                setCfgContent(content);
                setCreatedDate(extractCreatedDate(content));
                setLoading(false);
            })
            .catch(error => {
                console.error('Error converting to CFG:', error);
                setCfgContent(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
                setCreatedDate(null);
                setLoading(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [configData]);

    return (
        <PACard
            header={
                <div className="flex justify-between items-center w-full">
                    <div>
                        <h3 className="text-sm font-medium text-[var(--rs-text-secondary)] m-0 leading-none">
                            {translation.configEditor.content}
                            {loading && ' (converting...)'}
                        </h3>
                        {createdDate && (
                            <p className="text-xs text-[var(--rs-text-tertiary)] mt-1 m-0">
                                Created: {createdDate}
                            </p>
                        )}
                    </div>
                    <PAButton
                        onClick={copyToClipboard}
                        appearance="ghost"
                        size={PASize.sm}
                        className="flex items-center gap-2"
                        disabled={loading}
                    >
                        <BiCopy size={16} />
                        {translation.configEditor.copy}
                    </PAButton>
                </div>
            }
        >
            <pre className="font-mono text-sm text-[var(--rs-text-primary)] whitespace-pre-wrap overflow-x-auto">
                {cfgContent || (loading ? 'Converting...' : '')}
            </pre>
        </PACard>
    );
}

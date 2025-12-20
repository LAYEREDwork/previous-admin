import React from 'react';
import { BiHdd, BiFile, BiInfoCircle, BiCog } from 'react-icons/bi';
import { IoDocumentsOutline } from 'react-icons/io5';
import { useLanguage } from '../../contexts/LanguageContext';
import { PASegmentedControl } from '../controls/PASegmentedControl';

interface MainMenuProps {
    currentTab: string;
    onTabChange: (tab: string) => void;
}

export function MainMenuPartial({ currentTab, onTabChange }: MainMenuProps) {
    const { translation } = useLanguage();

    const tabs = [
        { value: 'configs', label: translation.tabs.savedConfigs, icon: <IoDocumentsOutline size={18} /> },
        { value: 'editor', label: translation.tabs.configEditor, icon: <BiHdd size={18} /> },
        { value: 'import-export', label: translation.tabs.importExport, icon: <BiFile size={18} /> },
        { value: 'system', label: translation.tabs.system, icon: <BiCog size={18} /> },
        { value: 'about', label: translation.tabs.about, icon: <BiInfoCircle size={18} /> },
    ];

    return (
        <>
            {/* Desktop Navigation - oben */}
            <nav className="hidden md:block">
                <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4">
                    <PASegmentedControl
                        options={tabs}
                        value={currentTab}
                        onChange={onTabChange}
                        fullWidth
                        size="md"
                    />
                </div>
            </nav>

            {/* Mobile Bottom Tabbar */}
            <nav className="md:hidden fixed bottom-4 left-4 right-4 z-50 drop-shadow-2xl">
                <PASegmentedControl
                    options={tabs.map(tab => ({ ...tab, icon: React.cloneElement(tab.icon as React.ReactElement, { size: 22 }) }))}
                    value={currentTab}
                    onChange={onTabChange}
                    fullWidth
                    size="lg"
                    iconOnly={window.innerWidth < 400}
                />
            </nav>
        </>
    );
}

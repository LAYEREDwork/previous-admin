import React from 'react';
import { Nav } from 'rsuite';

import { useLanguage } from '../../contexts/PALanguageContext';
import { PASize } from '../../lib/types/sizes';
import { PASegmentedControl } from '../controls/PASegmentedControl';
import { 
    SFDocumentOnDocumentFill, 
    SFLongTextPageAndPencilFill, 
    SFSquareAndArrowUpFill,
    SFDesktopcomputer,
    SFInfoBubbleFill
} from '../sf-symbols';

interface MainMenuProps {
    currentTab: string;
    onTabChange: (tab: string) => void;
}

export function MainMenuPartial({ currentTab, onTabChange }: MainMenuProps) {
    const { translation } = useLanguage();

    const tabs = [
        { value: 'configs', label: translation.tabs.savedConfigs, icon: <SFDocumentOnDocumentFill size={23} /> },
        { value: 'editor', label: translation.tabs.configEditor, icon: <SFLongTextPageAndPencilFill size={23} /> },
        { value: 'import-export', label: translation.tabs.importExport, icon: <SFSquareAndArrowUpFill size={23} /> },
        { value: 'system', label: translation.tabs.system, icon: <SFDesktopcomputer size={23} /> },
        { value: 'about', label: translation.tabs.about, icon: <SFInfoBubbleFill size={23} /> },
    ];

    return (
        <>
            {/* Desktop Navigation - RSuite Nav */}
            <div className="hidden md:block">
                <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
                    <Nav
                        activeKey={currentTab}
                        onSelect={onTabChange}
                        appearance="subtle"
                        justified
                        className="w-full"
                    >
                        {tabs.map((tab) => (
                            <Nav.Item
                                key={tab.value}
                                eventKey={tab.value}
                                className="flex items-center gap-2 text-base font-medium"
                            >
                                {tab.icon}
                                <span>{tab.label}</span>
                            </Nav.Item>
                        ))}
                    </Nav>
                </div>
            </div>

            {/* Mobile Bottom Tabbar */}
            <nav className="md:hidden fixed bottom-3 left-3 right-3 z-50 drop-shadow-2xl">
                <PASegmentedControl
                    options={tabs.map(tab => ({ ...tab, icon: React.cloneElement(tab.icon as React.ReactElement, { size: 22 }) }))}
                    value={currentTab}
                    onChange={onTabChange}
                    fullWidth
                    size={PASize.lg}
                    iconOnly
                />
            </nav>
        </>
    );
}

import { Nav } from 'rsuite';

import {
    SFDocumentOnDocumentFill,
    SFLongTextPageAndPencilFill,
    SFSquareAndArrowUpFill,
    SFDesktopcomputer,
    SFInfoBubbleFill
} from '@frontend/components/sf-symbols';
import { useLanguage } from '@frontend/contexts/PALanguageContext';

interface MainMenuProps {
    currentTab: string;
    onTabChange: (tab: string) => void;
}

export function MainMenuPartial({ currentTab, onTabChange }: MainMenuProps) {
    const { translation } = useLanguage();

    // Desktop tabs with full labels
    const desktopTabs = [
        { value: 'configs', label: translation.tabs.savedConfigs, icon: <SFDocumentOnDocumentFill size={23} /> },
        { value: 'editor', label: translation.tabs.configEditor, icon: <SFLongTextPageAndPencilFill size={23} /> },
        { value: 'import-export', label: translation.tabs.importExport, icon: <SFSquareAndArrowUpFill size={23} /> },
        { value: 'system', label: translation.tabs.system, icon: <SFDesktopcomputer size={23} /> },
        { value: 'about', label: translation.tabs.about, icon: <SFInfoBubbleFill size={23} /> },
    ];

    return (
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
            <Nav
                activeKey={currentTab}
                onSelect={onTabChange}
                appearance="subtle"
                justified
                className="w-full"
            >
                {desktopTabs.map((tab) => (
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
    );
}

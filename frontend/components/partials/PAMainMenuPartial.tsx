import { Nav } from 'rsuite';

import { useLanguage } from '../../contexts/PALanguageContext';
import { PATabBar } from '../controls/PATabBar';
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

    // Desktop tabs with full labels
    const desktopTabs = [
        { value: 'configs', label: translation.tabs.savedConfigs, icon: <SFDocumentOnDocumentFill size={23} /> },
        { value: 'editor', label: translation.tabs.configEditor, icon: <SFLongTextPageAndPencilFill size={23} /> },
        { value: 'import-export', label: translation.tabs.importExport, icon: <SFSquareAndArrowUpFill size={23} /> },
        { value: 'system', label: translation.tabs.system, icon: <SFDesktopcomputer size={23} /> },
        { value: 'about', label: translation.tabs.about, icon: <SFInfoBubbleFill size={23} /> },
    ];

    // Mobile tabs with short labels
    const mobileTabs = [
        { value: 'configs', label: translation.tabs.mobile.savedConfigs, icon: <SFDocumentOnDocumentFill size={23} /> },
        { value: 'editor', label: translation.tabs.mobile.configEditor, icon: <SFLongTextPageAndPencilFill size={23} /> },
        { value: 'import-export', label: translation.tabs.mobile.importExport, icon: <SFSquareAndArrowUpFill size={23} /> },
        { value: 'system', label: translation.tabs.mobile.system, icon: <SFDesktopcomputer size={23} /> },
        { value: 'about', label: translation.tabs.mobile.about, icon: <SFInfoBubbleFill size={23} /> },
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
            </div>

            {/* Mobile Bottom Tabbar - iOS-style */}
            <PATabBar
                options={mobileTabs.map(tab => ({
                    value: tab.value,
                    label: tab.label,
                    icon: tab.icon
                }))}
                value={currentTab}
                onChange={onTabChange}
            />
        </>
    );
}

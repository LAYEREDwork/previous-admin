import { BiHdd, BiFile, BiInfoCircle, BiCog } from 'react-icons/bi';
import { IoDocumentsOutline } from 'react-icons/io5';
import { Nav } from 'rsuite';
import { useLanguage } from '../../contexts/LanguageContext';

interface MainMenuProps {
    currentTab: string;
    onTabChange: (tab: string) => void;
}

export function MainMenuPartial({ currentTab, onTabChange }: MainMenuProps) {
    const { translation } = useLanguage();

    const tabs = [
        { id: 'configs', label: translation.tabs.savedConfigs, icon: IoDocumentsOutline },
        { id: 'editor', label: translation.tabs.configEditor, icon: BiHdd },
        { id: 'import-export', label: translation.tabs.importExport, icon: BiFile },
        { id: 'system', label: translation.tabs.system, icon: BiCog },
        { id: 'about', label: translation.tabs.about, icon: BiInfoCircle },
    ];

    return (
        <nav>
            <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
                <Nav appearance="subtle" justified activeKey={currentTab} onSelect={(key) => onTabChange(key as string)}>
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <Nav.Item
                                key={tab.id}
                                eventKey={tab.id}
                                icon={<Icon size={18} />}
                            >
                                <span className="hidden md:inline">{tab.label}</span>
                            </Nav.Item>
                        );
                    })}
                </Nav>
            </div>
        </nav>
    );
}

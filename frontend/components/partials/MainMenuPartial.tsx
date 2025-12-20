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
        <>
            {/* Desktop Navigation - oben */}
            <nav className="hidden md:block">
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

            {/* Mobile Bottom Tabbar */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/75 dark:bg-gray-800/75 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-800/60 border-t border-gray-200 dark:border-gray-700 shadow-lg transition-colors duration-200">
                <div className="flex justify-around items-center h-16 px-2">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = currentTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className={`flex flex-col items-center justify-center py-1 px-2 min-w-0 flex-1 transition-colors duration-200 ${isActive
                                        ? 'text-blue-600 dark:text-blue-400'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                <Icon size={24} className="mb-1 font-bold" />
                                <span className="hidden">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}

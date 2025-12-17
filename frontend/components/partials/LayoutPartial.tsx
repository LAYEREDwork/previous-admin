import { ReactNode, useState, useEffect } from 'react';
import { BiLogOut, BiUser } from 'react-icons/bi';
import { ThemeSwitcher } from '../controls/ThemeSwitcher';
import { LanguageSwitcher } from '../controls/LanguageSwitcher';
import { NeXTLogo } from '../controls/NeXTLogo';
import { FooterPartial } from './FooterPartial';
import { MainMenuPartial } from './MainMenuPartial';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { getCurrentVersion } from '../../lib/versionManager';
import { Button, ButtonGroup } from 'rsuite';
import { useControlSize } from '../../hooks/useControlSize';

interface LayoutProps {
  children: ReactNode;
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export function Layout({ children, currentTab, onTabChange }: LayoutProps) {
  const { username, logout } = useAuth();
  const { translation } = useLanguage();
  const [version, setVersion] = useState<string>('');

  const controlSize = useControlSize('sm');

  useEffect(() => {
    getCurrentVersion().then(setVersion);
  }, []);



  return (
    <div className="min-h-screen bg-gray-50 dark:bg-next-bg transition-colors flex flex-col">
      <div className="md:sticky md:top-0 z-50 bg-white/75 dark:bg-next-panel/75 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-next-panel/60 border-b border-gray-200 dark:border-next-border shadow-sm transition-colors duration-200">
        <header className="border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3 sm:py-6 gap-3 sm:gap-0">
              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <div className="w-12 h-12 sm:w-[60px] sm:h-[60px] flex-shrink-0">
                  <NeXTLogo size={60} className="w-full h-full" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-base sm:text-xl font-bold text-gray-900 dark:text-next-text truncate">
                      {translation.layout.title}
                    </h1>
                    {version && (
                      <span className="text-xs text-gray-400 dark:text-gray-500 font-mono flex-shrink-0">
                        v{version}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-next-text-dim truncate">
                    {translation.layout.subtitle}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                <ButtonGroup>
                  <Button appearance="default" size={controlSize} disabled>
                    <BiUser size={16} className="inline-block mr-2" />
                    <span className="truncate max-w-[80px] sm:max-w-none">{username}</span>
                  </Button>
                </ButtonGroup>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <ThemeSwitcher />
                  <LanguageSwitcher />
                  <Button
                    onClick={logout}
                    appearance="default"
                    size={controlSize}
                    title={translation.layout.signOut}
                  >
                    <BiLogOut size={16} className="inline-block mr-2" />
                    <span className="hidden md:inline">{translation.layout.signOut}</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <MainMenuPartial currentTab={currentTab} onTabChange={onTabChange} />
      </div>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 flex-grow w-full">
        {children}
      </main>

      <FooterPartial />
    </div>
  );
}

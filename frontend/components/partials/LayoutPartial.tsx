import { ReactNode, useState, useEffect } from 'react';
import { BiLogOut } from 'react-icons/bi';
import { PAThemeSwitcher } from '../controls/PAThemeSwitcher';
import { PALanguageSwitcher } from '../controls/PALanguageSwitcher';
import { PANeXTLogo } from '../controls/PANeXTLogo';
import { FooterPartial } from './FooterPartial';
import { MainMenuPartial } from './MainMenuPartial';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { getCurrentVersion } from '../../lib/versionManager';
import { ButtonGroup } from 'rsuite';
import { PAButton } from '../controls/PAButton';
import { useControlSize } from '../../hooks/useControlSize';

interface LayoutProps {
  children: ReactNode;
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export function Layout({ children, currentTab, onTabChange }: LayoutProps) {
  const { logout } = useAuth();
  const { translation } = useLanguage();
  const [version, setVersion] = useState<string>('');

  const controlSize = useControlSize('sm');

  useEffect(() => {
    getCurrentVersion().then(setVersion);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-next-bg transition-colors flex flex-col">
      {/* Mobile Header - kompakter */}
      <div className="md:hidden sticky top-0 z-50 bg-white/75 dark:bg-next-panel/75 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-next-panel/60 border-b border-gray-200 dark:border-next-border px-4 py-3 transition-colors duration-200">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="w-13 h-13 flex-shrink-0">
              <PANeXTLogo size={52} className="w-full h-full" />
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                {translation.layout.title}
              </h1>
              {version && (
                <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                  v{version}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PAThemeSwitcher />
              <PALanguageSwitcher />
            </div>
            <PAButton
              onClick={logout}
              appearance="ghost"
              size="sm"
              title={translation.layout.signOut}
            >
              <BiLogOut size={16} />
            </PAButton>
          </div>
        </div>
      </div>

      <div className="hidden md:block md:sticky md:top-0 z-50 bg-white/75 dark:bg-next-panel/75 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-next-panel/60 border-b border-gray-200 dark:border-next-border shadow-md transition-colors duration-200">
        <header>
          <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3 sm:py-6 gap-3 sm:gap-0">
              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] flex-shrink-0">
                  <PANeXTLogo size={72} className="w-full h-full" />
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
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <PAThemeSwitcher />
                  <PALanguageSwitcher />
                  <PAButton
                    onClick={logout}
                    appearance="default"
                    size={controlSize}
                    title={translation.layout.signOut}
                  >
                    <BiLogOut size={16} className="inline-block mr-2" />
                    <span className="hidden md:inline">{translation.layout.signOut}</span>
                  </PAButton>
                </div>
              </div>
            </div>
          </div>
        </header>

        <MainMenuPartial currentTab={currentTab} onTabChange={onTabChange} />
      </div>

      <main className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 flex-grow w-full pb-8">
        {children}
        {/* Spacer for the mobile menu bar */}
        <div className="block md:hidden" style={{ height: '44px' }} />
      </main>

      {/* Mobile Bottom Tabbar */}
      <div className="md:hidden">
        <MainMenuPartial currentTab={currentTab} onTabChange={onTabChange} />
      </div>

      <div className="hidden md:block">
        <FooterPartial />
      </div>
    </div>
  );
}

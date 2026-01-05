import { ReactNode } from 'react';

import { useLanguage } from '../../contexts/PALanguageContext';
import { PAFontSwitcher } from '../controls/PAFontSwitcher';
import { PALanguageSwitcher } from '../controls/PALanguageSwitcher';
import { PANeXTLogo } from '../controls/PANeXTLogo';
import { PAThemeSwitcher } from '../controls/PAThemeSwitcher';

import { FooterPartial } from './PAFooterPartial';
import { MainMenuPartial } from './PAMainMenuPartial';


interface LayoutProps {
  children: ReactNode;
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export function Layout({ children, currentTab, onTabChange }: LayoutProps) {
  const { translation } = useLanguage();

  return (
    <div className="min-h-screen transition-colors flex flex-col" style={{ backgroundColor: 'var(--rs-body)' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--rs-border-primary)] transition-colors duration-200" style={{backgroundColor: 'var(--rs-bg-card)'}}>
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3 sm:py-6 gap-3 sm:gap-0">
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] flex-shrink-0">
                <PANeXTLogo size={72} className="w-full h-full" shadow={true} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-sm sm:text-base font-bold text-[var(--rs-text-primary)] truncate">
                    {translation.layout.title}
                  </h1>
                </div>
                <p className="text-xs text-[var(--rs-text-secondary)] truncate">
                  {translation.layout.subtitle}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <PALanguageSwitcher />
                <PAFontSwitcher />
                <PAThemeSwitcher />
              </div>
            </div>
          </div>
        </div>
        <MainMenuPartial currentTab={currentTab} onTabChange={onTabChange} />
      </header>

      <main className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 flex-grow w-full">
        {children}
      </main>

      <FooterPartial />
    </div>
  );
}

import { useState, useEffect } from 'react';
import { PALanguageProvider } from './contexts/PALanguageContext';
import { PAConfigProvider } from './contexts/PAConfigContext';
import { PANotificationProvider } from './contexts/PANotificationContext';
import { PAErrorBoundary } from './components/PAErrorBoundary';
import { Layout } from './components/partials/PALayoutPartial';
import { PAConfigEditor } from './components/pages/PAConfigEditorPage';
import { PAConfigList } from './components/pages/PAConfigListPage';
import { PAImportExport } from './components/pages/PAImportExportPage';
import { PASystem } from './components/pages/PASystemPage';
import { PAAbout } from './components/pages/PAAboutPage';
import { CustomProvider } from 'rsuite';
import { Configuration } from './lib/database';
import { ThemeProvider, useTheme } from './contexts/PAThemeContext';

function PAAppContent() {
  const { actualTheme } = useTheme();
  const [currentTab, setCurrentTab] = useState(() => {
    // Restore last active tab from localStorage
    const savedTab = localStorage.getItem('currentTab');
    return savedTab || 'configs';
  });
  const [editingConfigId, setEditingConfigId] = useState<string | null>(null);

  // Save current tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('currentTab', currentTab);
  }, [currentTab]);

  function handleEditConfig(config: Configuration) {
    setEditingConfigId(config.id);
    setCurrentTab('editor');
  }

  const content = (
    <Layout currentTab={currentTab} onTabChange={setCurrentTab}>
      {currentTab === 'editor' && <PAConfigEditor configId={editingConfigId} onTabChange={setCurrentTab} />}
      {currentTab === 'configs' && <PAConfigList onEdit={handleEditConfig} />}
      {currentTab === 'import-export' && <PAImportExport />}
      {currentTab === 'system' && <PASystem />}
      {currentTab === 'about' && <PAAbout />}
    </Layout>
  );

  return (
    <CustomProvider theme={actualTheme}>
      {content}
    </CustomProvider>
  );
}

function App() {
  return (
    <PAErrorBoundary>
      <PALanguageProvider>
        <PANotificationProvider>
          <PAConfigProvider>
            <ThemeProvider>
              <PAAppContent />
            </ThemeProvider>
          </PAConfigProvider>
        </PANotificationProvider>
      </PALanguageProvider>
    </PAErrorBoundary>
  );
}

export default App;

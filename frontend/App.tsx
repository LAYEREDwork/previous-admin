import { useState } from 'react';
import { CustomProvider } from 'rsuite';

import { PASystem } from '@frontend/components/pages/system/PASystemPage';

import { PAErrorBoundary } from './components/PAErrorBoundary';
import { PAAbout } from './components/pages/PAAboutPage';
import { PAConfigEditor } from './components/pages/PAConfigEditorPage';
import { PAConfigList } from './components/pages/PAConfigListPage';
import { PAImportExport } from './components/pages/PAImportExportPage';
import { Layout } from './components/partials/PALayoutPartial';
import { PAConfigProvider } from './contexts/PAConfigContext';
import { FontProvider } from './contexts/PAFontContext';
import { PALanguageProvider } from './contexts/PALanguageContext';
import { PANotificationProvider } from './contexts/PANotificationContext';
import { ThemeProvider, useTheme } from './contexts/PAThemeContext';
import { useTabNavigation } from './hooks/useTabNavigation';
import { Configuration } from './lib/database';

function PAAppContent() {
  const { actualTheme } = useTheme();
  const { currentTab, setCurrentTab } = useTabNavigation();
  const [editingConfigId, setEditingConfigId] = useState<string | null>(null);

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
      <FontProvider>
        <PALanguageProvider>
          <PANotificationProvider>
            <PAConfigProvider>
              <ThemeProvider>
                <PAAppContent />
              </ThemeProvider>
            </PAConfigProvider>
          </PANotificationProvider>
        </PALanguageProvider>
      </FontProvider>
    </PAErrorBoundary>
  );
}

export default App;

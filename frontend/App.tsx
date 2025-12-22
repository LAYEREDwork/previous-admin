import { useState, useEffect } from 'react';
import { PALanguageProvider } from './contexts/PALanguageContext';
import { PAAuthProvider, useAuth } from './contexts/PAAuthContext';
import { PAConfigProvider } from './contexts/PAConfigContext';
import { PANotificationProvider } from './contexts/PANotificationContext';
import { PAErrorBoundary } from './components/PAErrorBoundary';
import { Layout } from './components/partials/PALayoutPartial';
import { PAConfigEditor } from './components/pages/PAConfigEditorPage';
import { PAConfigList } from './components/pages/PAConfigListPage';
import { PAImportExport } from './components/pages/PAImportExportPage';
import { PASystem } from './components/pages/PASystemPage';
import { PAAbout } from './components/pages/PAAboutPage';
import { Login } from './components/pages/PALoginPage';
import { CustomProvider } from 'rsuite';
import { Configuration } from './lib/database';

function PAAppContent() {
  const { isAuthenticated, loading } = useAuth();
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Laden...</div>
      </div>
    );
  }

  function handleEditConfig(config: Configuration) {
    setEditingConfigId(config.id);
    setCurrentTab('editor');
  }

  const content = !isAuthenticated ? (
    <Login />
  ) : (
    <Layout currentTab={currentTab} onTabChange={setCurrentTab}>
      {currentTab === 'editor' && <PAConfigEditor configId={editingConfigId} onTabChange={setCurrentTab} />}
      {currentTab === 'configs' && <PAConfigList onEdit={handleEditConfig} />}
      {currentTab === 'import-export' && <PAImportExport />}
      {currentTab === 'system' && <PASystem />}
      {currentTab === 'about' && <PAAbout />}
    </Layout>
  );

  return (
    <CustomProvider theme="dark">
      {content}
    </CustomProvider>
  );
}

function App() {
  return (
    <PAErrorBoundary>
      <PALanguageProvider>
        <PANotificationProvider>
          <PAAuthProvider>
            <PAConfigProvider>
              <PAAppContent />
            </PAConfigProvider>
          </PAAuthProvider>
        </PANotificationProvider>
      </PALanguageProvider>
    </PAErrorBoundary>
  );
}

export default App;

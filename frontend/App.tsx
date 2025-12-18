import { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ConfigProvider } from './contexts/ConfigContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { Layout } from './components/partials/LayoutPartial';
import { ConfigEditor } from './components/pages/ConfigEditorPage';
import { ConfigList } from './components/pages/ConfigListPage';
import { ImportExport } from './components/pages/ImportExportPage';
import { System } from './components/pages/SystemPage';
import { About } from './components/pages/AboutPage';
import { Login } from './components/pages/LoginPage';
import { Configuration } from './lib/database';
import { CustomProvider } from 'rsuite';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const { actualTheme } = useTheme();
  const [currentTab, setCurrentTab] = useState(() => {
    // Restore last active tab from localStorage
    const savedTab = localStorage.getItem('currentTab');
    return savedTab || 'configs';
  });

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

  function handleEditConfig(_config: Configuration) {
    setCurrentTab('editor');
  }

  const content = !isAuthenticated ? (
    <Login />
  ) : (
    <Layout currentTab={currentTab} onTabChange={setCurrentTab}>
      {currentTab === 'editor' && <ConfigEditor />}
      {currentTab === 'configs' && <ConfigList onEdit={handleEditConfig} />}
      {currentTab === 'import-export' && <ImportExport />}
      {currentTab === 'system' && <System />}
      {currentTab === 'about' && <About />}
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
    <ThemeProvider>
      <LanguageProvider>
        <NotificationProvider>
          <AuthProvider>
            <ConfigProvider>
              <AppContent />
            </ConfigProvider>
          </AuthProvider>
        </NotificationProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;

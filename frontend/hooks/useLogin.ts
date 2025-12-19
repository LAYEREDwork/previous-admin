import { useState, useEffect, useRef } from 'react';

// Hooks
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNotification } from '../contexts/NotificationContext';

// Utilities
import { checkSetupRequired } from '../lib/api';
import { database } from '../lib/database';

/**
 * Custom hook to handle login page business logic.
 * Manages state and operations for user authentication and setup.
 */
export function useLoginLogic() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [isSetup, setIsSetup] = useState(false);
  const [visible, setVisible] = useState(false);

  const { login, setup } = useAuth();
  const { translation } = useLanguage();
  const { showError, showSuccess } = useNotification();

  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log('[Login] Hook: Checking if setup is required...');
    checkSetupRequired().then(required => {
      console.log('[Login] Hook: Setup required:', required);
      setIsSetup(required);
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!username) {
        usernameRef.current?.focus();
      } else if (!password) {
        passwordRef.current?.focus();
      } else if (isSetup && !confirmPassword) {
        confirmPasswordRef.current?.focus();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [username, password, confirmPassword, isSetup]);

  const handlePasswordVisibilityChange = () => {
    setVisible(!visible);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[Login] Hook: Form submitted, isSetup:', isSetup, 'username:', username);

    if (isSetup && password !== confirmPassword) {
      console.log('[Login] Hook: Password mismatch detected');
      showError(translation.login.passwordMismatch);
      return;
    }

    setLoading(true);
    console.log('[Login] Hook: Starting authentication process...');

    try {
      if (isSetup) {
        console.log('[Login] Hook: Calling setup API...');
        await setup(username, password);
        console.log('[Login] Hook: Setup completed successfully');
      } else {
        console.log('[Login] Hook: Calling login API...');
        await login(username, password);
        console.log('[Login] Hook: Login completed successfully');
      }
    } catch (err) {
      console.error('[Login] Hook: Authentication failed:', err);
      showError(err instanceof Error ? err.message : translation.login.loginFailed);
    } finally {
      setLoading(false);
      console.log('[Login] Hook: Authentication process finished');
    }
  };

  const handleDatabaseImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.log('[Login] Hook: No file selected for database import');
      return;
    }

    console.log('[Login] Hook: Starting database import, file:', file.name, 'size:', file.size);
    setImporting(true);
    try {
      const text = await file.text();
      console.log('[Login] Hook: File content loaded, parsing JSON...');
      let dump;

      try {
        dump = JSON.parse(text);
        console.log('[Login] Hook: JSON parsed successfully');
      } catch {
        console.error('[Login] Hook: Invalid JSON file format');
        throw new Error('Invalid JSON file format');
      }

      if (!dump || typeof dump !== 'object') {
        console.error('[Login] Hook: Invalid database dump structure');
        throw new Error('Invalid database dump structure');
      }

      console.log('[Login] Hook: Calling database setup import...');
      const result = await database.setupImportDatabase(dump);
      console.log('[Login] Hook: Database import completed:', result);

      showSuccess(translation.login.databaseImportSuccess.replace('{count}', result.stats.configurations.imported.toString()));

      event.target.value = '';

      // Clear session cache and reload page to ensure fresh state from backend
      console.log('[Login] Hook: Clearing caches and reloading page in 1.5 seconds...');
      setTimeout(() => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('[Login] Hook: Error importing database:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      showError(translation.login.databaseImportFailed.replace('{error}', errorMessage));
      event.target.value = '';
    } finally {
      setImporting(false);
      console.log('[Login] Hook: Database import process finished');
    }
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    importing,
    isSetup,
    visible,
    handlePasswordVisibilityChange,
    handleSubmit,
    handleDatabaseImport,
    usernameRef,
    passwordRef,
    confirmPasswordRef,
  };
}
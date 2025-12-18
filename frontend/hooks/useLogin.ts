import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNotification } from '../contexts/NotificationContext';
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
    checkSetupRequired().then(required => setIsSetup(required));
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

    if (isSetup && password !== confirmPassword) {
      showError(translation.login.passwordMismatch);
      return;
    }

    setLoading(true);

    try {
      if (isSetup) {
        await setup(username, password);
      } else {
        await login(username, password);
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : translation.login.loginFailed);
    } finally {
      setLoading(false);
    }
  };

  const handleDatabaseImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const text = await file.text();
      let dump;

      try {
        dump = JSON.parse(text);
      } catch (_parseError) {
        throw new Error('Invalid JSON file format');
      }

      if (!dump || typeof dump !== 'object') {
        throw new Error('Invalid database dump structure');
      }

      const result = await database.setupImportDatabase(dump);

      showSuccess(translation.login.databaseImportSuccess.replace('{count}', result.stats.configurations.imported.toString()));

      event.target.value = '';

      // Clear session cache and reload page to ensure fresh state from backend
      setTimeout(() => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error importing database:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      showError(translation.login.databaseImportFailed.replace('{error}', errorMessage));
      event.target.value = '';
    } finally {
      setImporting(false);
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
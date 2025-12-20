// Components
import { PANeXTLogo } from '../controls/PANeXTLogo';
import { PALanguageSwitcher } from '../controls/PALanguageSwitcher';
import { PAThemeSwitcher } from '../controls/PAThemeSwitcher';

// Partials
import { LoginFormPartial } from '../partials/login/LoginFormPartial';

// Hooks
import { useLanguage } from '../../contexts/LanguageContext';
import { useControlSize } from '../../hooks/useControlSize';
import { useLoginLogic } from '../../hooks/useLogin';

export function Login() {
  const controlSize = useControlSize('lg');
  const { translation } = useLanguage();

  const {
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
  } = useLoginLogic();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-next-bg dark:to-next-panel flex items-center justify-center p-3 sm:p-4">
      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex items-center gap-2">
        <PAThemeSwitcher />
        <PALanguageSwitcher />
      </div>
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center mb-3 sm:mb-4">
            <div className="w-20 h-20 sm:w-[100px] sm:h-[100px]">
              <PANeXTLogo size={100} className="w-full h-full" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-next-text mb-2">
            {isSetup ? translation.login.setupTitle : translation.login.title}
          </h1>
        </div>

        <LoginFormPartial
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          loading={loading}
          importing={importing}
          isSetup={isSetup}
          visible={visible}
          handlePasswordVisibilityChange={handlePasswordVisibilityChange}
          handleSubmit={handleSubmit}
          handleDatabaseImport={handleDatabaseImport}
          usernameRef={usernameRef}
          passwordRef={passwordRef}
          confirmPasswordRef={confirmPasswordRef}
          controlSize={controlSize}
          translation={translation}
        />
      </div>
    </div>
  );
}

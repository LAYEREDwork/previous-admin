import { BiUserPlus, BiDownload, BiLogInCircle, BiShow, BiHide, BiLock } from 'react-icons/bi';
import { useLanguage } from '../../contexts/LanguageContext';
import { NeXTLogo } from '../controls/NeXTLogo';
import { LanguageSwitcher } from '../controls/LanguageSwitcher';
import { ThemeSwitcher } from '../controls/ThemeSwitcher';
import { Input, Button, Divider, InputGroup } from 'rsuite';

import { useControlSize } from '../../hooks/useControlSize';
import { useLoginLogic } from '../../hooks/useLogin';

export function Login() {
  const controlSize = useControlSize('lg');

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

  const { translation } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-next-bg dark:to-next-panel flex items-center justify-center p-3 sm:p-4">
      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex items-center gap-2">
        <ThemeSwitcher />
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center mb-3 sm:mb-4">
            <div className="w-20 h-20 sm:w-[100px] sm:h-[100px]">
              <NeXTLogo size={100} className="w-full h-full" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-next-text mb-2">
            {isSetup ? translation.login.setupTitle : translation.login.title}
          </h1>
        </div>

        <div className="bg-white dark:bg-next-panel rounded-2xl shadow-xl p-5 sm:p-8 border border-gray-200 dark:border-next-border">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-next-text mb-2">
                {translation.login.username}
              </label>
              <InputGroup size={controlSize}>
                <InputGroup.Addon>
                  <BiUserPlus />
                </InputGroup.Addon>
                <Input
                  inputRef={usernameRef}
                  type="text"
                  value={username}
                  onChange={(value) => setUsername(value)}
                  placeholder={translation.login.usernamePlaceholder}
                  autoComplete="username"
                />
              </InputGroup>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-next-text mb-2">
                {translation.login.password}
              </label>
              <InputGroup size={controlSize}>
                <InputGroup.Addon>
                  <BiLock />
                </InputGroup.Addon>
                <Input
                  inputRef={passwordRef}
                  type={visible ? 'text' : 'password'}
                  value={password}
                  onChange={(value) => setPassword(value)}
                  placeholder={translation.login.passwordPlaceholder}
                  autoComplete={isSetup ? "new-password" : "current-password"}
                />
                <InputGroup.Button onClick={handlePasswordVisibilityChange}>
                  {visible ? <BiShow /> : <BiHide />}
                </InputGroup.Button>
              </InputGroup>
            </div>

            {isSetup && (
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-next-text mb-2">
                  {translation.login.confirmPassword}
                </label>
                <InputGroup size={controlSize}>
                  <InputGroup.Addon>
                    <BiLock />
                  </InputGroup.Addon>
                  <Input
                    inputRef={confirmPasswordRef}
                    type={visible ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(value) => setConfirmPassword(value)}
                    placeholder={translation.login.confirmPasswordPlaceholder}
                    autoComplete="new-password"
                  />
                  <InputGroup.Button onClick={handlePasswordVisibilityChange}>
                    {visible ? <BiShow /> : <BiHide />}
                  </InputGroup.Button>
                </InputGroup>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              loading={loading}
              appearance="primary"
              size={controlSize}
              block
              className="flex items-center justify-center gap-2"
            >
              {isSetup ? (
                <>
                  <BiUserPlus size={16} className="sm:w-[18px] sm:h-[18px]" />
                  {loading ? translation.login.creatingAccount : translation.login.createAccount}
                </>
              ) : (
                <>
                  <BiLogInCircle size={16} className="sm:w-[18px] sm:h-[18px]" />
                  {loading ? translation.login.signingIn : translation.login.signIn}
                </>
              )}
            </Button>
          </form>

          {isSetup && (
            <>
              <Divider>or</Divider>

              <div className="mt-4 sm:mt-6">
                <label className="block">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleDatabaseImport}
                    disabled={importing || loading}
                    className="hidden"
                    id="import-setup-database"
                  />
                  <Button
                    as="span"
                    appearance="ghost"
                    size={controlSize}
                    block
                    disabled={importing || loading}
                    loading={importing}
                    className="flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <BiDownload size={18} className="sm:w-[18px] sm:h-[18px]" />
                    {importing ? 'Importing Database...' : 'Import Existing Database'}
                  </Button>
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                  Restore from a previously exported database backup
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

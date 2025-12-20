import { BiUserPlus, BiLock, BiShow, BiHide, BiLogInCircle, BiDownload } from 'react-icons/bi';
import { Input, InputGroup, Divider } from 'rsuite';
import { PAButton } from '../../controls/PAButton';
import { Translations } from '../../../lib/translations';

interface LoginFormPartialProps {
    username: string;
    setUsername: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    confirmPassword?: string;
    setConfirmPassword?: (value: string) => void;
    loading: boolean;
    importing: boolean;
    isSetup: boolean;
    visible: boolean;
    handlePasswordVisibilityChange: () => void;
    handleSubmit: (e: React.FormEvent) => void;
    handleDatabaseImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
    usernameRef: React.RefObject<HTMLInputElement>;
    passwordRef: React.RefObject<HTMLInputElement>;
    confirmPasswordRef: React.RefObject<HTMLInputElement>;
    controlSize: 'sm' | 'md' | 'lg';
    translation: Translations;
}

export function LoginFormPartial({
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
    controlSize,
    translation
}: LoginFormPartialProps) {
    return (
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

                {isSetup && setConfirmPassword && (
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

                <PAButton
                    type="submit"
                    disabled={loading}
                    loading={loading}
                    appearance="primary"
                    size={controlSize}
                    color="accent"
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
                </PAButton>
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
                            <PAButton
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
                            </PAButton>
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                            Restore from a previously exported database backup
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}

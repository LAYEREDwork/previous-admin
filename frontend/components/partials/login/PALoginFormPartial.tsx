import { BiUserPlus, BiLock, BiShow, BiHide, BiLogInCircle, BiDownload } from 'react-icons/bi';
import { Input, InputGroup, Divider } from 'rsuite';
import { PASkeuomorphButton, PASkeuomorphButtonType } from '../../controls/PASkeuomorphButton';
import { Translations } from '../../../lib/translations';
import { PASize } from '../../../lib/types/sizes';

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
                    <label htmlFor="username-input" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-next-text mb-2">
                        {translation.login.username}
                    </label>
                    <InputGroup size={controlSize}>
                        <InputGroup.Addon>
                            <BiUserPlus />
                        </InputGroup.Addon>
                        <Input
                            id="username-input"
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
                    <label htmlFor="password-input" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-next-text mb-2">
                        {translation.login.password}
                    </label>
                    <InputGroup size={controlSize}>
                        <InputGroup.Addon>
                            <BiLock />
                        </InputGroup.Addon>
                        <Input
                            id="password-input"
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
                        <label htmlFor="confirm-password-input" className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-next-text mb-2">
                            {translation.login.confirmPassword}
                        </label>
                        <InputGroup size={controlSize}>
                            <InputGroup.Addon>
                                <BiLock />
                            </InputGroup.Addon>
                            <Input
                                id="confirm-password-input"
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

                <PASkeuomorphButton
                    buttonType={PASkeuomorphButtonType.submit}
                    size={PASize.MD}
                    fullWidth
                    icon={isSetup ? <BiUserPlus size={18} /> : <BiLogInCircle size={18} />}
                    disabled={importing || loading || !username || !password}
                    className="self-end sm:self-auto"
                    color={username && password && !importing && !loading ? '#fff' : undefined}
                >
                    {isSetup ? (
                        <>
                            {loading ? translation.login.creatingAccount : translation.login.createAccount}
                        </>
                    ) : (
                        <>
                            {loading ? translation.login.signingIn : translation.login.signIn}
                        </>
                    )}
                </PASkeuomorphButton>
            </form>

            {isSetup && (
                <>
                    <Divider>{translation.login.or}</Divider>

                    <div className="mt-4 sm:mt-6">
                        <label htmlFor="import-setup-database" className="block cursor-pointer">
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleDatabaseImport}
                                disabled={importing || loading}
                                className="hidden"
                                id="import-setup-database"
                            />
                            <PASkeuomorphButton
                                buttonType={PASkeuomorphButtonType.submit}
                                size={PASize.MD}
                                fullWidth
                                icon={<BiDownload size={18} />}
                                disabled={importing || loading}
                                className="self-end sm:self-auto"
                            >
                                {importing ? translation.login.importingDatabase : translation.login.importExistingDatabase}
                            </PASkeuomorphButton>
                        </label>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                            {translation.login.importDatabaseHint}
                        </p>
                    </div>
                </>
            )}
        </div>
    );
}

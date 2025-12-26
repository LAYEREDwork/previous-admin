import { BiUserPlus, BiLock, BiShow, BiHide, BiLogInCircle, BiDownload } from 'react-icons/bi';
import { Divider } from 'rsuite';
import { PANeomorphButton, PANeomorphButtonType } from '../../controls/PANeomorphButton';
import { PACard, PACardRelief } from '../../controls/PACard';
import { PAInput } from '../../controls/PAInput';
import { Translations } from '../../../lib/translations';
import { PASize } from '../../../lib/types/sizes';

const LOGIN_PANEL_BACKGROUND = '#1a1a1a';

interface PALoginFormPartialProps {
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
    importDatabaseRef: React.RefObject<HTMLInputElement>;
    controlSize: PASize;
    translation: Translations;
}

/**
 * Rendert das Login- beziehungsweise Setup-Formular mit neomorphem Button und vertieft wirkenden Eingaben.
 */
export function PALoginFormPartial({
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
    importDatabaseRef,
    controlSize,
    translation
}: PALoginFormPartialProps) {
    return (
        <PACard
            className="rounded-2xl shadow-xl p-5 sm:p-8"
            backgroundColor={LOGIN_PANEL_BACKGROUND}
            relief={PACardRelief.EMBOSSED}
        >
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                    <label htmlFor="username-input" className="block text-xs sm:text-sm font-medium text-next-text mb-2">
                        {translation.login.username.toUpperCase()}
                    </label>
                    <PAInput
                        size={controlSize}
                        prefixIcon={<BiUserPlus />}
                        inputId="username-input"
                        inputRef={usernameRef}
                        inputType="text"
                        value={username}
                        onChange={(value) => setUsername(value)}
                        placeholder={translation.login.usernamePlaceholder}
                        autoComplete="username"
                    />
                </div>

                <div>
                    <label htmlFor="password-input" className="block text-xs sm:text-sm font-medium text-next-text mb-2">
                        {translation.login.password.toUpperCase()}
                    </label>
                    <PAInput
                        size={controlSize}
                        prefixIcon={<BiLock />}
                        inputId="password-input"
                        inputRef={passwordRef}
                        inputType={visible ? 'text' : 'password'}
                        value={password}
                        onChange={(value) => setPassword(value)}
                        placeholder={translation.login.passwordPlaceholder}
                        autoComplete={isSetup ? "new-password" : "current-password"}
                        suffixButton={visible ? <BiShow /> : <BiHide />}
                        onSuffixButtonClick={handlePasswordVisibilityChange}
                    />
                </div>

                {isSetup && setConfirmPassword && (
                    <div>
                        <label htmlFor="confirm-password-input" className="block text-xs sm:text-sm font-medium text-next-text mb-2">
                            {translation.login.confirmPassword.toUpperCase()}
                        </label>
                        <PAInput
                            size={controlSize}
                            prefixIcon={<BiLock />}
                            inputId="confirm-password-input"
                            inputRef={confirmPasswordRef}
                            inputType={visible ? 'text' : 'password'}
                            value={confirmPassword ?? ''}
                            onChange={(value) => setConfirmPassword(value)}
                            placeholder={translation.login.confirmPasswordPlaceholder}
                            autoComplete="new-password"
                            suffixButton={visible ? <BiShow /> : <BiHide />}
                            onSuffixButtonClick={handlePasswordVisibilityChange}
                        />
                    </div>
                )}

                <PANeomorphButton
                    type={PANeomorphButtonType.submit}
                    size={PASize.md}
                    fullWidth
                    icon={isSetup ? <BiUserPlus size={18} /> : <BiLogInCircle size={18} />}
                    disabled={importing || loading || !username || !password}
                    className="self-end sm:self-auto"
                    color={username && password && !importing && !loading ? '#fff' : undefined}
                    baseColor={LOGIN_PANEL_BACKGROUND}
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
                </PANeomorphButton>
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
                                ref={importDatabaseRef}
                            />
                            <PANeomorphButton
                                type={PANeomorphButtonType.submit}
                                size={PASize.md}
                                fullWidth
                                icon={<BiDownload size={18} className="icon-inner-emboss" />}
                                disabled={importing || loading}
                                className="self-end sm:self-auto"
                                baseColor={LOGIN_PANEL_BACKGROUND}
                                onClick={() => importDatabaseRef.current?.click()}
                            >
                                {importing ? translation.login.importingDatabase : translation.login.importExistingDatabase}
                            </PANeomorphButton>
                        </label>
                        <p className="text-xs text-gray-400 mt-2 text-center">
                            {translation.login.importDatabaseHint}
                        </p>
                    </div>
                </>
            )}
        </PACard>
    );
}

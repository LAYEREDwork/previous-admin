import { BiUserPlus, BiLogInCircle, BiDownload } from 'react-icons/bi';
import { Divider } from 'rsuite';
import { PAButton } from '../../controls/PAButton';
import { PACard } from '../../controls/PACard';
import { PAInput } from '../../controls/PAInput';
import { Translations } from '../../../lib/translations';
import { PASize } from '../../../lib/types/sizes';

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
        >
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                    <label htmlFor="username-input" className="block text-xs sm:text-sm font-medium text-next-text mb-2">
                        {translation.login.username.toUpperCase()}
                    </label>
                    <PAInput
                        size={controlSize}
                        id="username-input"
                        ref={usernameRef}
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                        id="password-input"
                        ref={passwordRef}
                        type={visible ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={translation.login.passwordPlaceholder}
                        autoComplete={isSetup ? "new-password" : "current-password"}
                    />
                </div>

                {isSetup && setConfirmPassword && (
                    <div>
                        <label htmlFor="confirm-password-input" className="block text-xs sm:text-sm font-medium text-next-text mb-2">
                            {translation.login.confirmPassword.toUpperCase()}
                        </label>
                        <PAInput
                            size={controlSize}
                            id="confirm-password-input"
                            ref={confirmPasswordRef}
                            type={visible ? 'text' : 'password'}
                            value={confirmPassword ?? ''}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder={translation.login.confirmPasswordPlaceholder}
                            autoComplete="new-password"
                        />
                    </div>
                )}

                <PAButton
                    type="submit"
                    size={PASize.md}
                    block
                    icon={isSetup ? <BiUserPlus size={18} /> : <BiLogInCircle size={18} />}
                    disabled={importing || loading || !username || !password}
                    className="self-end sm:self-auto"
                    appearance={username && password && !importing && !loading ? 'primary' : 'default'}
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
                </PAButton>
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
                            <PAButton
                                type="submit"
                                size={PASize.md}
                                block
                                icon={<BiDownload size={18} />}
                                disabled={importing || loading}
                                className="self-end sm:self-auto"
                                onClick={() => importDatabaseRef.current?.click()}
                            >
                                {importing ? translation.login.importingDatabase : translation.login.importExistingDatabase}
                            </PAButton>
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

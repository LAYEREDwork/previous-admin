import { useLanguage } from '../../contexts/LanguageContext';
import { PAGeminiIcon } from '../controls/PAGeminiIcon';

export function FooterPartial() {
    const { translation } = useLanguage();

    return (
        <footer className="bg-white dark:bg-next-panel border-t border-gray-200 dark:border-next-border py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 text-center text-sm">
                <div className="text-gray-900 dark:text-white font-medium mb-4">
                    {translation.footer.copyright}
                </div>
                <div className="text-gray-500 dark:text-next-text-dim space-y-0.5 text-xs">
                    <div className="flex items-center justify-center gap-1">
                        <span>{translation.footer.madeIn}</span>
                        <PAGeminiIcon size={16} className="align-middle -translate-y-[3px]" />
                        <span>{translation.footer.inBregenz}</span>
                    </div>
                    <div>{translation.footer.atLakeConstance}</div>
                    <div>{translation.footer.austria}</div>
                </div>
            </div>
        </footer>
    );
}

import { useLanguage } from '../../contexts/PALanguageContext';
import { PATexture } from '../../lib/utils/color';

export function FooterPartial() {
    const { translation } = useLanguage();

    return (
        <footer className="border-t-2 py-8 mt-auto" style={{ backgroundImage: PATexture.fineNoise, backgroundColor: '#0a0a0a', borderTopColor: '#2a2a2a' }}>
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 text-center text-sm">
                <div className="text-gray-900 dark:text-gray-100 font-medium mb-4">
                    {translation.footer.copyright}
                </div>
                <div className="text-next-text-dim space-y-0.5 text-xs">
                    <div className="flex items-center justify-center gap-1">
                        <span>{translation.footer.madeIn}</span>
                    </div>
                    <div>{translation.footer.atLakeConstance}</div>
                    <div>{translation.footer.austria}</div>
                </div>
            </div>
        </footer>
    );
}

'use client';
import { getUsedTranslationKeys } from '@/utils/i18nKeyManager';

export default function ExportTranslationButton() {
    const handleExport = () => {
        const allKeys = getUsedTranslationKeys();
        const scaffold = {};

        for (const ns in allKeys) {
            scaffold[ns] = allKeys[ns].reduce((acc, key) => {
                acc[key] = '';
                return acc;
            }, {});
        }

        const blob = new Blob([JSON.stringify(scaffold, null, 2)], {
            type: 'application/json',
        });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'translation-scaffold.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <button
            onClick={handleExport}
            style={{ position: 'fixed', bottom: '1rem', right: '1rem', zIndex: 1000 }}
        >
            Export Translations
        </button>
    );
}

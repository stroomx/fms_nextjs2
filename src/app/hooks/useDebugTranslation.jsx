import { useTranslation as useI18nTranslation } from 'react-i18next';
import {
    recordTranslationKey,
    getDebugMode,
} from '@/app/utils/i18nKeyManager';

export function useDebugTranslation() {
    const namespaces = ['labels', 'actions', 'phrases'];

    const { t: originalT, ...rest } = useI18nTranslation(namespaces);

    const t = (key, options = {}) => {
        const ns = options.ns || (Array.isArray(namespaces) ? namespaces[0] : namespaces || 'translation');

        recordTranslationKey(ns, key);

        return getDebugMode() ? `@@${key}@@` : originalT(key, options);
    };

    return { t, ...rest };
}

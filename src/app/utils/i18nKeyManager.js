import Cookies from 'js-cookie';

const STORAGE_KEY = 'i18n-used-keys';
let usedKeysByNamespace = {};

function loadFromStorage() {
    if (!getDebugMode() || typeof window === 'undefined') return;

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            for (const ns in parsed) {
                usedKeysByNamespace[ns] = new Set(parsed[ns]);
            }
        }
    } catch (e) {
        console.warn('Failed to load translation keys from localStorage', e);
    }
}

loadFromStorage();

function saveToStorage() {
    const jsonReady = {};
    for (const ns in usedKeysByNamespace) {
        jsonReady[ns] = Array.from(usedKeysByNamespace[ns]);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jsonReady));
}

export function getDebugMode() {
    return Cookies.get('i18n-debug') === 'true';
}

export function recordTranslationKey(ns, key) {
    if (!getDebugMode()) return;

    if (!usedKeysByNamespace[ns]) {
        usedKeysByNamespace[ns] = new Set();
    }
    usedKeysByNamespace[ns].add(key);
    saveToStorage();
}

export function getUsedTranslationKeys() {
    const result = {};
    for (const ns in usedKeysByNamespace) {
        result[ns] = Array.from(usedKeysByNamespace[ns]).sort();
    }
    return result;
}

export function clearStoredTranslationKeys() {
    localStorage.removeItem(STORAGE_KEY);
    usedKeysByNamespace = {};
}

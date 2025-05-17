import { map, currencyLocaleOverrides } from "./contry-currency";


/**
 * Formats a number or string into a currency format.
 * @param {number|string} value - The value to format (can be a number or a string representing a number).
 * @param {string} currency - The currency code (e.g., 'USD', 'EUR', 'GBP').
 * @param {string} [locale='en-US'] - The locale for formatting (default is 'en-US').
 * @returns {string} - The formatted currency string.
 */

//! Old Implementation
// export function formatCurrency(value, currency = 'USD', locale = 'en-US') {
//     // Ensure the value is a number (parse it if it's a string)
//     let numberValue = typeof value === 'string' ? parseFloat(value) : value;

//     if (!numberValue)
//         numberValue = 0;

//     if (isNaN(numberValue)) {
//         throw new Error(`Invalid number or string value: ${numberValue}`);
//     }

//     // Use Intl.NumberFormat to format the number into currency
//     return new Intl.NumberFormat(locale, {
//         style: 'currency',
//         currency: currency,
//     }).format(numberValue);
// }

/**
 * Formats a number as currency based on the country name
 * @param {number|string} value - The amount to format
 * @param {string} code - The country code to look up
 * @returns {string}
 */
export default function formatCurrencyByCountry(value, code = "US") {
    if (code == null) code = "US";

    const currency = map[code];

    if (!currency) {
        return `${value} (Currency unknown for ${code})`;
    }

    const locale = currencyLocaleOverrides[currency] || `${countryCode.toLowerCase()}-${countryCode.toUpperCase()}`;


    let numberValue = typeof value === 'string' ? parseFloat(value) : value;
    if (!numberValue) numberValue = 0;

    if (isNaN(numberValue)) {
        return `Invalid value: "${value}"`;
    }

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
    }).format(numberValue);
}

/**
 * Examples:
 * console.log(formatCurrency(1234.56)); // "$1,234.56"
 * console.log(formatCurrency(1234.56, 'EUR', 'en-GB')); // "€1,234.56"
 * console.log(formatCurrency(1234.56, 'GBP', 'de-DE')); // "1.234,56 £"
 */

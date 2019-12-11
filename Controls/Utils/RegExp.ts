const specialChars = /[$^*+?.(){}[\]\\|]/g;

/**
 * $1 - Minus.
 * $2 - Integer part.
 * $3 - The separator of the integer and fractional parts.
 * $4 - Fractional part.
 */
export const partOfNumber: RegExp =  /(-?)([0-9]*)([.,]?)([0-9]*)/;

/**
 * Escaping special characters of a regular expression.
 * @param original Escaping value.
 * @return Escaped value.
 */
export function escapeSpecialChars(original: string): string {
   return original.replace(specialChars, '\\$&');
}

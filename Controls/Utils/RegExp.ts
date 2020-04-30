const WORD_BOUNDARY = '^|[^\\wа-я]|$';
const SPECIAL_CHARS = /[$^*+?.(){}[\]\\|]/g;

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
   return original.replace(SPECIAL_CHARS, '\\$&');
}

/**
 * Добавить к строке регулярного выражения проверку, является ли строка словом.
 * @remark
 * Используется для работы с кириллицей и латиницей.
 * Устраняет недостаток работы специального символа \b(@{link https://learn.javascript.ru/regexp-boundary граница слова}.
 * Граница слова \b не работает для алфавитов, не основанных на латинице.
 * @param original строка регулярного выражения.
 * @param flags влаги регулярного выражения.
 * @return Регулярное выражение с проверкой, является ли исходная строка словом.
 */
export function addWordCheck(original: string, flags: string): RegExp {
   const result = `(${WORD_BOUNDARY})(?:${original})(${WORD_BOUNDARY})`;
   const resultRegExp = new RegExp(result, flags);
   const originalExec = resultRegExp.exec;
   resultRegExp.exec = (str) => {
      const originalExecResult = originalExec.call(resultRegExp, str);

      if (originalExecResult === null) {
         return null;
      }

      let found = Array.prototype.shift.call(originalExecResult);

      // Удаляем границы из набора результатов
      const startBorder = Array.prototype.shift.call(originalExecResult);
      found = found.replace(new RegExp(`^${escapeSpecialChars(startBorder)}`), '');
      const endBorder = Array.prototype.pop.call(originalExecResult);
      found = found.replace(new RegExp(`${escapeSpecialChars(endBorder)}$`), '');

      originalExecResult.input = found;
      originalExecResult.index += startBorder.length;
      originalExecResult.lastIndex -= endBorder.length;
      Array.prototype.unshift.call(originalExecResult, found);

      return originalExecResult;
   };

   return resultRegExp;
}

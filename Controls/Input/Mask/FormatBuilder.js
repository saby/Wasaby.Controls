define('Controls/Input/Mask/FormatBuilder',
   [],
   function() {

      'use strict';

      var
         _private = {

            // Парные разделители открывающего типа. Порядок должен совпадать с порядком в closeDelimiters.
            openDelimiters: '({[⟨<\'"«„‘”',

            // Парные разделители закрывающего типа. Порядок должен совпадать с порядком в openDelimiters.
            closeDelimiters: ')}]⟩>\'"»“’”',

            maskCharType: {
               1: 'end',
               2: 'key',
               4: 'pairingDelimiter',
               5: 'open',
               6: 'close',
               7: 'singlingDelimiter'
            },

            /**
             * Экранирование специальных символов регулярного выражения.
             * @param {String} value экранируемое значение.
             * @return {String} Заэкранированное значение.
             */
            escapeRegSpecialChars: function(value) {
               return value.replace(/[\(\)\{\}\[\]\?\+\*\.]/g, '\\$&');
            },

            /**
             * Получить ключи маски в виде строки.
             * @param {Object} formatMaskChars ключи и значения маски {@link Controls/Input/Mask#formatMaskChars}.
             * @return {String} ключи маски.
             */
            getMaskKeysString: function(formatMaskChars) {
               var maskKeys = '';

               for (var maskKey in formatMaskChars) {
                  maskKeys += maskKey;
               }

               return _private.escapeRegSpecialChars(maskKeys);
            },

            /**
             * Получить замену для ключа, как его значение.
             * @param {Object} formatMaskChars ключи и значения маски {@link Controls/Input/Mask#formatMaskChars}.
             * @param {String} key ключ.
             * @param {String} quantifier квантор.
             * @return {String} строка замены ключа.
             */
            getReplacingKeyAsValue: function(formatMaskChars, key, quantifier) {
               return (quantifier ? '(?:' + formatMaskChars[key] + quantifier + ')' : formatMaskChars[key]) + '?';
            },

            /**
             * Получить замену для ключа, как его значение или заменитель.
             * @param {Object} formatMaskChars ключи и значения маски {@link Controls/Input/Mask#formatMaskChars}.
             * @param {String} replacer заменитель {@link Controls/Input/Mask#replacer}.
             * @param {String} key ключ.
             * @param {String} quantifier квантор.
             * @return {String} строка замены ключа.
             */
            getReplacingKeyAsValueAndReplacer: function(formatMaskChars, replacer, key, quantifier) {
               return '(?:' + formatMaskChars[key] + '|' + replacer + ')' + quantifier;
            },

            /**
             * Получить функция замены ключа.
             * @param {String} replacer заменитель.
             * @return {Function} функция замены ключа.
             */
            getReplacingKeyFn: function(formatMaskChars, replacer) {
               //Need to escape the replacer in case it is a special regular expression character
               replacer = _private.escapeRegSpecialChars(replacer);

               return replacer ? _private.getReplacingKeyAsValueAndReplacer.bind(this, formatMaskChars, replacer) : _private.getReplacingKeyAsValue.bind(this, formatMaskChars);
            },

            /**
             * Получить регулярное выражение для поиска кванторов, специальных конструкций, ключей, парных разделителей,
             * одиночных разделителей и конца маски(;).
             * @param {String} maskKeys ключи маски.
             * @param {String} openDelimiters парные разделители открывающего типа.
             * @param {String} closeDelimiters парные разделители закрывающего типа.
             * @return {RegExp} регулярное выражение.
             */
            getRegExpSearchingMaskChar: function(maskKeys, openDelimiters, closeDelimiters) {
               var expression = '';

               // Конец маски
               expression += '(;$)';

               // Ключи
               expression += '|([' + maskKeys + '])';

               // Кванторы +, *, ?, {n[, m]}
               expression += '(?:\\\\({.*?}|.))?';

               // Парные разделители
               expression += '|(([' + _private.escapeRegSpecialChars(openDelimiters) + '])|([' + _private.escapeRegSpecialChars(closeDelimiters) + ']))';

               // Одиночные разделители
               expression += '|(.)';

               return new RegExp(expression, 'g');
            },

            /**
             * Получить данные символа маски.
             * @param execSearchingGroupChar результат exec.
             * @return {{value: String значение, type: String тип}}
             */
            getMaskCharData: function(execSearchingGroupChar) {
               var maskCharData = {};

               for (var i = 1; i < execSearchingGroupChar.length; i++) {
                  if (execSearchingGroupChar[i]) {
                     if ('type' in maskCharData) {
                        maskCharData.subtype = _private.maskCharType[i];

                        return maskCharData;
                     } else {
                        maskCharData.value = execSearchingGroupChar[i];
                        maskCharData.type = _private.maskCharType[i];

                        if (maskCharData.type === 'key') {
                           maskCharData.quantifier = execSearchingGroupChar[i + 1] || '';

                           return maskCharData;
                        }

                        if (maskCharData.type !== 'pairingDelimiter') {
                           return maskCharData;
                        }
                     }
                  }
               }
            },

            /**
             * Получить данные о маске.
             * @param mask
             * @param searchingGroupChar
             * @param getReplacingKey
             * @return {{searchingGroups: String регулрное выражение для поиска групп, delimiterGroups: Object.<String> значение групп разделителей}}
             */
            getFormat: function(mask, searchingGroupChar, getReplacingKey) {
               var
                  keysGroup = '',
                  searchingGroups = '',
                  singlingDelimitersGroup = '',
                  positionGroup = 0,
                  groupInPairingDelimiter = 0,
                  delimiterGroups = {},
                  execSearchingGroupChar, maskCharData;

               mask += ';';

               execSearchingGroupChar = searchingGroupChar.exec(mask);
               while (execSearchingGroupChar) {
                  maskCharData = _private.getMaskCharData(execSearchingGroupChar);

                  // Конец группы ключей.
                  if (keysGroup && (maskCharData.type !== 'key' || groupInPairingDelimiter > 0)) {
                     keysGroup = '';
                     searchingGroups += ')';
                     positionGroup++;
                  }

                  // Конец группы одиночных разделителей.
                  if (singlingDelimitersGroup && maskCharData.type !== 'singlingDelimiter') {
                     delimiterGroups[positionGroup] = {
                        value: singlingDelimitersGroup,
                        type: 'single'
                     };
                     singlingDelimitersGroup = '';
                     searchingGroups += ')?';
                     positionGroup++;
                  }

                  // Начало группы ключей или группы разделителей.
                  if (
                     (maskCharData.type === 'key' && !keysGroup) ||
                     (maskCharData.type === 'singlingDelimiter' && !singlingDelimitersGroup)) {
                     searchingGroups += '(';
                  }

                  // Найденый символ ключ.
                  if (maskCharData.type === 'key') {
                     searchingGroups += getReplacingKey(maskCharData.value, maskCharData.quantifier);
                     keysGroup += maskCharData.value;
                  }

                  // Найденый символ парный разделитель.
                  if (maskCharData.type === 'pairingDelimiter') {
                     delimiterGroups[positionGroup] = {
                        type: 'pair',
                        value: maskCharData.value,
                        subtype: maskCharData.subtype
                     };

                     if (maskCharData.subtype === 'open') {
                        delimiterGroups[positionGroup].pair = _private.closeDelimiters[_private.openDelimiters.indexOf(maskCharData.value)];
                        groupInPairingDelimiter++;
                     } else {
                        delimiterGroups[positionGroup].pair = _private.openDelimiters[_private.closeDelimiters.indexOf(maskCharData.value)];
                        groupInPairingDelimiter--;
                     }

                     searchingGroups += '(' + _private.escapeRegSpecialChars(maskCharData.value) + ')?';
                     positionGroup++;
                  }

                  // Найденый символ одиночный разделитель.
                  if (maskCharData.type === 'singlingDelimiter') {
                     searchingGroups += _private.escapeRegSpecialChars(maskCharData.value);
                     singlingDelimitersGroup += maskCharData.value;
                  }

                  //while loop
                  execSearchingGroupChar = searchingGroupChar.exec(mask);
               }

               return {
                  searchingGroups: searchingGroups,
                  delimiterGroups: delimiterGroups
               };
            }
         },
         FormatBuilder = {
            pairingDelimiters: '(){}[]⟨⟩<>\'\'""«»„“‘’””',

            /**
             * Получить данные о маске.
             * @param {String} mask маска {@link Controls/Input/Mask#mask}.
             * @param {Object} formatMaskChars ключи и значения маски {@link Controls/Input/Mask#formatMaskChars}.
             * @param {String} replacer заменитель {@link Controls/Input/Mask#replacer}.
             * @return {{searchingGroups: String регулрное выражение для поиска групп, delimiterGroups: Object.<String> значение групп разделителей}}
             */
            getFormat: function(mask, formatMaskChars, replacer) {
               return _private.getFormat(
                  mask,
                  _private.getRegExpSearchingMaskChar(
                     _private.getMaskKeysString(formatMaskChars),
                     _private.openDelimiters,
                     _private.closeDelimiters
                  ),
                  _private.getReplacingKeyFn(formatMaskChars, replacer)
               );
            }
         };

      FormatBuilder._private = _private;

      return FormatBuilder;
   }
);

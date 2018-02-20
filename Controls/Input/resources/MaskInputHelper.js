define('Controls/Input/resources/MaskInputHelper',
   [
      'Controls/Input/resources/MaskHelper'
   ],
   function(MaskHelper) {

      'use strict';

      var
         _private = {
            /**
             * Получить данные путем приведения исходного значения в виде разбиения к маске.
             * @param maskData данные о маске.
             * @param splitValue значения в виде разбиения.
             * @return {
             *    {
             *       value: String значение с разделителями,
             *       positions: Array позиция курсора
             *    }|undefined
             * }
             */
            getDataBySplitValue: function(maskData, splitValue) {
               return MaskHelper.getData(maskData, {
                  value: splitValue.before + splitValue.after,
                  position: splitValue.before.length
               });
            }
         },
         MaskInputHelper = {
            /**
             * Получить разбиение чистого значения.
             * @param splitValue разбиение исходного значения.
             * @param clearData чистые данные.
             * @return {Object}
             */
            getClearSplitValue: function(splitValue, clearData) {
               var
                  clearSplitValue = {},
                  start = 0, position;

               clearSplitValue.before = clearData.value.substring(start, clearData.positions[splitValue.before.length]);
               start = clearSplitValue.before.length;
               position = splitValue.before.length;

               clearSplitValue.delete = clearData.value.substring(start, clearData.positions[position + splitValue.delete.length]);
               start += clearSplitValue.delete.length;
               position += splitValue.delete.length;

               clearSplitValue.after = clearData.value.substring(start, clearData.positions[position + splitValue.after.length]);

               clearSplitValue.insert = splitValue.insert;

               return clearSplitValue;
            },
            /**
             * Вставка.
             * @param maskData данные маски.
             * @param clearSplitValue разбиение чистого значения.
             * @param replacer заменитель.
             * @returns {{value: (String) новая строка, position: (Integer) позиция курсора}}
             */
            insert: function(maskData, clearSplitValue, replacer) {
               var char, oldClearSplitValue, newClearSplitValue, data, result;

               oldClearSplitValue = {
                  before: clearSplitValue.before,
                  after: clearSplitValue.delete.replace(/./g, replacer) + clearSplitValue.after
               };
               // Будем добавлять по 1 символу, потому что вставка должна работать так же как и ввод по 1 символу.
               for (var i = 0; i < clearSplitValue.insert.length; i++) {
                  char = clearSplitValue.insert[i];

                  /**
                   * Если последний символ заменитель, то попытаемся сделать сдвиг.
                   */
                  if (replacer === oldClearSplitValue.after.slice(-1)) {
                     newClearSplitValue = {
                        before: oldClearSplitValue.before + char,
                        after: oldClearSplitValue.after.slice(0, -1)
                     };

                     data = _private.getDataBySplitValue(maskData, newClearSplitValue);
                  } else {
                     // Добавляем символ без замены следующего.
                     newClearSplitValue = {
                        before: oldClearSplitValue.before + char,
                        after: oldClearSplitValue.after
                     };

                     data = _private.getDataBySplitValue(maskData, newClearSplitValue);
                     // Если не получилось, то поробуем заменить.
                     if (!data) {
                        newClearSplitValue = {
                           before: oldClearSplitValue.before + char,
                           after: oldClearSplitValue.after.substring(1)
                        };

                        data = _private.getDataBySplitValue(maskData, newClearSplitValue);
                     }
                  }

                  if (data) {
                     result = data;
                     data = undefined;
                     oldClearSplitValue = newClearSplitValue;
                  }
               }

               return result;
            },
            /**
             * Удаление.
             * @param maskData данные маски.
             * @param clearSplitValue разбиение чистого значения.
             * @param replacer заменитель.
             * @returns {{value: (String) новая строка, position: (Integer) позиция курсора}}
             */
            delete: function(maskData, clearSplitValue, replacer) {
               return _private.getDataBySplitValue(maskData, {
                  before: clearSplitValue.before,
                  after: clearSplitValue.delete.replace(/./g, replacer) + clearSplitValue.after
               });
            },

            /**
             * Удаление через delete.
             * @param maskData данные маски.
             * @param clearSplitValue разбиение чистого значения.
             * @param replacer заменитель.
             * @returns {{value: (String) новая строка, position: (Integer) позиция курсора}}
             */
            deleteForward: function(maskData, clearSplitValue, replacer) {
               var newClearSplitValue;

               if (clearSplitValue.delete) {
                  newClearSplitValue = {
                     before: clearSplitValue.before + replacer,
                     after: clearSplitValue.after
                  }
               } else {
                  newClearSplitValue = {
                     before: clearSplitValue.before + replacer,
                     after: clearSplitValue.after.subscribe(1)
                  }
               }

               return _private.getDataBySplitValue(maskData, newClearSplitValue);
            },

            /**
             * Удаление через backspace.
             * @param maskData данные маски.
             * @param clearSplitValue разбиение чистого значения.
             * @param replacer заменитель.
             * @returns {{value: (String) новая строка, position: (Integer) позиция курсора}}
             */
            deleteBackward: function(maskData, clearSplitValue, replacer) {
               var newClearSplitValue;

               if (clearSplitValue.delete) {
                  newClearSplitValue = {
                     before: clearSplitValue.before,
                     after: replacer + clearSplitValue.after
                  }
               } else {
                  newClearSplitValue = {
                     before: clearSplitValue.before.slice(0, -1),
                     after: replacer + clearSplitValue.after
                  }
               }

               return _private.getDataBySplitValue(maskData, newClearSplitValue);
            },
            /**
             * Ввод.
             * @param splitValue значение разбитое на части before, insert, after, delete.
             * @param inputType тип ввода.
             * @param replacer заменитель.
             * @param maskData данные маски, на которую будет проецироваться разбитое значение.
             * @return {{value: (String) новая строка, position: (Integer) позиция курсора}}
             */
            input: function(splitValue, inputType, replacer, maskData) {
               var
                  value = splitValue.before + splitValue.delete + splitValue.after,
                  clearData = MaskHelper.getClearData(maskData, value),
                  clearSplitValue = MaskInputHelper.getClearSplitValue(splitValue, clearData), result;

               switch(inputType) {
                  case 'insert':
                     result = MaskInputHelper.insert(maskData, clearSplitValue, replacer);
                     break;
                  case 'delete':
                     result = MaskInputHelper.delete(maskData, clearSplitValue, replacer);
                     break;
                  case 'deleteForward':
                     result = MaskInputHelper.deleteForward(maskData, clearSplitValue, replacer);
                     break;
                  case 'deleteBackward':
                     result = MaskInputHelper.deleteBackward(maskData, clearSplitValue, replacer);
                     break;
               }

               // Берем старое значение, если не смогли получить результат.
               return result || {
                     value: value,
                     position: splitValue.before.length + splitValue.delete.length
                  };
            }
         };

      MaskInputHelper._private = _private;

      return MaskInputHelper;
   }
);
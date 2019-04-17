

      

      var _private = {

         /**
          * Получить разбиение исходного значения, на группы.
          * Разбиение будет найденно, только в том случае, если значение полностью подходит маске.
          * @param format данные маски, которой подходит исходное значение.
          * @param value исходное значение.
          * @return Array.<String|undefined> группы.
          */
         getValueGroups: function(format, value) {
            var match = value.match(format.searchingGroups);

            if (match && match[0].length === match.input.length) {
               return match.filter(function(item, index) {
                  return index > 0;
               });
            }
         }
      };

      var Formatter = {

         /**
          * Получить чистые данные.
          * Чистыми данными будем называть: значение без разделителей(чистое) и массив для сопоставления
          * позиций символов исходного значения и символов чистого значение.
          * @param {Object} format данные о маске.
          * @param {String} value значение с разделителями.
          * @return {{value: String чистое значение, positions: Array позиция символов исходного значения в чистом значении}}.
          */
         getClearData: function(format, value) {
            var
               position = 0,
               positions = [],
               clearValue = '',
               groups = _private.getValueGroups(format, value),
               charIterator;

            groups.forEach(function(group, groupIndex) {
               if (group) {
                  if (groupIndex in format.delimiterGroups) {
                     for (charIterator = 0; charIterator < group.length; charIterator++) {
                        positions.push(position);
                     }
                  } else {
                     clearValue += group;
                     for (charIterator = 0; charIterator < group.length; charIterator++) {
                        positions.push(position);
                        position++;
                     }
                  }
               }
            });

            return {
               value: clearValue,
               positions: positions
            };
         },

         /**
          * Получить данные путем приведения исходного значения к маске.
          * @param format данные о маске.
          * @param clearData чистые данные. Значение без разделителей и позиция курсора.
          * @return {
          *    {
          *       value: String значение с разделителями,
          *       position: Number позиция курсора
          *    }|undefined
          * }
          */
         getFormatterData: function(format, clearData) {
            var
               value = '',
               pairs = {},
               position = 0,
               delimiters = '',
               stopConcatenation = false,
               isLastPosition = clearData.position === clearData.value.length,
               clearPosition = clearData.position,
               groups = _private.getValueGroups(format, clearData.value),
               firstSingleDelimiters = false,
               pairPosition, every;

            // Определяем значение и позицию с разделителями, через сцепление групп.
            every = groups && groups.every(function(group, groupIndex) {
               if (stopConcatenation) {
                  return true;
               }

               if (groupIndex in format.delimiterGroups) {
                  // Если в очищенные данные попал разделитель, то ничего не получилось.
                  if (group) {
                     return false;
                  }

                  // Группа разделителей.
                  group = format.delimiterGroups[groupIndex].value;

                  switch (format.delimiterGroups[groupIndex].type) {
                     case 'single':
                        // Initial single delimiters in the mask must be added to the data.
                        if (groupIndex === 0) {
                           firstSingleDelimiters = true;
                        }
                        if (firstSingleDelimiters) {
                           value += group;
                           position += group.length;
                        } else {
                           delimiters += group;
                        }
                        break;
                     case 'pair':
                        firstSingleDelimiters = false;
                        if (format.delimiterGroups[groupIndex].subtype === 'open') {
                           if (!pairs[format.delimiterGroups[groupIndex].pair]) {
                              pairs[format.delimiterGroups[groupIndex].pair] = [];
                           }
                           pairs[format.delimiterGroups[groupIndex].pair].push(value.length + delimiters.length);
                        } else {
                           pairPosition = pairs[group].pop();

                           // Добавляем открывающий разделитель.
                           value = value.substring(0, pairPosition) + format.delimiterGroups[groupIndex].pair + value.substring(pairPosition);
                           position += pairPosition <= position;

                           // Добавляем закрывающий разделитель.
                           value += group;

                           // Move carret only when we close a group.
                           // If the closing delimiter closes the last character in field
                           // the caret must be in front of the delimiter.
                           if ((value.length - position === 1) && !(isLastPosition && clearPosition === 0)) {
                              position += 1;
                           }
                        }
                        break;
                  }
               } else if (group) {
                  value += delimiters + group;

                  // The width of the separators is taken into account until we reach the place where the cursor is.
                  if (clearPosition >= 0) {
                     position += delimiters.length;
                     position += clearPosition > group.length ? group.length : clearPosition;
                  }
                  clearPosition -= group.length;
                  delimiters = '';
               } else {
                  // Прекратим сцеплять группы, когда будет отсутствовать одна из групп.
                  stopConcatenation = true;
               }

               return true;
            });

            return every && {
               value: value,
               position: position
            };
         }
      };

      Formatter._private = _private;

      export = Formatter;
   

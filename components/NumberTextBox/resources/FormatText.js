define('js!SBIS3.CONTROLS.NumberTextBox/resources/FormatText', [
      'Core/defaultRenders',
      'js!SBIS3.CONTROLS.Utils.NumberTextBoxUtil'
   ],
   function (cDefaultRenders, NumberTextBoxUtil) /** @lends SBIS3.CONTROLS.NumberTextBox/resources/FormatText.prototype */{
      return {

         formatText: function(value, text, onlyInteger, decimals, integers, delimiters, onlyPositive, maxLength, hideEmptyDecimals){
            // Вырезаем переносы строк и теги.
            value = typeof value === 'string' ? value.replace(/\n/gm, '').replace(/<.*?>/g, '') : value;
            var decimals = onlyInteger ? 0 : decimals,
               dotPos = (value = (value + '')).indexOf('.'),
               parsedVal = dotPos != -1 ? '.' + value.substr(dotPos + 1).replace(/[^0-9]/g, '') : '0',
               isDotLast = (value && value.length) ? dotPos === value.length - 1 : false,
               decimalsPart;

            if (value == '-') {
               return value;
            }

            value = cDefaultRenders.numeric(
               value,
               integers,
               delimiters,
               decimals,
               onlyPositive,
               maxLength,
               true
            );

            if(isDotLast){
               value = value ? value + '.' : '.';
            }

            if(value && hideEmptyDecimals && decimals){
               dotPos = value.indexOf('.');
               if (parsedVal === '0') {
                  value = (dotPos !== -1 ? value.substring(0, dotPos) : value) + '.0';
               } else {
                  decimalsPart = decimals == -1 ? parsedVal : parsedVal.substr(0, decimals + 1);
                  value =  (dotPos !== -1 ? value.substring(0, dotPos) + decimalsPart : value);
               }
            }

            if(!NumberTextBoxUtil.checkMaxLength(value, maxLength)){
               return text;
            }
            return value || '';
         }
      }
   });
import {numberToString} from 'Controls/_decorator/numberToString';

import Control = require('Core/Control');
import entity = require('Types/entity');
import template = require('wml!Controls/_decorator/Number/Number');
      

      /**
       * Отображает числовое значение в форматированном виде. Форматом является число разбитое на триады с ограниченной дробной частью.
       *
       * @class Controls/_decorator/Number
       * @extends Core/Control
       * @control
       * @public
       * @category Decorator
       * @demo Controls-demo/Decorators/Number/Number
       *
       * @author Красильников А.С.
       */

      /*
       * Displays a numeric value in formatted view. The format is a number divided into triads with a limited fractional part.
       *
       * @class Controls/_decorator/Number
       * @extends Core/Control
       * @control
       * @public
       * @category Decorator
       * @demo Controls-demo/Decorators/Number/Number
       *
       * @author Красильников А.С.
       */      

      /**
       * @name Controls/_decorator/Number#number
       * @cfg {Number} Число, которое будет разделено на триады.
       */

      /*
       * @name Controls/_decorator/Number#number
       * @cfg {Number} Number to divide into triads.
       */

      /**
       * @name Controls/_decorator/Number#fractionSize
       * @cfg {Number} Количество знаков после запятой. Диапазон от 0 до 20.
       */

      /*
       * @name Controls/_decorator/Number#fractionSize
       * @cfg {Number} Number of decimal places. Range from 0 to 20.
       */

      /**
       * @name Controls/_decorator/Number#roundMode
       * @cfg {String} Режим форматирования дробной части числа.
       * @variant round При необходимости число округляется, а дробная часть дополняется нулями, чтобы она имела заданную длину.
       * @variant trunc Усекает (отсекает) цифры справа от точки так, чтобы дробная часть имела заданную длину, независимо от того, является ли аргумент положительным или отрицательным числом.
       * @default trunc
       */

      /*
       * @name Controls/_decorator/Number#roundMode
       * @cfg {String} The mode of formatting the fractional part of the number.
       * @variant round The number is rounded if necessary, and the fractional part is padded with zeros if necessary
       * so that it has the specified length.
       * @variant trunc Truncates (cuts off) the digits to the right of dot so that fractional part has the specified length,
       * no matter whether the argument is a positive or negative number.
       * @default trunc
       */

      /**
       * @name Controls/_decorator/Number#useGrouping
       * @cfg {Boolean} Определяет, следует ли использовать групповые разделители, например разделители тысяч.
       * @default true
       * @remark
       * true - Число разделено на группы.
       * false - Ничего не происходит.
       */

      /*
       * @name Controls/_decorator/Number#useGrouping
       * @cfg {Boolean} Determines whether to use grouping separators, such as thousands separators.
       * @default true
       * @remark
       * true - the number is separated into grouping.
       * false - does not do anything.
       */

      var _private = {

         /**
          * Приведение числа к формату с делением на триады.
          * @param number {@link number}
          * @param roundMode {@link roundMode}
          * @param [fractionSize] {@link fractionSize}
          * @param useGrouping {@link useGrouping}
          */

         /*
          * Casting a number to a format with division on triads.
          * @param number {@link number}
          * @param roundMode {@link roundMode}
          * @param [fractionSize] {@link fractionSize}
          * @param useGrouping {@link useGrouping}
          */
         formatNumber: function(number, roundMode, fractionSize, useGrouping) {
            if (typeof fractionSize === 'number') {
               number = _private[roundMode](number, fractionSize);
            } else {
               number = numberToString(number);
            }

            /**
             * Create an array of integer and fractional parts.
             * Divide the integer part into triads.
             */
            if (useGrouping) {
               number = number.split('.');
               number[0] = number[0].replace(/(\d)(?=(\d{3})+$)/g, '$& ');
               number = number.join('.');
            }

            return number;
         },

         /**
          * {@link roundMode} round
          * @param number {@link number}
          * @param fractionSize {@link fractionSize}
          * @returns {String}
          */
         round: function(number, fractionSize) {
            return number.toFixed(fractionSize);
         },

         /**
          * {@link roundMode} trunc
          * @param number {@link number}
          * @param fractionSize {@link fractionSize}
          * @returns {String}
          */
         trunc: function(number, fractionSize) {
            if (fractionSize) {
               var regExp = new RegExp('-?\\d+.?\\d{0,' + fractionSize + '}');

               number = String.prototype.match.call(number, regExp)[0];
            } else {
               number = Math.trunc(number).toString();
            }

            return number;
         }
      };

      var NumberDecorator = Control.extend({
         _template: template,

         _formattedNumber: null,

         _beforeMount: function(options) {
            this._formattedNumber = _private.formatNumber(
               options.number, options.roundMode,
               options.fractionSize, options.useGrouping
            );
         },

         _beforeUpdate: function(newOptions) {
            if (
               newOptions.number !== this._options.number ||
               newOptions.fractionSize !== this._options.fractionSize ||
               newOptions.roundMode !== this._options.roundMode ||
               newOptions.useGrouping !== this._options.useGrouping
            ) {
               this._formattedNumber = _private.formatNumber(
                  newOptions.number, newOptions.roundMode,
                  newOptions.fractionSize, newOptions.useGrouping
               );
            }
         }
      });

NumberDecorator._theme = ['Controls/decorator'];

      NumberDecorator.getDefaultOptions = function() {
         return {
            useGrouping: true,
            roundMode: 'trunc'
         };
      };

      NumberDecorator.getOptionTypes = function() {
         return {
            useGrouping: entity.descriptor(Boolean),
            number: entity.descriptor(Number).required(),
            fractionSize: entity.descriptor(Number),
            roundMode: entity.descriptor(String).oneOf([
               'trunc',
               'round'
            ])
         };
      };

      NumberDecorator._private = _private;

      export = NumberDecorator;
   

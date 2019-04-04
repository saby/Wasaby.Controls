define('Controls/Decorator/Money',
   [
      'Env/Env',
      'Core/Control',
      'Types/entity',
      'Controls/Utils/splitIntoTriads',
      'wml!Controls/Decorator/Money/Money',

      'css!theme?Controls/Decorator/Money/Money'
   ],
   function(Env, Control, entity, splitIntoTriads, template) {
      'use strict';

      /**
       * Converts a number to money.
       *
       * @class Controls/Decorator/Money
       * @extends Core/Control
       *
       * @public
       * @demo Controls-demo/Decorators/Money/Money
       *
       * @author Журавлев М.С.
       */

      /**
       * @name Controls/Decorator/Money#number
       * @cfg {String} Number to convert.
       */

      /**
       * @name Controls/Decorator/Money#delimiters
       * @cfg {Boolean} Determines whether the number should be split into triads.
       * @default false
       * @remark
       * true - the number split into triads.
       * false - does not do anything.
       * @deprecated Use option {@link Controls/input:Number#useGrouping}
       */

      /**
       * @name Controls/Decorator/Money#useGrouping
       * @cfg {Boolean} Determines whether to use grouping separators, such as thousands separators.
       * @default true
       * @remark
       * true - the number is separated into grouping.
       * false - does not do anything.
       */

      /**
       * @name Controls/Decorator/Money#style
       * @cfg {String} The type with which you want to display money.
       * @variant accentResults
       * @variant noAccentResults
       * @variant group
       * @variant basicRegistry
       * @variant noBasicRegistry
       * @variant accentRegistry
       * @variant noAccentRegistry
       * @variant error
       * @variant default
       * @default default
       */

      var _private = {
         searchPaths: /(-?[0-9]*?)(\.[0-9]{2})/,

         parseNumber: function(number, delimiters) {
            if (typeof number === 'number') {
               Env.IoC.resolve('ILogger').warn('Controls/Decorator/Money', 'Тип опции number изменился с Number на String.');
            }
            var exec = this.searchPaths.exec(parseFloat(number).toFixed(2));

            if (!exec) {
               Env.IoC.resolve('ILogger').error('Controls/Decorator/Money', 'That is not a valid option number: ' + number + '.');
               exec = ['0.00', '0', '.00'];
            }

            var integer = delimiters ? splitIntoTriads(exec[1]) : exec[1];
            var fraction = exec[2];

            return {
               integer: integer,
               fraction: fraction,
               number: integer + fraction
            };
         },

         isUseGrouping: function(options, useLogging) {
            if ('delimiters' in options) {
               if (useLogging) {
                  Env.IoC.resolve('ILogger').warn('Controls/Decorator/Money', 'Опция delimiters устарела, используйте useGrouping.');
               }

               return options.delimiters;
            }

            return options.useGrouping;
         }
      };

      var Money = Control.extend({
         _template: template,

         _parsedNumber: null,

         _beforeMount: function(options) {
            this._parsedNumber = _private.parseNumber(options.number, _private.isUseGrouping(options, true));
         },

         _beforeUpdate: function(newOptions) {
            var newUseGrouping = _private.isUseGrouping(newOptions, false);
            var oldUseGrouping = _private.isUseGrouping(this._options, false);

            if (newOptions.number !== this._options.number || newUseGrouping !== oldUseGrouping) {
               this._parsedNumber = _private.parseNumber(newOptions.number, newUseGrouping);
            }
         }
      });

      Money.getDefaultOptions = function() {
         return {
            style: 'default',
            useGrouping: true
         };
      };

      Money.getOptionTypes = function() {
         return {
            style: entity.descriptor(String),
            useGrouping: entity.descriptor(Boolean),
            number: entity.descriptor(Number, String).required()
         };
      };

      Money._private = _private;

      return Money;
   });

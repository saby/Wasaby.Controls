define('Controls/Label',
   [
      'Core/IoC',
      'Core/Control',
      'WS.Data/Type/descriptor',
      'wml!Controls/Label/Label',

      'css!theme?Controls/Label/Label'
   ],
   function(IoC, Control, descriptor, template) {
      'use strict';

      /**
       * Label.
       *
       * @class Controls/Label
       * @extends Core/Control
       * @public
       * @demo Controls-demo/Label/Label
       * @author Журавлев М.С.
       */

      /**
       * @name Controls/Label#caption
       * @cfg {String}
       */

      /**
       * @name Controls/Label#required
       * @cfg {Boolean}
       */

      /**
       * @name Controls/Label#underline
       * @cfg {String}
       * @variant hovered
       * @variant fixed
       * @variant none
       */

      var _private = {
         warn: function(container, className, optionValue) {
            if (container.classList.contains(className)) {
               IoC.resolve('ILogger').warn('Controls/Label', 'Модификатор ' + className + ' не поддерживается. Используйте опцию underline со значением ' + optionValue);
            }
         }
      };

      var Label = Control.extend({
         _template: template,

         _afterMount: function() {
            var container = this._container;

            _private.warn(container, 'controls-Label_underline-hovered', 'hovered');
            _private.warn(container, 'controls-Label_underline_color-hovered', 'fixed');
         }
      });

      Label.getDefaultOptions = function() {
         return {
            underline: 'none'
         };
      };

      Label.getOptionTypes = function() {
         return {
            underline: descriptor(String).oneOf([
               'none',
               'fixed',
               'hovered'
            ]),
            required: descriptor(Boolean)
         };
      };

      return Label;
   });

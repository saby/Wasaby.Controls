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
       * @name Controls/Label#viewMode
       * @cfg {String}
       * @variant link1
       * @variant link2
       * @variant default
       */

      var Label = Control.extend({
         _template: template,

         _afterMount: function() {
            var container = this._container;

            ['controls-Label_underline-hovered', 'controls-Label_underline_color-hovered'].forEach(function(item, arr, index) {
               if (container.classList.contains(item)) {
                  IoC.resolve('ILogger').warn('Controls/Label', 'Модификатор ' + item + ' не поддерживается. Используйте опцию viewMode со значением link' + index);
               }
            });
         }
      });

      Label.getDefaultOptions = function() {
         return {
            viewMode: 'default'
         };
      };

      Label.getOptionTypes = function() {
         return {
            viewMode: descriptor(String).oneOf([
               'link1',
               'link2',
               'default'
            ]),
            required: descriptor(Boolean)
         };
      };

      return Label;
   });

define('Controls/Label',
   [
      'Core/Control',
      'WS.Data/Type/descriptor',
      'wml!Controls/Label/Label',

      'css!theme?Controls/Label/Label'
   ],
   function(Control, descriptor, template) {
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
       */

      var Label = Control.extend({
         _template: template
      });

      Label.getDefaultOptions = function() {
         return {
            viewMode: 'default'
         };
      };

      Label.getOptionTypes = function() {
         return {
            viewMode: descriptor(String).oneOf([
               'link',
               'default'
            ]),
            required: descriptor(Boolean)
         };
      };

      return Label;
   });

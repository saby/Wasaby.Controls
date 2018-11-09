define('Controls/Label',
   [
      'Core/Control',
      'wml!Controls/Label/Label',

      'css!theme?Controls/Label/Label'
   ],
   function(Control, template) {

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

      var Label = Control.extend({
         _template: template
      });

      return Label;
   }
);

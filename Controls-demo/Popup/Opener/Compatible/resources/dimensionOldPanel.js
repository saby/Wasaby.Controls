define('Controls-demo/Popup/Opener/Compatible/resources/dimensionOldPanel',
   [
      'Lib/Control/CompoundControl/CompoundControl',
      'tmpl!Controls-demo/Popup/Opener/Compatible/resources/dimensionOldPanel',
      'SBIS3.CONTROLS/Button'
   ],
   function (CompoundControl, template) {
      'use strict';

      var Panel = CompoundControl.extend({
         _dotTplFn: template,

         $constructor: function () {

         },

         init: function() {
            Panel.superclass.init.call(this);
            this._button= this.getChildControlByName('testButton');
         }
      });

      Panel.dimensions = {
         minWidth: 500
      };
      return Panel;
   }
);
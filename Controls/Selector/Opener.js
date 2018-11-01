define('Controls/Selector/Opener',
   [
      'Core/Control',
      'tmpl!Controls/Selector/Opener'
   ],

   function(Control, template) {

      'use strict';

      var _private = {

      };

      var SelectorOpener = Control.extend({

         _template: template,

         open: function(cfg) {
            return this._children.stackOpener.open(cfg || {});
         },

         close: function() {
            return this._children.stackOpener.close();
         }

      });

      SelectorOpener._private = _private;

      return SelectorOpener;

   });

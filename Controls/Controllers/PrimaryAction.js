define('Controls/Controllers/PrimaryAction',
   [
      'Core/Control',
      'wml!Controls/Controllers/PrimaryAction/PrimaryAction'
   ],

   function(Control, template) {

      'use strict';

      /**
       * Primary action controller. Catches ctrl+enter (cmd+enter) press and fires 'triggered' event.
       */

      return Control.extend({
         _template: template,

         keyPressHandler: function(e) {
            if (!(e.nativeEvent.altKey || e.nativeEvent.shiftKey) && (e.nativeEvent.ctrlKey || e.nativeEvent.metaKey)) { // Ctrl+Enter, Cmd+Enter, Win+Enter
               this._notify('triggered');
            }
         }
      });
   });

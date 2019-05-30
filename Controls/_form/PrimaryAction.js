define('Controls/Controllers/PrimaryAction',
   [
      'Core/Control',
      'Env/Env',
      'wml!Controls/Controllers/PrimaryAction/PrimaryAction'
   ],

   function(Control, Env, template) {
      'use strict';

      /**
       * Primary action controller. Catches ctrl+enter (cmd+enter) press and fires 'triggered' event.
       */

      return Control.extend({
         _template: template,

         keyDownHandler: function(e) {
            if (!(e.nativeEvent.altKey || e.nativeEvent.shiftKey) && (e.nativeEvent.ctrlKey || e.nativeEvent.metaKey) && e.nativeEvent.keyCode === Env.constants.key.enter) { // Ctrl+Enter, Cmd+Enter, Win+Enter
               // If "primary action" processed event, then event must be stopped.
               // Otherwise, parental controls (including other primary action) can react to pressing ctrl+enter and call one more handler
               e.stopPropagation();
               this._notify('triggered');
            }
         }
      });
   });

define('Controls/Controllers/PrimaryAction',
   [
      'Core/Control',
      'tmpl!Controls/Controllers/PrimaryAction/PrimaryAction'
   ],

   function(Control, template) {

      'use strict';

      /**
       * Контроллер главного действия.
       * Обрабатывает нажатие ctrl + enter (cmd + enter) и посылает событие onActivated
       */

      return Control.extend({
         _template: template,

         keyPressHandler: function(e) {
            if(!(e.nativeEvent.altKey || e.nativeEvent.shiftKey) && (e.nativeEvent.ctrlKey || e.nativeEvent.metaKey)) { // Ctrl+Enter, Cmd+Enter, Win+Enter
               this._notify('triggered');
            }
         }
      });
   });
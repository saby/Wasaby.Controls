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

         onKeyPressed: function() {
            if(!(e.altKey || e.shiftKey) && (e.ctrlKey || e.metaKey)) { // Ctrl+Enter, Cmd+Enter, Win+Enter
               this.validate().addCallback(function(results) {
                  this._notify('onActivated');
               });
            }
         }
      });
   });
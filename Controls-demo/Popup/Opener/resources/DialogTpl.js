define('Controls-demo/Popup/Opener/resources/DialogTpl',
   [
      'Env/Env',
      'Core/Control',
      'wml!Controls-demo/Popup/Opener/resources/DialogTpl',
      'css!Controls-demo/Popup/Opener/resources/StackHeader'
   ],
   function(Env, Control, template) {
      'use strict';

      var PopupPage = Control.extend({
         _template: template,
         _close: function() {
            this._notify('close', [], { bubbling: true });
         }
      });
      return PopupPage;
   });

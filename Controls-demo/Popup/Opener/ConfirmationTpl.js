define('Controls-demo/Popup/Opener/ConfirmationTpl',
   [
      'Core/Control',
      'wml!Controls-demo/Popup/Opener/ConfirmationTpl',

   ],

   function(Control, template, config) {
      'use strict';
      var DialogPG = Control.extend({
         _template: template,
         _closeHandler: function() {
            this._notify('close', [], {bubbling: true});
         },
      });
      return DialogPG;
   });

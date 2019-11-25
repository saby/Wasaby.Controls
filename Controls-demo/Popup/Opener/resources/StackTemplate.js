define('Controls-demo/Popup/Opener/resources/StackTemplate',
   ['Core/Control',
      'wml!Controls-demo/Popup/Opener/resources/StackTemplate',
   ],
   function(Control, template) {
      'use strict';

      var PopupPage = Control.extend({
         _template: template,

         _close: function() {
            this._notify('close', [], { bubbling: true });
         },

      });

      return PopupPage;
   });

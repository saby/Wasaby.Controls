define('Controls-demo/Confirmation/Confirmation',
   [
      'Core/Control',
      'tmpl!Controls-demo/Confirmation/Confirmation'
   ],
   function(Control, template) {

      'use strict';

      var InfoBox = Control.extend({
         _template: template,

         _open: function(e, type){
            this._children.popupOpener.open({
               message: 'message',
               details: 'details',
               type: type
            }).addCallback(function(res){
               alert(res);
            });
         }

      });

      return InfoBox;
   }
);
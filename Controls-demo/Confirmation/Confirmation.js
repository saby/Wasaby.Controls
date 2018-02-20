define('Controls-demo/Confirmation/Confirmation',
   [
      'Core/Control',
      'tmpl!Controls-demo/Confirmation/Confirmation'
   ],
   function(Control, template) {

      'use strict';

      var InfoBox = Control.extend({
         _template: template,

         _confirm: function(){
            this._children.popupOpener.open({
               message: 'message',
               details: 'details',
               type: 'yesnocancel'
            }).addCallback(function(res){
               alert(res);
            });
         },

         _message: function(){
            this._children.popupOpener.open({
               message: 'message',
               details: 'details',
               type: 'ok'
            }).addCallback(function(res){
               alert(res);
            });
         }

      });

      return InfoBox;
   }
);
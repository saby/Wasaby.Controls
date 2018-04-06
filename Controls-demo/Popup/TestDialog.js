define('Controls-demo/Popup/TestDialog',
   [
      'Core/Control',
      'tmpl!Controls-demo/Popup/TestDialog'
   ],
   function (Control, template) {
      'use strict';

      var TestDialog = Control.extend({
         _template: template,

         _close: function(){
            this._notify('close', [], {bubbling: true});
         },

         _onClick: function(){
            if( this._options.type === 'sticky' ){
               this._notify('sendResult', [123], {bubbling: true});
            }
            else{
               this._children.stack.open({
                  maxWidth: 600
               });
            }
         }
      });

      return TestDialog;
   }
);
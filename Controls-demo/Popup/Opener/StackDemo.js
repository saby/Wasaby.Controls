define('Controls-demo/Popup/Opener/StackDemo',
   [
      'Core/Control',
      'wml!Controls-demo/Popup/Opener/StackDemo',
      'css!Controls-demo/Popup/PopupPageOld'
   ],
   function (Control, template, OpenEditDialog) {
      'use strict';

      var PopupPage = Control.extend({
         _template: template,
         openStack: function () {
            this._children.stack.open({
               opener: this._children.button1
            });
         },
         openModalStack: function () {
            this._children.stack.open({
               opener: this._children.button4,
               isModal: true
            });
         },
         openDialog: function () {
            this._children.dialog.open({
               opener: this._children.button3
            });
         },
         openModalDialog: function () {
            this._children.dialog.open({
               opener: this._children.button5,
               isModal: true
            });
         },
         openMaximizedStack: function () {
            this._children.stack.open({
               opener: this._children.button2,
               minimizedWidth: 600,
               maximized: true,
               templateOptions: {
                  maximized: true,
                  maximizedButtonVisibility: true

               }
            });
         }
      });
      return PopupPage;
   }
);
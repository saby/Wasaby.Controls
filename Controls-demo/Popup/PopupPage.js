define('Controls-demo/Popup/PopupPage',
   [
      'Core/Control',
      'tmpl!Controls-demo/Popup/PopupPage',
      'Controls-demo/Popup/TestDialog',
      'css!Controls-demo/Popup/PopupPage'
   ],
   function (Control, template) {
      'use strict';

      var PopupPage = Control.extend({
         _template: template,

         constructor: function (cfg) {
            PopupPage.superclass.constructor.call(this, cfg);
         },

         openDialog: function () {
            this._children.dialog.open({
               opener: this._children.dialogButton
            });
         },

         openModalDialog: function () {
            this._children.modalDialog.open({});
         },

         openSticky: function () {
            this._children.sticky.open({
               target: this._children.stickyButton._container,
               opener: this._children.stickyButton,
               templateOptions: {
                  type: this._firstClick ? 'sticky' : 'dialog'
               }
            });
            this._firstClick = true;
         },

         openNotification: function () {
            this._children.notification.open({
               opener: this._children.notificationButton
            });
         },

         openStack: function () {
            this._children.stack.open({
               opener: this._children.stackButton
            });
         },

         openMaximizedStack: function () {
            this._children.maximizedStack.open({
               minWidth: 900,
               maxWidth: 1200,
               minimizedWidth: 600,
               maximized: true,
               opener: this._children.stackButton
            });
         },

         openOldTemplate: function () {
            this._children.openOldTemplate.open({
               opener: this._children.stackButton2,
               isCompoundTemplate: true
            });
         },

         _onResult: function (result) {
            if( result ){
               alert(result);
            }
         }
      });

      return PopupPage;
   }
);
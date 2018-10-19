define('Controls-demo/Router/Panel',
   [
      'Core/Control',
      'wml!Controls-demo/Router/Panel',
      'Controls/Popup/Opener/Stack'
   ],
   function(Control, template) {
      'use strict';
      var myPanels = 0;

      var module = Control.extend({
         _template: template,
         myPanels: -1,
         innChanged: function(e, value) {
            this._notify('innChanged', [value], { bubbling: true });
         },
         kppChanged: function(e, value) {
            this._notify('kppChanged', [value], { bubbling: true });
         },

         successUrl: function() {
            if (!this._mystack) {
               this._children.stack.open();
               this._mystack = true;
            }
         },

         errorUrl: function() {
            if (this._mystack) {
               this._mystack = false;
               var iWantCallbackHere = this._children.stack.close();
               if (iWantCallbackHere && iWantCallbackHere.addCallback) {
                  iWantCallbackHere.addCallback(function (a) {

                  }).addErrback(function () {
                  });
               }
            }
         }
      });

      return module;
   });

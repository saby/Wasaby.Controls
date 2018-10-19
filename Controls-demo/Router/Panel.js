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
         _beforeMount: function(){
            this._onCloseHandler = this._onCloseHandler.bind(this);
            this.myPanels = myPanels++;
         },
         innChanged: function(e, value) {
            this._notify('innChanged', [value], { bubbling: true });
         },
         kppChanged: function(e, value) {
            this._notify('kppChanged', [value], { bubbling: true });
         },

         successUrl: function(event, newLoc, oldLoc) {
            if (!this._mystack) {
               this._lastUrl = oldLoc.url;
               this._lastPrettyUrl = oldLoc.prettyUrl;
               window.requestAnimationFrame(function(){
                  this._children.stack.open();
               }.bind(this));
               this._mystack = true;
            }
         },

         _onCloseHandler: function() {
            if (this.resolvePromise) {
               this.resolvePromise();
               this.resolvePromise = undefined;
               return;
            }
            this._notify('routerUpdated', [this._lastUrl, this._lastPrettyUrl], { bubbling: true });
         },

         errorUrl: function() {
            if (this._mystack) {
               /*return new Promise((resolve)=>{
                     setTimeout(()=>{resolve(false);}, 1000);
                  });*/
               this._mystack = false;

               new Promise(function(resolve) {
                  this.resolvePromise = resolve;
               }.bind(this));
               this._children.stack.close();
            }
         }
      });

      return module;
   });

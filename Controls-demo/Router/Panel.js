 define('Controls-demo/Router/Panel',
   [
      'Core/Control',
      'wml!Controls-demo/Router/Panel',
      'Controls/Popup/Opener/Stack'
   ],
   function(Control, template) {
      'use strict';
      var _depth = -1;

      var module = Control.extend({
         _template: template,
         _depth: -1,
         _opened: false,
         _beforeMount: function() {
            this._onCloseHandler = this._onCloseHandler.bind(this);
            this._depth = ++_depth;
         },
         _afterMount: function() {
            document.querySelector('head').controlNodes[0].control._forceUpdate();
         },
         _beforeUnmount: function() {
            _depth--;
         },
         innChanged: function(e, value) {
            this._notify('innChanged', [value], { bubbling: true });
         },
         kppChanged: function(e, value) {
            this._notify('kppChanged', [value], { bubbling: true });
         },

         _onCloseHandler: function() {
            if (this._opened) {
               this._opened = false;
               this._notify('routerUpdated', [this._lastUrl, this._lastPrettyUrl], { bubbling: true });
            }
         },

         enterHandler: function(event, newLoc, oldLoc) {
            if (!this._opened) {
               this._opened = true;

               this._lastUrl = oldLoc.url;
               this._lastPrettyUrl = oldLoc.prettyUrl;
               this._children.stack.open();
            }
         },
         leaveHandler: function() {
            if (this._opened) {
               this._children.stack.close();
            }
         }
      });

      module.getDepth = function getDepth() {
         return _depth;
      };

      return module;
   });

 define('Controls-demo/Router/Panel',
   [
      'Core/Control',
      'wml!Controls-demo/Router/Panel',
      'Controls/Popup/Opener/Stack'
   ],
   function(Control, template) {
      'use strict';
      var _depth = 0;

      var module = Control.extend({
         _template: template,
         _depth: 0,
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

               if (this._children.stack.isOpened()) {
                  // возможно панель в процессе закрытия, подождем - может она скоро закроется
                  // todo https://online.sbis.ru/opendoc.html?guid=fac94ad9-3387-4417-bf74-1dac46402131
                  var self = this;
                  setTimeout(function() {
                     if (!self._children.stack.isOpened()) {
                        self._children.stack.open();
                     }
                  }, 3000);
               } else {
                  this._children.stack.open();
               }
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

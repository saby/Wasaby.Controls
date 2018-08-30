define('Controls-demo/BatchUpdater/BatchUpdaterDemo',
   [
      'Core/Control',
      'Core/Deferred',
      'wml!Controls-demo/BatchUpdater/resources/BatchUpdaterDemo'
   ],
   function(Base, Deferred, template) {
      'use strict';

      //Component for <head> html-node

      var Page = Base.extend({
         _template: template,
         _afterMount: function(options, context, receivedState) {
            var def = new Deferred();
            this._notify('requestBatchUpdate', [def, this._forceUpdate], { bubbling: true, shouldUpdate: false });
            setTimeout(function() {
               def.callback();
            }, 20);
         }
      });
      return Page;
   }
);

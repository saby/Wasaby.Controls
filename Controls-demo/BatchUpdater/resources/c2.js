define('Controls-demo/BatchUpdater/resources/c2',
   [
      'Core/Control',
      'Core/Deferred',
      'tmpl!Controls-demo/BatchUpdater/resources/template'
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
            }, 30);
         }
      });
      return Page;
   }
);

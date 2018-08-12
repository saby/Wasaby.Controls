define('Controls-demo/BatchUpdater/resources/c1',
   [
      'Core/Control',
      'Core/Deferred',
      'tmpl!Controls-demo/BatchUpdater/resources/c1'
   ],
   function(Base, Deferred, template) {
      'use strict';

      //Component for <head> html-node

      var Page = Base.extend({
         _template: template,
         text: '1',
         _afterMount: function(options, context, receivedState) {
            var def = new Deferred();
            window.me = this;
            this.text = '2';
            this._notify('requestBatchUpdate', [def, this._forceUpdate], { bubbling: true, shouldUpdate: false });
            setTimeout(function() {
               def.callback();
            }, 10);
         }
      });
      return Page;
   }
);

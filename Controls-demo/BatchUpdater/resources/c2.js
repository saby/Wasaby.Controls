define('Controls-demo/BatchUpdater/resources/c2',
   [
      'Core/Control',
      'Core/Deferred',
      'tmpl!Controls-demo/BatchUpdater/resources/c2'
   ],
   function(Base, Deferred, template) {
      'use strict';

      //Component for <head> html-node

      var Page = Base.extend({
         _template: template,
         text: '1',
         noExtraUpdate: false,
         bothUpdated: false,
         _afterMount: function() {
            var def = new Deferred();
            var self = this;
            self.text = '2';
            self._notify('requestBatchUpdate', [def, self._forceUpdate], { bubbling: true, shouldUpdate: false });
            setTimeout(function() {
               var first = document.getElementById('div1');
               if(first.innerText === '1') {
                  self.noExtraUpdate = true;
               }
               def.callback();
               setTimeout(function() {
                  var second = document.getElementById('div2');
                  if(first.innerText === '2' && second.innerText === '2') {
                     self.bothUpdated = true;
                     self._forceUpdate();
                  }
               }, 100);
            }, 50);
         }
      });
      return Page;
   }
);

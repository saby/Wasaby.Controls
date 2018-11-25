define([
   'Controls/Container/MultiSelector',
   'Controls/Utils/tmplNotify'
], function(
   MultiSelector,
   tmplNotify
) {
   'use strict';
   describe('Controls.Container.MultiSelector', function() {
      it('_selectedTypeChangedHandler', function() {
         var instance = new MultiSelector();
         instance._children = {
            registrator: {
               start: function(typeName) {
                  assert.equal(typeName, 'toggleAll');
               }
            }
         };
         instance._selectedTypeChangedHandler({}, 'toggleAll');
      });

      it('_selectedKeysCountChanged', function() {
         var
            instance = new MultiSelector(),
            count = 1;
         instance._notify = function(eventName, eventArgs) {
            assert.equal(eventName, 'selectedKeysCountChanged');
            assert.equal(eventArgs[0], count);
         };
         instance._selectedKeysCountChanged({}, count);
         assert.equal(instance._selectedKeysCount, count);
         count = 2;
         instance._notify = function(eventName, eventArgs) {
            assert.equal(eventName, 'selectedKeysCountChanged');
            assert.equal(eventArgs[0], count);
         };
         instance._selectedKeysCountChanged({}, count);
      });

      it('_notifyHandler', function() {
         var instance = new MultiSelector();
         assert.equal(instance._notifyHandler, tmplNotify);
      });
   });
});

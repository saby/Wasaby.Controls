define([
   'Controls/_propertyGrid/defaultEditors/Boolean'
], function(Boolean) {
   'use strict';

   describe('Boolean', function() {
      const config = {
         value: 'test'
      };
      var boolean = new Boolean(config);
      boolean._beforeMount(config);

      describe('_valueChanged', function() {
         it('force update', () => {
            boolean._valueChanged({}, 'test1');
            assert.equal(boolean.value, 'test1');
         });
      });
      describe('_beforeUpdate', function() {
         it('new value', () => {
            var changeNotified = false;
            boolean._notify = function () {
               changeNotified = true;
            };
            boolean._beforeUpdate({ propertyValue: 'test2' });
            assert.equal(boolean.value, 'test2');
            assert.isTrue(changeNotified);
         });
         it('old value', () => {
            var changeNotified = false;
            boolean._notify = function () {
               changeNotified = true;
            };
            boolean._beforeUpdate({ propertyValue: 'test2' });
            assert.equal(boolean.value, 'test2');
            assert.isFalse(changeNotified);
         });
      });
   });
});

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
            boolean._valueChanged({}, false);
            assert.equal(boolean.value, false);
         });
      });
      describe('_beforeUpdate', function() {
         it('new value', () => {
            boolean._beforeUpdate({ propertyValue: true });
            assert.equal(boolean.value, true);
         });
         it('undefined value', () => {
            boolean._beforeUpdate({ propertyValue: undefined });
            assert.equal(boolean.value, undefined);
         });
      });
   });
});

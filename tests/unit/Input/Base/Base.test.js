define(
   [
      'Core/core-instance',
      'Controls/Input/Base',
      'tests/unit/resources/TemplateUtil',
      'tests/unit/resources/ProxyCall'
   ],
   function(instance, Base, TemplateUtil, ProxyCall) {

      'use strict';

      describe('Controls.Input.Base', function() {
         var ctrl, calls;

         beforeEach(function() {
            calls = [];
            ctrl = new Base();
            ctrl._children.input = {};
         });

         describe('The _fieldName property value depending on the name option value when mounting the control.', function() {
            it('Option name is not define.', function() {
               ctrl._beforeMount({
                  value: ''
               });

               assert.equal(ctrl._fieldName, 'input');
            });
            it('Option name is define.', function() {
               ctrl._beforeMount({
                  name: 'test name',
                  value: ''
               });

               assert.equal(ctrl._fieldName, 'test name');
            });
         });
         describe('Synchronization the field with the model.', function() {
            beforeEach(function() {
               ctrl._synchronizeFieldWithModel = ProxyCall.apply(ctrl._synchronizeFieldWithModel, 'synchronizeFieldWithModel', calls, true);
            });
            it('Hook _afterMount. Read mode.', function() {
               ctrl._options.readOnly = true;

               ctrl._afterMount();

               assert.equal(calls.length, 0);
            });
            it('Hook _afterMount. Edit mode.', function() {
               ctrl._options.readOnly = false;

               ctrl._afterMount();

               assert.deepEqual(calls, [{
                  name: 'synchronizeFieldWithModel',
                  arguments: []
               }]);
            });
         });
         it('The browser automatically completed the field.', function() {
            ctrl._options.readOnly = false;
            ctrl._children.input.value = 'test value';
            ctrl._notify = ProxyCall.apply(ctrl._notify, 'notify', calls, true);

            ctrl._beforeMount({
               value: ''
            });
            ctrl._afterMount();

            assert.deepEqual(calls, [{
               name: 'notify',
               arguments: ['valueChanged', ['test value', 'test value']]
            }]);
         });
         it('The model belongs to the "Controls/Input/Base/ViewModel" class.', function() {
            ctrl._beforeMount({
               value: ''
            });

            assert.isTrue(instance.instanceOfModule(ctrl._viewModel, 'Controls/Input/Base/ViewModel'));
         });
      });
   }
);

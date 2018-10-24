define(
   [
      'Core/constants',
      'Core/core-instance',
      'Controls/Input/Base',
      'tests/unit/resources/ProxyCall',
      'tests/unit/resources/TemplateUtil',
      'Core/vdom/Synchronizer/resources/SyntheticEvent'
   ],
   function(constants, instance, Base, ProxyCall, TemplateUtil, SyntheticEvent) {

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
            it('Hooks update. Read mode.', function() {
               ctrl._options.readOnly = true;

               ctrl._beforeUpdate({
                  value: '',
                  readOnly: true
               });

               assert.equal(calls.length, 0);

               ctrl._afterUpdate();

               assert.equal(calls.length, 0);
            });
            it('Hooks update. From read mode to edit mode.', function() {
               ctrl._options.readOnly = true;

               ctrl._beforeUpdate({
                  value: '',
                  readOnly: false
               });

               assert.equal(calls.length, 0);

               ctrl._afterUpdate();

               assert.deepEqual(calls, [{
                  name: 'synchronizeFieldWithModel',
                  arguments: [true]
               }]);
            });
            it('Hooks update. Edit mode.', function() {
               ctrl._options.readOnly = false;

               ctrl._beforeUpdate({
                  value: '',
                  readOnly: false
               });

               assert.deepEqual(calls, [{
                  name: 'synchronizeFieldWithModel',
                  arguments: []
               }]);

               calls = [];
               ctrl._afterUpdate();

               assert.equal(calls.length, 0);
            });
            it('Hooks update. From edit mode to read mode.', function() {
               ctrl._options.readOnly = false;

               ctrl._beforeUpdate({
                  value: '',
                  readOnly: true
               });

               assert.equal(calls.length, 0);

               ctrl._afterUpdate();

               assert.equal(calls.length, 0);
            });
         });
         describe('Changing options in model.', function() {
            beforeEach(function() {
               ctrl._getViewModelOptions = function(options) {
                  return {
                     option: options.optionModel
                  };
               };
               ctrl._beforeMount({
                  value: '',
                  optionModel: 'test'
               });
               ctrl._viewModel = ProxyCall.set(ctrl._viewModel, ['options'], calls, true);
            });
            it('No change.', function() {
               ctrl._beforeUpdate({
                  value: '',
                  optionModel: 'test'
               });

               assert.equal(calls.length, 0);
            });

            it('There are changes.', function() {
               ctrl._beforeUpdate({
                  value: '',
                  optionModel: 'test option'
               });

               assert.deepEqual(calls, [{
                  name: 'options',
                  value: {
                     option: 'test option'
                  }
               }]);
            });
         });
         describe('Mouseeneter', function() {
            describe('Tooltip', function() {
               beforeEach(function() {
                  ctrl._beforeMount({
                     value: 'test value'
                  });
                  ctrl._options.tooltip = 'test tooltip';
               });
               it('The value fits in the field.', function() {
                  ctrl._hasHorizontalScroll = function() {
                     return false;
                  };

                  ctrl._mouseenterHandler();

                  assert.equal(ctrl._tooltip, 'test tooltip');
               });
               it('The value no fits in the field.', function() {
                  ctrl._hasHorizontalScroll = function() {
                     return true;
                  };

                  ctrl._mouseenterHandler();

                  assert.equal(ctrl._tooltip, 'test value');
               });
            });
         });
         describe('KeyUp', function() {
            beforeEach(function() {
               ctrl._beforeMount({
                  value: '',
                  optionModel: 'test'
               });
               ctrl._viewModel = ProxyCall.set(ctrl._viewModel, ['selection'], calls, true);
               ctrl._children.input = {
                  selectionStart: 10,
                  selectionEnd: 10
               };
            });
            it('Pressing the up arrow', function() {
               ctrl._keyUpHandler(new SyntheticEvent({
                  keyCode: constants.key.up
               }));

               assert.deepEqual(calls, [{
                  name: 'selection',
                  value: {
                     start: 10,
                     end: 10
                  }
               }]);
            });
            it('Pressing the right arrow', function() {
               ctrl._keyUpHandler(new SyntheticEvent({
                  keyCode: constants.key.right
               }));

               assert.deepEqual(calls, [{
                  name: 'selection',
                  value: {
                     start: 10,
                     end: 10
                  }
               }]);
            });
            it('Pressing the down arrow', function() {
               ctrl._keyUpHandler(new SyntheticEvent({
                  keyCode: constants.key.down
               }));

               assert.deepEqual(calls, [{
                  name: 'selection',
                  value: {
                     start: 10,
                     end: 10
                  }
               }]);
            });
            it('Pressing the left arrow', function() {
               ctrl._keyUpHandler(new SyntheticEvent({
                  keyCode: constants.key.left
               }));

               assert.deepEqual(calls, [{
                  name: 'selection',
                  value: {
                     start: 10,
                     end: 10
                  }
               }]);
            });
            it('Pressing the key end', function() {
               ctrl._keyUpHandler(new SyntheticEvent({
                  keyCode: constants.key.end
               }));

               assert.deepEqual(calls, [{
                  name: 'selection',
                  value: {
                     start: 10,
                     end: 10
                  }
               }]);
            });
            it('Pressing the home arrow', function() {
               ctrl._keyUpHandler(new SyntheticEvent({
                  keyCode: constants.key.home
               }));

               assert.deepEqual(calls, [{
                  name: 'selection',
                  value: {
                     start: 10,
                     end: 10
                  }
               }]);
            });
            it('Pressing the key which no changed selection', function() {
               ctrl._keyUpHandler(new SyntheticEvent({
                  keyCode: constants.key.b
               }));

               assert.equal(calls.length, 0);
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

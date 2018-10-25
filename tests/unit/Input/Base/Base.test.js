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

         it('getDefault', function() {
            Base.getDefaultTypes();
            Base.getDefaultOptions();
         });
         it('paste', function() {
            ctrl._notify = ProxyCall.apply(ctrl._notify, 'notify', calls, true);

            ctrl._beforeMount({
               value: ''
            });
            ctrl.paste('test paste');

            assert.deepEqual(calls, [{
               name: 'notify',
               arguments: ['valueChanged', ['test paste', 'test paste']]
            }]);
         });
         it('Notify parents when a value changes, if the browser automatically filled the field.', function() {
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
         describe('The _fieldName property value equal the name option value when mounting the control.', function() {
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
               ctrl._children.input.selectionStart = 10;
               ctrl._children.input.selectionEnd = 10;
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
      });
   }
);

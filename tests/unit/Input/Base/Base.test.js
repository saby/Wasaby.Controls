define(
   [
      'Env/Event',
      'Env/Env',
      'Core/core-instance',
      'Core/helpers/Hcontrol/makeInstanceCompatible',
      'Controls/input',
      'unit/resources/ProxyCall',
      'unit/Input/Base/InputUtility',
      'unit/resources/TemplateUtil',
      'Vdom/Vdom'
   ],
   function(EnvEvent, Env, instance, makeInstanceCompatible, inputMod, ProxyCall, InputUtility, TemplateUtil, Vdom) {
      'use strict';

      describe('Controls.Input.Base', function() {
         var calls;
         var ctrl = new inputMod.Base();
         makeInstanceCompatible(ctrl);
         ctrl._template({});

         beforeEach(function() {
            calls = [];
            ctrl = new inputMod.Base();
            makeInstanceCompatible(ctrl);
            ctrl._notify = ProxyCall.apply(ctrl._notify, 'notify', calls, true);

            var beforeMount = ctrl._beforeMount;

            ctrl._beforeMount = function() {
               beforeMount.apply(this, arguments);

               ctrl._children[this._fieldName] = {
                  selectionStart: 0,
                  selectionEnd: 0,
                  value: '',
                  focus: function() {},
                  setSelectionRange: function(start, end) {
                     this.selectionStart = start;
                     this.selectionEnd = end;
                  }
               };
            };
         });

         it('getDefault', function() {
            inputMod.Base.getOptionTypes();
            inputMod.Base.getDefaultOptions();
         });
         it('Public method paste.', function() {
            ctrl._beforeMount({
               value: ''
            });
            ctrl.paste('test paste');

            assert.deepEqual(calls, [{
               name: 'notify',
               arguments: ['valueChanged', ['test paste', 'test paste']]
            }]);
         });
         it('The model belongs to the "Controls/_input/Base/ViewModel" class.', function() {
            ctrl._beforeMount({
               value: ''
            });

            assert.isTrue(instance.instanceOfModule(ctrl._viewModel, 'Controls/_input/Base/ViewModel'));
         });
         it('Insert the value into the unfocused field.', function() {
            ctrl._getActiveElement = function() {
               return {};
            };

            ctrl._beforeMount({
               value: ''
            });
            ctrl.paste('test');
            ctrl._template(ctrl);

            assert.equal(ctrl._getField().value, 'test');
            assert.equal(ctrl._getField().selectionStart, 0);
            assert.equal(ctrl._getField().selectionEnd, 0);
         });
         it('Pass null as the value option.', function() {
            ctrl._getActiveElement = function() {
               return ctrl._getField();
            };
            ctrl._beforeMount({
               value: null
            });
            ctrl._template(ctrl);

            assert.equal(ctrl._viewModel.value, null);
            assert.equal(ctrl._viewModel.displayValue, '');
            assert.equal(ctrl._viewModel.selection.start, 0);
            assert.equal(ctrl._viewModel.selection.end, 0);
         });
         it('Set the inputCallback option.', function() {
            ctrl._options.inputCallback = function() {
               return {
                  position: 0,
                  displayValue: 'callback'
               };
            };

            InputUtility.init(ctrl);

            ctrl._focusInHandler();
            InputUtility.insert(ctrl, 'test');
            InputUtility.triggerInput(ctrl);

            assert.deepEqual(calls, [
               {
                  name: 'notify',
                  arguments: ['valueChanged', ['callback', 'callback']]
               }
            ]);
         });
         describe('calculateValueForTemplate', function() {
            beforeEach(function() {
               ctrl._getActiveElement = function() {
                  return ctrl._getField();
               };
               ctrl._isBrowserPlatform = true;

               ctrl._recalculateLocationVisibleArea = ProxyCall.apply(ctrl._recalculateLocationVisibleArea, 'recalculateLocationVisibleArea', calls, true);
            });
            it('Edit field', function() {
               ctrl._beforeMount({
                  value: ''
               });
               ctrl._viewModel.value = 'Test';
               ctrl._getField().readOnly = false;
               ctrl._calculateValueForTemplate();

               assert.equal(calls.length, 1);
            });
            it('Read only field', function() {
               ctrl._beforeMount({
                  value: ''
               });
               ctrl._viewModel.value = 'Test';
               ctrl._getField().readOnly = true;
               ctrl._calculateValueForTemplate();

               assert.equal(calls.length, 0);
            });
         })
         describe('Notify parents when a value changes, if the browser automatically filled the field.', function() {
            beforeEach(function() {
               ctrl._options.readOnly = false;
            });
            it('No.', function() {
               ctrl._beforeMount({
                  value: ''
               });
               ctrl._getField().value = '';
               ctrl._afterMount();

               assert.deepEqual(calls.length, 0);
            });
            it('Yes.', function() {
               ctrl._beforeMount({
                  value: ''
               });
               ctrl._getField().value = 'test value';
               ctrl._afterMount();

               assert.deepEqual(calls, [{
                  name: 'notify',
                  arguments: ['valueChanged', ['test value', 'test value']]
               }]);
            });
         });
         describe('The _fieldName property value equal the name option value when mounting the control, if it defined.', function() {
            it('No.', function() {
               ctrl._beforeMount({
                  value: '',
                  autoComplete: true
               });

               assert.equal(ctrl._fieldName, 'input');
            });
            it('Yes.', function() {
               ctrl._beforeMount({
                  value: '',
                  name: 'test name',
                  autoComplete: true
               });

               assert.equal(ctrl._fieldName, 'test name');
            });
            it('A random name is generated when auto-complete is disabled.', function() {
               ctrl._beforeMount({
                  value: '',
                  autoComplete: false
               });

               assert.equal(ctrl._fieldName.indexOf('name-'), 0);
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
               ctrl._viewModel = ProxyCall.set(ctrl._viewModel, ['options', 'value'], calls, true);
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
                  value: 'test value',
                  optionModel: 'test option'
               });

               assert.deepEqual(calls, [{
                  name: 'options',
                  value: {
                     option: 'test option'
                  }
               }, {
                  name: 'value',
                  value: 'test value'
               }]);
            });
         });
         describe('MouseEnter', function() {
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

                  ctrl._mouseEnterHandler();

                  assert.equal(ctrl._tooltip, 'test tooltip');
               });
               it('The value no fits in the field.', function() {
                  ctrl._hasHorizontalScroll = function() {
                     return true;
                  };

                  ctrl._mouseEnterHandler();

                  assert.equal(ctrl._tooltip, 'test value');
               });
               it('The value fits in the field is read mode.', function() {
                  ctrl._options.readOnly = true;
                  ctrl._hasHorizontalScroll = function() {
                     return false;
                  };

                  ctrl._mouseEnterHandler();

                  assert.equal(ctrl._tooltip, 'test tooltip');
               });
               it('The value no fits in the field is read mode.', function() {
                  ctrl._options.readOnly = true;
                  ctrl._hasHorizontalScroll = function() {
                     return true;
                  };

                  ctrl._mouseEnterHandler();

                  assert.equal(ctrl._tooltip, 'test value');
               });
            });
         });
         describe('User input.', function() {
            beforeEach(function() {
               ctrl._getActiveElement = function() {
                  return ctrl._getField();
               };
               ctrl._isBrowserPlatform = true;
            });
            it('The field does not change, but the model changes.', function() {
               ctrl._beforeMount({
                  value: ''
               });
               ctrl._getField().value = 'text';
               ctrl._getField().selectionStart = 4;
               ctrl._getField().selectionEnd = 4;
               ctrl._inputHandler(new Vdom.SyntheticEvent({}));

               assert.equal(ctrl._getField().value, 'text');
               assert.equal(ctrl._getField().selectionStart, 4);
               assert.equal(ctrl._getField().selectionEnd, 4);
               assert.equal(ctrl._viewModel.value, 'text');
               assert.deepEqual(ctrl._viewModel.selection, {
                  start: 4,
                  end: 4
               });
            });
         });
         describe('Change event', function() {
            it('Notification when input is complete.', function() {
               ctrl._beforeMount({
                  value: 'test value'
               });
               ctrl._changeHandler();

               assert.deepEqual(calls, [{
                  name: 'notify',
                  arguments: ['inputCompleted', ['test value', 'test value']]
               }]);
            });
         });
         describe('Click event', function() {
            it('The selection is saved to the model.', function(done) {
               ctrl._beforeMount({
                  value: '1234567890'
               });

               ctrl._viewModel = ProxyCall.set(ctrl._viewModel, ['selection'], calls, true);

               ctrl._getField().selectionStart = 10;
               ctrl._getField().selectionEnd = 10;
               ctrl._clickHandler();

               setTimeout(function() {
                  assert.deepEqual(calls, [{
                     name: 'selection',
                     value: {
                        start: 10,
                        end: 10
                     }
                  }]);
                  done();
               }, 100);
            });
         });
         describe('Select event', function() {
            beforeEach(function() {
               ctrl._beforeMount({
                  value: '1234567890'
               });
               ctrl._viewModel = ProxyCall.set(ctrl._viewModel, ['selection'], calls, true);
            });
            it('The selection is saved to the model after user select.', function() {
               ctrl._getField().selectionStart = 0;
               ctrl._getField().selectionEnd = 10;
               ctrl._selectHandler();

               assert.deepEqual(calls, [{
                  name: 'selection',
                  value: {
                     start: 0,
                     end: 10
                  }
               }]);
            });
         });
         describe('Focus in event', function() {
            var savedNotify = EnvEvent.Bus.globalChannel().notify;

            beforeEach(function() {
               ctrl._beforeMount({
                  value: ''
               });
               ctrl._getActiveElement = function() {
                  return {};
               };
               EnvEvent.Bus.globalChannel().notify = ProxyCall.apply(savedNotify, 'notify', calls, true);
            });
            afterEach(function() {
               EnvEvent.Bus.globalChannel().notify = savedNotify;
            });
            it('Notification to the global channel about the occurrence of the focus in event. The environment is mobile IOS.', function() {
               ctrl._isMobileIOS = true;

               ctrl._touchStartHandler();
               ctrl._focusInHandler();
               ctrl._clickHandler();

               assert.deepEqual(calls, [{
                  name: 'notify',
                  arguments: ['MobileInputFocus']
               }]);
            });
            it('Not occur notification to the global channel about the occurrence of the focus in event. The environment is not mobile IOS.', function() {
               ctrl._isMobileIOS = false;

               ctrl._mouseDownHandler();
               ctrl._focusInHandler();
               ctrl._clickHandler();

               assert.deepEqual(calls.length, 0);
            });
            it('Focus the field by tab.', function() {
               ctrl._beforeUpdate({
                  value: 'test'
               });

               ctrl._focusInHandler();

               assert.deepEqual(ctrl._viewModel.selection, {
                  start: 4,
                  end: 4
               });
            });
         });
         describe('Focus out event', function() {
            var savedNotify = EnvEvent.Bus.globalChannel().notify;

            beforeEach(function() {
               EnvEvent.Bus.globalChannel().notify = ProxyCall.apply(savedNotify, 'notify', calls, true);
               ctrl._beforeMount({
                  value: ''
               });
            });
            afterEach(function() {
               EnvEvent.Bus.globalChannel().notify = savedNotify;
            });
            it('Scroll to start.', function() {
               ctrl._getField().scrollLeft = 100;
               ctrl._focusOutHandler();

               assert.equal(ctrl._getField().scrollLeft, 0);
            });
            it('Notification to the global channel about the occurrence of the focus out event. The environment is mobile IOS.', function() {
               ctrl._isMobileIOS = true;

               ctrl._touchStartHandler();
               ctrl._focusOutHandler();

               assert.deepEqual(calls, [{
                  name: 'notify',
                  arguments: ['MobileInputFocusOut']
               }]);
            });
            it('Not occur notification to the global channel about the occurrence of the focus out event. The environment is not mobile IOS.', function() {
               ctrl._isMobileIOS = false;

               ctrl._focusOutHandler();

               assert.deepEqual(calls.length, 0);
            });
         });
         describe('Click event on the placeholder.', function() {
            beforeEach(function() {
               ctrl._beforeMount({
                  value: ''
               });
               ctrl._getField().focus = ProxyCall.apply(ctrl._getField().focus, 'focus', calls, true);
            });
            it('Focus the field through a script in ie browser version 10.', function() {
               ctrl._ieVersion = 10;

               ctrl._placeholderClickHandler();

               assert.deepEqual(calls, [{
                  name: 'focus',
                  arguments: []
               }]);
            });
            it('Not focus the field through a script in ie browser version 12.', function() {
               ctrl._ieVersion = 12;

               ctrl._placeholderClickHandler();

               assert.equal(calls.length, 0);
            });
         });
         describe('KeyUp', function() {
            beforeEach(function() {
               ctrl._beforeMount({
                  value: '',
                  optionModel: 'test'
               });
               ctrl._viewModel = ProxyCall.set(ctrl._viewModel, ['selection'], calls, true);
               ctrl._getField().selectionStart = 10;
               ctrl._getField().selectionEnd = 10;
            });
            it('Pressing the up arrow', function() {
               ctrl._keyUpHandler(new Vdom.SyntheticEvent({
                  keyCode: Env.constants.key.up
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
               ctrl._keyUpHandler(new Vdom.SyntheticEvent({
                  keyCode: Env.constants.key.right
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
               ctrl._keyUpHandler(new Vdom.SyntheticEvent({
                  keyCode: Env.constants.key.down
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
               ctrl._keyUpHandler(new Vdom.SyntheticEvent({
                  keyCode: Env.constants.key.left
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
               ctrl._keyUpHandler(new Vdom.SyntheticEvent({
                  keyCode: Env.constants.key.end
               }));

               assert.deepEqual(calls, [{
                  name: 'selection',
                  value: {
                     start: 10,
                     end: 10
                  }
               }]);
            });
            it('Pressing the key home', function() {
               ctrl._keyUpHandler(new Vdom.SyntheticEvent({
                  keyCode: Env.constants.key.home
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
               ctrl._keyUpHandler(new Vdom.SyntheticEvent({
                  keyCode: Env.constants.key.b
               }));

               assert.equal(calls.length, 0);
            });
         });
         describe('Calling the inputCompleted event.', function() {
            var block = function() {
               return false;
            };

            it('Pressing the key enter.', function() {
               InputUtility.init(ctrl);

               ctrl._focusInHandler();
               ctrl._keyUpHandler(new Vdom.SyntheticEvent({
                  keyCode: Env.constants.key.enter
               }));

               assert.equal(calls.length, 0);
            });
            it('Pressing the key enter and enter "test".', function() {
               InputUtility.init(ctrl);

               ctrl._focusInHandler();
               InputUtility.insert(ctrl, 'test');
               InputUtility.triggerInput(ctrl);
               ctrl._keyUpHandler(new Vdom.SyntheticEvent({
                  keyCode: Env.constants.key.enter
               }));

               assert.deepEqual(calls, [
                  {
                     name: 'notify',
                     arguments: ['valueChanged', ['test', 'test']]
                  },
                  {
                     name: 'notify',
                     arguments: ['inputCompleted', ['test', 'test']]
                  }
               ]);
            });
            it('Block the change event. Pressing the key enter.', function() {
               InputUtility.init(ctrl);
               ctrl._isTriggeredChangeEventByEnterKey = block;

               ctrl._focusInHandler();
               ctrl._keyUpHandler(new Vdom.SyntheticEvent({
                  keyCode: Env.constants.key.enter
               }));

               assert.equal(calls.length, 0);
            });
            it('Block the change event. Pressing the key enter and enter "test".', function() {
               InputUtility.init(ctrl);
               ctrl._isTriggeredChangeEventByEnterKey = block;

               ctrl._focusInHandler();
               InputUtility.insert(ctrl, 'test');
               InputUtility.triggerInput(ctrl);
               ctrl._keyUpHandler(new Vdom.SyntheticEvent({
                  keyCode: Env.constants.key.enter
               }));

               assert.deepEqual(calls, [{
                  name: 'notify',
                  arguments: ['valueChanged', ['test', 'test']]
               }]);
            });
         });
         describe('The value in the field is changed via auto-complete.', function() {
            it('In an empty field.', function() {
               ctrl._getActiveElement = function() {
                  return ctrl._getField();
               };
               ctrl._beforeMount({
                  value: ''
               });

               ctrl._getField().value = 'test auto-complete value';
               ctrl._getField().selectionStart = 24;
               ctrl._getField().selectionEnd = 24;
               ctrl._inputHandler(new Vdom.SyntheticEvent({}));

               assert.deepEqual(calls, [{
                  name: 'notify',
                  arguments: ['valueChanged', ['test auto-complete value', 'test auto-complete value']]
               }]);
            });
            it('In an not empty field.', function() {
               ctrl._getActiveElement = function() {
                  return ctrl._getField();
               };
               ctrl._beforeMount({
                  value: 'test value'
               });

               ctrl._getField().value = 'test auto-complete value';
               ctrl._getField().selectionStart = 24;
               ctrl._getField().selectionEnd = 24;
               ctrl._inputHandler(new Vdom.SyntheticEvent({}));

               assert.deepEqual(calls, [{
                  name: 'notify',
                  arguments: ['valueChanged', ['test auto-complete value', 'test auto-complete value']]
               }]);
            });
         });
      });
   }
);

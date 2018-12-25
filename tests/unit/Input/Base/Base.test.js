define(
   [
      'Core/EventBus',
      'Core/constants',
      'Core/core-instance',
      'Controls/Input/Base',
      'tests/resources/ProxyCall',
      'tests/resources/TemplateUtil',
      'Vdom/Vdom'
   ],
   function(EventBus, constants, instance, Base, ProxyCall, TemplateUtil, Vdom) {
      'use strict';

      describe('Controls.Input.Base', function() {
         var ctrl, calls;

         beforeEach(function() {
            calls = [];
            ctrl = new Base();
            ctrl._notify = ProxyCall.apply(ctrl._notify, 'notify', calls, true);

            var beforeMount = ctrl._beforeMount;

            ctrl._beforeMount = function() {
               beforeMount.apply(this, arguments);

               ctrl._children[this._fieldName] = {
                  focus: function() {},
                  setSelectionRange: function(start, end) {
                     this.selectionStart = start;
                     this.selectionEnd = end;
                  }
               };
            };
         });

         it('getDefault', function() {
            Base.getOptionTypes();
            Base.getDefaultOptions();
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
         it('The model belongs to the "Controls/Input/Base/ViewModel" class.', function() {
            ctrl._beforeMount({
               value: ''
            });

            assert.isTrue(instance.instanceOfModule(ctrl._viewModel, 'Controls/Input/Base/ViewModel'));
         });
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
               });
               it('The value fits in the field.', function() {
                  ctrl._hasHorizontalScroll = function() {
                     return false;
                  };

                  ctrl._mouseEnterHandler();

                  assert.equal(ctrl._tooltip, '');
               });
               it('The value no fits in the field.', function() {
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
            });
            it('The field does not change, but the model changes.', function() {
               ctrl._beforeMount({
                  value: ''
               });
               ctrl._getField().value = 'text';
               ctrl._getField().selectionStart = 4;
               ctrl._getField().selectionEnd = 4;
               ctrl._inputHandler(new Vdom.SyntheticEvent({}));

               assert.equal(ctrl._getField().value, '');
               assert.equal(ctrl._getField().selectionStart, 0);
               assert.equal(ctrl._getField().selectionEnd, 0);
               assert.equal(ctrl._viewModel.value, 'text');
               assert.deepEqual(ctrl._viewModel.selection, {
                  start: 4,
                  end: 4
               });
            });
         });
         describe('Synchronize the field with the model.', function() {
            describe('Scroll left in the field, depending on the cursor position.', function() {
               beforeEach(function() {
                  ctrl._getTextWidth = function(value) {
                     return 10 * value.length;
                  };
                  ctrl._getActiveElement = function() {
                     return ctrl._getField();
                  };
                  ctrl._beforeMount({

                     // length = 20, width = 200;
                     value: '01234567890123456789'
                  });
                  ctrl._getField().clientWidth = 100;
               });
               it('The cursor is behind the left edge.', function() {
                  ctrl._getField().scrollLeft = 100;

                  ctrl._getField().selectionStart = 10;
                  ctrl._getField().selectionEnd = 10;
                  ctrl._clickHandler();
                  ctrl._getField().value = '0123456780123456789';
                  ctrl._getField().selectionStart = 9;
                  ctrl._getField().selectionEnd = 9;
                  ctrl._inputHandler(new Vdom.SyntheticEvent({}));
                  ctrl._template(ctrl);

                  assert.equal(ctrl._getField().scrollLeft, 41);
               });
               it('The cursor between the edges.', function() {
                  ctrl._getField().scrollLeft = 50;

                  ctrl._getField().selectionStart = 10;
                  ctrl._getField().selectionEnd = 10;
                  ctrl._clickHandler();
                  ctrl._getField().value = '0123456789t0123456789';
                  ctrl._getField().selectionStart = 11;
                  ctrl._getField().selectionEnd = 11;
                  ctrl._inputHandler(new Vdom.SyntheticEvent({}));
                  ctrl._template(ctrl);

                  assert.equal(ctrl._getField().scrollLeft, 50);
               });
               it('The cursor is behind the right edge.', function() {
                  ctrl._getField().scrollLeft = 0;

                  ctrl._getField().selectionStart = 10;
                  ctrl._getField().selectionEnd = 10;
                  ctrl._clickHandler();
                  ctrl._getField().value = '0123456789a0123456789';
                  ctrl._getField().selectionStart = 11;
                  ctrl._getField().selectionEnd = 11;
                  ctrl._inputHandler(new Vdom.SyntheticEvent({}));
                  ctrl._template(ctrl);

                  assert.equal(ctrl._getField().scrollLeft, 61);
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
            it('The selection is not saved to the model after script actions', function() {
               ctrl._getActiveElement = function() {
                  return ctrl._getField();
               };

               ctrl._getField().value = '';
               ctrl._getField().selectionStart = 0;
               ctrl._getField().selectionEnd = 0;
               ctrl._inputHandler(new Vdom.SyntheticEvent({}));
               ctrl._selectHandler();

               assert.deepEqual(calls, [{
                  name: 'notify',
                  arguments: ['valueChanged', ['', '']]
               }]);
            });
         });
         describe('Focus in event', function() {
            var savedNotify = EventBus.globalChannel().notify;

            beforeEach(function() {
               ctrl._beforeMount({
                  value: ''
               });
               ctrl._getActiveElement = function() {
                  return {};
               };
               EventBus.globalChannel().notify = ProxyCall.apply(savedNotify, 'notify', calls, true);
            });
            afterEach(function() {
               EventBus.globalChannel().notify = savedNotify;
            });
            it('Notification to the global channel about the occurrence of the focus in event. The environment is mobile IOS.', function() {
               ctrl._isMobileIOS = true;

               ctrl._mouseDownHandler();
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
         });
         describe('Focus out event', function() {
            var savedNotify = EventBus.globalChannel().notify;

            beforeEach(function() {
               EventBus.globalChannel().notify = ProxyCall.apply(savedNotify, 'notify', calls, true);
               ctrl._beforeMount({
                  value: ''
               });
            });
            afterEach(function() {
               EventBus.globalChannel().notify = savedNotify;
            });
            it('Scroll to start.', function() {
               ctrl._getField().scrollLeft = 100;
               ctrl._focusOutHandler();

               assert.equal(ctrl._getField().scrollLeft, 0);
            });
            it('Notification to the global channel about the occurrence of the focus out event. The environment is mobile IOS.', function() {
               ctrl._isMobileIOS = true;

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
               ctrl._keyUpHandler(new Vdom.SyntheticEvent({
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
               ctrl._keyUpHandler(new Vdom.SyntheticEvent({
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
               ctrl._keyUpHandler(new Vdom.SyntheticEvent({
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
               ctrl._keyUpHandler(new Vdom.SyntheticEvent({
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
            it('Pressing the key home', function() {
               ctrl._keyUpHandler(new Vdom.SyntheticEvent({
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
               ctrl._keyUpHandler(new Vdom.SyntheticEvent({
                  keyCode: constants.key.b
               }));

               assert.equal(calls.length, 0);
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

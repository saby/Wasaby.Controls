define(
   [
      'Core/core-instance',
      'Controls/Input/Password'
   ],
   function(instance, Password) {
      describe('Controls.Input.Password', function() {
         var ctrl, calls;

         beforeEach(function() {
            calls = [];
            ctrl = new Password();
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

         it('Checking default values of options.', function() {
            assert.deepEqual(Password.getDefaultOptions(), {
               value: '',
               tooltip: '',
               style: 'info',
               size: 'default',
               placeholder: '',
               revealable: true,
               textAlign: 'left',
               autoComplete: true,
               fontStyle: 'default',
               selectOnClick: false
            });
         });
         it('Checking types of options.', function() {
            assert.deepEqual(Object.keys(Password.getOptionTypes()).sort(), [
               'size',
               'style',
               'tooltip',
               'tagStyle',
               'textAlign',
               'fontStyle',
               'revealable',
               'autoComplete',
               'selectOnClick'
            ].sort());
         });
         it('The model belongs to the "Controls/Input/Password/ViewModel" class.', function() {
            ctrl._beforeMount({
               value: ''
            });

            assert.isTrue(instance.instanceOfModule(ctrl._viewModel, 'Controls/Input/Password/ViewModel'));
         });

         describe('The type attribute of the field when mounting.', function() {
            it('Auto-completion is disabled.', function() {
               ctrl._beforeMount({
                  value: '',
                  autoComplete: false
               });

               assert.equal(ctrl._type, 'text');
            });
            it('Auto-completion is enabled.', function() {
               ctrl._beforeMount({
                  value: '',
                  autoComplete: true
               });

               assert.equal(ctrl._type, 'password');
            });
         });
         describe('Mouse enter event.', function() {
            describe('Tooltip value.', function() {
               beforeEach(function() {
                  ctrl._beforeMount({
                     value: 'test value'
                  });
                  ctrl._options.tooltip = 'test tooltip';
               });

               var init = function(inst, passwordVisible, valueFits) {
                  inst._passwordVisible = passwordVisible;
                  inst._hasHorizontalScroll = function() {
                     return !valueFits;
                  };
                  inst._beforeUpdate({
                     value: 'test value'
                  });
               };

               it('The password is hidden and the value fits into the field.', function() {
                  init(ctrl, false, true);

                  ctrl._mouseEnterHandler();

                  assert.equal(ctrl._tooltip, '');
               });
               it('The password is hidden and the value no fits into the field.', function() {
                  init(ctrl, false, false);

                  ctrl._mouseEnterHandler();

                  assert.equal(ctrl._tooltip, '');
               });
               it('The password is visible and the value fits into the field.', function() {
                  init(ctrl, true, true);

                  ctrl._mouseEnterHandler();

                  assert.equal(ctrl._tooltip, 'test tooltip');
               });
               it('The password is visible and the value no fits into the field.', function() {
                  init(ctrl, true, false);

                  ctrl._mouseEnterHandler();

                  assert.equal(ctrl._tooltip, 'test value');
               });
            });
         });
         describe('The click event on the icon.', function() {
            it('Auto-completion is disabled.', function() {
               ctrl._options.autoComplete = false;
               ctrl._toggleVisibilityHandler();

               assert.equal(ctrl._type, 'text');
               assert.equal(ctrl._passwordVisible, true);

               ctrl._toggleVisibilityHandler();

               assert.equal(ctrl._type, 'text');
               assert.equal(ctrl._passwordVisible, false);
            });
            it('Auto-completion is enabled.', function() {
               ctrl._options.autoComplete = true;
               ctrl._toggleVisibilityHandler();

               assert.equal(ctrl._type, 'text');
               assert.equal(ctrl._passwordVisible, true);

               ctrl._toggleVisibilityHandler();

               assert.equal(ctrl._type, 'password');
               assert.equal(ctrl._passwordVisible, false);
            });
         });
      });
   }
);

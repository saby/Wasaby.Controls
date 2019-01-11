define(
   [
      'Core/core-instance',
      'Controls/Input/Money',
      'tests/resources/TemplateUtil',
      'wml!tests/Input/Money/ZeroValueTest',
      'wml!tests/Input/Money/EmptyValueTest'
   ],
   function(instance, Money, TemplateUtil, zeroValueTemplate, emptyValueTemplate) {
      'use strict';

      describe('Controls.Input.Money', function() {
         var ctrl, calls;

         beforeEach(function() {
            calls = [];
            ctrl = new Money();
            var beforeMount = ctrl._beforeMount;

            ctrl._beforeMount = function() {
               beforeMount.apply(this, arguments);

               ctrl._children[this._fieldName] = {
                  focus: function() {
                  },
                  setSelectionRange: function(start, end) {
                     this.selectionStart = start;
                     this.selectionEnd = end;
                  }
               };
            };
         });

         describe('The integer and the fractional part in the reading mode.', function() {
            beforeEach(function() {
               ctrl._beforeMount({
                  value: ''
               });
               ctrl._readOnlyField.template = TemplateUtil.clearTemplate(ctrl._readOnlyField.template);
            });
            it('Empty value', function() {
               ctrl._readOnlyField.scope.value = '';

               assert.equal(ctrl._readOnlyField.template(ctrl._readOnlyField.scope), emptyValueTemplate({}));
            });
            it('Zero value', function() {
               ctrl._readOnlyField.scope.value = '0.00';

               assert.equal(ctrl._readOnlyField.template(ctrl._readOnlyField.scope), zeroValueTemplate({}));
            });
         });
      });
   }
);

define(
   [
      'Core/core-instance',
      'Controls/Input/Text',
      'tests/resources/ProxyCall',
      'Core/vdom/Synchronizer/resources/SyntheticEvent'
   ],
   function(instance, Text, ProxyCall, SyntheticEvent) {
      'use strict';

      describe('Controls.Input.Text', function() {
         var ctrl, calls;

         beforeEach(function() {
            calls = [];
            ctrl = new Text();
            ctrl._children.input = {
               setSelectionRange: function(start, end) {
                  this.selectionStart = start;
                  this.selectionEnd = end;
               }
            };
         });

         it('The model belongs to the "Controls/Input/Text/ViewModel" class.', function() {
            ctrl._beforeMount({
               value: ''
            });

            assert.isTrue(instance.instanceOfModule(ctrl._viewModel, 'Controls/Input/Text/ViewModel'));
         });
         it('After the input is completed, spaces on both sides are trimmed.', function() {
            ctrl._notify = ProxyCall.apply(ctrl._notify, 'notify', calls, true);

            ctrl._beforeMount({
               value: ' test value '
            });
            ctrl._options.trim = true;
            ctrl._changeHandler();

            assert.deepEqual(calls, [
               {
                  name: 'notify',
                  arguments: ['valueChanged', ['test value', 'test value']]
               },
               {
                  name: 'notify',
                  arguments: ['inputCompleted', ['test value', 'test value']]
               }]);
         });
         describe('User input.', function() {
            it('Test constraint.', function() {
               ctrl._beforeMount({
                  value: '',
                  constraint: '[0-9]'
               });
               ctrl._children.input.value = 'text';
               ctrl._children.input.selectionStart = 4;
               ctrl._children.input.selectionEnd = 4;
               ctrl._inputHandler(new SyntheticEvent({}));

               assert.equal(ctrl._viewModel.value, '');
               assert.deepEqual(ctrl._viewModel.selection, {
                  start: 0,
                  end: 0
               });
            });
            it('Test max length.', function() {
               ctrl._beforeMount({
                  value: '',
                  maxLength: 3
               });
               ctrl._children.input.value = 'text';
               ctrl._children.input.selectionStart = 4;
               ctrl._children.input.selectionEnd = 4;
               ctrl._inputHandler(new SyntheticEvent({}));

               assert.equal(ctrl._viewModel.value, 'tex');
               assert.deepEqual(ctrl._viewModel.selection, {
                  start: 3,
                  end: 3
               });
            });
         });
      });
   }
);

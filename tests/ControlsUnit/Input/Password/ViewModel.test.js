define(
   [
      'Controls/_input/Password/ViewModel'
   ],
   function(ViewModel) {
      describe('Controls/_input/Password/ViewModel', function() {
         var currentModel;
         var changeVisibilityPassword = function(model, value) {
            model.options = {
               passwordVisible: value,
               readOnly: model.options.readOnly,
               autoComplete: model.options.autoComplete
            };
         };
         it('Init value to null.', function() {
            currentModel = new ViewModel({
               readOnly: false,
               autoComplete: false,
               passwordVisible: false
            }, null);
            assert.equal(currentModel.value, null);
            assert.equal(currentModel.displayValue, '');

            currentModel.handleInput({
               before: '',
               insert: 'a',
               after: '',
               delete: ''
            });
            assert.equal(currentModel.value, 'a');
            assert.equal(currentModel.displayValue, '•');
         });
         describe('Auto-completion is disabled and mode is edit and password is hidden and value is equal "12345".', function() {
            beforeEach(function() {
               currentModel = new ViewModel({
                  readOnly: false,
                  autoComplete: false,
                  passwordVisible: false
               }, '12345');
            });

            it('Create an instance.', function() {
               assert.equal(currentModel.value, '12345');
               assert.equal(currentModel.displayValue, '•••••');
               assert.deepEqual(currentModel.options, {
                  readOnly: false,
                  autoComplete: false,
                  passwordVisible: false
               });
            });
            it('Change value to "54321".', function() {
               currentModel.value = '54321';

               assert.equal(currentModel.value, '54321');
               assert.equal(currentModel.displayValue, '•••••');
            });
            it('Change displayValue to "54321".', function() {
               currentModel.displayValue = '54321';

               assert.equal(currentModel.value, '54321');
               assert.equal(currentModel.displayValue, '54321');
            });
            it('Insert "a" between "12" and "345".', function() {
               currentModel.handleInput({
                  before: '••',
                  insert: 'a',
                  after: '•••',
                  delete: ''
               });

               assert.equal(currentModel.value, '12a345');
               assert.equal(currentModel.displayValue, '••••••');
            });
            it('Change password visibility to true.', function() {
               changeVisibilityPassword(currentModel, true);

               assert.equal(currentModel.value, '12345');
               assert.equal(currentModel.displayValue, '12345');
            });
         });
         describe('Auto-completion is enabled and mode is edit and password is hidden and value is equal "12345".', function() {
            beforeEach(function() {
               currentModel = new ViewModel({
                  readOnly: false,
                  autoComplete: true,
                  passwordVisible: false
               }, '12345');
            });

            it('Create an instance.', function() {
               assert.equal(currentModel.value, '12345');
               assert.equal(currentModel.displayValue, '12345');
               assert.deepEqual(currentModel.options, {
                  readOnly: false,
                  autoComplete: true,
                  passwordVisible: false
               });
            });
            it('Change value to "54321".', function() {
               currentModel.value = '54321';

               assert.equal(currentModel.value, '54321');
               assert.equal(currentModel.displayValue, '54321');
            });
            it('Change displayValue to "54321".', function() {
               currentModel.displayValue = '54321';

               assert.equal(currentModel.value, '54321');
               assert.equal(currentModel.displayValue, '54321');
            });
            it('Insert "a" between "12" and "345".', function() {
               currentModel.handleInput({
                  before: '12',
                  insert: 'a',
                  after: '345',
                  delete: ''
               });

               assert.equal(currentModel.value, '12a345');
               assert.equal(currentModel.displayValue, '12a345');
            });
            it('Change password visibility to true.', function() {
               changeVisibilityPassword(currentModel, true);

               assert.equal(currentModel.value, '12345');
               assert.equal(currentModel.displayValue, '12345');
            });
         });
         describe('Auto-completion is disabled and mode is edit and password is visible and value is equal "12345".', function() {
            beforeEach(function() {
               currentModel = new ViewModel({
                  readOnly: false,
                  autoComplete: false,
                  passwordVisible: true
               }, '12345');
            });

            it('Create an instance.', function() {
               assert.equal(currentModel.value, '12345');
               assert.equal(currentModel.displayValue, '12345');
               assert.deepEqual(currentModel.options, {
                  readOnly: false,
                  autoComplete: false,
                  passwordVisible: true
               });
            });
            it('Change value to "54321".', function() {
               currentModel.value = '54321';

               assert.equal(currentModel.value, '54321');
               assert.equal(currentModel.displayValue, '54321');
            });
            it('Change displayValue to "54321".', function() {
               currentModel.displayValue = '54321';

               assert.equal(currentModel.value, '54321');
               assert.equal(currentModel.displayValue, '54321');
            });
            it('Insert "a" between "12" and "345".', function() {
               currentModel.handleInput({
                  before: '12',
                  insert: 'a',
                  after: '345',
                  delete: ''
               });

               assert.equal(currentModel.value, '12a345');
               assert.equal(currentModel.displayValue, '12a345');
            });
            it('Change password visibility to false.', function() {
               changeVisibilityPassword(currentModel, false);

               assert.equal(currentModel.value, '12345');
               assert.equal(currentModel.displayValue, '•••••');
            });
         });
         describe('Auto-completion is enabled and mode is edit and password is visible and value is equal "12345".', function() {
            beforeEach(function() {
               currentModel = new ViewModel({
                  readOnly: false,
                  autoComplete: true,
                  passwordVisible: true
               }, '12345');
            });

            it('Create an instance.', function() {
               assert.equal(currentModel.value, '12345');
               assert.equal(currentModel.displayValue, '12345');
               assert.deepEqual(currentModel.options, {
                  readOnly: false,
                  autoComplete: true,
                  passwordVisible: true
               });
            });
            it('Change value to "54321".', function() {
               currentModel.value = '54321';

               assert.equal(currentModel.value, '54321');
               assert.equal(currentModel.displayValue, '54321');
            });
            it('Change displayValue to "54321".', function() {
               currentModel.displayValue = '54321';

               assert.equal(currentModel.value, '54321');
               assert.equal(currentModel.displayValue, '54321');
            });
            it('Insert "a" between "12" and "345".', function() {
               currentModel.handleInput({
                  before: '12',
                  insert: 'a',
                  after: '345',
                  delete: ''
               });

               assert.equal(currentModel.value, '12a345');
               assert.equal(currentModel.displayValue, '12a345');
            });
            it('Change password visibility to false.', function() {
               changeVisibilityPassword(currentModel, false);

               assert.equal(currentModel.value, '12345');
               assert.equal(currentModel.displayValue, '12345');
            });
         });
         describe('Auto-completion is disabled and mode is read and password is hidden and value is equal "12345".', function() {
            beforeEach(function() {
               currentModel = new ViewModel({
                  readOnly: true,
                  autoComplete: false,
                  passwordVisible: false
               }, '12345');
            });

            it('Create an instance.', function() {
               assert.equal(currentModel.value, '12345');
               assert.equal(currentModel.displayValue, '•••••');
               assert.deepEqual(currentModel.options, {
                  readOnly: true,
                  autoComplete: false,
                  passwordVisible: false
               });
            });
            it('Change value to "54321".', function() {
               currentModel.value = '54321';

               assert.equal(currentModel.value, '54321');
               assert.equal(currentModel.displayValue, '•••••');
            });
            it('Change displayValue to "54321".', function() {
               currentModel.displayValue = '54321';

               assert.equal(currentModel.value, '54321');
               assert.equal(currentModel.displayValue, '54321');
            });
            it('Insert "a" between "12" and "345".', function() {
               currentModel.handleInput({
                  before: '••',
                  insert: 'a',
                  after: '•••',
                  delete: ''
               });

               assert.equal(currentModel.value, '12a345');
               assert.equal(currentModel.displayValue, '••••••');
            });
            it('Change password visibility to true.', function() {
               changeVisibilityPassword(currentModel, true);

               assert.equal(currentModel.value, '12345');
               assert.equal(currentModel.displayValue, '•••••');
            });
         });
         describe('Auto-completion is enabled and mode is read and password is hidden and value is equal "12345".', function() {
            beforeEach(function() {
               currentModel = new ViewModel({
                  readOnly: true,
                  autoComplete: true,
                  passwordVisible: false
               }, '12345');
            });

            it('Create an instance.', function() {
               assert.equal(currentModel.value, '12345');
               assert.equal(currentModel.displayValue, '•••••');
               assert.deepEqual(currentModel.options, {
                  readOnly: true,
                  autoComplete: true,
                  passwordVisible: false
               });
            });
            it('Change value to "54321".', function() {
               currentModel.value = '54321';

               assert.equal(currentModel.value, '54321');
               assert.equal(currentModel.displayValue, '•••••');
            });
            it('Change displayValue to "54321".', function() {
               currentModel.displayValue = '54321';

               assert.equal(currentModel.value, '54321');
               assert.equal(currentModel.displayValue, '54321');
            });
            it('Insert "a" between "12" and "345".', function() {
               currentModel.handleInput({
                  before: '12',
                  insert: 'a',
                  after: '345',
                  delete: ''
               });

               assert.equal(currentModel.value, '12a345');
               assert.equal(currentModel.displayValue, '••••••');
            });
            it('Change password visibility to true.', function() {
               changeVisibilityPassword(currentModel, true);

               assert.equal(currentModel.value, '12345');
               assert.equal(currentModel.displayValue, '•••••');
            });
         });
         describe('Auto-completion is disabled and mode is read and password is visible and value is equal "12345".', function() {
            beforeEach(function() {
               currentModel = new ViewModel({
                  readOnly: true,
                  autoComplete: false,
                  passwordVisible: true
               }, '12345');
            });

            it('Create an instance.', function() {
               assert.equal(currentModel.value, '12345');
               assert.equal(currentModel.displayValue, '•••••');
               assert.deepEqual(currentModel.options, {
                  readOnly: true,
                  autoComplete: false,
                  passwordVisible: true
               });
            });
            it('Change value to "54321".', function() {
               currentModel.value = '54321';

               assert.equal(currentModel.value, '54321');
               assert.equal(currentModel.displayValue, '•••••');
            });
            it('Change displayValue to "54321".', function() {
               currentModel.displayValue = '54321';

               assert.equal(currentModel.value, '54321');
               assert.equal(currentModel.displayValue, '54321');
            });
            it('Insert "a" between "12" and "345".', function() {
               currentModel.handleInput({
                  before: '12',
                  insert: 'a',
                  after: '345',
                  delete: ''
               });

               assert.equal(currentModel.value, '12a345');
               assert.equal(currentModel.displayValue, '••••••');
            });
            it('Change password visibility to false.', function() {
               changeVisibilityPassword(currentModel, false);

               assert.equal(currentModel.value, '12345');
               assert.equal(currentModel.displayValue, '•••••');
            });
         });
         describe('Auto-completion is enabled and mode is read and password is visible and value is equal "12345".', function() {
            beforeEach(function() {
               currentModel = new ViewModel({
                  readOnly: true,
                  autoComplete: true,
                  passwordVisible: true
               }, '12345');
            });

            it('Create an instance.', function() {
               assert.equal(currentModel.value, '12345');
               assert.equal(currentModel.displayValue, '•••••');
               assert.deepEqual(currentModel.options, {
                  readOnly: true,
                  autoComplete: true,
                  passwordVisible: true
               });
            });
            it('Change value to "54321".', function() {
               currentModel.value = '54321';

               assert.equal(currentModel.value, '54321');
               assert.equal(currentModel.displayValue, '•••••');
            });
            it('Change displayValue to "54321".', function() {
               currentModel.displayValue = '54321';

               assert.equal(currentModel.value, '54321');
               assert.equal(currentModel.displayValue, '54321');
            });
            it('Insert "a" between "12" and "345".', function() {
               currentModel.handleInput({
                  before: '12',
                  insert: 'a',
                  after: '345',
                  delete: ''
               });

               assert.equal(currentModel.value, '12a345');
               assert.equal(currentModel.displayValue, '••••••');
            });
            it('Change password visibility to false.', function() {
               changeVisibilityPassword(currentModel, false);

               assert.equal(currentModel.value, '12345');
               assert.equal(currentModel.displayValue, '•••••');
            });
         });
      });
   }
);

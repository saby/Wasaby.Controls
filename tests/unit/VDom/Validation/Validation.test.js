define([
   'Controls/validate',
   'Core/Deferred',
   'unit/resources/ProxyCall',
], function(validateMod, Deferred, ProxyCall) {
   'use strict';

   function getValidator(validateResult, readOnly) {
      let validator = {
         _validateCall: false,
         _activateCall: false,
         _validationResult: false,
         _isValidCall: false,
         _options: {
            readOnly: readOnly
         },
         validate: () => {
            validator._validateCall = true;
            return (new Deferred()).callback(validateResult);
         },
         activate: () => {
            validator._activateCall = true;
         },
         setValidationResult: (result) => {
            validator._validationResult = result;
         },
         isValid: () => {
            validator._isValidCall = true; return true;
         }
      };

      return validator;
   }

   describe('Validate/Controller', () => {
      var calls = [];
      var validCtrl = new validateMod.Container();
      validCtrl._notify = ProxyCall.apply(validCtrl._notify, 'notify', calls, true);
      it('valueChangedNotify', () => {
         validCtrl._valueChangedHandler(null, 'test');
         assert.deepEqual(calls, [{
            name: 'notify',
            arguments: ['valueChanged', ['test']]
         }]);
      });
      it('cleanValid', () => {
         validCtrl._valueChangedHandler();
         assert.deepEqual(validCtrl._validationResult, undefined);
      });
   });
   describe('Validate/Input', () => {
      it('cleanValidInput', () => {
         var inputCtrl = new validateMod.InputContainer();
         inputCtrl._valueChangedHandler(null, 'test');
         assert.deepEqual(inputCtrl._validationResult, undefined);
         inputCtrl._validationResult = 'Error';
         inputCtrl._valueChangedHandler(null, 'test');
         assert.deepEqual(inputCtrl._validationResult, 'Error');
      });
   });
   describe('Validate/FormController', () => {
      it('add/remove validator', () => {
         let FC = new validateMod.Controller();
         let validator1 = getValidator();
         let validator2 = getValidator();

         FC.onValidateCreated({}, validator1);
         FC.onValidateCreated({}, validator2);

         assert.equal(FC._validates.length, 2);

         FC.onValidateDestroyed({}, validator1);
         FC.onValidateDestroyed({}, validator2);

         assert.equal(FC._validates.length, 0);

         FC.destroy();
      });

      it('isValid', () => {
         let FC = new validateMod.Controller();
         let validator1 = getValidator();
         let validator2 = getValidator();
         FC.onValidateCreated({}, validator1);
         FC.onValidateCreated({}, validator2);

         let results = FC.isValid();
         assert.equal(validator1._isValidCall, results[0], true);
         assert.equal(validator2._isValidCall, results[1], true);

         FC.destroy();
      });
      it('activateFirstValidField', () => {
         let FC = new validateMod.Controller();
         let validator1 = getValidator();
         let validator2 = getValidator(null, true);
         let validator3 = getValidator('Error');
         let validator4 = getValidator('Error');

         FC._validates.push(validator1, validator2, validator3, validator4);
         FC.submit();
         assert.equal(validator3._activateCall, true);

         FC.destroy();
      });

      it('setValidationResult', () => {
         let FC = new validateMod.Controller();
         let validator1 = getValidator();
         let validator2 = getValidator();
         FC.onValidateCreated({}, validator1);
         FC.onValidateCreated({}, validator2);

         FC.setValidationResult();
         assert.equal(validator1._validationResult, null);
         assert.equal(validator2._validationResult, null);

         FC.destroy();
      });

      it('submit', () => {
         let FC = new validateMod.Controller();
         let validator1 = getValidator(true);
         let validator2 = getValidator(false);
         FC.onValidateCreated({}, validator1);
         FC.onValidateCreated({}, validator2);

         FC.submit().addCallback((result) => {
            assert.equal(validator1._validateCall, true, 'is validate1 call');
            assert.equal(validator2._validateCall, true, 'is validate2 call');

            assert.equal(result[0], true, 'validate1 result');
            assert.equal(result[1], false, 'validate2 result');

            assert.equal(validator1._activateCall, true, 'is validate1 activate');
            assert.equal(validator2._activateCall, false, 'is validate2 activate');
         });
         FC.destroy();
      });
   });
});

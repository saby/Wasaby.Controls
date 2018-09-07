define('Controls/Validate/Controller',
   [
      'Core/Control',
      'wml!Controls/Validate/Controller',
      'Core/IoC',
      'Core/ParallelDeferred',
      'Core/Deferred'
   ],
   function(
      Base,
      template,
      IoC,
      ParallelDeferred,
      Deferred
   ) {
      'use strict';

      var Validate = Base.extend({
         _template: template,
         _afterMount: function() {
            this._notify('validateCreated', [this], {bubbling: true});
         },
         _beforeUnmount: function() {
            this._notify('validateDestroyed', [this], {bubbling: true});
         },

         _validationResult: undefined,

         _callValidators: function callValidators(validators) {
            var validationResult = null,
               errors = [],
               validatorResult, validator, resultDeferred, index;

            var parallelDeferred = new ParallelDeferred();
            var validatorsForCheck = [].concat(validators);

            // провалидируем по собственным валидаторам
            for (index in validatorsForCheck) {
               if (validatorsForCheck.hasOwnProperty(index)) {
                  validator = validatorsForCheck[index];
                  if (typeof validator === 'function') {
                     // если встретили функцию
                     validatorResult = validator();
                  } else if (validator instanceof Deferred) {
                     // если встретили deferred - значит значение уже провалидировано и ждем результат
                     validatorResult = validator;
                  } else {
                     // если что-то еще, считаем что это - ответ валидации
                     validatorResult = !!validator;
                  }

                  // результат - либо deferred, либо готовое значение
                  if (validatorResult instanceof Deferred) {
                     parallelDeferred.push(validatorResult);
                  } else {
                     if (typeof validatorResult === 'string') {
                        validationResult = validatorResult;
                     } else {
                        validationResult = !!validatorResult;
                     }
                     if (validationResult === false || typeof validatorResult === 'string') {
                        errors.push(validatorResult);
                     }
                  }
               }
            }

            resultDeferred = new Deferred();
            this.setValidationResult(resultDeferred);

            // далее, смотрим что возвращают результаты-деферреды
            parallelDeferred.done().getResult().addCallback(function(results) {
               var validationResult = null;
               if (typeof results === 'object') {
                  for (var resultIndex in results) {
                     // плохие результаты запоминаем в массиве с ошибками
                     if (results.hasOwnProperty(resultIndex)) {
                        var result = results[resultIndex];
                        if (typeof result !== 'string' && !Array.isArray(result)) {
                           result = !!result;
                        }
                        if (result === false || typeof result === 'string') {
                           errors.push(result);
                        } else if (Array.isArray(result)) {
                           errors = result;
                        }
                     }
                  }
               }

               // если ошибки были найдены, отдадим их в качестве ответа
               if (errors.length) {
                  validationResult = errors;
               }

               this.setValidationResult(validationResult);
               resultDeferred.callback(validationResult);
            }.bind(this)).addErrback(function(e) {
               IoC.resolve('ILogger').error('Validate', 'Validation error', e);
            });

            return resultDeferred;
         },

         /**
          * Запустить валидацию
          * @returns {*}
          */
         validate: function validate() {
            var validators = this._options.validators || [];
            this.setValidationResult(undefined);
            return this._callValidators(validators);
         },

         /**
          * Позволяет установить результат валидации извне
          * @param validationResult
          */
         setValidationResult: function(validationResult) {
            this._validationResult = validationResult;
            if (!(validationResult instanceof Deferred)) {
               this._forceUpdate();
            }
         },

         /**
          * Получить результат валидации
          * @returns {undefined|*}
          */
         isValid: function() {
            return this._validationResult;
         }
      });
      return Validate;
   }
);

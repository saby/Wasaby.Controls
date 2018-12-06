define('Controls/Validate/Controller',
   [
      'Core/Control',
      'wml!Controls/Validate/Controller',
      'Core/IoC',
      'Core/ParallelDeferred',
      'Core/Deferred',
      'Core/helpers/isNewEnvironment',
      'Controls/Utils/getZIndex',
      'wml!Controls/Validate/ErrorMessage',
      'css!theme?Controls/Validate/ErrorMessage'
   ],
   function(
      Base,
      template,
      IoC,
      ParallelDeferred,
      Deferred,
      isNewEnvironment,
      getZIndex,
      errorMessage
   ) {
      'use strict';

      var _private = {

         /**
          * Показывает Infobox с сообщением об ошибке
          */
         openInfoBox: function(self) {
            if (self._validationResult && self._validationResult.length && !self._isOpened) {
               self._isOpened = true;
               var cfg = {
                  target: self._container,
                  style: 'error',
                  showDelay: 0,
                  hideDelay: 0,
                  template: errorMessage,
                  templateOptions: { content: self._validationResult },
                  eventHandlers: {
                     onResult: self._mouseInfoboxHandler.bind(self)
                  }
               };

               // todo https://online.sbis.ru/opendoc.html?guid=dedf534a-3498-4b93-b09c-0f36f7c91ab5
               if (self._isNewEnvironment) {
                  self._notify('openInfoBox', [cfg], { bubbling: true });
               } else {
                  // To place zIndex in the old environment
                  cfg.zIndex = getZIndex(self._children.infoBoxOpener);
                  self._children.infoBoxOpener.open(cfg);
               }
            }
         },

         /**
          * Скрывает InfoBox с подсказкой
          */
         closeInfoBox: function(self) {
            var data = self;
            self._closeId = setTimeout(function() {
               if (self._isNewEnvironment) {
                  data._notify('closeInfoBox', [data], { bubbling: true });
               } else {
                  self._children.infoBoxOpener.close();
               }
               data._isOpened = false;
            }, 300);
         }

      };
      var Validate = Base.extend({
         _template: template,
         _isOpened: false,
         _beforeMount: function() {
            this._isNewEnvironment = isNewEnvironment();
         },
         _afterMount: function() {
            this._notify('validateCreated', [this], { bubbling: true });
         },
         _beforeUnmount: function() {
            this._notify('validateDestroyed', [this], { bubbling: true });
            this._notify('closeInfoBox', [this], { bubbling: true });
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
            if (validationResult) {
               _private.openInfoBox(this);
            } else if (this._isOpened) {
               _private.closeInfoBox(this);
            }
         },
         _hoverHandler: function() {
            clearTimeout(this._closeId);
            if (!this._isOpened) {
               _private.openInfoBox(this);
            }
         },
         _focusInHandler: function() {
            if (!this._isOpened) {
               _private.openInfoBox(this);
            }
         },
         _mouseInfoboxHandler: function(event) {
            if (event.type === 'mouseenter') {
               this._hoverInfoboxHandler(this);
            } else {
               this._mouseLeaveHandler(this);
            }
         },
         _mouseLeaveHandler: function() {
            if (this.isValid()) {
               _private.closeInfoBox(this);
            }
         },
         _hoverInfoboxHandler: function() {
            clearTimeout(this._closeId);
         },

         /**
          * Получить результат валидации
          * @returns {undefined|*}
          */
         isValid: function() {
            return this._validationResult;
         },
         _private: _private
      });
      return Validate;
   });

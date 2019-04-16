import Base = require('Core/Control');
import template = require('wml!Controls/_validate/Controller');
import Env = require('Env/Env');
import ParallelDeferred = require('Core/ParallelDeferred');
import Deferred = require('Core/Deferred');
import isNewEnvironment = require('Core/helpers/isNewEnvironment');
import getZIndex = require('Controls/Utils/getZIndex');
import errorMessage = require('wml!Controls/_validate/ErrorMessage');
import 'css!theme?Controls/_validate/ErrorMessage';
      

      var _private = {

         /**
          * Показывает Infobox с сообщением об ошибке
          */
         openInfoBox: function(self) {
            if (self._validationResult && self._validationResult.length && !self._isOpened) {
               self._isOpened = true;
               var cfg = {
                  target: self._container,
                  style: 'danger',
                  styleType: 'outline',
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
                  // Аналог self._notify('openInfoBox', [cfg], { bubbling: true });, только обработчик
                  // Вызывается напрямую, так как события через compoundControl не летят
                  cfg.zIndex = getZIndex(self);
                  var GlobalPopup = _private.getGlobalPopup();
                  if (GlobalPopup) {
                     var event = {
                        target: self._container
                     };
                     GlobalPopup._openInfoBoxHandler(event, cfg);
                  }
               }
            }
         },
         getGlobalPopup: function() {
            // Получаем обработчик глобальных событий по открытию окон, который на вдом
            // Лежит в application
            var ManagerWrapperControllerModule = 'Controls/Popup/Compatible/ManagerWrapper/Controller';
            if (requirejs.defined(ManagerWrapperControllerModule)) {
               return requirejs(ManagerWrapperControllerModule).getGlobalPopup();
            }
         },

         /**
          * Скрывает InfoBox с подсказкой
          */
         closeInfoBox: function(self) {
            self._closeId = setTimeout(function() {
               _private.forceCloseInfoBox(self);
               self._isOpened = false;
            }, 300);
         },

         forceCloseInfoBox: function(self) {
            var delay = 0;
            if (self._isNewEnvironment) {
               self._notify('closeInfoBox', [delay], { bubbling: true });
            } else {
               // Аналог self._notify('closeInfoBox', [delay], { bubbling: true });, только обработчик
               // Вызывается напрямую, так как события через compoundControl не летят
               var GlobalPopup = _private.getGlobalPopup();
               if (GlobalPopup) {
                  var event = {
                     target: self._container
                  };
                  GlobalPopup._closeInfoBoxHandler(event, delay);
               }
            }
         }

      };
      var Validate = Base.extend({
         _template: template,
         _isOpened: false,
         _beforeMount: function() {
            this._isNewEnvironment = isNewEnvironment();
            if (!this._isNewEnvironment) {
               // Если окружение старое, создаем ManagerWrapper, в котором рисуются dom окна в старом окружении
               // В том числе инфобоксы.
               requirejs(['Controls/Popup/Opener/BaseOpener'], function(BaseOpener) {
                  BaseOpener.getManager();
               });
            }
         },
         _afterMount: function() {
            this._notify('validateCreated', [this], { bubbling: true });
         },
         _beforeUnmount: function() {
            this._notify('validateDestroyed', [this], { bubbling: true });
            if (this._isOpened) {
               _private.forceCloseInfoBox(this);
            }
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
               Env.IoC.resolve('ILogger').error('Validate', 'Validation error', e);
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
            } else if (this._isOpened && validationResult === null) {
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
         _valueChangedHandler: function(event, value) {
            this._notify('valueChanged', [value]);
            this._cleanValid();
         },
         _cleanValid: function() {
            if (this._validationResult) {
               this.setValidationResult(null);
            }
         },

         /**
          * Получить результат валидации
          * @returns {undefined|*}
          */

         isValid: function() {
            return this._validationResult;
         },

         // todo это временный фикс, этот код должен уйти в контрол поля ввода, валидация уже отдает туда результат валидации, контролу нужно использовать эти данные
         _isValidResult: function() {
            return this._validationResult && !(this._validationResult instanceof Deferred);
         },
         _private: _private
      });
      export = Validate;
   

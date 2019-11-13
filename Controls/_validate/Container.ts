import {Control, TemplateFunction} from 'UI/Base';
import template = require('wml!Controls/_validate/Container');
import Env = require('Env/Env');
import ParallelDeferred = require('Core/ParallelDeferred');
import Deferred = require('Core/Deferred');
import isNewEnvironment = require('Core/helpers/isNewEnvironment');
import getZIndex = require('Controls/Utils/getZIndex');
import {UnregisterUtil, RegisterUtil} from 'Controls/event';
import errorMessage = require('wml!Controls/_validate/ErrorMessage');
import 'css!theme?Controls/validate';

/**
 * Контрол, регулирующий валидацию своего контента.
 * Валидация запускается вызовом метода validate ({@link Controls/_validate/Container#validate})
 * @class Controls/_validate/Container
 * @extends Core/Control
 * @control
 * @public
 * @author Красильников А.С.
 */

const _private = {

    openInfoBox(self) {
        if (self._validationResult && self._validationResult.length && !self._isOpened) {
            self._isOpened = true;
            const cfg = {
                target: self._container,
                style: 'danger',
                styleType: 'outline',
                template: errorMessage,
                templateOptions: {content: self._validationResult},
                eventHandlers: {
                    onResult: self._mouseInfoboxHandler.bind(self),
                    onClose: self._closeHandler.bind(self)
                }
            };

            _private.callInfoBox(self, cfg);
        }
    },
    callInfoBox(self, cfg) {
        // todo https://online.sbis.ru/opendoc.html?guid=dedf534a-3498-4b93-b09c-0f36f7c91ab5
        if (self._isNewEnvironment) {
            self._notify('openInfoBox', [cfg], {bubbling: true});
        } else {
            // To place zIndex in the old environment
            // Аналог self._notify('openInfoBox', [cfg], { bubbling: true });, только обработчик
            // Вызывается напрямую, так как события через compoundControl не летят
            cfg.zIndex = getZIndex(self);
            // Если окружение старое, создаем ManagerWrapper, в котором рисуются dom окна в старом окружении
            // В том числе инфобоксы.
            requirejs(['Controls/popup'], (popup) => {
                popup.BaseOpener.getManager().then(() => {
                    const GlobalPopup = _private.getGlobalPopup();
                    if (GlobalPopup) {
                        const event = {
                            target: self._container
                        };
                        GlobalPopup._openInfoBoxHandler(event, cfg);
                    }
                });
            });
        }
    },
    getGlobalPopup() {
        // Получаем обработчик глобальных событий по открытию окон, который на вдом
        // Лежит в application
        const ManagerWrapperControllerModule = 'Controls/Popup/Compatible/ManagerWrapper/Controller';
        if (requirejs.defined(ManagerWrapperControllerModule)) {
            return requirejs(ManagerWrapperControllerModule).default.getGlobalPopup();
        }
    },

    closeInfoBox(self) {
        self._closeId = setTimeout(function() {
            _private.forceCloseInfoBox(self);
        }, 300);
    },

    forceCloseInfoBox(self) {
        const delay = 0;
        if (self._isNewEnvironment) {
            self._notify('closeInfoBox', [delay], {bubbling: true});
        } else {
            // Аналог self._notify('closeInfoBox', [delay], { bubbling: true });, только обработчик
            // Вызывается напрямую, так как события через compoundControl не летят
            const GlobalPopup = _private.getGlobalPopup();
            if (GlobalPopup) {
                const event = {
                    target: self._container
                };
                GlobalPopup._closeInfoBoxHandler(event, delay);
            }
        }
        self._isOpened = false;
    }

};

type ValidResult = boolean|null|Promise<boolean>|String;
class ValidateContainer extends Control {
    _template: TemplateFunction = template;
    _isOpened: boolean = false;
    _currentValue: any;
    _validationResult: ValidResult;
    _isNewEnvironment: boolean;
    _closeId: number;

    _private: any = _private;

    protected _beforeMount(): void {
        this._isNewEnvironment = isNewEnvironment();
    }

    protected _afterMount(): void {
        // Use listener without template.
        // Some people can add style to the container of validation, and some people can add style to the content.
        RegisterUtil(this, 'scroll', this._scrollHandler.bind(this));
        this._notify('validateCreated', [this], {bubbling: true});
    }

    protected _beforeUnmount(): void {
        UnregisterUtil(this, 'scroll');
        this._notify('validateDestroyed', [this], {bubbling: true});
        if (this._isOpened) {
            _private.forceCloseInfoBox(this);
        }
    }

    _callValidators(validators: Function[], hideInfoBox?: boolean) {
        let validationResult = null,
            errors = [],
            validatorResult, validator, resultDeferred, index;

        const parallelDeferred = new ParallelDeferred();
        const validatorsForCheck = [].concat(validators);

        // провалидируем по собственным валидаторам
        for (index in validatorsForCheck) {
            if (validatorsForCheck.hasOwnProperty(index)) {
                validator = validatorsForCheck[index];
                if (typeof validator === 'function') {
                    // если встретили функцию
                    validatorResult = validator();
                } else if (validator instanceof Promise) {
                    // если встретили deferred - значит значение уже провалидировано и ждем результат
                    validatorResult = validator;
                } else {
                    // если что-то еще, считаем что это - ответ валидации
                    validatorResult = !!validator;
                }

                // результат - либо deferred, либо готовое значение
                if (validatorResult instanceof Promise) {
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

        // далее, смотрим что возвращают результаты-деферреды
        parallelDeferred.done().getResult().addCallback((results) => {
            let validationResult = null;
            if (typeof results === 'object') {
                for (const resultIndex in results) {
                    // плохие результаты запоминаем в массиве с ошибками
                    if (results.hasOwnProperty(resultIndex)) {
                        let result = results[resultIndex];
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

            this.setValidationResult(validationResult, hideInfoBox);
            resultDeferred.callback(validationResult);
        }).addErrback((e) => {
            Env.IoC.resolve('ILogger').error('Validate', 'Validation error', e);
        });

        return resultDeferred;
    }

    validate(hideInfoBox?: boolean): Promise<boolean[]> {
        return new Promise((resolve) => {
            const validators = this._options.validators || [];
            this.setValidationResult(undefined);
            this._callValidators(validators, hideInfoBox).then(resolve);
        });

    }

    /**
     * @name Controls/_validate/Container#setValidationResult
     * @description Устанавливает значение validationResult.
     * @param validationResult
     */

    /*
     * @name Controls/_validate/Container#setValidationResult
     * @description Set the validationResult from the outside
     * @param validationResult
     */
    setValidationResult(validationResult: ValidResult, hideInfoBox?: boolean): void {
        this._validationResult = validationResult;
        if (!(validationResult instanceof Promise)) {
            this._forceUpdate();
        }
        if (validationResult && !hideInfoBox) {
            _private.openInfoBox(this);
        } else if (this._isOpened && validationResult === null) {
            _private.closeInfoBox(this);
        }
    }

    /**
     * @name Controls/_validate/Container#isValid
     * @description Получает значение validationResult.
     * @returns {undefined|Array}
     */

    /*
     * @name Controls/_validate/Container#isValid
     * @description Get the validationResult
     * @returns {undefined|Array}
     */
    isValid(): ValidResult {
        return this._validationResult;
    }

    _hoverHandler() {
        clearTimeout(this._closeId);
        if (!this._isOpened) {
            _private.openInfoBox(this);
        }
    }

    _scrollHandler() {
        if (this._isOpened) {
            _private.forceCloseInfoBox(this);
        }
    }

    _focusInHandler(): void {
        if (!this._isOpened) {
            _private.openInfoBox(this);
        }
    }

    _mouseInfoboxHandler(event: Event): void {
        if (event.type === 'mouseenter') {
            this._hoverInfoboxHandler();
        } else if (event.type === 'mouseleave') {
            this._mouseLeaveHandler();
        } else if (event.type === 'close') {
            this._isOpened = false;
        }
    }

    _closeHandler(): void {
        this._isOpened = false;
    }

    _mouseLeaveHandler(): void {
        if (this.isValid()) {
            _private.closeInfoBox(this);
        }
    }

    _hoverInfoboxHandler() {
        clearTimeout(this._closeId);
    }

    _valueChangedHandler(event: Event, value: any): void {
        // We clean validation, if the value has changed.
        // But some controls notify valueChanged if the additional data has changed.
        // For example, input fields notify 'valueChanged' , when displayValue has changed, but value hasn't changed.
        if (this._currentValue !== value) {
            this._currentValue = value;
            this._notify('valueChanged', [value]);
            this._cleanValid();
        }
    }

    _cleanValid(): void {
        if (this._validationResult) {
            this.setValidationResult(null);
        }
    }


    // todo это временный фикс, этот код должен уйти в контрол поля ввода,
    //  валидация уже отдает туда результат валидации, контролу нужно использовать эти данные
    _isValidResult(): boolean {
        return this._validationResult && !(this._validationResult instanceof Promise);
    }
}

export default ValidateContainer;

/**
 * @name Controls/_validate/Container#content
 * @cfg {Content} Контент, который будет провалидирован.
 */
/*
 * @name Controls/_validate/Container#content
 * @cfg {Content} The content to which the logic of validation is added.
 */

/**
 * @name Controls/_validate/Container#validators
 * @cfg {Array} The function of validation.
 */
/*
 * @name Controls/_validate/Container#validators
 * @cfg {Array} Функция (или массив функций) валидации.
 */

/**
 * @name Controls/_validate/Container#readOnly
 * @cfg {Boolean} Валидация контрола в режиме чтения.
 */
/*
 * @name Controls/_validate/Container#readOnly
 * @cfg {Boolean} Validate field in read mode.
 */


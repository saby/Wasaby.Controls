import {Control, IControlOptions, TemplateFunction} from 'UI/Base';
import template = require('wml!Controls/_validate/Controller');
import ValidateContainer from 'Controls/_validate/Container';
import ControllerClass from 'Controls/_validate/ControllerClass';

interface IValidateResult {
    [key: number]: boolean;
    hasErrors?: boolean;
}

/**
 * Контрол, регулирующий валидацию формы.
 * Валидация запускается при вызове метода {@link Controls/_validate/Controller#submit submit}.
 * @class Controls/_validate/Controller
 * @extends Core/Control
 * @control
 * @public
 * @demo Controls-demo/Input/Validate/FormController
 * @author Красильников А.С.
 */

class Form extends Control<IControlOptions> {
    private _submitPromise: Promise<IValidateResult | Error>;
    private _submitResolve: (res: IValidateResult) => void = null;
    private _submitReject: (res: Error) => void = null;
    private _validateController: ControllerClass = new ControllerClass();

    protected _template: TemplateFunction = template;

    protected _afterUpdate(oldOptions?: IControlOptions, oldContext?: any): void {
        super._afterUpdate(oldOptions, oldContext);

        if (this._submitPromise) {
            const submitResolve = this._submitResolve;
            const submitReject = this._submitReject;
            this._submitResolve = null;
            this._submitReject = null;
            this._submitPromise = null;
            this._validateController.submit()
                .then((result: IValidateResult) => {
                    submitResolve(result);
                })
                .catch((error: Error) => {
                    submitReject(error);
                });
        }
    }

    onValidateCreated(e: Event, control: ValidateContainer): void {
        this._validateController.addValidator(control);
    }

    onValidateDestroyed(e: Event, control: ValidateContainer): void {
        this._validateController.removeValidator(control);
    }

    submit(): Promise<IValidateResult | Error> {
        /**
         * Если метод будет вызван во время цикла синхронизации, то дочерние контролы
         * будут иметь старые опции, а работать должны с новыми. Поэтому откладываем действия до завершения цикла синхронизации.
         * Примеры возникающих ошибок:
         * https://online.sbis.ru/opendoc.html?guid=801ee6cf-7ba0-489d-b69c-60a89f976cec
         * https://online.sbis.ru/doc/6603463e-30fa-47b6-ba06-93b08bdc1590
         * У поля ввода установлена опция trim = 'true', при завершении редактирования будет обработано значение с пробелами,
         * т.к. последовательно произойдет измененние значения поля ввода -> завершение редактирования -> вызов submit -> обновление значения в поле ввода.
         */
        if (!this._submitPromise) {
            this._submitPromise = new Promise((resolve, reject) => {
                this._submitResolve = resolve;
                this._submitReject = reject;
            });
        }
        this._forceUpdate();

        return this._submitPromise;
    }

    setValidationResult(): void {
        return this._validateController.setValidationResult();
    }

    getValidationResult(): IValidateResult {
        return this._validateController.getValidationResult();
    }

    isValid(): boolean {
        return this._validateController.isValid();
    }

    protected _beforeUnmount(): void {
        this._validateController.destroy();
        this._validateController = null;
    }
}

export default Form;

/**
 * @name Controls/_validate/Controller#content
 * @cfg {Content} Содержимое, к которому добавлена ​​логика валидации.
 */

/**
 * Запускает валидацию.
 * @name Controls/_validate/Controller#submit
 * @function
 * @returns {Deferred}
 * @example
 * WML
 * <pre>
 * <Controls.validate:Controller name="formController">
 *    <ws:content>
 *       <Controls.validate:Container>
 *          <ws:validators>
 *             <ws:Function value="{{_value2}}" >Controls/validate:isRequired</ws:Function>
 *          </ws:validators>
 *          <ws:content>
 *             <Controls.input:Text bind:value="_value2"/>
 *          </ws:content>
 *       </Controls.validate:Container>
 *    </ws:content>
 * </Controls.validate:Controller>
 * <Controls.buttons:Button caption="Submit" on:click="_clickHandler()"
 * </pre>
 * JavaScript
 * <pre>
 *     Control.extend({
 *        ...
 *
 *        _clickHandler: function() {
 *           this._children.formController.submit();
 *        }
 *        ...
 *    });
 * </pre>
 */

/**
 * Возвращает значение, указывающее, прошла ли проверка валидации содержимого успешно.
 * @name Controls/_validate/Controller#isValid
 * @function
 * @returns {Boolean}
 */

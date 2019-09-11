export type ValidationStatus = 'valid' | 'invalid';

/**
 * Интерфейс контролов ввода, которые могут визуально отображать наличие ошибки, допущенной при вводе.
 *
 * @interface Controls/_input/interface/IValidationStatus
 * @public
 *
 * @author Красильников А.С.
 */
export interface IValidationStatusOptions {
    /**
     * @name Controls/_input/interface#validationStatus
     * @cfg {Enum} Статус валидации поля ввода.
     * @variant valid валидное поле.
     * @variant invalid невалидное поле.
     * @demo Controls-demo/Input/ValidationStatuses/Index       * @demo Controls-demo/Input/Placeholders/Index
     */
    validationStatus: ValidationStatus;
}

interface IValidationStatus {
    readonly '[Controls/_input/interface/IValidationStatus]': boolean;
}

export default IValidationStatus;

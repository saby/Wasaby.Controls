export type ValidationStatus = 'valid' | 'invalid' | 'invalidAccent';

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
     * @variant invalid подсвечивает поле с ошибкой валидации. При получении фокуса полем ввода, его внешний вид может измениться для акцентирования внимания на ошибке.
     * @variant invalidAccent подсвечивает поле с ошибкой валидации так, как будто в нем установлен фокус. Используется только в случаях, когда нет возможности установить фокус в поле ввода.
     * @demo Controls-demo/Input/ValidationStatuses/Index       * @demo Controls-demo/Input/Placeholders/Index
     */
    validationStatus: ValidationStatus;
}

interface IValidationStatus {
    readonly '[Controls/_input/interface/IValidationStatus]': boolean;
}

export default IValidationStatus;

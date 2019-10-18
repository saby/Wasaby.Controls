export type ValidationStatus = 'valid' | 'invalid' | 'invalidAccent';

/**
 * Интерфейс контролов ввода, которые могут визуально отображать наличие ошибки, допущенной при вводе.
 *
 * @interface Controls/_interface/IValidationStatus
 * @public
 *
 * @author Красильников А.С.
 */
export interface IValidationStatusOptions {
    /**
     * @name Controls/_interface#validationStatus
     * @cfg {Enum} Статус валидации контрола.
     * @variant valid валидный контрол
     * @variant invalid подсвечивает контрол с ошибкой валидации. При получении фокуса контрола его внешний вид может измениться для акцентирования внимания на ошибке.
     * @variant invalidAccent подсвечивает контрол с ошибкой валидации так, как будто в нем установлен фокус. Используется только в случаях, когда нет возможности установить фокус в контрол.
     * @demo Controls-demo/Input/ValidationStatuses/Index
     */
    validationStatus: ValidationStatus;
}

interface IValidationStatus {
    readonly '[Controls/_interface/IValidationStatus]': boolean;
}

export default IValidationStatus;

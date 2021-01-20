/**
 * Интерфейс ответа после валидации.
 * @public
 * @autor Красильников А.С.
 */

 export default interface IValidateResult {

/** 
 * Есть ли ошибки в результате валидации.
 */

    [key: number]: boolean;
    hasErrors?: boolean;
}
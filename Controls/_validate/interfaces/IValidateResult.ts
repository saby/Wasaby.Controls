/**
 * Интерфейс ответа после валидации.
 * @public
 * @autor Красильников А.С.
 */

 export default interface IValidateResult {
/** 
 * Есть ли ошибки в результате валидации и собственно сам массив ошибок.
 */
    [key: number]: boolean;
    hasErrors?: boolean;
}
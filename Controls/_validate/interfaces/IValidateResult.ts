/**
 * Интерфейс ответа после валидации.
 * @public
 * @autor Красильников А.С.
 */

 export default interface IValidateResult {
    /** 
     * Массив ошибок.
     */
    [key: number]: boolean;
    /** 
     * Есть ли ошибки в результате валидации.
     */
    hasErrors?: boolean;
}
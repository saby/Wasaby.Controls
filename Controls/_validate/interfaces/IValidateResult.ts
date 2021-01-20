export default interface IValidateResult {
    [key: number]: boolean;
    hasErrors?: boolean;
}

/**
 * Интерфейс ответа после валидации.
 * @interface Controls/_validate/interfaces/IValidateResult
 * @public
 * @autor Красильников А.С.
 */

 /**
  * @name Controls/_validate/interfaces/IValidateResult#hasErrors
  * @cfg {boolean}  есть ли ошибки в результате валидации и собственно сам массив ошибок.
  */

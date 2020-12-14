import {descriptor} from 'Types/entity';

export interface DateRangeValidatorObject {
   validator: Function;
   arguments: object
}

export type DateRangeValidators = DateRangeValidatorObject[] | Function[]

export interface IDateRangeValidatorsOptions {
    startValueValidators: DateRangeValidators;
    endValueValidators: DateRangeValidators;
    validateByFocusOut: boolean;
}

/**
 * Интерфейс для полей ввода с внутренней валидацией. Позволяет заать валидаторы для возвращаемого значения.
 *
 * @interface Controls/_interface/IDateRangeValidators
 * @public
 */

export default interface IDateRangeValidators {
    readonly '[Controls/_interface/IDateRangeValidators]': boolean;
}

/**
 * @name Controls/_interface/IDateRangeValidators#startValueValidators
 * @cfg {Array} Массив вылидаторов или объектов содержащих валидаторы и их аргументы.
 *
 * @remark
 * При вызове валидатора в качестве аргументов он получает введнное в поле значение и заданные из прикладного кода
 * аргументы.
 *
 * @demo Controls-demo/dateRange/Validators/Index
 *
 * @see Controls/_interface/IDateRangeValidators#endValueValidators
 * @see Controls/_interface/IDateRangeValidators#validateByFocusOut
 */

/**
 * @name Controls/_interface/IDateRangeValidators#endValueValidators
 * @cfg {Array} Массив вылидаторов или объектов содержащих валидаторы и их аргументы.
 *
 * @remark
 * При вызове валидатора в качестве аргументов он получает введнное в поле значение и заданные из прикладного кода
 * аргументы.
 *
 * @demo Controls-demo/dateRange/Validators/Index
 *
 * @see Controls/_interface/IDateRangeValidators#startValueValidators
 * @see Controls/_interface/IDateRangeValidators#validateByFocusOut
 */

/**
 * @name Controls/_interface/IDateRangeValidators#validateByFocusOut
 * @cfg {Boolean} Если true, то внутренняя валидация будет срабатывать по уходу фокуса из контрола, если false то
 * будет срабатывать только по внешнему триггеру, например при валидации формы.
 * @default true
 *
 * @demo Controls-demo/dateRange/Validators/Index
 *
 * @see Controls/_interface/IDateRangeValidators#startValueValidators
 * @see Controls/_interface/IDateRangeValidators#endValueValidators
 * @see Controls/_interface/IDateRangeValidators#valueValidators
 */

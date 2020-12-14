export interface IDateRangeOptions {
   startValue?: Date;
   endValue?: Date;
}

/**
 * Интерфейс для поддержки ввода диапазона дат.
 * @interface Controls/_dateRange/interfaces/IDateRange
 * @public
 */

/**
 * @name Controls/_dateRange/interfaces/IDateRange#startValue
 * @cfg {Date} Начальное значение диапазона.
 * @demo Controls-demo/dateRange/Default/Index
 */

/*
 * @name Controls/_dateRange/interfaces/IDateRange#startValue
 * @cfg {Date} Beginning of period
 * @demo Controls-demo/dateRange/Default/Index
 */

/**
 * @name Controls/_dateRange/interfaces/IDateRange#endValue
 * @cfg {Date} Конечное значение диапазона.
 * @demo Controls-demo/dateRange/Default/Index
 */

/*
 * @name Controls/_dateRange/interfaces/IDateRange#endValue
 * @cfg {Date} End of period
 * @demo Controls-demo/dateRange/Default/Index
 */

/**
 * @event Происходит при смещении диапазона.
 * @name Controls/_dateRange/interfaces/IDateRange#rangeChanged
 * @param {Date} startValue верхняя граница диапазона дат
 * @param {Date} endValue нижняя граница диапазона дат
 */

/**
 * @event Происходит при изменении начального значения поля.
 * @name Controls/_dateRange/interfaces/IDateRange#startValueChanged
 * @param {Vdom/Vdom:SyntheticEvent} eventObject Дескриптор события.
 * @param {Date} value Новое значение поля.
 * @param {String} displayValue Текстовое значение поля.
 * @remark
 * Это событие должно использоваться для реагирования на изменения, вносимые пользователем в поле.
 * @example
 * В этом примере мы покажем, как осуществить "привязку" значения контрола к полю.
 * В первом поле мы делаем это вручную, используя событие valueChanged. Во втором поле используется формат "привязки".
 * Оба поля в этом примере будут иметь одинаковое поведение.
 * <pre>
 *    <Controls.dateRange:Input startValue="_fieldValue" on:startValueChanged="_valueChangedHandler()"/>
 *    <Controls.dateRange:Input bind:startValue="_anotherFieldValue"/>
 * </pre>
 * <pre>
 *    Control.extend({
 *       ....
 *       _fieldValue: null,
 *       _valueChangedHandler(value, displayValue) {
 *          this._fieldValue = value;
 *          this._saveToDatabase(displayValue);
 *       },
 *       _anotherFieldValue: null
 *       ...
 *    });
 * </pre>
 */

/*
 * @event Occurs when field start value was changed.
 * @name Controls/_dateRange/interfaces/IDateRange#startValueChanged
 * @param {Date} value New field value.
 * @param {String} displayValue Text value of the field.
 * @remark
 * This event should be used to react to changes user makes in the field.
 * @example
 * In this example, we show how you can 'bind' control's value to the field.
 * In the first field, we do it manually using valueChanged event. In the second field we use bind notation.
 * Both fields in this examples will have identical behavior.
 * <pre>
 *    <Controls.dateRange:Input startValue="_fieldValue" on:startValueChanged="_valueChangedHandler()"/>
 *    <Controls.dateRange:Input bind:startValue="_anotherFieldValue"/>
 * </pre>
 * <pre>
 *    Control.extend({
 *       ....
 *       _fieldValue: null,
 *       _valueChangedHandler(value, displayValue) {
 *          this._fieldValue = value;
 *          this._saveToDatabase(displayValue);
 *       },
 *       _anotherFieldValue: null
 *       ...
 *    });
 * </pre>
 */

/**
 * @event Происходит при изменении конечного значения поля.
 * @name Controls/_dateRange/interfaces/IDateRange#endValueChanged
 * @param {Vdom/Vdom:SyntheticEvent} eventObject Дескриптор события.
 * @param {Date} value Новое значение поля.
 * @param {String} displayValue Текстовое значение поля.
 * @remark
 * Это событие должно использоваться для реагирования на изменения, вносимые пользователем в поле.
 * @example
 * В этом примере мы покажем, как осуществить "привязку" значения контрола к полю.
 * В первом поле мы делаем это вручную, используя событие valueChanged. Во втором поле используется формат "привязки".
 * Оба поля в этом примере будут иметь одинаковое поведение.
 * <pre>
 *    <Controls.dateRange:Input endValue="_fieldValue" on:endValueChanged="_valueChangedHandler()"/>
 *    <Controls.dateRange:Input bind:endValue="_anotherFieldValue"/>
 * </pre>
 * <pre>
 *    Control.extend({
 *       ....
 *       _fieldValue: null,
 *       _valueChangedHandler(value, displayValue) {
 *          this._fieldValue = value;
 *          this._saveToDatabase(displayValue);
 *       },
 *       _anotherFieldValue: null,
 *       ...
 *    });
 * </pre>
 */

/*
 * @event Occurs when field end value was changed.
 * @name Controls/_dateRange/interfaces/IDateRange#endValueChanged
 * @param {Date} value New field value.
 * @param {String} displayValue Text value of the field.
 * @remark
 * This event should be used to react to changes user makes in the field.
 * @example
 * In this example, we show how you can 'bind' control's value to the field.
 * In the first field, we do it manually using valueChanged event. In the second field we use bind notation.
 * Both fields in this examples will have identical behavior.
 * <pre>
 *    <Controls.dateRange:Input endValue="_fieldValue" on:endValueChanged="_valueChangedHandler()"/>
 *    <Controls.dateRange:Input bind:endValue="_anotherFieldValue"/>
 * </pre>
 * <pre>
 *    Control.extend({
 *       ....
 *       _fieldValue: null,
 *       _valueChangedHandler(value, displayValue) {
 *          this._fieldValue = value;
 *          this._saveToDatabase(displayValue);
 *       },
 *       _anotherFieldValue: null,
 *       ...
 *    });
 * </pre>
 */

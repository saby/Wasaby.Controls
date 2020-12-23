/**
 * Интерфейс диалога выбора периода.
 * @interface Controls/_datePopup/interfaces/IDatePopup
 * @public
 * @author Красильников А.С.
 */

/*
 * Interface to select the period of the dialogue.
 * @interface Controls/_datePopup/interfaces/IDatePopup
 * @public
 * @author Красильников А.С.
 */

/**
 * @event Происходит при завершении ввода (поле ввода периода потеряло фокус или пользователь нажал клавишу "Enter").
 * @name Controls/_datePopup/interfaces/IDatePopup#inputCompleted
 * @param {Vdom/Vdom:SyntheticEvent} eventObject Дескриптор события.
 * @param {Date} startValue Начальное значение периода.
 * @param {Date} endValue Конечное значение периода.
 * @param {String} displayedStartValue Текстовое значение начала периода.
 * @param {String} displayedEndValue Текстовое значение конца периода.
 * @remark
 * Это событие можно использовать в качестве триггера для проверки периода или отправки введенных данных в какой-либо другой контрол.
 * @example
 * В этом примере мы подписываемся на событие inputCompleted и сохраняем значение периода в первой базе данных и отображаемое значение периода во второй базе данных.
 * <pre>
 *    <Controls.datePopup on:inputCompleted="_inputCompletedHandler()" />
 * </pre>
 * <pre>
 *    Base.Control.extend({
 *       ....
 *       _inputCompletedHandler(event, startValue, endValue, displaydStartValue, displaydEndValue) {
 *          this._saveEnteredValueToDabase1(startValue, endValue);
 *          this._saveEnteredValueToDabase2(displaydStartValue, displaydEndValue);
 *       },
 *       ...
 *    })
 * </pre>
 */

/*
 * @event Occurs when input was completed (period lost focus or user pressed ‘enter’).
 * @name Controls/_datePopup/interfaces/IDatePopup#inputCompleted
 * @param {Date} startValue Start period value.
 * @param {Date} endValue End period value.
 * @param {String} displayedStartValue Text value of the start period.
 * @param {String} displayedEndValue Text value of the end period.
 * @remark
 * This event can be used as a trigger to validate the period or send entered data to some other control.
 * @example
 * In this example, we subscribe to inputCompleted event and save period's value to the first database and period`s display value to the second database.
 * <pre>
 *    <Controls.datePopup on:inputCompleted="_inputCompletedHandler()" />
 * </pre>
 * <pre>
 *    Base.Control.extend({
 *       ....
 *       _inputCompletedHandler(event, startValue, endValue, displaydStartValue, displaydEndValue) {
 *          this._saveEnteredValueToDabase1(startValue, endValue);
 *          this._saveEnteredValueToDabase2(displaydStartValue, displaydEndValue);
 *       },
 *       ...
 *    })
 * </pre>
 */

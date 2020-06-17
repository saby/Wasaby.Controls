/**
 * Интерфейс для контролов, которые вызывают попап {@link Controls/datePopup}.
 * @interface Controls/_dateRange/interfaces/IDatePickerSelectors
 * @public
 */

/**
 * @name Controls/_dateRange/interfaces/IDatePickerSelectors#calendarSource
 * @cfg {Types/source:ICrud} Источник данных, которые используются для отображения дней.
 * @remark
 * Должен поддерживать списочный метод с навигацией по курсору.
 * В качестве идентификатора используется дата начала месяца.
 * Каждый элемент — это месяц.
 * Ответ должен содержать список объектов, в котором есть поле extData.
 * extData — это массив объектов, содержащих данные дня.
 * Эти объекты будут переданы в шаблон дня.
 * @example
 * <pre class="brush: html">
 *  <Controls.dateRange:Selector
 *      calendarSource="{{_source}}"/>
 * </pre>
 */

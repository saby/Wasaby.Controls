/**
 * Шаблон, который по умолчанию используется для отображения ячеек в контроле {@link Controls/grid:View}. Подробнее о работе с шаблоном читайте {@link wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/grid/templates/column/ здесь}.
 * @interface Controls/grid:ColumnTemplate
 * @author Авраменко А.С.
 * @see Controls/_grid/interface/IGridControl/Column.typedef
 * @remark
 * 
 * Шаблон поддерживает параметр contentTemplate. В качестве значения параметр принимает вёрстку, которая описывает содержимое ячейки.
 *
 * В области видимости шаблона доступна переменная itemData (тип Object) со следующими свойствами:
 * 
 * - columnIndex (тип Number) — порядковый номер колонки. Отсчет от 0.
 * - index (тип Number) — порядковый номер строки. Отсчет от 0.
 * - isEditing (тип Boolean) — признак редактирования по месту.
 * - item (тип Object) — строка, данные которой отображаются в колонке.
 * - column (тип Object) — конфигурация колонки. См. {@link Controls/_grid/interface/IGridControl/Column.typedef}
 */
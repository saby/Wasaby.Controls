define('Controls/List/interface/IGridControl', [
], function() {

   /**
    * Интерфейс работы грида (табличного представления)
    *
    * @mixin Controls/List/interface/IGridControl
    * @public
    */

   /**
    * @name Controls/List/interface/IGridControl#stickyColumnsCount
    * @cfg {Number} Количество колонок, которые фиксируются при горизонтальном скроле
    */

   /**
    * @name Controls/List/interface/IGridControl#stickyFields
    * @cfg {Array.<String>} Массив полей, по которым формируется "лесенка"
    */

   /**
    * @typedef {Object} HeaderCell Определяет ячеейку заголовка списка.
    * @property {String} [title] Текст в ячейке заголовка.
    * @property {String} [align] Выравнивание текста по горизонтали (left|center|right).
    * @property {String} [valign] Выравнивание текста по вертикали (top|center|bottom).
    * @property {Number} [colspan] Количество объединяемых ячеек в строке, включая текущую (>=2).
    * @property {Number} [rowspan] Количество объединяемых ячеек в колонке, включая текущую (>=2).
    * @property {String} [template] Шаблон отображения ячейки заголовка.
    */

   /**
    * @name Controls/List/interface/IGridControl#header
    * @cfg {Array.<Array.<HeaderCell>>} Определяет заголовок списка.
    */

   /**
    * @typedef {Object} Column
    * @property {Number} [position] Положение колонки в таблице, если не указать соответствует положению в массиве
    * @property {String} [displayProperty] Название поля (из формата записи), значения которого будут отображены в данной колонке по умолчанию.
    * @property {String} [template] Шаблон отображения ячейки.
    * @property {String} [resultTemplate] Шаблон отображения ячейки в строке результатов.
    * @property {String} [align] Выравнивание текста по горизонтали (left|center|right).
    * @property {String} [valign] Выравнивание текста по вертикали (top|center|bottom).
    * @property {String|Number} [width] Ширина колонки (pixels/percent/auto).
    */

   /**
    * @name Controls/List/interface/IGridControl#columns
    * @cfg {Array.<Column>} Устанавливает набор колонок списка.
    */

});
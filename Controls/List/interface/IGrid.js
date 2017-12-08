define('js!Controls/List/interface/IGrid', [
], function() {

   /**
    * Интерфейс работы грида (табличного представления)
    *
    * @mixin Controls/List/interface/IGrid
    * @public
    */

   /**
    * @name Controls/List/interface/IGrid#stickyColumnsCount
    * @cfg {Number} Количество колонок, которые фиксируются при горизонтальном скроле
    */

   /**
    * @name Controls/List/interface/IGrid#stickyFields
    * @cfg {Array.<String>} Массив полей, по которым формируется "лесенка"
    */

   /**
    * @name Controls/List/interface/IGrid#templateColumns
    * @cfg {Array.<String|Number>} templateColumns Описание ширины колонок (pixels/percent/auto).
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
    * @name Controls/List/interface/IGrid#header
    * @cfg {Array.<Array.<HeaderCell>>} Определяет заголовок списка.
    */

   /**
    * @typedef {Object} Column
    * @property {Number} [position] Положение колонки в таблице, если не указать соответствует положению в массиве
    * @property {String} [displayProperty] Название поля (из формата записи), значения которого будут отображены в данной колонке по умолчанию.
    * @property {String} [template] Шаблон отображения ячейки.
    * @property {String} [align] Выравнивание текста по горизонтали (left|center|right).
    * @property {String} [valign] Выравнивание текста по вертикали (top|center|bottom).
    */

   /**
    * @name Controls/List/interface/IGrid#columns
    * @cfg {Array.<Column>} Устанавливает набор колонок списка.
    */

});
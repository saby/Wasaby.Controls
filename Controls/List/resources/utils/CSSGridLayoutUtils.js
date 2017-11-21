define('js!Controls/List/resources/utils/CSSGridLayoutUtils', [], function () {

   /**
    * Вспомогательные функции для работы с моделью CSS Grid Layout
    *
    * @class Controls/List/resources/utils/CSSGridLayoutUtils
    * @author Новожилов Игорь Александрович
    *
    * @public
    * @category Helpers
    */
   var CSSGridLayoutUtils = /** @lends Controls/List/resources/utils/CSSGridLayoutUtils.prototype */ {

      /**
       * Расчет авто-ширины для шаблона колонок CSS Grid Layout.
       * CSS свойство: grid-template-columns.
       * Заменяет значение ширины колонок 'auto' на их расчетное значение через css функцию 'calc'.
       * Остальные значения могут быть заданы только в пикселях или процентах.
       *
       * @param {Array.<String|Number>} columns Массив с указанием ширины колонок (pixels/percent/auto).
       * @returns {Array.<String>} Итоговой массив с указанием ширины колонок.
       */
      calcGridTemplateColumns: function (columns) {
         var resultColumns = [],
            staticColumns = [],
            autoColumnsLength = 0,
            // Шаблон шарины для авто-колонок:
            // 100% минус ширина колонок с указанным размерам, деленное на кол-во авто-колонок
            autoColumnsWidthTmpl = 'calc( ( 100% - {{staticColumns}} ) / {{autoColumnsLength}} )',
            // Шаблон для авто-колонок, если все колонки указаны с авто-шириной
            onlyAutoColumnsWidthTmpl = 'calc( 100% / {{autoColumnsLength}} )',
            autoColumnsWidth,
            i;
         for (i = 0; i < columns.length; i++) {
            var width = columns[i];
            if (width === 'auto') {
               autoColumnsLength++;
            } else {
               // Для ширины заданной целым числом добавляем указание пикселей
               if (!isNaN(Number(width))) {
                  width = width + 'px';
               }
               staticColumns.push(width);
            }
            resultColumns.push(width);
         }
         if (autoColumnsLength === 0) {
            return resultColumns;
         }
         if (staticColumns.length > 0) {
            autoColumnsWidth = autoColumnsWidthTmpl
               .replace('{{staticColumns}}', staticColumns.join(' - '))
               .replace('{{autoColumnsLength}}', autoColumnsLength);
         } else {
            autoColumnsWidth = onlyAutoColumnsWidthTmpl
               .replace('{{autoColumnsLength}}', autoColumnsLength);
         }
         for (i = 0; i < resultColumns.length; i++) {
            if (resultColumns[i] === 'auto') {
               resultColumns[i] = autoColumnsWidth;
            }
         }
         return resultColumns;
      }

   };

   return CSSGridLayoutUtils;
});
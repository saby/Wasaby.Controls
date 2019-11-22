import coreMerge = require('Core/core-merge');
import entity = require('Types/entity');
import IRangeSelectable from './IInputSelectable';
'use strict';

/**
 * @interface Controls/_dateRange/interfaces/IDateRangeSelectable
 * @public
 */
var selectionTypes = coreMerge({'quantum': 'quantum'}, IRangeSelectable.SELECTION_TYPES);
const minRange = {
   day: 'day',
   month: 'month'
};

export = {
   getDefaultOptions: function () {
      var options = IRangeSelectable.getDefaultOptions();

      /**
       * @name Controls/_dateRange/interfaces/IDateRangeSelectable#ranges
       * @cfg {Object} Кванты.
       * @remark
       * Если заданы кванты, то нельзя выделить произвольный период, а можно только выделить заданные периоды. 
       * Объект принимает свойства days, weeks, months, quarters, halfyears, и years со значениями типа Array.
       * @example 
       * <pre class="brush:js">
       * <Controls.dateRange:Selector ranges="{days: [1,4], weeks: [2], months: [1] }" />
       * </pre>
       * В данном примере можно выбрать либо 1 день, либо диапазон в 4 дня, либо 2 целые недели, либо 1 месяц
       */
      options.ranges = [];

      /**
       * @name Controls/_dateRange/interfaces/IDateRangeSelectable#selectionType
       * @cfg {String} Определяет режим выделения диапазона.
       * @variant range Режим выделения произвольного диапазона.
       * @variant single Режим выделения одного элемента.
       * @variant disable Режим выбора отключен.
       * @variant quantum Режим выделения квантами. Кванты задаются через опцию {@link https://wi.sbis.ru/docs/js/Controls/dateRange/IDateRangeSelectable/options/ranges/ range}
       */

      /**
       * @name Controls/_dateRange/interfaces/IDateRangeSelectable#minRange
       * @cfg {String} Задает режим выбора диапазона дат.
       * @variant day Режим выбора периода из нескольких дней.
       * @variant month Режим выбора периода из нескольких месяцев.
       */

      /*
       * @name Controls/_dateRange/interfaces/IDateRangeSelectable#minRange
       * @cfg {String} Specifies the range selection mode
       * @variant 'day' selection mode period multiple days
       * @variant 'month' selection mode period multiple months
       */
      options.minRange = minRange.day;

      return options;
   },

   SELECTION_TYPES: selectionTypes,

   minRange,

   getOptionTypes: function () {
      var optionsTypes = IRangeSelectable.getOptionTypes();
      optionsTypes.selectionType = entity.descriptor(String).oneOf(Object.keys(selectionTypes));
      return optionsTypes;
   }
};

import coreMerge = require('Core/core-merge');
import entity = require('Types/entity');
import IRangeSelectable from './IRangeSelectable';
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
       * @cfg {Object} Кванты. Если заданы кванты, то нельзя выделить произвольный период, можно только выделить заданные периоды.
       */
      options.ranges = [];

      /**
       * @name Controls/_dateRange/interfaces/IDateRangeSelectable#selectionType
       * @cfg {String} Определяет режим выделения диапазона.
       * @variant range Режим выделения произвольного диапазона.
       * @variant single Режим выделения одного элемента.
       * @variant disable Режим выбора отключен.
       * @variant quantum Режим выделения квантами, кванты задаются через опцию quantum.
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

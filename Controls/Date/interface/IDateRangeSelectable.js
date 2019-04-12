define('Controls/Date/interface/IDateRangeSelectable', [
   'Core/core-merge',
   'Types/entity',
   'Controls/Date/interface/IRangeSelectable'
], function(coreMerge, entity, IRangeSelectable) {
   'use strict';

   /**
    * @interface Controls/Date/interface/IDateRangeSelectable
    * @public
    */
   var selectionTypes = coreMerge({'quantum': 'quantum'}, IRangeSelectable.SELECTION_TYPES);

   return {
      getDefaultOptions: function() {
         var options =  IRangeSelectable.getDefaultOptions();

         /**
          * @name Controls/Date/interface/IDateRangeSelectable#ranges
          * @cfg {Object} Кванты. Если заданы кванты, то нельзя выделить вроизвольный период, можно только выделить заданные периоды.
          */
         options.ranges = [];

         /**
          * @name Controls/Date/interface/IDateRangeSelectable#selectionType
          * @cfg {String} Определяет режим выделения диапазона
          * @variant 'range' режим выделения произвольного диапазона
          * @variant 'single' режим выделения одного элемента
          * @variant 'disable' режим выбора отключен
          * @variant 'quantum' режим выделения квантами, кванты задаются через опцию quantum
          */

         /**
          * @name Controls/Date/interface/IDateRangeSelectable#minRange
          * @cfg {String} Specifies the range selection mode
          * @variant 'day' selection mode period multiple days
          * @variant 'month' selection mode period multiple months
          */
         options.minRange = 'day';

         return options;
      },

      SELECTION_TYPES: selectionTypes,

      getOptionTypes: function() {
         var optionsTypes = IRangeSelectable.getOptionTypes();
         optionsTypes.selectionType = entity.descriptor(String).oneOf(Object.keys(selectionTypes));
         return optionsTypes;
      }
   };
});

define('Controls/Date/interface/IDateRangeSelectable', [
   'Core/core-merge',
   'WS.Data/Type/descriptor',
   'Controls/Date/interface/IRangeSelectable'
], function(coreMerge, types, IRangeSelectable) {
   'use strict';

   /**
    * mixin Controls/Calendar/interface/IDateRangeSelectable
    */
   var selectionTypes = coreMerge({'quantum': 'quantum'}, IRangeSelectable.SELECTION_TYPES);

   return {
      getDefaultOptions: function() {
         var options =  IRangeSelectable.getDefaultOptions();

         /**
          * @name Controls/Calendar/interface/IDateRangeSelectable#quantum
          * @cfg {Object} Кванты. Если заданы кванты, то нельзя выделить вроизвольный период, можно только выделить заданные периоды.
          */
         options.quantum = [];

         /**
          * @name Controls/Calendar/interface/IDateRangeSelectable#selectionType
          * @cfg {String} Определяет режим выделения диапазано
          * @variant 'range' режим выделения произвольного диапазона
          * @variant 'single' режим выделения одного элемента
          * @variant 'disable' режим выбора отключен
          * @variant 'quantum' режим выделения квантами, кванты задаются через опцию quantum
          */
         return options;
      },

      SELECTION_TYPES: selectionTypes,

      getOptionTypes: function() {
         var optionsTypes = IRangeSelectable.getOptionTypes();
         optionsTypes.selectionType = types(String).oneOf(Object.keys(selectionTypes));
         return optionsTypes;
      }
   };
});

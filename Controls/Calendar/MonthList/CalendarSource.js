define('Controls/Calendar/MonthList/CalendarSource', [
   'Core/Deferred',
   'WS.Data/Source/Base'
], function(Deferred, Base) {
   'use strict';

   /**
    * Источник данных который возвращает данные для построения календарей в списочных контролах.
    * Каждый элемент это год содержащий массив месяцев.
    *
    * @class Controls/Calendar/MonthList/CalendarSource
    * @extends WS.Data/Source/Base
    * @author Миронов А.Ю.
    */
   var CalendarSource = Base.extend({
      _moduleName: 'Controls.Calendar.MonthList.CalendarSource',
      $protected: {
         _dataSetItemsProperty: 'items',
         _dataSetTotalProperty: 'total'
      },

      query: function(query) {
         var
            offset = query.getOffset(),
            limit = query.getLimit() || 1,

            executor = (function() {
               var adapter = this.getAdapter().forTable(),
                  items = [],
                  months//,
                  // weeksArray
               ;

               for (var i = 0; i < limit; i++) {
                  months = [];

                  // weeksArray = [];
                  for (var j = 0; j < 12; j++) {
                     months.push(new Date(offset + i, j, 1));

                     // weeksArray.push(CalendarUtils.getWeeksArray(new Date(offset + i, j, 1)));
                  }
                  items.push({
                     id: offset + i,
                     year: new Date(offset + i, 0),
                     months: months

                     // weeksArray: weeksArray,
                  });
               }

               this._each(
                  items,
                  function(item) {
                     adapter.add(item);
                  }
               );
               items = this._prepareQueryResult(
                  {items: adapter.getData(), total: true}
               );

               return items;
            }).bind(this);

         if (this._loadAdditionalDependencies) {
            return this._loadAdditionalDependencies().addCallback(executor);
         } else {
            return Deferred.success(executor());
         }
      }
   });

   return CalendarSource;
});

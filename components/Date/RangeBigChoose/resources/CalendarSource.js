define('SBIS3.CONTROLS/Date/RangeBigChoose/resources/CalendarSource', [
   "Core/constants",
   "Core/Deferred",
   "WS.Data/Source/Base"
], function (constants, Deferred, Base) {
   'use strict';

   var _defaultOffset = 1000000, cConst = constants; //константы нужны для работы дат, не уверен что можно отключать из зависимостей  (стан ругается)

   /**
    * @class SBIS3.CONTROLS.DateRangeBigChoose.CalendarSource
    * @extends WS.Data/Source/Base
    * @author Миронов Александр Юрьевич
    */
   var CalendarSource = Base.extend(/** @lends SBIS3.CONTROLS.DateRangeBigChoose.CalendarSource.prototype */{
      _moduleName: 'SBIS3.CONTROLS.DateRangeBigChoose.CalendarSource',
      $protected: {
         _dataSetItemsProperty: 'items',
         _dataSetTotalProperty: 'total'
      },

      query: function (query) {
         var
            offset = query.getOffset(),
            limit = query.getLimit() || 1,

            executor = (function() {
               var adapter = this.getAdapter().forTable(),
                  now = (new Date()).getFullYear(),
                  items = [],
                  months;

               for (var i = 0; i < limit; i++) {
                  months = [];
                  for (var j = 0; j < 12; j++) {
                     months.push(new Date(offset + i, j, 1));
                  }
                  items.push({
                     id: offset + i,
                     year: new Date(offset + i),
                     months: months,
                     yearStructure: [
                        {
                           name: 'I',
                           quarters: [
                              {name: 'I', months: months.slice(0, 3)},
                              {name: 'II', months: months.slice(3, 6)}
                           ]
                        },
                        {
                           name: 'II',
                           quarters: [
                              {name: 'III', months: months.slice(6, 9)},
                              {name: 'IV', months: months.slice(9)}
                           ]
                        }
                     ]
                  })
               }

               this._each(
                  items,
                  function(item) {
                     adapter.add(item);
                  }
               );
               items = this._prepareQueryResult(
                  {items: adapter.getData(), total: {before: true, after: true}}
               );

               return items;
            }).bind(this);

         if (this._loadAdditionalDependencies) {
            return this._loadAdditionalDependencies().addCallback(executor);
         } else {
            return Deferred.success(executor());
         }
      }
      //region Public methods
      //endregion Public methods

      //region Protected methods

      //endregion Protected methods
   });
   CalendarSource.defaultOffset = _defaultOffset;
   return CalendarSource;
});

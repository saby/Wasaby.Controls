define('Controls-demo/Date/MonthListSource', [
   'Core/Deferred',
   'WS.Data/Source/Base',
   'Controls/Utils/Date'
], function(Deferred, Base, dateUtils) {
   'use strict';

   var CalendarSource = Base.extend({
      _moduleName: 'ControlsDemo.Date.MonthListSource',
      $protected: {
         _dataSetItemsProperty: 'items',
         _dataSetTotalProperty: 'total'
      },

      _$idProperty: 'id',

      // call: function(methodName, params) {
      //    var def = new Deferred()
      // },

      query: function(query) {
         var
            offset = query.getOffset(),
            where = query.getWhere(),
            limit = query.getLimit() || 1,
            executor;

         executor = (function() {
            var adapter = this.getAdapter().forTable(),
               items = [],
               yearEqual = where['id~'],
               yearGt = where['id>='],
               yearLt = where['id<='],
               year = yearEqual || yearGt || yearLt,
               extData,
               days,
               daysInMonth,
               deferred = new Deferred()
               // weeksArray
            ;

            if (dateUtils.isValidDate(year)) {
               year = year.getFullYear();
            } else if (!year) {
               year = 1900;
            }

            year += offset;

            if (yearLt) {
               year -= limit;
            } else if (yearGt) {
               year += 1;
            }

            for (var i = 0; i < limit; i++) {
               extData = [];
               for (var j = 0; j < 12; j++) {
                  days = [];
                  daysInMonth = dateUtils.getDaysInMonth(new Date(year + i, j, 1));
                  for (var d = 0; d < daysInMonth; d++) {
                     days.push({ isEven: d % 2 });
                  }
                  extData.push(days);
               }
               items.push({
                  id: year + i,
                  extData: extData
               });
            }

            this._each(
               items,
               function(item) {
                  adapter.add(item);
               }
            );
            items = this._prepareQueryResult({
               items: adapter.getData(),
               total: yearEqual ? { before: true, after: true } : true
            });

            setTimeout(function() {
               deferred.callback(items);
            }, 1000);

            return deferred;
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

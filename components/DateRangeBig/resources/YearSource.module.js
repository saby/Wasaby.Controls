define('js!SBIS3.CONTROLS.DateRangeBig.MonthRangePicker.YearSource', [
   'js!SBIS3.CONTROLS.Data.Source.Base',
], function (Base) {
   'use strict';

   var _startingOffset = 1000000;

   var YearSource = Base.extend(/** @lends SBIS3.CONTROLS.DateRangeBig.DateRangePicker.MonthsStartCurrentYearSource.prototype */{
      _moduleName: 'SBIS3.CONTROLS.DateRangeBig.MonthRangePicker.YearSource',

      query: function (query) {
         var adapter = this.getAdapter().forTable(),
            offset = query.getOffset(),
            limit = query.getLimit() || 1,
            end = offset + limit,
            now = new Date(),
            items = [];

         offset = offset - _startingOffset;

         for (var i = 0; i < limit; i++) {
            items.push({id: i, month: new Date(now.getFullYear(), offset + i, 1)})
         }

         this._each(
            items,
            function(item) {
               adapter.add(item);
            }
         );
         items = this._prepareQueryResult(
            {items: adapter.getData(), total: 1000000000000},
            'items', 'total'
         );
         return $ws.proto.Deferred.success(items);
      },
      //region Public methods
      //endregion Public methods

      //region Protected methods

      //endregion Protected methods
   });

   YearSource.defaultOffset = _startingOffset;

   return YearSource;
});

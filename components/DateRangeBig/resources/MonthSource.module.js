define('js!SBIS3.CONTROLS.DateRangeBig.DateRangePicker.MonthSource', [
   'js!SBIS3.CONTROLS.Data.Source.Base',
], function (Base) {
   'use strict';

   var _startingOffset = 1000000;

   var MonthSource = Base.extend(/** @lends SBIS3.CONTROLS.DateRangeBig.DateRangePicker.MonthSource.prototype */{
      _moduleName: 'SBIS3.CONTROLS.DateRangeBig.DateRangePicker.MonthSource',


      query: function (query) {
         // throw new Error('Method must be implemented');
         var adapter = this.getAdapter().forTable(),
            offset = query.getOffset(),
            limit = query.getLimit() || 1,
            end = offset + limit,
            now = new Date(),
            items = [];
         offset = offset - _startingOffset;

         for (var i = 0; i < limit; i++) {
            items.push({id: i, date: new Date(now.getFullYear(), offset + i, 1)});
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

   MonthSource.defaultOffset = _startingOffset;

   return MonthSource;
});

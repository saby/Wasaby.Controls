import Deferred = require('Core/Deferred');
import {Memory} from 'Types/source';
import dateUtils = require('Controls/Utils/Date');

/**
 * Источник данных который возвращает данные для построения календарей в списочных контролах.
 * Каждый элемент это год содержащий массив месяцев.
 *
 * @class Controls/_calendar/MonthList/CalendarSource
 * @extends Types/source:Base
 * @author Миронов А.Ю.
 */
var CalendarSource = Memory.extend({
    _moduleName: 'Controls._calendar.MonthList.CalendarSource',
    $protected: {
        _dataSetItemsProperty: 'items',
        _dataSetMetaProperty: 'meta'
    },

    _$idProperty: 'id',

    query: function (query) {
        var
            offset = query.getOffset(),
            where = query.getWhere(),
            limit = query.getLimit() || 1,
            executor;

        executor = (function () {
            var adapter = this.getAdapter().forTable(),
                items = [],
                yearEqual = where['id~'],
                yearGt = where['id>='],
                yearLt = where['id<='],
                year = yearEqual || yearGt || yearLt,
                months//,
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
                months = [];

                // weeksArray = [];
                for (var j = 0; j < 12; j++) {
                    months.push(new Date(year + i, j, 1));

                    // weeksArray.push(CalendarUtils.getWeeksArray(new Date(year + i, j, 1)));
                }
                items.push({
                    id: year + i,
                    year: new Date(year + i, 0),
                    months: months

                    // weeksArray: weeksArray,
                });
            }

            this._each(
                items,
                function (item) {
                    adapter.add(item);
                }
            );
            items = this._prepareQueryResult({
                items: adapter.getData(),
                meta: {total: yearEqual ? {before: true, after: true} : true}
            });

            return items;
        }).bind(this);

        if (this._loadAdditionalDependencies) {
            return this._loadAdditionalDependencies().addCallback(executor);
        } else {
            return Deferred.success(executor());
        }
    }
});

export default CalendarSource;

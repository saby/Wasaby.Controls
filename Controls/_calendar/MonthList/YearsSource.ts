import Deferred = require('Core/Deferred');
import {Memory} from 'Types/source';
import dateUtils = require('Controls/Utils/Date');
import monthListUtils from './Utils';

/**
 * Источник данных который возвращает данные для построения календарей в списочных контролах.
 * Каждый элемент это год содержащий массив месяцев.
 *
 * @class Controls/_calendar/MonthList/YearsSource
 * @extends Types/source:Base
 * @author Миронов А.Ю.
 */
var YearsSource = Memory.extend({
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
            } else if (typeof year === 'string') {
                year = monthListUtils.idToDate(year).getFullYear();
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
                for (var j = 0; j < 12; j++) {
                    months.push(new Date(year + i, j, 1));
                }
                items.push({
                    id: monthListUtils.dateToId(new Date(year + i, 0)),
                    date: new Date(year + i, 0)
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

export default YearsSource;

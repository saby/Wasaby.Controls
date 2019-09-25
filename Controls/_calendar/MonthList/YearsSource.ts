import Deferred = require('Core/Deferred');
import {Memory, Query} from 'Types/source';
import dateUtils = require('Controls/Utils/Date');
import monthListUtils from './Utils';
import ITEM_TYPES from './ItemTypes';

/**
 * Источник данных который возвращает данные для построения календарей в списочных контролах.
 * Каждый элемент это год содержащий массив месяцев.
 *
 * @class Controls/_calendar/MonthList/YearsSource
 * @extends Types/source:Base
 * @author Красильников А.С.
 */

export default class YearsSource extends Memory {
    _moduleName: 'Controls._calendar.MonthList.CalendarSource';

    $protected: {
        _dataSetItemsProperty: 'items',
        _dataSetMetaProperty: 'meta'
    };

    _$keyProperty: 'id';

    _header: boolean = false;

    constructor(options) {
        super(options);
        this._header = options.header;
    }

    query(query: Query) {
        var
            offset = query.getOffset(),
            where = query.getWhere(),
            limit = query.getLimit() || 1,
            executor;

        executor = (() => {
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

            for (let i = 0; i < limit; i++) {
                let date = new Date(year + i, 0);
                items.push({
                    id: monthListUtils.dateToId(date),
                    date,
                    type: ITEM_TYPES.body
                });
                date = new Date(year + i + 1, 0);
                if (this._header) {
                    items.push({
                        id: 'h' + monthListUtils.dateToId(date),
                        date,
                        type: ITEM_TYPES.header
                    });
                }
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
        });

        if (this._loadAdditionalDependencies) {
            return this._loadAdditionalDependencies().addCallback(executor);
        } else {
            return Deferred.success(executor());
        }
    }
}

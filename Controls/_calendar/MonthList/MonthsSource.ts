import Deferred = require('Core/Deferred');
import { Memory, Query, DataSet } from 'Types/source';
import { date as formatDate } from 'Types/formatter';
import monthListUtils from './Utils';
import dateUtils = require('Controls/Utils/Date');
// import Query from "Types/source/Query";
// import DataSet from "../../../application/Types/_source/DataSet";

/**
 * Источник данных который возвращает данные для построения календарей в списочных контролах.
 * Каждый элемент это месяц.
 *
 * @class Controls/_calendar/MonthList/MonthSource
 * @extends Types/source:Base
 * @author Красильников А.С.
 */

export default class MonthsSource extends Memory {
    _moduleName: 'Controls._calendar.MonthList.MonthsSource';

    $protected: {
        _dataSetItemsProperty: 'items',
        _dataSetMetaProperty: 'meta'
    };

    _$idProperty: 'id';

    query(query: Query)/*: ExtendPromise<DataSet>*/ {
        let
            offset = query.getOffset(),
            where = query.getWhere(),
            limit = query.getLimit() || 1,
            executor;

        executor = (function() {
            let
                adapter = this.getAdapter().forTable(),
                items = [],
                monthEqual = where['id~'],
                monthGt = where['id>='],
                monthLt = where['id<='],
                month = monthEqual || monthGt || monthLt
            ;

            month = monthListUtils.idToDate(month);

            month.setMonth(month.getMonth() + offset);

            if (monthLt) {
                month.setMonth(month.getMonth() - limit);
            } else if (monthGt) {
                month.setMonth(month.getMonth() + 1);
            }

            for (let i = 0; i < limit; i++) {
                items.push({
                    id: monthListUtils.dateToId(month),
                    date: month
                });
                month = new Date(month);
                month.setMonth(month.getMonth() + 1);
            }

            this._each(
                items,
                function (item) {
                    adapter.add(item);
                }
            );
            items = this._prepareQueryResult({
                items: adapter.getData(),
                meta: {total: monthEqual ? {before: true, after: true} : true}
            });

            return items;
        }).bind(this);

        if (this._loadAdditionalDependencies) {
            return this._loadAdditionalDependencies().addCallback(executor);
        } else {
            return Deferred.success(executor());
        }
    }
}

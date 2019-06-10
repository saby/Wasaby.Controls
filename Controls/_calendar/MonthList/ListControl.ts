import {factory} from 'Types/chain';
import {RecordSet} from 'Types/collection';
import {Query} from 'Types/source';
import {ListControl} from 'Controls/list';
import tmpl = require('wml!Controls/_calendar/MonthList/ListControl');
import monthListUtils from './Utils';
import baseControlTmpl = require('wml!Controls/_list/ListControl/ListControl');

/**
 * Plain list control with custom item template. Can load data from data source and and can enrich data from .
 *
 * @class Controls/_calendar/MonthList/ListControl
 * @extends Controls/List
 * @control
 * @author Миронов А.Ю.
 */

const MONTHS_IN_YEAR = 12;

var _private = {
    getQuery: function (items, viewMode) {
        var length = factory(items).toArray().length,
            startId = monthListUtils.idToDate(items.at(0).getId()),
            endId = monthListUtils.idToDate(items.at(length - 1).getId()),
            qDate = startId < endId ? startId : endId,
            query = new Query();

        if (viewMode === 'year') {
            length *= MONTHS_IN_YEAR;
        }

        qDate.setMonth(qDate.getMonth() - 1);

        return query.where({'id>=': monthListUtils.dateToId(qDate)}).limit(length);
    },

    dataLoadCallback: function (self, items) {
        if (self._options.sourceExt) {
            self._options.sourceExt.query(_private.getQuery(items, self._options.viewMode))
                .addCallback(function(richItems) {
                    const richData = _private.getDataForEnrich(richItems.getAll(), self._options.viewMode);
                    self._children.baseControl.getViewModel().mergeItems(richData, {inject: true});
                });
        }
    },

    getDataForEnrich: function(richItems, viewMode) {
        let
            extData = {};
        if (viewMode === 'year') {
            factory(richItems).each(function(item, index) {
                let year = item.getId().split("-")[0];
                if (!extData[year]) {
                    extData[year] = [item.get('extData')];
                } else {
                    extData[year].push(item.get('extData'));
                }
            });
            richItems = new RecordSet({
                rawData: Object.keys(extData).map(function(key) {
                    const year = new Date(key, 0);
                    return { id: monthListUtils.dateToId(year), date: year, extData: extData[key]};
                })
            });
        } else {
            factory(richItems).each(function(item, index) {
                item.set('date', monthListUtils.idToDate(item.getId()));
            });
        }
        return richItems;
    }
};

var ModuleControl = ListControl.extend(/** @lends Controls/_calendar/MonthList/List.prototype */{
    _template: tmpl,
    _baseControlTmpl: baseControlTmpl,

    _beforeMount: function () {
        this._dataLoadCallback = _private.dataLoadCallback.bind(null, this);
        ModuleControl.superclass._beforeMount.apply(this, arguments);
    }
});

ModuleControl._private = _private;

export default ModuleControl;

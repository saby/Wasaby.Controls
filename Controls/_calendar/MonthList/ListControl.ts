import {factory} from 'Types/chain';
import {Query} from 'Types/source';
import {ListControl} from 'Controls/list';
import tmpl = require('wml!Controls/_calendar/MonthList/ListControl');
import baseControlTmpl = require('wml!Controls/List/ListControl/ListControl');

/**
 * Plain list control with custom item template. Can load data from data source and and can enrich data from .
 *
 * @class Controls/_calendar/MonthList/ListControl
 * @extends Controls/List
 * @control
 * @author Миронов А.Ю.
 */

var _private = {
    getQuery: function (items) {
        var length = factory(items).toArray().length,
            startId = items.at(0).getId(),
            endId = items.at(length - 1).getId(),
            query = new Query();

        return query.where({'id>=': (startId < endId ? startId : endId) - 1}).limit(length);
    },

    dataLoadCallback: function (self, items) {
        if (self._options.sourceExt) {
            self._options.sourceExt.query(_private.getQuery(items)).addCallback(function (richItems) {
                this._children.baseControl.getViewModel().mergeItems(richItems.getAll(), {inject: true});
            }.bind(self));
        }
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

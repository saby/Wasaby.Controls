import Control = require('Core/Control');
import ListControlTpl = require('wml!Controls/_lists/ListControl/ListControl');
import Deferred = require('Core/Deferred');

/**
 * Plain list control with custom item template. Can load data from data source.
 *
 * @class Controls/_lists/ListControl
 * @extends Controls/_lists/BaseControl
 * @mixes Controls/interface/ISource
 * @mixes Controls/interface/IItemTemplate
 * @mixes Controls/interface/IPromisedSelectable
 * @mixes Controls/interface/IGrouped
 * @mixes Controls/interface/INavigation
 * @mixes Controls/interface/IFilter
 * @mixes Controls/interface/IHighlighter
 * @mixes Controls/_lists/interface/IList
 * @mixes Controls/interface/IEditableList
 * @control
 * @public
 * @author Авраменко А.С.
 * @category List
 */

var ListControl = Control.extend(/** @lends Controls/_lists/ListControl.prototype */{
    _template: ListControlTpl,
    reload: function () {
        return this._children.baseControl.reload();
    },
    beginEdit: function (options) {
        return this._options.readOnly ? Deferred.fail() : this._children.baseControl.beginEdit(options);
    },
    beginAdd: function (options) {
        return this._options.readOnly ? Deferred.fail() : this._children.baseControl.beginAdd(options);
    },

    cancelEdit: function () {
        return this._options.readOnly ? Deferred.fail() : this._children.baseControl.cancelEdit();
    },

    commitEdit: function () {
        return this._options.readOnly ? Deferred.fail() : this._children.baseControl.commitEdit();
    },

    reloadItem: function():Deferred {
        let baseControl = this._children.baseControl;
        return baseControl.reloadItem.apply(baseControl, arguments);
    }
});

ListControl.getDefaultOptions = function () {
    return {
        uniqueKeys: true
    };
};

export = ListControl;

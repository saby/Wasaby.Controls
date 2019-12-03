import Control = require('Core/Control');
import ListControlTpl = require('wml!Controls/_list/ListControl/ListControl');
import PropStorageUtil = require('Controls/_list/resources/utils/PropStorageUtil');
import Deferred = require('Core/Deferred');
import {isEqual} from 'Types/object';

/**
 * Plain list control with custom item template. Can load data from data source.
 *
 * @class Controls/_list/ListControl
 * @extends Controls/_list/BaseControl
 * @mixes Controls/_interface/ISource
 * @mixes Controls/interface/IItemTemplate
 * @mixes Controls/interface/IPromisedSelectable
 * @mixes Controls/interface/IGroupedList
 * @mixes Controls/interface/INavigation
 * @mixes Controls/_interface/IFilter
 * @mixes Controls/interface/IHighlighter
 * @mixes Controls/_list/interface/IList
 * @mixes Controls/_interface/ISorting
 * @mixes Controls/interface/IEditableList
 * @control
 * @private
 * @author Авраменко А.С.
 * @category List
 */

var ListControl = Control.extend(/** @lends Controls/_list/ListControl.prototype */{
    _template: ListControlTpl,
    _sorting: null,
    _beforeMount(cfg) {
        return PropStorageUtil.loadSavedConfig(cfg.propStorageId, ['sorting']).addCallback((loadedCfg) => {
            if (loadedCfg && loadedCfg.sorting) {
                this._sorting = loadedCfg.sorting;
            }
        });
    },
    _afterMount() {
        if (this._sorting && !isEqual(this._sorting, this._options.sorting)) {
            this._notify('sortingChanged', [this._sorting]);
            this._sorting = null;
        }
    },
    _beforeUpdate(cfg) {
        if (!isEqual(cfg.sorting, this._options.sorting)) {
            PropStorageUtil.saveConfig(cfg.propStorageId, ['sorting'], cfg);
        }
    },
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
    },

    scrollToItem(key: string|number, toBottom: boolean): void {
        this._children.baseControl.scrollToItem(key, toBottom);
    },
});

ListControl.getDefaultOptions = function () {
    return {
        uniqueKeys: true
    };
};

export = ListControl;

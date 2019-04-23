/**
 * Created by kraynovdo on 31.01.2018.
 */
import Control = require('Core/Control');
import ListControlTpl = require('wml!Controls/_list/List');
import ListViewModel = require('Controls/_list/ListViewModel');
import Deferred = require('Core/Deferred');
import tmplNotify = require('Controls/Utils/tmplNotify');
import viewName = require('Controls/_list/ListView');
import viewTemplate = require('Controls/_list/ListControl');

/**
 * Plain list with custom item template. Can load data from data source.
 *
 * @class Controls/_list/List
 * @extends Core/Control
 * @mixes Controls/interface/ISource
 * @mixes Controls/interface/IItemTemplate
 * @mixes Controls/interface/IPromisedSelectable
 * @mixes Controls/interface/IGrouped
 * @mixes Controls/interface/INavigation
 * @mixes Controls/interface/IFilter
 * @mixes Controls/interface/IHighlighter
 * @mixes Controls/_list/interface/IList
 * @mixes Controls/interface/IEditableList
 * @mixes Controls/_list/interface/IDraggable
 *
 * @mixes Controls/_list/BaseControlStyles
 * @mixes Controls/_list/ListStyles
 * @mixes Controls/_list/ItemActions/ItemActionsStyles
 * @mixes Controls/_list/Swipe/SwipeStyles
 *
 * @mixes Controls/_list/Mover/MoveDialog/Styles
 * @mixes Controls/_paging/PagingStyles
 * @mixes Controls/_list/DigitButtonsStyles
 *
 * @control
 * @author Авраменко А.С.
 * @public
 * @category List
 * @demo Controls-demo/List/List/BasePG
 */

var ListControl = Control.extend(/** @lends Controls/_list/List.prototype */{
    _template: ListControlTpl,
    _viewName: viewName,
    _viewTemplate: viewTemplate,
    _viewModelConstructor: null,

    _beforeMount: function() {
        this._viewModelConstructor = this._getModelConstructor();
    },

    _getModelConstructor: function() {
        return ListViewModel;
    },

    reload: function() {
        return this._children.listControl.reload();
    },

    reloadItem: function():Deferred {
        var listControl = this._children.listControl;
        return listControl.reloadItem.apply(listControl, arguments);
    },

    beginEdit: function(options) {
        return this._options.readOnly ? Deferred.fail() : this._children.listControl.beginEdit(options);
    },

    beginAdd: function(options) {
        return this._options.readOnly ? Deferred.fail() : this._children.listControl.beginAdd(options);
    },

    cancelEdit: function() {
        return this._options.readOnly ? Deferred.fail() : this._children.listControl.cancelEdit();
    },

    commitEdit: function() {
        return this._options.readOnly ? Deferred.fail() : this._children.listControl.commitEdit();
    },

    _notifyHandler: tmplNotify
});

ListControl.getDefaultOptions = function() {
    return {
        multiSelectVisibility: 'hidden',
        style: 'default'
    };
};

export = ListControl;

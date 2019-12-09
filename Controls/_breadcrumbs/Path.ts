import Control = require('Core/Control');
import BreadCrumbsUtil from './Utils';
import FontLoadUtil = require('Controls/Utils/FontLoadUtil');
import tmplNotify = require('Controls/Utils/tmplNotify');
import template = require('wml!Controls/_breadcrumbs/Path/Path');

/**
 * Хлебные крошки.
 * <a href="/materials/demo-ws4-breadcrumbs">Демо-пример</a>.
 *
 * @class Controls/_breadcrumbs/Path
 * @extends Core/Control
 * @mixes Controls/interface/IBreadCrumbs
 * @mixes Controls/_breadcrumbs/BreadCrumbsStyles
 * @control
 * @public
 * @author Авраменко А.С.
 * @demo Controls-demo/BreadCrumbs/BreadCrumbsPG
 */

/*
 * Breadcrumbs.
 * <a href="/materials/demo-ws4-breadcrumbs">Demo</a>.
 *
 * @class Controls/_breadcrumbs/Path
 * @extends Core/Control
 * @mixes Controls/interface/IBreadCrumbs
 * @mixes Controls/_breadcrumbs/BreadCrumbsStyles
 * @control
 * @public
 * @author Авраменко А.С.
 * @demo Controls-demo/BreadCrumbs/BreadCrumbsPG
 */

var BreadCrumbs = Control.extend({
    _template: template,
    _visibleItems: [],
    _oldWidth: 0,
    _viewUpdated: false,

    _afterMount: function () {
        this._notify('register', ['controlResize', this, this._onResize], {bubbling: true});
        if (this._options.items && this._options.items.length > 0) {
            this._oldWidth = this._container.clientWidth;
            FontLoadUtil.waitForFontLoad('controls-BreadCrumbsView__crumbMeasurer').addCallback(function () {
                BreadCrumbsUtil.calculateBreadCrumbsToDraw(this, this._options.items, this._oldWidth);
                this._forceUpdate();
            }.bind(this));
        }
    },

    _beforeUpdate: function (newOptions) {
        this._redrawIfNeed(this._options.items, newOptions.items);
    },
    _redrawIfNeed: function(currentItems, newItems) {
        if (BreadCrumbsUtil.shouldRedraw(currentItems, newItems, this._oldWidth, this._container.clientWidth)) {
            this._oldWidth = this._container.clientWidth;
            BreadCrumbsUtil.calculateBreadCrumbsToDraw(this, newItems, this._container.clientWidth);
            this._viewUpdated = true;
        }
    }

    _afterUpdate: function() {
        if (this._viewUpdated) {
            this._viewUpdated = false;
            this._notify('controlResize', [], {bubbling: true});
        }
    }
    _notifyHandler: tmplNotify,
    _itemClickHandler: function(e, item) {
        e.stopPropagation();
        this._notify('itemClick', [item])
    },
    _onResize: function() {
        this._redrawIfNeed(this._options.items, this._options.items);
    },

   _beforeUnmount: function() {
      this._notify('unregister', ['controlResize', this], { bubbling: true });
   }
});

BreadCrumbs.getDefaultOptions = function () {
    return {
        displayProperty: 'title'
    };
};

export default BreadCrumbs;

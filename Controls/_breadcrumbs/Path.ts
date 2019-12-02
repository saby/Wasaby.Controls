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
 * @private
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
 * @private
 * @author Авраменко А.С.
 * @demo Controls-demo/BreadCrumbs/BreadCrumbsPG
 */

var BreadCrumbs = Control.extend({
    _template: template,
    _visibleItems: [],
    _viewUpdated: false,

    _afterMount: function () {
        if (this._options.items && this._options.items.length > 0) {
            FontLoadUtil.waitForFontLoad('controls-BreadCrumbsView__crumbMeasurer').addCallback(function () {
                BreadCrumbsUtil.drawBreadCrumbs(this, this._options.items);
            }.bind(this));
        }
    },
    _beforeUpdate: function (newOptions) {
        this._redrawIfNeed(this._options.items, newOptions.items);
    },
    _redrawIfNeed: function(currentItems, newItems) {
        if (BreadCrumbsUtil.shouldRedraw(currentItems, newItems)) {
            BreadCrumbsUtil.drawBreadCrumbs(this, newItems);
            this._viewUpdated = true;
        }
    },

    _afterUpdate: function() {
        if (this._viewUpdated) {
            this._viewUpdated = false;
        }
    },


    _notifyHandler: tmplNotify

});

BreadCrumbs.getDefaultOptions = function () {
    return {
        displayProperty: 'title'
    };
};

export default BreadCrumbs;

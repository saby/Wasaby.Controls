import Control = require('Core/Control');
import BreadCrumbsUtil from './Utils';
import FontLoadUtil = require('Controls/Utils/FontLoadUtil');
import tmplNotify = require('Controls/Utils/tmplNotify');
import template = require('wml!Controls/_breadCrumbs/Path/Path');

/**
 * Breadcrumbs.
 *
 * @class Controls/BreadCrumbs
 * @extends Core/Control
 * @mixes Controls/interface/IBreadCrumbs
 * @mixes Controls/_breadCrumbs/BreadCrumbsStyles
 * @control
 * @public
 * @author Зайцев А.С.
 * @demo Controls-demo/BreadCrumbs/BreadCrumbsPG
 */

var BreadCrumbs = Control.extend({
    _template: template,
    _visibleItems: [],
    _oldWidth: 0,

    _afterMount: function () {
        if (this._options.items && this._options.items.length > 0) {
            this._oldWidth = this._container.clientWidth;
            FontLoadUtil.waitForFontLoad('controls-BreadCrumbsView__crumbMeasurer').addCallback(function () {
                BreadCrumbsUtil.calculateBreadCrumbsToDraw(this, this._options.items, this._oldWidth);
                this._forceUpdate();
            }.bind(this));
        }
    },

    _beforeUpdate: function (newOptions) {
        if (BreadCrumbsUtil.shouldRedraw(this._options.items, newOptions.items, this._oldWidth, this._container.clientWidth)) {
            this._oldWidth = this._container.clientWidth;
            BreadCrumbsUtil.calculateBreadCrumbsToDraw(this, newOptions.items, this._container.clientWidth);
        }
    },

    _notifyHandler: tmplNotify,

    _onResize: function () {
        //Пустой обработчик чисто ради того, чтобы при ресайзе запускалась перерисовка
    }
});

BreadCrumbs.getDefaultOptions = function () {
    return {
        displayProperty: 'title'
    };
};

export default BreadCrumbs;

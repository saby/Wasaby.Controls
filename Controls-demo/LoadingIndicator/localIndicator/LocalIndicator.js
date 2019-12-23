define('Controls-demo/LoadingIndicator/localIndicator/LocalIndicator', [
    'Core/Control',
    'wml!Controls-demo/LoadingIndicator/localIndicator/LocalIndicator',
    'css!Controls-demo/LoadingIndicator/IndicatorContainer'
], function(Control, tmpl) {
    'use strict';

    var module = Control.extend({
        _template: tmpl,
        _afterMount: function() {
            this._children.OverlayLocalIndicator.show({});
        }
    });

    return module;
});

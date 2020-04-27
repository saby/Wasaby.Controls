define('Controls-demo/Input/Date/RangeLinkView', [
    'Core/Control',
    'wml!Controls-demo/Input/Date/RangeLinkView',
    'css!Controls-demo/Controls-demo'
], function(
    BaseControl,
    template
) {
    'use strict';

    var ModuleClass = BaseControl.extend({
        _template: template,
        _startValue: new Date(2018, 0, 1),
        _endValue: new Date(2018, 0, 31),
        _theme: ['Controls/Classes'],
        _captionFormatter: function() {
            return 'Custom range format';
        }
    });
    return ModuleClass;
});

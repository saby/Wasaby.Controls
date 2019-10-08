define('Controls-demo/InfoBox/InfoboxButtonHelp',
    [
        'Core/Control',
        'wml!Controls-demo/InfoBox/InfoboxButtonHelp',
        'css!Controls-demo/InfoBox/resources/InfoboxButtonHelp',
        'Controls/popup'
    ],
    function(Control, template) {

        'use strict';

        return Control.extend({
            _template: template,
        });
    }
);


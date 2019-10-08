define('Controls-demo/InfoBox/InfoboxButton',
    [
        'Core/Control',
        'wml!Controls-demo/InfoBox/InfoboxButton'
    ],
    function(Control, template) {

        'use strict';

        return Control.extend({
            _template: template,
            size: "s"

        });
    }
);



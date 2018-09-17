define('Controls-demo/Input/Suggest/resources/SuggestTemplate', [
    'Core/Control',
    'wml!Controls-demo/Input/Suggest/resources/SuggestTemplate',
    'wml!Controls-demo/Input/Suggest/resources/CustomTemplate',
    'Controls/List'
], function(Control, template, custom) {

    'use strict';

    return Control.extend({
        _template: template,
        _custom: custom,
        _gl: true
    });

});
define('Controls-demo/Input/Suggest/resources/SuggestTemplate', [
    'Core/Control',
    'tmpl!Controls-demo/Input/Suggest/resources/SuggestTemplate',
    'tmpl!Controls-demo/Input/Suggest/resources/CustomTemplate',
    'Controls/List'
], function(Control, template, custom) {

    'use strict';

    return Control.extend({
        _template: template,
        _custom: custom,
        _gl: true
    });

});
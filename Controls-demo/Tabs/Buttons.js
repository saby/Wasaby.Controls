
define('Controls-demo/Tabs/Buttons', [
    'Core/Control',
    'tmpl!Controls-demo/Tabs/Buttons/Buttons',
    'tmpl!Controls-demo/Tabs/Buttons/resources/spaceTemplate',
    'tmpl!Controls-demo/Tabs/Buttons/resources/itemTemplate',
    'tmpl!Controls-demo/Tabs/Buttons/resources/mainTemplate',
    'SBIS3.CONTROLS/TextBox',
    'SBIS3.CONTROLS/Date/Range',
    'WS.Data/Source/Memory',
    'css!Controls-demo/Tabs/Buttons/Buttons'
], function (Control,
             template,
             spaceTemplate,
             itemTemplate,
             mainTemplate,
             TextBox,
             DateRange,
             MemorySource,
             cssButtons
) {
    'use strict';

    var TabButtons = Control.extend(
        {
            _template: template,
            _spaceTemplate: spaceTemplate,
            _itemTemplate: itemTemplate,
            _mainTemplate: mainTemplate,
            _selectedKey: 1

        });
    return TabButtons;
});
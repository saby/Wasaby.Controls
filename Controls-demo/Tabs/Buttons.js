
define('Controls-demo/Tabs/Buttons', [
    'Core/Control',
    'tmpl!Controls-demo/Tabs/Buttons/Buttons',
    'tmpl!Controls-demo/Tabs/Buttons/resources/spaceTemplate',
    'tmpl!Controls-demo/Tabs/Buttons/resources/itemTemplate',
    'tmpl!Controls-demo/Tabs/Buttons/resources/mainTemplate',
    'tmpl!Controls-demo/Tabs/Buttons/resources/photoContent',
    'SBIS3.CONTROLS/TextBox',
    'SBIS3.CONTROLS/Date/Range',
    'WS.Data/Source/Memory',
    'css!Controls-demo/Tabs/Buttons/Buttons'
], function (Control,
             template,
             spaceTemplate,
             itemTemplate,
             mainTemplate,
             photoContent,
             TextBox,
             DateRange,
             MemorySource,
             cssButtons
) {
    'use strict';
    var srcData = [
        {
            id: "1",
            title: 'So long folder name that it will not fit into the maximum size So long folder name that it will not fit into the maximum size'
        },
        {
            id: "2",
            title: 'Notebooks 2',
            align: "left"
        },
        {
            id: "3",
            title: 'Smartphones 3 '
        }
    ];

    var TabButtonsDemo = Control.extend({
            SelectedKey1: "1",
            SelectedKey2: "2",
            SelectedKey3: "4",
            SelectedKey4: "2",
            SelectedKey5: "2",
            SelectedKey6: "1",
            SelectedKey7: "3",
            _template: template,
            _spaceTemplate: spaceTemplate,
            _itemTemplate: itemTemplate,
            _mainTemplate: mainTemplate,
           _photoContent: photoContent,
            _setSource: function() {
                this._lazySource = new MemorySource({
                    idProperty: 'id',
                    data: srcData
                })
            }
        });
    return TabButtonsDemo;
});
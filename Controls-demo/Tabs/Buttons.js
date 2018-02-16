
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
            content: 'Настолько длинное название папки что оно не влезет в максимальный размер 1 Настолько длинное название папки что оно не влезет в максимальный размер'
        },
        {
            id: "2",
            content: 'Notebooks 2',
            align: "left"
        },
        {
            id: "3",
            content: 'Smartphones 3 '
        }
    ];

    var TabButtonsDemo = Control.extend({
            SelectedKey1: "1",
            SelectedKey2: "2",
            SelectedKey3: "4",
            SelectedKey4: "2",
            SelectedKey5: "2",
            SelectedKey6: "1",
            SelectedKey7: "1",
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
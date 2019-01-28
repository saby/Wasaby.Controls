define('Controls-demo/List/Grid/MultiselectPG',
    [
        'Core/Control',
        'WS.Data/Source/Memory',
        'Controls-demo/List/Grid/resources/DataDemoPG',
        'tmpl!Controls-demo/PropertyGrid/DemoPG',
        'json!Controls-demo/List/Grid/resources/MultiselectPG/cfg',
        'wml!Controls-demo/List/Grid/resources/DemoMoney',
        'wml!Controls-demo/List/Grid/resources/DemoRating',
        'css!Controls-demo/Filter/Button/PanelVDom',
        'css!Controls-demo/Input/resources/VdomInputs',
        'css!Controls-demo/Wrapper/Wrapper'
    ],

    function(Control, MemorySource, data, template, config) {
        'use strict';
        var Component = Control.extend({
            _template: template,
            _metaData: null,
            _content: 'Controls/Grid',
            _dataObject: {},
            _componentOptions: null,

            _beforeMount: function() {

               this._componentOptions = {
                  keyProperty: 'id',
                  name: 'MultiSelectGridPG',
                  markedKey: '4',
                  columns: data.partialColumns,
                  header: data.partialHeader,
                  source: new MemorySource({
                     idProperty: 'id',
                     data: data.catalog
                  }),
                  displayProperty: 'title',
                  selectedKeys: [],
                  excludedKeys: [],
                  multiSelectVisibility: 'visible'
               };


                this._metaData = config[this._content].properties['ws-config'].options;
            }
        });
        return Component;
    });

define('Controls-demo/List/Grid/WI/MultyHeader', [
    'Core/Control',
    'Controls-demo/List/Grid/GridData',
    'wml!Controls-demo/List/Grid/WI/resources/MultyHeader',
    'Types/source',
    'wml!Controls-demo/List/Grid/DemoItem',
    'css!Controls-demo/List/Grid/Grid',

], function(BaseControl, GridData, template, source) {
    'use strict';
    var
        partialColumns = [
            {
                displayProperty: 'name',
                width: '1fr',
            },
            {
                displayProperty: 'price',
                width: 'auto',
                align: 'right',
            }
        ],
        fullColumns = [
            {
                displayProperty: 'name',
                width: '1fr',
            },
            {
                displayProperty: 'price',
                width: 'auto',
                align: 'right',
            },
            {
                displayProperty: 'balance',
                width: 'auto',
                align: 'right',
            },
            {
                displayProperty: 'reserve',
                width: 'auto',
                align: 'right'
            },
            {
                displayProperty: 'costPrice',
                width: 'auto',
                align: 'right',
            },
            {
                displayProperty: 'balanceCostSumm',
                width: 'auto',
                align: 'right',
            }
        ],
        partialHeader = [
            {
                title: ''
            },
            {
                title: 'Цена',
                align: 'right'
            }
        ],
        fullHeader = [
            {
                title: 'Наименование',
                startColumn:   1,
                endColumn:     2,
                startRow:      1,
                endRow:        4,
                align: 'center'
            },
            {
                title: 'Общие',
                startColumn:   2,
                endColumn:     7,
                startRow:      1,
                endRow:        2,
                align: 'center'
            },
            {
                title: 'Цена',
                startColumn:   2,
                endColumn:     3,
                startRow:      3,
                endRow:        4,
                align: 'right'
            },
            {
                title: 'Остаток',
                sortingProperty: 'balance',
                startColumn:   3,
                endColumn:     4,
                startRow:      3,
                endRow:        4,
                align: 'right'
            },
            {
                title: 'Резерв',
                startColumn:   4,
                endColumn:     5,
                startRow:      3,
                endRow:        4,
                align: 'right'
            },
            {
                title: 'Себест.',
                startColumn:   5,
                endColumn:     6,
                startRow:      3,
                endRow:        4,
                align: 'right'
            },
            {
                title: 'Магазин',
                startColumn:   2,
                endColumn:     5,
                startRow:      2,
                endRow:        3,
                align: 'center'
            },
            {
                title: 'Склад',
                startColumn:   5,
                endColumn:     7,
                startRow:      2,
                endRow:        3,
                align: 'center',
            },
            {
                title: 'Сумма остатка',
                startColumn:   6,
                endColumn:     7,
                startRow:      3,
                endRow:        4,
                align: 'right'
            }
        ],
       singleRowHeader = [
           {
               title: 'Наименование',
               align: 'center'
           },
           {
               title: 'Общие',
               align: 'center'
           },
           {
               title: 'Цена',
               align: 'right'
           },
           {
               title: 'Остаток',
               sortingProperty: 'balance',
               align: 'right'
           },
           {
               title: 'Резерв',
               align: 'right'
           },
           {
               title: 'Себест.',
               align: 'right'
           },
       ],
       _dropDownItems = [
        {
            id: '1',
            title: 'Multiply header'
        },
        {
            id: '2',
            title: 'Single row header'
        },
        {
            id: '3',
            title: 'Partial header'
        }
    ],
        ModuleClass = BaseControl.extend({
            _template: template,
            _fullSet: true,
            _itemActions: null,
            _viewSource: null,
            gridColumns: null,
            gridColumns2: null,
            gridHeader: null,
            _selectedKeys: null,

            _beforeMount: function() {
                this._viewSource = new source.Memory({
                    idProperty: 'id',
                    data: GridData.catalog
                });
                this.gridColumns = fullColumns;
                this.gridHeader = fullHeader;

                this.gridColumns2 = partialColumns;
                this._selectedKeys = ['1'];
            },
            _selectedItemsChangedHandler: function(event, dropdownIndex) {
                switch(dropdownIndex[0]) {
                    case '1':
                        this._toggleToMultyHeader();
                        break;
                    case '2':
                        this._toggleToSingleRow();
                        break;
                    case '3':
                        this._onToggleColumnsToPartial();
                        break;
                    default:
                        break;
                }
            },
            _getDropDownItems: function() {
              return new source.Memory({
                  idProperty: 'id',
                  data: _dropDownItems
              });
            },
            _onToggleColumnsToPartial: function() {
                this.gridColumns = partialColumns;
                this.gridHeader = partialHeader;
                this._forceUpdate();
            },
            _toggleToSingleRow: function() {
                this.gridColumns = fullColumns;
                this.gridHeader = singleRowHeader;
                this._forceUpdate();
            },
            _toggleToMultyHeader: function() {
                this.gridColumns = fullColumns;
                this.gridHeader = fullHeader;
                this._forceUpdate();
            }
        });

    return ModuleClass;
});

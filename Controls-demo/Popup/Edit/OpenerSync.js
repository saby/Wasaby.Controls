define('Controls-demo/Popup/Edit/OpenerSync',
    [
        'UI/Base',
        'wml!Controls-demo/Popup/Edit/OpenerSync',
        'Types/source',
        'Controls-demo/List/Grid/GridData',
        'Controls/Utils/RecordSynchronizer',
        'wml!Controls-demo/List/Grid/DemoItem',
        'wml!Controls-demo/List/Grid/DemoBalancePrice',
        'wml!Controls-demo/List/Grid/DemoCostPrice',
        'wml!Controls-demo/List/Grid/DemoHeaderCostPrice',
        'wml!Controls-demo/List/Grid/DemoName'
    ],
    function (Base, template, source, GridData, RecordSynchronizer) {
        'use strict';

        var EditOpenerSync = Base.Control.extend({
            _template: template,
            _addRecordCount: 1,
            _isRemoveRecord: false,

            _beforeMount: function (opt, context) {
                this._dataLoadCallback = this._dataLoadCallback.bind(this);
                this._itemPadding = {left: 'S', right: 'M', bottom: 'M'};
                this._viewSource = new source.Memory({
                    keyProperty: 'id',
                    data: GridData.catalog.slice(0, 10)
                });

                this.gridColumns = [
                    {
                        displayProperty: 'name',
                        width: '1fr',
                        template: 'wml!Controls-demo/List/Grid/DemoName'
                    },
                    {
                        displayProperty: 'price',
                        width: 'auto',
                        align: 'right',
                        template: 'wml!Controls-demo/List/Grid/DemoCostPrice'
                    },
                    {
                        displayProperty: 'balance',
                        width: 'auto',
                        align: 'right',
                        template: 'wml!Controls-demo/List/Grid/DemoBalancePrice'
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
                        template: 'wml!Controls-demo/List/Grid/DemoCostPrice'
                    },
                    {
                        displayProperty: 'balanceCostSumm',
                        width: 'auto',
                        align: 'right',
                        template: 'wml!Controls-demo/List/Grid/DemoCostPrice'
                    }
                ];
                this.gridHeader = [
                    {
                        title: ''
                    },
                    {
                        title: 'Цена',
                        align: 'right'
                    },
                    {
                        title: 'Остаток',
                        align: 'right'
                    },
                    {
                        title: 'Резерв',
                        align: 'right'
                    },
                    {
                        title: 'Себест.',
                        align: 'right',
                        template: 'wml!Controls-demo/List/Grid/DemoHeaderCostPrice'
                    },
                    {
                        title: 'Сумма остатка',
                        align: 'right'
                    }
                ];
            },

            _itemClick: function (event, record) {
                var popupOptions = {
                    closeOnOutsideClick: false,
                    opener: this._children.grid
                };

                var meta = {
                    record: record
                };

                this._children.EditOpener.open(meta, popupOptions);
            },

            _addRecord: function () {
                this._isRemoveRecord = false;
                var record = this._baseRecord.clone();
                record.set('id', this._addRecordCount);
                record.set('name', '');
                this._addRecordCount++;
                RecordSynchronizer.addRecord(record, {}, this._items);
                this._isRemoveRecord = true;
                this._children.EditOpener.open({record: record});
            },

            _closeHandler: function (event) {
                if (this._isRemoveRecord) {
                    this._isRemoveRecord = false;
                    this._addRecordCount--;
                    RecordSynchronizer.deleteRecord(this._items, this._addRecordCount);
                }
            },

            _beforeSyncRecord: function (event, action, record, additionaData) {
                if (action === 'update') {
                    this._isRemoveRecord = false;
                }
            },

            _dataLoadCallback: function (items) {
                this._items = items;
                this._baseRecord = this._items.at(0).clone();
            }
        });

        return EditOpenerSync;
    });

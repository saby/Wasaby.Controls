define('js!TestDataGrid',
    [
        'js!SBIS3.CORE.CompoundControl',
        'html!TestDataGrid',
        'js!SBIS3.CONTROLS.ListView',
        'js!SBIS3.CONTROLS.Record',
        'js!SBIS3.CONTROLS.StaticSource',
        'js!SBIS3.CONTROLS.SbisServiceSource',
        'js!SBIS3.CONTROLS.ArrayStrategy',
        'js!SBIS3.CONTROLS.DataSet',
        'js!SBIS3.CONTROLS.DataGrid',
        'js!SBIS3.CORE.SwitcherDouble',
        'js!SBIS3.CONTROLS.TextBox',
        'js!SBIS3.CONTROLS.DropDownList',
        'js!SBIS3.CORE.FieldLink',
        'css!TestDataGrid'
    ], function (CompoundControl, dotTplFn, ListView, Record, StaticSource, SbisServiceSource, ArrayStrategy) {

        var moduleClass = CompoundControl.extend({
            _dotTplFn: dotTplFn,
            $protected: {
                _options: {}
            },
            $constructor: function () {

            },

            init: function () {
                var self = this;
                var setDS = function (ds) {
                    var tmpDataGridBL = self.getChildControlByName('ТипНоменклатуры');
                    tmpDataGridBL.removeItemsSelectionAll();
                    tmpDataGridBL.setDataSource(ds);
                };

                var bigColls = [];
                bigColls.push({
                    '@Заметка': 0,
                    'Содержимое': 'Данные загружены через StaticSource',
                    'Завершена': true,
                    'withoutNDS': false
                });

                for (var i = 1; i < 15; i++) {
                    if (i % 2 === 0) {
                        bigColls.push({
                            '@Заметка': i,
                            'Содержимое': (i + 1) + ' заметка',
                            'Завершена': true,
                            'withoutNDS': false
                            //'Завершена': !!(Math.round(Math.random())), // 0 || 1
                            //'withoutNDS': !!(Math.round(Math.random()))
                        });
                    } else {
                        bigColls.push({
                            '@Заметка': i,
                            'Содержимое': (i + 1) + ' заметка',
                            'Завершена': false,
                            'withoutNDS': true
                        });
                    }
                }
                var arrayStrategy = new ArrayStrategy(),
                    ds1 = new SbisServiceSource({service: 'Заметка'}),
                    ds2 = new StaticSource({
                        data: bigColls,
                        keyField: '@Заметка',
                        strategy: arrayStrategy
                    });

                moduleClass.superclass.init.call(this);

                setDS(ds1);

                this.getChildControlByName('SwitcherDoubleOnline').subscribe('onStateChanged', function (eventObject, state) {
                    if (state === true) {
                        setDS(ds1);
                    } else {
                        setDS(ds2);
                    }
                });

                var data = this.getChildControlByName('ТипНоменклатуры');

                data.reload({});
            },

            deleteRecord: function (item) {
                this.deleteRecords(item.data('id'));
            },

            editRecord: function (item) {
                console.log('Нажали на иконку редактирования')
            }

        });

        moduleClass.webPage = {
            outFileName: "integration_datagrid",
            htmlTemplate: "/intest/pageTemplates/onlineTemplate.html"
        };

        return moduleClass;
    });
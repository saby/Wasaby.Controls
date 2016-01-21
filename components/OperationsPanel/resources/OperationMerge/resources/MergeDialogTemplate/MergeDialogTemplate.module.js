/**
 * Created by as.suhoruchkin on 02.04.2015.
 */
define('js!SBIS3.CONTROLS.MergeDialogTemplate', [
    'js!SBIS3.CORE.CompoundControl',
    'html!SBIS3.CONTROLS.MergeDialogTemplate',
    'js!SBIS3.CONTROLS.Data.Source.SbisService',
    'js!SBIS3.CONTROLS.Data.Source.Memory',
    'js!SBIS3.CONTROLS.Data.Adapter.Sbis',
    'js!SBIS3.CONTROLS.Button',
    'js!SBIS3.CONTROLS.TreeDataGridView',
    'html!SBIS3.CONTROLS.MergeDialogTemplate/resources/cellNameTpl',
    'html!SBIS3.CONTROLS.MergeDialogTemplate/resources/cellCommentTpl'
], function(Control, dotTplFn, SbisServiceSource, MemorySource, SbisAdapter) {

    var MergeDialogTemplate = Control.extend({
        _dotTplFn: dotTplFn,

        $protected: {
            _options: {
                name: 'controls-MergeDialogTemplate',
                width: 760,
                resizable: false,
                /**
                 * @cfg {String} Заголовок диалог
                 */
                title: 'Объединение наименований',
                /**
                 * @cfg {String} Подсказка отображаемая в диалоге
                 */
                hint: 'Выберите наименование, с которым объединятся остальные. Все основные сведения возьмутся с него.\
                       На выбранное наименование перенесутся все связанные записи (документы, отчеты). Остальные наименования будут удалены.',
                /**
                 * @cfg {String} Сообщение с предупреждением
                 */
                warning: 'Внимание! Операция необратима',
                testMergeMethodName: undefined,
                dataSource: undefined,
                hierField: undefined,
                displayField: undefined
            },
            _treeView: undefined,
            _treeViewKeys: [],
            _applyContainer: undefined,
            _loadingIndicator: undefined
        },
        $constructor: function() {
            this._container.removeClass('ws-area');
            this.subscribe('onReady', this._onReady);
        },
        addUserItemAttributes: function(row, record) {
            if (record.get('Available') === false) {
                row.addClass('controls-MergeDialogTemplate__notMergeAvailable');
            }
        },
        onSearchPathClick: function(event) {
            //Откажемся от перехода по хлебным крошкам
            event.setResult(false);
        },
        _onReady: function() {
            var self = this;
            this._applyContainer = this.getContainer().find('.controls-MergeDialogTemplate__applyBlock');
            this.getChildControlByName('MergeDialogTemplate-mergeButton')
                .subscribe('onActivated', this.onMergeButtonActivated.bind(this));
            this._treeView = this.getChildControlByName('MergeDialogTemplate__treeDataGridView');
            this._treeView.subscribe('onSelectedItemChange', this.onSelectedItemChange.bind(this));
            this._treeView.setGroupBy(this._treeView.getSearchGroupBy(), false);
            this._treeView.setDataSource(this._options.dataSource, true);
            this._treeView.reload({
                'Разворот': 'С разворотом',
                'usePages': 'full',
                'mergeIds': this._options.items
            }).addCallback(function(ds) {
                //Получим ключи всех записей которые хотим объединять.
                //Не берём папки, которые присутствуют в датасете для построения структуры.
                ds.each(function(rec) {
                    if (!rec.get(self._options.hierField + '@')) {
                        self._treeViewKeys.push(rec.getKey());
                    }
                });
                //TODO: пока таким образом установит выбранное значение, иначе не стрельнёт onSelectedItemChange
                if (self._options.selectedKey) {
                    self._treeView.setSelectedKey(self._options.selectedKey);
                }
            });
        },
        onMergeButtonActivated: function() {
            var self = this,
                mergeTo = this._treeView.getSelectedKey(),
                mergeKeys = this._getMergedKeys(mergeTo, true);
            this._showIndicator();
            this._options.dataSource.merge(mergeTo, mergeKeys).addBoth(function() {
                self.sendCommand('close', { mergeTo: mergeTo, mergeKeys: mergeKeys });
                self._hideIndicator();
            });
        },
        _getMergedKeys: function(withoutKey, onlyAvailable) {
            var keys = Array.clone(this._treeViewKeys);
            Array.remove(keys, keys.indexOf(withoutKey));
            if (onlyAvailable) {
                for (var i = keys.length - 1; i >= 0; i--) {
                    if (!this._treeView.getDataSet().getRecordByKey(keys[i]).get('Available')) {
                        Array.remove(keys, i);
                    }
                }
            }
            return keys;
        },
        onSelectedItemChange: function(event, key) {
            var self = this;
            this._showIndicator();
            this._applyContainer.removeClass('ws-hidden');
            this._options.dataSource.call(this._options.testMergeMethodName, {
                'target': key,
                'merged': this._getMergedKeys(key)
            }).addCallback(function (data) {
                self._treeView.setDataSource(new MemorySource({
                    data: data.getRawData(),
                    adapter: new SbisAdapter()
                }));
                self._treeView.reload({});
            }).addBoth(function() {
                self._hideIndicator();
            });
        },
        _showIndicator: function() {
            this._loadingIndicator = setTimeout(function () {
                $ws.helpers.toggleIndicator(true);
            }, 100);
        },
        _hideIndicator: function() {
            clearTimeout(this._loadingIndicator);
            $ws.helpers.toggleIndicator(false);
        }
    });

    return MergeDialogTemplate;
});
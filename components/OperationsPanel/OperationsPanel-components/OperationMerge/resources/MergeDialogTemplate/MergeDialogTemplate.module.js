/**
 * Created by as.suhoruchkin on 02.04.2015.
 */
define('js!SBIS3.CONTROLS.MergeDialogTemplate', [
   "Core/CommandDispatcher",
   "js!SBIS3.CORE.CompoundControl",
   "html!SBIS3.CONTROLS.MergeDialogTemplate",
   "js!WS.Data/Source/SbisService",
   "js!WS.Data/Source/Memory",
   "js!WS.Data/Adapter/Sbis",
   "js!WS.Data/Query/Query",
   "js!WS.Data/Collection/RecordSet",
   "Core/helpers/fast-control-helpers",
   "i18n!SBIS3.CONTROLS.MergeDialogTemplate",
   "js!SBIS3.CONTROLS.Button",
   "js!SBIS3.CONTROLS.TreeDataGridView",
   "html!SBIS3.CONTROLS.MergeDialogTemplate/resources/cellRadioButtonTpl",
   "html!SBIS3.CONTROLS.MergeDialogTemplate/resources/cellCommentTpl",
   "html!SBIS3.CONTROLS.MergeDialogTemplate/resources/cellTitleTpl",
   "html!SBIS3.CONTROLS.MergeDialogTemplate/resources/rowTpl",
   "i18n!!SBIS3.CONTROLS.MergeDialogTemplate",
   'css!SBIS3.CONTROLS.MergeDialogTemplate',
   'css!SBIS3.CONTROLS.RadioButton'
], function( CommandDispatcher,Control, dotTplFn, SbisServiceSource, MemorySource, SbisAdapter, Query, RecordSet, fcHelpers) {


    var COMMENT_FIELD_NAME = 'Comment',
        AVAILABLE_FIELD_NAME = 'Available';

    var MergeDialogTemplate = Control.extend({
        _dotTplFn: dotTplFn,

        $protected: {
            _options: {
                name: 'controls-MergeDialogTemplate',
                width: 760,
                resizable: false,
                /**
                 * @cfg {String} Заголовок диалога
                 */
                title: rk('Объединение наименований'),
                /**
                 * @cfg {String} Подсказка отображаемая в диалоге
                 */
                hint: rk('Выберите наименование, с которым объединятся остальные. Все основные сведения возьмутся с него.\
                       На выбранное наименование перенесутся все связанные записи (документы, отчеты). Остальные наименования будут удалены.'),
                /**
                 * @cfg {String} Сообщение с предупреждением
                 */
                warning: rk('Внимание! Операция необратима'),
                errorMessage: rk('Итоги операции: "Объединения"'),
                testMergeMethodName: undefined,
                queryMethodName: undefined,
                dataSource: undefined,
                parentProperty: undefined,
                nodeProperty: undefined,
                displayProperty: undefined,
                titleCellTemplate: undefined
            },
            _treeView: undefined,
            _treeViewKeys: [],
            _applyContainer: undefined
        },
        $constructor: function() {
            
            CommandDispatcher.declareCommand(this, 'beginMerge', this.onMergeButtonActivated);
        },
        onSearchPathClick: function(event) {
            //Откажемся от перехода по хлебным крошкам
            event.setResult(false);
        },
        init: function() {
            MergeDialogTemplate.superclass.init.apply(this, arguments);
            this._applyContainer = this.getContainer().find('.controls-MergeDialogTemplate__applyBlock');
            this._treeView = this.getChildControlByName('MergeDialogTemplate__treeDataGridView');
            this._treeView.subscribe('onSelectedItemChange', this.onSelectedItemChange.bind(this));
            //this._treeView.setGroupBy(this._treeView.getSearchGroupBy(), false);
            this._initItems();
        },
        _initItems: function() {
            var
                self = this,
                originalDataSource = this._options.dataSource,
                binding = originalDataSource.getBinding(),
                //TODO: из-за того что есть опция queryMethodName приходится создавать новый DataSource для запроса данных.
                //Нужно отказаться от этой опции, и настраивать action сразу правильным DataSource.
                mergeDataSource = new SbisServiceSource({
                    idProperty: originalDataSource.getIdProperty(),
                    endpoint: originalDataSource.getEndpoint(),
                    model: originalDataSource.getModel(),
                    binding: {
                        query: this._options.queryMethodName || binding.query
                    }
                });
            mergeDataSource.query((new Query()).where({
                'Разворот': 'С разворотом',
                'usePages': 'full',
                'mergeIds': this._options.items
            })).addCallback(function(recordSet) {
                var items = recordSet.getAll();
                //Добавим колонки с полями доступности объединения и комментарием
                items.addField({name: COMMENT_FIELD_NAME, type: 'string'});
                items.addField({name: AVAILABLE_FIELD_NAME, type: 'boolean'});

                //Получим ключи всех записей которые хотим объединять.
                //Не берём папки, которые присутствуют в датасете для построения структуры.
                items.each(function(rec) {
                    if (!rec.get(self._options.parentProperty + '@')) {
                        self._treeViewKeys.push(rec.getId());
                    }
                });
                self._treeView.setItems(items);
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
            this._treeView._toggleIndicator(true);
            this._options.dataSource.merge(mergeTo, mergeKeys).addErrback(function(errors) {
                self._showErrorDialog(mergeKeys, errors);
            }).addBoth(function(result) {
                self.sendCommand('close', { mergeTo: mergeTo, mergeKeys: mergeKeys, mergeResult: result });
            });
        },
        _showErrorDialog: function(mergeKeys, error) {
            var
                errorsTexts = [],
                count = mergeKeys.length;
            if (error.addinfo) {
                new RecordSet({
                    rawData: error.addinfo,
                    adapter: 'adapter.sbis'
                }).each(function(item) {
                    errorsTexts.push(item.get('error'));
                });
            } else {
                errorsTexts = [error.message];
            }
            fcHelpers.openErrorsReportDialog({
                'numSelected': count,
                'numSuccess': count - errorsTexts.length,
                'errors': errorsTexts,
                'title': this._options.errorMessage
            });
        },
        _getMergedKeys: function(withoutKey, onlyAvailable) {
            var keys = Array.clone(this._treeViewKeys);
            Array.remove(keys, keys.indexOf(withoutKey));
            if (onlyAvailable) {
                for (var i = keys.length - 1; i >= 0; i--) {
                    if (!this._treeView.getDataSet().getRecordById(keys[i]).get(AVAILABLE_FIELD_NAME)) {
                        Array.remove(keys, i);
                    }
                }
            }
            return keys;
        },
        onSelectedItemChange: function(event, mergeTo) {
            var
                id,
                record,
                self = this,
                isAvailable,
                showMergeButton,
                idProperty = this._options.idProperty,
                items = this._treeView.getItems();
            this._treeView._toggleIndicator(true);
            this._options.dataSource.call(this._options.testMergeMethodName, {
                'target': mergeTo,
                'merged': this._getMergedKeys(mergeTo)
            }).addCallback(function (data) {
                data.getAll().each(function(rec) {
                    id = rec.get(idProperty);
                    record = items.getRecordById(id);
                    if (id !== mergeTo) {
                        isAvailable = rec.get(AVAILABLE_FIELD_NAME);
                        showMergeButton = showMergeButton || isAvailable;
                    }
                    record.set(AVAILABLE_FIELD_NAME, isAvailable);
                    record.set(COMMENT_FIELD_NAME, rec.get(COMMENT_FIELD_NAME));
                }, self);
                //Выбранной записи всегда выставляем AVAILABLE = true
                items.getRecordById(mergeTo).set(AVAILABLE_FIELD_NAME, true);
                self._applyContainer.toggleClass('ws-hidden', !showMergeButton);
            }).addBoth(function() {
                self._treeView._toggleIndicator(false);
            });
        }
    });

    return MergeDialogTemplate;
});
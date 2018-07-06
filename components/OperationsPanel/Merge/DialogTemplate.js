/**
 * Created by as.suhoruchkin on 02.04.2015.
 */
define('SBIS3.CONTROLS/OperationsPanel/Merge/DialogTemplate', [
   "Core/CommandDispatcher",
   "Lib/Control/CompoundControl/CompoundControl",
   "tmpl!SBIS3.CONTROLS/OperationsPanel/Merge/DialogTemplate",
   "WS.Data/Source/SbisService",
   "WS.Data/Query/Query",
   "WS.Data/Collection/RecordSet",
   "SBIS3.CONTROLS/WaitIndicator",
   "Core/helpers/Hcontrol/openErrorsReportDialog",
   "tmpl!SBIS3.CONTROLS/OperationsPanel/Merge/resources/cellRadioButtonTpl",
   "tmpl!SBIS3.CONTROLS/OperationsPanel/Merge/resources/cellCommentTpl",
   "tmpl!SBIS3.CONTROLS/OperationsPanel/Merge/resources/cellTitleTpl",
   "tmpl!SBIS3.CONTROLS/OperationsPanel/Merge/resources/rowTpl",
   "i18n!SBIS3.CONTROLS/OperationsPanel/Merge/DialogTemplate",
   "SBIS3.CONTROLS/Button",
   "SBIS3.CONTROLS/Tree/DataGridView",
   "SBIS3.CONTROLS/ScrollContainer",
   "i18n!!SBIS3.CONTROLS/OperationsPanel/Merge/DialogTemplate",
   'css!SBIS3.CONTROLS/OperationsPanel/Merge/DialogTemplate',
   'css!SBIS3.CONTROLS/Radio/Button/RadioButton'
], function( CommandDispatcher, Control, dotTplFn, SbisServiceSource, Query, RecordSet, WaitIndicator, openErrorsReportDialog, cellRadioButtonTpl, cellCommentTpl, cellTitleTpl, rowTpl) {


    var COMMENT_FIELD_NAME = 'Comment',
        AVAILABLE_FIELD_NAME = 'Available';

    var onSearchPathClick = function(event) {
       //Откажемся от перехода по хлебным крошкам
       event.setResult(false);
    };

    var MergeDialogTemplate = Control.extend({
        _dotTplFn: dotTplFn,

        $protected: {
            _options: {
                _itemTpl: rowTpl,
                _titleCellTemplate: cellTitleTpl,
                _cellCommentTpl: cellCommentTpl,
                _cellRadioButtonTpl: cellRadioButtonTpl,
                _onSearchPathClick: onSearchPathClick,
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
             //Флаг необходим из-за того, что при смене выделенной записи мы перерисовываем весь список, что в свою очередь
             //приводит к нотификации о смене выбранной записи. Получается зацикливание.
            _silent: false,
            _treeView: undefined,
            _treeViewKeys: [],
            _applyContainer: undefined
        },
        $constructor: function() {
            CommandDispatcher.declareCommand(this, 'beginMerge', this.onMergeButtonActivated);
        },
        init: function() {
            MergeDialogTemplate.superclass.init.apply(this, arguments);
            this._applyContainer = this.getContainer().find('.controls-MergeDialogTemplate__applyBlock');
            this._treeView = this.getChildControlByName('MergeDialogTemplate__treeDataGridView');
            this.subscribeTo(this._treeView, 'onSelectedItemChange', this.onSelectedItemChange.bind(this));
            this.subscribeTo(this._treeView, 'onItemClick', this._onItemClickHandler.bind(this));
            //this._treeView.setGroupBy(this._treeView.getSearchGroupBy(), false);
            this._initItems();
        },
        _onItemClickHandler: function(e, id, model) {
           var result;
            if (model.get(this._options.nodeProperty)) {
               result =  false;
            }
           e.setResult(result);
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
            var
                deferred,
                self = this,
                mergeTo = this._treeView.getSelectedKey(),
                mergeKeys = this._getMergedKeys(mergeTo, true);
            deferred = this._options.dataSource.merge(mergeTo, mergeKeys).addErrback(function(errors) {
                self._showErrorDialog(mergeKeys, errors);
            }).addBoth(function(result) {
                self.sendCommand('close', { mergeTo: mergeTo, mergeKeys: mergeKeys, mergeResult: result });
            });
           this._showIndicator(deferred);
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
            openErrorsReportDialog({
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

        _showIndicator: function(deferred) {
           WaitIndicator.make({
              delay: 750,
              target: this._container
           }, deferred);
        },

        onSelectedItemChange: function(event, mergeTo) {
            var
                id,
                record,
                deferred,
                self = this,
                isAvailable,
                showMergeButton,
                idProperty = this._options.idProperty,
                items = this._treeView.getItems();
           if (!this._silent) {
              deferred = this._options.dataSource.call(this._options.testMergeMethodName, {
                 'target': mergeTo,
                 'merged': this._getMergedKeys(mergeTo)
              }).addCallback(function (data) {
                 items.setEventRaising(false, true);
                 data.getAll().each(function (rec) {
                    id = rec.get(idProperty);
                    record = items.getRecordById(id);
                    //Приводим типы к одному формату, т.к. прикладной метод бл, может вернуть идентификатор записи как
                    //строкой так и числом.
                    if (String(id) !== String(mergeTo)) {
                       isAvailable = rec.get(AVAILABLE_FIELD_NAME);
                       showMergeButton = showMergeButton || isAvailable;
                    }
                    record.set(AVAILABLE_FIELD_NAME, isAvailable);
                    record.set(COMMENT_FIELD_NAME, rec.get(COMMENT_FIELD_NAME));
                 }, self);
                 //Выбранной записи всегда выставляем AVAILABLE = true
                 items.getRecordById(mergeTo).set(AVAILABLE_FIELD_NAME, true);
                 self._silent = true;
                 items.setEventRaising(true, true);
                 self._silent = false;
                 self._applyContainer.toggleClass('ws-hidden', !showMergeButton);
              });
              this._showIndicator(deferred);
           }
        }
    });

    return MergeDialogTemplate;
});
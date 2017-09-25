define('js!SBIS3.CONTROLS.Action.List.Save', [
    'js!SBIS3.CONTROLS.Action.Save',
    'js!SBIS3.CONTROLS.Action.List.ListMixin',
    'Core/helpers/fast-control-helpers',
    'Core/Deferred',
    'Core/constants',
    'Core/core-instance',
    'Core/core-functions',
    'js!WS.Data/Collection/RecordSet',
    'js!SBIS3.CORE.DialogSelector',
    'js!WS.Data/Query/Query',
    'js!WS.Data/Entity/Record',
    'Core/moduleStubs'
], function (Save, ListMixin, fcHelpers, Deferred, constants, cInstance, cFunctions, RecordSet, Dialog, Query, Record, moduleStubs) {
    var MAX_RECORDS_COUNT = 20000;

    /**
     * Action для сохранения данных.
     * @class SBIS3.CONTROLS.Action.List.Save
     * @public
     * @extends SBIS3.CONTROLS.Action.Save
     * @author Сухоручкин Андрей Сергеевич
     */
    var SaveList = Save.extend([ListMixin], /** @lends SBIS3.CONTROLS.Action.List.Save.prototype */{
        $protected: {
            _options: {
               /**
                * @cfg {SBIS3.CONTROLS.ISaveStrategy) Стратегия сохранения. Класс, который реализует сохранение записей.
                * @see {@link SBIS3.CONTROLS.ISaveStrategy}
                * @see {@link SBIS3.CONTROLS.SaveStrategy.Base}
                * @see {@link SBIS3.CONTROLS.SaveStrategy.Sbis}
                */
                saveStrategy: 'js!SBIS3.CONTROLS.SaveStrategy.Sbis',
                /**
                * @cfg {Array} Колонки которые будут сохраняться.
                **/
                columns: undefined,
                /**
                * @cfg {String} Имя сохраняемого файла.
                **/
                fileName: '',
                /**
                * @cfg {String} Имя файла с xsl преобразованием.
                **/
                xsl: undefined
            }
        },

        _doExecute: function(meta) {
            var
                dataForSave,
                self = this;
            meta = this._prepareMeta(meta);
            dataForSave = this._getDataForSave(meta);
            dataForSave = dataForSave instanceof Deferred ? dataForSave : Deferred.success(dataForSave);
            dataForSave.addCallback(function(data) {
                if (cInstance.instanceOfModule(data, 'WS.Data/Collection/RecordSet')) {
                    meta.recordSet = data;
                } else if (cInstance.instanceOfModule(data, 'WS.Data/Query/Query')) {
                    meta.query = data;
                }
                self.getSaveStrategy().addCallback(function(strategy) {
                   strategy.saveAs(meta);
                   return strategy;
                });
            });
        },

        _getDataForSave: function(meta) {
            var result;
            if (meta.recordSet) {
                result = meta.recordSet;
            } else if (meta.query) {
                result = this._getDataFromQuery(meta.dataSource, meta.query, meta.serverSideExport);
            } else {
                result = this._computeDataForSave(meta);
            }
            return result;
        },

        _computeDataForSave: function(meta) {
            var
               result,
               selection = this.getLinkedObject().getSelection();
            if (selection && selection.marked && selection.marked.length) {
               result = this._getDataFromSelection(meta.dataSource, meta.serverSideExport, selection);
            } else {
               result = this._getSelectedRecordSet();
               if (result.getCount()) {
                   result = Deferred.success(result);
               } else {
                   result = this._getDataFromSelector(meta);
               }
            }
            return result;
        },

        _getDataFromSelection: function(dataSource, serverSideExport, selection) {
           var query = this._createQueryForSelection(dataSource, selection);
           return this._getDataFromQuery(dataSource, query, serverSideExport);
        },

        _getDataFromSelector: function(meta) {
            var linkedObject = this.getLinkedObject();
            return this._showAmountSelector(this._getTitleForSelector(meta.endpoint), linkedObject.getItems().getCount()).addCallback(function(count) {
                var query = this._createQueryForList(meta.parentProperty, count || MAX_RECORDS_COUNT);
                return this._getDataFromQuery(meta.dataSource, query, meta.serverSideExport);
            }.bind(this));
        },

        _createQueryForSelection: function(dataSource, selection, limit) {
           var
              query = new Query(),
              linkedObject = this.getLinkedObject(),
              filter = cFunctions.clone(linkedObject.getFilter());
           filter.selection = Record.fromObject(selection, dataSource.getAdapter());

           query.where(filter).orderBy(linkedObject.getSorting()).offset(linkedObject.getOffset()).limit(limit);
           return query;
        },

        _createQueryForList: function(parentProperty, limit) {
            var
                query = new Query(),
                linkedObject = this.getLinkedObject(),
                filter = cFunctions.clone(linkedObject.getFilter()),
                openedPath;
            if (parentProperty) {
                filter[parentProperty] = filter[parentProperty] === undefined ? [linkedObject.getCurrentRoot()] : filter[parentProperty];
                filter[parentProperty] = filter[parentProperty] instanceof Array ? filter[parentProperty] : [filter[parentProperty]];
                openedPath = linkedObject.getOpenedPath();
                for (var key in openedPath) {
                    if (openedPath.hasOwnProperty(key)) {
                       if (filter[parentProperty].indexOf(key) === -1) {
                          filter[parentProperty].push(key);
                       }
                    }
                }
            }

            query.where(filter).orderBy(linkedObject.getSorting()).offset(linkedObject.getOffset()).limit(limit);
            return query;
        },

        _getDataFromQuery: function(dataSource, query, serverSideExport) {
            return serverSideExport ? query : this._loadData(dataSource, query);
        },

        _getTitleForSelector: function (type) {
            return type ? rk('Что сохранить в') + ' ' + type : rk('Что напечатать');
        },

        _getSelectedRecordSet: function() {
            var
                linkedObject = this.getLinkedObject(),
                items = linkedObject.getItems(),
                selectedRecordSet = new RecordSet({
                    adapter: items ? items.getAdapter() : 'adapter.json'
                });
            selectedRecordSet.assign(linkedObject.getSelectedItems() || []);
            return selectedRecordSet;
        },

        _showAmountSelector: function(title, defaultCount) {
            var result = new Deferred();
            new Dialog ({
                opener : this,
                template: 'js!SBIS3.CONTROLS.MassAmountSelector',
                caption : title,
                cssClassName: 'controls-MassAmountSelector',
                handlers: {
                    onBeforeShow: function() {
                        this.getLinkedContext().setValue('NumOfRecords', defaultCount);
                    },
                    onChange: function(event, count) {
                        result.callback(count);
                    }
                }
            });
            return result;
        },

        _prepareMeta: function(meta) {
            meta = meta || {};
            var
                serverSideExport = true,
                linkedObject = this.getLinkedObject(),
                options = ['columns', 'fileName', 'xsl'];

            options.forEach(function (name) {
                meta[name] = meta[name] || this._options[name];
            }, this);
            meta.dataSource = meta.dataSource || this.getDataSource();
            if (meta.xsl || !meta.endpoint) {
                serverSideExport = false;
            }
           //Для IOS всегда будем выгружать через сервер.
            meta.serverSideExport = serverSideExport || constants.browser.isMobileSafari;
            meta.pageOrientation = meta.endpoint === 'PDF' ? meta.pageOrientation || 1 : undefined;
            if (cInstance.instanceOfMixin(linkedObject, 'SBIS3.CONTROLS.TreeMixin')) {
                meta.parentProperty = linkedObject.getParentProperty();
            }
            if (!meta.columns) {
               meta.columns = linkedObject.getColumns();
            }

            return meta;
        },

        _loadData: function(dataSource, query) {
            var result = new Deferred();

           moduleStubs.require(['js!SBIS3.CONTROLS.Utils.InformationPopupManager']).addCallback(function(manager) {
              manager[0].showConfirmDialog({message: 'Операция займет продолжительное время. Провести операцию?'},
                 function (){
                    fcHelpers.toggleIndicator(true);
                    dataSource.query(query).addCallback(function (recordSet) {
                       result.callback(recordSet.getAll())
                    }).addBoth(function() {
                       fcHelpers.toggleIndicator(false);
                    });
                 },
                 function(){
                    result.errback();
                 }
              )
           });

           return result;
        }
    });

    return SaveList;

});
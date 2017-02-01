define('js!SBIS3.CONTROLS.Action.List.Save', [
    'js!SBIS3.CONTROLS.Action.Save',
    'js!SBIS3.CONTROLS.Action.List.ListMixin',
    'Core/helpers/fast-control-helpers',
    'Core/helpers/collection-helpers',
    'Core/Deferred',
    'Core/constants',
    'Core/core-instance',
    'Core/core-functions',
    'js!WS.Data/Collection/RecordSet',
    'js!SBIS3.CORE.DialogSelector',
    'js!WS.Data/Query/Query'
], function (Save, ListMixin, fcHelpers, colHelpers, Deferred, constants, cInstance, cFunctions, RecordSet, Dialog, Query) {
    var MAX_RECORDS_COUNT = 20000;

    /**
     * Экшен для сохранения данных.
     * @class SBIS3.CONTROLS.Action.List.Save
     * @public
     * @extends SBIS3.CONTROLS.Action.Save
     * @author Сухоручкин Андрей Сергеевич
     */
    var SaveList = Save.extend([ListMixin], /** @lends SBIS3.CONTROLS.Action.List.Save.prototype */{
        $protected: {
            _options: {
                saveStrategy: 'savestrategy.sbis',
                columns: [],
                fileName: '',
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
                self.getSaveStrategy().saveAs(meta);
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
                items,
                result,
                linkedObject,
                selectedRecordSet = this._getSelectedRecordSet();
            if (selectedRecordSet.getCount()) {
                result = Deferred.success(selectedRecordSet);
            } else {
                linkedObject = this.getLinkedObject();
                items = linkedObject.getItems();
                if (linkedObject._hasNextPage(items.getMetaData().more)) {
                    result = this._getDataFromSelector(meta);
                } else {
                    result = items;
                }
            }
            return result;
        },

        _getDataFromSelector: function(meta) {
            var linkedObject = this.getLinkedObject();
            return this._showAmountSelector(this._getTitleForSelector(meta.endpoint), linkedObject.getItems().getCount()).addCallback(function(count) {
                var query = this._createQuery(meta.parentProperty, count || MAX_RECORDS_COUNT);
                return this._getDataFromQuery(meta.dataSource, query, meta.serverSideExport);
            }.bind(this));
        },

        _createQuery: function(parentProperty, limit) {
            var
                query = new Query(),
                linkedObject = this.getLinkedObject(),
                filter = cFunctions.clone(linkedObject.getFilter());
            if (parentProperty) {
                filter[parentProperty] = filter[parentProperty] === undefined ? [linkedObject.getCurrentRoot()] : filter[parentProperty];
                filter[parentProperty] = filter[parentProperty] instanceof Array ? filter[parentProperty] : [filter[parentProperty]];
                colHelpers.forEach(linkedObject.getOpenedPath(), function (val, key) {
                    if (filter[parentProperty].indexOf(key) === -1) {
                        filter[parentProperty].push(key);
                    }
                }, this);
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
                linkedObject = this.getLinkedObject(),
                options = ['columns', 'fileName', 'xsl'];

            colHelpers.forEach(options, function (name) {
                meta[name] = meta[name] || this._options[name];
            }, this);
            meta.dataSource = meta.dataSource || this.getDataSource();
            //Для IOS всегда будем выгружать через сервер.
            meta.serverSideExport = meta.serverSideExport || constants.browser.isMobileSafari;
            meta.pageOrientation = meta.endpoint === 'PDF' ? meta.pageOrientation || 1 : undefined;
            if (cInstance.instanceOfMixin(linkedObject, 'SBIS3.CONTROLS.TreeMixin')) {
                meta.parentProperty = linkedObject.getParentProperty();
            }

            return meta;
        },

        _loadData: function(dataSource, query) {
            var
                self = this,
                result = new Deferred();
            fcHelpers.question(rk('Операция займет продолжительное время. Провести операцию?'), {}, self).addCallback(function(answer) {
                if (answer) {
                    fcHelpers.toggleIndicator(true);
                    dataSource.query(query).addCallback(function (recordSet) {
                        result.callback(recordSet.getAll())
                    }).addBoth(function() {
                        fcHelpers.toggleIndicator(false);
                    });
                } else {
                    result.errback();
                }
            });
            return result;
        }

    });

    return SaveList;

});
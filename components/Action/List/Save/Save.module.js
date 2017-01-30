define('js!SBIS3.CONTROLS.Action.List.Save', [
    'js!SBIS3.CONTROLS.Action.Save',
    'js!SBIS3.CONTROLS.Action.List.ListMixin',
    'Core/helpers/fast-control-helpers',
    'Core/helpers/collection-helpers',
    'Core/Deferred',
    'Core/constants',
    'js!WS.Data/Collection/RecordSet',
    'js!SBIS3.CORE.DialogSelector',
    'js!WS.Data/Query/Query',
    'Core/core-instance'
], function (Save, ListMixin, fcHelpers, colHelpers, Deferred, constants, RecordSet, Dialog, Query, cInstance) {
    var MAX_RECORDS_COUNT = 20000;

    //TODO: укзазать title для MassAmountSelector
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
                columns: [],
                fileName: '',
                xsl: undefined
            }
        },

        _doExecute: function(meta) {
            var self = this;
            meta = this._prepareMeta(meta);
            this._getDataForSave(meta).addCallback(function(data) {
                if (cInstance.instanceOfModule(data, 'WS.Data/Collection/RecordSet')) {
                    meta.recordSet = data;
                } else if (cInstance.instanceOfModule(data, 'WS.Data/Query/Query')) {
                    meta.query = data;
                }
                self._save(meta);
            });
        },

        _getDataForSave: function(meta) {
            var
                items,
                query,
                linkedObject,
                selectedRecordSet,
                self = this,
                result = new Deferred();
            if (meta.recordSet) {
                result.callback(meta.recordSet);
            } else if (meta.query) {
                if (meta.serverSideExport) {
                    result.callback(meta.query);
                } else {
                    result.callback(this._loadData(meta.query));
                }
            } else {
                selectedRecordSet = this._getSelectedRecordSet();
                if (selectedRecordSet.getCount()) {
                    result.callback(selectedRecordSet);
                } else {
                    linkedObject = this.getLinkedObject();
                    items = linkedObject.getItems();
                    if (linkedObject._hasNextPage(items.getMetaData().more)) {
                        this._showAmountSelector(meta.title, items.getCount()).addCallback(function(count) {
                            query = self._createQuery(linkedObject.getFilter(), linkedObject.getSorting(), 0, count || MAX_RECORDS_COUNT);
                            if (meta.serverSideExport) {
                                result.callback(query);
                            } else {
                                self._loadData(query).addCallback(function(recordSet) {
                                    result.callback(recordSet);
                                });
                            }
                        });
                    } else {
                        result.callback(items);
                    }
                }
            }
            return result;
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
            var options = ['columns', 'fileName', 'xsl'];

            colHelpers.forEach(options, function (name) {
                if (!meta.hasOwnProperty(name)) {
                    meta[name] = this._options[name];
                }
            }, this);
            //Для IOS всегда будем выгружать через сервер. Android прекрасно умеет выгружать
            meta.serverSideExport = meta.serverSideExport || constants.browser.isMobileSafari;
            meta.dataSource = meta.dataSource || this.getDataSource();

            return meta;
        },

        _loadData: function(query) {
            var
                self = this,
                result = new Deferred();
            fcHelpers.question('Операция займет продолжительное время. Провести операцию?', {}, self).addCallback(function(answer) {
                if (answer) {
                    fcHelpers.toggleIndicator(true);
                    self.getDataSource().query(query).addCallback(function (recordSet) {
                        result.callback(recordSet.getAll())
                    }).addBoth(function() {
                        fcHelpers.toggleIndicator(false);
                    });
                } else {
                    result.errback();
                }
            });
            return result;
        },

        _createQuery: function(filter, sorting, offset, limit){
            var query = new Query();
            query.where(filter).offset(offset).limit(limit).orderBy(sorting);
            return query;
        }

    });

    return SaveList;

});
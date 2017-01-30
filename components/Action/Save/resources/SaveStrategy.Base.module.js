/* global define  */
define('js!SBIS3.CONTROLS.SaveStrategy.Base', [
    'Core/Abstract',
    'Core/IoC',
    'Core/EventBus',
    'Core/core-functions',
    'Core/helpers/transport-helpers',
    'js!WS.Data/Source/SbisService',
    'js!WS.Data/Entity/Record',
    'js!WS.Data/Entity/Model',
    'js!WS.Data/Adapter/Sbis',
    "js!WS.Data/Collection/RecordSet",
    'Core/helpers/fast-control-helpers',
    'js!SBIS3.CONTROLS.ISaveStrategy',
    'js!SBIS3.CONTROLS.Utils.DataSetToXMLSerializer'
], function (Abstract, IoC, EventBus, cFunctions, transHelpers, SbisService, Record, Model, SbisAdapter, RecordSet, fcHelpers, ISaveStrategy, Serializer) {
    'use strict';

    var SaveStrategyBase = Abstract.extend([ISaveStrategy], /** @lends SBIS3.CONTROLS.SaveStrategy.Base.prototype */{
        $protected: {
            _defaultXslTransform: 'default-list-transform.xsl'
        },

        saveAs: function (meta) {
            if (meta.type) {
                if (meta.type === 'PDF') {
                    meta.pageOrientation = meta.pageOrientation || 1;
                }
                this.save(meta);
            } else {
                this.print(meta);
            }
        },

        save: function(meta) {
            if (meta.recordSet) {
                this[meta.serverSideExport ? 'exportRecordSet' : 'exportHTML'](meta);
                this.exportHTML(meta);
            } else if (meta.query) {
                this.exportList(meta);
            }
        },

        print: function (meta) {
            fcHelpers.toggleIndicator(true);
            this._serializeData(meta.recordSet, meta.columns, meta.xsl).addCallback(function(reportText){
                fcHelpers.showHTMLForPrint({
                    htmlText: reportText,
                    minWidth : meta.minWidth,
                    handlers: {
                        onAfterClose: function() {
                            fcHelpers.toggleIndicator(false);
                        }
                    }
                }).addCallback(function() {
                    fcHelpers.toggleIndicator(false);
                });
            });
        },

        _serializeData: function(recordSet, columns, xsl){
            var serializer = new Serializer({
                columns: columns,
                report: xsl
            });
            return serializer.prepareReport(xsl || this._defaultXslTransform, recordSet);
        },
        /**
         * Выгрузить данные с помощью готовой HTML-верстки
         */
        exportHTML: function(meta){
            var self = this;
            this._serializeData(meta.recordSet, meta.columns, meta.xsl).addCallback(function(reportText){
                var cfg = {
                    'FileName': meta.fileName,
                    'html': reportText
                };
                if (typeof meta.pageOrientation === 'number') {
                    cfg.PageOrientation = meta.pageOrientation;
                }
                self.exportFileTransfer(meta.endpoint || meta.type, meta.methodName || 'SaveHTML', cfg);
            });
        },
        exportRecordSet: function(meta){
            var cfg = {
                    Data : meta.recordSet,
                    FileName : meta.fileName
                };
            cFunctions.merge(cfg, this.parseColumns(meta.columns));

            if (typeof meta.pageOrientation === 'number') {
                cfg.PageOrientation = meta.pageOrientation;
            }

            this.exportFileTransfer(meta.endpoint || meta.type, meta.methodName || 'SaveRecordSet', cfg);
        },

        exportList: function(meta){
            var cfg = {
                    FileName: meta.fileName,
                    MethodName: meta.dataSource.getEndpoint().contract + '.' + meta.dataSource.getBinding().query
                };

            cFunctions.merge(cfg, this.parseQuery(meta.query, meta.dataSource));
            cFunctions.merge(cfg, this.parseColumns(meta.columns));

            if (typeof meta.pageOrientation === 'number') {
                cfg.PageOrientation = meta.pageOrientation;
            }
            this.exportFileTransfer(meta.endpoint || meta.type, meta.methodName || 'SaveList', cfg);
        },

        parseQuery : function(query, dataSource){
            var queryParams = dataSource.prepareQueryParams(query.getWhere(), null, query.getOffset(), query.getLimit(), false);
            return {
                Filter: queryParams['Фильтр'],
                Sorting: queryParams['Сортировка'],
                Pagination: queryParams['Навигация']
            };
        },

        /**
         * Универсальная выгрузка данных через сервис file-transfer
         * @param endpoint
         * @param methodName
         * @param cfg
         * @returns {$ws.proto.Deferred}
         */
        exportFileTransfer: function(endpoint, methodName, cfg){
            var self = this,
                exportDeferred,
                source = new SbisService({
                    endpoint: endpoint
                });
            exportDeferred = source.call(methodName, cfg).addErrback(function(error) {
                IoC.resolve('ILogger').log(rk('SaveStrategy. Ошибка выгрузки данных'), error.details);
                return error;
            });
            if (endpoint !== "Excel") {
                exportDeferred.addCallback(function(ds) {
                    self._downloadFile(ds.getScalar());
                });
            } else {
                exportDeferred.addCallback(function(){
                    //TODO Не совсем хорошо, что контролы знают о LongOperations. Но пока не понятно, как сделать иначе.
                    EventBus.channel('LongOperations').notify('onOperationStarted');
                });
            }
            return exportDeferred;
        },

        /**
         * Загрузить файл по готовому id
         * @param id - уникальный идентификатор файла на сервисе file-transfer
         */
        _downloadFile : function(id){
            window.open(transHelpers.prepareGetRPCInvocationURL( 'File','Download', {'id': id}, undefined, '/file-transfer/service/'), '_self');
        },

        parseColumns: function(columns) {
            var result = { Fields: [], Titles: [] };
            for (var i = 0; i < columns.length; i++) {
                result.Fields.push(columns[i].field);
                result.Titles.push(columns[i].title || columns[i].field);
            }
            return result;
        }
    });

    return SaveStrategyBase;
});

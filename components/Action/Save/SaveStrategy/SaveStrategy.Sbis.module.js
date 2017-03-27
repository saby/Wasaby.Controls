/* global define  */
define('js!SBIS3.CONTROLS.SaveStrategy.Sbis', [
    'js!SBIS3.CONTROLS.SaveStrategy.Base',
    'Core/EventBus',
    'Core/core-functions',
    'Core/helpers/transport-helpers',
    'js!WS.Data/Source/SbisService',
    'js!WS.Data/Entity/Model',
    'js!WS.Data/Di'
], function (SaveStrategyBase, EventBus, cFunctions, transHelpers, SbisService, Model, Di) {

    'use strict';

    var SaveStrategySbis = SaveStrategyBase.extend(/** @lends SBIS3.CONTROLS.SaveStrategy.Sbis.prototype */{

        saveAs: function (meta) {
            if (meta.endpoint) {
                this.saveToFile(meta);
            } else {
                SaveStrategySbis.superclass.saveAs.apply(this, arguments);
            }
        },

        saveToFile: function(meta) {
            if (meta.recordSet) {
                this[meta.serverSideExport ? 'exportRecordSet' : 'exportHTML'](meta);
            } else if (meta.query) {
                this.exportList(meta);
            }
        },

        exportHTML: function(meta) {
            var self = this;
            this._serializeData(meta.recordSet, meta.columns, meta.xsl).addCallback(function(html){
                var cfg = {
                    html: html,
                    FileName: meta.fileName,
                    PageOrientation: meta.pageOrientation
                };
                self.exportFileTransfer(meta.endpoint, 'SaveHTML', cfg);
            });
        },

        exportRecordSet: function(meta) {
            var cfg = {
                    Data : meta.recordSet,
                    FileName : meta.fileName,
                    PageOrientation: meta.pageOrientation,
                    HierarchyField: meta.parentProperty && meta.endpoint !== 'PDF' ? meta.parentProperty : undefined
                };
            cFunctions.merge(cfg, this._parseColumns(meta.columns));

            this.exportFileTransfer(meta.endpoint, 'SaveRecordSet', cfg);
        },

        exportList: function(meta) {
            var cfg = {
                    FileName: meta.fileName,
                    MethodName: meta.dataSource.getEndpoint().contract + '.' + meta.dataSource.getBinding().query,
                    PageOrientation: meta.pageOrientation,
                    HierarchyField: meta.parentProperty && meta.endpoint !== 'PDF' ? meta.parentProperty : undefined
                };
            cFunctions.merge(cfg, this._parseQuery(meta.query, meta.dataSource));
            cFunctions.merge(cfg, this._parseColumns(meta.columns));

            this.exportFileTransfer(meta.endpoint, 'SaveList', cfg);
        },

        _parseQuery : function(query, dataSource) {
            var queryParams = dataSource.prepareQueryParams(query.getWhere(), query.getOrderBy(), query.getOffset(), query.getLimit(), false);
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
         * @returns {ws.proto.Deferred}
         */
        exportFileTransfer: function(endpoint, methodName, cfg) {
            var self = this,
                source = new SbisService({ endpoint: endpoint });

            source.call(methodName, cfg).addCallback(function(ds) {
                if (endpoint === "Excel") {
                    //TODO Не совсем хорошо, что контролы знают о LongOperations. Но пока не понятно, как сделать иначе.
                    EventBus.channel('LongOperations').notify('onOperationStarted');
                } else {
                    self._downloadFile(ds.getScalar());
                }
            });
        },

        /**
         * Загрузить файл по готовому id
         * @param id - уникальный идентификатор файла на сервисе file-transfer
         */
        _downloadFile : function(id){
            window.open(transHelpers.prepareGetRPCInvocationURL( 'File','Download', {'id': id}, undefined, '/file-transfer/service/'), '_self');
        },

        _parseColumns: function(columns) {
            var result = { Fields: [], Titles: [] };
            for (var i = 0; i < columns.length; i++) {
                result.Fields.push(columns[i].field);
                result.Titles.push(columns[i].title || columns[i].field);
            }
            return result;
        }
    });

    Di.register('savestrategy.sbis', SaveStrategySbis);

    return SaveStrategySbis;
});

/* global define  */
define('js!SBIS3.CONTROLS.SaveStrategy.Sbis', [
    'js!SBIS3.CONTROLS.SaveStrategy.Base',
    'Core/EventBus',
    'Core/core-functions',
    'Core/helpers/transport-helpers',
    'js!WS.Data/Source/SbisService',
    'js!WS.Data/Entity/Record',
    'Core/moduleStubs'
], function (SaveStrategyBase, EventBus, cFunctions, transHelpers, SbisService, Record, moduleStubs) {

    'use strict';

   /**
    * Стратегия для сохранения данных, умеющая работать с бизнес логикой.
    * @class SBIS3.CONTROLS.SaveStrategy.Sbis
    * @public
    * @extends SBIS3.CONTROLS.SaveStrategy.Base
    * @author Сухоручкин Андрей Сергеевич
    */

    var SaveStrategySbis = SaveStrategyBase.extend(/** @lends SBIS3.CONTROLS.SaveStrategy.Sbis.prototype */{

       /**
        * @typedef {Object} Meta
        * @property {Array} [columns] Колонки которые будут сохраняться.
        * @property {String} [xsl] Имя файла с xsl преобразованием.
        * @property {String} [endpoint] Имя объекта бизнес логики, который осуществляет сохранение данных.
        * Если endpoint не указан, данные выведутся на печать.
        * @property {String} [fileName] Имя сохраняемого файла.
        * @property {Boolean} [isExcel] Файл сохраняется в формате EXCEL.
        * @property {Number} [pageOrientation] Ориентация страниц при сохранении в PDF формат.
        * @property {WS.Data/Collection/RecordSet} [recordSet] Набор данных который будет сохранён.
        * @property {WS.Data/Query/Query} [query] Запрос, по которому будут получены данные для сохранения.
        */
       /**
        * Метод сохранения данных.
        * @param {Meta} meta - Методанные для сохранения.
        * @see SBIS3.CONTROLS.ISaveStrategy
        */
        saveAs: function (meta) {
            if (meta.endpoint) {
                this.saveToFile(meta);
            } else {
                SaveStrategySbis.superclass.saveAs.apply(this, arguments);
            }
        },

        saveToFile: function(meta) {
            if (meta.recordSet) {
                if (meta.serverSideExport) {
                   this.exportRecordSet(meta);
                } else {
                   this.exportHTML(meta);
                }
            } else if (meta.query) {
                if (meta.query.getWhere().selection) {
                   this.exportMarked(meta);
                } else {
                   this.exportList(meta);
                }
            }
        },

        exportHTML: function(meta) {
            var self = this;
            this._serializeData(meta.recordSet, meta.columns, meta.xsl).addCallback(function(html){
                self.exportFileTransfer('SaveHTML', {
                   html: html,
                   FileName: meta.fileName,
                   PageOrientation: meta.pageOrientation
                }, meta);
            });
        },

        exportRecordSet: function(meta) {
            var
               cfg = {
                  Data: meta.recordSet,
                  FileName: meta.fileName,
                  PageOrientation: meta.pageOrientation,
                  HierarchyField: meta.parentProperty && meta.endpoint !== 'PDF' ? meta.parentProperty : undefined
               };
            cFunctions.merge(cfg, this._parseColumns(meta.columns));

            this.exportFileTransfer('SaveRecordSet', cfg, meta);
        },

        exportList: function(meta) {
           var cfg = this._getFilterForList(meta);
           cfg.HierarchyField = meta.parentProperty && meta.endpoint !== 'PDF' ? meta.parentProperty : undefined;
           cfg.Pagination = this._prepareNavigation(meta.query.getOffset(), meta.query.getLimit(), meta.dataSource);
           cFunctions.merge(cfg, this._parseColumns(meta.columns));

           this.exportFileTransfer('SaveList', cfg, meta);
        },

        exportMarked: function(meta) {
           var cfg = this._getFilterForList(meta);
           cfg.HierarchyField = meta.parentProperty || null;
           cfg.Limit = 0;
           cFunctions.merge(cfg, this._parseColumns(meta.columns));

           this.exportFileTransfer('SaveMarked', cfg, meta);
        },

        /**
         * Универсальная выгрузка данных через сервис file-transfer
         * @param methodName
         * @param cfg
         * @param meta
         * @returns {Core/Deferred}
         */
        exportFileTransfer: function(methodName, cfg, meta) {
            var self = this,
                source = new SbisService({ endpoint: meta.endpoint });

            return source.call(methodName, cfg).addCallback(function(result) {
               //В престо и  рознице отключены длительные операции и выгрузка должна производиться по-старому
               //Через длительные операции производилась только выгрузка в Excel, поэтому проверяем endpoint
                if (self._useLongOperations(meta, methodName)) {
                    EventBus.channel('LongOperations').notify('onOperationStarted');
                } else {
                    self._downloadFile(result.getScalar(), meta.endpoint === "Excel" || meta.isExcel);
                }
            }).addErrback(function(error) {
               //Не показываем ошибку, если было прервано соединение с интернетом
               if (!error._isOfflineMode) {
                  moduleStubs.require(['js!SBIS3.CONTROLS.Utils.InformationPopupManager']).addCallback(function(manager) {
                     manager[0].showMessageDialog({
                        message: error.message,
                        status: 'error'
                     });
                  });
               }
               return error;
            });
        },

        /**
         * Загрузить файл по готовому id
         * @param id - уникальный идентификатор файла на сервисе file-transfer
         * @param isExcel - файл выгружается в формате EXCEL
         */
        _downloadFile : function(id, isExcel){
            var params = { 'id': id };
            if (isExcel) {
                params['storage'] = 'excel';
            }
            window.open(transHelpers.prepareGetRPCInvocationURL(isExcel ? 'FileTransfer' : 'File', 'Download', params, undefined, '/file-transfer/service/'), '_self');
        },

        _parseColumns: function(columns) {
            var result = { Fields: [], Titles: [] };
            for (var i = 0; i < columns.length; i++) {
                result.Fields.push(columns[i].field);
                result.Titles.push(columns[i].title || columns[i].field);
            }
            return result;
        },

         _prepareNavigation: function(offset, limit, dataSource) {
            var result = null;
            if (limit) {
               result = Record.fromObject({
                  'Страница': limit > 0 ? Math.floor(offset / limit) : 0,
                  'РазмерСтраницы': limit,
                  'ЕстьЕще': false
               }, dataSource.getAdapter());
            }
            return result;
         },

         _useLongOperations: function(meta, methodName) {
            return requirejs.defined('js!SBIS3.Engine.LongOperationsInformer') && (meta.endpoint === 'Excel' || meta.endpoint === 'PDF' && methodName === 'SaveMarked');
         },

         _getFilterForList: function(meta) {
            return {
               FileName: meta.fileName,
               MethodName: meta.dataSource.getEndpoint().contract + '.' + meta.dataSource.getBinding().query,
               PageOrientation: meta.pageOrientation,
               Filter: Record.fromObject(meta.query.getWhere(), meta.dataSource.getAdapter()),
               Sorting: meta.query.getOrderBy() ? Record.fromObject(meta.query.getOrderBy(), meta.dataSource.getAdapter()) : null
            };
         }
    });

    return SaveStrategySbis;
});

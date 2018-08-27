define('Controls/Printer/Utils', [
   'WS.Data/Entity/Record',
   'WS.Data/Collection/RecordSet',
   'Transport/prepareGetRPCInvocationURL',
   'WS.Data/Source/SbisService',
   'Core/EventBus'
], function(
   Record,
   RecordSet,
   prepareGetRPCInvocationURL,
   SbisService,
   EventBus
) {
   'use strict';

   var _private = {
      prepareSorting: function(query) {
         var
            result = null,
            orders = query.getOrderBy();

         if (orders.length > 0) {
            result = new RecordSet({
               adapter: 'adapter.sbis'
            });
            orders.forEach(function(order) {
               result.add(Record.fromObject({
                  n: order.getSelector(),
                  o: order.getOrder(),
                  l: !order.getOrder()
               }, 'adapter.sbis'));
            });
         }

         return result;
      },

      prepareNavigation: function(query, source) {
         var
            result = null,
            limit = query.getLimit(),
            offset = query.getOffset();

         if (limit) {
            result = Record.fromObject({
               'Страница': limit > 0 ? Math.floor(offset / limit) : 0,
               'РазмерСтраницы': limit,
               'ЕстьЕще': false
            }, source.getAdapter());
         }

         return result;
      },

      useLongOperations: function() {
         return requirejs.defined('SBIS3.ENGINE/Controls/LongOperation/Informer');
      }
   };

   return {
      normalizeQueryParams: function(query, params, source, useLongOperations) {
         var cfg = {
            MethodName: source.getEndpoint().contract + '.' + source.getBinding().query,
            Filter: Record.fromObject(query.getWhere(), source.getAdapter()),
            Fields: [],
            Sorting: _private.prepareSorting(query),
            Titles: [],
            HierarchyField: params.parentProperty || null,
            FileName: params.name,
            Pagination: _private.prepareNavigation(query, source),
            PageLandscape: params.pageOrientation || false,
            Sync: useLongOperations
         };

         params.columns.forEach(function(column) {
            cfg.Fields.push(column.field);
            cfg.Titles.push(column.title);
         });

         return cfg;
      },

      downloadFile: function(id, storage) {
         var params = {
            id: id,
            storage: storage
         };
         window.open(prepareGetRPCInvocationURL('FileTransfer', 'Download', params, undefined, '/file-transfer/service/'), '_self');
      },

      print: function(query, params, source, endpoint, serviceUrl) {
         var
            self = this,
            useLongOperations = _private.useLongOperations();

         new SbisService({
            endpoint: endpoint
         }).call('Save', this.normalizeQueryParams(query, params, source, useLongOperations)).addCallback(function(result) {
            if (useLongOperations) {
               EventBus.channel('LongOperations').notify('onOperationStarted');
            } else {
               self.downloadFile(result.getScalar(), serviceUrl);
            }
         });
      }
   };
});

/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.DataSourceBL', ['js!SBIS3.CONTROLS.DataSourceXHR'], function (DataSourceXHR) {
   'use strict';
   return DataSourceXHR.extend({
      $protected: {
         _options: {
            url: $ws._const.defaultServiceUrl,
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8'
         },
         _name: ''
      },
      $constructor: function (cfg) {
         if (cfg && typeof(cfg) == 'object') {
            if ('name' in cfg) {
               this._name = cfg.name;
            }
            if ('serviceUrl' in cfg) {
               this._options.url = cfg.serviceUrl;
            }
         } else if (typeof(cfg) == 'string') {
            this._name = cfg;
         }
         if (!this._name) {
            throw new Error('Name of the object must be specified then creating BLObject instance');
         }
      },

      _handleRPCError: function (dResult, method, args, response) {
         var
            error = response.error,
            transportError = new TransportError(
               error.message,
               '',
               error.code,
               method,
               error.details || '',
               this._options.url,
               error.data && error.data.classid || '',
               error.type || 'error',
               error.data && error.data.addinfo || ''
            );

         $ws.single.EventBus.channel('errors').notify('onRPCError', transportError);
         dResult.errback(transportError);
      },

      _handleHTTPError: function (dResult, method, args, error) {
         var errInst,
            payload;
         if (error instanceof HTTPError) {
            var message = error.message, details = '', code = 0, classid = '', errType = '', addinfo = '';
            try {
               payload = JSON.parse(error.payload);
               if (payload.error) {
                  message = payload.error.message || message;
                  details = payload.error.details;
                  code = payload.error.code;
                  if (payload.error.data) {
                     classid = payload.error.data.classid || classid;
                     addinfo = payload.error.data.addinfo || addinfo;
                  }
                  errType = payload.error.type;
               }
            } catch (e) {
            }
            errInst = new TransportError(message, error.httpError, code, method, details, error.url, classid, errType || 'error', addinfo || '');
            $ws.single.EventBus.channel('errors').notify('onRPCError', errInst);
         } else {
            errInst = error;
         }

         dResult.errback(errInst);
         if (errInst.processed) {
            error.processed = true;
         }
      },

      callMethod: function (method, args) {
         var dResult = new $ws.proto.Deferred(),
            rpcErrorHandler = this._handleRPCError.bind(this, dResult, method, args),
            httpErrorHandler = this._handleHTTPError.bind(this, dResult, method, args),
            req = $ws.helpers.jsonRpcPreparePacket(method, args),
            dExecute;
         dExecute = this.execute(req.reqBody, req.reqHeaders);
         if ($ws._const.debug) {
            dExecute.addCallbacks(
               function (r) {
                  $ws.single.ioc.resolve('ILogger').info(method, '(args:', args, ') =', 'error' in r ? r.error : r.result);
                  return r;
               },
               function (e) {
                  $ws.single.ioc.resolve('ILogger').info(method, '(args:', args, ') =', e ? e.details || e : e);
                  return e;
               }
            );
         }

         dExecute.addCallbacks(
            function (r) {
               r = r || {
                  error: {
                     message: 'Получен пустой ответ от сервиса',
                     code: '',
                     details: ''
                  }
               };
               if ('error' in r) {
                  // Это 200 ОК, но внутри - ошибка или нет JSON
                  rpcErrorHandler(r);
               }
               else {
                  // Пробросим результат дальше
                  dResult.callback(r.result);
               }
               return r;
            },
            function (e) {
               // НЕ 200 ОК, какая-то ошибка, возможно не просто HTTP.
               httpErrorHandler(e);
               return e;
            });
         return dResult;
      },

      query: function (method, filter, paging, sorting) {
         var self = this,
            def = new $ws.proto.Deferred();

         if (!method || typeof(method) != 'string') {
            throw new TypeError('Method name must be specified');
         }
         if (paging) {
            if (typeof paging != 'object') {
               throw new TypeError('Paging parameter must be an object');
            } else {
               if (paging.type) {
                  paging.page = +paging.page;
                  paging.pageSize = +paging.pageSize;
                  if (isNaN(paging.page)) {
                     throw new TypeError('Page must be a number (paging.page)');
                  }
                  if (isNaN(paging.pageSize)) {
                     throw new TypeError('Page size must be a number (paging.pageSize)');
                  }
               }
            }
         }
         if (sorting && !(sorting instanceof Array)) {
            throw new TypeError('Sorting parameter must be an array');
         }

         this.callMethod(this._name + '.' + method,
            // как то заполнить надо
            {'ДопПоля': [], 'Фильтр': {'d': [], 's': []}, 'Сортировка': null, 'Навигация': null}
         ).addCallback(function (result) {

               console.log(result);

               var model = new $ws.proto.RecordSet({dataSource: self, readerParams: { adapterType: 'TransportAdapterStatic', adapterParams: { data: result } } });

               var recursionFunction = function (rec) {
                  if (rec instanceof $ws.proto.Record) {
                     var columns = rec.getColumns();
                     for (var i = 0, l = columns.length; i < l; i++) {
                        recursionFunction(rec.get(columns[i]));
                     }
                  }
                  else if (rec instanceof $ws.proto.RecordSet) {
                     for (var j = 0, c = rec.getRecordCount(); j < c; j++) {
                        recursionFunction(rec.at(0));
                     }
                  }
               };

               recursionFunction(model);

               def.callback(model);
            });
         return def;
      },

      create: function () {
      },
      destroy: function () {
      },
      update: function () {
      }
   });
});
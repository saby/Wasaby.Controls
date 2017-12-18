define('/Source/Provider/SbisFileLoader', [
   'WS.Data/Source/Provider/SbisBusinessLogic',
   'WS.Data/Entity/OptionsMixin',
   'Transport/RPCJSON',
   'Transport/HTTPError',
   'Transport/XHRTransport',
   'WS.Data/Di',
   'Core/core-extend',
   'Core/Deferred'
], function (SbisBusinessLogic, OptionsMixin, RpcJson, HTTPError, XHRTransport, Di, CoreExtend, Deferred) {
    'use strict';

    var SbisFileLoader = CoreExtend.extend(SbisBusinessLogic, {
        _moduleName: '/Source/Provider/SbisFileLoader',
        /**
         * @cfg {String} Имя поля, в котором будет лежать тело запроса
         */
        _$requestField: 'Request',
        /**
         * @cfg {Function} Конструктор сетевого транспорта
         */
        _$transport: XHRTransport,
        /**
         * @cfg {Function} Конструктор обёртки над аргументами, содержащими файлы
         */
        _$argsWrapper: null,
        /**
         * Метод отправки запроса, содержащего файлы.
         * 1) для отправки файлов, они должны быть обёрнуты в FormData
         * 2) JsonRPC - не умеет адекватно отправлять FormData.
         *    Не все браузеры умеют FormData.get() - поэтому просто разрулить приём FormData внутри JsonRPC не выйдет
         * Поэтому пока обходимся решением этих проблем тут. В дальнейшем надо смотреть в сторону  расширение api транспорта
         *
         * @param {String} method
         * @param args
         * @return {Core/Deferred}
         * @private
         */
        call: function (method, args) {
            // Если не задан конструктор обёртки над агрументами, либо аргументы не являются экземпляром обёртки, то нет необходимости собить FormData и вызываем родительский метод
            if ((typeof this._$argsWrapper !== 'function') || !(args instanceof this._$argsWrapper)) {
                return SbisBusinessLogic.prototype.call.apply(this, arguments);
            }
            var endpoint = this.getEndpoint();
            if ((method.indexOf('.') === -1) && endpoint.contract) {
                method = endpoint.contract + this._nameSpaceSeparator + method;
            }
            var def;
            var transport = new this._$transport({
                contentType: false,
                processData: false,
                dataType: 'json',
                method: 'POST',
                url: endpoint.address
            });
            var _args = this._prepareRPCArgs(method, args);
            def = transport.execute(_args.requestBody, _args.reqHeaders);
            // TODO пока что здесь, выкинуть в Transport
            def.addCallbacks(function (result) {
               var json = result || RpcJson.getEmptyRpcResponse();
                return ('error' in json)?
                   RpcJson.handleRPCError(json.error, method, endpoint.address):
                   json.result;
            }, function (error) {
               return RpcJson.handleHTTPError(error, method)
            });
            return def;
        },
        _prepareRPCArgs: function (method, args) {
            var rpcArgs = RpcJson.jsonRpcPreparePacket(method, args.getBody());
            new RpcJson()._setHeaders(rpcArgs, 'post');
            args.setBody(rpcArgs.reqBody);
            return {
                requestBody: this._createFormData(args),
                reqHeaders: rpcArgs.reqHeaders
            };
        },
        _createFormData: function (args) {
            var formData = new FormData();
            formData.append(this._$requestField, args.getBody());
            args.getFiles().forEach(function (fileWrapper) {
                formData.append(fileWrapper.name, fileWrapper.file);
            });
            return formData;
        }
    });

    Di.register('source.provider.sbis-file', SbisFileLoader);

    return SbisFileLoader;
});

/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Source.Provider.SbisBusinessLogic', [
   'js!SBIS3.CONTROLS.Data.Source.Provider.IRpc',
   'js!SBIS3.CONTROLS.Data.Di'
], function (IRpc, Di) {
    'use strict';

    /**
     * JSON-RPC Провайдер для бизнес-логики СБиС
     * @class SBIS3.CONTROLS.Data.Source.Provider.SbisBusinessLogic
     * @mixes SBIS3.CONTROLS.Data.Source.Provider.IRpc
     * @public
     * @author Мальцев Алексей
     */
    var SbisBusinessLogic = $ws.core.extend({}, [IRpc], {
       _moduleName: 'SBIS3.CONTROLS.Data.Source.Provider.SbisBusinessLogic',

       $protected: {
          _options: {
             /**
              * @cfg {Endpoint} Конечная точка, обеспечивающая доступ клиента к БЛ
              * @see getEndPoint
              * @example
              * <pre>
              *    var dataSource = new SbisBusinessLogic({
              *       endpoint: {
              *          address: '/service/url/',
              *          contract: 'Сотрудник'
              *       }
              *    });
              * </pre>
              */
             endpoint: {}
          },

          /**
           * @member {$ws.proto.ClientBLObject} Инстанс $ws.proto.ClientBLObject, в который пробрасываем вызовы
           */
          _client: null
       },

       $constructor: function (cfg) {
          cfg = cfg || {};
          //Deprecated
          if ('resource' in cfg && !('endpoint' in cfg)) {
             $ws.single.ioc.resolve('ILogger').info(this._moduleName + '::$constructor()', 'Option "resource" is deprecated and will be removed in 3.7.4. Use "endpoint.contract" instead.');
             this._options.endpoint.contract = this._options.resource;
          }
          if ('service' in cfg && !('endpoint' in cfg)) {
             $ws.single.ioc.resolve('ILogger').info(this._moduleName + '::$constructor()', 'Option "service" is deprecated and will be removed in 3.7.4. Use "endpoint.address" instead.');
             this._options.endpoint.address = this._options.service;
          }

          var config = {};
          if (this._options.endpoint.contract) {
             config.name = this._options.endpoint.contract;
          }
          if (this._options.endpoint.address) {
             config.serviceUrl = this._options.endpoint.address;
          }
          this._client = new $ws.proto.ClientBLObject(config);
       },

       /**
        * Возвращает конечную точку, обеспечивающую доступ клиента к функциональным возможностям БЛ
        * @returns {Endpoint}
        * @see endpoint
        */
       getEndpoint: function () {
          return this._options.endpoint;
       },

       /**
        * Возвращает адрес удаленного сервиса
        * @returns {String}
        * @deprecated Метод будет удален в 3.7.4, используйте getEndpoint
        */
       getService: function () {
          $ws.single.ioc.resolve('ILogger').info(this._moduleName + '::getService()', 'Method is deprecated and will be removed in 3.7.4. Use "getEndpoint" instead.');
          return this._options.service || '';
       },

       /**
        * Возвращает ресурс, с которым работает источник
        * @returns {String}
        * @deprecated Метод будет удален в 3.7.4, используйте getEndpoint
        */
       getResource: function () {
          $ws.single.ioc.resolve('ILogger').info(this._moduleName + '::getResource()', 'Method is deprecated and will be removed in 3.7.4. Use "getEndpoint" instead.');
          return this._options.resource || '';
       },

       call: function(method, args) {
          return this._client.call(
             method,
             args,
             $ws.proto.BLObject.RETURN_TYPE_ASIS
          );
       }
    });

   Di.register('source.provider.sbis-business-logic', SbisBusinessLogic);

   return SbisBusinessLogic;
});
/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Source.Provider.SbisBusinessLogic', [
   'js!SBIS3.CONTROLS.Data.Source.Provider.IRpc',
   'js!SBIS3.CONTROLS.Data.Di',
   'js!SBIS3.CONTROLS.Data.Utils'
], function (IRpc, Di, Utils) {
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
             Utils.logger.stack(this._moduleName + '::$constructor(): option "resource" is deprecated and will be removed in 3.7.4. Use "endpoint.contract" instead.', 1);
             this._options.endpoint.contract = this._options.resource;
          }
          if ('service' in cfg && !('endpoint' in cfg)) {
             Utils.logger.stack(this._moduleName + '::$constructor(): option "service" is deprecated and will be removed in 3.7.4. Use "endpoint.address" instead.', 1);
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
        * @deprecated Метод будет удален в 3.7.4, используйте getEndpoint().address
        */
       getService: function () {
          Utils.logger.stack(this._moduleName + '::getService(): method is deprecated and will be removed in 3.7.4. Use "getEndpoint().address" instead.');
          return this._options.service || '';
       },

       /**
        * Возвращает ресурс, с которым работает источник
        * @returns {String}
        * @deprecated Метод будет удален в 3.7.4, используйте getEndpoint().contract
        */
       getResource: function () {
          Utils.logger.stack(this._moduleName + '::getResource(): method is deprecated and will be removed in 3.7.4. Use "getEndpoint().contract" instead.');
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
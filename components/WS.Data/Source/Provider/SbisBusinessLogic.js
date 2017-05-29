/* global define */
define('js!WS.Data/Source/Provider/SbisBusinessLogic', [
   'js!WS.Data/Source/Provider/IRpc',
   'js!WS.Data/Entity/OptionsMixin',
   'Transport/RPCJSON',
   'js!WS.Data/Di',
   'js!WS.Data/Utils',
   'Core/core-extend'
], function (
   IRpc,
   OptionsMixin,
   RpcJson,
   Di,
   Utils,
   CoreExtend
) {
    'use strict';

    /**
     * JSON-RPC Провайдер для бизнес-логики СБиС
     * @class WS.Data/Source/Provider/SbisBusinessLogic
     * @implements WS.Data/Source/Provider/IRpc
     * @mixes WS.Data/Entity/OptionsMixin
     * @public
     * @author Мальцев Алексей
     */
    var SbisBusinessLogic = CoreExtend.extend([IRpc, OptionsMixin], {
       _moduleName: 'WS.Data/Source/Provider/SbisBusinessLogic',

       /**
        * @cfg {Endpoint} Конечная точка, обеспечивающая доступ клиента к БЛ
        * @name WS.Data/Source/Provider/SbisBusinessLogic#endpoint
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
       _$endpoint: null,

       /**
        * @cfg {Function} Конструктор сетевого транспорта
        */
       _$transport: RpcJson,

       /**
        * @member {String} Разделитель пространств имен
        */
       _nameSpaceSeparator: '.',

       constructor: function $SbisBusinessLogic(options) {
          this._$endpoint = {};
          OptionsMixin.constructor.call(this, options);
       },

       /**
        * Возвращает конечную точку, обеспечивающую доступ клиента к функциональным возможностям БЛ
        * @return {Endpoint}
        * @see endpoint
        */
       getEndpoint: function () {
          return this._$endpoint;
       },

       call: function(method, args) {
          method = method + '';

          var endpoint = this.getEndpoint(),
             Transport = this._$transport,
             overrideContract = method.indexOf('.') > -1;

          if (!overrideContract && endpoint.contract) {
             method = endpoint.contract + this._nameSpaceSeparator + method;
          }
          return new Transport({
             serviceUrl: endpoint.address
          }).callMethod(method, args);
       }
    });

   Di.register('source.provider.sbis-business-logic', SbisBusinessLogic);

   return SbisBusinessLogic;
});

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
              * @cfg {String} Адрес удаленного сервиса
              * @see getService
              * @example
              * <pre>
              *    var dataSource = new SbisBusinessLogic({
             *       service: '/service/url/',
             *    });
              * </pre>
              */
             service: '',

             /**
              * @cfg {String} Имя объекта бизнес-логики
              * @see getResource
              * @example
              * <pre>
              *    var dataSource = new SbisBusinessLogic({
             *       resource: 'Сотрудник',
             *    });
              * </pre>
              */
             resource: ''
          },

          /**
           * @member {$ws.proto.ClientBLObject} Инстанс $ws.proto.ClientBLObject, в который пробрасываем вызовы
           */
          _client: null
       },

       $constructor: function () {
          var config = {
             name: this._options.resource
          };
          if (this._options.service) {
             config.serviceUrl = this._options.service;
          }
          this._client = new $ws.proto.ClientBLObject(config);
       },

       /**
        * Возвращает адрес удаленного сервиса
        * @returns {String}
        * @see service
        */
       getService: function () {
          return this._options.service;
       },

       /**
        * Возвращает ресурс, с которым работает источник
        * @returns {String}
        * @see resource
        */
       getResource: function () {
          return this._options.resource;
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
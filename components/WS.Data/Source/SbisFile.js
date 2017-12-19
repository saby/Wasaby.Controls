define('/Source/SbisFile', [
   'WS.Data/Source/SbisService',
   'Lib/File/LocalFile',
   '/Source/Provider/SbisFileLoader'
], function (SbisService, LocalFile) {
   'use strict';

   /**
    * Обёртка над аргументами вызова, передаваемая в провайдер
    * @param {*} requestBody
    * @param {Array<{name: string, file: Blob|File}>} files
    * @constructor
    */
   function ArgsWrapper(requestBody, files) {
      var body = requestBody;

      /**
       * @return {Array.<{name: string, file: (Blob|File)}>|Array}
       */
      this.getFiles = function () {
         return files || [];
      };
      this.getBody = function () {
         return body;
      };
      this.setBody = function (requestBody) {
         body = requestBody;
      };
   }

   function getRPCFile(href) {
       return {
           'Данные': {
               'href': href
           }
       };
   }

   var SbisFile = SbisService.extend(/** @lends /Source/SbisFile.prototype */ {
       /**
        * @cfg {String} Имя поля, в котором будет лежать тело запроса
        */
       _$requestField: 'Запрос',

       _$provider: 'source.provider.sbis-file',

      /**
       * @cfg {Function} Конструктор обёртки над аргументами, содержащими файлы
       */
       _$argsWrapper: ArgsWrapper,

       _prepareCreateArguments: function (args) {
           var _meta = this._wrapArgs(args);
           if (!_meta.getFiles().length) {
               return SbisFile.superclass._prepareCreateArguments.call(this, args);
           }
           return _meta;
       },

       _prepareArgumentsForCall: function (args) {
           if (args instanceof this._$argsWrapper) {
               args.setBody(SbisFile.superclass._prepareArgumentsForCall.call(this, args.getBody()));
               return args;
           }
           return SbisFile.superclass._prepareArgumentsForCall.call(this, args);
       },

       /**
        *
        * @param {*} meta
        * @return {ArgsWrapper}
        * @private
        */
       _wrapArgs: function (meta) {
           if (meta === void 0) {
              meta = {};
           }

           var fileCount = 0,
            files = [],
            requestBody = meta;

           // replace LocalFile to RPCFile
           for (var key in meta) {
               if ((meta.hasOwnProperty(key)) && (meta[key] instanceof LocalFile)) {
                   var name1 = '_file-' + fileCount;
                   fileCount++;
                   files.push({
                       name: name1,
                       file: meta[key].getData()
                   });
                   meta[key] = getRPCFile(name1);
               }
           }

           return new this._$argsWrapper(requestBody, files);
       },

       /**
        * Возвращает объект, реализующий сетевой протокол для обмена в режиме клиент-сервер
        * @return {WS.Data/Source/Provider/IAbstract}
        * @see provider
        */
       getProvider: function () {
           return (this._$provider = this._getProvider(this._$provider, {
               endpoint: this._$endpoint,
               options: this._$options,
               requestField: this._$requestField,
               argsWrapper: this._$argsWrapper
           }));
       }
   });

   return SbisFile;
});

/**
 * Вспомогательный класс для вызова sbis-сервисов
 *
 * @public
 * @class SBIS3.CONTROLS/Utils/ImportExport/RemoteCall
 */
define('SBIS3.CONTROLS/Utils/ImportExport/RemoteCall',
   [
      'Core/core-merge',
      'WS.Data/Source/SbisService'
   ],

   function (cMerge, SbisService) {
      'use strict';

      /**
       * Вспомогательный класс для вызова sbis-сервисов
       * При вызове единственного метода call аргументы вызова sbis-сервиса формируются следующим образом. Если указан входной фильтр argsFilter, то он будет вызван со входными данными метода call. Полученный результат будет добавлен к значению args, если оно задано. С этими данными будет вызван sbis-сервис и к полученному результату будет применён фильтр результата resultFilter если он есть. Полученным значением будет разрешено обещание, возвращаемое методом call
       *
       * @public
       * @constructor
       * @param {object} options Входные аргументы:
       * @param {string} options.endpoint Сервис, метод которого будет вызван
       * @param {string} options.method Имя вызываемого метода
       * @param {string} [options.idProperty] Имя свойства, в котором находится идентификатор (опционально, если вызову это не потребуется)
       * @param {object} [options.args] Аргументы вызываемого метода (опционально)
       * @param {function(object):object} [options.argsFilter] Фильтр аргументов (опционально)
       * @param {function(object):object} [options.resultFilter] Фильтр результатов (опционально)
       */
      var RemoteCall = function (options) {
         if (!options || typeof options !== 'object') {
            throw new Error('No arguments');
         }
         if (!options.endpoint || typeof options.endpoint !== 'string') {
            throw new Error('Wrong endpoint');
         }
         if (!options.method || typeof options.method !== 'string') {
            throw new Error('Wrong method');
         }
         if (options.idProperty && typeof options.idProperty !== 'string') {
            throw new Error('Wrong idProperty');
         }
         if (options.args && typeof options.args !== 'object') {
            throw new Error('Wrong args');
         }
         if (options.argsFilter && typeof options.argsFilter !== 'function') {
            throw new Error('Wrong argsFilter');
         }
         if (options.resultFilter && typeof options.resultFilter !== 'function') {
            throw new Error('Wrong resultFilter');
         }
         this._endpoint = options.endpoint;
         this._method = options.method;
         this._idProperty = options.idProperty;
         this._args = options.args;
         this._argsFilter = options.argsFilter;
         this._resultFilter = options.resultFilter;
      };

      RemoteCall.prototype = /**@lends SBIS3.CONTROLS/Utils/ImportExport/RemoteCall.prototype*/ {
         /**
          * Вызвать метод удалённого сервиса
          *
          * @public
          * @param {object} data Входные данные
          * return {Core/Deferred}
          */
         call: function (data) {
            if (!data || typeof data !== 'object') {
               throw new Error('No arguments');
            }
            var args = data ? cMerge({}, data) : undefined;
            if (this._argsFilter) {
               args = this._argsFilter.call(null, args);
            }
            if (this._args) {
               args = args ? cMerge(cMerge({}, this._args), args) : this._args;
            }
            var promise = (new SbisService({endpoint:this._endpoint, idProperty:this._idProperty || undefined})).call(this._method, args);
            if (this._resultFilter) {
               promise.addCallback(this._resultFilter);
            }
            return promise;
         }
      };

      return RemoteCall;
   }
);

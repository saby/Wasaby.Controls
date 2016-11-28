/**
 * Created by am.gerasimov on 12.01.2016.
 */
define('js!SBIS3.CONTROLS.HistoryController', [
   "Core/SessionStorage",
   "Core/Abstract",
   "Core/UserConfig",
   "Core/helpers/string-helpers",
   "Core/Deferred",
   "Core/helpers/functional-helpers",
   "Core/ConsoleLogger",
   "Core/constants"
], function( cSessionStorage, cAbstract, UserConfig, strHelpers, Deferred, fHelpers, ConsoleLogger, constants) {

   'use strict';

   var serializeFnc = function(serialize, value) {
      return value ? strHelpers[serialize ? 'serializeURLData' : 'deserializeURLData'](value) : null;
   };


   /* Пока нет нормального способа, используя некий интерфейс сохранять параметры,
      то смотрю на флаг globalConfigSupport (поддерживаются ли пользовательский параметры),
      и сохраняю? используя UserConfig в пользоватльские параметры, иначе кладу в localStorage.
      Задача по этому поводу:
      https://inside.tensor.ru/opendoc.html?guid=5b44aa05-a1c8-4052-9cd7-88b50519588b&description=
      Задача в разработку 25.10.2016 Нужен платформенный интерфейс, позволяющий работать с параметрами, которые запоминаются в длитель...
   */
   var setParam = function(key, value, serializer) {
      var serializedValue = serializer(true, value);

      if(constants.userConfigSupport) {
         /* Запись в пользовательские параметры не производит записи SessionStorage,
            поэтому в рамках одной сессии может возникать разница в значениях,
            которые хранятся в параметрах пользователя / SessionStorage. Для этого,
            при записи в пользовательские параметры, запишем значение и в SessionStorage. */
         cSessionStorage.set(key, serializedValue);
         return UserConfig.setParam(key, serializedValue, true);
      } else {
         fHelpers.setLocalStorageValue(key, serializedValue);
         return Deferred.success();
      }
   };

   var getParam = function(key, serializer) {
      var serializedValue;

      try {
         serializedValue = serializer(false, constants.userConfigSupport ? cSessionStorage.get(key) :  fHelpers.getLocalStorageValue(key));
      } catch (e) {
         ConsoleLogger.error('HistoryController', e.message, e);
         serializedValue = null;
      }

      return serializedValue;
   };
   /**************************************************************/

   /**
    * Контроллер, который предоставляет базовые механизмы работы с иторией.
    * @author Герасимов Александр Максимович
    * @public
    */
   var HistoryController = cAbstract.extend([],/** @lends SBIS3.CONTROLS.HistoryController.prototype */{
      $protected: {
         _options: {
            /**
             * Специальный id по которому будет загружаться/сохраняться история
             * @cfg {String}
             */
            historyId: undefined,
            /**
             * Функция для сериализации и десериализации
             * По-умолчанию используется serializeURLData/deserializeURLData
             * @cfg {Function}
             * @example
             * Сделаем сериализатор для даты
             * <pre>
             *    serialize: function( serialize, value ){
             *       return serialize ? value.toSQL() : Date.fromSQL( value );
             *    }
             * </pre>
             */
            serialize: serializeFnc
         },
         _saveParamsDeferred: undefined,     /* Деферед сохранения истории */
         _history: undefined                 /* История */
      },

      $constructor: function() {
         this._history = getParam(this._options.historyId, this._options.serialize);
      },

      /**
       * Возвращает историю
       * @returns {Object|null}
       */
      getHistory: function() {
         return this._history;
      },

      /**
       * Устанавливает и сохраняет историю
       * @param {*} history История
       * @param {Boolean} needSave Нужно ли сохранять историю в пользовательские параметры
       * @returns {Deferred}
       */
      setHistory: function(history, needSave) {
         this._history = history;
         if(needSave) {
            this.saveHistory();
         }
      },

      /**
       * Сохраняет историю в пользовательские параметры
       * @private
       */
      saveHistory: function() {
         var self = this;

         if(!this.isNowSaving()) {
            this._saveParamsDeferred = new Deferred();

            setParam(this._options.historyId, this._history, this._options.serialize).addCallback(fHelpers.forAliveOnly(function() {
               self._saveParamsDeferred.callback();
            }, self));
         }

         return this._saveParamsDeferred;

      },

      /**
       * Очищает историю
       */
      clearHistory: function() {
         this.setHistory(null, true);
      },

      /**
       * Возвращает, сохраняется ли сейчас история
       * @returns {Deferred|*|boolean}
       */
      isNowSaving: function() {
         return this._saveParamsDeferred && !this._saveParamsDeferred.isReady()
      },

      /**
       * Возвращает деферед сохранения истории (если она сейчас сохраняется)
       * @returns {Deferred|*|boolean}
       */
      getSaveDeferred: function() {
         return this._saveParamsDeferred
      },


      destroy: function() {
         if(this._saveParamsDeferred) {
            this._saveParamsDeferred.cancel();
            this._saveParamsDeferred = undefined;
         }
         HistoryController.superclass.destroy.call(this);
      }
   });

   return HistoryController;

});
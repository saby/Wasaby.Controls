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
   "Core/ConsoleLogger"
], function( cSessionStorage, cAbstract, UserConfig, strHelpers, Deferred, fHelpers, ConsoleLogger) {

   'use strict';

   var serializeFnc = function(serialize, value) {
      return value ? strHelpers[serialize ? 'serializeURLData' : 'deserializeURLData'](value) : null;
   };

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
         var serializedHistory;

         try {
            serializedHistory = this._options.serialize(false, cSessionStorage.get(this._options.historyId));
         } catch (e) {
            ConsoleLogger.error('HistoryController', e.message, e);
            serializedHistory = null;
         }
         this._history = serializedHistory;
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

            UserConfig.setParam(this._options.historyId, this._options.serialize(true, this._history), true).addCallback(fHelpers.forAliveOnly(function() {
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
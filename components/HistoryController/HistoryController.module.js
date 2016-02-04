/**
 * Created by am.gerasimov on 12.01.2016.
 */
define('js!SBIS3.CONTROLS.HistoryController', [], function() {

   'use strict';

   var serializeFnc = function(serialize, value) {
      return value ? $ws.helpers[serialize ? 'serializeURLData' : 'deserializeURLData'](value) : null;
   };

   /**
    * Контроллер, который предоставляет базовые механизмы работы с иторией.
    * @author Герасимов Александр Максимович
    * @public
    */
   var HistoryController = $ws.proto.Abstract.extend([],/** @lends SBIS3.CONTROLS.HistoryController.prototype */{
      $protected: {
         _options: {
            /**
             * Специальный id по которому будет загружаться/сохраняться история
             * @cfg {String}
             */
            historyId: undefined
         },
         _saveParamsDeferred: undefined,     /* Деферед сохранения истории */
         _history: undefined                 /* История */
      },

      $constructor: function() {
         this._history = serializeFnc(false, $ws.single.SessionStorage.get(this._options.historyId));
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
       * @returns {$ws.proto.Deferred}
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
            this._saveParamsDeferred = new $ws.proto.Deferred();

            $ws.single.UserConfig.setParam(this._options.historyId, serializeFnc(true, this._history), true).addCallback($ws.helpers.forAliveOnly(function() {
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
       * @returns {$ws.proto.Deferred|*|boolean}
       */
      isNowSaving: function() {
         return this._saveParamsDeferred && !this._saveParamsDeferred.isReady()
      },

      /**
       * Возвращает деферед сохранения истории (если она сейчас сохраняется)
       * @returns {$ws.proto.Deferred|*|boolean}
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
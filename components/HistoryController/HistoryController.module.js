/**
 * Created by am.gerasimov on 12.01.2016.
 */
define('js!SBIS3.CONTROLS.HistoryController', [
   "Core/EventBus",
   "Core/SessionStorage",
   "Core/Abstract",
   "Core/UserConfig",
   "Core/helpers/string-helpers",
   "Core/Deferred",
   "Core/helpers/functional-helpers",
   "Core/ConsoleLogger",
   "Core/constants",
   "js!SBIS3.CORE.LocalStorage"
], function( EventBus, cSessionStorage, cAbstract, UserConfig, strHelpers, Deferred, fHelpers, ConsoleLogger, constants, LocalStorage ) {

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
            serialize: serializeFnc,
            /**
             * Значение истории, которое устанвится при сбросе
             * @cfg {*}
             */
            emptyValue: null
         },
         _saveParamsDeferred: undefined,     /* Деферед сохранения истории */
         _history: undefined                 /* История */,
         _historyChannel: null
      },

      $constructor: function() {
         var self = this;
         
         this._publish('onHistoryUpdate');
         this._history = this._getParam(this._options.historyId, this._options.serialize);
         this._getLocalStorage();
   
         this._historyChannel = EventBus.channel('HistoryChannel' + this._options.historyId);
         this._historyChannel.subscribe('onHistoryUpdate', function(event, history) {
            self._history = history;
            self._notify('onHistoryUpdate', history);
         });
      },

      _setParam: function(value) {
         var serializedValue = this._options.serialize(true, value),
             key = this._options.historyId;

         /* Запись в пользовательские параметры не производит записи SessionStorage,
            поэтому в рамках одной сессии может возникать разница в значениях,
            которые хранятся в параметрах пользователя / SessionStorage. Для этого,
            при записи в пользовательские параметры, запишем значение и в SessionStorage.
            + надо записывать в LocalStorage, чтобы не было рассинхрона истории на разных вкладках. */
         this._getLocalStorage().setItem(key, serializedValue);
         cSessionStorage.set(key, serializedValue);

         /* Пока нет нормального способа, используя некий интерфейс сохранять параметры,
          то смотрю на флаг globalConfigSupport (поддерживаются ли пользовательский параметры),
          и сохраняю? используя UserConfig в пользоватльские параметры, иначе кладу в localStorage.
          Задача по этому поводу:
          https://inside.tensor.ru/opendoc.html?guid=5b44aa05-a1c8-4052-9cd7-88b50519588b&description=
          Задача в разработку 25.10.2016 Нужен платформенный интерфейс, позволяющий работать с параметрами, которые запоминаются в длитель...
          */
         if(constants.userConfigSupport) {
            return UserConfig.setParam(key, serializedValue, true);
         } else {
            return Deferred.success();
         }
      },

      _getParam: function() {
         var serializedValue,
             key = this._options.historyId;

         try {
            serializedValue = this._options.serialize(false, constants.userConfigSupport ? cSessionStorage.get(key) :  this._getLocalStorage().getItem(key));
         } catch (e) {
            ConsoleLogger.error('HistoryController', e.message, e);
            serializedValue = null;
         }

         return serializedValue;
      },

      _getLocalStorage: function() {
         if(!this._localStorage) {
            this._localStorage = new LocalStorage(this._options.historyId);
            this._localStorage.subscribe('onChange', function(event, key) {
               /* Пока нет нормального механизма хранения данных (хранилища),
                  в планах на январь фервраль. Пока просто подписываюсь на изменения LocalStorage. */
               if(key === this._options.historyId) {
                  cSessionStorage.set(this._options.historyId, this._localStorage.getItem(key));
               }
            }.bind(this));
         }
         return this._localStorage;
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

            this._setParam(this._history).addCallback(fHelpers.forAliveOnly(function() {
               self._saveParamsDeferred.callback();
            }, self));
            this._historyChannel.notify('onHistoryUpdate', this._history);
         }

         return this._saveParamsDeferred;

      },

      /**
       * Очищает историю
       */
      clearHistory: function() {
         this.setHistory(this._options.emptyValue, true);
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
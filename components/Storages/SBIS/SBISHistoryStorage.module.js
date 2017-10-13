/**
 * Created by am.gerasimov on 18.01.2017.
 */
define('js!SBIS3.CONTROLS.SBISHistoryStorage', [
   "Core/EventBus",
   "js!SBIS3.CONTROLS.SessionStorage",
   "js!SBIS3.CONTROLS.SBISUserConfigStorage",
   "js!SBIS3.CONTROLS.SBISClientsGlobalConfigStorage",
   "Core/Abstract",
   'Core/helpers/string-helpers-min',
   "Core/Deferred",
   "Core/helpers/Function/forAliveOnly",
   "Core/IoC",
   "Core/constants",
   "js!SBIS3.CORE.LocalStorage"
], function(EventBus, cSessionStorage, SBISUserConfigStorage, SBISClientsGlobalConfigStorage, cAbstract, strHelpersMin, Deferred, forAliveOnly, IoC, constants, LocalStorage ) {

   'use strict';

   var serializeFnc = function(serialize, value) {
      return value ? strHelpersMin[serialize ? 'serializeURLData' : 'deserializeURLData'](value) : null;
   };

   /* Постфикс для хранения данных в глобальных параметрах клиента */
   var GLOBAL_POSTFIX = '-global';
   /* Т.к. история для всех контроллеров общая,
      то ради экономии памяти и оптимизации сериализации храним в общем объекте.
      В случае разрушение всех экземпляров, которые ссылаются на один id,
      история из объекта удаляется */
   var STORAGES = {};

   /**
    * Контроллер, который предоставляет базовые механизмы работы с историей.
    * @author Герасимов Александр Максимович
    * @class SBIS3.CONTROLS.SBISHistoryStorage
    * @public
    */
   var SBISHistoryStorage = cAbstract.extend([],/** @lends SBIS3.CONTROLS.SBISHistoryStorage.prototype */{
      $protected: {
         _options: {
            /**
             * @cfg {String} Устанавливает специальный id, по которому будет загружаться/сохраняться история.
             */
            historyId: undefined,
            /**
             * @cfg {Function} Функция для сериализации и десериализации.
             * @remark
             * По-умолчанию используется {@link Core/helpers/string-helpers#serializeURLData} и {@link Core/helpers/string-helpers#deserializeURLData}.
             * @example
             * Сделаем сериализатор для даты:
             * <pre>
             *    serialize: function(serialize, value) {
             *       return serialize ? value.toSQL() : Date.fromSQL(value);
             *    }
             * </pre>
             */
            serialize: serializeFnc,
            /**
             * @cfg {*} Устанавливает значение истории, которое будет использовано в качестве значения при сбросе.
             */
            emptyValue: null,
            /**
             * @cfg {Boolean} Устанавливает сохранение в глобальные параметры клиента.
             */
            isGlobalUserConfig: false
         },
         _saveParamsDeferred: undefined,     /* Деферед сохранения истории */
         _history: undefined                 /* История */,
         _historyChannel: null,
         _SBISStorage: null
      },

      $constructor: function() {
         this._publish('onHistoryUpdate');

         if(this._options.isGlobalUserConfig) {
            this._options.historyId = this._options.historyId + GLOBAL_POSTFIX;
            this._SBISStorage = SBISClientsGlobalConfigStorage;
         } else {
            this._SBISStorage = SBISUserConfigStorage;
         }

         /* Чтобы проинициализировать localStorage, требуется,
            чтобы отслеживать изменения в localStorage */
         this._getLocalStorage();
         this._updateHistory = this._updateHistory.bind(this);
         
         this._historyChannel = EventBus.channel('HistoryChannel' + this._options.historyId);
         this._historyChannel.subscribe('onHistoryUpdate', this._updateHistory);
      },
      
      _updateHistory: function(event, history, store) {
         if(store !== this) {
            this._history = history;
            this._notify('onHistoryUpdate', history);
         }
      },

      _setStorageValue: function(value) {
         var serializedValue = this._options.serialize(true, value),
             key = this._options.historyId;

         /* Запись в пользовательские параметры не производит записи SessionStorage,
          поэтому в рамках одной сессии может возникать разница в значениях,
          которые хранятся в параметрах пользователя / SessionStorage. Для этого,
          при записи в пользовательские параметры, запишем значение и в SessionStorage.
          + надо записывать в LocalStorage, чтобы не было рассинхрона истории на разных вкладках. */
         this._getLocalStorage().setItem(key, serializedValue);
         cSessionStorage.setItem(key, serializedValue);
         STORAGES[this._options.historyId] = value;

         /* Пока нет нормального способа, используя некий интерфейс сохранять параметры,
          то смотрю на флаг globalConfigSupport (поддерживаются ли пользовательский параметры),
          и сохраняю? используя UserConfig в пользоватльские параметры, иначе кладу в localStorage.
          Задача по этому поводу:
          https://inside.tensor.ru/opendoc.html?guid=5b44aa05-a1c8-4052-9cd7-88b50519588b&description=
          Задача в разработку 25.10.2016 Нужен платформенный интерфейс, позволяющий работать с параметрами, которые запоминаются в длитель...
          */
         if(constants.userConfigSupport) {
            return this._SBISStorage.setItem(key, serializedValue);
         } else {
            this._getLocalStorage().setItem(key, serializedValue);
            return Deferred.success();
         }
      },

      _getStorageValue: function() {
         var key = this._options.historyId,
            value, serializedValue;

         try {
            value = constants.userConfigSupport ? cSessionStorage.getItem(key) :  this._getLocalStorage().getItem(key);
            /* В хранилище уже может лежать сериализованое значение, а не строка */
            serializedValue = (!value || typeof value === "string") ? this._options.serialize(false, value) : value;
         } catch (e) {
            IoC.resolve('ILogger').error('HistoryController', e.message, e);
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
                  cSessionStorage.setItem(this._options.historyId, this._localStorage.getItem(key));
               }
            }.bind(this));
         }
         return this._localStorage;
      },

      /**
       * Возвращает историю.
       * @returns {Object|null}
       * @see setHistory
       * @see saveHistory
       * @see clearHistory
       */
      getHistory: function() {
         if(!this._history) {
            if(!STORAGES[this._options.historyId]) {
               STORAGES[this._options.historyId] = this._getStorageValue();
            }
            this._history = STORAGES[this._options.historyId];
         }
         return this._history;
      },

      /**
       * Устанавливает и сохраняет историю.
       * @param {*} history История
       * @param {Boolean} needSave Нужно ли сохранять историю в пользовательские параметры.
       * @returns {Deferred}
       * @see getHistory
       * @see saveHistory
       * @see clearHistory
       */
      setHistory: function(history, needSave) {
         this._history = history;
         if(needSave) {
            this.saveHistory();
         }
      },

      /**
       * Сохраняет историю в пользовательские параметры.
       * @private
       * @see setHistory
       * @see getHistory
       * @see clearHistory
       */
      saveHistory: function() {
         var self = this;

         if (!this.isNowSaving()) {
            this._saveParamsDeferred = new Deferred();

            this._setStorageValue(this._history).addCallback(forAliveOnly(function(res) {
               self._saveParamsDeferred.callback();
               return res;
            }, self));
            this._notify('onHistoryUpdate', this._history);
            this._historyChannel.notify('onHistoryUpdate', this._history, this);
         } else {
            /* Если во время сохранения истории её поменяли ещё раз, то необходимо дождаться предыдущего запроса,
               и позвать запрос с новыми данными. Иначе будут гонки, какой запрос первей отработает. */
            this._saveParamsDeferred.addCallback(function(res) {
               self.saveHistory();
               return res;
            });
         }

         return this._saveParamsDeferred;

      },

      /**
       * Очищает историю.
       * @see setHistory
       * @see getHistory
       * @see saveHistory
       */
      clearHistory: function() {
         this.setHistory(this._options.emptyValue, true);
      },

      /**
       * Возвращает признак: сохраняется ли сейчас история.
       * @returns {Deferred|*|boolean}
       */
      isNowSaving: function() {
         return this._saveParamsDeferred && !this._saveParamsDeferred.isReady()
      },

      /**
       * Возвращает деферед сохранения истории (если она сейчас сохраняется).
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
         if(this._localStorage) {
            this._localStorage.destroy();
            this._localStorage = undefined;
         }
         this._historyChannel.unsubscribe('onHistoryUpdate', this._updateHistory);
         
         if(!this._historyChannel.hasEventHandlers('onHistoryUpdate')) {
            delete STORAGES[this._options.historyId];
            this._historyChannel.destroy();
         }
         this._historyChannel = undefined;
         this._history = undefined;
         this._SBISStorage = undefined;
         SBISHistoryStorage.superclass.destroy.call(this);
      }
   });

   return SBISHistoryStorage;

});
/**
 * Created by am.gerasimov on 18.01.2017.
 */
define('js!SBIS3.CONTROLS.SBISHistoryStorage', [
   "Core/EventBus",
   "js!SBIS3.CONTROLS.SessionStorage",
   "js!SBIS3.CONTROLS.SBISUserConfigStorage",
   "js!SBIS3.CONTROLS.SBISClientsGlobalConfigStorage",
   "Core/Abstract",
   "Core/helpers/string-helpers",
   "Core/Deferred",
   "Core/helpers/functional-helpers",
   "Core/ConsoleLogger",
   "Core/constants",
   "js!SBIS3.CORE.LocalStorage"
], function(EventBus, cSessionStorage, SBISUserConfigStorage, SBISClientsGlobalConfigStorage, cAbstract, strHelpers, Deferred, fHelpers, ConsoleLogger, constants, LocalStorage ) {

   'use strict';

   var serializeFnc = function(serialize, value) {
      return value ? strHelpers[serialize ? 'serializeURLData' : 'deserializeURLData'](value) : null;
   };

   var GLOBAL_POSTFIX = '-global';

   /**
    * Контроллер, который предоставляет базовые механизмы работы с иторией.
    * @author Герасимов Александр Максимович
    * @public
    */
   var SBISHistoryStorage = cAbstract.extend([],/** @lends SBIS3.CONTROLS.HistoryController.prototype */{
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
             * Значение истории, которое установится при сбросе
             * @cfg {*}
             */
            emptyValue: null,
            /**
             * @cfg {Boolean}
             * Сохранять в глобальные параметры клиента
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
            чтобы отслеживать изменения в localStorage ,
            Отключаю по задаче
          https://inside.tensor.ru/opendoc.html?guid=d11b208e-6ae0-4147-bfa1-38792b7e5bf2&des=
          Ошибка в разработку 14.02.2017 По умолчанию встает значение фильтра Все сотрудники. Сотрудники/ создать нового/ залогиниться под но…
         this._getLocalStorage(); */

         this._history = this._getStorageValue();

         this._historyChannel = EventBus.channel('HistoryChannel' + this._options.historyId);
         this._historyChannel.subscribe('onHistoryUpdate', function(event, history) {
            this._history = history;
            this._notify('onHistoryUpdate', history);
         }.bind(this));
      },

      _setStorageValue: function(value) {
         var serializedValue = this._options.serialize(true, value),
             key = this._options.historyId;

         /* Запись в пользовательские параметры не производит записи SessionStorage,
          поэтому в рамках одной сессии может возникать разница в значениях,
          которые хранятся в параметрах пользователя / SessionStorage. Для этого,
          при записи в пользовательские параметры, запишем значение и в SessionStorage.
          + надо записывать в LocalStorage, чтобы не было рассинхрона истории на разных вкладках. */
         /* Отключаю по задаче
            https://inside.tensor.ru/opendoc.html?guid=d11b208e-6ae0-4147-bfa1-38792b7e5bf2&des=
            Ошибка в разработку 14.02.2017 По умолчанию встает значение фильтра Все сотрудники. Сотрудники/ создать нового/ залогиниться под но…
            this._getLocalStorage().setItem(key, serializedValue); */
         cSessionStorage.setItem(key, serializedValue);

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
            serializedValue = this._options.serialize(false, value);
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
                /*  Отключаю по задаче
                    https://inside.tensor.ru/opendoc.html?guid=d11b208e-6ae0-4147-bfa1-38792b7e5bf2&des=
                    Ошибка в разработку 14.02.2017 По умолчанию встает значение фильтра Все сотрудники. Сотрудники/ создать нового/ залогиниться под но…
               if(key === this._options.historyId) {
                  cSessionStorage.setItem(this._options.historyId, this._localStorage.getItem(key));
               } */
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

            this._setStorageValue(this._history).addCallback(fHelpers.forAliveOnly(function() {
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
         SBISHistoryStorage.superclass.destroy.call(this);
      }
   });

   return SBISHistoryStorage;

});
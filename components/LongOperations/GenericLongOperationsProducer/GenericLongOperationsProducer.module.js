define('js!SBIS3.CONTROLS.GenericLongOperationsProducer',
   [
      'Core/core-extend',
      'js!WS.Data/Entity/ObservableMixin'/*###'Core/Abstract.compatible'*/,
      'Core/Deferred',
      'js!WS.Data/Types/Enum',
      'js!SBIS3.CONTROLS.LongOperationEntry',
      'js!SBIS3.CONTROLS.ILongOperationsProducer'
   ],

   /**
    * Класс, описывающий ...
    *
    * @class SBIS3.CONTROLS.GenericLongOperationsProducer
    * @implements SBIS3.CONTROLS.ILongOperationsProducer
    * @public
    */

   function (CoreExtend,  ObservableMixin/*###AbstractCompatible*/, Deferred, Enum, LongOperationEntry, ILongOperationsProducer) {
      'use strict';

      /**
       * Экземпляры класса (синглетоны), различающиеся идентификаторами (ключами массива). Один идентификатор - один экземпляр
       * @rpoteced
       * @type {object}
       */
      var _instances = {};

      /**
       * Класс ### длительных операций
       * @public
       * @type {object}
       */
      var GenericLongOperationsProducer = CoreExtend.extend({}, [ILongOperationsProducer, ObservableMixin/*###AbstractCompatible*/], /** @lends SBIS3.CONTROLS.GenericLongOperationsProducer.prototype */{
         _moduleName: 'SBIS3.CONTROLS.GenericLongOperationsProducer',

         $protected: {
            /*_options: {
            }*/

            /**
             * Имя экземпляра продюсера
             * @protected
             * @type {string}
             */
            _name: null,

            /**
             * Обработчики действий для элементов
             * @protected
             * @type {object}
             */
            _actions: {},
         },

         /**
          * Конструктор
          * @public
          * @param {string} key Идентификатор экземпляра продюсера
          */
         $constructor: function $GenericLongOperationsProducer (key) {
            if (key && typeof key !== 'string') {
               throw new TypeError('Argument "key" must be a string');
            }
            key = key || '';
            if (key in _instances) {
               return _instances[key];
            }
            this._name = 'generic' + (key ? ':' + key : '');
            _instances[key] = this;
            //////////////////////////////////////////////////
            // TODO: ### Не забыть убрать это !
            this.TMP_list = _list.bind(null, this);//###
            this.TMP_clear = _clear.bind(null, this);//###
            //////////////////////////////////////////////////
         },

         /**
          * Инициализировать экземпляр класса
          * @public
          */
         init: function () {
            //GenericLongOperationsProducer.superclass.init.apply(this, arguments);
            this._publish('onstarted', 'onchanged', 'onended', 'ondeleted');
         },

         /**
          * Ликвидировать экземпляр класса
          * @public
          */
         destroy: function () {
            //GenericLongOperationsProducer.superclass.destroy.apply(this, arguments);
            var STATUSES = LongOperationEntry.STATUSES;
            var DEFAULTS = LongOperationEntry.DEFAULTS;
            var snapshots = GLOStorage.list(this._name);
            var oIds = [];
            for (var i = 0; i < snapshots.length; i++) {
               var o = snapshots[i];
               var status = 'status' in o ? o.status : DEFAULTS.status;
               if (status === STATUSES.running || status === STATUSES.suspended) {
                  var operationId = o.id;
                  var handlers = this._actions ? this._actions[operationId] : null;
                  // Если обработчики действий пользователя установлены в этой вкладке
                  if (handlers) {
                     delete this._actions[operationId];
                     o.status = STATUSES.error;
                     GLOStorage.put(this._name, operationId, o);
                     oIds.push(operationId);
                  }
               }
            }
            if (oIds.length) {
               this._notify('onended', {producer:this._name, operationIds:oIds, status:STATUSES.error, error:'User left the page'/*###, title:o.Name*/});
            }
         },



         /**
          * Получить имя экземпляра продюсера
          * @public
          * @return {string}
          */
         getName: function () {
            return this._name;
         },

         /**
          * Показывает, что события продюсера не нужно распространять по всем вкладкам
          * @public
          * @return {boolean}
          */
         hasCrossTabEvents: function () {
            return false;
         },

         /**
          * Показывает, что данные продюсера не зависят от вкладки (всегда будут одинаковы во всех вкладках)
          * @public
          * @return {boolean}
          */
         hasCrossTabData: function () {
            return true;
         },

         /**
          * Запросить набор последних длительных операций (отсортированных в обратном хронологическом порядке)
          * @public
          * @param {number} count Максимальное количество возвращаемых элементов
          * @return {Core/Deferred<SBIS3.CONTROLS.LongOperationEntry[]>}
          */
         fetch: function (count) {
            if (!(typeof count === 'number' && 0 < count)) {
               throw new TypeError('Argument "count" must be positive number' );
            }
            return Deferred.success(_list(this, count, 0).map(function (operation) {
               var handlers = this._actions ? this._actions[operation.id] : null;
               // Если обработчики действий пользователя остались в другой вкладке
               if (!(handlers && handlers.onSuspend && handlers.onResume)) {
                  operation.canSuspend = false;
               }
               /*if (!(handlers && handlers.onDelete)) {
                  operation.canDelete = false;
               }*/
               return operation;
            }.bind(this)));
         },

         /**
          * Запросить выполнение указанного действия с указанным элементом
          * @public
          * @param {string} action Название действия
          * @param {string|number} operationId Идентификатор элемента
          * @return {Core/Deferred}
          */
         callAction: function (action, operationId) {
            if (!action || typeof action !== 'string') {
               throw new TypeError('Argument "action" must be a string');
            }
            try {
               var handlers = {
                  suspend: 'onSuspend',
                  resume: 'onResume',
                  delete: 'onDelete'
               };
               if (!(action in handlers)) {
                  throw new Error('Unknown action');
               }
               var handler = this._actions && operationId in this._actions && action in handlers ? this._actions[operationId][handlers[action]] : null;
               if (action !== 'delete' && !handler) {
                  throw new Error('Action not found or not applicable');
               }
               switch (action) {
                  case 'suspend':
                     _setStatus(this, operationId, 'suspended', handler);
                     break;
                  case 'resume':
                     _setStatus(this, operationId, 'running', handler);
                     break;
                  case 'delete':
                     _remove(this, operationId, handler);
                     break;
               }
               return Deferred.success();
            }
            catch (ex) {
               return Deferred.fail(ex);
            }
         },



         /**
          * Начать отображение длительной операции. В аргумент stopper при его разрешении возвращаются результат операции для отображения.
          * Обработчики всех действий (onSuspend, onResume, onDelete) должны возвращать булево значение, показывающее успешность выполнения действия
          * @public
          * @param {string} options Параметры для создания длительной операции
          * @param {string} options.title Отображаемое название операции (обязательный)
          * @param {Date|number} [options.startedAt] Время начала операции (опционально, если не указано, будет использовано текущее)
          * @param {string|number|object} [options.status] Статус операции. Возможные значения: 'running', 0, 'suspended', 1, 'success', 2, 'error', 3.
          *                                                Также принимается объект json-сериализации из Enum.
          *                                                (опционально, если не указано, будет использовано 'running')
          * @param {function} [options.onSuspend] Обработчик действия пользователя. Должен возвращать успешность выполнения. Если не представлен, значит действие не разрешено
          * @param {function} [options.onResume] Обработчик действия пользователя. Должен возвращать успешность выполнения. Если не представлен, значит действие не разрешено
          * @param {function} [options.onDelete] Обработчик действия пользователя. Должен возвращать успешность выполнения. Если не представлен, значит действие не разрешено
          * @param {Core/Deferred<object>} stopper Отложенный останов длительной операции
          */
         make: function (options, stopper) {
            if (!options || typeof options !== 'object') {
               throw new TypeError('Argument "options" must be an object');
            }
            if (!stopper && options.stopper) {
               stopper = options.stopper;
            }
            if (!(stopper instanceof Deferred)) {
               throw new TypeError('Argument "stopper" must be a Deferred');
            }
            // Для удобства использования сделаем авторегистрацию продюсера в менеджере
            require(['js!SBIS3.CONTROLS.LongOperationsManager'], function (longOperationsManager) {
               longOperationsManager.register(this);

               // и продолжим создание операции
               options.canSuspend = typeof options.onSuspend === 'function' && typeof options.onResume === 'function';
               options.canDelete = typeof options.onDelete === 'function';
               var operationId = _put(this, options);
               var self = this;
               stopper.addCallbacks(
                  function (result) {
                     if (result && typeof result !== 'object') {
                        throw new TypeError('Invalid result');
                     }
                     _setStatus(self, operationId, 'success', result || null);
                  },
                  function (err) {
                     _setStatus(self, operationId, 'error', err.message || 'Long operation error');
                  }
               )
            }.bind(this));
         }
      });



      /**
       * Набор защищённых методов модуля
       */

      /**
       * Добавить новую длительную операцию. Метод принимает либо экземпляр модели, либо набор опций, описанных в методе _create.
       * В этом случае экземпляр модели будет создан вызовом метода _create. Возвращает присвоенный идентификатор операции, который может быть
       * использован для далнейшего обращения
       * @protected
       * @param {SBIS3.CONTROLS.GenericLongOperationsProducer} self Экземпляр класса
       * @param {SBIS3.CONTROLS.LongOperationEntry|object} operation Длительная операция
       * @return {number}
       */
      var _put = function (self, operation) {
         if (!operation || typeof operation !== 'object') {
            throw new TypeError('Argument "operation" must be object');
         }
         if (operation instanceof LongOperationEntry) {
            if (operation.producer !== self._name) {
               throw new Error('Argument "operation" has invalid producer');
            }
         }
         else {
            var options = ObjectAssign({id:GLOStorage.nextCounter(self._name), producer:self._name}, operation);
            if (!options.startedAt) {
               options.startedAt = new Date();
            }
            operation = new LongOperationEntry(options);
            if (options.canSuspend || options.canDelete) {
               var listeners = {};
               if (options.canSuspend) {
                  listeners.onSuspend = options.onSuspend;
                  listeners.onResume = options.onResume;
               }
               if (options.canDelete) {
                  listeners.onDelete = options.onDelete;
               }
               self._actions[options.id] = listeners;
            }
         }
         var operationId = operation.id;
         GLOStorage.put(self._name, operationId, _toSnapshot(operation));
         self._notify('onstarted', {producer:self._name, operationId:operationId/*###, title:operation.Name, operation:operation*/});
         return operationId;
      };

      /**
       * Получить длительную операцию по идентификатору
       * @protected
       * @param {number} operationId Идентификатор длительной операции
       * @param {SBIS3.CONTROLS.GenericLongOperationsProducer} self Экземпляр класса
       * @return {SBIS3.CONTROLS.LongOperationEntry}
       */
      var _get = function (self, operationId) {
         if (!(typeof operationId === 'number' && 0 < operationId)) {
            throw new TypeError('Argument "operationId" must be positive number');
         }
         var snapshot = GLOStorage.get(self._name, operationId);
         return snapshot ? _fromSnapshot(snapshot, self._name) : null;
      };

      /**
       * Получить список длительных операций
       * @protected
       * @param {SBIS3.CONTROLS.GenericLongOperationsProducer} self Экземпляр класса
       * @param {number} count Количество элементов
       * @param {number} offset Отступ
       * @return {SBIS3.CONTROLS.LongOperationEntry[]}
       */
      var _list = function (self, count, offset) {
         if (count && !(typeof count === 'number' && 0 < count)) {
            throw new TypeError('Argument "count" must be positive number or null');
         }
         if (offset && !(typeof offset === 'number' && 0 < offset)) {
            throw new TypeError('Argument "offset" must be positive number or null');
         }
         var snapshots = GLOStorage.list(self._name);
         snapshots.sort(function (a, b) { return a.startedAt < b.startedAt ? +1 : (a.startedAt === b.startedAt ? 0 : -1); });
         if (count || offset) {
            snapshots = snapshots.slice(offset || 0, count ? (offset || 0) + count : snapshots.length);
         }
         var name = self._name;
         return snapshots.map(function (v) { return _fromSnapshot(v, name); });
      };

      /**
       * Установить новый статус длительной операции
       * @protected
       * @param {SBIS3.CONTROLS.GenericLongOperationsProducer} self Экземпляр класса
       * @param {number} operationId Идентификатор длительной операции
       * @param {string|number} status Новый статус операции. Возможные значения: 'running', 0, 'suspended', 1, 'success', 2, 'error', 3.
       * @param {any} details Дополнительная информация при завершении. Для успешного завершения - результат, для завершения с ошибкой -
       *                      сообщение об ошибке. Для приостановки/возобновления может быть обработчик действия пользователя (опционально)
       */
      var _setStatus = function (self, operationId, status, details) {
         if (!(typeof operationId === 'number' && 0 < operationId)) {
            throw new TypeError('Argument "operationId" must be positive number');
         }
         var STATUSES = LongOperationEntry.STATUSES;
         if (status in STATUSES) {
            status = STATUSES[status];
         }
         else
         if (typeof status !== 'number' || !bject.keys(STATUSES).some(function (k) { return value === STATUSES[k]; })) {
            throw new TypeError('Invalid argument "status"');
         }
         if (status === STATUSES.deleted) {
            _remove(self, operationId);
            return;
         }
         var operation = _get(self, operationId);
         if (!operation) {
            throw new Error('Operation not found');
         }
         if (status !== operation.status) {
            var isAllowed;
            var prev = operation.status;
            switch (status) {
               case STATUSES.running:
                  isAllowed = prev === STATUSES.suspended;
                  break;
               case STATUSES.suspended:
                  isAllowed = prev === STATUSES.running;
                  break;
               case STATUSES.success:
               case STATUSES.error:
                  isAllowed = prev === STATUSES.running || prev === STATUSES.suspended;
                  break;
            }
            if (!isAllowed) {
               throw new Error('Action is not allowed');
            }
            operation.status = status;
            var eventType, result;
            switch (status) {
               case STATUSES.running:
               case STATUSES.suspended:
                  var handler = typeof details === 'function' ? details : null;
                  if (handler && !handler.call(null)) {
                     throw new Error('Action is not performed');
                  }
                  eventType = 'onchanged';
                  result = {changed:'status'};
                  break;
               case STATUSES.success:
               case STATUSES.error:
                  operation.progressCurrent = operation.progressTotal;
                  operation.timeSpent = (new Date()).getTime() - operation.startedAt;
                  if (operation.canDelete) {
                     var actions = self._actions[operationId];
                     delete actions.onSuspend;
                     delete actions.onResume;
                  }
                  else {
                     delete self._actions[operationId];
                  }
                  eventType = 'onended';
                  if (status === STATUSES.success) {
                     if (details) {
                        if (details.url && typeof details.url === 'string') {
                           operation.resultUrl = details.url;
                           if (details.urlAsDownload) {
                              operation.resultUrlAsDownload = details.urlAsDownload;
                           }
                        }
                        else
                        if (details.handler && typeof details.handler === 'string') {
                           operation.resultHandler = details.handler;
                           if (details.handlerArgs) {
                              operation.resultHandlerArgs = details.handlerArgs;
                           }
                        }
                        if (details.message && typeof details.message === 'string') {
                           operation.resultMessage = details.message;
                        }
                        if (details.validUntil) {
                           operation.resultValidUntil = details.validUntil instanceof Date ? details.validUntil : new Date(details.validUntil);
                        }
                     }
                  }
                  else
                  if (status === STATUSES.error) {
                     operation.resultMessage = details;
                     result = {error:details};
                  }
                  break;
            }
            GLOStorage.put(self._name, operationId, _toSnapshot(operation));
            var common = {producer:self._name, operationId:operationId, status:status/*###, title:operation.Name*/};
            self._notify(eventType, result ? ObjectAssign(common, result) : common);
         }
      };

      /**
       * Удалить длительную операцию
       * @protected
       * @param {SBIS3.CONTROLS.GenericLongOperationsProducer} self Экземпляр класса
       * @param {number} operationId Идентификатор длительной операции
       * @param {function} [handler] Обработчик действия пользователя (опционально)
       */
      var _remove = function (self, operationId, handler) {
         if (!(typeof operationId === 'number' && 0 < operationId)) {
            throw new TypeError('Argument "operationId" must be positive number');
         }
         var snapshot = GLOStorage.get(self._name, operationId);
         if (!snapshot) {
            throw new Error('Operation not found');
         }
         if (handler && !handler.call(null)) {
            throw new Error('Action is not performed');
         }
         if (!('canDelete' in snapshot ? snapshot.canDelete : LongOperationEntry.DEFAULTS.canDelete)) {
            throw new Error('Action is not allowed');
         }
         if (GLOStorage.remove(self._name, operationId)) {
            delete self._actions[operationId];
            self._notify('ondeleted', {producer:self._name, operationId:operationId/*###, title:operation.Name*/});
         }
      };

      /**
       * Удалить всю информацию о длительных операциях
       * @protected
       * @param {SBIS3.CONTROLS.GenericLongOperationsProducer} self Экземпляр класса
       */
      var _clear = function (self) {
         var operationIds = GLOStorage.clear(self._name);
         if (operationIds.length) {
            self._notify('ondeleted', {producer:self._name, operationIds:operationIds});
         }
      };

      /**
       * Создать снимок состояния (плоский объект) длительной операции
       * @protected
       * @param {SBIS3.CONTROLS.LongOperationEntry} operation Длительная операция
       * @return {object}
       */
      var _toSnapshot = function (operation) {
         if (!operation || !(operation instanceof LongOperationEntry)) {
            throw new TypeError('Argument must be instance of LongOperationEntry');
         }
         var snapshot = operation.toSnapshot();
         delete snapshot.producer;
         return snapshot;
      };

      /**
       * Восстанавить длительную операцию из снимка состояния (плоского объекта)
       * @protected
       * @param {object} snapshot Снимок состояния
       * @param {string} producerName Имя текущего продюсера
       * @return {SBIS3.CONTROLS.LongOperationEntry}
       */
      var _fromSnapshot = function (snapshot, producerName) {
         if (!snapshot || !(typeof snapshot === 'object')) {
            throw new TypeError('Argument "snapshot" must be an object');
         }
         return new LongOperationEntry(ObjectAssign({producer:producerName}, snapshot));
      };

      var ObjectAssign = Object.assign || function (dst, src) { return Object.keys(src).reduce(function (o, n) { o[n] = src[n]; return o; }, dst); };



      /**
       * Префикс имён в локальном хранилище
       * @protected
       * @type {string}
       */
      var NS_PREFIX = 'wslongop-';

      /**
       * Набор внутренних методов для манипуляций с локальным хранилищем
       * @protected
       * @type {object}
       */
      var GLOStorage = {
         /**
          * Устанавливает и возвращает следующее значение счётчика экземпляров
          * @public
          * @param {string} ns Суффикс пространства имён
          * @return {number}
          */
         nextCounter: function (ns) {
            var name = NS_PREFIX + ns + '-cnt';
            var count = localStorage.getItem(name);
            count = count ? parseInt(count) + 1 : 1;
            localStorage.setItem(name, count);
            return count;
         },

         /**
          * Сохранить объект
          * @public
          * @param {string} ns Суффикс пространства имён
          * @param {number} id Идентификатор сохраняемого объекта
          * @param {object} obj Сохраняемый объект
          */
         put: function (ns, id, obj) {
            localStorage.setItem(NS_PREFIX + ns + '-' + id, JSON.stringify(obj));
         },

         /**
          * Получить сохранённый ранее объект
          * @public
          * @param {string} ns Суффикс пространства имён
          * @param {number} id Идентификатор сохранённого объект
          * @return {object}
          */
         get: function (ns, id) {
            var data = localStorage.getItem(NS_PREFIX + ns + '-' + id);
            return data ? this._jsonParse(data) : null;
         },

         /**
          * Получить все сохранённые ранее объекты
          * @public
          * @param {string} ns Суффикс пространства имён
          * @return {object[]}
          */
         list: function (ns) {
            var list = [];
            var prefix = NS_PREFIX + ns + '-';
            for (var i = 0, len = localStorage.length; i < len; i++) {
               var name = localStorage.key(i);
               if (name.indexOf(prefix) === 0) {
                  var id = parseInt(name.substring(prefix.length));
                  if (0 < id) {
                     var obj = this._jsonParse(localStorage.getItem(name));
                     if (obj) {
                        list.push(obj);
                     }
                  }
               }
            }
            return list;
         },

         /**
          * Удалить сохранённый объект
          * @public
          * @param {string} ns Суффикс пространства имён
          * @param {number} id Идентификатор сохранённого объект
          * @return {boolean}
          */
         remove: function (ns, id) {
            var name = NS_PREFIX + ns + '-' + id;
            var has = !!localStorage.getItem(name);
            if (has) {
               localStorage.removeItem(name);
            }
            return has;
         },

         /**
          * Удалить всю ранее сохранённую информацию. Возвращает идентификаторы удалённых объектов
          * @public
          * @param {string} ns Суффикс пространства имён
          * @return {number[]}
          */
         clear: function (ns) {
            var ids = [];
            var prefix = NS_PREFIX + ns + '-';
            for (var i = localStorage.length - 1; 0 <= i; i--) {
               var name = localStorage.key(i);
               if (name.indexOf(prefix) === 0) {
                  localStorage.removeItem(name);
                  var id = parseInt(name.substring(prefix.length));
                  if (!isNaN(id)) {
                     ids.push(id);
                  }
               }
            }
            return ids;
         },

         /**
          * Восстановить объект после сериализации
          * @protected
          * @param {string} json Сериализованное представление
          * @return {object}
          */
         _jsonParse: function (json) {
            if (json) {
               var obj;
               try {
                  obj = JSON.parse(json);
               }
               catch(ex) {}
               return obj;
            }
         }
      };



      /**
       * Получить экземпляр продюсера, единственный для указанного идентификатора экземпляра
       * @public
       * @static
       * @param {string} key Идентификатор экземпляра продюсера
       * @return {SBIS3.CONTROLS.GenericLongOperationsProducer}
       */
      GenericLongOperationsProducer.getInstance = function (key) {
         // Конструктор уже возвращает синглетоны - на каждый идентификатор экземпляра один экземпляр продюсера
         return new GenericLongOperationsProducer(key);
      }



      return GenericLongOperationsProducer;
   }
);

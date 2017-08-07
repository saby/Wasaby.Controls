/**
 * Типовой продюсер длительных операций
 *
 * @class SBIS3.CONTROLS.GenericLongOperationsProducer
 * @implements SBIS3.CONTROLS.ILongOperationsProducer
 * @public
 */

define('js!SBIS3.CONTROLS.GenericLongOperationsProducer',
   [
      'Core/core-extend',
      'js!WS.Data/Entity/ObservableMixin',
      'Core/Deferred',
      'Core/UserInfo',
      'js!SBIS3.CONTROLS.LongOperationEntry',
      'js!SBIS3.CONTROLS.ILongOperationsProducer'
   ],

   function (CoreExtend,  ObservableMixin, Deferred, UserInfo, LongOperationEntry, ILongOperationsProducer) {
      'use strict';

      /**
       * Имя продюсера
       * @protected
       * @type {string}
       */
      var PRODUCER_NAME = 'SBIS3.CONTROLS.GenericLongOperationsProducer';

      /**
       * "Константа" - сортировка возвращаемых методом fetch элементов по умолчанию
       * @protected
       * @type {number}
       */
      var DEFAULT_FETCH_SORTING = {status:true, startedAt:false};

      /**
       * Экземпляры класса (синглетоны), различающиеся идентификаторами (ключами массива). Один идентификатор - один экземпляр
       * @rpoteced
       * @type {object}
       */
      var _instances = {};

      /**
       * Сервис - источник данных о пользователях, когда это потребуется в методе fetch
       * @rpoteced
       * @type {WS.Data/Source/SbisService}
       */
      var _userInfoSource;

      /**
       * Класс типового продюсера длительных операций
       * @public
       * @type {object}
       */
      var GenericLongOperationsProducer = CoreExtend.extend({}, [ILongOperationsProducer, ObservableMixin], /** @lends SBIS3.CONTROLS.GenericLongOperationsProducer.prototype */{
         _moduleName: PRODUCER_NAME,

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
            _actions: {}
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
            this._name = PRODUCER_NAME + (key ? ':' + key : '');
            this._isDestroyed = null;
            _instances[key] = this;
         },

         /**
          * Инициализировать экземпляр класса
          * @public
          */
         init: function () {
            //GenericLongOperationsProducer.superclass.init.apply(this, arguments);
            this._publish('onlongoperationstarted', 'onlongoperationchanged', 'onlongoperationended', 'onlongoperationdeleted');
         },

         /**
          * Ликвидировать экземпляр класса
          * @public
          */
         destroy: function () {
            if (!this._isDestroyed) {
               this._isDestroyed = true;
               //GenericLongOperationsProducer.superclass.destroy.apply(this, arguments);
               var STATUSES = LongOperationEntry.STATUSES;
               var DEFAULTS = LongOperationEntry.DEFAULTS;
               var ERR = 'User left the page';
               var snapshots = GLOStorage.list(this._name);
               var oIds = [];
               for (var i = 0; i < snapshots.length; i++) {
                  var o = snapshots[i];
                  var status = 'status' in o ? o.status : DEFAULTS.status;
                  if (status === STATUSES.running || status === STATUSES.suspended) {
                     var operationId = o.id;
                     var handlers = this._actions ? this._actions[operationId] : null;
                     // Если обработчики действий пользователя установлены в этой вкладке
                     // При разрушении продюсера обработчики будут утеряны, поэтому операции завершаем ошибкой
                     if (handlers) {
                        delete this._actions[operationId];
                        o.status = STATUSES.ended;
                        o.isFailed = true;
                        o.resultMessage = ERR;
                        o.timeSpent = (new Date()).getTime() - o.startedAt;
                        GLOStorage.put(this._name, operationId, o);
                        oIds.push(operationId);
                     }
                  }
               }
               if (oIds.length) {
                  this._notify('onlongoperationended', {producer:this._name, operationIds:oIds, error:ERR});
               }
               Object.keys(_instances).some(function (v) { if (this === _instances[v]) { delete _instances[v]; return true;} }.bind(this));
            }
         },



         /**
          * Получить имя экземпляра продюсера
          * @public
          * @return {string}
          */
         getName: function () {
            if (!this._isDestroyed) {
               return this._name;
            }
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
          * Запросить набор последних длительных операций
          * @public
          * @param {object} options Параметры запроса (опционально)
          * @param {object} options.where Параметры фильтрации
          * @param {object} options.orderBy Параметры сортировки
          * @param {number} options.offset Количество пропущенных элементов в начале
          * @param {number} options.limit Максимальное количество возвращаемых элементов
          * @param {object} [options.extra] Дополнительные параметры, если есть (опционально)
          * @return {Core/Deferred<SBIS3.CONTROLS.LongOperationEntry[]>}
          */
         fetch: function (options) {
            if (!options || typeof options !== 'object') {
               throw new TypeError('Argument "options" must be an object');
            }
            if ('where' in options && typeof options.where !== 'object') {
               throw new TypeError('Argument "options.where" must be an object');
            }
            if ('orderBy' in options && typeof options.orderBy !== 'object') {
               throw new TypeError('Argument "options.orderBy" must be an array');
            }
            if ('offset' in options && !(typeof options.offset === 'number' && 0 <= options.offset)) {
               throw new TypeError('Argument "options.offset" must be not negative number');
            }
            if ('limit' in options && !(typeof options.limit === 'number' && 0 < options.limit)) {
               throw new TypeError('Argument "options.limit" must be positive number');
            }
            if ('extra' in options && typeof options.extra !== 'object') {
               throw new TypeError('Argument "options.extra" must be an object if present');
            }
            if (this._isDestroyed) {
               return Deferred.fail('User left the page');
            }
            var operations = _list(this, options.where, options.orderBy || DEFAULT_FETCH_SORTING, options.offset, options.limit);
            if (operations.length) {
               operations = operations.map(function (operation) {
                  var handlers = this._actions ? this._actions[operation.id] : null;
                  // Если обработчики действий пользователя остались в другой вкладке
                  if (!(handlers && handlers.onSuspend && handlers.onResume)) {
                     operation.canSuspend = false;
                  }
                  /*if (!(handlers && handlers.onDelete)) {
                   operation.canDelete = false;
                   }*/
                  return operation;
               }.bind(this));
               if (options.extra && options.extra.needUserInfo) {
                  return _fillUserInfo(operations);
               }
            }
            return Deferred.success(operations);
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
            if (this._isDestroyed) {
               return Deferred.fail('User left the page');
            }
            var handlers = {
               suspend: 'onSuspend',
               resume: 'onResume',
               delete: 'onDelete'
            };
            if (!(action in handlers)) {
               throw new Error('Unknown action');
            }
            try {
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
          * Перед вызовом метода нужно убедиться, что продюсер зарегистрирован в менеджере длительных операций
          * @public
          * @param {string} options Параметры для создания длительной операции
          * @param {string} options.title Отображаемое название операции (обязательный)
          * @param {Date|number} [options.startedAt] Время начала операции (опционально, если не указано, будет использовано текущее)
          * @param {string|number|object} [options.status] Статус операции. Возможные значения: 'running', 0, 'suspended', 1, 'ended', 2.
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
            if (this._isDestroyed) {
               return;
            }
            options.canSuspend = typeof options.onSuspend === 'function' && typeof options.onResume === 'function';
            options.canDelete = typeof options.onDelete === 'function';
            options.userId = UserInfo.get('Пользователь');
            options.userUuId = UserInfo.get('ИдентификаторСервисаПрофилей') || $.cookie('CpsUserId');
            var operationId = _put(this, options);
            var self = this;
            stopper.addCallbacks(
               function (result) {
                  if (result && typeof result !== 'object') {
                     throw new TypeError('Invalid result');
                  }
                  _setStatus(self, operationId, 'ended', result || null);
               },
               function (err) {
                  _setStatus(self, operationId, 'ended', {error:err.message || 'Long operation error'});
               }
            )
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
         /*###if (!operation || typeof operation !== 'object') {
            throw new TypeError('Argument "operation" must be object');
         }*/
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
         self._notify('onlongoperationstarted', {producer:self._name, operationId:operationId});
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
         /*###if (!(typeof operationId === 'number' && 0 < operationId)) {
            throw new TypeError('Argument "operationId" must be positive number');
         }*/
         var snapshot = GLOStorage.get(self._name, operationId);
         return snapshot ? _fromSnapshot(snapshot, self._name) : null;
      };

      /**
       * Получить список длительных операций
       * @protected
       * @param {SBIS3.CONTROLS.GenericLongOperationsProducer} self Экземпляр класса
       * @param {object} where Параметры фильтрации
       * @param {object} orderBy Параметры сортировки. По умолчанию используется обратный хронологический порядок
       * @param {number} offset Количество пропущенных элементов в начале
       * @param {number} limit Максимальное количество возвращаемых элементов
       * @return {SBIS3.CONTROLS.LongOperationEntry[]}
       */
      var _list = function (self, where, orderBy, offset, limit) {
         var snapshots = GLOStorage.list(self._name);
         if (!snapshots.length) {
            return snapshots;
         }
         if (where) {
            var DEFAULTS = LongOperationEntry.DEFAULTS;
            snapshots = snapshots.filter(function (snapshot) {
               for (var p in where) {
                  if (!_isSatisfied(p in snapshot ? snapshot[p] : DEFAULTS[p], where[p])) {
                     return false;
                  }
               }
               return true;
            });
            if (!snapshots.length) {
               return snapshots;
            }
         }
         if (orderBy) {
            snapshots.sort(function (a, b) {
               for (var p in orderBy) {
                  var va = a[p];
                  var vb = b[p];
                  // Для сравниваемых значений могут иметь смысл операции < и >, но не иметь смысла != и ==, как например для Date. Поэтому:
                  if (va < vb) {
                     return orderBy[p] ? -1 : +1;
                  }
                  else
                  if (vb < va) {
                     return orderBy[p] ? +1 : -1;
                  }
               }
               return 0;
            });
         }
         if (limit || offset) {
            snapshots = snapshots.slice(offset || 0, limit ? (offset || 0) + limit : snapshots.length);
         }
         return snapshots.map(function (v) { return _fromSnapshot(v, self._name); });
      };

      /**
       * Проверить, что значение удовлетворяет условию
       * @protected
       * @param {any} value Занчение
       * @param {any} condition Условие
       * @return {boolean}
       */
      var _isSatisfied = function (value, condition) {
         if (condition == null || typeof condition !== 'object') {
            return condition != null ? value === condition : value == null;
         }
         if (Array.isArray(condition)) {
            return condition.indexOf(value) !== -1;
         }
         if (!(condition.condition && typeof condition.condition === 'string') || !('value' in condition)) {
            throw new TypeError('Wrong condition object');
         }
         switch (condition.condition) {
            case '<':
               return value < condition.value;
            case '<=':
               return value <= condition.value;
            case '>=':
               return value >= condition.value;
            case '>':
               return value > condition.value;
            case 'contains':
               if (typeof value !== 'string' || typeof condition.value !== 'string') {
                  throw new TypeError('Value and condition is incompatible');
               }
               return (condition.sensitive ? value : value.toLowerCase()).indexOf(condition.sensitive ? condition.value : condition.value.toLowerCase()) !== -1;
         }
         return false;
      };

      /**
       * Установить новый статус длительной операции
       * @protected
       * @param {SBIS3.CONTROLS.GenericLongOperationsProducer} self Экземпляр класса
       * @param {number} operationId Идентификатор длительной операции
       * @param {string|number} status Новый статус операции. Возможные значения: 'running', 0, 'suspended', 1, 'ended', 2.
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
               case STATUSES.ended:
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
                  eventType = 'onlongoperationchanged';
                  result = {changed:'status'};
                  break;
               case STATUSES.ended:
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
                  eventType = 'onlongoperationended';
                  var err = details ? details.error : null;
                  if (!err) {
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
                  else {
                     operation.isFailed = true;
                     operation.resultMessage = err;
                     result = {error:err};
                  }
                  break;
            }
            GLOStorage.put(self._name, operationId, _toSnapshot(operation));
            var common = {producer:self._name, operationId:operationId, status:status};
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
         GLOStorage.remove(self._name, operationId);
         delete self._actions[operationId];
         self._notify('onlongoperationdeleted', {producer:self._name, operationId:operationId});
      };

      /**
       * Удалить всю информацию о длительных операциях
       * @protected
       * @param {SBIS3.CONTROLS.GenericLongOperationsProducer} self Экземпляр класса
       */
      /*var _clear = function (self) {
         var operationIds = GLOStorage.clear(self._name);
         if (operationIds.length) {
            self._notify('onlongoperationdeleted', {producer:self._name, operationIds:operationIds});
         }
      };*/

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

      /**
       * Заполнить длительные операции информацией о пользователях
       * @protected
       * @param {SBIS3.CONTROLS.LongOperationEntry[]} operations Список длительных операций
       * @return {Core/Deferred<SBIS3.CONTROLS.LongOperationEntry[]>}
       */
      var _fillUserInfo = function (operations) {
         var uuIds = operations.reduce(function (r, v) { if (v.userUuId && r.indexOf(v.userUuId) === -1) r.push(v.userUuId); return r; }, []);
         if (!uuIds.length) {
            return Deferred.success(operations);
         }
         var promise = new Deferred();
         require(['js!WS.Data/Source/SbisService', 'js!WS.Data/Chain'], function (SbisService, Chain) {
            if (!_userInfoSource) {
               var _userInfoSource = new SbisService({
                  endpoint: {
                     address: '/service/',
                     contract: 'Персона'
                  }/*,
                  binding: {
                     query:
                  },
                  model: */
               });
            }
            _userInfoSource.call('ПодробнаяИнформация', {
               'Персоны': uuIds,
               'ДляДокумента': null,
               'ПроверитьЧерныйСписок': false
            })
            .addCallbacks(
               function (dataSet) {
                  var indexes = operations.reduce(function (r, v, i) { if (v.userUuId) { if (!r[v.userUuId]) r[v.userUuId] = []; r[v.userUuId].push(i); } return r; }, {});
                  Chain(dataSet.getAll()).each(function (record) {
                     var userUuId = record.get('Персона');
                     var list = indexes[userUuId];
                     if (list) {
                        for (var i = 0; i < list.length; i++) {
                           var o = operations[list[i]];
                           o.userFirstName = record.get('Имя');
                           o.userPatronymicName = record.get('Отчество');
                           o.userLastName = record.get('Фамилия');
                           o.userPic = _getUserPic(userUuId);
                        }
                     }
                  });
                  promise.callback(operations);
               },
               function (err) {
                  promise.callback(operations);
               }
            );
         });
         return promise;
      };

      /**
       * Получить url изображения пользователя (аватарки)
       * @protected
       * @param {string} userUuId Идентификатор пользователя в сервисе пользовательских профайлов
       * @return {string}
       */
      var _getUserPic = function (userUuId) {
         return '/service/?id=0&method=PProfileServicePerson.GetPhoto&protocol=4&params=' + window.btoa(JSON.stringify({person:userUuId, kind:'mini'}));//'default'
      };

      var ObjectAssign = Object.assign || function (dst, src) { return Object.keys(src).reduce(function (o, n) { o[n] = src[n]; return o; }, dst); };



      /**
       * Префикс имён в локальном хранилище
       * @protected
       * @type {string}
       */
      var NS_PREFIX = 'wslop-gen-';

      /**
       * Набор внутренних методов для манипуляций с локальным хранилищем
       * (Модуль SBIS3.CORE.LocalStorage не имеет списочного метода - Задача 1174116054)
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

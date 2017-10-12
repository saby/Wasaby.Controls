/**
 * Типовой продюсер длительных операций
 *
 * @class SBIS3.CONTROLS.LongOperations.GenericProducer
 * @extends SBIS3.CONTROLS.LongOperations.AbstractProducer
 * @implements SBIS3.CONTROLS.LongOperations.IProducer
 *
 * @author Спирин Виктор Алексеевич
 *
 * @public
 */

define('js!SBIS3.CONTROLS.LongOperations.GenericProducer',
   [
      'Core/Deferred',
      'Core/UserInfo',
      'Core/EventBusChannel',
      'js!SBIS3.CONTROLS.LongOperations.Const',
      'js!SBIS3.CONTROLS.LongOperations.Entry',
      'js!SBIS3.CONTROLS.LongOperations.AbstractProducer'
   ],

   function (Deferred, UserInfo, EventBusChannel, LongOperationsConst, LongOperationEntry, AbstractLongOperationsProducer) {
      'use strict';

      /**
       * Имя продюсера
       * @protected
       * @type {string}
       */
      var PRODUCER_NAME = 'SBIS3.CONTROLS.LongOperations.GenericProducer';

      /**
       * Префикс пространства имён хранилища
       * @protected
       * @type {string}
       */
      var STORAGE_NS = 'wslop-gen';

      /**
       * Экземпляры класса (синглетоны), различающиеся идентификаторами (ключами массива). Один идентификатор - один экземпляр
       * @rpoteced
       * @type {object}
       */
      var _instances = {};

      /**
       * Класс типового продюсера длительных операций
       * @public
       * @type {object}
       */
      var GenericLongOperationsProducer = AbstractLongOperationsProducer.extend(/** @lends SBIS3.CONTROLS.LongOperations.GenericProducer.prototype */{
         _moduleName: PRODUCER_NAME,

         $protected: {
            /*_options: {
            }*/

            /**
             * Идентификатор экземпляра продюсера
             * @protected
             * @type {string}
             */
            _key: null,

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
            //GenericLongOperationsProducer.superclass.$constructor.apply(this, arguments);
            this._key = key || null;
            _instances[key] = this;
         },

         /**
          * Инициализировать экземпляр класса
          * @public
          */
         /*###init: function () {
            GenericLongOperationsProducer.superclass.init.apply(this, arguments);
         },*/

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
               var ERR = LongOperationsConst.ERR_UNLOAD;
               var snapshots = this._list(false);
               var oIds = [];
               for (var i = 0; i < snapshots.length; i++) {
                  var o = snapshots[i];
                  var status = 'status' in o ? o.status : DEFAULTS.status;
                  var wasRun = status === STATUSES.running;
                  if (wasRun || status === STATUSES.suspended) {
                     var operationId = o.id;
                     var handlers = this._actions ? this._actions[operationId] : null;
                     // Если обработчики действий пользователя установлены в этой вкладке
                     // При разрушении продюсера обработчики будут утеряны, поэтому операции завершаем ошибкой
                     if (handlers) {
                        delete this._actions[operationId];
                        o.status = STATUSES.ended;
                        o.isFailed = true;
                        o.resultMessage = ERR;
                        o[wasRun ? 'timeSpent' : 'timeIdle'] = (new Date()).getTime() - o.startedAt - (o[wasRun ? 'timeIdle' : 'timeSpent'] || 0);
                        this._put(o);
                        oIds.push(operationId);
                     }
                  }
               }
               if (oIds.length) {
                  this._notify('onlongoperationended', {producer:this.getName(), operationIds:oIds, error:ERR});
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
            return this._key ? PRODUCER_NAME + ':' + this._key : PRODUCER_NAME;
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
          * @return {Core/Deferred<SBIS3.CONTROLS.LongOperations.Entry[]>}
          */
         fetch: function (options) {
            return GenericLongOperationsProducer.superclass.fetch.apply(this, arguments).addCallback(function (operations) {
               operations.forEach(function (operation) {
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
               return operations;
            }.bind(this));
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
            if (!operationId || !(typeof operationId === 'string' || typeof operationId === 'number')) {
               throw new TypeError('Argument "operationId" must be string or number');
            }
            if (this._isDestroyed) {
               return Deferred.fail(LongOperationsConst.ERR_UNLOAD);
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
               var STATUSES = LongOperationEntry.STATUSES;
               switch (action) {
                  case 'suspend':
                     _setStatus(this, operationId, STATUSES.suspended, handler);
                     break;
                  case 'resume':
                     _setStatus(this, operationId, STATUSES.running, handler);
                     break;
                  case 'delete':
                     var snapshot = this._get(false, operationId);
                     if (!snapshot) {
                        throw new Error('Operation not found');
                     }
                     if (!('canDelete' in snapshot ? snapshot.canDelete : LongOperationEntry.DEFAULTS.canDelete)) {
                        throw new Error('Deleting is not allowed');
                     }
                     if (handler && !handler.call(null)) {
                        throw new Error('Deleting is not performed');
                     }
                     this._remove(operationId);//Опустить ниже?
                     var actions = this._actions[operationId];
                     if (actions && actions.progressor) {
                        var progressor = actions.progressor;
                        progressor.channel.unsubscribe(progressor.event, progressor.handler);
                     }
                     delete this._actions[operationId];
                     this._notify('onlongoperationdeleted', {producer:this.getName(), operationId:operationId});
                     break;
               }
               return Deferred.success();
            }
            catch (ex) {
               return Deferred.fail(ex);
            }
         },

         /**
          * Проверить, можно ли в данный момент ликвидировать экземпляр класса без необратимой потери данных
          * @public
          * @return {boolean}
          */
         canDestroySafely: function () {
            if (!this._isDestroyed) {
               if (this._actions) {
                  var snapshots = this._list(false);
                  if (snapshots.length) {
                     var STATUSES = LongOperationEntry.STATUSES;
                     var DEFAULTS = LongOperationEntry.DEFAULTS;
                     for (var i = 0; i < snapshots.length; i++) {
                        var o = snapshots[i];
                        if (this._actions[o.id]) {
                           var status = 'status' in o ? o.status : DEFAULTS.status;
                           if (status === STATUSES.running || status === STATUSES.suspended) {
                              // Если обработчики действий пользователя установлены в этой вкладке
                              // При разрушении продюсера обработчики будут утеряны, что приведёт к необратимой потере данных
                              return false;
                           }
                        }
                     }
                  }
               }
               return true;
            }
         },

         /**
          * Пространство имён хранилища
          * @protected
          * return {string}
          */
         _getStorageNS: function () {
            return STORAGE_NS + '(' + (this._key || '') + ')';
         },



         /**
          * Начать отслеживать ход длительной операции. В аргумент stopper при его разрешении возвращаются результат операции для отображения.
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
          * @param {object} [options.progressor] Источник информации о прогрессе операции
          * @param {Core/EventBusChannel} [options.progressor.channel] Канал событий, по которому будут передаваться события с информацией о прогрессе
          * @param {string} [options.progressor.event] Имя события в канале с информацией о прогрессе
          * @param {function} [options.progressor.extractor] Функция, принимающая данные события и возвращающая число от 0 до 1 (не от 0 до 100!) - прогресс выполнения операции
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
            if (options.progressor &&
                  !(typeof options.progressor === 'object' &&
                     options.progressor.channel instanceof EventBusChannel &&
                     (options.progressor.event && typeof options.progressor.event === 'string') &&
                     typeof options.progressor.extractor === 'function'
                  )
               ) {
               throw new TypeError('Argument "options.progressor" is not valid');
            }
            if (this._isDestroyed) {
               return;
            }
            var STATUSES = LongOperationEntry.STATUSES;
            options.canSuspend = typeof options.onSuspend === 'function' && typeof options.onResume === 'function';
            options.canDelete = typeof options.onDelete === 'function';
            options.userId = UserInfo.get('Пользователь');
            options.userUuId = UserInfo.get('ИдентификаторСервисаПрофилей') /*###|| $.cookie('CpsUserId')*/;
            var operationId = this._getStorageNextId();
            options.id = operationId;
            this._put(options);
            if (options.canSuspend || options.canDelete) {
               var listeners = {};
               if (options.canSuspend) {
                  listeners.onSuspend = options.onSuspend;
                  listeners.onResume = options.onResume;
               }
               if (options.canDelete) {
                  listeners.onDelete = options.onDelete;
               }
               this._actions[operationId] = listeners;
            }
            var progressor;
            var data = options.progressor;
            if (data) {
               progressor = {
                  channel: data.channel,
                  event: data.event,
                  extractor: data.extractor,
                  handler: _handleProgress.bind(null, this, operationId)
               };
               (this._actions[operationId] = this._actions[operationId] || {}).progressor = progressor;
            }
            this._notify('onlongoperationstarted', {producer:this.getName(), operationId:operationId});
            if (progressor) {
               progressor.channel.subscribe(progressor.event, progressor.handler);
            }
            stopper.addCallbacks(
               function (result) {
                  if (result && typeof result !== 'object') {
                     throw new TypeError('Invalid result');
                  }
                  _setStatus(this, operationId, STATUSES.ended, result || null);
               }.bind(this),
               function (err) {
                  _setStatus(this, operationId, STATUSES.ended, {error:err.message || 'Long operation error'});
               }.bind(this)
            )
         }
      });



      /**
       * Обработать событиен с информацией о прогрессе выполнения длительной операции
       * @protected
       * @param {SBIS3.CONTROLS.LongOperations.GenericProducer} self Экземпляр класса
       * @param {number} operationId Идентификатор длительной операции
       * @param {Core/EventObject} evtName Дескриптор события
       * @param {any} evt Данные события
       */
      var _handleProgress = function (self, operationId, evtName, evt) {
         var actions = self._actions[operationId];
         if (!actions) {
            return;
         }
         var snapshot = self._get(false, operationId);
         if (!snapshot) {
            return;
         }
         if (!actions.progressor) {
            throw new Error('Progressor is missed');
         }
         var progress = actions.progressor.extractor.call(null, evt);
         if (!(typeof progress === 'number' && 0 <= progress && progress <= 1)) {
            throw new Error('Illegal progress value');
         }
         snapshot.progressCurrent = progress;
         self._put(snapshot);
         self._notify('onlongoperationchanged', {producer:self.getName(), operationId:operationId, changed:'progress', progress:{value:progress, total:1}});
      };

      /**
       * Установить новый статус длительной операции
       * @protected
       * @param {SBIS3.CONTROLS.LongOperations.GenericProducer} self Экземпляр класса
       * @param {number} operationId Идентификатор длительной операции
       * @param {number} status Новый статус операции
       * @param {any} details Дополнительная информация при завершении. Для успешного завершения - результат, для завершения с ошибкой -
       *                      сообщение об ошибке. Для приостановки/возобновления может быть обработчик действия пользователя (опционально)
       */
      var _setStatus = function (self, operationId, status, details) {
         if (!(typeof operationId === 'number' && 0 < operationId)) {
            throw new TypeError('Argument "operationId" must be positive number');
         }
         var STATUSES = LongOperationEntry.STATUSES;
         if (typeof status !== 'number' || !Object.keys(STATUSES).some(function (k) { return status === STATUSES[k]; })) {
            throw new TypeError('Invalid argument "status"');
         }
         /*###if (status === STATUSES.deleted) {
            self._remove(operationId);
            delete this._actions[operationId];
            this._notify('onlongoperationdeleted', {producer:this.getName(), operationId:operationId});
            return;
         }*/
         var operation = self._get(true, operationId);
         if (!operation) {
            // Временное решение, нужно тщательно разобраться с привязкой операций к владкам в обоих обработчиках в _fetchCalls менеджера. Завтра с утра.
            return;
            //throw new Error('Operation not found');
         }
         if (status !== operation.status) {
            var isAllowed;
            var prev = operation.status;
            var wasRun = prev === STATUSES.running;
            switch (status) {
               case STATUSES.running:
                  isAllowed = prev === STATUSES.suspended;
                  break;
               case STATUSES.suspended:
                  isAllowed = wasRun;
                  break;
               case STATUSES.ended:
                  isAllowed = wasRun || prev === STATUSES.suspended;
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
                  var actions = self._actions[operationId];
                  if (actions && actions.progressor) {
                     var progressor = actions.progressor;
                     progressor.channel.unsubscribe(progressor.event, progressor.handler);
                  }
                  if (operation.canDelete) {
                     delete actions.onSuspend;
                     delete actions.onResume;
                  }
                  else {
                     delete self._actions[operationId];
                  }
                  eventType = 'onlongoperationended';
                  var err = details ? details.error : null;
                  if (!err) {
                     operation.progressCurrent = operation.progressTotal;
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
            operation[wasRun ? 'timeSpent' : 'timeIdle'] = (new Date()).getTime() - operation.startedAt - operation[wasRun ? 'timeIdle' : 'timeSpent'];
            self._put(operation);
            var common = {producer:self.getName(), operationId:operationId, status:status};
            self._notify(eventType, result ? ObjectAssign(common, result) : common);
         }
      };

      var ObjectAssign = Object.assign || function(d){return [].slice.call(arguments,1).reduce(function(r,s){return Object.keys(s).reduce(function(o,n){o[n]=s[n];return o},r)},d)};



      /**
       * Получить экземпляр продюсера, единственный для указанного идентификатора экземпляра
       * @public
       * @static
       * @param {string} key Идентификатор экземпляра продюсера
       * @return {SBIS3.CONTROLS.LongOperations.GenericProducer}
       */
      GenericLongOperationsProducer.getInstance = function (key) {
         // Конструктор уже возвращает синглетоны - на каждый идентификатор экземпляра один экземпляр продюсера
         return new GenericLongOperationsProducer(key);
      };



      return GenericLongOperationsProducer;
   }
);

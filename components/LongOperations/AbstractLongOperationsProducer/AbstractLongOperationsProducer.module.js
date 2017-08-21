/**
 * Абстрактный продюсер длительных операций - заготовка для порождения классов не слишком специфичных продюсеров длительных операций
 *
 * @class SBIS3.CONTROLS.AbstractLongOperationsProducer
 * @implements SBIS3.CONTROLS.ILongOperationsProducer
 * @public
 */

define('js!SBIS3.CONTROLS.AbstractLongOperationsProducer',
   [
      'Core/core-extend',
      'Core/Deferred',
      'Core/UserInfo',
      'js!WS.Data/Entity/ObservableMixin',
      'js!SBIS3.CONTROLS.ILongOperationsProducer',
      'js!SBIS3.CONTROLS.LongOperationEntry',
      'js!SBIS3.CONTROLS.LongOperationsConst'
   ],

   function (CoreExtend, Deferred, UserInfo, ObservableMixin, ILongOperationsProducer, LongOperationEntry, LongOperationsConst) {
      'use strict';

      /**
       * "Константа" - сортировка возвращаемых методом fetch элементов по умолчанию
       * @protected
       * @type {number}
       */
      var DEFAULT_FETCH_SORTING = {status:true, startedAt:false};

      /**
       * Сервис - источник данных о пользователях, когда это потребуется в методе fetch
       * @rpoteced
       * @type {WS.Data/Source/SbisService}
       */
      var _userInfoSource;

      /**
       * Класс абстрактного продюсера длительных операций
       * @public
       * @type {function}
       */
      var AbstractLongOperationsProducer = CoreExtend.extend({}, [ILongOperationsProducer, ObservableMixin], /** @lends SBIS3.CONTROLS.AbstractLongOperationsProducer.prototype */{
         _moduleName: 'SBIS3.CONTROLS.AbstractLongOperationsProducer',

         $protected: {
            /*_options: {
            }*/
         },

         /**
          * Конструктор
          * @public
          */
         $constructor: function $AbstractLongOperationsProducer () {
            this._isDestroyed = null;
         },

         /**
          * Инициализировать экземпляр класса
          * @public
          */
         init: function () {
            this._publish('onlongoperationstarted', 'onlongoperationchanged', 'onlongoperationended', 'onlongoperationdeleted');
         },

         /**
          * Получить имя экземпляра продюсера
          * @public
          * @return {string}
          */
         /*###getName: function () {
         },*/

         /**
          * Показывает, что события продюсера не нужно распространять по всем вкладкам
          * @public
          * @return {boolean}
          */
         /*###hasCrossTabEvents: function () {
            return false;
         },*/

         /**
          * Показывает, что данные продюсера не зависят от вкладки (всегда будут одинаковы во всех вкладках)
          * @public
          * @return {boolean}
          */
         /*###hasCrossTabData: function () {
            return true;
         },*/

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
               return Deferred.fail(LongOperationsConst.ERR_UNLOAD);
            }
            var operations = _list(this, options.where, options.orderBy || DEFAULT_FETCH_SORTING, options.offset, options.limit);
            if (operations.length) {
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
         /*###callAction: function (action, operationId) {
         },*/

         /**
          * Проверить, можно ли в данный момент ликвидировать экземпляр класса без необратимой потери данных
          * @public
          * @return {boolean}
          */
         canDestroySafely: function () {
            if (!this._isDestroyed) {
               return true;
            }
         },

         /**
          * Ликвидировать экземпляр класса
          * @public
          */
         destroy: function () {
            if (!this._isDestroyed) {
               this._isDestroyed = true;
            }
         },

         /**
          * Пространство имён хранилища
          * @protected
          * return {string}
          */
         _getStorageNS: function () {
            throw new Error('Method must be implemented');
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
       * @param {SBIS3.CONTROLS.AbstractLongOperationsProducer} self Экземпляр класса
       * @param {SBIS3.CONTROLS.LongOperationEntry|object} operation Длительная операция
       * @return {number}
       */
      var _put = function (self, operation) {
         /*###if (!operation || typeof operation !== 'object') {
            throw new TypeError('Argument "operation" must be object');
         }*/
         var name = self.getName();
         var storage = self._getStorageNS();
         if (operation instanceof LongOperationEntry) {
            if (operation.producer !== name) {
               throw new Error('Argument "operation" has invalid producer');
            }
         }
         else {
            var options = ObjectAssign({id:LOStorage.nextCounter(storage), producer:name}, operation);
            if (!options.startedAt) {
               options.startedAt = new Date();//^^^
            }
            operation = new LongOperationEntry(options);
         }
         var operationId = operation.id;
         LOStorage.put(storage, operationId, _toSnapshot(operation));
         return operationId;
      };

      /**
       * Получить длительную операцию по идентификатору
       * @protected
       * @param {number} operationId Идентификатор длительной операции
       * @param {SBIS3.CONTROLS.AbstractLongOperationsProducer} self Экземпляр класса
       * @return {SBIS3.CONTROLS.LongOperationEntry}
       */
      var _get = function (self, operationId) {
         /*###if (!(typeof operationId === 'number' && 0 < operationId)) {
            throw new TypeError('Argument "operationId" must be positive number');
         }*/
         var snapshot = LOStorage.get(self._getStorageNS(), operationId);
         return snapshot ? _fromSnapshot(snapshot, self.getName()) : null;
      };

      /**
       * Получить список длительных операций
       * @protected
       * @param {SBIS3.CONTROLS.AbstractLongOperationsProducer} self Экземпляр класса
       * @param {object} where Параметры фильтрации
       * @param {object} orderBy Параметры сортировки. По умолчанию используется обратный хронологический порядок
       * @param {number} offset Количество пропущенных элементов в начале
       * @param {number} limit Максимальное количество возвращаемых элементов
       * @return {SBIS3.CONTROLS.LongOperationEntry[]}
       */
      var _list = function (self, where, orderBy, offset, limit) {
         var snapshots = LOStorage.list(self._getStorageNS());
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
         var name = self.getName();
         return snapshots.map(function (v) { return _fromSnapshot(v, name); });
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
       * Удалить длительную операцию
       * @protected
       * @param {SBIS3.CONTROLS.AbstractLongOperationsProducer} self Экземпляр класса
       * @param {number} operationId Идентификатор длительной операции
       * @param {function} [handler] Обработчик действия пользователя (опционально)
       */
      var _remove = function (self, operationId, handler) {
         if (!(typeof operationId === 'number' && 0 < operationId)) {
            throw new TypeError('Argument "operationId" must be positive number');
         }
         var storage = self._getStorageNS();
         var snapshot = LOStorage.get(storage, operationId);
         if (!snapshot) {
            throw new Error('Operation not found');
         }
         if (handler && !handler.call(null)) {
            throw new Error('Action is not performed');
         }
         if (!('canDelete' in snapshot ? snapshot.canDelete : LongOperationEntry.DEFAULTS.canDelete)) {
            throw new Error('Action is not allowed');
         }
         LOStorage.remove(storage, operationId);
      };

      /**
       * Удалить всю информацию о длительных операциях
       * @protected
       * @param {SBIS3.CONTROLS.AbstractLongOperationsProducer} self Экземпляр класса
       */
      /*var _clear = function (self) {
         var operationIds = LOStorage.clear(self._getStorageNS());
         if (operationIds.length) {
            self._notify^^^('onlongoperationdeleted', {producer:self.getName(), operationIds:operationIds});
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

      var ObjectAssign = Object.assign || function(d){return [].slice.call(arguments,1).reduce(function(r,s){return Object.keys(s).reduce(function(o,n){o[n]=s[n];return o},r)},d)};



      /**
       * Набор внутренних методов для манипуляций с локальным хранилищем
       * (Модуль SBIS3.CORE.LocalStorage не имеет списочного метода - Задача 1174116054)
       * @protected
       * @type {object}
       */
      var LOStorage = {
         /**
          * Устанавливает и возвращает следующее значение счётчика экземпляров
          * @public
          * @param {string} ns Суффикс пространства имён
          * @return {number}
          */
         nextCounter: function (ns) {
            var name = ns + '-cnt';
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
            localStorage.setItem(ns + '-' + id, JSON.stringify(obj));
         },

         /**
          * Получить сохранённый ранее объект
          * @public
          * @param {string} ns Суффикс пространства имён
          * @param {number} id Идентификатор сохранённого объект
          * @return {object}
          */
         get: function (ns, id) {
            var data = localStorage.getItem(ns + '-' + id);
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
            var prefix = ns + '-';
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
            var name = ns + '-' + id;
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
            var prefix = ns + '-';
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



      return AbstractLongOperationsProducer;
   }
);

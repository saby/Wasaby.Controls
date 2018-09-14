define('SBIS3.CONTROLS/LongOperations/Tools/CallsPool',
   [
      'Core/core-extend',
      'Core/Deferred'
   ],

   function (CoreExtend, Deferred) {
      'use strict';

      /**
       * Класс, позволяющий выполнять группу из нескольких параллельных (асинхронных) вызовов и объединять их результаты. Уже в ходе выполнения к
       * группе могут быть произвольно добавлены новые запросы либо удалено любые выполняющиеся. После выполнения всех запросов буден возвращён
       * результат, включающий в себя все непустые и не ошибочные результаты по всем выполненным запросам
       *
       * @class SBIS3.CONTROLS/LongOperations/Tools/CallsPool
       * @extends Core/core-extend
       * @author Спирин В.А.
       * @public
       */
      var LongOperationsCallsPool = CoreExtend.extend(/** @lends SBIS3.CONTROLS/LongOperations/Tools/CallsPool.prototype */{
         _moduleName: 'SBIS3.CONTROLS/LongOperations/Tools/CallsPool',

         /**
          * Конструктор
          * @public
          * @param {string[]} fields Спискок имён параметров, которые будут идентифицировать запросы внутри группы. Все запросы должны будут указывать
          *                          такие параметры
          * @param {function} handlePartial Обработчик одиночного результата. Получает, обрабатывает и возвращает новый результат. Будет вызван
          *                                 только если результатом не является ошибка
          * @param {function} handleComplete Обработчик полного результата. Получает, обрабатывает и возвращает новый результат. Получает массив не
          *                                  пустых и не ошибочных результатов работы обработчиков одиночных результатов. При отсутствии таковых
          *                                  вызван не будет
          */
         constructor: function (fields, handlePartial, handleComplete) {
            if (!fields || !Array.isArray(fields) || !fields.length || fields.some(function (v) { return typeof v !== 'string'; })) {
               throw new TypeError('Argument "fields" must be string array');
            }
            if (typeof handlePartial !== 'function') {
               throw new TypeError('Argument "handlePartial" must be a function');
            }
            if (typeof handleComplete !== 'function') {
               throw new TypeError('Argument "handleComplete" must be a function');
            }
            /**
             * Спискок имён полей, идентифицирующих запросы внутри группы
             * @protected
             * @type {string[]}
             */
            this._fields = fields;
            /**
             * Обработчик одиночного результата
             * @protected
             * @type {function}
             */
            this._handlePartial = handlePartial;
            /**
             * Обработчик полного результата
             * @protected
             * @type {function}
             */
            this._handleComplete = handleComplete;
            /**
             * Список по группам выполняющихся запросов
             * @protected
             * @type {object}
             */
            this._calls = {};
            /**
             * Список обещаний, ожидающих результаты
             * @protected
             * @type {object}
             */
            this._outputs = {};
            /**
             * Счётчик групп
             * @protected
             * @type {number}
             */
            this._counter = 0;
         },

         /**
          * Добавить пакет запросов в список выполняющихся запросов
          * @public
          * @param {object} pool Составной указатель группы запросов
          * @param {object[]} members Массив идентифицирующих параметров
          * @param {Core/Deferred[]} promises Массив обещаний результатов
          */
         addList: function (pool, members, promises) {
            if (!Array.isArray(members)) {
               throw new TypeError('Argument "members" must be an array');
            }
            if (!Array.isArray(promises)) {
               throw new TypeError('Argument "promises" must be an array');
            }
            if (members.length !== promises.length) {
               throw new TypeError('Not equals array sizes');
            }
            var poolId = _getPoolId(this, pool, true);
            for (var i = 0; i < members.length; i++) {
               _add(this, poolId, members[i], promises[i]);
            }
         },

         /**
          * Добавить запрос в список выполняющихся запросов
          * @public
          * @param {object} pool Составной указатель группы запросов
          * @param {object} member Идентифицирующие параметры
          * @param {Core/Deferred} promise Обещание результата
          */
         add: function (pool, member, promise) {
            if (!pool || typeof pool !== 'object') {
               throw new TypeError('Argument "pool" must be an object');
            }
            _add(this, _getPoolId(this, pool, true), member, promise);
         },

         /**
          * Заменить запрос в списке выполняющихся запросов
          * @public
          * @param {object} pool Составной указатель группы запросов
          * @param {object} member Идентифицирующие параметры
          * @param {Core/Deferred} promise Обещание результата
          */
         replace: function (pool, member, promise) {
            if (!pool || typeof pool !== 'object') {
               throw new TypeError('Argument "pool" must be an object');
            }
            var poolId = _getPoolId(this, pool);
            if (!poolId) {
               throw new TypeError('Pool not found');
            }
            _add(this, poolId, member, promise, true);
         },

         /**
          * Получить обещание, ожидающее результат. Метод должен быть вызван только после того, как все необходимые запросы группы уже добавлены.
          * После вызова этого метода могут быть добавлены дополнитльные запросы в эту же группу, но только до тех пор, пока другие запросы не успели
          * завершиться. Иначе это будет новой группой и нужно вновь будет вызвать этот метод для получения обещания результата
          * @public
          * @param {object} pool Составной указатель группы запросов
          * @param {boolean} dontSkip Обязательно разрешить возвращённое методом обещание, даже если далее будут выданы следующие обещания на этот
          *                           же результат
          * @return {Core/Deferred<any>}
          */
         getResult: function (pool, dontSkip) {
            if (!pool || typeof pool !== 'object') {
               throw new TypeError('Argument "pool" must be an object');
            }
            if (dontSkip && typeof dontSkip !== 'boolean') {
               throw new TypeError('Argument "dontSkip" must be boolean if present');
            }
            var poolId = _getPoolId(this, pool);
            if (!poolId) {
               throw new Error('Pool not found');
            }
            var promise = new Deferred();
            if (!(poolId in this._outputs)) {
               this._outputs[poolId] = [];
            }
            this._outputs[poolId].push({promise:promise, dontSkip:!!dontSkip});
            // Проверить, возможно все результаты уже сразу получены
            _checkCompleteness(this, poolId);
            return promise;
         },

         /**
          * Проверить, есть ли удовлетворяющие критериям запросы в списке выполняющихся запросов
          * @public
          * @param {object} pool Составной указатель группы запросов
          * @return {boolean}
          */
         has: function (pool) {
            if (!pool || typeof pool !== 'object') {
               throw new TypeError('Argument "pool" must be an object');
            }
            var poolId = _getPoolId(this, pool);
            return !!poolId && _has(this, poolId);
         },

         /**
          * Удалить удовлетворяющие критериям запросы из списка выполняющихся запросов
          * @public
          * @param {object} [pool] Составной указатель группы запросов (опционально)
          * @param {object} [member] Идентифицирующие параметры (опционально)
          */
         remove: function (pool, member) {
            if (pool && typeof pool !== 'object') {
               throw new TypeError('Argument "pool" must be an object or null');
            }
            if (member && typeof member !== 'object') {
               throw new TypeError('Argument "member" must be an object or null');
            }
            var poolId;
            if (pool) {
               poolId = _getPoolId(this, pool);
               if (!poolId) {
                  throw new TypeError('Pool not found');
               }
            }
            _remove(this, poolId, member);
         },

         /**
          * Перечислить все группы, встречающиеся в списке выполняющихся запросов
          * @public
          * @param {object} [member] Идентифицирующие параметры (опционально)
          * @param {boolean} [completedOnly] Только если эти member завершены (опционально)
          * @return {object[]}
          */
         listPools: function (member, completedOnly) {
            if (member && typeof member !== 'object') {
               throw new TypeError('Argument "member" must be an object or null');
            }
            if (completedOnly && typeof completedOnly !== 'boolean') {
               throw new TypeError('Argument "completedOnly" must be boolean or null');
            }
            var list = [];
            var fields = this._fields;
            for (var poolId in this._calls) {
               if (!member || this._calls[poolId].list.some(function (c) { return _hasProps(c.member, fields, member) && (!completedOnly || !c.promise); })) {
                  list.push(this._calls[poolId].pool);
               }
            }
            return list;
         }
      });



      /**
       * Добавить запрос в список выполняющихся запросов
       * @protected
       * @param {SBIS3.CONTROLS/LongOperations/Tools/CallsPool} self Этот объект
       * @param {number} poolId Идентификатор группы
       * @param {object} member Идентифицирующие параметры
       * @param {boolean} isReplace Произвести не добавление нового, а замену существующего
       * @param {Core/Deferred} promise Обещание результата
       */
      var _add = function (self, poolId, member, promise, isReplace) {
         if (!(promise instanceof Deferred)) {
            throw new TypeError('Argument "promise" must be a Deferred');
         }
         if (!(member && typeof member === 'object' && self._fields.every(function (v) { return v in member; }))) {
            throw new TypeError('Argument "member" must be an object and have specified fields');
         }
         var m = self._fields.reduce(function (r, v) { r[v] = member[v]; return r; }, {});
         var call;
         if (!isReplace) {
            if (_has(self, poolId, m)) {
               throw new Error('Already exists');
            }
            call = {member:m, promise:promise};
            self._calls[poolId].list.push(call);
         }
         else {
            for (var list = self._calls[poolId].list, i = 0; i < list.length; i++) {
               var c = list[i];
               if (_isEq(c.member, m)) {
                  var prev = c.promise;
                  c.promise = promise;
                  _cancel(prev);
                  call = c;
                  break;
               }
            }
            if (!call) {
               throw new Error('Not found');
            }
         }
         promise.addBoth(_onPartial.bind(null, self, poolId, call, promise));
         /*###if (isReplace) {
            // Проверить, возможно после замены уже не нужно ждать дальше
            _checkCompleteness(self, poolId);
         }*/
      };

      /**
       * Проверить, есть ли удовлетворяющие критериям запросы в списке выполняющихся запросов
       * @protected
       * @param {SBIS3.CONTROLS/LongOperations/Tools/CallsPool} self Этот объект
       * @param {number} [poolId] Идентификатор группы (опционально)
       * @param {object} [member] Идентифицирующие параметры (опционально)
       * @return {boolean}
       */
      var _has = function (self, poolId, member) {
         var node = self._calls[poolId];
         if (node) {
            if (member) {
               for (var i = 0; i < node.list.length; i++) {
                  var c = node.list[i];
                  if (_hasProps(c.member, self._fields, member)) {
                     return true;
                  }
               }
            }
            else {
               return true;
            }
         }
         return false;
      };

      /**
       * Удалить удовлетворяющие критериям запросы из списка выполняющихся запросов
       * @protected
       * @param {SBIS3.CONTROLS/LongOperations/Tools/CallsPool} self Этот объект
       * @param {number} [poolId] Идентификатор группы (опционально)
       * @param {object} [member] Идентифицирующие параметры (опционально)
       */
      var _remove = function (self, poolId, member) {
         /*###if (member && typeof member !== 'object') {
            throw new TypeError('Argument "member" must be an object');
         }*/
         for (var i = 0, pIds = poolId ? [poolId] : Object.keys(self._calls); i < pIds.length; i++) {
            var pId = pIds[i];
            var calls = self._calls[pId].list;
            for (var j = calls.length - 1; 0 <= j; j--) {
               var c = calls[j];
               if (!member || _hasProps(c.member, self._fields, member)) {
                  // Удалить из списка
                  calls.splice(j, 1);
                  _cancel(c.promise);
               }
            }
            if (!calls.length) {
               delete self._calls[pId];
            }
         }
         // Проверить, возможно после удаления уже не нужно ждать дальше
         _checkCompleteness(self, poolId);
      };

      /**
       * Найти идентификатор группы
       * @protected
       * @param {SBIS3.CONTROLS/LongOperations/Tools/CallsPool} self Этот объект
       * @param {object} pool Составной указатель группы запросов
       * @param {boolean} canAdd Можно ли добавить новую группу, если её ещё нет
       * @return {number}
       */
      var _getPoolId = function (self, pool, canAdd) {
         for (var poolId in self._calls) {
            if (_isEq(self._calls[poolId].pool, pool)) {
               return poolId;
            }
         }
         if (canAdd) {
            var poolId = ++self._counter;
            self._calls[poolId] = {pool:pool, list:[]};
            return poolId;
         }
      };

      /**
       * Обработчик одиночного результата
       * @protected
       * @param {SBIS3.CONTROLS/LongOperations/Tools/CallsPool} self Этот объект
       * @param {number} poolId Идентификатор группы
       * @param {object} call Элемент
       * @param {Core/Deferred} promise Обещание результата
       * @param {any} result Результат или ошибка
       */
      var _onPartial = function (self, poolId, call, promise, result) {
         if (call.promise === promise) {
            delete call.promise;
            if (result instanceof Error) {
               call.error = result;
            }
            else {
               var node = self._calls[poolId];
               if (node) {
                  try {
                     call.result = self._handlePartial(node.pool, call.member, result);
                  }
                  catch (ex) {
                     call.error = ex;
                  }
               }
               else {
                  call.error = new Error('Pool not found');
               }
            }
            // Проверить, все ли результаты получены или нужно ждать дальше
            _checkCompleteness(self, poolId);
         }
      };

      /**
       * Проверить, все ли результаты получены или нужно ждать дальше. Если все результаты получены - выполнение запросов завершается
       * @protected
       * @param {SBIS3.CONTROLS/LongOperations/Tools/CallsPool} self Этот объект
       * @param {number} [poolId] Идентификатор группы (опционально)
       */
      var _checkCompleteness = function (self, poolId) {
         for (var i = 0, pIds = poolId ? [poolId] : Object.keys(self._calls); i < pIds.length; i++) {
            var pId = pIds[i];
            if (_isComplete(self, pId)) {
               // Все результаты группы есть, можно завершать
               _onComplete(self, pId);
            }
         }
      };

      /**
       * Проверить, все ли результаты получены или нужно ждать дальше
       * @protected
       * @param {SBIS3.CONTROLS/LongOperations/Tools/CallsPool} self Этот объект
       * @param {number} poolId Идентификатор группы
       * @return {boolean}
       */
      var _isComplete = function (self, poolId) {
         if (!(self._outputs[poolId] && self._outputs[poolId].length)) {
            return false;
         }
         var node = self._calls[poolId];
         if (!(node && node.list.length)) {
            return false;
         }
         for (var i = 0; i < node.list.length; i++) {
            if (node.list[i].promise) {
               return false;
            }
         }
         // Все результаты есть
         return true;
      };

      /**
       * Объединяет все непустые и не ошибочные результаты и разрешает все обещания результатов
       * @protected
       * @param {SBIS3.CONTROLS/LongOperations/Tools/CallsPool} self Этот объект
       * @param {number} poolId Идентификатор группы
       */
      var _onComplete = function (self, poolId) {
         var node = self._calls[poolId];
         var outs = self._outputs[poolId];
         if (!node || !node.list.length || !outs || !outs.length) {
            return;
         }
         //###_remove(self, poolId);
         delete self._calls[poolId];
         delete self._outputs[poolId];
         var results;
         for (var i = 0; i < node.list.length; i++) {
            var c = node.list[i];
            if (!c.error && c.result) {
               if (!results) {
                  results = [];
               }
               results.push(c.result);
            }
         }
         results = self._handleComplete(node.pool, results);
         for (var i = 0; i < outs.length; i++) {
            var o = outs[i];
            // Разрешить только "защищённые" или последнее обещание
            if (o.dontSkip || i === outs.length - 1) {
               o.promise.callback(results);
            }
            else
            // Только если потребитель не успел уже сам от-cancele-ить
            if (!o.promise.isReady()) {
               var err = new Error('Call is outdated');
               err.name = 'OutdatedError';
               o.promise.errback(err);
            }
         }
      };



      /**
       * Отказаться от дальнейшего ожидания исполнения обещания
       * @protected
       * @param {Core/Deferred} promise Обещание
       * @return {boolean}
       */
      var _cancel = function (promise) {
         if (promise && promise.cancel && !promise.isReady()) {
            // В текущей реализации при наличии обработчика ошибок при вызове cancel он перейдёт в успешно разрешённое состояние (Задача 1174127408)
            //promise.cancel();
            //////////////////////////////////////////////////
            //console.log('DBG: LO_CallsPool._cancel: promise.isSuccessful()=', promise.isSuccessful(), '; promise._fired=', promise._fired, '; promise._results[1]=', promise._results ? promise._results[1] : promise._results, ';');
            //////////////////////////////////////////////////
         }
      };

      /**
       * Проверить, имеет ли указанный объект все указанные значения свойств
       * @protected
       * @param {object} obj Тестируемый объект
       * @param {string[]} names Список имён свойств
       * @param {object} values Значения свойства
       * @return {boolean}
       */
      var _hasProps = function (obj, names, values) {
         for (var i = 0; i < names.length; i++) {
            var n = names[i];
            if (n in values && values[n] !== obj[n]) {
               return false;
            }
         }
         return true;
      };

      /**
       * Проверить на равенство два значения
       * @protected
       * @param {object} v1 Сравниваемое значение
       * @param {object} v2 Сравниваемое значение
       * @return {boolean}
       */
      var _isEq = function (v1, v2) {
         if (v1 == null && v2 == null) {
            return true;
         }
         if (!(v1 && typeof v1 === 'object' && v2 && typeof v2 === 'object')) {
            return v1 === v2;
         }
         if (Array.isArray(v1)) {
            if (!Array.isArray(v2) || v1.length !== v2.length) {
               return false;
            }
            for (var i = 0; i < v1.length; i++) {
               if (!_isEq(v1[i], v2[i])) {
                  return false;
               }
            }
         }
         else {
            if (Array.isArray(v2)) {
               return false;
            }
            var ns = Object.keys(v1);
            if (ns.length != Object.keys(v2).length) {
               return false;
            }
            for (var i = 0; i < ns.length; i++) {
               var n = ns[i];
               if (!_isEq(v1[n], v2[n])) {
                  return false;
               }
            }
         }
         return true;
      };



      return LongOperationsCallsPool;
   }
);

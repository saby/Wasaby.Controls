/**
 * Класс, позволяющий выполнять группу из нескольких параллельных (асинхронных) вызовов и объединять их результаты. Уже в ходе выполнения к
 * группе могут быть произвольно добавлены новые запросы либо удалено любые выполняющиеся. После выполнения всех запросов буден возвращён
 * результат, включающий в себя все непустые и не ошибочные результаты по всем выполненным запросам
 *
 * @class SBIS3.CONTROLS.LongOperationsCallsPool
 * @public
 */
define('js!SBIS3.CONTROLS.LongOperationsCallsPool',
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
       * @public
       * @type {SBIS3.CONTROLS.LongOperationsCallsPool}
       */
      var LongOperationsCallsPool = CoreExtend.extend(/** @lends SBIS3.CONTROLS.LongOperationsCallsPool.prototype */{
         _moduleName: 'SBIS3.CONTROLS.LongOperationsCallsPool',

         /**
          * Конструктор
          * @public
          * @param {string[]} fields Спискок имён параметров, которые будут идентифицировать запросы. Все запросы должны будут указывать
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
             * Спискок имён полей, идентифицирующих запросы
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
             * Список выполняющихся запросов
             * @protected
             * @type {object[]}
             */
            this._calls = [];
            /**
             * Список обещаний, ожидающих результаты
             * @protected
             * @type {object}
             */
            this._promises = {};
         },

         /**
          * Добавить пакет запросов в список выполняющихся запросов
          * @public
          * @param {number} group Идентификатор группы запросов
          * @param {object[]} paramsList Массив идентифицирующих параметров
          * @param {Core/Deferred[]} promises Массив обещаний результатов
          */
         addList: function (group, paramsList, promises) {
            if (!Array.isArray(paramsList)) {
               throw new TypeError('Argument "paramsList" must be an array');
            }
            if (!Array.isArray(promises)) {
               throw new TypeError('Argument "promises" must be an array');
            }
            if (paramsList.length !== promises.length) {
               throw new TypeError('Not equals array sizes');
            }
            for (var i = 0; i < paramsList.length; i++) {
               this.add(group, paramsList[i], promises[i]);
            }
         },

         /**
          * Добавить запрос в список выполняющихся запросов
          * @public
          * @param {number} group Идентификатор группы запросов
          * @param {object} params Идентифицирующие параметры
          * @param {Core/Deferred} promise Обещание результата
          */
         add: function (group, params, promise) {
            if (!group || typeof group !== 'number') {
               throw new TypeError('Argument "group" must be a number');
            }
            if (!(promise instanceof Deferred)) {
               throw new TypeError('Argument "promise" must be a Deferred');
            }
            var ps = _checkParams(this._fields, params);
            if (!ps) {
               throw new TypeError('Argument "params" must be an object and have specified fields');
            }
            if (this.has(group, ps)) {
               throw new Error('Already exists');
            }
            var call = {group:group, params:ps, promise:promise};
            this._calls.push(call);
            call.promise.addBoth(_onPartial.bind(null, this, call));
         },

         /**
          * Получить обещание, ожидающее результат. Метод должен быть вызван только после того, как все необходимые запросы группы уже добавлены.
          * После вызова этого метода могут быть добавлены дополнитльные запросы в эту же группу, но только до тех пор, пока другие запросы не успели
          * завершиться. Иначе это будет новой группой и нужно вновь будет вызвать этот метод для получения обещания результата
          * @public
          * @param {number} group Идентификатор группы запросов
          * @return {Core/Deferred<any>}
          */
         getResult: function (group) {
            if (!group || typeof group !== 'number') {
               throw new TypeError('Argument "group" must be a number');
            }
            var promise = new Deferred();
            if (!(group in this._promises)) {
               this._promises[group] = [];
            }
            this._promises[group].push(promise);
            // Проверить, возможно все результаты уже сразу получены
            _checkCompleteness(this, group);
            return promise;
         },

         /**
          * Проверить, есть ли удовлетворяющие критериям запросы в списке выполняющихся запросов
          * @public
          * @param {number} [group] Идентификатор группы запросов (опционально)
          * @param {object} [params] Идентифицирующие параметры (опционально)
          * @return {boolean}
          */
         has: function (group, params) {
            if (group && typeof group !== 'number') {
               throw new TypeError('Argument "group" must be a number');
            }
            if (params && typeof params !== 'object') {
               throw new TypeError('Argument "params" must be an object');
            }
            for (var i = 0; i < this._calls.length; i++) {
               var c = this._calls[i];
               if ((!group || c.group === group) && (!params || _hasProps(c.params, this._fields, params))) {
                  return true;
               }
            }
            return false;
         },

         /**
          * Удалить удовлетворяющие критериям запросы из списка выполняющихся запросов
          * @public
          * @param {number} [group] Идентификатор группы запросов (опционально)
          * @param {object} [params] Идентифицирующие параметры (опционально)
          */
         remove: function (group, params) {
            if (group && typeof group !== 'number') {
               throw new TypeError('Argument "group" must be a number');
            }
            if (params && typeof params !== 'object') {
               throw new TypeError('Argument "params" must be an object');
            }
            for (var i = this._calls.length - 1; 0 <= i; i--) {
               var c = this._calls[i];
               if (c && (!group || c.group === group) && (!params || _hasProps(c.params, this._fields, params))) {
                  // Удалить из списка
                  this._calls.splice(i, 1);
                  var p = c.promise;
                  if (p && p.cancel && !p.isReady()) {
                     // В текущей реализации при наличии обработчика ошибок при вызове cancel он перейдёт в успешно разрешённое состояние (Задача 1174127408)
                     //p.cancel();
                     //////////////////////////////////////////////////
                     //console.log('DBG: LO_CallsPool.remove: p.isSuccessful()=', p.isSuccessful(), '; p._fired=', p._fired, '; p._results[1]=', p._results ? p._results[1] : p._results, ';');
                     //////////////////////////////////////////////////
                  }
               }
            }
            // Проверить, возможно после удаления уже не нужно ждать дальше
            _checkCompleteness(this, group);
         },

         /**
          * Перечислить все группы, встречающиеся в списке выполняющихся запросов
          * @public
          * @return {number[]}
          */
         listGroups: function () {
            var list = [];
            for (var i = 0; i < this._calls.length; i++) {
               var value = this._calls[i].group;
               if (list.indexOf(value) === -1) {
                  list.push(value);
               }
            }
            return list;
         }
      });



      /**
       * Проверить допустимость указанных идентифицирующих запрос параметров
       * @protected
       * @param {string[]} fields Спискок имён полей, идентифицирующих запросы
       * @param {object} params Идентифицирующие параметры
       * @return {object}
       */
      var _checkParams = function (fields, params) {
         return params && typeof params === 'object' && fields.every(function (v) { return v in params; })
            ? fields.reduce(function (acc, v) { acc[v] = params[v]; return acc; }, {})
            : null;
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
       * Найти все запросы группы в списке выполняющихся запросов. Возвращает список найденных элементов
       * @protected
       * @param {SBIS3.CONTROLS.LongOperationsCallsPool} self Этот объект
       * @param {number} group Идентификатор группы запросов
       * @return {object[]}
       */
      var _getGroup = function (self, group) {
         var list = [];
         for (var i = 0; i < self._calls.length; i++) {
            var c = self._calls[i];
            if (c.group === group) {
               list.push(c);
            }
         }
         return list;
      };

      /**
       * Обработчик одиночного результата
       * @protected
       * @param {SBIS3.CONTROLS.LongOperationsCallsPool} self Этот объект
       * @param {object} call Элемент
       * @param {any} result Результат или ошибка
       */
      var _onPartial = function (self, call, result) {
         delete call.promise;
         var group = call.group;
         if (result instanceof Error) {
            call.error = result;
         }
         else {
            try {
               call.result = self._handlePartial(group, call.params, result);
            }
            catch (ex) {
               call.error = ex;
            }
         }
         // Проверить, все ли результаты получены или нужно ждать дальше
         _checkCompleteness(self, group);
      };

      /**
       * Проверить, все ли результаты получены или нужно ждать дальше. Если все результаты получены - выполнение запросов завершается
       * @protected
       * @param {SBIS3.CONTROLS.LongOperationsCallsPool} self Этот объект
       * @param {number} group Идентификатор группы запросов
       */
      var _checkCompleteness = function (self, group) {
         for (var i = 0, groups = group ? [group] : self.listGroups(); i < groups.length; i++) {
            var g = groups[i];
            if (_isComplete(self, g)) {
               // Все результаты группы есть, можно завершать
               _onComplete(self, g);
            }
         }
      };

      /**
       * Проверить, все ли результаты получены или нужно ждать дальше
       * @protected
       * @param {SBIS3.CONTROLS.LongOperationsCallsPool} self Этот объект
       * @param {number} group Идентификатор группы запросов
       * @return {boolean}
       */
      var _isComplete = function (self, group) {
         if (!self._calls.length || !(self._promises[group] && self._promises[group].length)) {
            return false;
         }
         for (var i = 0; i < self._calls.length; i++) {
            var c = self._calls[i];
            if (c.group === group && c.promise) {
               return false;
            }
         }
         // Все результаты есть
         return true;
      };

      /**
       * Объединяет все непустые и не ошибочные результаты и разрешает все обещания результатов
       * @protected
       * @param {SBIS3.CONTROLS.LongOperationsCallsPool} self Этот объект
       * @param {number} group Идентификатор группы запросов
       */
      var _onComplete = function (self, group) {
         var calls = _getGroup(self, group);
         var promises = self._promises[group];
         if (!calls || !calls.length || !promises || !promises.length) {
            return;
         }
         self.remove(group);
         delete self._promises[group];
         var results;
         for (var i = 0; i < calls.length; i++) {
            var call = calls[i];
            if (!call.error && call.result) {
               if (!results) {
                  results = [];
               }
               results.push(call.result);
            }
         }
         if (results) {
            results = self._handleComplete(group, results);
         }
         for (var i = 0; i < promises.length; i++) {
            promises[i].callback(results);
         }
      };



      return LongOperationsCallsPool;
   }
);

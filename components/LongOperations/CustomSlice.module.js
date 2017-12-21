/**
 * Класс, обеспечивающий работу только с теми длительными операциями, которые соответствуют указанному в конструкторе условию выборки
 *
 * @class SBIS3.CONTROLS.LongOperations.CustomSlice
 * @extends Core/core-extend
 *
 * @author Спирин Виктор Алексеевич
 */
define('js!SBIS3.CONTROLS.LongOperations.CustomSlice',
   [
      'Core/core-extend',
      'js!SBIS3.CONTROLS.LongOperations.Manager',
      'WS.Data/Collection/RecordSet'
   ],

   function (CoreExtend, manager, RecordSet) {
      'use strict';



      var CustomSlice = CoreExtend.extend(/** @lends SBIS3.CONTROLS.LongOperations.CustomSlice.prototype */{

         /**
          * @event onlongoperationstarted Происходит при начале исполнения новой длительной операции
          * @param {Core/EventObject} evtName Дескриптор события
          * @param {object} data Данные события
          * @see SBIS3.CONTROLS.LongOperations.IProducer
          *
          * @event onlongoperationchanged Происходит при изменении свойств длительной операции в процесе исполнения
          * @param {Core/EventObject} evtName Дескриптор события
          * @param {object} data Данные события
          * @see SBIS3.CONTROLS.LongOperations.IProducer
          *
          * @event onlongoperationended Происходит при завершении длительной операции по любой причине. При завершении вследствие ошибки
          * предоставляется информация об ошибке в свойстве data.error
          * @param {Core/EventObject} evtName Дескриптор события
          * @param {object} data Данные события
          * @see SBIS3.CONTROLS.LongOperations.IProducer
          *
          * @event onlongoperationdeleted При удалении длительной операции
          * @param {Core/EventObject} evtName Дескриптор события
          * @param {object} data Данные события
          * @see SBIS3.CONTROLS.LongOperations.IProducer
          *
          * @event ondestroy При уничтожении менеджера
          * @param {Core/EventObject} evtName Дескриптор события
          */

         /**
          * Конструктор
          * @public
          * @param {object} condition Условия выборки
          */
         constructor: function CustomSlice (condition) {
            var names;
            if (!condition || typeof condition !== 'object' || !Object.keys(condition).length) {
               throw new TypeError('None empty object required');
            }
            for (var name in condition) {
               var value = condition[name];
               if (value !== null && value !== undefined) {
                  var type = typeof value;
                  if (type !== 'boolean' && type !== 'number' && type !== 'string') {
                     throw new TypeError('Only primitive values supported');
                  }
               }
            }
            this._condition = condition;
            this._listeners = {};
         },

         /**
          * Получить условия выборки
          * @public
          * @type {object}
          */
         get condition () {
            return this._condition;
         },

         /**
          * Подписаться на получение события (только о тех длительных операциях, которые соответствуют условию выборки)
          * @public
          * @param {string} eventType Тип события
          * @param {function} listener Обработчик события
          */
         subscribe: function (eventType, listener) {
            var list = this._listeners[eventType];
            (this._listeners[eventType] = list = list || []).push(listener);
            if (!list) {
               manager.subscribe(eventType, this._onEvent = this._onEvent || _onEvent.bind(null, this));
            }
         },

         /**
          * Отписаться от получения события (только о тех длительных операциях, которые соответствуют условию выборки)
          * @public
          * @param {string} eventType Тип события
          * @param {function} listener Обработчик события
          */
         unsubscribe: function (eventType, listener) {
            var list = this._listeners[eventType];
            var i = -1;
            if (list) {
               i = list.indexOf(listener);
            }
            if (i === -1) {
               throw new Error('Unknown listener');
            }
            if (1 < list.length) {
               list.splice(listener, 1);
            }
            else {
               delete this._listeners[eventType];
               manager.unsubscribe(eventType, this._onEvent);
            }
         },

         /**
          * Запросить набор последних длительных операций удовлетворяющих условию выборки из всех зарегистрированных продюсеров
          * @public
          * @param {number} [limit] Максимальное количество возвращаемых элементов (опционально, если не указано, будет определено менеджером длительнеых операций)
          * @return {Core/Deferred<WS.Data/Collection/RecordSet<SBIS3.CONTROLS.LongOperations.Entry>>}
          */
         fetch: function (limit) {
            return manager.fetch({limit:limit}).addCallback(function (recordSet) {
               return recordSet && recordSet.getCount() ? new RecordSet({
                  rawData: recordSet.getRawData().filter(_isSatisfied.bind(null, this._condition)),
                  model: recordSet.getModel(),
                  isProperty: recordSet.getIdProperty()
               }.bind(this)) : recordSet;
            });
         }
      });



      // Приватные методы

      /**
       * Обработчик событий
       * @private
       * @param {SBIS3.CONTROLS.LongOperations.CustomSlice} self Этот объект
       * @param {Core/EventObject} evtName Дескриптор события
       * @param {any} evt Данные события (если есть)
       */
      var _onEvent = function (self, evtName, evt) {
         var list = self._listeners[evtName.name];
         if (list && _isSatisfied(self._condition, evt)) {
            for (var i = 0; i < list.length; i++) {
               list[i].call(null, evtName, evt);
            }
         }
      };

      /**
       * Проверить, удовлетворяет ли объект условию
       * @private
       * @param {object} condition Условие
       * @param {object} value Проверяемый объект
       * @return {boolean}
       */
      var _isSatisfied = function (condition, value) {
         var custom = value ? value.custom : null;
         return !!custom && Object.keys(condition).every(function (name) { return condition[name] === custom[name]; });
      };



      return CustomSlice;
   }
);

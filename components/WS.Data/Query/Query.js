/* global define */
define('js!WS.Data/Query/Query', [
   'js!WS.Data/Entity/ICloneable',
   'js!WS.Data/Entity/OptionsMixin',
   'js!WS.Data/Query/Join',
   'js!WS.Data/Query/Order',
   'Core/core-functions',
   'Core/core-extend'
], function (
   ICloneable,
   OptionsMixin,
   Join,
   Order,
   CoreFunctions,
   CoreExtend
) {
   'use strict';

   /**
    * Запрос на выборку из множества.
    *
    * Выберем заказы за сутки и отсортируем их по возрастанию номера:
    * <pre>
    *    var query = new Query(),
    *       date = new Date();
    *
    *    date.setDate(date.getDate() - 1);
    *
    *    query.select([
    *          'id',
    *          'date',
    *          'customerId'
    *       ])
    *       .from('Orders')
    *       .where({
    *          'date>=': date
    *       })
    *       .orderBy('id');
    * </pre>
    * @class WS.Data/Query/Query
    * @implements WS.Data/Entity/ICloneable
    * @mixes WS.Data/Entity/OptionsMixin
    * @public
    * @author Мальцев Алексей
    */

   var Query = CoreExtend.extend([ICloneable, OptionsMixin], /** @lends WS.Data/Query/Query.prototype */{
      _moduleName: 'WS.Data/Query/Query',

      /**
       * @member {Object.<String, String>} Выбираемые поля
       */
      _select: null,

      /**
       * @member {String} Объект выборки
       */
      _from: '',

      /**
       * @member {String} Псеводним объекта выборки
       */
      _as: '',

      /**
       * @member {Array.<WS.Data/Query/Join>} Объединения с другими выборками
       */
      _join: null,

      /**
       * @member {Object.<String, String>} Способ фильтрации
       */
      _where: null,

      /**
       * @member {Array.<String>} Способ группировки
       */
      _groupBy: null,

      /**
       * @member {Array.<WS.Data/Query/Order>} Способы сортировки
       */
      _orderBy: null,

      /**
       * @member {Number} Смещение
       */
      _offset: 0,

      /**
       * @member {Number} Максимальное кол-во записей
       */
      _limit: undefined,

      /**
       * @member {Object} Мета данные запроса
       */
      _meta: null,

      constructor: function $Query(options) {
         this._select = {};
         this._join = [];
         this._where = {};
         this._groupBy = [];
         this._orderBy = [];
         this._meta = {};

         Query.superclass.constructor.call(this, options);
         OptionsMixin.constructor.call(this, options);
      },

      //region WS.Data/Entity/ICloneable

      clone: function () {
         //TODO: deeper clone?
         var clone = new Query();
         clone._select = CoreFunctions.clone(this._select);
         clone._from = this._from;
         clone._as = this._as;
         clone._join = this._join.slice();
         clone._where = CoreFunctions.clone(this._where);
         clone._groupBy = this._groupBy.slice();
         clone._orderBy = this._orderBy.slice();
         clone._offset = this._offset;
         clone._limit = this._limit;
         clone._meta = CoreFunctions.clone(this._meta);

         return clone;
      },

      //endregion WS.Data/Entity/ICloneable

      //region Public methods

      /**
       * Сбрасывает все параметры запроса
       * @return {WS.Data/Query/Query}
       */
      clear: function () {
         this._select = {};
         this._from = '';
         this._as = '';
         this._join = [];
         this._where = {};
         this._groupBy = [];
         this._orderBy = [];
         this._offset = 0;
         this._limit = undefined;
         this._meta = {};

         return this;
      },

      /**
       * Возвращает поля выборки
       * @return {Object.<String, String>}
       * @example
       * Получим поля выборки:
       * <pre>
       *    var query = new Query()
       *       .select([
       *          'id',
       *          'date'
       *       ]);
       *    query.getSelect();//{id: 'id', date: 'date'}
       * </pre>
       */
      getSelect: function () {
         return this._select;
      },

      /**
       * Устанавливает поля выборки
       * @param {Array.<String>|Object.<String, String>|String} expression Выбираемые поля
       * @return {WS.Data/Query/Query}
       * @example
       * Выбираем все заказы с определенным набором полей:
       * <pre>
       *    var query = new Query()
       *       .select([
       *          'id',
       *          'date',
       *          'customerId'
       *       ])
       *       .from('Orders');
       * </pre>
       * Выбираем все заказы со всеми полями:
       * <pre>
       *    var query = new Query()
       *       .select('*')
       *       .from('Orders');
       * </pre>
       */
      select: function (expression) {
         this._select = this._parseSelectExpression(expression);

         return this;
      },

      /**
       * Возвращает объект выборки
       * @return {String}
       * @example
       * Получим объект выборки:
       * <pre>
       *    var query = new Query()
       *       .select([
       *          'id',
       *          'date'
       *       ])
       *       .from('Orders');
       *    query.getFrom();//'Orders'
       * </pre>
       */
      getFrom: function () {
         return this._from;
      },

      /**
       * Возвращает псеводним выборки
       * @return {String}
       * @example
       * Получим псеводним выборки:
       * <pre>
       *    var query = new Query()
       *       .select([
       *          'id',
       *          'date'
       *       ])
       *       .from('Orders', 'o');
       *    query.getAs();//'o'
       * </pre>
       */
      getAs: function () {
         return this._as;
      },

      /**
       * Устанавливает объект выборки
       * @param {String} resource Объект выборки
       * @param {String} [as] Псеводним объекта выборки
       * @return {WS.Data/Query/Query}
       * @example
       * Выбираем заказы с указанием полей через псеводним:
       * <pre>
       *    var query = new Query()
       *       .select({
       *          'o.id',
       *          'o.date',
       *          'o.customerId'
       *       })
       *       .from('Orders', 'o');
       * </pre>
       */
      from: function (resource, as) {
         this._from = resource;
         this._as = as;

         return this;
      },

      /**
       * Возвращает способы объединения
       * @return {WS.Data/Query/Join[]}
       * @example
       * Получим способ объединения c объектом Customers:
       * <pre>
       *    var query = new Query()
       *       .select('*')
       *       .from('Orders')
       *       .join(
       *          'Customers',
       *          {id: 'customerId'},
       *          ['name', 'email']
       *       );
       *
       *    var join = query.getJoin()[0];
       *    join.getResource();//'Customers'
       *    join.getSelect();//['name', 'email']
       * </pre>
       */
      getJoin: function () {
         return this._join;
      },

      /**
       * Устанавливает объединение выборки с другой выборкой
       * @param {String|Array} resource Объект выборки для объединения и его псеводним
       * @param {Object} on Правило объединения
       * @param {Object|Array|String} expression Выбираемые поля
       * @param {Boolean} [inner=true] Внутреннее или внешнее объединение
       * @return {WS.Data/Query/Query}
       * @example
       * <pre>
       *    var query = new Query()
       *       .select('*')
       *       .from('Orders')
       *       .join(
       *          'Customers',
       *          {id: 'customerId'},
       *          '*'
       *       );
       *
       *    var query = new Query()
       *       .select('*')
       *       .from('Orders')
       *       .join(
       *          'Customers',
       *          {id: 'customerId'},
       *          {
       *             customerName: 'name',
       *             customerEmail: 'email'
       *          }
       *       );
       * </pre>
       */
      join: function (resource, on, expression, inner) {
         if (typeof resource === 'string') {
            resource = resource.split('');
         }

         if (!(resource instanceof Array)) {
            throw new Error('Invalid argument "resource"');
         }

         this._join.push(new Join({
            resource: resource.shift(),
            as: resource.shift() || '',
            on: on,
            select: this._parseSelectExpression(expression),
            inner: inner === undefined ? true : inner
         }));

         return this;
      },

      /**
       * Возвращает способ фильтрации
       * @return {Object.<String, String>}
       * @example
       * Получим способ фильтрации выборки:
       * <pre>
       *    var query = new Query()
       *       .select('*')
       *       .from('Orders')
       *       .where({'id>': 10});
       *
       *    query.getWhere();//{'id>': 10}
       * </pre>
       */
      getWhere: function () {
         return this._where;
      },

      /**
       * Устанавливает фильтр выборки
       * @param {Object.<String, String>} expression Условие фильтрации
       * @return {WS.Data/Query/Query}
       * @example
       * Выбираем все заказы с номером больше 10, сделанные до текущего момента:
       * <pre>
       *    var query = new Query()
       *       .select('*')
       *       .from('Orders')
       *       .where({
       *          'id>': 10,
       *          'date<=': new Date()
       *       });
       * </pre>
       * Выбираем рейсы, приземлившиеся в аэропорту "Шереметьево", прибывшие из Нью-Йорка или Лос-Анджелеса:
       * <pre>
       *    var query = new Query()
       *       .select('*')
       *       .from('AirportsTable')
       *       .where({
       *          iata: 'SVO',
       *          direction: 'Arrivals',
       *          state: 'Landed',
       *          fromCity: ['New York', 'Los Angeles']
       *       });
       * </pre>
       */
      where: function (expression) {
         expression = expression || {};
         if (typeof expression !== 'object') {
            throw new Error('Invalid argument');
         }

         this._where = expression;

         return this;
      },

      /**
       * Возвращает способы сортировки
       * @return {Array.<WS.Data/Query/Order>}
       * @example
       * Получим способы сортировки выборки:
       * <pre>
       *    var query = new Query()
       *       .select('*')
       *       .from('Orders')
       *       .orderBy('id');
       *
       *    var order = query.getOrderBy()[0];
       *    order.getSelector();//'id'
       *    order.getOrder();//false
       * </pre>
       */
      getOrderBy: function () {
         return this._orderBy;
      },

      /**
       * Устанавливает порядок сортировки выборки
       * @param {String|Array.<Object.<String, WS.Data/Query/Order/Order.typedef>>} selector Название поле сортировки или набор полей и направление сортировки в каждом (false - по возрастанию, true - по убыванию)
       * @param {WS.Data/Query/Order/Order.typedef} [desc=false] По убыванию
       * @return {WS.Data/Query/Query}
       * @example
       * Отсортируем заказы по полю id по возрастанию:
       * <pre>
       *    var query = new Query()
       *       .select('*')
       *       .from('Orders')
       *       .orderBy('id');
       * </pre>
       * Отсортируем заказы по полю id по убыванию:
       * <pre>
       *    var query = new Query()
       *       .select('*')
       *       .from('Orders')
       *       .orderBy('id', true);
       * </pre>
       * Отсортируем заказы сначала по полю customerId по возрастанию, затем по полю date по убыванию:
       * <pre>
       *    var query = new Query()
       *       .select('*')
       *       .from('Orders')
       *       .orderBy([
       *          {customerId: false},
       *          {date: true}
       *       ]);
       * </pre>
       */
      orderBy: function (selector, desc) {
         if (desc === undefined) {
            desc = true;
         }

         this._orderBy = [];

         if (typeof selector === 'object') {
            var processObject = function(obj) {
               if (Object.isEmpty(obj)) {
                  return;
               }
               for (var key in obj) {
                  if (obj.hasOwnProperty(key)) {
                     this._orderBy.push(new Order({
                        selector: key,
                        order: obj[key]
                     }));
                  }
               }
            };

            if (selector instanceof Array) {
               for (var i = 0; i < selector.length; i++) {
                  processObject.call(this, selector[i]);
               }
            } else {
               processObject.call(this, selector);
            }
         } else if (selector) {
            this._orderBy.push(new Order({
               selector: selector,
               order: desc
            }));
         }

         return this;
      },

      /**
       * Возвращает способ группировки
       * @return {Array.<String>}
       * @example
       * Получим способ группировки выборки:
       * <pre>
       *    var query = new Query()
       *       .select('*')
       *       .from('Orders')
       *       .groupBy('customerId');
       *
       *    query.getGroupBy();//['customerId']
       * </pre>
       */
      getGroupBy: function () {
         return this._groupBy;
      },

      /**
       * Устанавливает способ группировки выборки
       * @param {String|Array.<String>} expression Способ группировки элементов
       * @return {WS.Data/Query/Query}
       * @example
       * <pre>
       *    var query = new Query()
       *       .select('*')
       *       .from('Orders')
       *       .groupBy('customerId');
       *
       *    var query = new Query()
       *       .select('*')
       *       .from('Orders')
       *       .groupBy(['date', 'customerId']);
       * </pre>
       */
      groupBy: function (expression) {
         if (typeof expression === 'string') {
            expression = [expression];
         }

         if (!(expression instanceof Array)) {
            throw new Error('Invalid argument');
         }

         this._groupBy = expression;

         return this;
      },

      /**
       * Возвращает смещение
       * @return {Number}
       * @example
       * Получим смещение выборки:
       * <pre>
       *    var query = new Query()
       *       .select('*')
       *       .from('Orders')
       *       .offset(50);
       *
       *    query.getOffset();//50
       * </pre>
       */
      getOffset: function () {
         return this._offset;
      },

      /**
       * Устанавливает смещение первого элемента выборки
       * @param {Number} start Смещение первого элемента выборки
       * @return {WS.Data/Query/Query}
       * @example
       * Выберем все заказы, начиная с пятидесятого:
       * <pre>
       *    var query = new Query()
       *       .select('*')
       *       .from('Orders')
       *       .offset(50);
       * </pre>
       */
      offset: function (start) {
         this._offset = parseInt(start) || 0;

         return this;
      },

      /**
       * Возвращает максимальное количество записей выборки
       * @return {Number}
       * @example
       * Получим максимальное количество записей выборки:
       * <pre>
       *    var query = new Query()
       *       .select('*')
       *       .from('Orders')
       *       .limit(10);
       *
       *    query.getLimit();//10
       * </pre>
       */
      getLimit: function () {
         return this._limit;
      },

      /**
       * Устанавливает ограничение кол-ва элементов выборки
       * @param {Number} count Максимальное кол-во элементов выборки
       * @return {WS.Data/Query/Query}
       * @example
       * Выберем первые десять заказов:
       * <pre>
       *    var query = new Query()
       *       .select('*')
       *       .from('Orders')
       *       .limit(10);
       * </pre>
       */
      limit: function (count) {
         this._limit = count;

         return this;
      },

      /**
       * Возвращает мета данные выборки
       * @return {Object}
       * @example
       * Получим мета данные выборки:
       * <pre>
       *    var query = new Query()
       *       .select('*')
       *       .from('Catalogue')
       *       .meta({
       *          selectBreadCrumbs: true
       *       });
       *
       *    query.getMeta();//{selectBreadCrumbs: true}
       * </pre>
       */
      getMeta: function () {
         return this._meta;
      },

      /**
       * Устанавливает мета данные выборки
       * @param {Object} data Мета данные
       * @return {WS.Data/Query/Query}
       * @example
       * Укажем, что в результатах запроса хочем дополнительно получить "хлебные крошки":
       * <pre>
       *    var query = new Query()
       *       .select('*')
       *       .from('Catalogue')
       *       .where({
       *          'parentId': 10
       *       })
       *       .meta({
       *          selectBreadCrumbs: true
       *       });
       * </pre>
       */
      meta: function (data) {
         data = data || {};
         if (typeof data !== 'object') {
            throw new Error('Invalid argument');
         }

         this._meta = data;

         return this;
      },

      //endregion Public methods

      //region Protected methods

      /**
       * Разбирает выражение, содeржащее набор полей
       * @param {Object|Array|String} expression Набор полей
       * @return {Object}
       * @protected
       */
      _parseSelectExpression: function (expression) {
         if (typeof expression === 'string') {
            expression = expression.split(/[ ,]/);
         }

         if (expression instanceof Array) {
            var orig = expression;
            expression = {};
            for (var i = 0; i < orig.length; i++) {
               expression[orig[i]] = orig[i];
            }
         }

         if (typeof expression !== 'object') {
            throw new Error('Invalid argument');
         }


         return expression;
      }

      //endregion Protected methods
   });
   
   return Query;
});

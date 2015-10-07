/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Query.Query', [
   'js!SBIS3.CONTROLS.Data.Query.Join',
   'js!SBIS3.CONTROLS.Data.Query.Order'
], function (Join, Order) {
   'use strict';

   /**
    * Запрос на выборку
    * @class SBIS3.CONTROLS.Data.Query.Query
    * @public
    * @author Мальцев Алексей
    */

   return $ws.core.extend({}, /** @lends SBIS3.CONTROLS.Data.Query.Query.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Query.Query',
      $protected: {
         /**
          * @var {Object} Выбираемые поля
          */
         _select: {},

         /**
          * @var {String} Объект выборки
          */
         _from: '',

         /**
          * @var {String} Псеводним объекта выборки
          */
         _as: '',

         /**
          * @var {SBIS3.CONTROLS.Data.Query.Join[]} Объединения с другими выборками
          */
         _join: [],

         /**
          * @var {Object} Способ фильтрации
          */
         _where: {},

         /**
          * @var {Object} Способ группировки
          */
         _groupBy: {},

         /**
          * @var {SBIS3.CONTROLS.Data.Query.Order[]} Способы сортировки
          */
         _orderBy: [],

         /**
          * @var {Number} Смещение
          */
         _offset: 0,

         /**
          * @var {Number} Максимальное кол-во записей
          */
         _limit: undefined,

         /**
          * @var {Object} Мета данные запроса
          */
         _meta: {}
      },

      //region Public methods

      /**
       * Сбрасывает все параметры запроса
       * @returns {SBIS3.CONTROLS.Data.Query.Query}
       */
      clear: function () {
         this._select = {};
         this._from = '';
         this._as = '';
         this._join = [];
         this._where = {};
         this._groupBy = {};
         this._orderBy = [];
         this._offset = 0;
         this._limit = undefined;

         return this;
      },

      /**
       * Возвращает поля выборки
       * @returns {Object}
       */
      getSelect: function () {
         return this._select;
      },

      /**
       * Устанавливает поля выборки
       * @param {Object|Array|String} expression Выбираемые поля
       * @returns {SBIS3.CONTROLS.Data.Query.Query}
       * @example
       * <pre>
       *    var query = new Query()
       *       .select({
       *          'id',
       *          'date',
       *          'customerId'
       *       })
       *       .from('Orders');
       *
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
       * @returns {String}
       */
      getFrom: function () {
         return this._from;
      },

      /**
       * Возвращает псеводним выборки
       * @returns {String}
       */
      getAs: function () {
         return this._as;
      },

      /**
       * Устанавливает объект выборки
       * @param {String} resource Объект выборки
       * @param {String} [as] Псеводним объекта выборки
       * @returns {SBIS3.CONTROLS.Data.Query.Query}
       * @example
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
       * @returns {SBIS3.CONTROLS.Data.Query.Join[]}
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
       * @returns {SBIS3.CONTROLS.Data.Query.Query}
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
       * @returns {Object}
       */
      getWhere: function () {
         return this._where;
      },

      /**
       * Устанавливает фильтр выборки
       * @param {Object} expression Условие фильтрации
       * @returns {SBIS3.CONTROLS.Data.Query.Query}
       * @example
       * <pre>
       *    var query = new Query()
       *       .select('*')
       *       .from('Orders')
       *       .where({
       *          'id>': 10,
       *          'date<=': new Date()
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
       * @returns {SBIS3.CONTROLS.Data.Query.Order[]}
       */
      getOrderBy: function () {
         return this._orderBy;
      },

      /**
       * Устанавливает порядок сортировки выборки
       * @param {String|Object[]|Object} selector Поле сортировки или набор полей
       * @param {Boolean} [order=true] Порядок сортировки
       * @returns {SBIS3.CONTROLS.Data.Query.Query}
       * @example
       * <pre>
       *    var query = new Query()
       *       .select('*')
       *       .from('Orders')
       *       .orderBy('id');
       *
       *    var query = new Query()
       *       .select('*')
       *       .from('Orders')
       *       .orderBy({
       *          'customerId': true,
       *          'date': false
       *       });
       * </pre>
       */
      orderBy: function (selector, order) {
         if (order === undefined) {
            order = true;
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
         } else {
            this._orderBy.push(new Order({
               selector: selector,
               order: order
            }));
         }

         return this;
      },

      /**
       * Возвращает способ группировки
       * @returns {Array}
       */
      getGroupBy: function () {
         return this._groupBy;
      },

      /**
       * Устанавливает способ группировки выборки
       * @param {String|Array} expression Способ группировки элементов
       * @returns {SBIS3.CONTROLS.Data.Query.Query}
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
       * @returns {Number}
       */
      getOffset: function () {
         return this._offset;
      },

      /**
       * Устанавливает смешение первого элемента выборки
       * @param {Number} start Смещение первого элемента выборки
       * @returns {SBIS3.CONTROLS.Data.Query.Query}
       * @example
       * <pre>
       *    var query = new Query()
       *       .select('*')
       *       .from('Orders')
       *       .offset(50);
       * </pre>
       */
      offset: function (start) {
         this._offset = Math.max(0, parseInt(start) || 0);

         return this;
      },

      /**
       * Возвращает максимальное кол-во записей
       * @returns {Number}
       */
      getLimit: function () {
         return this._limit;
      },

      /**
       * Устанавливает ограничение кол-ва элементов выборки
       * @param {Number} count Максимальное кол-во элементов выборки
       * @returns {SBIS3.CONTROLS.Data.Query.Query}
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
       * Возвращает мета данные
       * @returns {Object}
       */
      getMeta: function () {
         return this._meta;
      },

      /**
       * Устанавливает мета данные
       * @param {Object} data Мета данные
       * @returns {SBIS3.CONTROLS.Data.Query.Query}
       * @example
       * <pre>
       *    //Укажем, что в результатах запроса хочем дополнительно получить хлебные крошки
       *    var query = new Query()
       *       .select('*')
       *       .from('Catalogue')
       *       .where({
       *          'parentId': 10
       *       })
       *       .meta({
       *          'selectBreadCrumbs': true
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
       * @returns {Object}
       * @private
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
});

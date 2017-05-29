/* global define */
define('js!WS.Data/Source/DataSet', [
   'js!WS.Data/Entity/Abstract',
   'js!WS.Data/Entity/OptionsMixin',
   'js!WS.Data/Di',
   'js!WS.Data/Utils',
   'js!WS.Data/Entity/Model',
   'js!WS.Data/Collection/RecordSet',
   'Core/core-instance'
], function (
   Abstract,
   OptionsMixin,
   Di,
   Utils,
   EntityModel,
   CollectionRecordSet,
   CoreInstance
) {
   'use strict';

   /**
    * Набор данных, полученный из источника.
    * Представляет собой набор {@link WS.Data/Collection/RecordSet выборок}, {@link WS.Data/Entity/Model записей}, а также скалярных значений, которые можно получить по имени свойства (или пути из имен).
    * Использование таких комплексных наборов позволяет за один вызов {@link WS.Data/Source/ISource#query списочного} либо {@link WS.Data/Source/ISource#call произвольного} метода источника данных получать сразу все требующиеся для отображения какого-либо сложного интерфейса данные.
    * {@link rawData Исходные данные} могут быть предоставлены источником в разных форматах (JSON, XML). По умолчанию используется формат JSON.
    * Для чтения каждого формата должен быть указан соответствующий адаптер. По умолчанию используется адаптер {@link WS.Data/Adapter/Json}.
    * В общем случае не требуется создавать экземпляры DataSet самостоятельно - это за вас будет делать источник. Но для наглядности ниже приведены несколько примеров чтения частей из набора данных.
    *
    * Создадим комплексный набор в формате JSON из двух выборок "Заказы" и "Покупатели", одной записи "Итого" и даты выполнения запроса:
    * <pre>
    *    var data = new DataSet({
    *       rawData: {
    *          orders: [
    *             {id: 1, buyer_id: 1, date: '2016-06-02 14:12:45', amount: 96},
    *             {id: 2, buyer_id: 2, date: '2016-06-02 17:01:12', amount: 174},
    *             {id: 3, buyer_id: 1, date: '2016-06-03 10:24:28', amount: 475}
    *          ],
    *          buyers: [
    *             {id: 1, email: 'tony@stark-industries.com', phone: '555-111-222'},
    *             {id: 2, email: 'steve-rogers@avengers.us', phone: '555-222-333'}
    *          ],
    *          total: {
    *             date_from: '2016-06-01 00:00:00',
    *             date_to: '2016-07-01 00:00:00',
    *             amount: 745,
    *             deals: 3,
    *             completed: 2,
    *             paid: 2,
    *             awaited: 1,
    *             rejected: 0
    *          },
    *          executeDate: '2016-06-27 11:34:57'
    *       },
    *       itemsProperty: 'orders',
    *       idProperty: 'id'
    *    });
    *
    *    var orders = data.getAll();//Here use itemsProperty option value
    *    orders.getCount();//3
    *    orders.at(0).get('amount');//96
    *
    *    var buyers = data.getAll('buyers');//Here use argument 'property'
    *    buyers.getCount();//2
    *    buyers.at(0).get('email');//'tony@stark-industries.com'
    *
    *    var total = data.getRow('total');
    *    total.get('amount');//745
    *
    *    var executeDate = data.getScalar('executeDate');//'2016-06-27 11:34:57'
    * </pre>
    * Создадим комплексный набор в формате XML из двух выборок "Заказы" и "Покупатели", записи "Итого" и даты выполнения запроса:
    * <pre>
    *    var data = new DataSet({
    *       adapter: 'adapter.xml',
    *       rawData: '<?xml version="1.0"?>' +
    *          '<response>' +
    *          '   <orders>' +
    *          '      <order>' +
    *          '         <id>1</id><buyer_id>1</buyer_id><date>2016-06-02 14:12:45</date><amount>96</amount>' +
    *          '      </order>' +
    *          '      <order>' +
    *          '         <id>2</id><buyer_id>2</buyer_id><date>2016-06-02 17:01:12</date><amount>174</amount>' +
    *          '      </order>' +
    *          '      <order>' +
    *          '         <id>3</id><buyer_id>1</buyer_id><date>2016-06-03 10:24:28</date><amount>475</amount>' +
    *          '      </order>' +
    *          '   </orders>' +
    *          '   <buyers>' +
    *          '      <buyer>' +
    *          '         <id>1</id><email>tony@stark-industries.com</email><phone>555-111-222</phone>' +
    *          '      </buyer>' +
    *          '      <buyer>' +
    *          '         <id>2</id><email>steve-rogers@avengers.us</email><phone>555-222-333</phone>' +
    *          '      </buyer>' +
    *          '   </buyers>' +
    *          '   <total>' +
    *          '      <date_from>2016-06-01 00:00:00</date_from>' +
    *          '      <date_to>2016-07-01 00:00:00</date_to>' +
    *          '      <amount>475</amount>' +
    *          '      <deals>3</deals>' +
    *          '      <completed>2</completed>' +
    *          '      <paid>2</paid>' +
    *          '      <awaited>1</awaited>' +
    *          '      <rejected>0</rejected>' +
    *          '   </total>' +
    *          '   <executeDate>2016-06-27 11:34:57</executeDate>' +
    *          '</response>',
    *       itemsProperty: 'orders/order',//XPath syntax
    *       idProperty: 'id'
    *    });
    *
    *    var orders = data.getAll();//Here use itemsProperty option value
    *    orders.getCount();//3
    *    orders.at(0).get('amount');//96
    *
    *    var buyers = data.getAll('buyers/buyer');//XPath syntax
    *    buyers.getCount();//2
    *    buyers.at(0).get('email');//'tony@stark-industries.com'
    *
    *    var total = data.getRow('total');
    *    total.get('amount');//745
    *
    *    var executeDate = data.getScalar('executeDate');//'2016-06-27 11:34:57'
    * </pre>
    * @class WS.Data/Source/DataSet
    * @extends WS.Data/Entity/Abstract
    * @mixes WS.Data/Entity/OptionsMixin
    * @ignoreOptions source totalProperty
    * @ignoreMethods getSource getTotal getTotalProperty setTotalProperty
    * @public
    * @author Мальцев Алексей
    */

   var DataSet = Abstract.extend([OptionsMixin], /** @lends WS.Data/Source/DataSet.prototype */{
      _moduleName: 'WS.Data/Source/DataSet',

      /**
       * @cfg {String|WS.Data/Source/ISource} Источник, из которого получены данные
       * @name WS.Data/Source/DataSet#source
       * @see getSource
       * @see WS.Data/Source/ISource
       */
      _$source: null,

      /**
       * @cfg {String|WS.Data/Adapter/IAdapter} Адаптер для работы данными, по умолчанию {@link WS.Data/Adapter/Json}
       * @name WS.Data/Source/DataSet#adapter
       * @see getAdapter
       * @see WS.Data/Adapter/IAdapter
       * @see WS.Data/Di
       * @example
       * Адаптер для данных в формате БЛ СБИС, внедренный в виде названия зарегистрированной зависимости:
       * <pre>
       *    define(['js!WS.Data/Adapter/Sbis'], function () {
       *       var ds = new DataSet({
       *          adapter: 'adapter.sbis',
       *          rawData: {
       *             _type: 'recordset',
       *             d: [],
       *             s: []
       *          }
       *       });
       *    });
       * </pre>
       * Адаптер для данных в формате БЛ СБИС, внедренный в виде готового экземпляра:
       * <pre>
       *    define(['js!WS.Data/Adapter/Sbis'], function (SbisAdapter) {
       *       var ds = new DataSet({
       *          adapter: new SbisAdapter(),
       *          rawData: {
       *             _type: 'recordset',
       *             d: [],
       *             s: []
       *          }
       *       });
       *    });
       * </pre>
       */
      _$adapter: 'adapter.json',

      /**
       * @cfg {String} Данные в "сыром" виде
       * @name WS.Data/Source/DataSet#rawData
       * @remark
       * Данные должны быть в формате, поддерживаемом адаптером {@link adapter}.
       * @see getRawData
       * @see setRawData
       * @example
       * Создадим набор данных с персонажами фильма:
       * <pre>
       *    var data = new DataSet({
       *          rawData: [{
       *             id: 1,
       *             firstName: 'John',
       *             lastName: 'Connor',
       *             role: 'Savior'
       *          }, {
       *             id: 2,
       *             firstName: 'Sarah',
       *             lastName: 'Connor'
       *             role: 'Mother'
       *          }, {
       *             id: 3,
       *             firstName: '-',
       *             lastName: 'T-800'
       *             role: 'Terminator'
       *          }]
       *       }),
       *       characters = data.getAll();
       *
       *    characters.at(0).get('firstName');//John
       *    characters.at(0).get('lastName');//Connor
       * </pre>
       */
      _$rawData: null,

      /**
       * @cfg {String|Function} Конструктор записей, порождаемых набором данных. По умолчанию {@link WS.Data/Entity/Model}.
       * @name WS.Data/Source/DataSet#model
       * @see getModel
       * @see setModel
       * @see WS.Data/Entity/Model
       * @see WS.Data/Di
       * @example
       * Конструктор пользовательской модели, внедренный в виде названия зарегистрированной зависимости:
       * <pre>
       *    var User = Model.extend({});
       *    Di.register('app.model.user', User);
       *    //...
       *    var data = new DataSet({
       *       model: 'app.model.user'
       *    });
       * </pre>
       * Конструктор пользовательской модели, внедренный в виде класса:
       * <pre>
       *    var User = Model.extend({});
       *    //...
       *    var data = new DataSet({
       *       model: User
       *    });
       * </pre>
       */
      _$model: 'entity.model',

      /**
       * @cfg {String|Function} Конструктор рекордсетов, порождаемых набором данных. По умолчанию {@link WS.Data/Collection/RecordSet}.
       * @name WS.Data/Source/DataSet#listModule
       * @see getListModule
       * @see setListModule
       * @see WS.Data/Collection/RecordSet
       * @see WS.Data/Di
       * @example
       * Конструктор рекордсета, внедренный в виде названия зарегистрированной зависимости:
       * <pre>
       *    var Users = RecordSet.extend({});
       *    Di.register('app.collections.users', Users);
       *    //...
       *    var data = new DataSet({
       *       listModule: 'app.collections.users'
       *    });
       * </pre>
       * Конструктор рекордсета, внедренный в виде класса:
       * <pre>
       *    var Users = RecordSet.extend({});
       *    //...
       *    var data = new DataSet({
       *       listModule: Users
       *    });
       * </pre>
       */
      _$listModule: 'collection.recordset',

      /**
       * @cfg {String} Название свойства записи, содержащего первичный ключ.
       * @name WS.Data/Source/DataSet#idProperty
       * @see getIdProperty
       * @see setIdProperty
       * @see WS.Data/Entity/Model#idProperty
       * @example
       * Установим свойство 'primaryId' в качестве первичного ключа:
       * <pre>
       *    var data = new DataSet({
       *       idProperty: 'primaryId'
       *    });
       * </pre>
       */
      _$idProperty: '',

      /**
       * @cfg {String} Название свойства сырых данных, в котором находится основная выборка
       * @name WS.Data/Source/DataSet#itemsProperty
       * @see getItemsProperty
       * @see setItemsProperty
       * @example
       * Установим свойство 'orders' содержажим основную выборку:
       * <pre>
       *    var data = new DataSet({
       *       rawData: {
       *          orders: [
       *             {id: 1, date: '2016-06-02 14:12:45', amount: 96},
       *             {id: 2, date: '2016-06-02 17:01:12', amount: 174},
       *             {id: 3, date: '2016-06-03 10:24:28', amount: 475}
       *          ],
       *          total: {
       *             date_from: '2016-06-01 00:00:00',
       *             date_to: '2016-07-01 00:00:00',
       *             amount: 745
       *          }
       *       },
       *       itemsProperty: 'orders'
       *    });
       *
       *    var orders = data.getAll();//Here use itemsProperty option value
       *    orders.getCount();//3
       *    orders.at(0).get('id');//1
       * </pre>
       */
      _$itemsProperty: '',

      /**
       * @cfg {String} Свойство данных, в которых находится общее число элементов выборки
       * @name WS.Data/Source/DataSet#totalProperty
       * @see getTotalProperty
       * @see setTotalProperty
       * @deprecated
       */
      _$totalProperty: '',

      constructor: function $DataSet(options) {
         DataSet.superclass.constructor.call(this, options);
         OptionsMixin.constructor.call(this, options);
      },

      //region Public methods

      /**
       * Возвращает источник, из которого получены данные
       * @return {String|WS.Data/Source/ISource}
       * @see source
       * @see WS.Data/Source/ISource
       */
      getSource: function () {
         if (typeof this._$source === 'string') {
            this._$source = Di.create(this._$source);
         }
         return this._$source;
      },

      /**
       * Возвращает адаптер для работы с данными
       * @return {WS.Data/Adapter/IAdapter}
       * @see adapter
       * @see WS.Data/Adapter/IAdapter
       * @example
       * Получим адаптер набора данных, используемый по умолчанию:
       * <pre>
       *    var data = new DataSet();
       *    CoreInstance.instanceOfModule(data.getAdapter(), 'WS.Data/Adapter/Json');//true
       * </pre>
       */
      getAdapter: function () {
         if (typeof this._$adapter === 'string') {
            this._$adapter = Di.create(this._$adapter);
         }
         return this._$adapter;
      },

      /**
       * Возвращает конструктор записей, порождаемых набором данных.
       * @return {String|Function}
       * @see model
       * @see setModel
       * @see WS.Data/Entity/Model
       * @see WS.Data/Di
       * @example
       * Получим конструктор записей, используемый по умолчанию:
       * <pre>
       *    var data = new DataSet();
       *    data.getModel();//'entity.model'
       * </pre>
       */
      getModel: function () {
         return this._$model;
      },

      /**
       * Устанавливает конструктор записей, порождаемых набором данных.
       * @param {String|Function} model
       * @see model
       * @see getModel
       * @see WS.Data/Entity/Model
       * @see WS.Data/Di
       * @example
       * Установим конструктор пользовательской модели, внедренный в виде названия зарегистрированной зависимости:
       * <pre>
       *    var User = Model.extend({});
       *    Di.register('app.model.user', User);
       *    //...
       *    var data = new DataSet();
       *    data.setModel('app.model.user');
       * </pre>
       * Установим конструктор пользовательской модели, внедренный в виде класса:
       * <pre>
       *    var User = Model.extend({});
       *    //...
       *    var data = new DataSet();
       *    data.setModel(User);
       * </pre>
       */
      setModel: function (model) {
         this._$model = model;
      },

      /**
       * Возвращает конструктор списка моделей
       * @return {String|Function}
       * @see setListModule
       * @see listModule
       * @see WS.Data/Di
       * @example
       * Получим конструктор рекордсетов, используемый по умолчанию:
       * <pre>
       *    var data = new DataSet();
       *    data.getListModule();//'collection.recordset'
       * </pre>
       */
      getListModule: function () {
         return this._$listModule;
      },

      /**
       * Устанавливает конструктор списка моделей
       * @param {String|Function} listModule
       * @see getListModule
       * @see listModule
       * @see WS.Data/Di
       * @example
       * Установим конструктор рекордсетов, внедренный в виде названия зарегистрированной зависимости:
       * <pre>
       *    var Users = RecordSet.extend({});
       *    Di.register('app.collections.users', Users);
       *    //...
       *    var data = new DataSet();
       *    data.setListModule('app.collections.users');
       * </pre>
       * Установим конструктор рекордсетов, внедренный в виде класса:
       * <pre>
       *    var Users = RecordSet.extend({});
       *    //...
       *    var data = new DataSet();
       *    data.setListModule(Users);
       * </pre>
       */
      setListModule: function (listModule) {
         this._$listModule = listModule;
      },

      /**
       * Возвращает название свойства модели, содержащего первичный ключ
       * @return {String}
       * @see setIdProperty
       * @see idProperty
       * @see WS.Data/Entity/Model#idProperty
       * @example
       * Получим название свойства модели, содержащего первичный ключ:
       * <pre>
       *    var data = new DataSet({
       *       idProperty: 'id'
       *    });
       *    data.getIdProperty();//'id'
       * </pre>
       */
      getIdProperty: function () {
         return this._$idProperty;
      },

      /**
       * Устанавливает название свойства модели, содержащего первичный ключ
       * @param {String} name
       * @see getIdProperty
       * @see idProperty
       * @see WS.Data/Entity/Model#idProperty
       * @example
       * Установим название свойства модели, содержащего первичный ключ:
       * <pre>
       *    var data = new DataSet();
       *    data.setIdProperty('id');
       * </pre>
       */
      setIdProperty: function (name) {
         this._$idProperty = name;
      },

      /**
       * Возвращает название свойства сырых данных, в котором находится основная выборка
       * @return {String}
       * @see setItemsProperty
       * @see itemsProperty
       * @example
       * Получим название свойства, в котором находится основная выборка:
       * <pre>
       *    var data = new DataSet({
       *       itemsProperty: 'items'
       *    });
       *    data.getItemsProperty();//'items'
       * </pre>
       */
      getItemsProperty: function () {
         return this._$itemsProperty;
      },

      /**
       * Устанавливает название свойства сырых данных, в котором находится основная выборка
       * @param {String} name
       * @see getItemsProperty
       * @see itemsProperty
       * @example
       * Установим название свойства, в котором находится основная выборка:
       * <pre>
       *    var data = new DataSet();
       *    data.setItemsProperty('items');
       * </pre>
       */
      setItemsProperty: function (name) {
         this._$itemsProperty = name;
      },

      /**
       * Возвращает свойство данных, в которых находится выборка
       * @return {String}
       * @see setTotalProperty
       * @see totalProperty
       * @deprecated
       */
      getTotalProperty: function () {
         return this._$totalProperty;
      },

      /**
       * Устанавливает свойство данных, в которых находится выборка
       * @param {String} name
       * @see getTotalProperty
       * @see totalProperty
       * @deprecated
       */
      setTotalProperty: function (name) {
         this._$totalProperty = name;
      },

      /**
       * Возвращает выборку
       * @param {String} [property] Свойство данных, в которых находятся элементы выборки. Если не указывать, вернется основная выборка.
       * @return {WS.Data/Collection/RecordSet}
       * @see itemsProperty
       * @example
       * Получим основную выборку из набора данных, который содержит только ее:
       * <pre>
       *    var data = new DataSet({
       *          rawData: [{
       *             id: 1,
       *             title: 'Article 1'
       *          }, {
       *             id: 2,
       *             title: 'Article 2'
       *          }]
       *       }),
       *       articles = data.getAll();
       *
       *    articles.at(0).get('title');//'Article 1'
       * </pre>
       * @example
       * Получим основную и дополнительную выборки из набора данных, который содержит несколько выборок:
       * <pre>
       *    var data = new DataSet({
       *          rawData: {
       *             articles: [{
       *                id: 1,
       *                title: 'Article 1'
       *             }, {
       *                id: 2,
       *                title: 'Article 2'
       *             }],
       *             topics: [{
       *                id: 1,
       *                title: 'Topic 1'
       *             }, {
       *                id: 2,
       *                title: 'Topic 2'
       *             }]
       *          },
       *          itemsProperty: 'articles'
       *       }),
       *       articles = data.getAll(),
       *       topics = data.getAll('topics');
       *
       *    articles.at(0).get('title');//'Article 1'
       *    topics.at(0).get('title');//'Topic 1'
       * </pre>
       */
      getAll: function (property) {
         this._checkAdapter();
         if (property === undefined) {
            property = this._$itemsProperty;
         }

         var data =  this._getDataProperty(property),
            items = Di.create(this._$listModule, {
               rawData: data,
               adapter: this._$adapter,
               model: this._$model,
               idProperty: this._$idProperty
            });

         if (CoreInstance.instanceOfModule(items, 'WS.Data/Collection/RecordSet')) {
            if (this.hasProperty(this._$totalProperty)) {
               var meta = items.getMetaData();
               meta.total = meta.more = this.getProperty(this._$totalProperty);
               items.setMetaData(meta);
            }
         }

         return items;
      },

      /**
       * Возвращает общее число элементов выборки
       * @param {String} [property] Свойство данных, в которых находится общее число элементов выборки
       * @return {*}
       * @see totalProperty
       * @deprecated
       */
      getTotal: function (property) {
         if (property === undefined) {
            property = this._$totalProperty;
         }
         return this._getDataProperty(property);
      },

      /**
       * Возвращает запись
       * @param {String} [property] Свойство данных, в которых находится модель
       * @return {WS.Data/Entity/Model|undefined}
       * @see itemsProperty
       * @example
       * Получим запись из набора данных, который содержит только ее:
       * <pre>
       *    var data = new DataSet({
       *          rawData: {
       *             id: 1,
       *             title: 'Article 1'
       *          }
       *       }),
       *       article = data.getRow();
       *
       *    article.get('title');//'Article 1'
       * </pre>
       * @example
       * Получим записи статьи и темы из набора данных, который содержит несколько записей:
       * <pre>
       *    var data = new DataSet({
       *          rawData: {
       *             article: {
       *                id: 1,
       *                title: 'Article 1'
       *             },
       *             topic: {
       *                id: 2,
       *                title: 'Topic 2'
       *             }
       *          }
       *       }),
       *       article = data.getRow('article'),
       *       topic = data.getRow('topic');
       *
       *    article.get('title');//'Article 1'
       *    topic.get('title');//'Topic 1'
       * </pre>
       */
      getRow: function (property) {
         this._checkAdapter();
         if (property === undefined) {
            property = this._$itemsProperty;
         }
         var data = this._getDataProperty(property),
            type = this.getAdapter().getProperty(data, '_type');
         if (type === 'recordset') {
            var tableAdapter = this.getAdapter().forTable(data);
            if (tableAdapter.getCount() > 0) {
               return this._getModelInstance(
                  tableAdapter.at(0)
               );
            }
         } else {
            return this._getModelInstance(
               data
            );
         }

         return undefined;
      },

      /**
       * Возвращает значение
       * @param {String} [property] Свойство данных, в которых находится значение
       * @return {*}
       * @see itemsProperty
       * @example
       * Получим количество открытых задач:
       * <pre>
       *    var data = new DataSet({
       *       rawData: 234
       *    });
       *
       *    data.getScalar();//234
       * </pre>
       * @example
       * Получим количество открытых и закрытых задач:
       * <pre>
       *    var data = new DataSet({
       *       rawData: {
       *          total: 500,
       *          open: 234,
       *          closed: 123,
       *          deleted: 2345
       *        }
       *    });
       *
       *    data.getScalar('open');//234
       *    data.getScalar('closed');//123
       * </pre>
       */
      getScalar: function (property) {
         if (property === undefined) {
            property = this._$itemsProperty;
         }
         return this._getDataProperty(property);
      },

      /**
       * Проверяет наличие свойства в данных
       * @param {String} property Свойство
       * @return {Boolean}
       * @see getProperty
       * @example
       * Проверим наличие свойств 'articles' и 'topics':
       * <pre>
       *    var data = new DataSet({
       *       rawData: {
       *          articles: [{
       *             id: 1,
       *             title: 'Article 1'
       *          }]
       *       }
       *    });
       *
       *    data.hasProperty('articles');//true
       *    data.hasProperty('topics');//false
       * </pre>
       */
      hasProperty: function (property) {
         return property ? this._getDataProperty(property) !== undefined : false;
      },

      /**
       * Возвращает значение свойства в данных
       * @param {String} property Свойство
       * @return {*}
       * @see hasProperty
       * @example
       * Получим значение свойства 'article':
       * <pre>
       *    var data = new DataSet({
       *       rawData: {
       *          article: {
       *             id: 1,
       *             title: 'Article 1'
       *          }
       *       }
       *    });
       *
       *    data.getProperty('article');//{id: 1, title: 'Article 1'}
       * </pre>
       */
      getProperty: function (property) {
         return this._getDataProperty(property);
      },

      /**
       * Возвращает сырые данные
       * @return {Object}
       * @see setRawData
       * @see rawData
       * @example
       * Получим данные в сыром виде:
       * <pre>
       *    var data = new DataSet({
       *       rawData: {
       *          article: {
       *             id: 1,
       *             title: 'Article 1'
       *          }
       *       }
       *    });
       *
       *    data.getRawData();//{article: {id: 1, title: 'Article 1'}}
       * </pre>
       */
      getRawData: function() {
         return this._$rawData;
      },

      /**
       * Устанавливает сырые данные
       * @param rawData {Object} Сырые данные
       * @see getRawData
       * @see rawData
       * @example
       * Установим данные в сыром виде:
       * <pre>
       *    var data = new DataSet();
       *
       *    data.setRawData({
       *       article: {
       *          id: 1,
       *          title: 'Article 1'
       *       }
       *    });
       * </pre>
       */
      setRawData: function(rawData) {
         this._$rawData = rawData;
      },

      //endregion Public methods

      //region Protected methods

      /**
       * Возвращает свойство данных
       * @param {String} property Свойство
       * @return {*}
       * @protected
       */
      _getDataProperty: function (property) {
         this._checkAdapter();
         return property ?
            this.getAdapter().getProperty(this._$rawData, property) :
            this._$rawData;
      },

      /**
       * Возвращает инстанс модели
       * @param {*} rawData Данные модели
       * @return {Function}
       * @protected
       */
      _getModelInstance: function (rawData) {
         if (!this._$model) {
            throw new Error('Model is not defined');
         }
         return Di.create(this._$model, {
            rawData: rawData,
            adapter: this._$adapter
         });
      },

      /**
       * Проверят наличие адаптера
       * @protected
       */
      _checkAdapter: function () {
         if (!this.getAdapter()) {
            throw new Error('Adapter is not defined');
         }
      }

      //endregion Protected methods

   });

   Di.register('source.dataset', DataSet);

   return DataSet;
});

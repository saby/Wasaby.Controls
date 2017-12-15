/* global define */
define('WS.Data/Source/DataSet', [
   'WS.Data/Entity/Abstract',
   'WS.Data/Entity/OptionsMixin',
   'WS.Data/Entity/SerializableMixin',
   'WS.Data/Di',
   'WS.Data/Entity/Model',
   'WS.Data/Collection/RecordSet'
], function (
   Abstract,
   OptionsMixin,
   SerializableMixin,
   Di
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
    *    require(['WS.Data/Source/DataSet'], function (DataSet) {
    *       var data = new DataSet({
    *          rawData: {
    *             orders: [
    *                {id: 1, buyer_id: 1, date: '2016-06-02 14:12:45', amount: 96},
    *                {id: 2, buyer_id: 2, date: '2016-06-02 17:01:12', amount: 174},
    *                {id: 3, buyer_id: 1, date: '2016-06-03 10:24:28', amount: 475}
    *             ],
    *             buyers: [
    *                {id: 1, email: 'tony@stark-industries.com', phone: '555-111-222'},
    *                {id: 2, email: 'steve-rogers@avengers.us', phone: '555-222-333'}
    *             ],
    *             total: {
    *                date_from: '2016-06-01 00:00:00',
    *                date_to: '2016-07-01 00:00:00',
    *                amount: 745,
    *                deals: 3,
    *                completed: 2,
    *                paid: 2,
    *                awaited: 1,
    *                rejected: 0
    *             },
    *             executeDate: '2016-06-27 11:34:57'
    *          },
    *          itemsProperty: 'orders',
    *          idProperty: 'id'
    *       });
    *
    *       var orders = data.getAll();//Here use itemsProperty option value
    *       console.log(orders.getCount());//3
    *       console.log(orders.at(0).get('amount'));//96
    *
    *       var buyers = data.getAll('buyers');//Here use argument 'property'
    *       console.log(buyers.getCount());//2
    *       console.log(buyers.at(0).get('email'));//'tony@stark-industries.com'
    *
    *       var total = data.getRow('total');
    *       console.log(total.get('amount'));//745
    *
    *       console.log(data.getScalar('executeDate'));//'2016-06-27 11:34:57'
    *    });
    * </pre>
    * Создадим комплексный набор в формате XML из двух выборок "Заказы" и "Покупатели", записи "Итого" и даты выполнения запроса:
    * <pre>
    *    require(['WS.Data/Source/DataSet', '/Adapter/Xml'], function (DataSet) {
    *       var data = new DataSet({
    *          adapter: 'adapter.xml',
    *          rawData: '<?xml version="1.0"?>' +
    *             '<response>' +
    *             '   <orders>' +
    *             '      <order>' +
    *             '         <id>1</id><buyer_id>1</buyer_id><date>2016-06-02 14:12:45</date><amount>96</amount>' +
    *             '      </order>' +
    *             '      <order>' +
    *             '         <id>2</id><buyer_id>2</buyer_id><date>2016-06-02 17:01:12</date><amount>174</amount>' +
    *             '      </order>' +
    *             '      <order>' +
    *             '         <id>3</id><buyer_id>1</buyer_id><date>2016-06-03 10:24:28</date><amount>475</amount>' +
    *             '      </order>' +
    *             '   </orders>' +
    *             '   <buyers>' +
    *             '      <buyer>' +
    *             '         <id>1</id><email>tony@stark-industries.com</email><phone>555-111-222</phone>' +
    *             '      </buyer>' +
    *             '      <buyer>' +
    *             '         <id>2</id><email>steve-rogers@avengers.us</email><phone>555-222-333</phone>' +
    *             '      </buyer>' +
    *             '   </buyers>' +
    *             '   <total>' +
    *             '      <date_from>2016-06-01 00:00:00</date_from>' +
    *             '      <date_to>2016-07-01 00:00:00</date_to>' +
    *             '      <amount>475</amount>' +
    *             '      <deals>3</deals>' +
    *             '      <completed>2</completed>' +
    *             '      <paid>2</paid>' +
    *             '      <awaited>1</awaited>' +
    *             '      <rejected>0</rejected>' +
    *             '   </total>' +
    *             '   <executeDate>2016-06-27 11:34:57</executeDate>' +
    *             '</response>',
    *          itemsProperty: 'orders/order',//XPath syntax
    *          idProperty: 'id'
    *       });
    *
    *       var orders = data.getAll();
    *       console.log(orders.getCount());//3
    *       console.log(orders.at(0).get('amount'));//96
    *
    *       var buyers = data.getAll('buyers/buyer');//XPath syntax
    *       console.log(buyers.getCount());//2
    *       console.log(buyers.at(0).get('email'));//'tony@stark-industries.com'
    *
    *       var total = data.getRow('total');
    *       console.log(total.get('amount'));//745
    *
    *       console.log(data.getScalar('executeDate'));//'2016-06-27 11:34:57'
    *    });
    * </pre>
    * @class WS.Data/Source/DataSet
    * @extends WS.Data/Entity/Abstract
    * @mixes WS.Data/Entity/OptionsMixin
    * @mixes WS.Data/Entity/SerializableMixin
    * @ignoreOptions totalProperty writable
    * @ignoreMethods getTotal getTotalProperty setTotalProperty
    * @public
    * @author Мальцев Алексей
    */

   var DataSet = Abstract.extend([OptionsMixin, SerializableMixin], /** @lends WS.Data/Source/DataSet.prototype */{
      _moduleName: 'WS.Data/Source/DataSet',

      /**
       * @cfg {String|WS.Data/Adapter/IAdapter} Адаптер для работы данными, по умолчанию {@link WS.Data/Adapter/Json}
       * @name WS.Data/Source/DataSet#adapter
       * @see getAdapter
       * @see WS.Data/Adapter/IAdapter
       * @see WS.Data/Di
       * @example
       * <pre>
       *    require([
       *       'WS.Data/Source/Provider/SbisBusinessLogic',
       *       'WS.Data/Source/DataSet',
       *       'WS.Data/Adapter/Sbis'
       *    ], function (Provider, DataSet, SbisAdapter) {
       *       new Provider({
       *          address: '/service/',
       *          contract: 'Employee'
       *       })
       *       .call('getReport', {type: 'Salary'})
       *       .addCallback(function(data) {
       *          var dataSet = new DataSet({
       *             adapter: new SbisAdapter(),
       *             data: data
       *          });
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
       *    require(['WS.Data/Source/DataSet'], function (DataSet) {
       *       var data = new DataSet({
       *             rawData: [{
       *                id: 1,
       *                firstName: 'John',
       *                lastName: 'Connor',
       *                role: 'Savior'
       *             }, {
       *                id: 2,
       *                firstName: 'Sarah',
       *                lastName: 'Connor',
       *                role: 'Savior\'s Mother'
       *             }, {
       *                id: 3,
       *                firstName: '-',
       *                lastName: 'T-800',
       *                role: 'Terminator'
       *             }]
       *          }),
       *          characters = data.getAll();
       *
       *       console.log(characters.at(0).get('firstName'));//John
       *       console.log(characters.at(0).get('lastName'));//Connor
       *    });
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
       * Установим модель "Пользователь":
       * <pre>
       *    require(['WS.Data/Source/DataSet', 'Application/Models/User'], function (DataSet, UserModel) {
       *       var data = new DataSet({
       *          model: UserModel
       *       });
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
       * Установим рекодсет "Пользователи":
       * <pre>
       *    require(['WS.Data/Source/DataSet', 'Application/Collections/Users'], function (DataSet, UsersCollection) {
       *       var data = new DataSet({
       *          listModule: UsersCollection
       *       });
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
       *    require(['WS.Data/Source/DataSet'], function (DataSet) {
       *       var data = new DataSet({
       *          idProperty: 'primaryId'
       *       });
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
       * Установим свойство 'orders' как содержащее основную выборку:
       * <pre>
       *    require(['WS.Data/Source/DataSet'], function (DataSet) {
       *       var data = new DataSet({
       *          rawData: {
       *             orders: [
       *                {id: 1, date: '2016-06-02 14:12:45', amount: 96},
       *                {id: 2, date: '2016-06-02 17:01:12', amount: 174},
       *                {id: 3, date: '2016-06-03 10:24:28', amount: 475}
       *             ],
       *             total: {
       *                date_from: '2016-06-01 00:00:00',
       *                date_to: '2016-07-01 00:00:00',
       *                amount: 745
       *             }
       *          },
       *          itemsProperty: 'orders'
       *       });
       *
       *       var orders = data.getAll();
       *       console.log(orders.getCount());//3
       *       console.log(orders.at(0).get('id'));//1
       *    });
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

      /**
       * @cfg {Boolean} Можно модифицировать. Признак передается объектам, которые инстанциирует DataSet.
       * @name WS.Data/Source/DataSet#writable
       */
      _$writable: true,

      get writable() {
         return this._$writable;
      },

      set writable(value) {
         this._$writable = !!value;
      },

      constructor: function DataSet(options) {
         DataSet.superclass.constructor.call(this, options);
         OptionsMixin.constructor.call(this, options);
      },

      //region Public methods

      getSource: function () {
         throw new Error('Method' + this._moduleName + '::getSource() is deprecated.');
      },

      /**
       * Возвращает адаптер для работы с данными
       * @return {WS.Data/Adapter/IAdapter}
       * @see adapter
       * @see WS.Data/Adapter/IAdapter
       * @example
       * Получим адаптер набора данных, используемый по умолчанию:
       * <pre>
       *    require(['WS.Data/Source/DataSet', 'Core/core-instance'], function (DataSet, coreInstance) {
       *       var data = new DataSet();
       *       console.log(coreInstance.instanceOfModule(data.getAdapter(), 'WS.Data/Adapter/Json'));//true
       *    });
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
       *    require(['WS.Data/Source/DataSet'], function (DataSet) {
       *       var data = new DataSet();
       *       console.log(data.getModel());//'entity.model'
       *    });
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
       * Установим конструктор пользовательской модели:
       * <pre>
       *    require(['WS.Data/Source/DataSet', 'Application/Models/User'], function (DataSet, UserModel) {
       *       var data = new DataSet();
       *       data.setModel(UserModel);
       *    });
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
       *    require(['WS.Data/Source/DataSet'], function (DataSet) {
       *       var data = new DataSet();
       *       console.log(data.getListModule());//'collection.recordset'
       *    });
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
       * Установим конструктор рекордсетов:
       * <pre>
       *    require(['WS.Data/Source/DataSet', 'Application/Collection/Users'], function (DataSet, UsersCollection) {
       *       var data = new DataSet();
       *       data.setListModule(UsersCollection);
       *    });
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
       *    require(['WS.Data/Source/DataSet'], function (DataSet) {
       *       var data = new DataSet({
       *          idProperty: 'id'
       *       });
       *       console.log(data.getIdProperty());//'id'
       *    });
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
       *    require(['WS.Data/Source/DataSet'], function (DataSet) {
       *       var data = new DataSet();
       *       data.setIdProperty('id');
       *    });
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
       *    require(['WS.Data/Source/DataSet'], function (DataSet) {
       *       var data = new DataSet({
       *          itemsProperty: 'items'
       *       });
       *       console.log(data.getItemsProperty());//'items'
       *    });
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
       *    require(['WS.Data/Source/DataSet'], function (DataSet) {
       *       var data = new DataSet();
       *       data.setItemsProperty('items');
       *    });
       * </pre>
       */
      setItemsProperty: function (name) {
         this._$itemsProperty = name;
      },

      /**
       * Возвращает свойство данных, в котором находися общее число элементов выборки
       * @return {String}
       * @see setTotalProperty
       * @see totalProperty
       * @deprecated
       */
      getTotalProperty: function () {
         return this._$totalProperty;
      },

      /**
       * Устанавливает свойство данных, в котором находися общее число элементов выборки
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
       * Получим основную выборку из набора данных, представляющего выборку:
       * <pre>
       *    require(['WS.Data/Source/DataSet'], function (DataSet) {
       *       var data = new DataSet({
       *             rawData: [
       *                {id: 1, title: 'How to build a Home'},
       *                {id: 2, title: 'How to plant a Tree'},
       *                {id: 3, title: 'How to grow up a Son'}
       *             ]
       *          }),
       *          mansGuide = data.getAll();
       *
       *       console.log(mansGuide.at(0).get('title'));//'How to build a Home'
       *    });
       * </pre>
       * @example
       * Получим основную и дополнительную выборки из набора данных, представляющего несколько выборок:
       * <pre>
       *    require(['WS.Data/Source/DataSet'], function (DataSet) {
       *       var data = new DataSet({
       *             rawData: {
       *                articles: [{
       *                   id: 1,
       *                   topicId: 1,
       *                   title: 'Captain America'
       *                }, {
       *                   id: 2,
       *                   topicId: 1,
       *                   title: 'Iron Man'
       *                }, {
       *                   id: 3,
       *                   topicId: 2,
       *                   title: 'Batman'
       *                }],
       *                topics: [{
       *                   id: 1,
       *                   title: 'Marvel Comics'
       *                }, {
       *                   id: 2,
       *                   title: 'DC Comics'
       *                }]
       *             },
       *             itemsProperty: 'articles'
       *          }),
       *          articles = data.getAll(),
       *          topics = data.getAll('topics');
       *
       *       console.log(articles.at(0).get('title'));//'Captain America'
       *       console.log(topics.at(0).get('title'));//'Marvel Comics'
       *    });
       * </pre>
       */
      getAll: function (property) {
         this._checkAdapter();
         if (property === undefined) {
            property = this._$itemsProperty;
         }

         var items = this._getListInstance(this._getDataProperty(property));

         //FIXME: deprecated
         if (this._$totalProperty && items.getMetaData instanceof Function) {
            var meta = items.getMetaData();
            meta.more = this.getTotal();
            items.setMetaData(meta);
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
       *    require(['WS.Data/Source/DataSet'], function (DataSet) {
       *       var data = new DataSet({
       *             rawData: {
       *                id: 1,
       *                title: 'C++ Beginners Tutorial'
       *             }
       *          }),
       *          article = data.getRow();
       *
       *       console.log(article.get('title'));//'C++ Beginners Tutorial'
       *    });
       * </pre>
       * @example
       * Получим записи статьи и темы из набора данных, который содержит несколько записей:
       * <pre>
       *    require(['WS.Data/Source/DataSet'], function (DataSet) {
       *       var data = new DataSet({
       *             rawData: {
       *                article: {
       *                   id: 2,
       *                   topicId: 1,
       *                   title: 'Iron Man'
       *                },
       *                topic: {
       *                   id: 1,
       *                   title: 'Marvel Comics'
       *                }
       *             }
       *          }),
       *          article = data.getRow('article'),
       *          topic = data.getRow('topic');
       *
       *       console.log(article.get('title'));//'Iron Man'
       *       console.log(topic.get('title'));//'Marvel Comics'
       *    });
       * </pre>
       */
      getRow: function (property) {
         this._checkAdapter();
         if (property === undefined) {
            property = this._$itemsProperty;
         }
         //FIXME: don't use hardcoded signature for type detection
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
       *    require(['WS.Data/Source/DataSet'], function (DataSet) {
       *       var statOpen = new DataSet({
       *          rawData: 234
       *       });
       *
       *       console.log(statOpen.getScalar());//234
       *    });
       * </pre>
       * @example
       * Получим количество открытых и закрытых задач:
       * <pre>
       *    require(['WS.Data/Source/DataSet'], function (DataSet) {
       *       var stat = new DataSet({
       *          rawData: {
       *             total: 500,
       *             open: 234,
       *             closed: 123,
       *             deleted: 2345
       *           }
       *       });
       *
       *       console.log(stat.getScalar('open'));//234
       *       console.log(stat.getScalar('closed'));//123
       *    });
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
       *    require(['WS.Data/Source/DataSet'], function (DataSet) {
       *       var data = new DataSet({
       *          rawData: {
       *             articles: [{
       *                id: 1,
       *                title: 'C++ Beginners Tutorial'
       *             }]
       *          }
       *       });
       *
       *       console.log(data.hasProperty('articles'));//true
       *       console.log(data.hasProperty('topics'));//false
       *    });
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
       *    require(['WS.Data/Source/DataSet'], function (DataSet) {
       *       var data = new DataSet({
       *          rawData: {
       *             article: {
       *                id: 1,
       *                title: 'C++ Beginners Tutorial'
       *             }
       *          }
       *       });
       *
       *       console.log(data.getProperty('article'));//{id: 1, title: 'C++ Beginners Tutorial'}
       *    });
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
       *    require(['WS.Data/Source/DataSet'], function (DataSet) {
       *       var data = new DataSet({
       *          rawData: {
       *             id: 1,
       *             title: 'C++ Beginners Tutorial'
       *          }
       *       });
       *
       *       console.log(data.getRawData());//{id: 1, title: 'C++ Beginners Tutorial'}
       *    });
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
       *    require(['WS.Data/Source/DataSet'], function (DataSet) {
       *       var data = new DataSet();
       *
       *       data.setRawData({
       *          id: 1,
       *          title: 'C++ Beginners Tutorial'
       *       });
       *       console.log(data.getRow().get('title'));//'C++ Beginners Tutorial'
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
       * @return {WS.Data/Entity/Model}
       * @protected
       */
      _getModelInstance: function (rawData) {
         if (!this._$model) {
            throw new Error('Model is not defined');
         }
         return Di.create(this._$model, {
            writable: this._$writable,
            rawData: rawData,
            adapter: this._$adapter,
            idProperty: this._$idProperty
         });
      },

      /**
       * Возвращает инстанс рекордсета
       * @param {*} rawData Данные рекордсета
       * @return {WS.Data/Collection/RecordSet}
       * @protected
       */
      _getListInstance: function(rawData) {
         return Di.create(this._$listModule, {
            writable: this._$writable,
            rawData: rawData,
            adapter: this._$adapter,
            model: this._$model,
            idProperty: this._$idProperty
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

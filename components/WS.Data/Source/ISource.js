/* global define */
define('js!WS.Data/Source/ISource', [], function () {
   'use strict';

   /**
    * Интерфейс источника данных - объекта с CRUD архитектурой, предоставляющего доступ к типовым операциям (create, read, update, delete, ...), применяемым к объекту предметной области.
    * Источник данных содержит несколько вариантов абстракций:
    * <ul>
    *    <li>абстракция доступа к данным;</li>
    *    <li>абстракция работы с форматом данных.</li>
    * </ul>
    *
    * Создадим новую статью:
    * <pre>
    *    var dataSource = new RpcSource({
    *       endpoint: {
    *          address: '//your.rpc.server/',
    *          contract: 'Article'
    *       },
    *       binding: {
    *          create: 'Add'
    *       },
    *       idProperty: 'id'
    *    });
    *    dataSource.create().addCallback(function(article) {
    *       var id = article.getId();
    *    });
    * </pre>
    * Прочитаем статью:
    * <pre>
    *    var dataSource = new RpcSource({
    *       endpoint: {
    *          address: '//your.rpc.server/',
    *          contract: 'Article'
    *       },
    *       binding: {
    *          read: 'Read'
    *       },
    *       idProperty: 'id'
    *    });
    *    dataSource.read('article-1').addCallback(function(article) {
    *       var title = article.get('title');
    *    });
    * </pre>
    * Сохраним статью:
    * <pre>
    *    var dataSource = new RpcSource({
    *          endpoint: {
    *             address: '//your.rpc.server/',
    *             contract: 'Article'
    *          },
    *          binding: {
    *             update: 'Update'
    *          },
    *          idProperty: 'id'
    *       }),
    *       article = new Record({
    *          rawData: {
    *             id: 'article-1',
    *             title: 'Article 1'
    *          }
    *       });
    *
    *    dataSource.update(article).addCallback(function() {
    *       alert('Article updated!');
    *    });
    * </pre>
    * Удалим статью:
    * <pre>
    *    var dataSource = new RpcSource({
    *       endpoint: {
    *          address: '//your.rpc.server/',
    *          contract: 'Article'
    *       },
    *       binding: {
    *          destroy: 'Delete'
    *       }
    *       idProperty: 'id'
    *    });
    *    dataSource.destroy('article-1').addCallback(function(article) {
    *       alert('Article deleted!');
    *    });
    * </pre>
    * @interface WS.Data/Source/ISource
    * @public
    * @author Мальцев Алексей
    */

   var ISource = /** @lends WS.Data/Source/ISource.prototype */{
      /**
       * @typedef {Object} Endpoint
       * @property {String} [address] Адрес - указывает место расположения сервиса, к которому будет осуществлено подключение
       * @property {String} contract Контракт - определяет доступные операции
       */

      /** @typedef {String} MovePosition
       *  @variant {String} before Вставить перед целевой записью
       *  @variant {String} after Вставить после целевой записи
       *  @variant {String} on Вставить внутрь целевой записи
       */

      /** @typedef {Object} MoveMetaConfig
       * @property {MovePosition} position Определяет как позиционировать запись относительно target.
       * @property {String} parenProperty Название поля иерархии.
       */

      /**
       * Возвращает конечную точку, обеспечивающую доступ клиента к функциональным возможностям источника данных.
       * @return {Endpoint}
       * @see endpoint
       * @example
       * Получим название контракта:
       * <pre>
       *    var dataSource = new RpcSource({
       *       endpoint: {
       *          address: '/api/',
       *          contract: 'User'
       *       }
       *    });
       *
       *    dataSource.getEndpoint().contract;//'User'
       * </pre>
       */
      getEndpoint: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает соответствие методов CRUD+ контракту.
       * @return {Binding}
       * @see binding
       * @see setBinding
       * @example
       * Получим название метода, отвечающего за чтение:
       * <pre>
       *    var dataSource = new RpcSource({
       *       binding: {
       *          create: 'Add',
       *          read: 'Load',
       *          update: 'Save',
       *          destroy: 'Delete'
       *       }
       *    });
       *
       *    dataSource.getBinding().read;//'Load'
       * </pre>
       */
      getBinding: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает соответствие методов CRUD+ контракту.
       * @param {Binding} binding
       * @see binding
       * @see getBinding
       * @example
       * Получим название метода, отвечающего за чтение:
       * <pre>
       *    var dataSource = new RpcSource();
       *
       *    dataSource.setBinding({
       *       create: 'Add',
       *       read: 'Load',
       *       update: 'Save',
       *       destroy: 'Delete'
       *    });
       * </pre>
       */
      setBinding: function (binding) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает адаптер для работы с данными.
       * @return {WS.Data/Adapter/IAdapter}
       * @see setAdapter
       * @see adapter
       * @see WS.Data/Adapter/IAdapter
       * @example
       * Получим адаптер источника, используемый по умолчанию:
       * <pre>
       *    var dataSource = new MemorySource();
       *    CoreInstance.instanceOfModule(dataSource.getAdapter(), 'WS.Data/Adapter/Json');//true
       * </pre>
       */
      getAdapter: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает адаптер для работы с данными.
       * @param {String|WS.Data/Adapter/IAdapter} adapter
       * @see getAdapter
       * @see adapter
       * @see WS.Data/Adapter/IAdapter
       * @see WS.Data/Di
       * @example
       * Установим адаптер для данных в формате БЛ СБИС, внедренный в виде названия зарегистрированной зависимости:
       * <pre>
       *    define(['js!WS.Data/Adapter/Sbis'], function () {
       *       var dataSource = new MemorySource();
       *       dataSource.setAdapter('adapter.sbis');
       *    });
       * </pre>
       * Установим адаптер для данных в формате БЛ СБИС, внедренный в виде готового экземпляра:
       * <pre>
       *    define(['js!WS.Data/Adapter/Sbis'], function (SbisAdapter) {
       *       var dataSource = new MemorySource();
       *       dataSource.setAdapter(new SbisAdapter());
       *    });
       * </pre>
       */
      setAdapter: function (adapter) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает конструктор записей, порождаемых источником данных.
       * @return {String|Function}
       * @see setModel
       * @see model
       * @see WS.Data/Entity/Model
       * @see WS.Data/Di
       * @example
       * Получим конструктор записей, используемый по умолчанию:
       * <pre>
       *    var dataSource = new MemorySource();
       *    dataSource.getModel();//'entity.model'
       * </pre>
       */
      getModel: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает конструктор записей, порождаемых источником данных.
       * @param {String|Function} model
       * @see getModel
       * @see model
       * @see WS.Data/Entity/Model
       * @see WS.Data/Di
       * @example
       * Установим конструктор пользовательской модели, внедренный в виде названия зарегистрированной зависимости:
       * <pre>
       *    var User = Model.extend({
       *       identify: function(login, password) {
       *       }
       *    });
       *    Di.register('app.model.user', User);
       *    //...
       *    var dataSource = new MemorySource();
       *    dataSource.setModel('app.model.user');
       * </pre>
       * Установим конструктор пользовательской модели, внедренный в виде класса:
       * <pre>
       *    var User = Model.extend({
       *       identify: function(login, password) {
       *       }
       *    });
       *    //...
       *    var dataSource = new MemorySource();
       *    dataSource.setModel(User);
       * </pre>
       */
      setModel: function (model) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает конструктор рекордсетов, порождаемых источником данных.
       * @return {String|Function}
       * @see setListModule
       * @see listModule
       * @example
       * Получим конструктор рекордсетов, используемый по умолчанию:
       * <pre>
       *    var dataSource = new MemorySource();
       *    dataSource.getListModule();//'collection.recordset'
       * </pre>
       */
      getListModule: function () {
         throw new Error('Method must be implemented');
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
       *    var dataSource = new MemorySource();
       *    dataSource.setListModule('app.collections.users');
       * </pre>
       * Установим конструктор рекордсетов, внедренный в виде класса:
       * <pre>
       *    var Users = RecordSet.extend({});
       *    //...
       *    var dataSource = new MemorySource();
       *    dataSource.setListModule(Users);
       * </pre>
       */
      setListModule: function (listModule) {
         throw new Error('Method must be implemented');
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
       *    var dataSource = new MemorySource({
       *       idProperty: 'id'
       *    });
       *    dataSource.getIdProperty();//'id'
       * </pre>
       */
      getIdProperty: function () {
         throw new Error('Method must be implemented');
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
       *    var dataSource = new MemorySource();
       *    dataSource.setIdProperty('id');
       * </pre>
       */
      setIdProperty: function (name) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает имя поля, по которому по умолчанию сортируются записи выборки.
       * @return {String}
       * @see setOrderProperty
       * @see orderProperty
       * @example
       * Получим имя поля, по которому по умолчанию сортируются записи выборки:
       * <pre>
       *    var dataSource = new MemorySource({
       *       idProperty: 'sort'
       *    });
       *    dataSource.getOrderProperty();//'sort'
       * </pre>
       */
      getOrderProperty: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает имя поля, по которому по умолчанию сортируются записи выборки.
       * @param {String} name
       * @see getOrderProperty
       * @see orderProperty
       * @example
       * Установим имя поля, по которому по умолчанию сортируются записи выборки:
       * <pre>
       *    var dataSource = new MemorySource();
       *    dataSource.setOrderProperty('sort');
       * </pre>
       */
      setOrderProperty: function (name) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает дополнительные настройки источника данных.
       * @return {Object}
       * @see options
       * @see setOptions
       */
      getOptions: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает дополнительные настройки источника данных.
       * @param {Object} options
       * @see options
       * @see getOptions
       */
      setOptions: function (options) {
         throw new Error('Method must be implemented');
      },

      /**
       * Создает пустую модель через источник данных (при этом она не сохраняется в хранилище)
       * @param {Object|WS.Data/Entity/Record} [meta] Дополнительные мета данные, которые могут понадобиться для создания модели
       * @return {Core/Deferred} Асинхронный результат выполнения. В колбэке придет {@link WS.Data/Entity/Model}.
       * @see WS.Data/Entity/Model
       * @example
       * Создадим новую статью:
       * <pre>
       *    define(['Core/core-functions'], function(CoreFunctions) {
       *       var dataSource = new RestSource({
       *          endpoint: '/articles/',
       *          idProperty: 'Id'
       *       });
       *       dataSource.create().addCallback(function(article) {
       *          var id = article.get('Id'),//01c5151e-21fe-5316-d118-cb13216c9412
       *             title = article.get('Title');//Untitled
       *       }).addErrback(function() {
       *          CoreFunctions.alert('Can\'t create an article');
       *       });
       *    });
       * </pre>
       * Создадим нового сотрудника:
       * <pre>
       *     var dataSource = new SbisService({
       *        endpoint: 'Сотрудник',
       *        idProperty: '@Сотрудник'
       *     });
       *     dataSource.create().addCallback(function(employee) {
       *         var name = employee.get('Имя');
       *     });
       * </pre>
       */
      create: function (meta) {
         throw new Error('Method must be implemented');
      },

      /**
       * Читает модель из источника данных
       * @param {String} key Первичный ключ модели
       * @param {Object|WS.Data/Entity/Record} [meta] Дополнительные мета данные
       * @return {Core/Deferred} Асинхронный результат выполнения. В колбэке придет {@link WS.Data/Entity/Model}.
       * @example
       * Прочитаем статью с ключом 'how-to-read-an-item':
       * <pre>
       *    define(['Core/core-functions'], function(CoreFunctions) {
       *       var dataSource = new RestSource({
       *          endpoint: '/articles/',
       *          idProperty: 'Id'
       *       });
       *       dataSource.read('how-to-read-an-item').addCallback(function(article) {
       *          var id = article.get('Id'),//how-to-read-an-item
       *             title = article.get('Title');//How to read an item
       *       }).addErrback(function() {
       *          CoreFunctions.alert('Can\'t read the article');
       *       });
       *    });
       * </pre>
       * Прочитаем данные сотрудника с идентификатором 123321:
       * <pre>
       *     var dataSource = new SbisService({
       *        endpoint: 'Сотрудник',
       *        idProperty: '@Сотрудник'
       *     });
       *     dataSource.read(123321).addCallback(function(employee) {
       *         var name = employee.get('Имя');
       *     });
       * </pre>
       */
      read: function (key, meta) {
         throw new Error('Method must be implemented');
      },

      /**
       * Обновляет модель в источнике данных
       * @param {WS.Data/Entity/Model} model Обновляемая модель
       * @param {Object} [meta] Дополнительные мета данные
       * @return {Core/Deferred} Асинхронный результат выполнения
       * @example
       * Обновим статью с ключом 'how-to-update-an-item':
       * <pre>
       *    define(['Core/core-functions'], function(CoreFunctions) {
       *       var dataSource = new RestSource({
       *             endpoint: '/articles/',
       *             idProperty: 'Id'
       *          }),
       *          article = new Model({
       *             rawData: {
       *                Id: 'how-to-update-an-item',
       *                Title: 'How to update an item'
       *             },
       *             idProperty: 'Id'
       *          });
       *       dataSource.update(article).addCallback(function() {
       *          CoreFunctions.alert('The article was updated successfully');
       *       }).addErrback(function() {
       *          CoreFunctions.alert('Can\'t update the article');
       *       });
       *    });
       * </pre>
       * Обновим данные сотрудника с идентификатором 123321:
       * <pre>
       *    define(['Core/core-functions'], function(CoreFunctions) {
       *       var dataSource = new SbisService({
       *             endpoint: 'Сотрудник'
       *             idProperty: '@Сотрудник'
       *          }),
       *          employee = new Model({
       *             format: [
       *                {name: '@Сотрудник', type: 'identity'},
       *                {name: 'Должность', type: 'string'}
       *             ],
       *             adapter: dataSource.getAdapter(),
       *             idProperty: dataSource.getIdProperty()
       *          }),
       *          data = {};
       *
       *       data['@Сотрудник'] = [123321];
       *       data['Должность'] = 'Старший менеджер';
       *       employee.set(data);
       *
       *       dataSource.update(employee).addCallback(function() {
       *          CoreFunctions.alert('Данные сотрудника обновлены');
       *       });
       *    });
       * </pre>
       */
      update: function (model, meta) {
         throw new Error('Method must be implemented');
      },

      /**
       * Удаляет модель из источника данных
       * @param {String|Array} keys Первичный ключ, или массив первичных ключей модели
       * @param {Object|WS.Data/Entity/Record} [meta] Дополнительные мета данные
       * @return {Core/Deferred} Асинхронный результат выполнения
       * @example
       * Удалим статью с ключом 'article-id-to-destroy':
       * <pre>
       *    define(['Core/core-functions'], function(CoreFunctions) {
       *       var dataSource = new RestSource({
       *          endpoint: '/articles/',
       *          idProperty: 'Id'
       *       });
       *       dataSource.destroy('article-id-to-destroy').addCallback(function() {
       *          CoreFunctions.alert('The article was deleted successfully');
       *       }).addErrback(function() {
       *          CoreFunctions.alert('Can\'t delete the article');
       *       });
       *    });
       * </pre>
       * Удалим сотрудника с идентификатором 123321:
       * <pre>
       *    define(['Core/core-functions'], function(CoreFunctions) {
       *        var dataSource = new SbisService({
       *           endpoint: 'Сотрудник',
       *           idProperty: '@Сотрудник'
       *        });
       *        dataSource.destroy(123321).addCallback(function() {
       *          CoreFunctions.alert('Сотрудник удален');
       *        });
       *    });
       * </pre>
       */
      destroy: function (keys, meta) {
         throw new Error('Method must be implemented');
      },

      /**
       * Объединяет одну модель с другой
       * @param {String} from Первичный ключ модели-источника (при успешном объедининии модель будет удалена)
       * @param {String} to Первичный ключ модели-приёмника
       * @return {Core/Deferred} Асинхронный результат выполнения
       * @example
       * Объединим статью с ключом 'article-from' со статьей с ключом 'article-to':
       * <pre>
       *    define(['Core/core-functions'], function(CoreFunctions) {
       *       var dataSource = new RestSource({
       *          endpoint: '/articles/',
       *          idProperty: 'Id'
       *       });
       *       dataSource.merge('article-from', 'article-to').addCallback(function() {
       *          CoreFunctions.alert('The articles was merged successfully');
       *       }).addErrback(function() {
       *          CoreFunctions.alert('Can\'t merge the articles');
       *       });
       *    });
       * </pre>
       * example сотрудников с идентификаторами 123321 и 456654:
       * <pre>
       *    define(['Core/core-functions'], function(CoreFunctions) {
       *        var dataSource = new SbisService({
       *           endpoint: 'Сотрудник',
       *           idProperty: '@Сотрудник'
       *        });
       *        dataSource.merge(123321, 456654).addCallback(function() {
       *           CoreFunctions.alert('Сотрудники объединены');
       *        });
       *    });
       * </pre>
       */
      merge: function (from, to) {
         throw new Error('Method must be implemented');
      },

      /**
       * Создает копию модели
       * @param {String} key Первичный ключ модели
       * @param {Object} [meta] Дополнительные мета данные
       * @return {Core/Deferred} Асинхронный результат выполнения. В колбэке придет {@link WS.Data/Entity/Model копия модели}.
       * @example
       * Скопируем статью с ключом 'article-id':
       * <pre>
       *    define(['Core/core-functions'], function(CoreFunctions) {
       *       var dataSource = new RestSource({
       *          endpoint: '/articles/',
       *          idProperty: 'Id'
       *       });
       *       dataSource.copy('article-id').addCallback(function(copy) {
       *          CoreFunctions.alert('The article was copied successfully. New id is: ' + copy.getId());
       *       }).addErrback(function() {
       *          CoreFunctions.alert('Can\'t copy the article');
       *       });
       *    });
       * </pre>
       * Скопируем сотрудника с идентификатором 123321:
       * <pre>
       *     var dataSource = new SbisService({
       *        endpoint: 'Сотрудник',
       *        idProperty: '@Сотрудник'
       *     });
       *     dataSource.copy(123321).addCallback(function(copy) {
       *        var newId = copy.getId();
       *     });
       * </pre>
       */
      copy: function (key, meta) {
         throw new Error('Method must be implemented');
      },

      /**
       * Выполняет запрос на выборку
       * @param {WS.Data/Query/Query} [query] Запрос
       * @return {Core/Deferred} Асинхронный результат выполнения. В колбэке придет {@link WS.Data/Source/DataSet}.
       * @see WS.Data/Query/Query
       * @see WS.Data/Source/DataSet
       * @example
       * Найдем молодые таланты среди сотрудников:
       * <pre>
       *    var dataSource = new RpcSource({
       *          endpoint: 'Employee'
       *       }),
       *       query = new Query();
       *    query.select([
       *          'Id',
       *          'Name',
       *          'Position'
       *       ])
       *       .where({
       *          'Position': 'TeamLead',
       *          'Age>=': 10,
       *          'Age<=': 18
       *       })
       *       .orderBy('Age');
       *    dataSource.query(query).addCallback(function(dataSet) {
       *       if (dataSet.getAll().getCount() > 0) {
       *          //New Mark Zuckerberg detected
       *       }
       *    });
       * </pre>
       * Выберем новые книги опредленного жанра:
       * <pre>
       *    var dataSource = new RpcSource({
       *          endpoint: 'Books'
       *       }),
       *       query = new Query();
       *    query.select([
       *          'Id',
       *          'Name',
       *          'Author',
       *          'Genre'
       *       ])
       *       .where({
       *          'Genre': ['Thriller', 'Detective']
       *       })
       *       .orderBy('Date', false);
       *    dataSource.query(query).addCallback(function(dataSet) {
       *       var books = dataSet.getAll();
       *       //Do something with the books
       *    });
       * </pre>
       */
      query: function (query) {
         throw new Error('Method must be implemented');
      },

      /**
       *
       * Вызывает метод (только для RPC источников)
       * @param {String} command Имя метода
       * @param {Object} [data] Аргументы
       * @return {Core/Deferred} Асинхронный результат выполнения. В колбэке придет {@link WS.Data/Source/DataSet}.
       * @see WS.Data/Source/DataSet
       * @example
       * Раздаем подарки сотрудникам, у которых сегодня день рождения. Также посчитаем их количество:
       * <pre>
       *    var dataSource = new RpcSource({
       *       endpoint: 'Employee'
       *    });
       *    dataSource.call('GiveAGift', {
       *       birthDate: new Date(),
       *       giftCode: 'a-ticket-to-the-bowling'
       *    }).addCallback(function(dataSet) {
       *       var todaysBirthdayTotal = dataSet.getAll().getCount();
       *    });
       * </pre>
       */
      call: function (command, data) {
         throw new Error('Method must be implemented');
      },

      /**
       * Производит перемещение записи.
       * @param {Array} items Перемещаемая модель.
       * @param {String} target Идентификатор целевой записи, относительно которой позиционируются перемещаемые.
       * @param {MoveMetaConfig} [meta] Дополнительные мета данные.
       * @return {Core/Deferred} Асинхронный результат выполнения.
       */
      move: function (items, target, meta) {
         throw new Error('Method must be implemented');
      }
   };

   ISource.MOVE_POSITION = {
      on: 'on',
      before: 'before',
      after: 'after'
   };

   return ISource;
});

/* global define */
define('js!WS.Data/Entity/FormattableMixin', [
   'js!WS.Data/Format/Format',
   'js!WS.Data/Format/FormatsFactory',
   'js!WS.Data/Format/Field',
   'js!WS.Data/Format/FieldsFactory',
   'js!WS.Data/Di',
   'js!WS.Data/Utils',
   'js!WS.Data/Adapter/Json',
   'Core/core-instance'
], function (
   Format,
   FormatsFactory,
   Field,
   FieldsFactory,
   Di,
   Utils,
   JsonAdapter,
   CoreInstance
) {
   'use strict';

   /**
    * Приватные свойства
    */
   var _private = {
      defaultAdapter: 'adapter.json'
   };

   /**
    * Миксин, предоставляющий поведение владения форматом полей и доступа к их значениям в сырых данных через адаптер.
    * @mixin WS.Data/Entity/FormattableMixin
    * @public
    * @author Мальцев Алексей
    */

   var FormattableMixin = /**@lends WS.Data/Entity/FormattableMixin.prototype */{
      _wsDataEntityFormattableMixin: true,

      /**
       * @cfg {Object} Данные в "сыром" виде.
       * @name WS.Data/Entity/FormattableMixin#rawData
       * @see getRawData
       * @see setRawData
       * @remark
       * Данные должны быть в формате, поддерживаемом адаптером {@link adapter}.
       * @example
       * Создадим новую запись с данными сотрудника:
       * <pre>
       *    var user = new Record({
       *       rawData: {
       *          id: 1,
       *          firstName: 'John',
       *          lastName: 'Smith'
       *       }
       *    });
       *
       *    // 1
       *    user.get('id');
       *
       *    // John
       *    user.get('firstName');
       *
       *    // Smith
       *    user.get('lastName');
       * </pre>
       * Создадим рекордсет с персонажами фильма:
       * <pre>
       *    var characters = new RecordSet({
       *       rawData: [{
       *          id: 1,
       *          firstName: 'John',
       *          lastName: 'Connor',
       *          role: 'Savior'
       *       },{
       *          id: 2,
       *          firstName: 'Sarah',
       *          lastName: 'Connor',
       *          role: 'Mother'
       *       },{
       *          id: 3,
       *          firstName: '-',
       *          lastName: 'T-800',
       *          role: 'Terminator'
       *       }]
       *    });
       *
       *    // John
       *    characters.at(0).get('firstName');
       *
       *    // Connor
       *    characters.at(0).get('lastName');
       *
       *    // Sarah
       *    characters.at(1).get('firstName');
       *
       *    // Connor
       *    characters.at(1).get('lastName');
       * </pre>
       */
      _$rawData: null,

      /**
       * @cfg {String|WS.Data/Adapter/IAdapter} Адаптер для работы с данными, по умолчанию {@link WS.Data/Adapter/Json}.
       * @name WS.Data/Entity/FormattableMixin#adapter
       * @see getAdapter
       * @see setAdapter
       * @see WS.Data/Adapter/Json
       * @see WS.Data/Di
       * @remark
       * Адаптер должен быть предназначен для формата, в котором получены сырые данные {@link rawData}.
       * По умолчанию обрабатываются данные в формате JSON (ключ -> значение).
       * @example
       * Создадим запись с адаптером для данных в формате БЛ СБИС, внедренным в виде названия зарегистрированной зависимости:
       * <pre>
       *    define(['js!WS.Data/Adapter/Sbis'], function () {
       *       var user = new Record({
       *          adapter: 'adapter.sbis',
       *          rawData: {
       *             _type: 'record',
       *             d: [],
       *             s: []
       *          }
       *       });
       *    });
       * </pre>
       * Создадим запись с адаптером для данных в формате БЛ СБИС, внедренным в виде готового экземпляра:
       * <pre>
       *    define(['js!WS.Data/Adapter/Sbis'], function (SbisAdapter) {
       *       var user = new Record({
       *          adapter: new SbisAdapter(),
       *          rawData: {
       *             _type: 'record',
       *             d: [],
       *             s: []
       *          }
       *       });
       *    });
       * </pre>
       */
      _$adapter: _private.defaultAdapter,

      /**
       * @cfg {WS.Data/Format/Format|Array.<WS.Data/Format/FieldsFactory/FieldDeclaration.typedef>|Object.<String, String>|Object.<String, Function>|Object.<String, WS.Data/Format/FieldsFactory/FieldDeclaration.typedef>|Object.<String, WS.Data/Format/Field>} Формат всех полей (если задан массивом или экземпляром {@link WS.Data/Format/Format Format}), либо формат отдельных полей (если задан объектом).
       * @name WS.Data/Entity/FormattableMixin#format
       * @see getFormat
       * @remark Правила {@link getFormat формирования формата} в зависимости от типа значения опции:
       * <ul>
       * <li>если формат явно не задан, то он будет построен по сырым данным;
       * <li>если формат задан для части полей (Object), то он будет построен по сырым данным; для полей с совпадающими именами формат будет заменен на явно указанный, формат полей с несовпадающими именами будет добавлен в конец;
       * <li>если формат задан для всех полей (Array или WS.Data/Format/Format), то будет использован именно он, независимо от набора полей в сырых данных.
       * @example
       * Создадим запись с указанием формата полей, внедренным в декларативном виде:
       * <pre>
       *    define(['js!WS.Data/Entity/Record'], function(Record) {
       *       var user = new Record({
       *          format: [{
       *             name: 'id',
       *             type: 'integer'
       *          }, {
       *             name: 'login',
       *             type: 'string'
       *          }, {
       *             name: 'amount',
       *             type: 'money',
       *             precision: 4
       *          }]
       *       });
       *    });
       * </pre>
       * Создадим рекордсет с указанием формата полей, внедренным в виде готового экземпляра:
       * <pre>
       *    //My.Format.User.module.js
       *    define('js!My.Format.User', [
       *       'js!WS.Data/Format/Format',
       *       'js!WS.Data/Format/IntegerField',
       *       'js!WS.Data/Format/StringField'
       *    ], function(Format, IntegerField, StringField) {
       *       var format = new Format();
       *       format.add(new IntegerField({name: 'id'}));
       *       format.add(new StringField({name: 'login'}));
       *       format.add(new StringField({name: 'email'}));
       *
       *       return format;
       *    });
       *
       *    //Users.js
       *    define([
       *       'js!WS.Data/Collection/RecordSet',
       *       'js!My.Format.User'
       *    ], function (RecordSet, UserFormat) {
       *       var users = new RecordSet({
       *          format: new UserFormat
       *       });
       *    });
       * </pre>
       * Создадим запись, для которой зададим формат полей 'id' и 'amount', внедренный в декларативном виде:
       * <pre>
       *    define(['js!WS.Data/Entity/Record'], function(Record) {
       *       var user = new Record({
       *          rawData: {
       *             id: 256,
       *             login: 'dr.strange',
       *             amount: 15739.45
       *          },
       *          format: {
       *             id: 'integer',
       *             amount: {type: 'money', precision: 4}
       *          }]
       *       });
       *    });
       * </pre>
       * Создадим запись, для которой зададим формат поля 'amount', внедренный в виде готового экземпляра:
       * <pre>
       *    define([
       *       'js!WS.Data/Entity/Record',
       *       'js!WS.Data/Format/MoneyField'
       *    ], function(Record, MoneyField) {
       *       var amountField = new MoneyField({precision: 4}),
       *          user = new Record({
       *             format: {
       *                amount: amountField
       *             }]
       *          });
       *    });
       * </pre>
       * Укажем тип Number для поля "Идентификатор" и тип Date для поля "Время последнего входа" учетной записи пользователя:
       * <pre>
       *    define(['js!WS.Data/Entity/Record'], function(Record) {
       *       var user = new Record({
       *          format: {
       *             id: Number,
       *             lastLogin: Date
       *          }
       *       });
       *    });
       * </pre>
       * Внедрим рекордсет со своей моделью в одно из полей записи:
       * <pre>
       *    //ActivityModel.js
       *    define('js!MyApplication/Models/ActivityModel', [
       *       'js!WS.Data/Entity/Model'
       *    ], function(Model) {
       *       return Model.extend({
       *          //...
       *       });
       *    });
       *
       *    //ActivityRecordSet.js
       *    define('js!MyApplication/ViewModels/ActivityRecordSet', [
       *       'js!WS.Data/Collection/RecordSet'
       *       'js!MyApplication/Models/ActivityModel'
       *    ], function(RecordSet, ActivityModel) {
       *       return RecordSet.extend({
       *          _$model: ActivityModel
       *       });
       *    });
       *
       *    //ActivityController.js
       *    define('js!MyApplication/Controllers/ActivityController', [
       *       'js!WS.Data/Entity/Record'
       *       'js!MyApplication/ViewModels/ActivityRecordSet'
       *    ], function(Record, ActivityRecordSet) {
       *       var user = new Record({
       *          format: {
       *             activity: ActivityRecordSet
       *          }
       *       });
       *       //...
       *    });
       * </pre>
       * Создадим запись заказа в магазине с полем типа "рекордсет", содержащим список позиций. Сырые данные будут в формате БЛ СБИС:
       * <pre>
       *    define([
       *       'js!WS.Data/Entity/Record',
       *       'js!WS.Data/Collection/RecordSet',
       *       'js!WS.Data/Adapter/Sbis'
       *    ], function (Record, RecordSet) {
       *       var order = new Record({
       *             adapter: 'adapter.sbis',
       *             format:[{
       *                name: 'id',
       *                type: 'integer',
       *                defaultValue: 0
       *             }, {
       *                name: 'items',
       *                type: 'recordset'
       *             }]
       *          }),
       *          orderItems = new RecordSet({
       *             adapter: 'adapter.sbis',
       *             format: [{
       *                name: 'goods_id',
       *                type: 'integer',
       *                defaultValue: 0
       *             },{
       *                name: 'price',
       *                type: 'real',
       *                defaultValue: 0
       *             },{
       *               name: 'count',
       *               type: 'integer',
       *               defaultValue: 0
       *             }]
       *          });
       *
       *       order.set('items', orderItems);
       *    });
       * </pre>
       */
      _$format: null,

      /**
       * @member {WS.Data/Format/Format} Формат полей (собранный из опции format или в результате манипуляций)
       */
      _format: null,

      /**
       * @member {WS.Data/Format/Format} Клон формата полей (для кэшеирования результата getFormat())
       */
      _formatClone: null,

      /**
       * @member {WS.Data/Adapter/ITable|WS.Data/Adapter/IRecord} Адаптер для данных в "сыром" виде
       */
      _rawDataAdapter: null,

      /**
       * @member {Array.<String>} Описание всех полей, полученных из данных в "сыром" виде
       */
      _rawDataFields: null,

      constructor: function $FormattableMixin(options) {
         //FIXME: поддержка старого extend
         if (!this._$format && this._options && this._options.format) {
            this._$format = this._options.format;
         }

         this._buildRawData();
      },

      //region WS.Data/Entity/SerializableMixin

      _getSerializableState: function(state) {
         state.$options.rawData = this._getRawData();
         return state;
      },

      _setSerializableState: function() {
         return function() {};
      },

      //endregion WS.Data/Entity/SerializableMixin

      //region Public methods

      /**
       * Возвращает данные в "сыром" виде. Если данные являются объектом, то возвращается его дубликат.
       * @return {Object}
       * @see setRawData
       * @see rawData
       * @example
       * Получим сырые данные статьи:
       * <pre>
       *    var data = {id: 1, title: 'Article 1'},
       *       article = new Record({
       *          rawData: data
       *       });
       *
       *    // {id: 1, title: 'Article 1'}
       *    article.getRawData();
       *
       *    // false
       *    article.getRawData() === data;
       *
       *    // true
       *    JSON.stringify(article.getRawData()) === JSON.stringify(data);
       * </pre>
       */
      getRawData: function(shared) {
         return shared ? this._getRawData() : Utils.clone(this._getRawData());
      },

      /**
       * Устанавливает данные в "сыром" виде.
       * @param data {Object} Данные в "сыром" виде.
       * @see getRawData
       * @see rawData
       * @example
       * Установим сырые данные статьи:
       * <pre>
       *    var article = new Record();
       *    article.setRawData({id: 1, title: 'Article 1'});
       *
       *    // Article 1
       *    article.get('title');
       * </pre>
       */
      setRawData: function(data) {
         this._resetRawDataAdapter(data);
         this._resetRawDataFields();
         this._clearFormatClone();
         this._buildRawData();
      },

      /**
       * Возвращает адаптер для работы с данными в "сыром" виде.
       * @return {WS.Data/Adapter/IAdapter}
       * @see adapter
       * @see setAdapter
       * @example
       * Проверим, что по умолчанию используется адаптер для формата JSON:
       * <pre>
       *    var article = new Record();
       *
       *    // true
       *    CoreInstance.instanceOfModule(article.getAdapter(), 'WS.Data/Adapter/Json');
       * </pre>
       */
      getAdapter: function () {
         var adapter = this._getAdapter();
         if (adapter._wsDataAdapterIDecorator) {//it's equal to CoreInstance.instanceOfMixin(adapter, 'WS.Data/Adapter/IDecorator')
            adapter = adapter.getOriginal();
         }
         return adapter;
      },

      /**
       * Устанавливает адаптер для работы с данными в "сыром" виде
       * @param {String|WS.Data/Adapter/IAdapter} adapter
       * @see adapter
       * @see rawData
       * @see getAdapter
       * @example
       * Установим адаптер для данных в формате БЛ СБИС в виде названия зарегистрированной зависимости:
       * <pre>
       *    define(['js!WS.Data/Adapter/Sbis'], function() {
       *       var article = new Record();
       *       article.setAdapter('adapter.sbis');
       *    });
       * </pre>
       * Установим адаптер для данных в формате БЛ СБИС в виде конструктора:
       * <pre>
       *    define(['js!WS.Data/Adapter/Sbis'], function(SbisAdapter) {
       *       var article = new Record();
       *       article.setAdapter(SbisAdapter);
       *    });
       * </pre>
       */
      setAdapter: function (adapter) {
         if (adapter._wsDataAdapterIDecorator) {//it's equal to CoreInstance.instanceOfMixin(adapter, 'WS.Data/Adapter/IDecorator')
            throw new TypeError('Implementation of the IDecorator can\'t be set directly');
         }

         this._$adapter = adapter;
         this._resetRawDataAdapter();
      },

      /**
       * Возвращает формат полей (в режиме только для чтения)
       * @return {WS.Data/Format/Format}
       * @see format
       * @example
       * Получим формат, сконструированный из декларативного описания:
       * <pre>
       *    var article = new Record({
       *          format: [
       *             {name: 'id', type: 'integer'},
       *             {name: 'title', type: 'string'}
       *          ]
       *       }),
       *       format = article.getFormat();
       *
       *    // 'id'
       *    format.at(0).getName();
       *
       *    // 'title'
       *    format.at(1).getName();
       * </pre>
       */
      getFormat: function (shared) {
         if (shared) {
            return this._getFormat(true);
         }
         return this._formatClone || (this._formatClone = this._getFormat(true).clone());
      },

      /**
       * Добавляет поле в формат.
       * @remark
       * Если позиция не указана (или указана как -1), поле добавляется в конец формата.
       * Если поле с таким форматом уже есть, генерирует исключение.
       * @param {WS.Data/Format/Field|WS.Data/Format/FieldsFactory/FieldDeclaration.typedef} format Формат поля.
       * @param {Number} [at] Позиция поля.
       * @see format
       * @see removeField
       * @example
       * Добавим поля в виде декларативного описания:
       * <pre>
       *    var record = new Record();
       *    record.addField({name: 'login', type: 'string'});
       *    record.addField({name: 'amount', type: 'money', precision: 3});
       * </pre>
       * Добавим поля в виде экземпляров:
       * <pre>
       *    var recordset = new RecordSet();
       *    recordset.addField(new StringField({name: 'login'}));
       *    recordset.addField(new MoneyField({name: 'amount', precision: 3}));
       * </pre>
       */
      addField: function(format, at) {
         format = this._buildField(format);
         this._$format = this._getFormat(true);
         this._$format.add(format, at);
         this._getRawDataAdapter().addField(format, at);
         this._resetRawDataFields();
         this._clearFormatClone();
      },

      /**
       * Удаляет поле из формата по имени.
       * @remark
       * Если поля с таким именем нет, генерирует исключение.
       * @param {String} name Имя поля
       * @see format
       * @see addField
       * @see removeFieldAt
       * @example
       * Удалим поле login:
       * <pre>
       *    record.removeField('login');
       * </pre>
       */
      removeField: function(name) {
         this._$format = this._getFormat(true)
         this._$format.removeField(name);
         this._getRawDataAdapter().removeField(name);
         this._resetRawDataFields();
         this._clearFormatClone();
      },

      /**
       * Удаляет поле из формата по позиции.
       * @remark
       * Если позиция выходит за рамки допустимого индекса, генерирует исключение.
       * @param {Number} at Позиция поля.
       * @see format
       * @see addField
       * @see removeField
       * @example
       * Удалим первое поле:
       * <pre>
       *    record.removeFieldAt(0);
       * </pre>
       */
      removeFieldAt: function(at) {
         this._$format = this._getFormat(true);
         this._$format.removeAt(at);
         this._getRawDataAdapter().removeFieldAt(at);
         this._resetRawDataFields();
         this._clearFormatClone();
      },

      //endregion Public methods

      //region Protected methods
      /**
       * Возвращает данные в "сыром" виде из _rawDataAdapter (если он был создан) или исходные
       * @return {Object}
       * @protected
       */
      _getRawData: function() {
         return this._rawDataAdapter ? this._rawDataAdapter.getData() : this._$rawData;
      },

      /**
       * Возвращает адаптер по-умолчанию в случае, если опция 'adapter' не была переопределена в подмешивающем миксин коде.
       * @protected
       * @deprecated Метод _getDefaultAdapter() не рекомендуется к использованию. Используйте опцию adapter.
       */
      _getDefaultAdapter: function() {
         return _private.defaultAdapter;
      },

      /**
       * Возвращает адаптерр для сырых данных
       * @return {WS.Data/Adapter/IAdapter}
       * @protected
       */
      _getAdapter: function () {
         if (
            this._$adapter === _private.defaultAdapter &&
            FormattableMixin._getDefaultAdapter !== this._getDefaultAdapter
         ) {
            this._$adapter = this._getDefaultAdapter();
         }

         if (this._$adapter && !(this._$adapter instanceof Object)) {
            this._$adapter = Di.create(this._$adapter);
         }
         return this._$adapter;
      },

      /**
       * Возвращает адаптер для сырых данных заданного вида
       * @return {WS.Data/Adapter/ITable|WS.Data/Adapter/IRecord}
       * @protected
       */
      _getRawDataAdapter: function () {
         if (!this._rawDataAdapter) {
            this._rawDataAdapter = this._createRawDataAdapter();
         }

         return this._rawDataAdapter;
      },

      /**
       * Создает адаптер для сырых данных
       * @return {WS.Data/Adapter/ITable|WS.Data/Adapter/IRecord}
       * @protected
       */
      _createRawDataAdapter: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Сбрасывает адаптер для сырых данных
       * @param {*} [data] Сырые данные
       * @protected
       */
      _resetRawDataAdapter: function (data) {
         if (data === undefined) {
            if (this._rawDataAdapter) {
               //Save possible rawData changes
               this._$rawData = this._rawDataAdapter.getData();
            }
         } else {
            this._$rawData = data;
         }

         this._rawDataAdapter = null;
      },

      /**
       * Проверяет совместимость адаптеров
       * @param {WS.Data/Adapter/IAdapter} foreign Адаптер внешнего объекта
       * @protected
       */
      _checkAdapterCompatibility: function (foreign) {
         var internal = this._getAdapter(),
            internalProto;

         if (foreign._wsDataAdapterIDecorator) {//it's equal to CoreInstance.instanceOfMixin(foreign, 'WS.Data/Adapter/IDecorator')
            foreign = foreign.getOriginal();
         }
         if (internal._wsDataAdapterIDecorator) {//it's equal to CoreInstance.instanceOfMixin(internal, 'WS.Data/Adapter/IDecorator')
            internal = internal.getOriginal();
         }

         internalProto = Object.getPrototypeOf(internal);
         if (!internalProto.isPrototypeOf(foreign)) {
            throw new TypeError('The foreign adapter "' + foreign._moduleName + '" is incompatible with the internal adapter "' + internal._moduleName + '"');
         }
      },

      /**
       * Возвращает список полей записи, полученный из "сырых" данных
       * @return {Array.<String>}
       * @protected
       */
      _getRawDataFields: function() {
         return this._rawDataFields || (this._rawDataFields = this._getRawDataAdapter().getFields());
      },

      /**
       * Добавляет поле в список полей
       * @param {String} name Название поля
       * @protected
       */
      _addRawDataField: function(name) {
         this._getRawDataFields().push(name);
      },

      /**
       * Сбрасывает список полей записи, полученный из "сырых" данных
       * @protected
       */
      _resetRawDataFields: function() {
         this._rawDataFields = null;
      },

      /**
       * Возвращает формат полей
       * @param {Boolean} [build=false] Принудительно создать, если не задан
       * @return {WS.Data/Format/Format}
       * @protected
       */
      _getFormat: function (build) {
         if (!this._format) {
            if (this._hasFormat()) {
               this._format = this._$format = this._buildFormat(this._$format);
            } else if (build) {
               this._format = this._buildFormatByRawData();
            }
         }

         return this._format;
      },

      /**
       * Очищает формат полей. Это можно сделать только если формат не был установлен явно.
       * @protected
       */
      _clearFormat: function () {
         if (this._hasFormat()) {
            throw new Error(this._moduleName + ': format can\'t be cleared because it\'s defined directly.');
         }
         this._format = null;
         this._clearFormatClone();
      },

      /**
       * Очищает клон формата полей.
       * @protected
       */
      _clearFormatClone: function () {
         this._formatClone = null;
      },

      /**
       * Возвращает признак, что формат полей был установлен явно
       * @return {Boolean}
       * @protected
       */
      _hasFormat: function () {
         return !!this._$format;
      },

      /**
       * Строит формат полей по описанию
       * @param {WS.Data/Format/Format|Array.<WS.Data/Format/FieldsFactory/FieldDeclaration.typedef>} format Описание формата
       * @return {WS.Data/Format/Format}
       * @protected
       */
      _buildFormat: function(format) {
         if (format) {
            var formatProto = Object.getPrototypeOf(format);
            if (formatProto === Array.prototype) {
               //All of the fields in Array
               format = FormatsFactory.create(format);
            } else if (formatProto === Object.prototype) {
               //Slice of the fields in Object
               var slice = format,
                  name,
                  field,
                  fieldIndex;

               format = this._buildFormatByRawData();
               for (name in slice) {
                  if (!slice.hasOwnProperty(name)) {
                     continue;
                  }

                  field = slice[name];
                  if (typeof field !== 'object') {
                     field = {type: field};
                  }
                  if (!(field instanceof Field)) {
                     field = FieldsFactory.create(field);
                  }
                  field.setName(name);

                  fieldIndex = format.getFieldIndex(name);
                  if (fieldIndex === -1) {
                     format.add(field);
                  } else {
                     format.replace(field, fieldIndex);
                  }
               }
            }
         }

         if (!format || !(format instanceof Format)) {
            format = new Format();
         }

         return format;
      },

      /**
       * Строит формат полей сырым данным
       * @return {WS.Data/Format/Format}
       * @protected
       */
      _buildFormatByRawData: function() {
         var format = new Format(),
            adapter = this._getRawDataAdapter(),
            fields = this._getRawDataFields(),
            count = fields.length,
            i;

         for (i = 0; i < count; i++) {
            format.add(
               adapter.getFormat(fields[i])
            );
         }

         return format;
      },

      /**
       * Возвращает формат поля с указанным названием
       * @param {String} name Название поля
       * @param {WS.Data/Adapter/ITable|WS.Data/Adapter/IRecord} adapter Адаптер
       * @return {WS.Data/Format/Field|WS.Data/Format/UniversalField}
       * @protected
       */
      _getFieldFormat: function(name, adapter) {
         if (this._hasFormat()) {
            var fields = this._getFormat(),
               index = fields.getFieldIndex(name);
            if (index > -1) {
               return fields.at(index);
            }
         }

         return adapter.getSharedFormat(name);
      },

      /**
       * Возвращает тип значения поля по его формату
       * @param {WS.Data/Format/Field|WS.Data/Format/UniversalField} format Формат поля
       * @return {String|Function}
       * @protected
       */
      _getFieldType: function(format) {
         var Type = format.getType ? format.getType() : format.type;
         if (Type && typeof Type === 'string') {
            if (Di.isRegistered(Type)) {
               Type = Di.resolve(Type);
            }
         }
         return Type;
      },

      /**
       * Строит формат поля по описанию
       * @param {WS.Data/Format/Field|WS.Data/Format/FieldsFactory/FieldDeclaration.typedef} format Описание формата поля
       * @return {WS.Data/Format/Field}
       * @protected
       */
      _buildField: function(format) {
         if (
            typeof format === 'string' ||
            Object.getPrototypeOf(format) === Object.prototype
         ) {
            format = FieldsFactory.create(format);
         }
         if (!format || !(format instanceof Field)) {
            throw new TypeError(this._moduleName + ': format should be an instance of WS.Data/Format/Field');
         }
         return format;
      },

      /**
       * Строит сырые данные по формату если он был явно задан
       * @protected
       */
      _buildRawData: function () {
         if (this._hasFormat() && this._$rawData == null) {
            var adapter = this._getRawDataAdapter(),
               fields = adapter.getFields();

            //TODO: подумать, как инициировать нормализацию данных
            if (adapter._touchData) {
               adapter._touchData();
            }

            this._getFormat().each(function(fieldFormat) {
               try {
                  if (fields.indexOf(fieldFormat.getName()) === -1) {
                     adapter.addField(fieldFormat);
                  }
               } catch (e) {
                  Utils.logger.info(this._moduleName + '::constructor(): can\'t add raw data field (' + e.message + ')');
               }
            }, this);
         }
      }

      //endregion Protected methods
   };

   return FormattableMixin;
});

/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.SbisServiceSource', [
   'js!SBIS3.CONTROLS.BaseSource',
   'js!SBIS3.CONTROLS.Record',
   'js!SBIS3.CONTROLS.DataSet',
   'js!SBIS3.CONTROLS.SbisServiceSource/resources/SbisServiceBLO',
   'js!SBIS3.CONTROLS.SbisJSONStrategy'
], function (BaseSource, Record, DataSet, SbisServiceBLO, SbisJSONStrategy) {
   'use strict';

   /**
    * Класс для работы с бизнес-логикой СБИС, как с источником данных.
    * @author Мануйлов Андрей
    * @class SBIS3.CONTROLS.SbisServiceSource
    * @extends SBIS3.CONTROLS.BaseSource
    * @public
    * @author Крайнов Дмитрий Олегович
    * @example
    * <pre>
    *     var dataSource = new SbisService({
    *        resource: 'СообщениеОтКлиента',
    *        modelIdField: '@СообщениеОтКлиента',
    *        queryMethodName: 'СписокОбщий',
    *        readMethodName: 'ПрочитатьПоКлиенту',
    *        updateMethodName: 'ЗаписатьСПроверкой',
    *        destroyMethodName:'Удалить'
    *     });
    * </pre>
    */

   return BaseSource.extend(/** @lends SBIS3.CONTROLS.SbisServiceSource.prototype */{
      $protected: {
         _options: {
             /**
              * @noShow
              */
            strategy: null,
            /**
             * @cfg {String} Имя метода, который будет использоваться для построения списка записей
             * сопоставление CRUD операций и методов БЛ
             * @see query
             */
            queryMethodName: 'Список',
             /**
              * @cfg {String} Имя метода, который будет использоваться для создания записей
              * @example
              * <pre>
              *    <option name="crateMethodName">Создать</option>
              * </pre>
              * @see create
              */
            crateMethodName: 'Создать',
             /**
              * @cfg {String} Имя метода, который будет использоваться для чтения записей
              * @example
              * <pre>
              *    <option name="readMethodName">Прочитать</option>
              * </pre>
              * @see read
              */
            readMethodName: 'Прочитать',
             /**
              * @cfg {String} Имя метода, который будет использоваться для обновления записей
              * @example
              * <pre>
              *    <option name="updateMethodName">Записать</option>
              * </pre>
              * @see update
              */
            updateMethodName: 'Записать',
             /**
              * @cfg {String} Имя метода, который будет использоваться для удаления записей
              * @example
              * <pre>
              *    <option name="destroyMethodName">Удалить</option>
              * </pre>
              * @see destroy
              */
            destroyMethodName: 'Удалить'
         },
         /**
          * @cfg {$ws.proto.ClientBLObject} Объект, который умеет ходить на бизнес-логику
          */
         _BL: undefined,
         /**
          * @cfg {$ws.proto.ClientBLObject} Объект, который используется для смены порядковых номеров на бизнес-логике
          */
         _orderBL: undefined,
         /**
          * @cfg {String} Имя объекта бизнес-логики
          */
         _object: undefined
      },

      $constructor: function (cfg) {
         this._BL = new SbisServiceBLO(cfg.service);
         this._object = cfg.service;
         this._options.strategy = cfg.strategy || new SbisJSONStrategy();
      },

      /**
       * Вызов создания записи в источнике данных методом, указанным в опции {@link createMethodName}.
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения. В колбэке придет SBIS3.CONTROLS.Record.
       * @example
       * <pre>
       *     var dataSource = new SbisServiceSource({
       *         service: {
       *             name: 'Товар'
       *         }
       *     });
       *     dataSource.create().addCallback(function(record) {
       *         var raw = record.getRaw();
       *         var key = record.getKey();
       *         record.set('Наименование', 'Тест ' + (new Date()).toString());
       *         dataSource.update(record).addCallback(function(success) {
       *             var raw = record.getRaw();
       *             var key = record.getKey();
       *         });
       *     });
       * </pre>
       * @see createMethodName
       */
      create: function () {
         var self = this,
            def = new $ws.proto.Deferred();
         //todo Выпилить адовый костыль для создания черновика, как только решится вопрос на стороне БЛ
         //(задание https://inside.tensor.ru/opendoc.html?guid=a886eecb-c2a0-4628-8919-a395be42dbbb)
         self._BL.call(self._options.crateMethodName, {
            'Фильтр': {
               d: [
                  true
               ],
               s: [{
                  n: 'ВызовИзБраузера',
                  t: 'Логическое'
               }]
            },
            'ИмяМетода': null
         }, $ws.proto.BLObject.RETURN_TYPE_ASIS).addCallbacks(function (res) {
            var record = new Record({
               strategy: self.getStrategy(),
               raw: res,
               keyField: self.getStrategy().getKey(res)
            });
            def.callback(record);
         }, function (error) {
            $ws.single.ioc.resolve('ILogger').log('SbisServiceSource', error);
            def.errback('Не удалось выполнить метод create');
         });
         return def;
      },

      /**
       * Метод для {@link readMethodName чтения} записи её по идентификатору.
       * @param {Number} id Идентификатор записи.
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения. В колбэке придёт SBIS3.CONTROLS.Record.
       * @example
       * <pre>
       *     var dataSource = new SbisServiceSource({
       *         service: {
       *             name: 'Товар'
       *         }
       *     });
       *     dataSource.read(1).addCallback(function(record) {
       *         var key = record.getKey();
       *         var name = record.get('Наименование');
       *     });
       * </pre>
       * @see readMethodName
       */
      read: function (id) {
         var self = this,
            def = new $ws.proto.Deferred();
         self._BL.call(self._options.readMethodName, {
            'ИдО': id,
            'ИмяМетода': 'Список'
         }, $ws.proto.BLObject.RETURN_TYPE_ASIS).addCallbacks(function (res) {
            var record = new Record({
               strategy: self.getStrategy(),
               raw: res,
               keyField: self.getStrategy().getKey(res),
               isCreated: true
            });
            def.callback(record);
         }, function (error) {
            $ws.single.ioc.resolve('ILogger').log('SbisServiceSource', error);
            def.errback('Не удалось выполнить метод read');
         });
         return def;
      },

      /**
       * Вызов обновления записи на БЛ методом, указанным в опции {@link updateMethodName}.
       * @param (SBIS3.CONTROLS.Record) record Изменённая запись.
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения. В колбэке придёт Boolean - результат успешности выполнения операции.
       * @example
       * <pre>
       *     var dataSource = new SbisServiceSource({
       *         service: {
       *             name: 'Товар'
       *         }
       *     });
       *     dataSource.read(1).addCallback(function(record) {
       *         var raw = record.getRaw();
       *         record.set('Наименование', 'Тест ' + (new Date()).toString());
       *         dataSource.update(record).addCallback(function(success) {
       *             var raw = record.getRaw();
       *         });
       *     });
       * </pre>
       * @see updateMethodName
       */
      update: function (record) {
         var self = this,
            strategy = this.getStrategy(),
            def = new $ws.proto.Deferred(),
            rec = strategy.prepareRecordForUpdate(record);

         self._BL.call(self._options.updateMethodName, {'Запись': rec}, $ws.proto.BLObject.RETURN_TYPE_ASIS).addCallbacks(function (res) {
            if (!record.isCreated()) {
               record.set(record.getKeyField(), res);
               record.setCreated(true);
            }
            record.setChanged(false);

            def.callback(true);
         }, function (error) {
            $ws.single.ioc.resolve('ILogger').log('SbisServiceSource', error);
            def.errback('Не удалось выполнить метод update');
         });

         return def;
      },

      /**
       * Вызов удаления записи из БЛ методом, указанным в опции {@link destroyMethodName}.
       * @param {Number} id Идентификатор записи или массив идентификаторов.
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения. В колбэке придёт Boolean - результат успешности выполнения операции.
       * @see destroyMethodName
       */
      destroy: function (id) {
         var self = this;
         if ($ws.helpers.type(id) == 'array') {
            var BL = [],
               ids = [];
            $ws.helpers.forEach(id, function(key) {
               //группируем идентификаторы по объекту
               var obj = self._getBlObjName(key),
                  index = Array.indexOf(BL, obj);
               if (index !== -1) {
                  ids[index].push(parseInt(key, 10));
               } else {
                  BL.push(obj);
                  ids.push([parseInt(key, 10)]);
               }
            });
            var pd = new $ws.proto.ParallelDeferred();
            $ws.helpers.forEach(BL, function(obj, index) {
               pd.push(self._destroy(ids[index], obj));
            });
            return pd.done().getResult();
         } else {
            return this._destroy(this._getBlById(id), parseInt(id, 10));
         }
      },

      /**
       * Вызов списочного метода БЛ, указанногов опции {@link queryMethodName}.
       * @remark
       * Возможно применение фильтрации, сортировки и выбора определенного количества записей с заданной позиции.
       * @param {Object} filter Параметры фильтрации вида - {property1: value, property2: value}.
       * @param {Array} sorting Параметры сортировки вида - [{property1: 'ASC'}, {property2: 'DESC'}].
       * @param {Number} offset Смещение начала выборки.
       * @param {Number} limit Количество возвращаемых записей.
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения. В колбэке придет SBIS3.CONTROLS.DataSet - набор отобранных элементов.
       * @example
       * <pre>
       *     var dataSource = new SbisServiceSource({
       *         service: {
       *             name: 'Товар'
       *         }
       *     });
       *     dataSource.query({
       *         'Наименование': 'Процессор'
       *     }).addCallback(function(dataSet) {
       *         //Что-то делаем с dataSet
       *     });
       * </pre>
       * @see queryMethodName
       */
      query: function (filter, sorting, offset, limit) {
         var
            self = this,
            strategy = this.getStrategy(),
            def = new $ws.proto.Deferred();
         self._BL.call(self._options.queryMethodName, this.prepareQueryParams(filter, sorting, offset, limit) , $ws.proto.BLObject.RETURN_TYPE_ASIS).addCallbacks(function (res) {
            var DS = new DataSet({
               strategy: strategy,
               data: res,
               meta: strategy.getMetaData(res)
            });
            def.callback(DS);
         }, function (error) {
            $ws.single.ioc.resolve('ILogger').log('SbisServiceSource', error);
            def.errback('Не удалось выполнить метод query');
         });

         return def;

      },
      /**
       * Подготовка параметров списочного метода.
       * @param {Object} filter Параметры фильтрации вида - {property1: value, property2: value}.
       * @param {Array} sorting Параметры сортировки вида - [{property1: 'ASC'}, {property2: 'DESC'}].
       * @param {Number} offset Смещение начала выборки.
       * @param {Number} limit Количество возвращаемых записей.
       * @param {Boolean} [hasMore] параметр для навигации "ЕстьЕще".
       * @returns {{ДопПоля: Array, Фильтр: Object, Сортировка: Object || null, Навигация: Object }}
       */
      prepareQueryParams : function(filter, sorting, offset, limit, hasMore){
         filter = filter || {};
         var strategy = this.getStrategy(),
               filterParam = strategy.prepareFilterParam(filter),
               sortingParam = strategy.prepareSortingParam(sorting),
               pagingParam = strategy.preparePagingParam(offset, limit, hasMore);
         return {
            'ДопПоля': [],
            'Фильтр': filterParam,
            'Сортировка': sortingParam,
            'Навигация': pagingParam
         }
      },
      /**
       * Метод перемещения записи к другому родителю и смены порядковых номеров
       * @param {SBIS3.CONTROLS.Record} record - запись, которую необходимо перенести
       * @param {String} hierField - имя колонки с иерархией
       * @param {Number} parentKey - ключ нового родителя для записи
       * @param {Object} orderDetails - детали смены порядковых номеров. Объект со свойствами after и before: после или перед какой записью нужно вставить перемещаемую.
       */
      move: function (record, hierField, parentKey, orderDetails) {
         var strategy;
         if(orderDetails){
            return this._changeOrder(record, hierField, parentKey, orderDetails);
         } else if(parentKey || parentKey === null){
            strategy = this.getStrategy();
            //сменить родителя
            strategy.setParentKey(record, hierField, parentKey);
            return this.update(record);
         } else {
            throw new Error('Не передано достаточно информации для перемещения');
         }
      },
      _changeOrder: function(record, hierField, parentKey, orderDetails){
         var self = this,
            strategy = this.getStrategy(),
            def = new $ws.proto.Deferred(),
            params = strategy.prepareOrderParams(this._object, record, hierField, orderDetails),
            suffix = orderDetails.after ? 'До' : 'После';
         if(!this._orderBL){
            this._orderBL = new $ws.proto.BLObject('ПорядковыйНомер');
         }
         self._orderBL.call('Вставить' + suffix, params, $ws.proto.BLObject.RETURN_TYPE_ASIS).addCallbacks(function (res) {
            def.callback(true);
         }, function (error) {
            $ws.single.ioc.resolve('ILogger').log('SbisServiceSource', error);
            def.errback(error);
         });
         return def;
      },
      /**
       * Возвращает имя объекта бл из сложного идентификатора или имя объекта из источника, для простых идентификаторов
       */
      _getBlObjName: function (id) {
         if (String(id).indexOf(',')) {
            var ido = String(id).split(',');
            return ido[1];
         }
         return this._object;
      },

      _destroy: function (id, blName) {
         var BL = this._BL;
         if(blName && blName !== this._object ) {
            BL = new SbisServiceBLO(blName);
         }
         return BL.call(this._options.destroyMethodName, {'ИдО': id}, $ws.proto.BLObject.RETURN_TYPE_ASIS).addCallbacks(function (res) {
            return res;
         }, function (error) {
            $ws.single.ioc.resolve('ILogger').log('SbisServiceSource', error);
            return error;
         });
      }
   });
});
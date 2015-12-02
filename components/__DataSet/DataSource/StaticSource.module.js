/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.StaticSource', [
   'js!SBIS3.CONTROLS.BaseSource',
   'js!SBIS3.CONTROLS.Record',
   'js!SBIS3.CONTROLS.DataSet',
   'js!SBIS3.CONTROLS.ArrayStrategy'
], function (BaseSource, Record, DataSet, ArrayStrategy) {
   'use strict';

   /**
    * Класс для работы с массивами, как с источником данных.
    * @class SBIS3.CONTROLS.StaticSource
    * @extends SBIS3.CONTROLS.BaseSource
    * @public
    * @author Крайнов Дмитрий Олегович
    */

   return BaseSource.extend(/** @lends SBIS3.CONTROLS.StaticSource.prototype */{
      $protected: {
         /**
          * @var {Array|undefined} Карта данных для быстрого поиска элемента по ключу
          */
         _map: undefined,

         _options: {
            /**
             * @cfg {Array} Исходный массив данных, с которым работает StaticSource
             */
            data: [],

            /**
             * @cfg {String} Название поля, являющегося первичных ключом
             * @example
             * <pre>
             *     <option name="keyField">@Заметка</option>
             * </pre>
             */
            keyField: '',

            /**
             * @cfg {Function|null} Сallback для фильтра массива данных в методе query()
             */
            dataFilterCallback: null
         }
      },

      $constructor: function (cfg) {
         this._options.strategy = cfg.strategy || new ArrayStrategy();
      },

      create: function () {
         return $ws.proto.Deferred.success(new Record({
            strategy: this.getStrategy(),
            keyField: this._options.keyField
         }));
      },

      read: function (id) {
         var data = this._getDataByKey(id);
         if (data) {
            return $ws.proto.Deferred.success(new Record({
               strategy: this.getStrategy(),
               raw: data,
               keyField: this._options.keyField,
               isCreated: true
            }));
         } else {
            return $ws.proto.Deferred.fail('Record is not found');
         }
      },

      update: function (record) {
         if (!record.isCreated() && !record.getKey()) {
            record.set(
               record.getKeyField(),
               $ws.helpers.randomId('k')
            );
         }

         var index = this._getIndexByKey(record.getKey());
         if (index >= 0) {
            this.getStrategy().replaceAt(
               this._options.data,
               index,
               record.getRaw()
            );
         } else {
            this.getStrategy().addRecord(
               this._options.data,
               record
            );
         }
         this._map = undefined;

         if (!record.isCreated()) {
            record.setCreated(true);
         }
         record.setChanged(false);

         return $ws.proto.Deferred.success(true);
      },

      destroy: function (id) {
         if (this._getIndexByKey(id) == -1) {
            return $ws.proto.Deferred.fail('Record is not found');
         } else {
            this.getStrategy().destroy(
               this._options.data,
               this._options.keyField,
               id
            );
            this._map = undefined;

            return $ws.proto.Deferred.success(true);
         }
      },

      /**
       * Возвращает элемент с указанным ключом
       * @param {String} key Значение ключа
       * @returns {Array|undefined}
       */
      _getDataByKey: function (key) {
         return this.getStrategy().at(
            this._options.data,
            this._getIndexByKey(key)
         );
      },

      /**
       * Возвращает индекс элемента с указанным ключом
       * @param {String} key Значение ключа
       * @returns {Integer} -1 - не найден, >=0 - индекс
       */
      _getIndexByKey: function (key) {
         if (this._map === undefined) {
            this._reindex();
         }
         
         return Array.indexOf(this._map, key);
      },

      /**
       * Переиндексирует карту данных
       */
      _reindex: function () {
         this._map = this.getStrategy().rebuild(
            this._options.data,
            this._options.keyField
         );
      },

      /**
       * Метод для получения набора записей из источника данных.
       * Возможно применение фильтрации, сортировки и выбора определённого количества записей с заданной позиции.
       * @param {Object} filter Параметры фильтрации вида - {property1: value, property2: value}.
       * @param {Array} sorting Параметры сортировки вида - [{property1: 'ASC'}, {property2: 'DESC'}].
       * @param {Number} [offset] Смещение начала выборки.
       * @param {Number} [limit] Количество возвращаемых записей.
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения.
       * В колбэке придёт js!SBIS3.CONTROLS.DataSet - набор отобранных элементов.
       */
      query: function (filter, sorting, offset, limit) {
         var data = $ws.core.clone(this._options.data);
         data = this._applyFilter(data, filter);
         data = this._applySorting(data, sorting);
         data = this._applyPaging(data, offset, limit);

         return $ws.proto.Deferred.success(new DataSet({
            strategy: this.getStrategy(),
            data: data,
            meta: this.getStrategy().getMetaData(this._options.data),
            keyField: this._options.keyField
         }));
      },

      /**
       * Устанвливает callback для фильтра массива данных в методе query()
       * @param {Function} handler Callback для фильтра массива данных в методе query()
       */
      setDataFilterCallback: function (handler) {
         this._options.dataFilterCallback = handler;
      },

      /**
       * Применяет фильтр к массиву данных
       * @param {Array} data Массив данных
       * @param {Object} filter Параметры фильтрации вида - {property1: value, property2: value}
       * @returns {Array}
       */
      _applyFilter: function (data, filter) {
         filter = filter || {};
         if (Object.isEmpty(filter)) {
            return data;
         }

         var strategy = this.getStrategy(),
            newData = strategy.getEmptyRawData(),
            index = 0;
         strategy.each(data, function(dataItem) {
            var filterMatch = true;

            for (var filterField in filter) {
               //TODO: пока параметры иерархии передаются в фильтрах делаем так

               if (filter.hasOwnProperty(filterField)) {
                  var filterValue = filter[filterField];
                  if (filterValue == 'С разворотом' || filterValue == 'Узлы и листья' || filterField == 'usePages' || filterField == 'Разворот') {
                     continue;
                  }
                  var dataValue = strategy.value(dataItem, filterField);

                  //Если установлен фильтр-callback - используем его результат, иначе - проверяем полное совпадение значений
                  var callbackResult = this._options.dataFilterCallback ? this._options.dataFilterCallback(filterField, dataValue, filterValue) : undefined;
                  filterMatch = callbackResult === undefined ? dataValue == filterValue : callbackResult;
               }

               if (!filterMatch) {
                  break;
               }
            }

            if (filterMatch) {
               strategy.replaceAt(newData, index, dataItem);
               index++;
            }
         }, this);

         return newData;
      },

      /**
       * Применяет сортировку к массиву данных
       * @param {Array} data Массив данных
       * @param {Array} sorting Параметры сортировки вида - [{property1: 'ASC'}, {property2: 'DESC'}]
       * @returns {Array}
       */
      _applySorting: function (data, sorting) {
         sorting = sorting || [];
         if (!sorting.length) {
            return data;
         }

         //Создаем карту сортировки
         sorting.reverse();
         var sortMap = [],
            sortIndex = 0;
         $ws.helpers.forEach(sorting, function (sortItem) {
            if (!Object.isEmpty(sortItem)) {
               for (var sortField in sortItem) {
                  if (sortItem.hasOwnProperty(sortField)) {
                     sortMap.push({
                        field: sortField,
                        order: sortItem[sortField]
                     });
                  }
               }
            }
         });

         //Создаем индексированый массив данных
         var strategy = this.getStrategy(),
             dataMap = [];
         strategy.each(data, function(dataItem) {
            var dataItemIndexed = {};
            for (sortIndex = 0; sortIndex < sortMap.length; sortIndex++) {
               var sortField = sortMap[sortIndex].field;
               dataItemIndexed[sortField] = strategy.value(dataItem, sortField);
            }
            dataMap.push({
               index: dataItemIndexed,
               item: dataItem
            });
         }, this);

         //Сортируем индексированый массив данных
         var sortItem,
             sortHandler = function (a, b) {
                if (a.index[sortItem.field] > b.index[sortItem.field]) {
                   return sortItem.order == 'DESC' ? -1 : 1;
                } else if (a.index[sortItem.field] < b.index[sortItem.field]) {
                   return sortItem.order == 'DESC' ? 1 : -1;
                }

                return 0;
             };
         for (sortIndex = 0; sortIndex < sortMap.length; sortIndex++) {
            sortItem = sortMap[sortIndex];
            dataMap.sort(sortHandler);
         }

         //Создаем новый массив данных по индексированному
         var newData = strategy.getEmptyRawData();
         for (var index = 0, count = dataMap.length; index < count; index++) {
            strategy.replaceAt(newData, index, dataMap[index].item);
         }

         return newData;
      },

      /**
       * Применяет срез к массиву данных
       * @param {Array} data Массив данных
       * @param {Number} [offset] Смещение начала выборки
       * @param {Number} [limit] Количество записей выборки
       * @returns {Array}
       */
      _applyPaging: function (data, offset, limit) {
         offset = offset || 0;

         if (offset === 0 && limit === undefined) {
            return data;
         }

         if (limit === undefined) {
            limit = this.getStrategy().getCount(data);
         } else {
            limit = limit || 0;
         }

         var strategy = this.getStrategy(),
            newData = strategy.getEmptyRawData(),
            newIndex = 0,
            beginIndex = offset,
            endIndex = Math.min(
               strategy.getCount(data),
               beginIndex + limit
            );
         for (var index = beginIndex; index < endIndex; index++, newIndex++) {
            strategy.replaceAt(newData, newIndex, strategy.at(data, index));
         }

         return newData;
      },
      /**
       * Метод перемещения записи к другому родителю и смены порядковых номеров
       * @param {SBIS3.CONTROLS.Record} record - запись, которую необходимо перенести
       * @param {String} hierField - имя колонки с иерархией
       * @param {Number} parentKey - ключ нового родителя для записи
       * @param {Object} orderDetails - детали смены порядковых номеров. Объект со свойствами after и before: после или перед какой записью нужно вставить перемещаемую. В after и before должны находиться записи
       */
      move: function (record, hierField, parentKey, orderDetails) {
         var strategy = this.getStrategy();
         if (parentKey || parentKey === null) {
            strategy.setParentKey(record, hierField, parentKey);
            return this.update(record);
         }
         if(orderDetails){
            strategy.changeOrder(this._options.data, record, orderDetails);
         } else if(!parentKey && parentKey !== null){
            throw new Error('Не передано достаточно информации для перемещения');
         }
         return new $ws.proto.Deferred().callback(true);
      },

      call: function (command, data) {
         data = data||{};
         switch(command) {
            case 'move':
               var to = data.to,
                  details = data.details ||{};
               if(to) {
                  if(details.after){
                     details['after'] = to.getKey();
                  } else {
                     details['before'] = to.getKey();
                  }
               }
               details['column'] = details.column || this._options.keyField;
               return this.move(data.from, undefined, undefined, details);
         }
      }
   });
});
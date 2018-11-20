/**
 * Created by gersa_000 on 30.10.2016.
 */
define('SBIS3.CONTROLS/History/HistoryList',
   [
      'SBIS3.CONTROLS/History/HistoryController',
      'WS.Data/Collection/IList',
      'WS.Data/Collection/IEnumerable',
      'WS.Data/Collection/RecordSet',
      'WS.Data/Entity/Record',
      'Core/Serializer',
      'Core/helpers/Number/randomId',
      'Core/helpers/Array/isPlainArray',
      'Core/helpers/Object/isPlainObject',
      'Core/helpers/Object/isEqual',
      'Core/IoC',
      'Core/AbstractConfigOld',
      'Core/constants',
      'WS.Data/Format/Format',
      'WS.Data/Format/StringField',
      'WS.Data/Format/RecordField',
      'WS.Data/Adapter/Cow'
   ],

   function(HistoryController, IList, IEnumerable, RecordSet, Record, Serializer, randomId, isPlainArray, isPlainObject, isEqualObject, IoC, AbstractConfigOld, constants) {

      'use strict';

      var MAX_LENGTH = 10;
      var DATA_FIELD = 'data';
      var ID_FIELD = 'id';
      var FORMAT = [ {name: DATA_FIELD, type: 'record'},  {name: ID_FIELD, type: 'string'} ];

      // т.к. запись в ГлобальныеПараметрыКлиента теперь под правами, для записи данных истории отчётов используется другой метод SetFormSettings
      // с особым префиксом
      var GLOBAL_KEY_FIX = '__form_settings-';
      var GLOBAL_CONFIG_FIX = new (AbstractConfigOld.extend({
         _getObjectName: function() {
            return 'ГлобальныеПараметрыКлиента';
         },
         _isConfigSupport: function() {
            return constants.isNodePlatform || constants.globalConfigSupport;
         },

         setParam: function(key, value) {
            if (value === undefined) {
               value = null;
            }

            this._processingParam('update', key, value);
            if (!this._isConfigSupport()) {
               return new Deferred().callback(true);
            }
            var params = {'Key': key};
            params['Value'] = value;
            return this._callMethod('SetFormSettings', params).addCallback(function(res) {
               return res && res.getScalar();
            });
         }
      }))();

      function getEmptyRecordSet() {
         return new RecordSet({format: FORMAT, idProperty: ID_FIELD});
      }

      function prepareItem(item) {
         var model = new Record({ idProperty: ID_FIELD, format: FORMAT }),
             rawData = {};

         rawData[DATA_FIELD] = item;
         rawData[ID_FIELD] = randomId();

         model[item instanceof Record ? 'set' : 'setRawData'](rawData);

         return model;
      }

      /* Скорее всего надо вынести в отдельный модуль и написать тесты */
      function compare(value1, value2) {
         var isEqual = value1 === value2;

         function deepCompare(val1, val2) {
            var eq = false;
            if (val1 instanceof Array) {
               val1.forEach(function(val, key) {
                  eq &= compare(val1[key], val2[key]);
               });
            } else {
               for (var key in val1) {
                  if(val1.hasOwnProperty(key)) {
                     eq &= compare(val1[key], val2[key]);
                  }
               }
            }
            return eq;
         }

         /* cInstance.instanceOfMixin(value, 'WS.Data/Entity/IEquatable') - правильно, но медленно */
         if(!isEqual && value1.isEqual && value2.isEqual) {
            isEqual = value1.isEqual(value2);
         }

         /* cInstance.instanceOfMixin(value1, 'WS.Data/Entity/FormattableMixin') - правильно, но медленно */
         if(!isEqual && value1.getRawData && value2.getRawData) {
            isEqual = isEqualObject(value1.getRawData(), value2.getRawData());
         }

         if(!isEqual &&  isPlainArray(value1) && isPlainArray(value2)) {
            if(value1.length === value2.length) {
               isEqual = isEqualObject(value1, value2);

               if(!isEqual) {
                  isEqual = deepCompare(value1, value2);
               }
            }
         }

         if(!isEqual && isPlainObject(value1) && isPlainObject(value2)) {
            if(Object.keys(value1).length === Object.keys(value2).length) {
               isEqual = isEqualObject(value1, value2);

               if(!isEqual) {
                  isEqual = deepCompare(value1, value2);
               }
            }
         }

         return isEqual;
      }
      
      function checkHistory(self, history) {
         if (!history) {
            if (!self.__isHistoryLoaded()) {
               IoC.resolve('ILogger').log('SBIS3.CONTROLS/History/HistoryList', 'Need load history (HistoryList::getHistory) before use.');
            }
            self.getHistory();
         }
      }

      /**
      * Список - коллекция истории c доступом по индексу. Данные хронятся в определённом формате, всего два поля
      * 1) id - уникальный идентификатор записи в истории
      * 2) data - данные, которые сохраняются в список истории, сохраняются в виде записи WS.Data/Entity/Record
      * @extends Core/Abstract
      * @mixes WS.Data/Collection/IList
      * @mixes WS.Data/Collection/IIndexedCollection
      * @mixesWS.Data/Collection/IEnumerable
      * @public
      * @author Герасимов Александр
      */

      var HistoryList = HistoryController.extend([IList, IEnumerable], {
         $protected: {
            _options: {
               serialize: function (serialize, value) {
                  var serializer = new Serializer(),
                      items = {},
                      toAppend = [],
                      list, id;

                  if (serialize) {
                     list = JSON.stringify(value, serializer.serialize);
                  } else {
                     if (value) {
                        //По ошибке от Лёхи Мальцева в историю могли сохраняться некоррктные _moduleName контролов,
                        //из-за этого при сериализации могли возникать ошибки или же сериализатор некорретно отрабатывал,
                        //такие значения из истории не обрабатываем
                        try {
                           list = JSON.parse(value, serializer.deserialize);
   
                           /* Из-за того, что clone(true) у рекордсета лишь рвёт ссылку,
                              оставляя при этом ссылки на вложенные объекты,
                              то у пользователей могли появляться дубли, надо на это проверять. */
                           if (list) {
                              list.each(function(model) {
                                 id = model.get(ID_FIELD);
      
                                 if (!items.hasOwnProperty(id)) {
                                    items[id] = true;
                                    toAppend.push(model);
                                 }
                              });
   
                              if (toAppend.length) {
                                 list = getEmptyRecordSet();
                                 list.append(toAppend);
                              }
                           }
                        } catch (e) {
                           IoC.resolve('ILogger').error('HistoryList', e.message, e);
                        }
                     }
                     
                     if (!list) {
                        list = getEmptyRecordSet();
                     }
                  }
                  
                  return list;
               },
               emptyValue: getEmptyRecordSet(),
               maxLength: MAX_LENGTH
            }
         },
         
         $constructor: function() {
            if (this._options.isGlobalUserConfig) {
               this._options.historyId = GLOBAL_KEY_FIX + this._options.historyId;
               this._SBISStorage._storage.setParam = function() {
                  return GLOBAL_CONFIG_FIX.setParam.apply(GLOBAL_CONFIG_FIX, arguments);
               };
            }
         },

         //region WS.Data/Collection/IList

         prepend: function (item) {
            if(this._addItemWithMethod('prepend', item)) {
               this.saveHistory();
            }
         },

         append: function(item) {
            checkHistory(this, this._history);
            if(this._addItemWithMethod('append', item)) {
               this.saveHistory();
            }
         },

         assign: function(items) {
            checkHistory(this, this._history);
            this.clear();

            for(var i = 0, len = items.length; i < len; i++) {
               this._addItemWithMethod('append', items[i]);
            }

            this.saveHistory();
         },

         clear: function() {
            checkHistory(this, this._history);
            if(this.getCount()) {
               this._history.clear();
               this.saveHistory();
            }
         },

         remove: function(item) {
            checkHistory(this, this._history);
            var result = this._history.removeAt(this._getIndex(item));

            if(result) {
               this.saveHistory();
            }
            return result;
         },

         removeAt: function(index) {
            checkHistory(this, this._history);
            var history = this._history,
                result;

            if(index < history.getCount()) {
               history.removeAt(index);
               this.saveHistory();
            }
            return result;
         },

         at: function(index) {
            checkHistory(this, this._history);
            return this._history.at(index);
         },

         getIndex: function(item) {
            checkHistory(this, this._history);
            return this._getIndex(item);
         },

         getCount : function() {
            checkHistory(this, this._history);
            return this._history.getCount();
         },

         //endregion WS.Data/Collection/IList

         //region WS.Data/Collection/IEnumerable

         each: function(callback, context) {
            checkHistory(this, this._history);
            this._history.each(callback, context);
         },

         getEnumerator: function() {
            checkHistory(this, this._history);
            return this._history.getEnumerator();
         },

         //endregion WS.Data/Collection/IEnumerable

         //region WS.Data/Collection/IIndexedCollection

         getIndexByValue: function(property, value) {
            checkHistory(this, this._history);
            return this._history.getIndexByValue(property, value);
         },

         getIndicesByValue: function(property, value) {
            checkHistory(this, this._history);
            return this._history.getIndicesByValue(property, value);
         },

         //endregion WS.Data/Collection/IIndexedCollection

         //region Protected methods

         /**
          * Т.к. данные записываются как :
          * data: данные
          * id: randomId
          * то индекс надо искать именно по data, поэтому нужна своя реализация метода getIndex.
          * @private
          */
         _getIndex: function(item) {
            item = prepareItem(item);

            var data = item.get(DATA_FIELD),
                index = -1;

            this.each(function(rec, i) {
               if(index === -1 && compare(rec.get(DATA_FIELD), data)) {
                  index = i;
               }
            });

            return index;
         },

         /**
          * Особая логика сохранение данных в историю:
          * 1) Не больше 10
          * 2) При добавлении одинаковых записей они всплывают вверх по стэку
          * @private
          */
         _addItemWithMethod: function(method, item) {
            var historyList = this._history,
                index = this._getIndex(item),
                changed = false;

            item = prepareItem(item);

            if(index !== -1 && index !== 0) {
               historyList.prepend([item]);
               historyList.removeAt(index + 1);
               changed = true;
            }

            if(index === -1) {
               if (historyList.getCount() >= this._options.maxLength) {
                  historyList.removeAt(this._options.maxLength - 1);
               }
               historyList[method]([item]);
               changed = true;
            }

            return changed;
         }

         //endregion Protected methods
      });

      return HistoryList;

   });

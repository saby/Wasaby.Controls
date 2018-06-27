/**
 * Created by am.gerasimov on 23.01.2017.
 */
define('SBIS3.CONTROLS/Filter/HistoryBase', [
   'Core/helpers/Object/isEqual',
   'Core/helpers/Object/find',
   'SBIS3.CONTROLS/CompoundControl',
   'SBIS3.CONTROLS/History/HistoryListUtils',
   'Core/CommandDispatcher',
   'Core/ParallelDeferred',
   'SBIS3.CONTROLS/Filter/HistoryController/FilterHistoryControllerUntil',
   'SBIS3.CONTROLS/History/HistoryList',
   'SBIS3.CONTROLS/Utils/InformationPopupManager',
   'SBIS3.CONTROLS/Filter/HistoryView'
], function(
   isEqualObject,
   find,
   CompoundControl,
   HistoryListUtils,
   CommandDispatcher,
   ParallelDeferred,
   FilterHistoryControllerUntil
) {

      'use strict';

      var FILTER_STATUS = {
         'FOR_ME': 0,
         'FOR_ALL': 1
      };

      var _private =  {
         favoriteSortMethod: function(item1, item2) {
            var isGlobal1 = item1.item.getContents().get('globalParams'),
               isGlobal2 = item2.item.getContents().get('globalParams');

            if((isGlobal1 && isGlobal2) || (!isGlobal1 && !isGlobal2)) {
               return 0;
            } else if(isGlobal1) {
               return 1;
            } else if(isGlobal2) {
               return -1;
            }
         }
      };

      var HistoryBase = CompoundControl.extend({
         $protected: {
            _options: {
               _favoriteSortMethod: _private.favoriteSortMethod,
               _filterProperty: 'viewFilter',
               _structureProperty: 'filter',
               _filterItemTextProperty: 'caption',
               _favoriteAction: {
                  command: 'favorite',
                  name: 'favorite',
                  icon: 'icon-24 icon-Unfavourite icon-disabled action-hover',
                  isMainAction: true
               },
               _unFavoriteAction: {
                  command: 'unfavorite',
                  name: 'unfavorite',
                  icon: 'icon-24 icon-Favourite icon-disabled action-hover',
                  isMainAction: true
               },
               idProperty: 'internalValueField',
               displayProperty: 'linkText',

               historyId: ''
            },
            _favoriteView: null,
            _historyView: null
         },

         $constructor: function() {
            var self = this;
            var listsDef = new ParallelDeferred();
            var favoriteList = this._getHistoryList(true);
            var favoriteAllList = this._getHistoryList(true, true);
            var historyList = this._getHistoryList();
   
            listsDef.push(favoriteList.getHistory(true));
            listsDef.push(favoriteAllList.getHistory(true));
            listsDef.push(historyList.getHistory(true));
   
            listsDef.done();
            
            this._publish('onItemActivate');

            function deleteReportHistory(id, isFavorite, isGlobal) {
               var index = -1,
                  list;

               if(isGlobal) {
                  list = favoriteAllList;
               } else if(isFavorite) {
                  list = favoriteList;
               } else {
                  list = historyList;
               }

               list.each(function(item, idx) {
                  if(id === item.get('id')) {
                     index = idx;
                  }
               });

               if(index !== -1) {
                  list.removeAt(index);
               }
               return true;
            }

            function addReportHistory(item, isFavorite) {
               var action = this.getChildControlByName('editFavorite'),
                  self = this,
                  toEditItem = item.get('data').clone(),
                  isGlobal = !!toEditItem.get('globalParams'),
                  filterStructure = self._options.filterStructure;

               //В старом формате в параметре globalParams хранился Boolean, в новом формате хранится значение 1 или 0.
               //Для обратной совместимости, перегоняем значения из старого формата в новыый.
               if (typeof toEditItem.get('globalParams') === 'boolean') {
                  toEditItem.set('globalParams', isGlobal ? FILTER_STATUS.FOR_ALL : FILTER_STATUS.FOR_ME);
               }

               /* Подготавливаем запись к редктированию */
               toEditItem.set('toSaveFields', {});
               toEditItem.set('editedTextValue', '');
               
               if (filterStructure) {
                  toEditItem.set('filter', FilterHistoryControllerUntil.prepareStructureToApply(toEditItem.get('filter'), filterStructure));
               }

               action.execute({
                  item: toEditItem,
                  componentOptions: {
                     editMode: isFavorite,
                     textValue: toEditItem.get(self._options.displayProperty),
                     handlers: {
                        onDestroyModel: function() {
                           deleteReportHistory(item.get('id'), isFavorite, isGlobal);
                           action.closeDialog();
                        },
                        onBeforeUpdateModel: function (event, record) {
                           var toSaveFields = record.get('toSaveFields'),
                              filter = record.get(self._options._filterProperty),
                              globalParams = record.get('globalParams'),
                              editedTextValue = record.get('editedTextValue'),//Текст, который хочет сохранить пользователь
                              textValue = record.get(self._options.displayProperty),//Оригинальный текст
                              editableFieldsCount = record.get(self._options._structureProperty).reduce(function(result, elem) {
                                 return isEqualObject(elem.value, elem.resetValue) ? result : ++result;
                              }, 0),
                              reportItem, filterItems;
   
                           /* Не сохраняем запись, если нет параметров для сохранения */
                           if(editableFieldsCount <= Object.keys(toSaveFields).length) {
                              record.acceptChanges(); // Чтобы formController не запустил обновление записи
                              return;
                           }

                           /* Сбрасываем поля, которые не надо сохранять после редактирования */
                           if(!Object.isEmpty(toSaveFields)) {
                              filterItems = record.get(self._options._structureProperty);
                              Object.keys(toSaveFields).forEach(function(key) {
                                 if(!toSaveFields[key]) {
                                    reportItem = find(filterItems, function(obj) {
                                       return obj[self._options.idProperty] === key;
                                    });

                                    if(reportItem) {
                                       // Если отменили сохранение фильтра, то из сформированной по фильтрам строки, надо вырезать подстроку,
                                       // которая отвечала за отображение этого фильтра
                                       textValue.replace(reportItem[self._options._filterItemTextProperty], function(replacementString, index, fullString) {
                                          var startIndex = index;
                                          var endIndex = index + replacementString.length;
                                          //Если подстрока находится в конце или в середине, то надо не забыть вырезать пробел и запятую
                                          if (index !== 0 && index + replacementString.length <= fullString.length) {
                                             startIndex -= 2;
                                          }
                                          //Если подстрока находится вначале, то тоже надо вырезать запятую и пробел
                                          if (index === 0 && replacementString.length !== fullString.length) {
                                             endIndex += 2;
                                          }
                                          textValue = fullString.slice(0, startIndex) + fullString.slice(endIndex, fullString.length);
                                       });
                                       reportItem.value = reportItem.resetValue;
                                       reportItem.caption = reportItem.hasOwnProperty('resetCaption') ? reportItem.resetCaption : '';
                                       reportItem[self._options._filterItemTextProperty] = '';
                                       delete filter[key];
                                    }
                                 }
                              });
                              /* Сделаем set полей, чтобы они попали в "сырые" данные */
                              record.set(self._options._structureProperty, filterItems);
                              record.set(self._options._filterProperty, filter);
                           }
                           textValue = String.trim(textValue);
                           /* Затираем ненужные для сохранения поля */
                           record.has('toSaveFields') && record.removeField('toSaveFields');
                           record.has('editedTextValue') && record.removeField('editedTextValue');
                           /* Если пользователь что-то ввёл, то сохраняем это как текст */
                           record.set(self._options.displayProperty, editedTextValue ? editedTextValue : textValue);
                           if(editedTextValue && editedTextValue !== textValue) {
                              record.set('fullTextValue', textValue);
                           }
                           if (filterStructure) {
                              record.set('filter', FilterHistoryControllerUntil.minimizeStructureToSave(record.get('filter')));
                           }

                           var recordRawData = record.getRawData();
                           self.sendCommand('historySave', recordRawData);
                           record.setRawData(recordRawData);
                           record.acceptChanges();
                           deleteReportHistory(item.get('id'), isFavorite, isGlobal);
                           (globalParams ? favoriteAllList : favoriteList).prepend(record);
                        }
                     }
                  },
                  dialogOptions: { resizable : false }
               });

               return true;
            }

            /* Комманды на добавление в историю / список избранных */
            CommandDispatcher.declareCommand(this, 'favorite', function(item) {
               addReportHistory.call(self, item.record, false);
            });
            CommandDispatcher.declareCommand(this, 'unfavorite', function(item) {
               addReportHistory.call(self, item.record, true);
            });

            this.once('onInit', function() {
               self._favoriteView = this.getChildControlByName('ReportFavoriteView');
               self._historyView = this.getChildControlByName('ReportHistoryView');


               /* Добавление записей "Для всех" в список, т.к. они хранятся отдельно */
               this.subscribeTo(favoriteAllList, 'onHistoryUpdate', function(event, history) {
                  var favoriteViewItems = self._favoriteView.getItems();

                  if(favoriteViewItems) {
                     favoriteViewItems.assign(favoriteList.getHistory().clone());
                  } else {
                     self._favoriteView.setItems(favoriteList.getHistory().clone());
                  }
                  self._favoriteView.getItems().prepend(history.clone());
                  checkItems(self._favoriteView);
               });

               function checkItems(view) {
                  var viewBlock = view.getContainer().parent();
                  viewBlock.toggleClass('ws-hidden', !view.getItems() || !view.getItems().getCount());
               }
   
               listsDef.getResult().addCallback(function(res) {
                  self.subscribeTo(self._favoriteView, 'onItemsReady', function() {
                     self._favoriteView.getItems().prepend(favoriteAllList.getHistory().clone());
                     checkItems(self._favoriteView);
                  });
   
                  /* записей может не быть, пока грузится история */
                  if (self._favoriteView.getItems()) {
                     self._favoriteView.getItems().prepend(favoriteAllList.getHistory().clone());
                  }
   
                  self.processViews(function(view) {
                     self.subscribeTo(view, 'onItemActivate', function(event, itemObj) {
                        self._notify('onItemActivate', itemObj, this === self._favoriteView, itemObj.item.get('data').get('globalParams'));
                     });
                  });
   
                  self.processViews(function(view) {
                     self.subscribeTo(view, 'onItemsReady', function() {
                        checkItems(view);
                     });
                  });
   
                  self.processViews(checkItems);
                  return res;
               });
            });

            this.once('onDestroy', function() {
               historyList.destroy();
               favoriteList.destroy();
               favoriteAllList.destroy();
            });
         },

         processViews: function(callback) {
            callback(this._favoriteView);
            callback(this._historyView);
         },

         _getHistoryList: function(isFavorite, isGlobal) {
            return HistoryListUtils.getHistoryList(this._options.historyId, isFavorite, isGlobal);
         },

         hasHistory: function() {
            var hasHistory = false;

            this.processViews(function(view) {
               hasHistory |= view.getItems() && view.getItems().getCount();
            });

            return !!hasHistory;
         },

         destroy: function () {
            this._favoriteView = undefined;
            this._historyView = undefined;
            HistoryBase.superclass.destroy.apply(this, arguments);
         }
      });

      HistoryBase.getHistoryList = HistoryListUtils.getHistoryList;

      return HistoryBase;

   });

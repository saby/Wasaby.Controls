/**
 * Created by am.gerasimov on 23.01.2017.
 */
define('SBIS3.CONTROLS/Filter/ReportHistory',
   [
      'SBIS3.CONTROLS/CompoundControl',
      'tmpl!SBIS3.CONTROLS/Filter/ReportHistory/ReportHistory',
      'tmpl!SBIS3.CONTROLS/Filter/ReportHistory/favoriteItemTpl',
      'SBIS3.CONTROLS/History/HistoryList',
      'Core/CommandDispatcher',
      'SBIS3.CONTROLS/Utils/InformationPopupManager',
      'Core/helpers/collection-helpers',
      'SBIS3.CONTROLS/Filter/HistoryView',
      'css!SBIS3.CONTROLS/Filter/ReportHistory/ReportHistory'
   ],

   function(CompoundControl, template, favoriteItemTpl, HistoryList, CommandDispatcher, InformationPopupManager, colHelpers) {

      'use strict';

      var _private =  {
         itemActionHandler: function(container, id, item) {
            var self = this;

            if(this.getName() === 'ReportFavoriteView') {
               InformationPopupManager.showConfirmDialog({
                  message: 'Удалить шаблон из избранного?',
                  opener: self
               }, function positiveCallback() {
                  self.sendCommand('deleteReportHistory', id, true, item.get('data').get('globalParams'));
               });
            } else {
               this.sendCommand('addReportHistory', item);
            }
         },

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
         },

         getHistoryList: function(id, isFavorite, isGlobal) {
            if(isFavorite && !isGlobal) {
               id += '-favorite';
            }
            return new HistoryList({
               historyId: id,
               isGlobalUserConfig: !!isGlobal
            });
         }
      };

      var ReportHistory = CompoundControl.extend({
         _dotTplFn: template,
         $protected: {
            _options: {
               _favoriteItemTpl: favoriteItemTpl,
               _itemActionHandler: _private.itemActionHandler,
               _favoriteSortMethod: _private.favoriteSortMethod,

               historyId: ''
            },
            _favoriteView: null,
            _historyView: null
         },

         $constructor: function() {
            var self = this,
                favoriteList = this._getHistoryList(true),
                favoriteAllList = this._getHistoryList(true, true),
                historyList = this._getHistoryList();

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
            
            function addReportHistory(item) {
               var action = this.getChildControlByName('editFavorite'),
                   self = this,
                   toEditItem = item.get('data').clone();
   
               /* Подготавливаем запись к редктированию */
               toEditItem.set('toSaveFields', {});
               toEditItem.set('editedTextValue', '');
   
               action.execute({
                  item: toEditItem,
                  componentOptions: {
                     textValue: toEditItem.get('textValue'),
                     handlers: {
                        onBeforeUpdateModel: function (event, record) {
                           var toSaveFields = record.get('toSaveFields'),
                              filter = record.get('filter'),
                              globalParams = record.get('globalParams'),
                              editedTextValue = record.get('editedTextValue'),//Текст, который хочет сохранить пользователь
                              textValue = record.get('textValue'),//Оригинальный текст
                              editableFieldsCount = record.get('filterPanelItems').reduce(function(result, elem) {
                                 return colHelpers.isEqualObject(elem.value, elem.resetValue) ? result : ++result;
                              }, 0),
                              reportItem, filterPanelItems;
               
                           /* Не сохраняем запись, если нет параметров для сохранения */
                           if(editableFieldsCount <= Object.keys(toSaveFields).length) {
                              record.acceptChanges(); // Чтобы formController не запустил обновление записи
                              return;
                           }
               
                           /* Сбрасываем поля, которые не надо сохранять после редактирования */
                           if(!Object.isEmpty(toSaveFields)) {
                              filterPanelItems = record.get('filterPanelItems');
                              colHelpers.forEach(toSaveFields, function(value, key) {
                                 if(!value) {
                                    reportItem = colHelpers.find(filterPanelItems, function(obj) {
                                       return obj.id === key;
                                    });
                        
                                    if(reportItem) {
                                       reportItem.value = reportItem.resetValue;
                                       textValue = textValue.replace(new RegExp('\s?' + reportItem.textValue + ',?\s?'), '');
                                       textValue = textValue.replace(/ {1,}/g, ' ');
                                       reportItem.textValue = '';
                                       delete filter[key];
                                    }
                                 }
                              });
                              /* Сделаем set полей, чтобы они попали в "сырые" данные */
                              record.set('filterPanelItems', filterPanelItems);
                              record.set('filter', filter);
                           }
                           textValue = String.trim(textValue);
                           /* Затираем ненужные для сохранения поля */
                           record.has('toSaveFields') && record.removeField('toSaveFields');
                           record.has('editedTextValue') && record.removeField('editedTextValue');
                           /* Если пользователь что-то ввёл, то сохраняем это как текст */
                           record.set('textValue', editedTextValue ? editedTextValue : textValue);
                           if(editedTextValue && editedTextValue !== textValue) {
                              record.set('fullTextValue', textValue);
                           }
                           record.acceptChanges();
                           self.sendCommand('deleteReportHistory', item.get('id'));
                           (globalParams ? favoriteAllList : favoriteList).prepend(record);
                        }
                     }
                  },
                  dialogOptions: { resizable : false }
               });
   
               return true;
            }

            /* Комманды на добавление в историю / список избранных */
            CommandDispatcher.declareCommand(this, 'deleteReportHistory', deleteReportHistory);
            CommandDispatcher.declareCommand(this, 'addReportHistory', addReportHistory);

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

               this.subscribeTo(self._favoriteView, 'onItemsReady', function() {
                  self._favoriteView.getItems().prepend(favoriteAllList.getHistory().clone());
                  checkItems(self._favoriteView);
               });

               self._favoriteView.getItems().prepend(favoriteAllList.getHistory().clone());

               function checkItems(view) {
                  var viewBlock = view.getContainer().parent();
                  viewBlock.toggleClass('ws-hidden', !view.getItems().getCount());
               }

               this.processViews(function(view) {
                  self.subscribeTo(view, 'onItemActivate', function(event, itemObj) {
                     self._notify('onItemActivate', itemObj, this === self._favoriteView, itemObj.item.get('data').get('globalParams'));
                  });
               });

               this.processViews(function(view) {
                  self.subscribeTo(view, 'onItemsReady', function() {
                     checkItems(view);
                  });
               });

               this.processViews(checkItems);
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
            return _private.getHistoryList(this._options.historyId, isFavorite, isGlobal);
         },

         _addReportHistory: function(item) {
            var action = this.getChildControlByName('editFavorite'),
                self = this,
                toEditItem = item.get('data').clone();

            /* Подготавливаем запись к редктированию */
            toEditItem.set('toSaveFields', {});
            toEditItem.set('editedTextValue', '');

            action.execute({
               item: toEditItem,
               componentOptions: {
                  textValue: toEditItem.get('textValue'),
                  handlers: {
                     onBeforeUpdateModel: function (event, record) {
                        var toSaveFields = record.get('toSaveFields'),
                            filter = record.get('filter'),
                            globalParams = record.get('globalParams'),
                            editedTextValue = record.get('editedTextValue'),//Текст, который хочет сохранить пользователь
                            textValue = record.get('textValue'),//Оригинальный текст
                            editableFieldsCount = record.get('filterPanelItems').reduce(function(result, elem) {
                               return colHelpers.isEqualObject(elem.value, elem.resetValue) ? result : ++result;
                            }, 0),
                            reportItem;

                        /* Не сохраняем запись, если нет параметров для сохранения */
                        if(editableFieldsCount <= Object.keys(toSaveFields).length) {
                           record.acceptChanges(); // Чтобы formController не запустил обновление записи
                           return;
                        }

                        /* Сбрасываем поля, которые не надо сохранять после редактирования */
                        if(!Object.isEmpty(toSaveFields)) {
                           colHelpers.forEach(toSaveFields, function(value, key) {
                              if(!value) {
                                 reportItem = colHelpers.find(record.get('filterPanelItems'), function(obj) {
                                    return obj.id === key;
                                 });

                                 if(reportItem) {
                                    reportItem.value = reportItem.resetValue;
                                    textValue = textValue.replace(new RegExp('\s?' + reportItem.textValue + ',?\s?'), '');
                                    textValue = textValue.replace(/ {1,}/g, ' ');
                                    reportItem.textValue = '';
                                    delete filter[key];
                                 }
                              }
                           });
                        }
                        textValue = String.trim(textValue);
                        /* Затираем ненужные для сохранения поля */
                        record.has('toSaveFields') && record.removeField('toSaveFields');
                        record.has('editedTextValue') && record.removeField('editedTextValue');
                        /* Если пользователь что-то ввёл, то сохраняем это как текст */
                        record.set('textValue', editedTextValue ? editedTextValue : textValue);
                        if(editedTextValue && editedTextValue !== textValue) {
                           record.set('fullTextValue', textValue);
                        }
                        record.acceptChanges();
                        self.sendCommand('deleteReportHistory', item.get('id'));
                        self._getHistoryList(true, globalParams).prepend(record);
                     }
                  }
               },
               dialogOptions: { resizable : false }
            });

            return true;
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
            ReportHistory.superclass.destroy.apply(this, arguments);
         }
      });

      ReportHistory.getHistoryList = function(historyId, favorite, global) {
         return  _private.getHistoryList(historyId, favorite, global);
      };

      return ReportHistory;

   });
/**
 * Created by as.avramenko on 24.01.2017.
 */

define('js!SBIS3.CONTROLS.ColumnsEditorArea',
   [
      'js!SBIS3.CONTROLS.CompoundControl',
      'js!SBIS3.CONTROLS.ColumnsEditorModel',
      'js!SBIS3.CONTROLS.ItemsMoveController',
      'Core/CommandDispatcher',
      'WS.Data/Functor/Compute',
      'WS.Data/Collection/RecordSet',
      'tmpl!SBIS3.CONTROLS.ColumnsEditorArea',
      'tmpl!SBIS3.CONTROLS.ColumnsEditorArea/resources/preferences',
      'tmpl!SBIS3.CONTROLS.ColumnsEditorArea/resources/preferencesEdit',
      'tmpl!SBIS3.CONTROLS.ColumnsEditorArea/resources/selectableGroupContent',
      'tmpl!SBIS3.CONTROLS.ColumnsEditorArea/resources/selectableItemContent',
      'css!SBIS3.CONTROLS.ColumnsEditorArea',
      'js!SBIS3.CONTROLS.Button',
      'js!SBIS3.CONTROLS.ListView',
      'js!SBIS3.CONTROLS.CheckBoxGroup',
      'js!SBIS3.CONTROLS.ScrollContainer'
   ],

   function (CompoundControl, ColumnsEditorModel, ItemsMoveController, CommandDispatcher, ComputeFunctor, RecordSet, dotTplFn) {
      'use strict';

      /**
       * Класс контрола "Редактор колонок".
       *
       * @author Авраменко Алексей Сергеевич
       * @class SBIS3.CONTROLS.ColumnsEditorArea
       * @public
       * @extends SBIS3.CONTROLS.CompoundControl
       */
      var ColumnsEditorArea = CompoundControl.extend(/** @lends SBIS3.CONTROLS.ColumnsEditorArea.prototype */ {
         _dotTplFn: dotTplFn,
         $protected: {
            _options: {
               columns: undefined,
               selectedColumns: [],
               moveColumns: true,
               title: ''
            },
            _preferencesView: undefined,
            _fixedView: undefined,
            _selectableView: undefined
         },

         _modifyOptions: function () {
            var cfg = ColumnsEditorArea.superclass._modifyOptions.apply(this, arguments);
            cfg._optsPreferences = {
               items: new RecordSet({
                  rawData: [{
                     id: 1,
                     title: 'Тестовый шаблон',
                     info: {prop1:'Свойство 1', prop2:'Свойство 2', prop3:'Свойство 3'}
                  }],
                  idProperty: 'id'
               }),
               itemsActions: _makeItemsActions(),
               onItemClick: null,
               onSelectedItemsChange: null
            };
            var prepared = _prepareItems(cfg.columns, cfg.selectedColumns, cfg.moveColumns);
            cfg._optsFixed = prepared.fixed;
            cfg._optsSelectable = prepared.selectable;
            cfg._optsSelectable.onItemClick = _onItemClick;
            if (!cfg.moveColumns) {
               // Добавляем автосортировку отмеченных элементов - они должны отображаться перед неотмеченными
               cfg._optsSelectable.itemsSortMethod = _getItemsSortMethod();
               cfg._optsSelectable.onSelectedItemsChange = _onSelectedItemsChange;
            }
            return cfg;
         },

         $constructor: function () {
            CommandDispatcher.declareCommand(this, 'applyColumns', this._commandApplyColumns);
            this._publish('onSelectedColumnsChange');
         },

         init: function () {
            ColumnsEditorArea.superclass.init.apply(this, arguments);
            this._preferencesView = this.getChildControlByName('controls-ColumnsEditorArea__Preferences');
            this._fixedView = this.getChildControlByName('controls-ColumnsEditorArea__FixedList');
            this._selectableView = this.getChildControlByName('controls-ColumnsEditorArea__SelectableList');

            //this._preferencesView.setItemsHover(false);
            //this.subscribeTo(this._preferencesView, 'onChangeHoveredItem', this._preferencesView.setItemsHover.bind(this._preferencesView, false));

            this.subscribeTo(this._preferencesView, 'onAfterBeginEdit', this._preferencesView.setItemsActions.bind(this._preferencesView, []));
            this.subscribeTo(this._preferencesView, 'onEndEdit', function (evtName, model, withSaving) {
            });
            this.subscribeTo(this._preferencesView, 'onAfterEndEdit', function (evtName, model, $target, withSaving) {
               this._preferencesView.setItemsActions(_makeItemsActions());
            }.bind(this));

            // В опциях могут быть указаны группы, которые нужно свернуть при открытии
            var groupCollapsing = this._options.groupCollapsing;
            if (groupCollapsing) {
               for (var group in groupCollapsing) {
                  if (groupCollapsing[group]) {
                     this._selectableView.collapseGroup(group);
                  }
               }
            }
            if (this._options.moveColumns) {
               this._itemsMoveController = new ItemsMoveController({
                  linkedView: this._selectableView
               });
            }
         },

         _commandApplyColumns: function () {
            var
               list = this._selectableView,
               selectedColumns = [].concat(list.getSelectedKeys()),
               items = list.getItems();
            // Сортируем выделенные записи согласно их положению в рекордсете
            selectedColumns.sort(function (el1, el2) {
               return items.getIndex(items.getRecordById(el1)) - items.getIndex(items.getRecordById(el2));
            });
            this._options.selectedColumns = selectedColumns;
            this._notifyOnPropertyChanged('selectedColumns');
            this._notify('onSelectedColumnsChange', selectedColumns);
         },

         destroy: function () {
            if (this._itemsMoveController) {
               this._itemsMoveController.destroy();
            }
            ColumnsEditorArea.superclass.destroy.apply(this, arguments);
         }
      });



      // Private methods:

      var _prepareItems = function (columns, selectedColumns, moveColumns) {
         var
            preparingItems = [],
            fixed = {
               items: [],
               markedKeys: []
            },
            selectable = {
               items: [],
               markedKeys: []
            };
         columns.each(function (column) {
            var columnId = column.getId();
            var colData = column.getRawData();
            if (column.get('fixed')) {
               fixed.items.push(colData);
               fixed.markedKeys.push(columnId);
            }
            else {
               if (moveColumns) {
                  selectable.items.push(colData)
               }
               else {
                  // При отключенном перемещении необходимо сформировать рекордсет с собственной моделью.
                  // Подготавливаем для него исходные данные.
                  preparingItems.push(colData);
               }
               if (selectedColumns.indexOf(columnId) !== -1) {
                  selectable.markedKeys.push(columnId);
               }
            }
         });
         if (moveColumns) {
            // При включенном перемещении сортируем записи, согласно переданному состоянию массива отмеченных записей
            selectable.items.sort(function (el1, el2) {
               var
                  idx1 = selectedColumns.indexOf(el1.id),
                  idx2 = selectedColumns.indexOf(el2.id);
               if (idx1 !== -1) {
                  return idx2 !== -1 ? idx1 - idx2 : -1;
               }
               return idx2 !== -1 ? 1 : -1;
            });
         }
         else {
            // При отключенном перемещении будем использовать рекордсет с собственной моделью
            // для осуществления автосортировки отмеченных записей
            selectable.items = new RecordSet({
               rawData: preparingItems,
               idProperty: 'id',
               model: ColumnsEditorModel
            });
            _applySelectedToItems(selectable.markedKeys, selectable.items);
         }
         return {fixed:fixed, selectable:selectable};
      };

      var _makeItemsActions = function () {
         return [
            {name:'edit', title:rk('Редактировать'), icon:'sprite:icon-16 icon-Edit icon-primary action-hover'},
            {name:'clone', title:rk('Дублировать'), icon:'sprite:icon-16 icon-Copy icon-primary action-hover'},
            {name:'delete', title:rk('Удалить'), icon:'sprite:icon-16 icon-Erase icon-error'}
         ].map(function (inf) {
            return {
               name: inf.name,
               icon: inf.icon,
               caption: inf.title,
               tooltip: inf.title,
               isMainAction: true,
               onActivated: function ($item, itemId, itemModel, action) {
               }
            };
         });
      };

      var _applySelectedToItems = function (selectedArray, items) {
         selectedArray.forEach(function (id) {
            items.getRecordById(id).set('selected', true);
         });
      };

      var _getItemsSortMethod = function () {
         return new ComputeFunctor(function (el1, el2) {
            // Смещаем отмеченные элементы в начало списка (учитывая их начальный index)
            if (el1.collectionItem.get('selected')) {
               if (el2.collectionItem.get('selected')) {
                  return el1.index - el2.index;
               }
               return -1;
            }
            if (el2.collectionItem.get('selected')) {
               return 1;
            }
            return el1.index - el2.index;
         }, ['selected']);
      };



      // ListView event handlers:

      var _onItemClick = function (e, id) {
         this.toggleItemsSelection([id]);
      };

      var _onSelectedItemsChange = function (e, ids, changes) {
         var items = this.getItems();
         changes.added.forEach(function (id) {
            items.getRecordById(id).set('selected', true);
         });
         changes.removed.forEach(function (id) {
            items.getRecordById(id).set('selected', false);
         });
      };



      return ColumnsEditorArea;
   }
);

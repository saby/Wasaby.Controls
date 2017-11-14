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
               title: '',
               applyButtonTitle: rk('Применить'),
               columns: undefined,
               selectedColumns: [],
               moveColumns: true,
               groupField: ''
            },
            _fixedView: undefined,
            _selectableView: undefined
         },

         _modifyOptions: function () {
            var cfg = ColumnsEditorArea.superclass._modifyOptions.apply(this, arguments);
            _prepareChildItemsAndGroups(cfg);
            _prepareGroupCollapsing(cfg);
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
            this._publish('onComplete'/*^^^'onSelectedColumnsChange'*/);
         },

         init: function () {
            ColumnsEditorArea.superclass.init.apply(this, arguments);
            this._fixedView = this.getChildControlByName('controls-ColumnsEditorArea__FixedList');
            this._selectableView = this.getChildControlByName('controls-ColumnsEditorArea__SelectableList');

            // В опциях могут быть указаны группы, которые нужно распахнуть при открытии
            _applyGroupCollapsing(this);
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
            //^^^this._options.selectedColumns = selectedColumns;
            //^^^this._notifyOnPropertyChanged('selectedColumns');
            this._notify('onComplete'/*^^^'onSelectedColumnsChange'*/, selectedColumns, _collectExpandedGroups(this));
         },

         destroy: function () {
            if (this._itemsMoveController) {
               this._itemsMoveController.destroy();
            }
            ColumnsEditorArea.superclass.destroy.apply(this, arguments);
         }
      });



      // Private methods:

      var _uniqueConcat = function (list1, list2) {
         return list1 && list1.length ? (list2 && list2.length ? list1.concat(list2).reduce(function (r, v) { if (r.indexOf(v) === -1) { r.push(v); }; return r; }, []) : list1) : (list2 && list2.length ? list2 : []);
      };

      var _getSelectedColumns = function (cfg) {
         return cfg.selectedColumns;
      };

      var _prepareChildItemsAndGroups = function (cfg) {
         var
            groupField = cfg.groupField,
            columns = cfg.columns,
            selectedColumns = _getSelectedColumns(cfg),
            moveColumns = cfg.moveColumns;
         var
            preparingItems = [],
            fixed = {
               items: [],
               markedKeys: []
            },
            selectable = {
               items: [],
               markedKeys: []
            },
            groups = [];
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
               var group = column.get(groupField);
               if (groups.indexOf(group) === -1) {
                  groups.push(group);
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
         groups.sort();
         cfg._optsFixed = fixed;
         cfg._optsSelectable = selectable;
         cfg._groups = groups;
      };

      var _prepareGroupCollapsing = function (cfg) {
         var groups = cfg._groups;
         if (groups && groups.length) {
            var expandedGroups = cfg.expandedGroups;
            var groupCollapsing = {};
            var has = !!expandedGroups.length;
            for (var i = 0; i < groups.length; i++) {
               var g = groups[i];
               groupCollapsing[g] = has ? expandedGroups.indexOf(g) === -1 : i !== 0;
            }
            cfg._groupCollapsing = groupCollapsing;
         }
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

      var _applyGroupCollapsing = function (self) {
         var groupCollapsing = self._options._groupCollapsing;
         if (groupCollapsing) {
            for (var group in groupCollapsing) {
               self._selectableView[groupCollapsing[group] ? 'collapseGroup' : 'expandGroup'](group);
            }
         }
      };

      var _collectExpandedGroups = function (self) {
         var groups = self._options._groups;
         if (groups && groups.length) {
            var expandedGroups = [];
            var list = self._selectableView;
            for (var i = 0; i < groups.length; i++) {
               var g = groups[i];
               // В текущей реализации в SBIS3.CONTROLS.ItemsControlMixin нет публичного метода, позволяющего узнать состояние
               // распахнутости/свёрнутости групп, поэтому так. Но хорошо бы там расширить API !
               if (!list._isGroupCollapsed(g)) {
                  expandedGroups.push(g);
               }
            }
            return expandedGroups;
         }
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

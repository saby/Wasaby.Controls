/**
 * Created by as.avramenko on 24.01.2017.
 */

define('js!SBIS3.CONTROLS.ColumnsEditorArea',
   [
      'js!SBIS3.CONTROLS.CompoundControl',
      'js!SBIS3.CONTROLS.ColumnsEditorUtils',
      'Core/CommandDispatcher',
      'js!SBIS3.CONTROLS.ItemsMoveController',
      'WS.Data/Collection/RecordSet',
      'tmpl!SBIS3.CONTROLS.ColumnsEditorArea',
      'tmpl!SBIS3.CONTROLS.ColumnsEditorArea/resources/itemContentTpl',
      'js!SBIS3.CONTROLS.Button',
      'js!SBIS3.CONTROLS.ListView',
      'js!SBIS3.CONTROLS.CheckBoxGroup',
      'css!SBIS3.CONTROLS.ColumnsEditorArea',
      'tmpl!SBIS3.CONTROLS.ColumnsEditorArea/resources/groupTpl',
      'js!SBIS3.CONTROLS.ScrollContainer'
    ],

   function (CompoundControl, ColumnsEditorUtils, CommandDispatcher, ItemsMoveController, RecordSet, dotTplFn, ItemContentTpl) {
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
               //^^^_itemContentTpl: ItemContentTpl,
               moveColumns: true,
               columns: undefined,
               selectedColumns: [],
               title: ''
            },
            _fixedView: undefined,
            _selectableView: undefined
         },

         _modifyOptions: function () {
            var
               cfg = ColumnsEditorArea.superclass._modifyOptions.apply(this, arguments);
            cfg._preparedItems = this._prepareItems(cfg.columns, cfg.selectedColumns, cfg.moveColumns);
            cfg._onItemClick = this._onItemClick;
            if (!cfg.moveColumns) {
               // Добавляем автосортировку отмеченных элементов - они должны отображаться перед неотмеченными
               cfg._itemsSortMethod = ColumnsEditorUtils.getSortMethod();
               cfg._onSelectedItemsChange = this._onSelectedItemsChange;
            }
            return cfg;
         },

         $constructor: function () {
            CommandDispatcher.declareCommand(this, 'applyColumns', this._applyColumns);
            this._publish('onSelectedColumnsChange');
         },

         init: function () {
            ColumnsEditorArea.superclass.init.apply(this, arguments);
            this._fixedView = this.getChildControlByName('controls-ColumnsEditorArea__FixedView');
            this._selectableView = this.getChildControlByName('controls-ColumnsEditorArea__SelectableView');
            if (this._options.moveColumns) {
               this._itemsMoveController = new ItemsMoveController({
                  linkedView: this._selectableView
               });
            }
         },

         _prepareItems: function (columns, selectedColumns, moveColumns) {
            var
               columnId/*^^^*/,
               preparingItems = [],
               result = {
                  fixedItems: [],
                  fixedMarkedKeys: [],
                  selectableItems: [],
                  selectableMarkedKeys: []
               };
            columns.each(function (column) {
               //////////////////////////////////////////////////
               column.set('group', 'Группа: ' + Math.ceil(3*Math.random()));//^^^
               //////////////////////////////////////////////////
               columnId = column.getId();
               if (column.get('fixed')) {
                  result.fixedItems.push(column.getRawData());
                  result.fixedMarkedKeys.push(columnId);
               } else {
                  if (moveColumns) {
                     result.selectableItems.push(column.getRawData())
                  } else {
                     // При отключенном перемещении необходимо сформировать рекордсет с собственной моделью.
                     // Подготавливаем для него исходные данные.
                     preparingItems.push(column.getRawData());
                  }
                  if (selectedColumns.indexOf(columnId) !== -1) {
                     result.selectableMarkedKeys.push(columnId);
                  }
               }
            });
            if (moveColumns) {
               // При включенном перемещении сортируем записи, согласно переданному состоянию массива отмеченных записей
               result.selectableItems.sort(function (el1, el2) {
                  var
                     idx1 = selectedColumns.indexOf(el1.id),
                     idx2 = selectedColumns.indexOf(el2.id);
                  if (idx1 !== -1) {
                     return idx2 !== -1 ? idx1 - idx2 : -1;
                  }
                  return idx2 !== -1 ? 1 : -1;
               });
            } else {
               // При отключенном перемещении будем использовать рекордсет с собственной моделью
               // для осуществления автосортировки отмеченных записей
               result.selectableItems = new RecordSet({
                  rawData: preparingItems,
                  idProperty: 'id',
                  model: ColumnsEditorUtils.getSelectableViewModel()
               });
               ColumnsEditorUtils.applySelectedToItems(result.selectableMarkedKeys, result.selectableItems);
            }
            return result;
         },

         _onItemClick: function (e, id) {
            this.toggleItemsSelection([id]);
         },

         _onSelectedItemsChange: function (e, ids, changes) {
            var
               items = this.getItems();
            changes.added.forEach(function (id) {
               items.getRecordById(id).set('selected', true);
            });
            changes.removed.forEach(function (id) {
               items.getRecordById(id).set('selected', false);
            });
         },

         _applyColumns: function () {
            var
               selectedColumns = [].concat(this._selectableView.getSelectedKeys()),
               items = this._selectableView.getItems();
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

      return ColumnsEditorArea;
   }
);

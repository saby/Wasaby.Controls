/**
 * Created by as.avramenko on 24.01.2017.
 */

define('js!SBIS3.CONTROLS.ColumnsEditorArea', [
   'js!SBIS3.CONTROLS.CompoundControl',
   'js!Core/CommandDispatcher',
   'Core/helpers/collection-helpers',
   'js!SBIS3.CONTROLS.ItemsMoveController',
   'tmpl!SBIS3.CONTROLS.ColumnsEditorArea',
   'tmpl!SBIS3.CONTROLS.ColumnsEditorArea/resources/ItemContentTpl',
   'js!SBIS3.CONTROLS.Button',
   'js!SBIS3.CONTROLS.ListView',
   'js!SBIS3.CONTROLS.CheckBoxGroup' ], 
   function(CompoundControl, CommandDispatcher, cHelpers, ItemsMoveController, dotTplFn, ItemContentTpl) {
   
      'use strict';
      /**
       * Класс контрола "Редактор колонок".
       *
       * @author Авраменко Алексей Сергеевич
       * @class SBIS3.CONTROLS.ColumnsEditorArea
       * @public
       * @extends SBIS3.CONTROLS.CompoundControl
       */
      var
         ColumnsEditorArea = CompoundControl.extend(/** @lends SBIS3.CONTROLS.ColumnsEditorArea.prototype */ {
            _dotTplFn: dotTplFn,
            $protected: {
               _options: {
                  _fixedItems: [],
                  _fixedMarkedKeys: [],
                  _selectableItems: [],
                  _selectableMarkedKeys: [],
                  _itemContentTpl: ItemContentTpl,
                  columns: undefined,
                  selectedColumns: [],
                  title: ''
               },
               _fixedView: undefined,
               _selectableView: undefined
            },
            _modifyOptions: function() {
               var
                  cfg = ColumnsEditorArea.superclass._modifyOptions.apply(this, arguments);
               cfg._preparedItems = this._prepareItems(cfg.columns, cfg.selectedColumns);
               cfg._onItemClick = this._onItemClick;
               return cfg;
            },
            $constructor: function() {
               CommandDispatcher.declareCommand(this, 'applyColumns', this._applyColumns);
               this._publish('onSelectedColumnsChange');
            },
            init: function() {
               ColumnsEditorArea.superclass.init.apply(this, arguments);
               this._fixedView = this.getChildControlByName('controls-ColumnsEditorArea__FixedView');
               this._selectableView = this.getChildControlByName('controls-ColumnsEditorArea__SelectableView');
               this._itemsMoveController = new ItemsMoveController({
                  linkedView: this._selectableView
               });
            },
            _prepareItems: function(columns, selectedColumns) {
               var
                  isFixed,
                  column,
                  result = {
                     fixedItems: [],
                     fixedMarkedKeys: [],
                     selectableItems: [],
                     selectableMarkedKeys: []
                  };
               selectedColumns = selectedColumns || [];
               cHelpers.forEach(selectedColumns, function(colId) {
                  column = columns.getRecordById(colId);
                  if (!column.get('fixed')) {
                     result.selectableItems.push(column.getRawData());
                     result.selectableMarkedKeys.push(colId);
                  }
               });
               columns.each(function(item) {
                  isFixed = item.get('fixed');
                  if (isFixed) {
                     result.fixedItems.push(item.getRawData());
                     result.fixedMarkedKeys.push(item.getId());
                  } else if (Array.indexOf(selectedColumns, item.getId()) === -1) {
                     result.selectableItems.push(item.getRawData());
                  }
               });
               return result;
            },
            _onItemClick: function(e, id) {
               this.toggleItemsSelection([id]);
            },
            _applyColumns: function() {
               var
                  selectedColumns = [].concat(this._selectableView.getSelectedKeys());
               this._options.selectedColumns = selectedColumns;
               this._notifyOnPropertyChanged('selectedColumns');
               this._notify('onSelectedColumnsChange', selectedColumns);
            }
      });

   return ColumnsEditorArea;

});

/**
 * Created by as.avramenko on 24.01.2017.
 */

define('js!SBIS3.CONTROLS.ColumnsEditor',
   [
      'js!SBIS3.CONTROLS.CompoundControl',
      'Core/CommandDispatcher',
      'js!SBIS3.CONTROLS.PickerMixin',
      'tmpl!SBIS3.CONTROLS.ColumnsEditor',
      'js!SBIS3.CONTROLS.IconButton',
      'js!SBIS3.CONTROLS.ColumnsEditorArea',
      'css!SBIS3.CONTROLS.ColumnsEditor'
   ],

   function (CompoundControl, CommandDispatcher, PickerMixin, dotTplFn) {
      'use strict';

      /**
       * Класс контрола "Редактор колонок".
       *
       * @author Авраменко Алексей Сергеевич
       * @class SBIS3.CONTROLS.ColumnsEditor
       * @public
       * @extends SBIS3.CONTROLS.CompoundControl
       *
       * @mixes SBIS3.CONTROLS.PickerMixin
       */
      var ColumnsEditor = CompoundControl.extend([PickerMixin],/** @lends SBIS3.CONTROLS.ColumnsEditor.prototype */ {
         _dotTplFn: dotTplFn,
         $protected: {
            _options: {
               title: 'Отображение колонок',
               moveColumns: true
            }
         },

         $constructor: function () {
            CommandDispatcher.declareCommand(this, 'showEditorArea', this._showColumnsEditor);
            this._publish('onSelectedColumnsChange', 'onColumnsEditorShow');
         },

         init: function () {
            ColumnsEditor.superclass.init.apply(this, arguments);
         },

         _showColumnsEditor: function () {
            this._columnsEditorConfig = this._notify('onColumnsEditorShow');
            this.showPicker();
         },

         _setPickerConfig: function () {
            var self = this;
            var cfg = this._columnsEditorConfig;
            //////////////////////////////////////////////////
            if (cfg.columns && cfg.columns.getCount()) {
               cfg.columns.each(function (column) {
                  column.set('group', 'Группа: ' + Math.ceil(3*Math.random()));//^^^
               });
            }
            cfg.groupCollapsing = {/*^^^*/'Группа: 2':true};
            //////////////////////////////////////////////////
            return {
               corner: 'tr',
               horizontalAlign: {
                  side: 'right'
               },
               verticalAlign: {
                  side: 'top'
               },
               template: 'js!SBIS3.CONTROLS.ColumnsEditorArea',
               closeByExternalClick: true,
               closeButton: true,
               parent: this,
               target: this.getContainer(),
               cssClassName: 'controls-ColumnsEditorArea-picker',
               componentOptions: {
                  columns: cfg.columns,
                  selectedColumns: cfg.selectedColumns,
                  groupCollapsing: cfg.groupCollapsing,
                  title: this._options.title,
                  moveColumns: this._options.moveColumns,
                  handlers: {
                     onSelectedColumnsChange: function (event, selectedColumns) {
                        self._notify('onSelectedColumnsChange', selectedColumns);
                        self._picker.hide();
                     }
                  }
               },
               handlers: {
                  onClose: function () {
                     // Разрушаем панель при закрытии
                     if (self._picker) {
                        self._picker.destroy();
                        self._picker = null;
                     }
                  }
               }
            };
         }
      });

      return ColumnsEditor;
   }
);

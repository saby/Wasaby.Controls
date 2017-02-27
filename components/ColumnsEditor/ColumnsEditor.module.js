/**
 * Created by as.avramenko on 24.01.2017.
 */

define('js!SBIS3.CONTROLS.ColumnsEditor', [
   'js!SBIS3.CONTROLS.CompoundControl',
   'Core/CommandDispatcher',
   'js!SBIS3.CONTROLS.PickerMixin',
   'tmpl!SBIS3.CONTROLS.ColumnsEditor',
   'js!SBIS3.CONTROLS.IconButton',
   'js!SBIS3.CONTROLS.ColumnsEditorArea',
   'css!SBIS3.CONTROLS.ColumnsEditor'],
   function(CompoundControl, CommandDispatcher, PickerMixin, dotTplFn) {
   
      'use strict';
      /**
       * Класс контрола "Редактор колонок".
       *
       * @author Авраменко Алексей Сергеевич
       * @class SBIS3.CONTROLS.ColumnsEditor
       * @public
       * @extends SBIS3.CONTROLS.CompoundControl
       */
      var
         ColumnsEditor = CompoundControl.extend([PickerMixin],/** @lends SBIS3.CONTROLS.ColumnsEditor.prototype */ {
            _dotTplFn: dotTplFn,
            $protected: {
               _options: {
                  title: 'Отображение колонок'
               }
            },
            $constructor: function() {
               CommandDispatcher.declareCommand(this, 'showEditorArea', this._showColumnsEditor);
               this._publish('onSelectedColumnsChange', 'onColumnsEditorShow');
            },
            init: function() {
               ColumnsEditor.superclass.init.apply(this, arguments);
            },
            _showColumnsEditor: function() {
               this._columnsEditorConfig = this._notify('onColumnsEditorShow');
               this.showPicker();
            },
            _setPickerConfig: function() {
               var
                  self = this;
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
                  className: 'controls-ColumnsEditorArea-picker',
                  componentOptions: {
                     columns: this._columnsEditorConfig.columns,
                     selectedColumns: this._columnsEditorConfig.selectedColumns,
                     title: this._options.title,
                     handlers: {
                        onSelectedColumnsChange: function(event, selectedColumns) {
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

});

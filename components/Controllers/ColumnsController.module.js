/**
 * Created by as.avramenko on 24.01.2017.
 */

define('js!SBIS3.CONTROLS.ColumnsController', ['Core/Abstract', 'Core/helpers/collection-helpers'], function(cAbstract, cHelpers) {
   'use strict';
   /**
    * Класс контроллера редакторования колонок.
    *
    * @author Авраменко Алексей Сергеевич
    * @class SBIS3.CONTROLS.ColumnsController
    * @public
    * @extends Core/Abstract
    */
   var
      ColumnsController = cAbstract.extend(/** @lends SBIS3.CONTROLS.ColumnsController.prototype */ {
         $protected: {
            _options: {
            },
            _state: null
         },
         getColumns: function(columns) {
            var
               column,
               newColumns = [];
            columns.each(function(column) {
               if (column.get('fixed')) {
                  newColumns.push(column.get('columnConfig'))
               }
            });
            cHelpers.forEach(this._state, function (colId) {
               column = columns.getRecordById(colId);
               if (!column.get('fixed')) {
                  newColumns.push(column.get('columnConfig'));
               }
            });
            return newColumns;
         },
         getState: function() {
            return this._state;
         },
         setState: function(state) {
            this._state = state;
         }
      });

   return ColumnsController;

});

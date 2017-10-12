/**
 * Created by as.avramenko on 06.07.2017.
 */

define('js!SBIS3.CONTROLS.ColumnsEditorUtils', ['WS.Data/Entity/Model', 'WS.Data/Functor/Compute'], function(Model, ComputeFunctor) {
   
   'use strict';

   var
      SelectableViewModel = Model.extend({
         _isSelected: false,
         $protected: {
            _options: {
               properties: {
                  selected: {
                     get: function() {
                        return this._isSelected;
                     },
                     set: function(value) {
                        this._isSelected = value;
                        this._notifyChange({
                           selected: value
                        });
                     }
                  }
               }
            }
         }
      });

   return {
      getSortMethod: function() {
         return new ComputeFunctor(function(el1, el2) {
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
      },
      getSelectableViewModel: function() {
         return SelectableViewModel;
      },
      applySelectedToItems: function(selectedArray, items) {
         selectedArray.forEach(function(id) {
            items.getRecordById(id).set('selected', true);
         });
      }
   }
});

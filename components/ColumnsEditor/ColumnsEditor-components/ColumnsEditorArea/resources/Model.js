/**
 * Created by as.avramenko on 06.07.2017.
 */

define('js!SBIS3.CONTROLS.ColumnsEditorModel',
   [
      'WS.Data/Entity/Model'
   ],
   function (Model) {
      'use strict';

       return Model.extend({
         _isSelected: false,
         $protected: {
            _options: {
               properties: {
                  selected: {
                     get: function () {
                        return this._isSelected;
                     },
                     set: function (value) {
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
   }
);

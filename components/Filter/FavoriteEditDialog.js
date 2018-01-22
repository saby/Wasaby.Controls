/**
 * Created by am.gerasimov on 30.01.2017.
 */
/**
 * Created by am.gerasimov on 23.01.2017.
 */
define('js!SBIS3.CONTROLS/Filter/FavoriteEditDialog',
   [
      'SBIS3.CONTROLS/FormController',
      'tmpl!SBIS3.CONTROLS/Filter/FavoriteEditDialog/FavoriteEditDialog',
      'Core/helpers/Object/isEqual',
      'css!SBIS3.CONTROLS/Filter/FavoriteEditDialog/FavoriteEditDialog',
      'SBIS3.CONTROLS/TextBox',
      'SBIS3.CONTROLS/CheckBox'
   ],

   function(FormController, template, isEqual) {

      'use strict';

      var FavoriteEditDialog = FormController.extend({
         _dotTplFn: template,
         $protected: {
            _options: {
               _isEqual: isEqual,
               width: '400px'
            }
         },

         $constructor: function() {
            var window = this.getParent();
            window._options.resizable = false;
         },
         
         _modifyOptions: function() {
            var options = FavoriteEditDialog.superclass._modifyOptions.apply(this, arguments);
   
            options.record.get('filterPanelItems').forEach(function(item) {
               if (!isEqual(item.value, item.resetValue) && item.textValue) {
                  options._hasEditableItems = true;
               }
            });
            
            return options;
         }
      });

      return FavoriteEditDialog;

   });
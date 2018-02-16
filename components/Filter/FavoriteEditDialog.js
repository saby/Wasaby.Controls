/**
 * Created by am.gerasimov on 30.01.2017.
 */
/**
 * Created by am.gerasimov on 23.01.2017.
 */
define('SBIS3.CONTROLS/Filter/FavoriteEditDialog',
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
               width: '400px'
            }
         },

         $constructor: function() {
            var window = this.getParent();
            window._options.resizable = false;
         },
         
         _modifyOptions: function() {
            var
               items = [],
               options = FavoriteEditDialog.superclass._modifyOptions.apply(this, arguments),
               filterPanelItems = options.record.get('filterPanelItems'),
               filter = options.record.get('filter');

            if (filterPanelItems) {
               //Набираем содержимое диалога по новыому формату фильтра
               filterPanelItems.forEach(function (item) {
                  if (!isEqual(item.value, item.resetValue) && item.textValue) {
                     items.push({
                        id: item.id,
                        checkBoxCaption: item.caption,
                        value: item.textValue
                     });
                  }
               });
            } else if (filter) {
               //Набираем содержимое диалога по старому формату фильтра
               filter.forEach(function (item) {
                  if (!isEqual(item.value, item.resetValue) && item.caption) {
                     items.push({
                        id: item.internalValueField,
                        checkBoxCaption: item.title,
                        value: item.caption
                     });
                  }
               });
            }

            options._items = items;
            return options;
         }
      });

      return FavoriteEditDialog;

   });
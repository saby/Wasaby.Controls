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
      'SBIS3.CONTROLS/Utils/InformationPopupManager',
      'tmpl!SBIS3.CONTROLS/Filter/FavoriteEditDialog/itemTpl',
      'css!SBIS3.CONTROLS/Filter/FavoriteEditDialog/FavoriteEditDialog',
      'SBIS3.CONTROLS/TextBox',
      'SBIS3.CONTROLS/CheckBox',
      'SBIS3.CONTROLS/DropdownList'
   ],

   function(FormController, template, isEqual, InformationPopupManager) {

      'use strict';

      var normalizeItems = function(filterItems, idField, captionField, textValueField) {
         var items = [];
         filterItems.forEach(function (item) {
            if (!isEqual(item.value, item.resetValue) && item[textValueField] && item.editable !== false) {
               items.push({
                  id: item[idField],
                  checkBoxCaption: item[captionField],
                  value: item[textValueField]
               });
            }
         });
         return items;
      };
      
      var hasFieldsToSave = function(self, record) {
         var toSaveFields = record.get('toSaveFields');
         /* Не даём сохранить запись, если нет параметров для сохранения */
         return self._options._items.length > Object.keys(toSaveFields).length;
      };

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
         
         init: function() {
            FavoriteEditDialog.superclass.init.call(this);
            
            var self = this;
            var record = this.getRecord();
            this.subscribeTo(record, 'onPropertyChange', function() {
               self.getChildControlByName('saveButton').setEnabled(hasFieldsToSave(self, record));
            });
         },
   
         _confirmDialogHandler: function(result) {
            var fcMethod = FavoriteEditDialog.superclass._confirmDialogHandler;
            
            if (result) {
               if (hasFieldsToSave(this, this.getRecord())) {
                  fcMethod.call(this, result);
               } else {
                  InformationPopupManager.showMessageDialog({
                     message: 'Нельзя сохранить в историю запись без фильтров',
                     opener: this,
                     status: 'error'
                  });
               }
            } else {
               fcMethod.call(this, result);
            }
         },
         
         _modifyOptions: function() {
            var
               items = [],
               options = FavoriteEditDialog.superclass._modifyOptions.apply(this, arguments),
               filterPanelItems = options.record.get('filterPanelItems'),
               filter = options.record.get('filter');

            if (filterPanelItems) {
               //Набираем содержимое диалога по новыому формату фильтра
               items = normalizeItems(filterPanelItems, 'id', 'caption', 'textValue');
            } else if (filter) {
               //Набираем содержимое диалога по старому формату фильтра
               items = normalizeItems(filter, 'internalValueField', 'title', 'caption');
            }

            options._items = items;
            return options;
         }
      });

      return FavoriteEditDialog;

   });
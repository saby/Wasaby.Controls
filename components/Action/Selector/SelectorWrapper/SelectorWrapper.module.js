/* global define */
define('js!SBIS3.CONTROLS.SelectorWrapper', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.SelectorWrapper',
   'Core/helpers/collection-helpers',
   'Core/helpers/functional-helpers'
], function (CompoundControl, dotTplFn, collectionHelpers, functionalHelpers) {


   /**
    * Интерфейс открывателя диалога/всплывающей панели
    * @mixin SBIS3.CONTROLS.IDialogOpener
    * @public
    * @author Крайнов Дмитрий
    */

   var SelectorWrapper = CompoundControl.extend([], {
      _dotTplFn: dotTplFn,
      $protected: {
         _options : {
            /**
             * @cfg {String} Устанавливает контент внтутри компонента выбора
             */
            content: '',
            /**
             * @cfg {String} Имя связного представления данных
             */
            linkedObjectName: '',
            /**
             * @cfg {String} Фильтр выбранных записей
             */
            selectedFilter: functionalHelpers.constant(true)
         }

      },
      $constructor: function() {
         var self = this;

         this.once('onInit', function() {
            var childControl = this.getChildControlByName(this._options.linkedObjectName);

            this.subscribeTo(childControl, 'onSelectedItemsChange', function(event, array, diff) {
               var result = _private.getDefaultSelectionResult();

               function onSelectionChanged() {
                  var selectedItems = childControl.getSelectedItems(),
                      keyField = childControl.getProperty('keyField');

                  if(diff.added.length) {
                     collectionHelpers.forEach(diff.added, function(addedKey) {
                        result.added.push(selectedItems.at(selectedItems.getIndexByValue(keyField, addedKey)));
                     });
                  }

                  if(diff.removed.length) {
                     result.removed = diff.removed;
                  }

                  self.sendCommand('selectorWrapperSelectionChanged', result, keyField);
               }

               if(this.getItems()) {
                  onSelectionChanged();
               } else {
                  this.once('onItemsReady', function() {
                     this._setSelectedItems();
                     onSelectionChanged();
                  })
               }

            });

            this.subscribeTo(childControl, 'onItemActivate', function(e, meta) {
               if(!this.getMultiselect() || this._isEmptySelection()) {
                  var result = _private.getDefaultSelectionResult();
                  result.added.push(meta.item);
                  self.sendCommand('selectorWrapperSelectionChanged', result);
                  self.sendCommand('selectComplete');
               }
            });

            this.sendCommand('selectorWrapperInitialized', this);
         });
      },

      setSelectedItems: function(items) {
         var self = this,
             keys = [];

         items.each(function(rec) {
            if(self._options.selectedFilter(rec)) {
               keys.push(rec.getId());
            }
         });

         if(keys.length) {
            this.getChildControlByName(this._options.linkedObjectName).setSelectedKeys(keys);
         }
      }
   });

   var _private = {
      getDefaultSelectionResult: function() {
         return {
            added: [],
            removed: []
         }
      }
   };

   return SelectorWrapper;
});

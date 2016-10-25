/* global define */
define('js!SBIS3.CONTROLS.SelectorWrapper', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.SelectorWrapper',
   'Core/helpers/collection-helpers',
   'Core/helpers/functional-helpers',
   'Core/core-instance'
], function (CompoundControl, dotTplFn, collectionHelpers, functionalHelpers, cInstance) {


   /**
    * Интерфейс открывателя диалога/всплывающей панели
    * @extend SBIS3.CORE.CompoundControl
    * @public
    * @author Крайнов Дмитрий
    */

   var SELECTION_TYPE_CLASSES = {
      leaf: 'controls-ListView__hideCheckBoxes-node',
      node: 'controls-ListView__hideCheckBoxes-leaf',
      all: ''
   };

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
            var childControl = this._getLinkedObject();

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
               /* Если в качестве списка лежит иерархия (дерево),
                  то выбираемые записи надо проверять на выбираемость в зависимости от опции selectionType. */
               if(cInstance.instanceOfMixin(childControl, 'SBIS3.CONTROLS.TreeMixin')) {
                  var isBranch = meta.item.get(childControl.getProperty('hierField') + '@');

                  if (isBranch && _private.selectionType === 'node' || !isBranch && _private.selectionType === 'leaf') {
                     return;
                  }
               }

               if(childControl.getMultiselect() && !childControl._isEmptySelection()) {
                  childControl.addItemsSelection([meta.id]);
                  return;
               }

               var result = _private.getDefaultSelectionResult();
               result.added.push(meta.item);
               self.sendCommand('selectorWrapperSelectionChanged', result);
               self.sendCommand('selectComplete');
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
            this._getLinkedObject().setSelectedKeys(keys);
         }
      },

      setMultiselect: function(multiselect) {
         this._getLinkedObject().setMultiselect(multiselect);
      },

      setSelectionType: function(selectionType) {
         _private.selectionType = selectionType;
         this._getLinkedObject().getContainer().addClass(SELECTION_TYPE_CLASSES[selectionType]);
      },

      _getLinkedObject: function() {
         return this.getChildControlByName(this._options.linkedObjectName);
      }
   });

   var _private = {
      getDefaultSelectionResult: function() {
         return {
            added: [],
            removed: []
         }
      },
      selectionType: 'all'
   };

   return SelectorWrapper;
});

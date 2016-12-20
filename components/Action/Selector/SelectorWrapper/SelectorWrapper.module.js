/* global define */
define('js!SBIS3.CONTROLS.SelectorWrapper', [
   'js!SBIS3.CORE.CompoundControl',
   'js!SBIS3.CONTROLS.Utils.TemplateUtil',
   'html!SBIS3.CONTROLS.SelectorWrapper',
   'Core/helpers/collection-helpers',
   'Core/helpers/functional-helpers',
   'Core/core-instance'
], function (CompoundControl, TemplateUtil, dotTplFn, collectionHelpers, functionalHelpers, cInstance) {


   /**
    * Интерфейс открывателя диалога/всплывающей панели
    * @class SBIS3.CONTROLS.SelectorWrapper
    * @extends SBIS3.CORE.CompoundControl
    * @author Крайнов Дмитрий
    * @public
    * @control
    *
    * @demo SBIS3.CONTROLS.Demo.SelectorActionButton Пример 1. Окно выбора из справочника с использованием кнопок Button и Link.
    * @demo SBIS3.CONTROLS.Demo.SelectorFieldLink Пример 2. Окно выбора из справочника с использованием поля связи.
    */

   var SELECTION_TYPE_CLASSES = {
      leaf: 'controls-ListView__hideCheckBoxes-node',
      node: 'controls-ListView__hideCheckBoxes-leaf',
      all: ''
   };

   var SelectorWrapper = CompoundControl.extend([], /** @lends SBIS3.CONTROLS.SelectorWrapper.prototype */ {
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
                      keyField = childControl.getProperty('keyField'),
                      index;

                  if(diff.added.length) {
                     collectionHelpers.forEach(diff.added, function(addedKey) {
                        /* Записи с выделенным ключём может не быть в recordSet'e
                           (например это запись внутри папки или на другой странице) */
                        index = selectedItems.getIndexByValue(keyField, addedKey);

                        if(index !== -1) {
                           result.added.push(selectedItems.at(index));
                        }
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
               /* Если в качестве списка для выбора записей используется дерево,
                  то при обработке выбранной записи надо проверять папка это, или лист.
                  Если опция selectionType установлена как 'node' (выбор только папок), то обработку листьев производить не надо.
                  Если опция selectionType установлена как 'leaf' (только листьев), то обработку папок производить не надо. */
               if(cInstance.instanceOfMixin(childControl, 'SBIS3.CONTROLS.TreeMixin')) {
                  var isBranch = meta.item.get(childControl.getNodeProperty());

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

      _modifyOptions: function() {
         var options = SelectorWrapper.superclass._modifyOptions.apply(this, arguments);
         options.content = TemplateUtil.prepareTemplate(options.content);
         return options;
      },

      setSelectedItems: function(items) {
         var self = this,
             keys = [],
             linkedObject = this._getLinkedObject(),
             keyField = linkedObject.getProperty('keyField');

         items.each(function(rec) {
            if(self._options.selectedFilter(rec)) {
               keys.push(rec.get(keyField));
            }
         });

         if(keys.length) {
            linkedObject.setSelectedKeys(keys);
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

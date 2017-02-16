/* global define */
define('js!SBIS3.CONTROLS.SelectorWrapper', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.SelectorWrapper',
   'js!SBIS3.CONTROLS.Utils.TemplateUtil',
   'Core/helpers/collection-helpers',
   'Core/helpers/functional-helpers',
   'Core/core-instance'
], function (CompoundControl, dotTplFn, TemplateUtil, collectionHelpers, functionalHelpers, cInstance) {


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

   var SELECT_ACTION_NAME = 'controls.select';

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
            selectedFilter: functionalHelpers.constant(true),
            selectionType: 'all'

         },
         _linkedObject: null
      },
      $constructor: function() {
         this.once('onInit', function() {
            var linkedObject = this._getLinkedObject();

            this.subscribeTo(linkedObject, 'onSelectedItemsChange', this._onSelectedItemsChangeHandler.bind(this))
                .subscribeTo(linkedObject, 'onItemActivate', this._onItemActivatedHandler.bind(this))
                .subscribeTo(linkedObject, 'onItemClick', this._onItemClickHandler.bind(this));

            /* Обработка кнопки "Выбрать" для иерархических представлений */
            if(cInstance.instanceOfMixin(linkedObject, 'SBIS3.CONTROLS.TreeMixin')) {
               this.subscribeTo(linkedObject, 'onChangeHoveredItem', this._onChangeHoveredItemHandler.bind(this))
                   .subscribeTo(linkedObject, 'onPropertyChanged', this._onPropertyChangedHandler.bind(this));
            }

            this.sendCommand('selectorWrapperInitialized', this);
         });
      },

      _modifyOptions: function() {
         var opts = SelectorWrapper.superclass._modifyOptions.apply(this, arguments);
         opts.content = TemplateUtil.prepareTemplate(opts.content);
         return opts;
      },

      /**
       * Обработчик изменения выделения в связном объекте
       * @param event
       * @param array
       * @param diff
       * @private
       */
      _onSelectedItemsChangeHandler: function(event, array, diff) {
         var result = _private.getDefaultSelectionResult(),
             linkedObject = this._getLinkedObject(),
             self = this;

         function onSelectionChanged() {
            var selectedItems = linkedObject.getSelectedItems(),
                idProperty = linkedObject.getProperty('idProperty'),
                hoveredItem = linkedObject.getHoveredItem(),
                index;

            if(hoveredItem.container) {
               this._processSelectActionVisibility(hoveredItem);
            }

            if(diff.added.length) {
               collectionHelpers.forEach(diff.added, function(addedKey) {
                  /* Записи с выделенным ключём может не быть в recordSet'e
                   (например это запись внутри папки или на другой странице) */
                  index = selectedItems.getIndexByValue(idProperty, addedKey);

                  if(index !== -1) {
                     result.added.push(selectedItems.at(index));
                  }
               });
            }

            if(diff.removed.length) {
               result.removed = diff.removed;
            }

            self.sendCommand('selectorWrapperSelectionChanged', result, idProperty);
         }

         if(linkedObject.getItems()) {
            onSelectionChanged();
         } else {
            linkedObject.once('onItemsReady', function() {
               this._setSelectedItems();
               onSelectionChanged.call(self);
            })
         }
      },

      /**
       * Обработчик активации записи
       * @private
       */
      _onItemActivatedHandler: function(e, meta) {
         var linkedObject = this._getLinkedObject();

         if(!this._checkItemForSelect(meta.item)) {
            return
         }

         if(linkedObject.getMultiselect() && !linkedObject._isEmptySelection()) {
            linkedObject.addItemsSelection([meta.id]);
            return;
         }

         this._applyItemSelect(meta.item);
      },

      /**
       * Обработчик клика по записи
       * @private
       */
      _onItemClickHandler: function(event, id, item, target) {
         var linkedObject = this._getLinkedObject();

         /* Если клик произошёл по стрелке разворота папки или запись выбрать нельзя,
            то не обрабатываем это событие */
         if($(target).hasClass('js-controls-TreeView__expand') || !this._checkItemForSelect(item)) {
            return;
         }

         /* При единичном выборе, клик по записи должен её выбирать, даже если это папка */
         if(!linkedObject.getMultiselect() && cInstance.instanceOfMixin(linkedObject, 'SBIS3.CONTROLS.TreeMixin') && this._isBranch(item)) {
             event.setResult(false);
             this._applyItemSelect(item);
         }
      },

      /**
       * Обрабатывает выбор записи
       * @param item
       * @private
       */
      _applyItemSelect: function(item) {
         var result = _private.getDefaultSelectionResult();

         result.added.push(item);
         this.sendCommand('selectorWrapperSelectionChanged', result);
         this.sendCommand('selectComplete');
      },

      _onChangeHoveredItemHandler: function(event, hoveredItem) {
         /* Чтобы проинициализировать кнопку "Выбрать", если её нет */
         this._initSelectAction();
         this._processSelectActionVisibility(hoveredItem);
      },

      _processSelectActionVisibility: function(hoveredItem) {
         var linkedObject = this._getLinkedObject(),
             selectAction = linkedObject.getItemsActions().getItemsInstances()[SELECT_ACTION_NAME];

         /* Показываем по стандарту кнопку "Выбрать" у папок при множественном выборе или при поиске у крошек в единичном выборе */
         if(hoveredItem.container) {
            if (this._isBranch(hoveredItem.record) && this.getSelectionType() !== 'leaf') {
               if (!linkedObject.getSelectedKeys().length && (linkedObject.getMultiselect() || linkedObject._isSearchMode())) {
                  selectAction.show();
               } else {
                  selectAction.hide()
               }
            } else {
               selectAction.hide();
            }
         }
      },

      _onPropertyChangedHandler: function(e, propName) {
         if(propName === 'itemsActions') {
            this._initSelectAction();
         }
      },

      _initSelectAction: function() {
         var linkedObject = this._getLinkedObject(),
             itemsActions = linkedObject.getItemsActions(),
             self = this,
             itemsActionsArray;

         /* Добавляем кнопку "Выбрать", если её нет в itemsActions */
         if(!itemsActions || !itemsActions.getItems().getRecordById(SELECT_ACTION_NAME)) {
            itemsActionsArray = itemsActions ? itemsActions.getItems().getRawData() : [];

            itemsActionsArray.push({
               caption: 'Выбрать',
               name: SELECT_ACTION_NAME,
               isMainAction: true,
               allowChangeEnable: false,
               onActivated: function(container, key, item) {
                  self._onItemActivatedHandler(null, {
                     item: item,
                     id: key
                  })
               }
            });
            linkedObject.setItemsActions(itemsActionsArray);
         }
      },

      /**
       * Проверяет запись на выбираемость
       * @param item
       * @returns {boolean}
       * @private
       */
      _checkItemForSelect: function(item) {
         /* Если в качестве списка для выбора записей используется дерево,
            то при обработке выбранной записи надо проверять папка это, или лист.
            Если опция selectionType установлена как 'node' (выбор только папок), то обработку листьев производить не надо.
            Если опция selectionType установлена как 'leaf' (только листьев), то обработку папок производить не надо. */
         if(cInstance.instanceOfMixin(this._getLinkedObject(), 'SBIS3.CONTROLS.TreeMixin')) {
            var isBranch = this._isBranch(item);

            if (!isBranch && this.getSelectionType() === 'node' || isBranch && this.getSelectionType() === 'leaf') {
               return false;
            }
         }

         return true;
      },

      _isBranch: function(item) {
         return item.get(this._getLinkedObject().getParentProperty() + '@');
      },

      setSelectedItems: function(items) {
         var self = this,
             keys = [],
             linkedObject = this._getLinkedObject(),
            idProperty = linkedObject.getProperty('idProperty');

         items.each(function(rec) {
            if(self._options.selectedFilter(rec)) {
               keys.push(rec.get(idProperty));
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
         this._options.selectionType = selectionType;
         this._getLinkedObject().getContainer().addClass(SELECTION_TYPE_CLASSES[selectionType]);
      },

      getSelectionType: function() {
         return this._options.selectionType;
      },

      _getLinkedObject: function() {
         if(!this._linkedObject) {
            this._linkedObject = this.getChildControlByName(this._options.linkedObjectName);
         }
         return this._linkedObject;
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

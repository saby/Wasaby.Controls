/* global define */
define('js!SBIS3.CONTROLS.SelectorWrapper', [
   'js!SBIS3.CORE.CompoundControl',
   'tmpl!SBIS3.CONTROLS.SelectorWrapper',
   'js!SBIS3.CONTROLS.Utils.TemplateUtil',
   'Core/helpers/collection-helpers',
   'Core/core-instance'
], function (CompoundControl, dotTplFn, TemplateUtil, collectionHelpers, cInstance) {


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
      all: '',
      allBySelectAction: ''
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
            selectedFilter: function () {
               return true;
            },
            selectionType: 'all'

         },
         _linkedObject: null
      },
      $constructor: function() {
         this.once('onInit', function() {
            var linkedObject = this._getLinkedObject(),
                self = this;

            this.subscribeTo(linkedObject, 'onSelectedItemsChange', this._onSelectedItemsChangeHandler.bind(this))
                .subscribeTo(linkedObject, 'onItemClick', function(e) {
                   /* Если есть прикладные обработчики на onItemClick то они должны выполниться первыми,
                      т.к. в них могут отменять обработку клика, и мы этому мешать не должны */
                   if(linkedObject.getEventHandlers('onItemClick').length > 1) {
                      var event = e,
                          args = arguments;
                      
                      setTimeout(function () {
                         if(event.getResult() !== false) {
                            self._onItemClickHandler.apply(self, args);
                         }
                      }, 0);
                   } else  {
                      self._onItemClickHandler.apply(self, arguments);
                   }
                   event = e;
                });

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
               self._processSelectActionVisibility(hoveredItem);
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
       * Обработчик клика по записи
       * @private
       */
      _onItemClickHandler: function(event, id, item, target) {
         var linkedObject = this._getLinkedObject(),
             isBranch = this._isBranch(item);

         /* Если клик произошёл по стрелке разворота папки или запись выбрать нельзя,
            то не обрабатываем это событие */
         if($(target).hasClass('js-controls-TreeView__expand') || !this._checkItemForSelect(item)) {
            return;
         }

         if(linkedObject.getMultiselect()) {
            /* При множественном выборе:
             1) Если есть выделенная чекбоксом запись, то клик по листу должен выделять, а по папке вызывать проваливание
             2) Если запись не выделена, клик по листу должен его выбирать, по записи должно происходить проваливание */
            if(!linkedObject._isEmptySelection()) {
               if(!isBranch) {
                  linkedObject.toggleItemsSelection([id]);
               }
            } else if(!isBranch) {
               this._applyItemSelect(item);
            }
         } else {
            /* При единичном выборе запись всегда должна выбираться при клике,
             не важно, папка это или лист */
            if(isBranch) {
               /* В режиме выбора по операции "Выбрать клик по папке должен приводить в проваливание */
               if(this.getSelectionType() === 'allBySelectAction') {
                  return;
               }
               event.setResult(false);
            }
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
         var linkedObject = this._getLinkedObject();

         if(linkedObject.getItemsActions()) {
            var selectAction = linkedObject.getItemsActions().getItemsInstances()[SELECT_ACTION_NAME];

            /* Показываем по стандарту кнопку "Выбрать" у папок при множественном выборе или при поиске у крошек в единичном выборе */
            if (hoveredItem.container && selectAction) {
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
                  self._applyItemSelect(item);
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
         var linkedObject = this._getLinkedObject();

         if(cInstance.instanceOfMixin(linkedObject, 'SBIS3.CONTROLS.TreeMixin') && item) {
            return item.get(linkedObject.getNodeProperty());
         }
         return false;

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
            if(linkedObject.getMultiselect()) {
               linkedObject.setSelectedKeys(keys);
            } else {
               linkedObject.setSelectedKey(keys[0]);
            }
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

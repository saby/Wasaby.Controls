/**
 * Created by am.gerasimov on 06.10.2015.
 */
define('js!SBIS3.CONTROLS.FieldLinkItemsCollection', [
      'js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CONTROLS.DSMixin',
      'js!SBIS3.CONTROLS.PickerMixin',
      'html!SBIS3.CONTROLS.FieldLinkItemsCollection/itemTpl'
   ],
   function(CompoundControl, DSMixin, PickerMixin, itemTpl) {

      var PICKER_BORDER_WIDTH = 2;

      'use strict';

      /**
       * Контрол, отображающий набор элементов поля связи.
       * @class SBIS3.CONTROLS.FieldLinkItemsCollection
       * @extends SBIS3.CORE.CompoundControl
       */

      var FieldLinkItemsCollection =  CompoundControl.extend([DSMixin, PickerMixin], {
         $protected: {
            _options: {
               /**
                * Метод, который проверяет, нужно ли отрисовывать элемент коллекции
                */
               itemCheckFunc: undefined,
               tabindex: 0
            },
            flContainer: undefined
         },

         $constructor: function() {
            this._publish('onCrossClick', 'onItemActivate', 'onShowPicker', 'onClosePicker');
            /* Запомним контейнер поля связи */
            this._flContainer = this.getParent().getContainer();
         },

         _onClickHandler: function(e) {
            var $target = $(e.target),
                itemContainer;

            itemContainer = $target.closest('.controls-ListView__item', this._container[0]);

            /* Переводим фокус на поле связи */
            this.getParent().setActive(true);

            if(itemContainer.length) {
               this._notify($target.hasClass('controls-FieldLink__linkItem-cross') ? 'onCrossClick' : 'onItemActivate', itemContainer.data('id'));
            }
         },

         /**
          * Аргументы для шаблона
          */
         _buildTplArgs: function(item) {
            return {
               item: item,
               itemTpl: this._options.itemTemplate,
               displayField: this._options.displayField
            }
         },

         _getItemTemplate: function() {
            return itemTpl;
         },

         _setEnabled: function () {
            /* Т.к. при изменении состояния поля связи, для всех элементов появляются/исчезают крестики удаления,
               то надо вызывать перерисовку элементов, чтобы правильно проставилась ширина */
            this._clearItems();
            FieldLinkItemsCollection.superclass._setEnabled.apply(this, arguments);
            this.redraw();
         },

         _getItemsContainer: function() {
            return this.isPickerVisible() ? this._picker.getContainer() : this._container;
         },

         setItems: function(list) {
            var item, result;

            /* Т.к. в карточке задач не могут установить keyField (там два справочника, с разными keyField'ами),
               то для внутренней реализации используем наше поле, куда запишем ключ переданных записей */
            if (!this._options.keyField) {
               this._options.keyField = '__FieldLinkItemsCollectionKeyField__';
            }

            if(list) {
               result = $ws.helpers.reduce(list.toArray(), function(result, rec) {
                  /* Для поддержки работы поля связи с несколькими справочниками,
                   первичный ключ записи (неважно откуда она пришла) запишем в поле,
                   в котором должны лежать первичные ключи по мнению поля связи */
                  item = rec.toObject();
                  item[this._options.keyField] = rec.getId();
                  result.push(item);
                  return result
               }, [], this)
            } else {
               result = []
            }

            FieldLinkItemsCollection.superclass.setItems.call(this, result);
         },

         _appendItemTemplate:function(item, targetContainer, itemInstance) {
            if(this._options.itemCheckFunc(itemInstance)) {
               FieldLinkItemsCollection.superclass._appendItemTemplate.apply(this, arguments);
            }
         },

         /* Контрол не должен принимать фокус ни по клику, ни по табу */
         _initFocusCatch: $ws.helpers.nop,
         canAcceptFocus: $ws.helpers.nop,

         _drawItemsCallback: function() {
            if(this.isPickerVisible() && !this.getItems().getCount()) {
               this.hidePicker()
            }
         },

         showPicker: function() {
            this._clearItems();
            FieldLinkItemsCollection.superclass.showPicker.apply(this, arguments);
            this.redraw();
         },

         hidePicker: function() {
            this._clearItems();
            FieldLinkItemsCollection.superclass.hidePicker.apply(this, arguments);
            this.redraw();
         },

         _setPickerContent: function () {
            var pickerContainer = this._picker.getContainer(),
                flWidth = this._flContainer[0].offsetWidth - PICKER_BORDER_WIDTH;
            pickerContainer.on('click', '.controls-ListView__item', this._onClickHandler.bind(this));
            /* Не очень правильное решение, пикер может сам менять ширину, поэтому устанавливаю минимальну и максимальную */
            pickerContainer[0].style.maxWidth = flWidth + 'px';
            pickerContainer[0].style.minWidth = flWidth + 'px';
            /* Зачем сделано:
               Не надо, чтобы пикер поля связи вызывал перерасчёт размеров,
               т.к. никаких расчётов при его показе не происходит, а просто отрисовываются элементы */
            this._picker._notifyOnSizeChanged = $ws.helpers.nop;
         },

         _setPickerConfig: function () {
            var self = this;
            return {
               corner: 'bl',
               target: this._flContainer,
               opener: this.getParent(),
               closeByExternalClick: true,
               targetPart: true,
               className: 'controls-FieldLink__picker',
               verticalAlign: {
                  side: 'top'
               },
               horizontalAlign: {
                  side: 'left'
               },
               handlers: {
                  /* Надо сообщить о закрытии пикера полю связи, а так же перерисовать элементы, но только после закрытия */
                  onClose: function() {
                     self._notify('onClosePicker');
                     self._clearItems();
                     setTimeout(self.redraw.bind(self), 0);
                  },
                  onShow: function() {
                     self._notify('onShowPicker');
                  }
               }
            };
         }
      });

      return FieldLinkItemsCollection;

   });

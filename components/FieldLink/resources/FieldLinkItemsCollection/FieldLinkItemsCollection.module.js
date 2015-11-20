/**
 * Created by am.gerasimov on 06.10.2015.
 */
define('js!SBIS3.CONTROLS.FieldLinkItemsCollection', [
      'js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CONTROLS.DSMixin',
      'js!SBIS3.CONTROLS.Clickable',
      'js!SBIS3.CONTROLS.PickerMixin',
      'html!SBIS3.CONTROLS.FieldLinkItemsCollection/itemTpl'
   ],
   function(CompoundControl, DSMixin, Clickable, PickerMixin, itemTpl) {

      var PICKER_BORDER_WIDTH = 2;

      'use strict';

      /**
       * Контрол, отображающий набор элементов поля связи.
       * @class SBIS3.CONTROLS.FieldLinkItemsCollection
       * @extends SBIS3.CORE.CompoundControl
       */

      var FieldLinkItemsCollection =  CompoundControl.extend([DSMixin, Clickable, PickerMixin], {
         $protected: {
            _options: {
               /**
                * Метод, который проверяет, нужно ли отрисовывать элемент коллекции
                */
               itemCheckFunc: undefined
            },
            flContainer: undefined
         },

         $constructor: function() {
            this._publish('onCrossClick');
            /* Запомним контейнер поля связи */
            this._flContainer = this.getParent().getContainer();
         },

         init: function() {
            FieldLinkItemsCollection.superclass.init.apply(this, arguments);
            /* Проинициализируем DataSet */
            this.reload();
         },

         /**
          * Аргументы для шаблона
          */
         _buildTplArgs: function(item) {
            return {
               item: item,
               displayField: this._options.displayField
            }
         },

         _getItemTemplate: function() {
            return itemTpl;
         },

         _getItemsContainer: function() {
            return this.isPickerVisible() ? this._picker.getContainer() : this._container;
         },

         setItems: function(list) {
            var self = this,
                items = [];

            list.each(function(rec) {
               var itemObject = {};

               itemObject[self._options.keyField] = rec.getId();
               itemObject[self._options.displayField] = rec.get(self._options.displayField);
               items.push(itemObject);
            });

            FieldLinkItemsCollection.superclass.setItems.call(this, items);
         },

         _appendItemTemplate:function(item, targetContainer, itemInstance) {
            if(this._options.itemCheckFunc(itemInstance)) {
               FieldLinkItemsCollection.superclass._appendItemTemplate.apply(this, arguments);
            }
         },
         /**
          * Обработчик клика на крестик
          * @param e
          * @private
          */
         _clickHandler: function(e) {
            var $target = $(e.target),
                itemContainer;

            if ($target.hasClass('controls-FieldLink__linkItem-cross')) {
               itemContainer = $(e.target).closest('.controls-ListView__item');

               if (itemContainer.length) {
                  this._notify('onCrossClick', itemContainer.data('id'));
               }
            }
         },

         _drawItemsCallback: function() {
            if(this.isPickerVisible() && !this.getDataSet().getCount()) {
               this.hidePicker()
            }
         },

         showPicker: function() {
            this._clearItems();
            FieldLinkItemsCollection.superclass.showPicker.apply(this, arguments);
            this.reload();
         },

         hidePicker: function() {
            this._clearItems();
            FieldLinkItemsCollection.superclass.hidePicker.apply(this, arguments);
            this.reload();
         },

         _setPickerContent: function () {
            var pickerContainer = this._picker.getContainer(),
                flWidth = this._flContainer[0].offsetWidth - PICKER_BORDER_WIDTH;
            pickerContainer.on('click', '.controls-ListView__item', this._clickHandler.bind(this));
            /* Не очень правильное решение, пикер может сам менять ширину, поэтому устанавливаю минимальну и максимальную */
            pickerContainer[0].style.maxWidth = flWidth + 'px';
            pickerContainer[0].style.minWidth = flWidth + 'px';
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
                     self._options.handlers.onClose();
                     self._clearItems();
                     setTimeout(self.reload.bind(self), 0);
                  }
               }
            };
         }
      });

      return FieldLinkItemsCollection;

   });

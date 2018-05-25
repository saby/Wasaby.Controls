/**
 * Created by am.gerasimov on 06.10.2015.
 */
define('SBIS3.CONTROLS/FieldLink/resources/ItemsCollection', [
      'Lib/Control/CompoundControl/CompoundControl',
      'Core/detection',
      'SBIS3.CONTROLS/Mixins/ItemsControlMixin',
      'SBIS3.CONTROLS/Mixins/PickerMixin',
      'tmpl!SBIS3.CONTROLS/FieldLink/resources/ItemsCollection/FieldLinkItemsCollection',
      'tmpl!SBIS3.CONTROLS/FieldLink/resources/ItemsCollection/defaultItemTemplate',
      'tmpl!SBIS3.CONTROLS/FieldLink/resources/ItemsCollection/defaultItemContentTemplate',
      'Core/core-instance',
      'Core/detection',
      'Core/helpers/Hcontrol/getScrollWidth',
      'SBIS3.CONTROLS/Utils/ItemsSelectionUtil'
   ], function(CompoundControl, cDetection, DSMixin, PickerMixin, dotTplFn, defaultItemTemplate, defaultItemContentTemplate, cInstance, detection, getScrollWidth, ItemsSelection) {

      'use strict';

      /**
       * Контрол, отображающий набор элементов поля связи.
       * @class SBIS3.CONTROLS/FieldLink/resources/ItemsCollection
       * @extends Lib/Control/CompoundControl/CompoundControl
       */

      function buildTplArgsFL(cfg) {
         var
            tplOptions = cfg._buildTplArgsSt.call(this, cfg),
            additionalItemClasses = '',
            additionalItemCaptionClasses = '';
         tplOptions.itemsCount = cfg._itemsProjection.getCount();
         /* Нужно вручную сортировать элементы в двух случаях:
          1. Отображаем элементы в FieldLink и браузер - IE. В таком случае flex-end не работает полноценно.
          Единственный способ отображать последние выбранные - это реверсировать их вывод и использовать сортировку.
          2. Отображаем элементы в выпадающем списке. Последние выбранные элементы должны быть вверху списка. */
         tplOptions.needSort = cfg._isPickerVisible || cDetection.isIE;
         /* Надо рисовать подсказку для поля связи, если используется дефолтный шаблон,
          в случае прикладного, там может быть вёрстка, и в подсказку её класть нельзя */
         tplOptions.needTitle = !cfg.itemContentTpl;
         // Формируем список классов для item
         additionalItemClasses = cfg._isPickerVisible ? ' controls-FieldLink__item-inPicker' : ' controls-FieldLink__item-inField';
         if (tplOptions.itemsCount === 1) {
            additionalItemClasses += ' controls-FieldLink__item-single'
         }
         // Формируем список классов для item-caption
         if (cfg.underlinedItems) {
            additionalItemCaptionClasses += ' controls-FieldLink__item-caption__underlined';
         }
         if (cfg.boldItems) {
            additionalItemCaptionClasses += ' controls-FieldLink__item-caption__bold';
         }
         if (cfg.bigItems) {
            additionalItemCaptionClasses += ' controls-FieldLink__item-caption__big';
         } else {
            additionalItemCaptionClasses += ' controls-FieldLink__item-caption__normal';
         }
         tplOptions.getItemTemplateData = function(templateCfg) {
            var
               orderStyle = '',
               order;
            if (tplOptions.needSort) {
               order = ((templateCfg.itemsCount || 0) - templateCfg.projItem.getOwner().getIndexByInstanceId(templateCfg.projItem.getInstanceId()));
               // "-ms-flex-order" для поддержки ie10 (https://msdn.microsoft.com/en-us/library/hh673531(v=vs.85).aspx)
               orderStyle = 'order: ' + order + '; -ms-flex-order: ' + order + ';';
            }
            return {
               additionalItemCaptionClasses: additionalItemCaptionClasses,
               additionalItemClasses: additionalItemClasses,
               orderStyle: orderStyle,
               drawCross: cfg.enabled,
               drawComma: (templateCfg.projItem.getOwner().getIndex(templateCfg.projItem) !== templateCfg.itemsCount - 1) && !cfg._isPickerVisible
            };
         };
         return tplOptions;
      }
      
      function setPickerWidth(width) {
         var pickerContainer = this.getPicker().getContainer();
         pickerContainer[0].style.maxWidth = width + 'px';
         pickerContainer[0].style.minWidth = width + 'px';
      }

      var FieldLinkItemsCollection =  CompoundControl.extend([DSMixin, PickerMixin], {
         _dotTplFn: dotTplFn,
         $protected: {
            _options: {
               _defaultItemContentTemplate: defaultItemContentTemplate,
               _defaultItemTemplate: defaultItemTemplate,
               _canServerRender: true,
               _buildTplArgs: buildTplArgsFL,
               _isPickerVisible: false
            },
            _parentFieldLink: undefined
         },

         $constructor: function() {
            this._publish('onCrossClick', 'onItemActivate', 'onShowPicker', 'onClosePicker');

            /* Запомним контейнер поля связи */
            this._parentFieldLink = this.getParent();
         },

         _onClickHandler: function(e) {
            var self = this;
            FieldLinkItemsCollection.superclass._onClickHandler.apply(this, arguments);
   
            ItemsSelection.clickHandler.call(self, e.target,
               function (id) {
                  self._notify('onCrossClick', id);
   
                  if(self.isPickerVisible()) {
                     self.getPicker().recalcPosition(true, true);
                  }
               },
               function (id) {
                  self._parentFieldLink.setActive(true);
                  if (id !== undefined) {
                     self._notify('onItemActivate', id);
                  }
               }
            );
         },

         /**
          * Для обратной совместимости, если шаблон задают как itemTemplate,
          * то в качестве базового шаблона всё равно должен использоваться defaultItemTemplate
          */
         _getItemTemplate: function() {
            return this._options._defaultItemTemplate;
         },

         _setEnabled: function () {
            var
               items = this.getItems();
            /* Т.к. при изменении состояния поля связи, для всех элементов появляются/исчезают крестики удаления,
               то надо вызывать перерисовку элементов, чтобы правильно проставилась ширина */
            this._clearItems();
            FieldLinkItemsCollection.superclass._setEnabled.apply(this, arguments);
            if (items && items.getCount()) {
               this.redraw();
            }
         },

         _getItemsContainer: function() {
            return this.isPickerVisible() ? this._picker.getContainer() : this._container;
         },

         setItems: function(list) {
            if (list) {
               /* RecordSet клонировать нельзя, иначе записи склонируются с ключевым полем
                  рекордсета, хотя оно могло быть изменено */
               if (!cInstance.instanceOfModule(list, 'WS.Data/Collection/RecordSet')) {
                  list = list.clone();
               } else {
                  list.setEventRaising(false, false);
               }
            } else {
               list = [];
            }
            FieldLinkItemsCollection.superclass.setItems.call(this, list);
         },

         /* Контрол не должен принимать фокус ни по клику, ни по табу */
         _initFocusCatch: function () {

         },
         canAcceptFocus: function () {

         },

         /* Скрываем именно в синхронном drawItemsCallback'e,
            иначе пикер скрывается асинхронно и моргает */
         _drawItemsCallbackSync: function() {
            if (this.isPickerVisible() && !this.getItems().getCount()) {
               this.hidePicker();
            }
         },

         showPicker: function() {
            var pickerContainer, pickerWidth;
            
            /* Чтобы не было перемаргивания в задизейбленом состоянии,
               просто вешаем класс ws-invisible */
            if (this.isEnabled()) {
               this._clearItems();
            } else {
               this.getContainer().addClass('ws-invisible');
            }
            FieldLinkItemsCollection.superclass.showPicker.apply(this, arguments);
            this._options._isPickerVisible = true;
            this.redraw();
            
            pickerContainer = this._picker.getContainer();
            pickerWidth = this._parentFieldLink.getContainer()[0].offsetWidth;
   
            setPickerWidth.call(this, pickerWidth);
   
            /* Из-за того, что ie располагает скроллбар не внутри контейнера, а за его пределами,
             надо учитывать это при расчётах ширины пикера */
            if ((detection.isIE10 || detection.isIE11) && pickerContainer[0].offsetHeight < pickerContainer[0].scrollHeight) {
               pickerWidth -= getScrollWidth();
               this._picker.recalcPosition(true);
               setPickerWidth.call(this, pickerWidth);
            }
            this._picker.recalcPosition(true);
         },

         _setPickerContent: function () {
            this._picker.getContainer().on('click', '.controls-FieldLink__item', this._onClickHandler.bind(this));
            /* Зачем сделано:
               Не надо, чтобы пикер поля связи вызывал перерасчёт размеров,
               т.к. никаких расчётов при его показе не происходит, а просто отрисовываются элементы */
            this._picker._notifyOnSizeChanged = function () {};
         },

         _setPickerConfig: function () {
            var self = this,
                fieldLinkContainer = this._parentFieldLink.getContainer(),
                pickerClasses = ['controls-FieldLink__picker'];

            return {
               corner: 'bl',
               target: fieldLinkContainer,
               opener: this._parentFieldLink,
               closeByExternalClick: true,
               closeOnTargetMove: true,
               targetPart: true,
               cssClassName: pickerClasses.join(' '),
               activableByClick: false,
               verticalAlign: {
                  side: 'top'
               },
               horizontalAlign: {
                  side: 'left'
               },
               handlers: {
                  /* Надо сообщить о закрытии пикера полю связи, а так же перерисовать элементы, но только после закрытия */
                  onClose: function() {
                     self._options._isPickerVisible = false;
                     if (!self.isEnabled()) {
                        self.getContainer().removeClass('ws-invisible');
                     }
                     setTimeout(self.redraw.bind(self), 0);
                  }
               }
            };
         },

         _onAlignmentChangeHandler: function(alignment) {
            FieldLinkItemsCollection.superclass._onAlignmentChangeHandler.apply(this, arguments);

            if (alignment.verticalAlign.side === 'bottom') {
               this._picker.getContainer().addClass('controls-FieldLink__picker_revert_vertical');
            } else {
               this._picker.getContainer().removeClass('controls-FieldLink__picker_revert_vertical');
            }
         },

         destroy: function() {
            if (this._picker) {
               this._picker.getContainer().off('click');
            }
            FieldLinkItemsCollection.superclass.destroy.apply(this, arguments);
         }
      });

      return FieldLinkItemsCollection;

   });

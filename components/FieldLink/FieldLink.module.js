define('js!SBIS3.Engine.FieldLink',
   [
      'js!SBIS3.CORE.CompoundControl',
      'tmpl!SBIS3.Engine.FieldLink',
      'js!SBIS3.CONTROLS.FormWidgetMixin',
      'js!SBIS3.CONTROLS.PickerMixin',
      'js!SBIS3.CONTROLS.MultiSelectable',
      'js!SBIS3.CONTROLS.Suggest',
      'js!SBIS3.CONTROLS.SelectedItemsCollection',
      'js!SBIS3.CONTROLS.Link',
      'js!SBIS3.CONTROLS.FieldLinkTextBox',
      'js!SBIS3.CONTROLS.IconButton'
   ],
   function(CompoundControl, dotTplFn, FormWidgetMixin, PickerMixin, MultiSelectable, Suggest, SimpleItemsCollection) {

   'use strict';

    var INPUT_WRAPPER_PADDING = 10;
    var SHOW_ALL_LINK_WIDTH = 11;
    var INPUT_MIN_WIDTH = 50;

   /**
    * Поле связи. Можно выбирать значение из списка, можно из автодополнения
    * @class SBIS3.Engine.FieldLink
    * @extends $ws.proto.Control
    * @mixes SBIS3.CONTROLS.MultiSelectable
    * @mixes SBIS3.CONTROLS.CollectionMixin
    * @mixes SBIS3.CONTROLS.FormWidgetMixin
    * @control
    * @public
    * @author Крайнов Дмитрий Олегович
    */

   var FieldLink = CompoundControl.extend([FormWidgetMixin, PickerMixin, MultiSelectable, SimpleItemsCollection],/** @lends SBIS3.Engine.FieldLink.prototype */{
      $protected: {
         _dotTplFn: dotTplFn,
         _options: {
            /**
             * @cfg {Object} Конфигурация поля ввода
             */
            textBoxSettings: {},
            /**
             * @cfg {Object} Конфигурация автодополнения
             */
            suggestSettings: {},
            /**
             * @cfg {String} Текст ссылки поля связи
             */
            linkCaption: ''
         },
         _suggest: undefined,
         _textBox: undefined,
         _inputWrapper: undefined,
         _linksWrapper: undefined,
         _dropAllButton: undefined,
         _showAllLink: undefined,
         _itemTpl: undefined,
         _drawPicker: false
      },

      $constructor: function() {
         this._container.removeClass('ws-area');
      },

      init: function() {
         FieldLink.superclass.init.apply(this, arguments);
         this._setVariables();
         this._initEvents();

         /* Если передали конфигурацию suggest'а то создадим его */
         if(Object.keys(this._options.suggestSettings).length && this._options.showTextBox) {
            this._createSuggest();
         }
      },
      /**
       * Устанавливает переменные, для дальнейшей работы с ними
       * @private
       */
      _setVariables: function() {
         this._linksWrapper = this._container.find('.controls-FieldLink__linksWrapper');

         if(this._options.multiselect) {
            this._dropAllLink = this._container.find('.controls-FieldLink__dropAllLinks');
            this._showAllLink = this._container.find('.controls-FieldLink__showAllLinks')
         }

         if(!this._options.linkCaption) {
            this._textBox = this.getChildControlByName(this.getName() + '_textBox');
            this._inputWrapper = this._textBox.getContainer().find('.controls-TextBox__fieldWrapper');
         }
      },

      _initEvents: function() {
         if(!this._options.linkCaption) {
            if(this._options.multiselect) {
               this._showAllLink.mouseenter(this.showPicker.bind(this));
               this._dropAllLink.click(this.removeItemsSelectionAll.bind(this));
            }
         }
      },

      /**
       * Возвращает suggest
       */
      getSuggest: function() {
         return this._suggest;
      },
      /**
       * Возвращает textBox
       */
      getTextBox: function() {
         return this._textBox;
      },

      showPicker: function() {
         /* При отображении пикера, очистим элементы в инпуте и покажем кнопку очистить всё */
         this.clearItems();
         this._toggleDropAllLink(true);
         this._updateInputWidth();

         FieldLink.superclass.showPicker.call(this);
         this.redraw();
      },

      _onPickerClose: function() {
         this._toggleDropAllLink(false);
         this.redraw();
      },

      /**
       * Тут считается ширина добавляемого элемента, и если он не влезает,
       * то отрисовываться он не будет и покажется троеточие
       * @private
       */
      _drawItem: function(item) {
         var parentResult = FieldLink.superclass._drawItem.apply(this, arguments),
             needDrawItem;

         /* Если элементы рисуются в пикере или одиночный выбор или поля ввода вообще нет, то ничего считать не надо */
         if(this._options.linkCaption || !this._options.multiselect || this._isPickerVisible()) {
            return parentResult;
         }

         needDrawItem = $ws.helpers.getTextWidth(parentResult) < this._container[0].offsetWidth - (this._getWrappersWidth() + SHOW_ALL_LINK_WIDTH + INPUT_MIN_WIDTH);
         this._toggleShowAllLink(!needDrawItem);
         return needDrawItem ? parentResult : '';
      },

      _drawSelectedItems: function(keys) {
         var isEmpty = !keys.length;

         if (this._isPickerVisible() && isEmpty) {
            this.hidePicker();
            this._toggleShowAllLink(false);
         }

         if (this._options.linkCaption) {
            this._container.find('.controls-FieldLink__Link-defaultLink').toggleClass('ws-hidden', !isEmpty);
         }

         if(!this._options.multiselect) {
            this._toggleInputWrapper(isEmpty);
         }

         FieldLink.superclass._drawSelectedItems.apply(this, arguments);
      },

      /**
       * Конфигурация пикера
       */
      _setPickerConfig: function () {
         var self = this;

         return {
            corner: 'bl',
            target: this.getTextBox().getContainer(),
            closeByExternalOver: true,
            targetPart: true,
            className: 'controls-FieldLink__picker',
            handlers: {
               onClose: function() {
                  setTimeout(self._onPickerClose.bind(self), 0);
               }
            }
         };
      },

      _setPickerContent: function () {
         var pickerContainer = this._picker.getContainer();

         pickerContainer.css('max-width', this.getTextBox().getContainer()[0].clientWidth)
                        .mouseup(this.crossClickHandler.bind(this));
      },

      /**
       * Считает ширину элементов поля связи, кроме инпута
       * @returns {number}
       * @private
       */
      _getWrappersWidth: function() {
         var textBoxContainer = this.getTextBox().getContainer();
         return textBoxContainer.find('.controls-TextBox__afterFieldWrapper')[0].offsetWidth + textBoxContainer.find('.controls-TextBox__beforeFieldWrapper')[0].offsetWidth;
      },

      _createSuggest: function() {
         var self = this,
             textBox = this.getTextBox(),
             suggestConfig = {
                element: textBox.getContainer(),
                observableControls: [textBox],
                loadingContainer: this._inputWrapper,
                handlers: {
                   onListItemSelect: function(event, item) {
                      self.addItemsSelection([item.get(self._options.keyField)]);
                  }
               }
            };

         this._suggest = new Suggest($ws.core.merge(this._options.suggestSettings, suggestConfig));
      },

      _drawItemsCallback: function() {
         /* Если рисовались элементы в пикере, то ничего делать не будем */
         if(this._isPickerVisible()) return;

         if(this._textBox) {
            this._updateInputWidth();
         }

      },

      /**
       * Возвращает, отображается ли сейчас пикер
       * @returns {*|Boolean}
       * @private
       */
      _isPickerVisible: function() {
         return this._picker && this._picker.isVisible();
      },

      _getItemsContainer: function() {
         return this._isPickerVisible() ? this._picker.getContainer() : this._linksWrapper;
      },

      /**
       * Скрывает/показывает поле ввода
       */
      _toggleInputWrapper: function(show) {
         /* Нужно поле делать невидимым, а не скрывать, чтобы можно было посчитать размеры */
         this._inputWrapper && this._inputWrapper.toggleClass('ws-invisible', !show)
      },

      /**
       * Скрывает/показывает кнопку показа всех записей
       */
      _toggleShowAllLink: function(show) {
         this._showAllLink.length && this._showAllLink.toggleClass('ws-hidden', !show);
      },

      /**
       * Скрывает/показывает кнопку очистки всех записей
       */
      _toggleDropAllLink: function(show) {
         this._dropAllLink && this._dropAllLink.toggleClass('ws-hidden', !show);
      },

      /**
       * Расчитывает ширину поля ввода
       * @private
       */
      _updateInputWidth: function() {
         this.getTextBox().setInputWidth(this._container[0].offsetWidth - this._getWrappersWidth() - INPUT_WRAPPER_PADDING);
      },

      destroy: function() {
         this._textBox =  undefined;
         this._linksWrapper = undefined;

         if(this._options.multiselect) {
            this._showAllLink.unbind('click');
            this._showAllLink = undefined;
         }
         FieldLink.superclass.destroy.apply(this, arguments);
      }
   });

   return FieldLink;

});
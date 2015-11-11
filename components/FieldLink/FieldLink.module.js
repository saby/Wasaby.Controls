define('js!SBIS3.CONTROLS.FieldLink',
   [
      'js!SBIS3.CONTROLS.SuggestTextBox',
      'js!SBIS3.CONTROLS.DSMixin',
      'js!SBIS3.CONTROLS.FormWidgetMixin',
      'js!SBIS3.CONTROLS.MultiSelectable',
      'js!SBIS3.CONTROLS.ActiveMultiSelectable',
      'js!SBIS3.CONTROLS.FieldLinkItemsCollection',
      'html!SBIS3.CONTROLS.FieldLink/afterFieldWrapper',
      'html!SBIS3.CONTROLS.FieldLink/beforeFieldWrapper',
      'js!SBIS3.CONTROLS.MenuIcon'

   ],
   function(SuggestTextBox, DSMixin, FormWidgetMixin, MultiSelectable, ActiveMultiSelectable, FieldLinkItemsCollection, afterFieldWrapper, beforeFieldWrapper) {

      'use strict';

      var INPUT_WRAPPER_PADDING = 11;
      var SHOW_ALL_LINK_WIDTH = 11;
      var INPUT_MIN_WIDTH = 100;

      function propertyUpdateWrapper(func) {
         return function() {
            return this.runInPropertiesUpdate(func, arguments);
         };
      }

   /**
    * Поле связи. Можно выбирать значение из списка, можно из автодополнения
    * @class SBIS3.CONTROLS.FieldLink
    * @extends SBIS3.CONTROLS.SuggestTextBox
    * @category Inputs
    * @mixes SBIS3.CONTROLS.MultiSelectable
    * @mixes SBIS3.CONTROLS.CollectionMixin
    * @mixes SBIS3.CONTROLS.FormWidgetMixin
    * @demo SBIS3.CONTROLS.Demo.FieldLinkWithEditInPlace
    * @control
    * @public
    * @author Крайнов Дмитрий Олегович
    */

   var FieldLink = SuggestTextBox.extend([FormWidgetMixin, MultiSelectable, DSMixin, ActiveMultiSelectable],/** @lends SBIS3.CONTROLS.FieldLink.prototype */{
      $protected: {
         /* КЛАВИШИ ОБРАБАТЫВАЕМЫЕ FieldLink'ом */
         _keysWeHandle: [
            $ws._const.key.del,
            $ws._const.key.backspace,
            $ws._const.key.esc,
            $ws._const.key.down,
            $ws._const.key.up
         ],
         /* КОНФИГУРАЦИЯ SELECTOR'а */
         _selector: {
            config: {
               isStack: true,
               autoHide: true,
               autoCloseOnHide: true,
               overlay: true,
               parent: null,
               showDelay: 300
            },
            type: {
               newDialog: 'js!SBIS3.CONTROLS.DialogSelector',
               newFloatArea: 'js!SBIS3.CONTROLS.FloatAreaSelector'
            }
         },
         _inputWrapper: undefined,
         _linksWrapper: undefined,
         _dropAllButton: undefined,
         _showAllLink: undefined,
         _pickerLinkList: undefined,
         _linkCollection: undefined,
         _options: {
            afterFieldWrapper: afterFieldWrapper,
            beforeFieldWrapper: beforeFieldWrapper,
            list: {
               className: 'js!SBIS3.CONTROLS.DataGridView',
               options: {
                  showHead: false,
                  columns: []
               }
            },
            /**
             * @cfg {String} Режим выбора записей. В новом диалоге или во всплывающей панели
             * <wiTag group="Управление">
             * @variant newDialog в новом диалоге
             * @variant newFloatArea во всплывающей панели
             */
            selectRecordsMode: 'newDialog',
            /**
             * @typedef {Array} dictionaries
             * @property {String} caption Текст в меню.
             * @property {String} template Шаблон, который отобразится в диалоге выбора.
             */
            /**
             * @cfg {dictionaries[]} Набор диалогов выбора для поля связи
             * @remark
             * Если передать всего один элемент, то дилог выбора откроется при клике на иконку меню.
             */
            dictionaries: []
         }
      },

      $constructor: function() {
         this.getContainer().addClass('controls-FieldLink');

         /* Проиницализируем переменные и event'ы */
         this._setVariables();
         this._initEvents();

         /* Создём контрол, который рисует элементы в ввиде текста с крестиком удаления */
         this._linkCollection = this._drawFieldLinkItemsCollection();
      },

      init: function() {
         FieldLink.superclass.init.apply(this, arguments);
         this.getChildControlByName('fieldLinkMenu').setItems(this._options.dictionaries);
      },

      /**
       * Обработчик нажатия на меню(элементы меню), открывает диалог выбора с соответствующим шаблоном
       * @private
       */
      _menuItemActivatedHandler: function(e, item) {
         this.getParent().showSelector(this.getDataSet().getRecordByKey(item).get('template'));
      },

      /**
       * Показывает диалог выбора, в качестве аргумента принимает имя шаблона в виде 'js!SBIS3.CONTROLS.MyTemplate'
       * @param template
       */
      showSelector: function(template) {
         var self = this;

         requirejs([this._selector.type[this._options.selectRecordsMode]], function(ctrl) {
            /* Необходимо клонировать конфигурацию селектора, иначе кто-то может её испортить, если передавать по ссылке */
            new ctrl($ws.core.merge($ws.core.clone(self._selector.config), {
                  template: template,
                  currentSelectedKeys: self.getSelectedKeys(),
                  target: self.getContainer(),
                  parent: this,
                  opener: self,
                  multiselect: self._options.multiselect,
                  closeCallback: function (result) {
                     result && self.setSelectedKeys(result);
                  }
               })
            );
         });
      },

      /**
       * Устанавливает переменные, для дальнейшей работы с ними
       * @private
       */
      _setVariables: function() {
         this._linksWrapper = this._container.find('.controls-FieldLink__linksWrapper');
         this._inputWrapper = this._container.find('.controls-TextBox__fieldWrapper');

         if(this._options.multiselect) {
            this._dropAllLink = this._container.find('.controls-FieldLink__dropAllLinks');
            this._showAllLink = this._container.find('.controls-FieldLink__showAllLinks')
         }
      },

      _initEvents: function() {
         var self = this;

         if(this._options.multiselect) {
            /* Когда показываем пикер со всеми выбранными записями, скроем автодополнение и покажем выбранные записи*/
            this._showAllLink.click(function() {
               self.showPicker();
               self._pickerChangeStateHandler(true);
               return false;
            });
            this._dropAllLink.click(this.removeItemsSelectionAll.bind(this));
         }
      },

      /**
       * Обработчик на выбор записи в автодополнении
       * @private
       */
      _onListItemSelect: propertyUpdateWrapper(function(id) {
         this.hidePicker();
         this.setText('');
         this.addItemsSelection([id]);
      }),


      setDataSource: function(ds) {
         this.getList().addCallback(function(list) {
            list.setDataSource(ds)
         });
         FieldLink.superclass.setDataSource.apply(this, arguments);
      },

      _drawSelectedItems: function(keysArr) {
         var self = this,
             keysArrLen = keysArr.length;

         /* Если удалили в пикере все записи, и он был открыт, то скроем его */
         if (this._isPickerVisible() && !keysArrLen) {
            this.hidePicker();
            this._toggleShowAllLink(false);
         }

         /* Нужно поле делать невидимым, а не скрывать, чтобы можно было посчитать размеры */
         if(!this._options.multiselect) {
            this._inputWrapper.toggleClass('ws-invisible', Boolean(keysArrLen))
         }

         if(keysArrLen) {
            this.getSelectedItems().addCallback(function(dataSet){
               self._setLinkCollectionData(dataSet._getRecords());
            });
         } else {
            this._setLinkCollectionData([]);
         }
      },

      /**
       * Занимается перемещением контрола из пикера в поле и обратно.
       * @param toPicker
       * @private
       */
      _moveLinkCollection: function(toPicker) {
         this._linkCollection.getContainer().detach().appendTo(toPicker ? this._pickerLinkList : this._linksWrapper);
      },

      _drawFieldLinkItemsCollection: function() {
         var self = this;
         return new FieldLinkItemsCollection({
            element: this._linksWrapper.find('.controls-FieldLink__linksContainer'),
            displayField: this._options.displayField,
            keyField: this._options.keyField,
            itemCheckFunc: this._checkItemBeforeDraw.bind(this),
            handlers: {
               onDrawItems: this._updateInputWidth.bind(this),
               onCrossClick: function(e, key){ self.removeItemsSelection([key]); }
            }
         });
      },

      /* Проверяет, нужно ли отрисовывать элемент или надо показать троеточие */
      _checkItemBeforeDraw: function(item) {
         var needDrawItem = false,
             inputWidth;

         /* Если элементы рисуются в пикере то ничего считать не надо */
         if(this._isPickerVisible()) {
            return true;
         }

         /* Тут считается ширина добавляемого элемента, и если он не влезает,
            то отрисовываться он не будет и покажется троеточие, однако хотя бы один элемент в поле связи должен поместиться */
         if(this._checkWidth) {
            inputWidth = this._getInputWidth();
            needDrawItem = $ws.helpers.getTextWidth(item[0].outerHTML) + INPUT_MIN_WIDTH < inputWidth + SHOW_ALL_LINK_WIDTH;

            if(!needDrawItem && !this._linkCollection.getContainer().find('.controls-FieldLink__linkItem').length) {
               item[0].style.width = inputWidth - INPUT_MIN_WIDTH + 'px';
               needDrawItem = true;
               this._checkWidth = false;
            }
         }
         this._toggleShowAllLink(!needDrawItem);
         return needDrawItem
      },
      /**
       * Устанавливает данные в контрол
       * @param records
       * @private
       */
      _setLinkCollectionData: function(records) {
         var self = this;

         //FIXMe это костыль, надо выпилить, нужно научить DSMixin работать с датасетом без датасорса
         function convertToItemObject(records) {
            var items = [];

            $ws.helpers.forEach(records, function(record) {
               var itemObject = {};

               itemObject[self._options.keyField] = record.getKey();
               itemObject[self._options.displayField] = record.get(self._options.displayField);
               items.push(itemObject);
            });

            return items;
         }

         records.length ? this._linkCollection.setItems(convertToItemObject(records)) : this._linkCollection.setItems([]);
      },

      _pickerChangeStateHandler: function(open) {
         this._listContainer && this._listContainer.toggleClass('ws-hidden', open);
         this._dropAllLink && this._dropAllLink.toggleClass('ws-hidden', !open);
         this._pickerLinkList.toggleClass('ws-hidden', !open);
         this._moveLinkCollection(open);
         this._linkCollection.reload();
      },

      /**
       * Конфигурация пикера
       */
      _setPickerConfig: function () {
         var self = this;

         return {
            corner: 'bl',
            target: this._container,
            opener: this,
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
               onClose: function() {
                  setTimeout(self._pickerChangeStateHandler.bind(self, false), 0);
               }
            }
         };
      },

      _setPickerContent: function () {
         this._pickerLinkList = $('<div class="controls-FieldLink__picker-list"/>').appendTo(this._picker.getContainer().css('maxWidth', this._container[0].offsetWidth));
         FieldLink.superclass._setPickerContent.apply(this, arguments);
      },

      _keyboardHover: function (e) {
         FieldLink.superclass._keyboardHover.apply(this, arguments);

         switch (e.which) {
            case $ws._const.key.del:
               this.removeItemsSelectionAll();
               break;
            case $ws._const.key.esc:
               this.hidePicker();
               break;
            case $ws._const.key.backspace:
               var selectedKeys = this.getSelectedKeys();
               if(!this.getText()) {
                  this.removeItemsSelection([selectedKeys[selectedKeys.length - 1]]);
               }
               break;
         }

         return true;
      },

      /**
       * Возвращает, отображается ли сейчас пикер
       * @returns {*|Boolean}
       * @private
       */
      _isPickerVisible: function() {
         return this._picker && this._picker.isVisible();
      },

      /**
       * Скрывает/показывает кнопку показа всех записей
       */
      _toggleShowAllLink: function(show) {
         this._options.multiselect && this._showAllLink && this._showAllLink.toggleClass('ws-hidden', !show);
      },

      /**
       * Расщитывает ширину поля ввода, учитывая всевозможные wrapper'ы и отступы
       * @returns {number}
       * @private
       */
      _getInputWidth: function() {
         return this._container[0].offsetWidth  -
            (this._container.find('.controls-TextBox__afterFieldWrapper')[0].offsetWidth +
             this._container.find('.controls-TextBox__beforeFieldWrapper')[0].offsetWidth +
            INPUT_WRAPPER_PADDING);
      },
      /**
       * Обновляет ширину поле ввода, после того как отрисовались выбренные элементы
       * @private
       */
      _updateInputWidth: function() {
         this._checkWidth = true;
         this._inputField[0].style.width = this._getInputWidth() + 'px';
      },

      /* Заглушка, само поле связи не занимается отрисовкой */
      _redraw: nop,


      destroy: function() {
         this._linksWrapper = undefined;
         this._inputWrapper = undefined;

         if(this._options.multiselect) {
            this._showAllLink.unbind('click');
            this._showAllLink = undefined;

            this._dropAllLink.unbind('click');
            this._dropAllLink = undefined;
         }
         FieldLink.superclass.destroy.apply(this, arguments);
      }
   });

   return FieldLink;

});
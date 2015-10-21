define('js!SBIS3.CONTROLS.FieldLink',
   [
      'js!SBIS3.CONTROLS.SuggestTextBox',
      'js!SBIS3.CONTROLS.DSMixin',
      'js!SBIS3.CONTROLS.FormWidgetMixin',
      'js!SBIS3.CONTROLS.MultiSelectable',
      'js!SBIS3.CONTROLS.FieldLinkItemsCollection',
      'html!SBIS3.CONTROLS.FieldLink/afterFieldWrapper',
      'html!SBIS3.CONTROLS.FieldLink/beforeFieldWrapper',
      'js!SBIS3.CONTROLS.MenuIcon'

   ],
   function(SuggestTextBox, DSMixin, FormWidgetMixin, MultiSelectable, FieldLinkItemsCollection, afterFieldWrapper, beforeFieldWrapper) {

      'use strict';

      var INPUT_WRAPPER_PADDING = 11;
      var SHOW_ALL_LINK_WIDTH = 11;
      var INPUT_MIN_WIDTH = 100;

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

   var FieldLink = SuggestTextBox.extend([FormWidgetMixin, MultiSelectable, DSMixin],/** @lends SBIS3.Engine.FieldLink.prototype */{
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
            selectRecordsMode: 'newDialog',
            list: {
               className: 'js!SBIS3.CONTROLS.DataGridView',
               options: {
                  showHead: false,
                  columns: []
               }
            },
            dictionaries: []
         }
      },

      $constructor: function() {
         this.getContainer().addClass('controls-FieldLink');

         /* Особый placeholder для поля связи, чтобы можно было отображать ссылку */
         if(this._options.placeholder && !this._compatPlaceholder) {
            this._inputField[0].removeAttribute('placeholder');
            this._createCompatPlaceholder();
         }

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
            new ctrl($ws.core.merge(self._selector.config, {
                  template: template,
                  currentSelectedKeys: self.getSelectedKeys(),
                  target: self.getContainer(),
                  multiselect: self._options.multiselect,
                  closeCallback: function (result) {
                     result && self.setSelectedKeys(result);
                  }
               }, {clone: true})
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
            this._showAllLink.mouseenter(function() {
               self.showPicker();
               self._pickerStateHandler(true);
            });
            this._dropAllLink.click(this.removeItemsSelectionAll.bind(this));
         }
      },

      _onListItemSelect: function(id) {
         this.addItemsSelection([id]);
      },


      setDataSource: function(ds) {
         this.getList().addCallback(function(list) {
            list.setDataSource(ds)
         });
         FieldLink.superclass.setDataSource.apply(this, arguments);
      },

      _drawSelectedItems: function(keysArr) {
         var self = this,
             keysArrLen = keysArr.length,
             loadArr, loadArrLen, result, dMultiResult;

         /* Сформируем массив ключей записей, которые необходимо вычитать с бл */
         loadArr = $ws.helpers.filter(keysArr, function(key) {
                        return $ws.helpers.find(self._selectedRecords, function(rec) {
                           return key === rec.getKey();
                        }) ? false : true;
                     });
         loadArrLen = loadArr.length;

         /* Если удалили в пикере все записи, и он был открыт, то скроем его */
         if (this._isPickerVisible() && !keysArrLen) {
            this.hidePicker();
            this._toggleShowAllLink(false);
         }

         if(!this._options.multiselect) {
            /* Нужно поле делать невидимым, а не скрывать, чтобы можно было посчитать размеры */
            this._inputWrapper.toggleClass('ws-invisible', !!keysArrLen)
         }

         if(keysArrLen) {
           /* Если есть записи, которые нужно вычитать - вычитываем */
            if(loadArrLen) {
               result = new $ws.proto.Deferred();
               /* Если больше одной, то вычитаем используя ParallelDeferred */
               if (loadArrLen > 1) {
                  dMultiResult = new $ws.proto.ParallelDeferred({stopOnFirstError: false});

                  for (var i = 0; loadArrLen > i; i++) {
                     dMultiResult.push(this._dataSource.read(loadArr[i]).addCallback(function (record) {
                        self._selectedRecords.push(record);
                     }));
                  }

                  dMultiResult.done().getResult().addCallback(function() {
                     result.callback();
                  });
               } else {
                  /* Если выделенная запись одна, то просто вычитаем её */
                  this._dataSource.read(loadArr[0]).addCallback(function(record) {
                     self._selectedRecords.push(record);
                     result.callback();
                  })
               }

               result.addCallback(function() {
                  self._setLinkCollectionData(self._selectedRecords);
               })
            } else {
               /* Если ничего вычитывать не надо, то просто отрисуем записи */
               this._setLinkCollectionData(this._selectedRecords);
            }
         } else {
            this._setLinkCollectionData([]);
         }
      },

      /* Переопределённый метод из MultiSelectable
         удаляет из массива выбранных записей те записи, ключей которых нет в selectedKeys*/
      _setSelectedRecords: function() {
         var self = this;

         if(!this.getSelectedKeys().length) {
            this._selectedRecords = [];
            return;
         }

         $ws.helpers.forEach(this._selectedRecords, function(rec, index) {
            if(Array.indexOf(self._options.selectedKeys, rec.getKey()) === -1) {
               self._selectedRecords.splice(index, 1);
            }
         });
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
               onDrawItems: function() {
                  self._setInputWidth(self._container[0].offsetWidth - self._getWrappersWidth() - INPUT_WRAPPER_PADDING);
               },
               onCrossClick: function(e, id) {
                  self.removeItemsSelection([id]);
               }
            }
         });
      },

      /* Проверяет, нужно ли отрисовывать элемент или надо показать троеточие */
      _checkItemBeforeDraw: function(item) {
         var needDrawItem;

         /* Если элементы рисуются в пикере то ничего считать не надо */
         if(this._isPickerVisible()) {
            return true;
         }

         /* Тут считается ширина добавляемого элемента, и если он не влезает,
            то отрисовываться он не будет и покажется троеточие */
         needDrawItem = $ws.helpers.getTextWidth(item) < this._container[0].offsetWidth - (this._getWrappersWidth() + SHOW_ALL_LINK_WIDTH + INPUT_MIN_WIDTH);
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

      _pickerStateHandler: function(open) {
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
                  setTimeout(self._pickerStateHandler.bind(self, false), 0);
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
               if(!this.getText()) {
                  this.removeItemsSelection([this._options.selectedKeys.pop()]);
               }
               break;
            case $ws._const.key.down:
            case $ws._const.key.up:
               this._list && this._list._keyboardHover(e);
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
         this._showAllLink && this._showAllLink.toggleClass('ws-hidden', !show);
      },

      /**
       * Считает ширину элементов поля связи, кроме инпута
       * @returns {number}
       * @private
       */
      _getWrappersWidth: function() {
         return this._container.find('.controls-TextBox__afterFieldWrapper')[0].offsetWidth + this._container.find('.controls-TextBox__beforeFieldWrapper')[0].offsetWidth;
      },

      /**
       * Устанавливает ширину input'а и placeholder'а
       * @param width
       * @private
       */
      _setInputWidth: function(width) {
         this._inputField[0].style.width = width + 'px';
         if(this._compatPlaceholder) {
            this._compatPlaceholder[0].style.width = width + 'px';
         }
      },

      /* Заглушка, само поле связи не занимается отрисовкой */
      _redraw: nop,


      destroy: function() {
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
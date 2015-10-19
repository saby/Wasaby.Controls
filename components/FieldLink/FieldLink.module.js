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
         _options: {
            afterFieldWrapper: afterFieldWrapper,
            beforeFieldWrapper: beforeFieldWrapper,
            list: {
               className: 'js!SBIS3.CONTROLS.DataGridView',
               options: {
                  showHead: false,
                  columns: []
               }
            }
         },
         _inputWrapper: undefined,
         _linksWrapper: undefined,
         _dropAllButton: undefined,
         _showAllLink: undefined,
         _pickerLinkList: undefined,
         _linkCollection: undefined
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
         FieldLink.superclass._onListItemSelect.apply(this, arguments);
      },


      setDataSource: function(ds) {
         if(this._list) {
            this._list.setDataSource(ds)
         }

         FieldLink.superclass.setDataSource.apply(this, arguments);
      },

      _drawSelectedItems: function(keysArr) {
         var result = new $ws.proto.Deferred(),
             self = this,
             recordsKeysArr = $ws.helpers.map(this._selectedRecords, function(rec) {
                                 return rec.getKey();
                              }),
             /* Если записи нет, то сформируем массив для вычитки нужных записей */
             loadArr =  $ws.helpers.filter(keysArr, function(key) {
                           if(Array.indexOf(recordsKeysArr, key) === -1) {
                              return true
                           }
                        }),
             len = loadArr.length,
             dMultiResult;

         if (this._isPickerVisible() && !keysArr.length) {
            this.hidePicker();
            this._toggleShowAllLink(false);
         }

         if(!this._options.multiselect) {
            /* Нужно поле делать невидимым, а не скрывать, чтобы можно было посчитать размеры */
            this._inputWrapper.toggleClass('ws-invisible', !keysArr.length)
         }

         if(keysArr.length) {
           /* Если есть записи, которые нужно вычитать - вычитываем */
            if(len) {
               /* Если больше одной, то вычитаем используя ParallelDeferred */
               if (len > 1) {
                  dMultiResult = new $ws.proto.ParallelDeferred({stopOnFirstError: false});

                  for (var i = 0; len > i; i++) {
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
            handlers: {
               onDrawItems: function() {
                  self._setInputWidth(self._container[0].offsetWidth - self._getWrappersWidth() - INPUT_WRAPPER_PADDING);
               },
               onDrawItem: function(e, item) {
                  var needDrawItem;

                  /* Если элементы рисуются в пикере то ничего считать не надо */
                  if(self._isPickerVisible()) {
                     return;
                  }

                  /* Тут считается ширина добавляемого элемента, и если он не влезает,
                     то отрисовываться он не будет и покажется троеточие */
                  needDrawItem = $ws.helpers.getTextWidth(item) < self._container[0].offsetWidth - (self._getWrappersWidth() + SHOW_ALL_LINK_WIDTH + INPUT_MIN_WIDTH);
                  self._toggleShowAllLink(!needDrawItem);
                  e.setResult(needDrawItem);
               },
               onCrossClick: function(e, id) {
                  self.removeItemsSelection([id]);
               }
            }
         });
      },

      /**
       * Устанавливает данные к контрол
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
         this._listContainer && this._listContainer.toggleClass('ws-hidden', show);
         this._pickerLinkList.toggleClass('ws-hidden', !open);
         this._dropAllLink.toggleClass('ws-hidden', !open);
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
            closeByExternalOver: true,
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
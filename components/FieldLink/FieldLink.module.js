define('js!SBIS3.CONTROLS.FieldLink',
   [
      'js!SBIS3.CONTROLS.SuggestTextBox',
      'js!SBIS3.CONTROLS.DSMixin',
      'js!SBIS3.CONTROLS.FormWidgetMixin',
      'js!SBIS3.CONTROLS.MultiSelectable',
      'js!SBIS3.CONTROLS.FieldLinkItemsCollection',
      'html!SBIS3.CONTROLS.FieldLink/afterFieldWrapper',
      'html!SBIS3.CONTROLS.FieldLink/beforeFieldWrapper',
      'html!SBIS3.CONTROLS.FieldLink/linkTpl',
      'js!SBIS3.CONTROLS.MenuIcon'

   ],
   function(SuggestTextBox, DSMixin, FormWidgetMixin, MultiSelectable, FieldLinkItemsCollection, afterFieldWrapper, beforeFieldWrapper, linkTpl) {

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

      _drawFieldLinkItemsCollection: function() {
         var self = this;

         return new FieldLinkItemsCollection({
            element: this._linksWrapper.find('.controls-FieldLink__linksContainer'),
            displayField: this._options.displayField,
            keyField: this._options.keyField,
            handlers: {
               onDrawItems: function() {
                  self._updateInputWidth();
               },
               onDrawItem: function(e, item) {
                  var needDrawItem;

                  /* Если элементы рисуются в пикере то ничего считать не надо */
                  if(self._isPickerVisible()) {
                     return;
                  }

                  needDrawItem = self._needDrawItem(item);
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

      /**
       * Занимается перемещением контрола из пикера в поле и обратно.
       * @param toPicker
       * @private
       */
      _moveLinkCollection: function(toPicker) {
         this._linkCollection.getContainer().detach().appendTo(toPicker ? this._pickerLinkList : this._linksWrapper);
      },

      _pickerStateHandler: function(open) {
         this._toggleListContainer(!open);
         this._moveLinkCollection(open);
         this._toggleDropAllLink(open);
         this._linkCollection.reload();
      },

      /**
       * Тут считается ширина добавляемого элемента, и если он не влезает,
       * то отрисовываться он не будет и покажется троеточие
       * @private
       */
      _needDrawItem: function(item) {
         return $ws.helpers.getTextWidth(item) < this._container[0].offsetWidth - (this._getWrappersWidth() + SHOW_ALL_LINK_WIDTH + INPUT_MIN_WIDTH);
      },

      _setInputWidth: function(width) {
         this._inputField[0].style.width = width + 'px';
         if(this._compatPlaceholder) {
            this._compatPlaceholder[0].style.width = width + 'px';
         }
      },

      setDataSource: function(ds) {
         if(this._list) {
            this._list.setDataSource(ds)
         }

         FieldLink.superclass.setDataSource.apply(this, arguments);
      },

      _drawSelectedItems: function(keysArr, recordsArr) {
         var len  = keysArr.length,
             result = new $ws.proto.Deferred(),
             self = this,
             dMultiResult, recordsForDraw;


         if (this._isPickerVisible() && !len) {
            this.hidePicker();
            this._toggleShowAllLink(false);
         }

         if(!this._options.multiselect) {
            this._toggleInputWrapper(!len);
         }

         /* Создадим массив записей для отрисовки */
         if(!recordsArr.length) {
            /* Если есть выделенные записи */
            if (len) {
               /* Если выделенных записей больше чем одна, то запросим записи через ParallelDeferred */
               if (len > 1) {
                  dMultiResult = new $ws.proto.ParallelDeferred({stopOnFirstError: false});
                  recordsForDraw = [];

                  for (var i = 0; len > i; i++) {
                     dMultiResult.push(this._dataSource.read(keysArr[i]).addCallback(function (record) {
                        recordsForDraw.push(record);
                     }));
                  }

                  dMultiResult.done().getResult().addCallback(function() {
                     result.callback(recordsForDraw);
                  });
               } else {
                  /* Если выделенная запись одна, то просто прочитаем с бл */
                  this._dataSource.read(keysArr[0]).addCallback(function(record) {
                     result.callback([record]);
                  })
               }

               result.addCallback(function(records) {
                  self._setLinkCollectionData(records);
               })
            } else {
               this._setLinkCollectionData([]);
            }
         } else {
            /* Если нам пришли готовые record'ы то просто отрисуем их */
            this._setLinkCollectionData(recordsArr);
         }
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
         FieldLink.superclass._setPickerContent.apply(this, arguments);

         this._pickerLinkList = $('<div class="controls-FieldLink__picker-list"/>').appendTo(this._picker.getContainer().css('maxWidth', this._container[0].offsetWidth));
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
       * Возвращает, отображается ли сейчас пикер
       * @returns {*|Boolean}
       * @private
       */
      _isPickerVisible: function() {
         return this._picker && this._picker.isVisible();
      },

      /**
       * Скрывает/показывает контейнер автодополнения
       * @param show
       * @private
       */
      _toggleListContainer: function(show) {
         this._pickerLinkList && this._pickerLinkList.toggleClass('ws-hidden', show);
         this._listContainer && this._listContainer.toggleClass('ws-hidden', !show)
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
         this._showAllLink && this._showAllLink.toggleClass('ws-hidden', !show);
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
         this._setInputWidth(this._container[0].offsetWidth - this._getWrappersWidth() - INPUT_WRAPPER_PADDING);
      },

      /* Заглушка, так как самое поле связи не занимается отрисовкой */
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
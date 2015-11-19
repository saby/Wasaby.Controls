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
      'js!SBIS3.CONTROLS.Data.Model',
      'js!SBIS3.CONTROLS.Data.Adapter.Sbis',
      'js!SBIS3.CONTROLS.MenuIcon'

   ],
   function(SuggestTextBox, DSMixin, FormWidgetMixin, MultiSelectable, ActiveMultiSelectable, FieldLinkItemsCollection, afterFieldWrapper, beforeFieldWrapper, Model, SbisAdapter) {

      'use strict';

      var INPUT_WRAPPER_PADDING = 11;
      var SHOW_ALL_LINK_WIDTH = 11;
      var INPUT_MIN_WIDTH = 100;

      //FIXME для поддержки старых справочников, удалить как откажемся
      function recordConverter(rec) {
         return new Model({
            data: rec.toJSON(),
            adapter: new SbisAdapter()
         })
      }

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
               old: {
                  newDialog: 'js!SBIS3.CORE.DialogSelector',
                  newFloatArea: 'js!SBIS3.CORE.FloatAreaSelector'
               },
            //FIXME для поддержки старых справочников, удалить как откажемся
               new: {
                  newDialog: 'js!SBIS3.CONTROLS.DialogSelector',
                  newFloatArea: 'js!SBIS3.CONTROLS.FloatAreaSelector'
               }
            }
         },
         _inputWrapper: undefined,     /* Обертка инпута */
         _linksWrapper: undefined,     /* Контейнер для контрола выбранных элементов */
         _dropAllButton: undefined,    /* Кнопка очитски всех выбранных записей */
         _showAllLink: undefined,      /* Кнопка показа всех записей в пикере */
         _pickerLinkList: undefined,   /* Контейнер для контрола выбранных элементов в пикере */
         _linkCollection: undefined,   /* Контрол отображающий выбранные элементы */
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
            dictionaries: [],
            /**
             * @cfg {Boolean} Поддерживать старые представления данных
             */
            oldViews: false
         }
      },

      $constructor: function() {
         this.getContainer().addClass('controls-FieldLink');

         /* Проиницализируем переменные и event'ы */
         this._setVariables();
         this._initEvents();

         /* Создём контрол, который рисует элементы в ввиде текста с крестиком удаления */
         this._linkCollection = this._drawFieldLinkItemsCollection();

         if(this._options.oldViews) {
            $ws.single.ioc.resolve('ILogger').log('FieldLink', 'В 3.8.0 будет удалена опция oldViews, а так же поддержка старых представлений данных на диалогах выбора.');
         }
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
         var rec = this.getDataSet().getRecordByKey(item);
         this.getParent().showSelector(rec.get('template'), rec.get('selectionType'));
      },

      /**
       * Показывает диалог выбора, в качестве аргумента принимает имя шаблона в виде 'js!SBIS3.CONTROLS.MyTemplate'
       * @param template
       * @param type
       */
      showSelector: function(template, type) {
         var self = this,
             version = this._options.oldViews ? 'old' : 'new',
             selectorConfig = {
                //FIXME для поддержки старых справочников, удалить как откажемся
                old: {
                   currentValue: self.getSelectedKeys(),
                   selectionType: type,
                   selectorFieldLink: true,
                   handlers: {
                      onChange: function(event, selectedRecords) {
                         var keys = [],
                             rec;

                         if(selectedRecords[0] !== null) {
                            self._options.selectedItems.fill();
                            for (var i = 0, len = selectedRecords.length; i < len; i++) {
                               rec = recordConverter(selectedRecords[i]);
                               self._options.selectedItems.add(rec);
                               keys.push(rec.getId());
                            }
                            self.setSelectedKeys(keys);
                            self._notifyOnPropertyChanged('selectedKeys');
                            this.close();
                         }
                      }
                   }
                },
                new: {
                   currentSelectedKeys: self.getSelectedKeys(),
                   closeCallback: function (result) {
                      result && self.setSelectedKeys(result);
                   }
                }
             },
             commonConfig = {
                template: template,
                opener: this,
                parent: this,
                target: self.getContainer(),
                multiSelect: self._options.multiselect
             };



         requirejs([this._selector.type[version][this._options.selectRecordsMode]], function(ctrl) {
            /* Необходимо клонировать конфигурацию селектора, иначе кто-то может её испортить, если передавать по ссылке */
            new ctrl($ws.core.merge($ws.core.clone(self._selector.config), $ws.core.merge(selectorConfig[version], commonConfig)));
         });
      },

	   /**
	    * Возвращает выбранные элементы в виде текста
	    * @returns {string}
	    */
      getCaption: function() {
         var displayFields = [],
             self = this;

         this._getSelectedItems().each(function(rec) {
            displayFields.push(rec.get(self._options.displayField));
         });

         return displayFields.join(', ');
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
               self.togglePicker();
               self._pickerChangeStateHandler(self.isPickerVisible());
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
         if (!keysArrLen) {
            this._toggleShowAllLink(false);

            if(this.isPickerVisible()) {
               this.hidePicker();
            }
         }

         /* Нужно поле делать невидимым, а не скрывать, чтобы можно было посчитать размеры */
         if(!this._options.multiselect) {
            this._inputWrapper.toggleClass('ws-invisible', Boolean(keysArrLen))
         }

         if(keysArrLen) {
            this.getSelectedItems().addCallback(function(list){
               self._linkCollection.setItems(list);
            });
         } else {
            self._syncSelectedItems();
            self._linkCollection.setItems(this._getSelectedItems());
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
         if(this.isPickerVisible()) {
            return true;
         }

         /* Тут считается ширина добавляемого элемента, и если он не влезает,
            то отрисовываться он не будет и покажется троеточие, однако хотя бы один элемент в поле связи должен поместиться */
         if(this._checkWidth) {
            inputWidth = this._getInputWidth();
            needDrawItem = $ws.helpers.getTextWidth(item[0].outerHTML) + INPUT_MIN_WIDTH < inputWidth + SHOW_ALL_LINK_WIDTH;

            if(!needDrawItem && !this._linkCollection.getContainer().find('.controls-FieldLink__linkItem').length) {
               item[0].style.width = inputWidth - (this._options.multiselect ? INPUT_MIN_WIDTH : 0) + 'px';
               needDrawItem = true;
               this._checkWidth = false;
            }
         }
         this._toggleShowAllLink(!needDrawItem);
         return needDrawItem
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

      _keyDownBind: function (e) {
         switch (e.which) {
            case $ws._const.key.del:
               this.removeItemsSelectionAll();
               break;
            case $ws._const.key.backspace:
               var selectedKeys = this.getSelectedKeys();
               if(!this.getText()) {
                  this.removeItemsSelection([selectedKeys[selectedKeys.length - 1]]);
               }
               break;
         }
         FieldLink.superclass._keyDownBind.apply(this, arguments);
      },

      _keyUpBind: function(e) {
         FieldLink.superclass._keyUpBind.apply(this, arguments);
         switch (e.which) {
            case $ws._const.key.up:
            case $ws._const.key.down:
            case $ws._const.key.enter:
                /* Чтобы нормально работала навигация стрелками и не случалось ничего лишнего,
                   то запретим вспылтие события */
               if(this.isPickerVisible()) {
                  e.stopPropagation();
               }
               break;
         }
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
       * Обновляет ширину поле ввода, после того как отрисовались выбранные элементы
       * @private
       */
      _updateInputWidth: function() {
         this._checkWidth = true;
         this._inputField[0].style.width = this._getInputWidth() + 'px';
      },

      /* Заглушка, само поле связи не занимается отрисовкой */
      _redraw: $ws.helpers.nop,


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
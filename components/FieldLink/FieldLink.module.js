define('js!SBIS3.Engine.FieldLink',
   [
      'js!SBIS3.CORE.CompoundControl',
      'tmpl!SBIS3.Engine.FieldLink',
      'tmpl!SBIS3.Engine.FieldLink/resources/inputLinkTpl',
      'tmpl!SBIS3.Engine.FieldLink/resources/beforeFieldWrapper',
      'js!SBIS3.CONTROLS.FormWidgetMixin',
      'js!SBIS3.CONTROLS.PickerMixin',
      'js!SBIS3.CONTROLS.DSMixin',
      'js!SBIS3.CONTROLS.MultiSelectable',
      'js!SBIS3.CONTROLS.Suggest',
      'js!SBIS3.CONTROLS.Link',
      'js!SBIS3.CONTROLS.TextBox',
      'js!SBIS3.CONTROLS.IconButton'
   ],
   function(CompoundControl, dotTplFn, inputLinkTpl, beforeFieldTpl, FormWidgetMixin, PickerMixin, DSMixin, MultiSelectable, Suggest) {

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

   var FieldLink = CompoundControl.extend([FormWidgetMixin, PickerMixin, DSMixin, MultiSelectable],/** @lends SBIS3.Engine.FieldLink.prototype */{
      $protected: {
         _dotTplFn: dotTplFn,
         _options: {
            /**
             * @cfg {Boolean} Выбирается одно или несколько значений
             */
            multiSelect: false,
            /**
             * @cfg {Object} Конфигурация поля ввода
             */
            textBoxSettings: {},
            /**
             * @cfg {Object} Конфигурация автодополнения
             */
            suggestSettings: {},
            /**
             * @cfg {Object} Текст ссылки поля связи
             */
            linkCaption: '',
            /**
             * @cfg {Boolean} Отображать ли поле ввода
             */
            showTextBox: true
         },
         _fieldLinkController: undefined,
         _suggest: undefined,
         _textBox: undefined,
         _inputWrapper: undefined,
         _linksWrapper: undefined,
         _dropAllButton: undefined,
         _showAllLink: undefined,
         _drawPicker: false
      },

      $constructor: function() {
         this._container.removeClass('ws-area');
      },

      init: function() {
         var self = this;

         FieldLink.superclass.init.apply(this, arguments);

         /* Запишем переменные для дальнейшей работы с ними */
         if(this._options.linkCaption) {
            this._link = this._options.linkCaption && this.getChildControlByName(this.getName() + '_link');
         }

         if(this.hasChildControlByName('dropAllButton')) {
            this._dropAllButton = this.getChildControlByName('dropAllButton');
         }

         if(this._options.showTextBox) {
            this._textBox = this.getChildControlByName(this.getName() + '_textBox');
            this._inputWrapper = this._textBox.getContainer().find('.controls-TextBox__fieldWrapper');
            this._linksWrapper = this._textBox.getContainer().find('.controls-FieldLink__linksWrapper');

            if(this._options.multiSelect) {
               this._showAllLink = this._container.find('.controls-FieldLink__showAllLink');
            }
         }

         /* Вызываем reload, чтобы отрисовать начальный набор item'ов */
         this.reload();
         this._initEvents();

         /* Если начальных данных нет, то вызовем обновление ширины input'а вручную */
         if(!this._options.items.length) {
            this._updateInputWidth();
         }

         /* Если передали конфигурацию suggest'а то создадим его */
         if(Object.keys(this._options.suggestSettings).length && this._options.showTextBox) {
            this._createSuggest();
         }
      },
      /**
       * Удаляет все записи
       */
      dropAllLinks: function() {
         var self = $ws.helpers.instanceOfModule(this, 'SBIS3.Engine.FieldLink') ? this : this.getParent();

         self._showAllLink.addClass('ws-hidden');
         self.setItems([]);
      },

      /**
       * Удаляет запись/записи по id
       * @param {Array} id
       */
      dropLink: function(id) {
         var ds = this.getDataSet();

         ds.removeRecord(id);
         this._dataSource.sync(ds);
         this.reload();
      },

      getSuggest: function() {
         return this._suggest;
      },

      getTextBox: function() {
         return this._textBox;
      },

      _drawSelectedItems: function(keys) {
         var self = this,
             len = keys.length,
             records, result, dMultiResult, dataSet;

         /* Если выбранные ключи переданы, то надо запросить записи с бл */
         if(len) {
            dataSet = this.getDataSet();
            result = new $ws.proto.Deferred();

            /* Так как бл не умеет отдавать записи по набору ключей, то делаю так */
            if(this._options.multiSelect && len > 1) {
               dMultiResult = new $ws.proto.ParallelDeferred({stopOnFirstError: false});
               records = [];

               for(var i = 0; i < len; i++) {
                  dMultiResult.push(self._dataSource.read(keys[i]).addCallback(function(record) {
                     records.push(record);
                  }));
               }

               dMultiResult.done().getResult().addCallback(function() {
                  result.callback(records);
               });
            } else {
               /* Если ключ передали один, то просто попросим запись */
               self._dataSource.read(keys[0]).addCallback(function(record) {
                  result.callback([record]);
               });
            }

            result.addCallback(function(records) {
               dataSet.push(records);
               self._dataSource().sync(dataSet);
               self.reload();
            })
         }
      },

      _initEvents: function() {
         var self = this;

         if(this._options.showTextBox) {
            this._linksWrapper.click(this._linksWrapperClick.bind(this));

            if(this._options.multiSelect) {
               this._showAllLink.click(function(e) {
                  /* При отображении пикера, очистим элементы в инпуте */
                  self._clearItems();
                  self._updateInputWidth();

                  /* Покажем пикер и отрисуем там элементы */
                  self.showPicker();
                  self._redraw();

                  e.preventDefault();
                  e.stopPropagation();
               });
            }
         }
      },

      _linksWrapperClick: function(e) {
         var target = $(e.target);

         if(target.hasClass('controls-FieldLink__cross')) {
            this.dropLink(target.closest('.controls-FieldLink__inputLink').data('id'));
         }

         e.preventDefault();
         e.stopPropagation();
      },

      /**
       * Переопределённый метод из DSmixin'а
       * Тут считается ширина добавляемого элемента, и если он не влезает,
       * то отрисовываться он не будет и покажется троеточие
       * @param item
       * @param targetContainer
       * @param itemInstance
       * @private
       */
      _appendItemTemplate: function(item, targetContainer, itemInstance) {
         /* Если элементы рисуются в пикере или одиночный выбор или поля ввода вообще нет, то ничего считать не надо */
         if(!this._options.multiSelect || !this._options.showTextBox || this._isPickerVisible()) {
            FieldLink.superclass._appendItemTemplate.apply(this, arguments);
            return;
         }

         var drawItems = $ws.helpers.getTextWidth(itemInstance[0].innerHTML) < this._container[0].offsetWidth - (this._getWidthWithoutInput() + SHOW_ALL_LINK_WIDTH + INPUT_MIN_WIDTH);

         if(drawItems) {
            FieldLink.superclass._appendItemTemplate.apply(this, arguments);
         }

         this._showAllLink.toggleClass('ws-hidden', drawItems);
      },

      /**
       * Конфигурация пикера
       */
      _setPickerConfig: function () {
         var self = this;

         return {
            corner: 'bl',
            target: this.getTextBox().getContainer(),
            closeByExternalOver: false,
            closeByExternalClick: true,
            targetPart: true,
            handlers: {
               onClose: function() {
                  setTimeout(self._redraw.bind(self), 0);
               }
            }
         };
      },

      _dataLoadedCallback: function() {
         /* Если удалили все элементы из пикера, то скроем его и покажем инпут */
         if(this._isPickerVisible() && !this.getDataSet().getCount()) {
            this.hidePicker();
            this._showAllLink.addClass('ws-hidden');
            this._drawItemsCallback();
         }
      },

      _setPickerContent: function () {
         var pickerContainer = this._picker.getContainer();

         pickerContainer.addClass('controls-FieldLink__picker')
                        .css('max-width', this.getTextBox().getContainer()[0].clientWidth)
                        .click(this._linksWrapperClick.bind(this));
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
                      self.getDataSet().push(item);
                      self._redraw();
                  }
               }
            };

         this._suggest = new Suggest($ws.core.merge(this._options.suggestSettings, suggestConfig));
      },

      _onSuggestItemSelect: function() {

      },

      _beforeFieldWrapper: beforeFieldTpl,

      _getItemTemplate: function() {
         return inputLinkTpl;
      },

      /**
       * Переопределённый метод из DSMixin
       * Нужен для того, чтобы в шаблон передать признак того, отображается ли поле ввода
       * @param item
       * @returns {{item: *, showTextBox: (boolean|*)}}
       * @private
       */
      _buildTplArgs: function(item) {
         return {
            item: item,
            showTextBox: this._options.showTextBox
         };
      },

      _drawItemsCallback: function() {
         var dsCount = this.getDataSet().getCount();

         /* Если рисовались элементы в пикере, то ничего делать не будем */
         if(this._isPickerVisible()) {
            return;
         }

         if(this._options.showTextBox) {
            this._options.multiSelect ? this._toggleDropAllButton(dsCount > 1) : this._toggleInputWrapper(dsCount === 1);
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
         this._inputWrapper && this._inputWrapper.toggleClass('ws-hidden', !show)
      },

      /**
       * Скрывает/показывает кнопку удаления всех записей
       */
      _toggleDropAllButton: function(show) {
         this._dropAllButton && this._dropAllButton.toggle(show);
      },

      /**
       * Возвращает ширину элементов, которые занимают какую-либо ширину в поле связи (Нужно при различных расчётах ширины инпута)
       * @private
       */
      _getWidthWithoutInput: function() {
         var elems = [];

         if (this._dropAllButton && this._dropAllButton.isVisible()) {
            elems.push(this._dropAllButton.getContainer());
         }

         if(this._options.showTextBox) {

            if(this._options.textBoxSettings.afterFieldWrapper) {
               elems.push(this.getTextBox().getContainer().find('.controls-TextBox__afterFieldWrapper'))
            }

            if (this._options.multiSelect) {
               elems.push(this._linksWrapper);

               if ($ws.helpers.isElementVisible(this._showAllLink)) {
                  elems.push(this._showAllLink);
               }
            }
         }

         if(this._link) {
            elems.push(this._link.getContainer());
         }

         return $ws.helpers.reduce(elems, function(memo, elem) {return memo + elem[0].offsetWidth;}, 0);

      },

      /**
       * Расчитывает ширину поля ввода
       * @private
       */
      _updateInputWidth: function() {
         /* Не надо считать ширину, если поле ввода скрыто */
         if(!$ws.helpers.isElementVisible(this._inputWrapper)) return;

         this._inputWrapper[0].style.width = this._container[0].offsetWidth - this._getWidthWithoutInput() - INPUT_WRAPPER_PADDING + 'px';
      },

      destroy: function() {
         this._textBox =  undefined;

         this._linksWrapper.unbind('click');
         this._linksWrapper = undefined;

         if(this._options.multiSelect) {
            this._dropAllButton.unbind('click');
            this._dropAllButton = undefined;

            this._showAllLink.unbind('click');
            this._showAllLink = undefined;
         }
         FieldLink.superclass.destroy.apply(this, arguments);
      }
   });

   return FieldLink;

});
define('js!SBIS3.CONTROLS.StylesPanelNew', [
   'Core/CommandDispatcher',
   'js!SBIS3.CORE.CompoundControl',
   'js!SBIS3.CONTROLS.PopupMixin',
   'js!SBIS3.CONTROLS.HistoryController',
   'Core/helpers/collection-helpers',
   'Core/helpers/generate-helpers',
   'html!SBIS3.CONTROLS.StylesPanelNew',
   'Core/EventBus',
   'html!SBIS3.CONTROLS.StylesPanelNew/resources/presetItemTemplate',
   'html!SBIS3.CONTROLS.StylesPanelNew/resources/presetItemContentTpl',
   'js!SBIS3.CONTROLS.ListView',
   'js!SBIS3.CONTROLS.FontStyle',
   'js!SBIS3.CONTROLS.ColorStyle',
   'js!SBIS3.CONTROLS.IconButton',
   'js!SBIS3.CONTROLS.CheckBox',
   'css!SBIS3.CONTROLS.StylesPanelNew'
], function(CommandDispatcher, CompoundControl, PopupMixin, HistoryController, colHelpers, genHelpers, dotTplFn, EventBus) {


   'use strict';

   /**
    * Панель выбора цвета с возможностью выбора цвета, начертания шрифта, установки предвыбранных стилей и сохранения истории
    *
    * @class SBIS3.CONTROLS.StylesPanel
    * @extends SBIS3.CORE.CompoundControl
    * @control
    * @author Крайнов Дмитрий Олегович
    * @mixes SBIS3.CONTROLS.PopupMixin
    * @public
    */

   var StylesPanel = CompoundControl.extend([PopupMixin], /** @lends SBIS3.CONTROLS.StylesPanel.prototype */ {
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            closeButton: true,
            closeByExternalClick: true,
            /**
             * @cfg {Array.Object} Устанавливает набор цветов отображаемых в панели
             * @example
             * Конфигурация цветов через вёрстку компонента.
             * <pre>
             *     <options name="colors" type="array">
             *          <options>
             *             <option name="color">'#000000'</option>
             *          </options>
             *          <options>
             *             <option name="color">'#EF463A'</option>
             *          </options>
             *          <options>
             *            <option name="color">'#0055BB'</option>
             *          </options>
             *     </options>
             * </pre>
             */
            colors: null,
            /**
             * @cfg {Boolean} Устанавливает режим отображения панели Отметки цветом.
             * @remark
             * Панель может быть построена в двух состояниях:
             * <ol>
             *    <li>Простая. Предусмотрено только определение цвета, без возможности предпросмотра изменений и откатки.</li>
             *    <li>Составная. В рамках диалогового окна с возможностью отменить/применить изменения.</li>
             * </ol>
             */
            palleteRenderStyle: false,
            /**
             * @cfg {Boolean}
             * Оповещать об изменении сразу, не дожидаясь нажатия кнопки "Применить"
             */
            instantFireMode: false,
            /**
             * @cfg {Array of Number}
             * Устанавливает доступные размеры шрифта
             */
            fontSizes: [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72],
            /**
             * @cfg {Object}
             * Устанавливает начальную настройку панели
             */
            style: {
               'font-size': '14px',
               'color': '#000000'
            },
            /**
             * @cfg {Number}
             * Устанавливает количество колонок в режиме палитры
             * @see palleteRenderStyle
             */
            columnsCount: null,
            /**
             * @cfg {String}
             * Специальный id по которому будет загружаться/сохраняться история
             * @remark
             * В истории сохраняетя пять последних выбранных значений форматирования текста
             */
            historyId: null,
            /**
             * @cfg {Object}
             * Предустановленные наборы форматирования текст
             */
            presets: null,
            allowAutoColor: false
         },
         /* При нажатии на крестик, вернем стиль из backup-a */
         _backup: null,
         _currentStyle: null,
         /* текущий стиль форматирования текста */
         _historyController: null,
         /* Контроллер для работы с историей */
         _history: null,
         /* Набор элементов истории */
         /* подготовленные для отображения наборы форматирования в виде
          * {
          *  id : 1,
          *  json: {
          *    'font-weight': 'bold',
          *    'text-style': 'italic'
          *    }
          * }
          */
         _presetItems: null,
         /* ListView отображающий историю и предвыбранные наборы форматирования */
         _presetView: null,
         /* Ширина панели в режиме палитры */
         _palleteWidth: undefined,
         /* Компонент палитры */
         _palette: null,
         /* Компоненты выбора формата начертания */
         _size: null,
         _bold: null,
         _italic: null,
         _underline: null,
         _strikethrough: null,
         _pickerOpenHandler: undefined
      },

      $constructor: function() {
         var container = this.getContainer(),
             columnsCount = this._options.columnsCount,
             colorsCount, i;

         this._publish('changeFormat');
         CommandDispatcher.declareCommand(this, 'saveStylesPanel', this.saveHandler);

         if (this._options.paletteRenderStyle) {
            /* В режиме палитры нужно отображать цвета так, чтобы не было пустот при построении, либо пустот было минимально.
             * Поэтому нужно построить прямоугольник с максимальной длиной сторон равной 6, т.к
             * по спецификации известно, что максимальное количество отображаемых цветов по высоте равно равно 6
             */
            colorsCount = this._options.colors.length;
            if (columnsCount){
               this._palleteWidth = columnsCount <= 6 ? columnsCount * 32 : 192;
            }else {
               if (colorsCount <= 6) {
                  /* Когда элементов меньше 6 отображаемых их в одну колонку */
                  this._palleteWidth = 32;
               } else {
                  /* Когда цветов больше 6 нужно искать прямоугольник с подходящими размерами
                   * По высоте/ширине может быть от 2 до 6 цветов, поэтому нужно перебрать длины и найти
                   * ту которая является делитем числа цветов, а частное меньше 6,
                   * т.к. вторая сторона равна частному
                   * если такого прямоугольника нет, это может быть в случае простых чисел, либо у которых
                   * нет подходящих делителей, например 27 = 3 * 9, добавляем к числу 1 и снова пытаемся найти
                   * прямоугольник, тогда количество пустот будет минимально
                   */
                  while (!this._palleteWidth) {
                     i = 2;
                     while (i <= 6 && !this._palleteWidth) {
                        if (colorsCount % i === 0 && colorsCount / i <= 6) {
                           this._palleteWidth = i * 32;
                        }
                        i++;
                     }
                     if (!this._palleteWidth) {
                        colorsCount++;
                     }
                  }
               }
            }
            $('.controls-PopupMixin__closeButton', container).addClass('ws-hidden');
         }
      },

      init: function() {
         var
            self = this;

         StylesPanel.superclass.init.call(this);

         self._palette = self.getChildControlByName('Pallete');
         self._checkBox = self.getChildControlByName('CheckBox');

         self._checkBox.subscribe('onCheckedChange', function(e, checked) {
            if (checked) {
               self._palette.setSelectedKey("auto");
               self._palette.redraw();
            } else if (self._palette.getSelectedIndex() == -1) {
               self._palette.setSelectedIndex(0);
            }
         });
         self._palette.subscribe('onSelectedItemChange', function(e, item) {
            if (item) {
               self._checkBox.setChecked(false);
            }
         });

         if (self._options.paletteRenderStyle) {
            /* В случае палитру нужно подписаться на смену цвета, т.к. выбор происходит без подтверждения*/
            self._palette.subscribe('onSelectedItemChange', this._paletteClickHandler.bind(self));
            self._palette.getContainer().width(self._palleteWidth);
         } else {
            /* находим контролы отвечающие за начертание шрифта */
            this._size = this.getChildControlByName('FontSize');
            this._bold = this.getChildControlByName('Bold');
            this._italic = this.getChildControlByName('Italic');
            this._underline = this.getChildControlByName('Underline');
            this._strikethrough = this.getChildControlByName('Strikethrough');
            if (self._options.historyId || self._options.presets) {
               self._presetView = this.getChildControlByName('presetView');

               self.subscribeTo(self._presetView, 'onItemActivate', function(e, itemObj) {
                  self._activatePresetByKey(itemObj['id']);
               });
               if (self._options.presets) {
                  /* т.к. предустановленные стили приходят в формате JSON, то нужно их подготовить для отображения в ListView */
                  self._preparePreset();
                  self._presetView.setItems(this._prepareItems(this._presetItems));
               }
               if (self._options.historyId) {
                  self._historyInit();
               }
            }
            self._pickerOpenHandler = function() {
               self._size._picker._container.on('mousedown focus', self._blockFocusEvents);
            }.bind(self);
            self._container.on('mousedown focus', self._blockFocusEvents);
            //TODO: наилютейший костыль чтобы combobox не брал на себя фокус при открытии/закрытии popup`a
            self._size._scrollToItem = function(){};
            self._size.setActive = function(){};
            self._size.once('onPickerOpen', self._pickerOpenHandler);
         }

         if (this._options.instantFireMode === true) {
            var handler = this.saveHandlerForInstanceFireMode.bind(this);
            this._palette.subscribe('onSelectedItemChange', handler);
            this._size.subscribe('onSelectedItemChange', handler);
            this._bold.subscribe('onActivated', handler);
            this._italic.subscribe('onActivated', handler);
            this._underline.subscribe('onActivated', handler);
            this._strikethrough.subscribe('onActivated', handler);
         }

         this.subscribe('onClose', this.onClose.bind(this));

         this._currentStyle = this._getStyle();
         this._backup = this._getStyle();
      },

      // стреляет событием и прокидывает выбранный формат
      saveHandler: function(format) {
         this._currentStyle = format ? format : this._getStyle();
         this._backup = format ? format : this._getStyle();
         this._notify('changeFormat', this._getInlineStyle(this._currentStyle));
         this.hide();
         if (this._options.historyId && !format) {
            this._saveHistory();
         }
      },

      saveHandlerForInstanceFireMode: function() {
         this._currentStyle = this._getStyle();
         this._notify('changeFormat', this._getInlineStyle(this._currentStyle));
      },

      onClose: function() {
         if (this._options.instantFireMode === true && this._getInlineStyle(this._backup) !== this._getInlineStyle(this._currentStyle)) {
            this.setInlineStyle(this._getInlineStyle(this._backup));
         }
      },

      _getStyle: function() {
         var style = {};

         if (this._options.paletteRenderStyle) {
            style = {
               'color': this._palette.getSelectedKey()
            }
         } else {
            style['font-size'] = this._size.getSelectedKey() + 'px';
            style['color'] = this._palette.getSelectedKey() || 'auto';
            this._bold.isChecked() && (style['font-weight'] = 'bold');
            this._italic.isChecked() && (style['font-style'] = 'italic');
            this._underline.isChecked() && (style['text-decoration'] = 'underline');
            if (this._strikethrough.isChecked()) {
               style['text-decoration'] = this._underline.isChecked() ? style['text-decoration'] + ' line-through' : 'line-through';
            }
         }
         return style;
      },

      _preparePreset: function() {
         var preparedPreset = [],
            preparedItem;
         colHelpers.forEach(this._options.presets, function(style) {
            preparedItem = {
               id: genHelpers.randomId(),
               json: style
            };
            preparedPreset.push(preparedItem);
         });
         this._presetItems = preparedPreset;
      },

      /* преобразует элементы для вставки */
      _prepareItems: function(items) {
         var self = this,
            preparedItems = [],
            preparedItem;
         colHelpers.forEach(items, function(item) {
            preparedItem = {
               id: item.id,
               style: self._getInlineStyle(item.json)
            };
            preparedItems.push(preparedItem);
         });
         return preparedItems;
      },

      /**
       * Десериализовать стили
       *
       * @param {String} - то что возвращает getInlineStyle
       */
      setInlineStyle: function(style) {
         var jsonStyle = '{"' + style.split(';').filter(function(v) {
            return v.length > 0;
         }).join(';').replace(/;/gi, '","').replace(/:/gi, '":"') + '"}';

         var styles = {};

         try {
            styles = JSON.parse(jsonStyle);
         } catch (e) {}

         if (styles.hasOwnProperty('font-size')) {
            this._size.setSelectedKey(styles['font-size'].slice(0, -2));
         }

         if (styles.hasOwnProperty('color')) {
            this._palette.setSelectedKey(styles['color']);
         }

         if (styles.hasOwnProperty('font-weight') && styles['font-weight'] === 'bold') {
            this._bold.setChecked(true);
         } else {
            this._bold.setChecked(false);
         }

         if (styles.hasOwnProperty('font-style') && styles['font-style'] === 'italic') {
            this._italic.setChecked(true);
         } else {
            this._italic.setChecked(false);
         }

         if (styles.hasOwnProperty('text-decoration')) {
            if (styles['text-decoration'].indexOf('underline') >= 0) {
               this._underline.setChecked(true);
            } else {
               this._underline.setChecked(false);
            }
            if (styles['text-decoration'].indexOf('line-through') >= 0) {
               this._strikethrough.setChecked(true);
            } else {
               this._strikethrough.setChecked(false);
            }
         } else {
            this._underline.setChecked(false);
            this._strikethrough.setChecked(false);
         }

         this.saveHandler();
      },

      /**
       * Возвращает строчку содержащию текущее форматирование текста в css формате для вставки в style
       * @returns {String}
       * @see getJSONStyle
       */
      getInlineStyle: function() {
         return this._getInlineStyle(this._currentStyle);
      },
      /**
       * Возвращает объект в формате JSON содержащий текущее форматирование текста
       * @returns {Object}
       * @see getJSONStyle
       */
      getJSONStyle: function() {
         return this._currentStyle;
      },

      _historyInit: function() {
         this._historyController = new HistoryController({
            historyId: this._options.historyId
         });
         this._history = this._historyController.getHistory();

         if (this._history) {
            this._presetView.setItems(this._prepareItems(this._history));
         } else {
            this._history = [];
            this._presetView.toggle();
         }
      },

      /* собирает строку css стилей из текущего  */
      _getInlineStyle: function(format) {
         var css = '';
         colHelpers.forEach(format, function(value, option) {
            css += option + ':' + value + ';';
         });
         return css;
      },

      _activatePresetByKey: function(key) {
         var preset;

         preset = colHelpers.find(this._options.presets ? this._presetItems : this._history, function(item) {
            return item.id == key;
         }, this, false);
         this.saveHandler(preset.json);
      },

      /* выбор цвета в режиме палитры нужно передать лишь цвет */
      _paletteClickHandler: function(e, color) {
         this.saveHandler({
            'color': color
         });
      },

      /* сохраняет в историю не более 5 элементов */
      _saveHistory: function() {
         var historyFormat;

         !this._history.length && this._presetView.toggle();
         this._history.length > 4 && this._history.pop();

         historyFormat = {
            id: genHelpers.randomId(),
            json: this._currentStyle
         };

         this._history.unshift(historyFormat);
         this._historyController.setHistory(this._history, true);
         this._presetView.setItems(this._prepareItems(this._history));
      },

      getStylesObject: function() {
         var
            styles = {};
         if (this._options.paletteRenderStyle) {
            styles = {
               'color': this._palette.getSelectedKey()
            }
         } else {
            styles = {
               fontsize: this._size.getSelectedKey(),
               color: this._palette.getSelectedKey(),
               bold: this._bold.isChecked(),
               italic: this._italic.isChecked(),
               underline: this._underline.isChecked(),
               strikethrough: this._strikethrough.isChecked()
            }
         }
         return styles;
      },

      setStylesFromObject: function(styles) {
         this._palette.setSelectedKey(styles.color);
         if (!this._options.paletteRenderStyle) {
               this._size.setSelectedKey(styles.fontsize);
               this._bold.setChecked(styles.bold);
               this._italic.setChecked(styles.italic);
               this._underline.setChecked(styles.underline);
               this._strikethrough.setChecked(styles.strikethrough);
         }
      },

      //TODO: убрать метод после закртытия задачи: https://inside.tensor.ru/opendoc.html?guid=b67f7f5b-8b91-4fcb-8f83-74fd29d64db4
      _blockFocusEvents: function(event) {
         var eventsChannel = EventBus.channel('WindowChangeChannel');
         event.preventDefault();
         event.stopPropagation();
         //Если случился mousedown то нужно нотифицировать о клике, перебив дефолтное событие перехода фокуса
         if(event.type === 'mousedown') {
            eventsChannel.notify('onDocumentClick', event);
         }
      },
      destroy: function() {
         StylesPanel.superclass.destroy.apply(this, arguments);
         if (!this._options.paletteRenderStyle) {
            this._container.off('mousedown focus', this._blockFocusEvents);
            this._size.unsubscribe('onPickerOpen', this._pickerOpenHandler);
         }
      }
   });

   return StylesPanel;

});

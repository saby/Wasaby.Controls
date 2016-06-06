/**
 * Created by ps.borisov on 21.05.2016.
 */
define('js!SBIS3.CONTROLS.RichEditor',
   [
      'js!SBIS3.CONTROLS.TextBoxBase',
      'html!SBIS3.CONTROLS.RichEditor',
      'js!SBIS3.CONTROLS.Button',
      'js!SBIS3.CONTROLS.Utils.RichTextAreaUtil',
      'js!SBIS3.CORE.FileStorageLoader',
      'browser!js!SBIS3.CONTROLS.RichEditor/resources/config',
      'js!SBIS3.CONTROLS.ToggleButton',
      'js!SBIS3.CONTROLS.RichEditor.RichEditorMenuButton',
      'js!SBIS3.CONTROLS.RichEditor.RichEditorDropdown',
      'js!SBIS3.CORE.PluginManager',
      'js!SBIS3.CONTROLS.Utils.ImageUtil',
      'js!SBIS3.CONTROLS.Utils.Sanitize',
      'css!SBIS3.CORE.RichContentStyles',
      'i18n!js!SBIS3.CONTROLS.RichEditor'
   ], function(TextBoxBase, dotTplFn, Button, RichUtil, FileLoader, defaultConfig, ToggleButton, MenuButton, Dropdown,  PluginManager, ImageUtil, Sanitize) {
      'use strict';
      /**
      * @controls-RichEditor__overflowVisible  делает OverFlow: visible
      */

      var
         constants = {
            blankImgPath: 'https://cdn.sbis.ru/richeditor/26-01-2015/blank.png',
            maximalPictureSize: 120,
            toolbarHeight: 24,
            imageOffset: 40, //16 слева +  24 справа
            defaultYoutubeHeight: 300,
            minYoutubeHeight: 214,
            defaultYoutubeWidth: 430,
            minYoutubeWidth: 350,
            styles: {
               title: {inline: 'span', classes: 'titleText'},
               subTitle: {inline: 'span', classes: 'subTitleText'},
               selectedMainText: {inline: 'span', classes: 'selectedMainText'},
               additionalText: {inline: 'span', classes: 'additionalText'}
            }
         },

      RichEditor = TextBoxBase.extend({
         _dotTplFn: dotTplFn,
         _defaultItems: defaultConfig || {},
         $protected : {
            _options : {
               minimalHeight: 200,
               maximalHeight: 300,
               uploadImageOnDrop: true,
               editorConfig: {
                  plugins: 'media,paste,lists',
                  inline: true,
                  fixed_toolbar_container: '.controls-RichEditor__FakeArea',
                  relative_urls: false,
                  convert_urls: false,
                  formats: constants.styles,
                  paste_webkit_styles: 'color font-size text-align text-decoration width height max-width padding padding-left padding-right padding-top padding-bottom',
                  paste_retain_style_properties: 'color font-size text-align text-decoration width height max-width padding padding-left padding-right padding-top padding-bottom',
                  paste_as_text: true,
                  extended_valid_elements: 'div[class|onclick|style],img[unselectable|class|src|alt|title|width|height|align|name|style]',
                  body_class: 'ws-basic-style',
                  tools: 'inserttable',
                  invalid_elements: 'script',
                  paste_data_images: false,
                  statusbar: false,
                  toolbar: false,
                  menubar: false
               },
               placeholder: '',
               toolbar: true,
               toolbarVisible: true,
               userItems: {}
            },
            _fakeArea: undefined,
            _tinyEditor: undefined,
            _lastHeight: undefined,
            _tinyReady: null,
            _readyContolDeffered: null,
            _saveBeforeWindowClose: null,
            _changeValueFromSetText: false,
            _textAlignState: {
               left: false,
               center: false,
               right: false,
               justify: false
            },
            _areaEditor: undefined,
            _sourceContainer: undefined,
            _textFormats: {
               title: false,
               subTitle: false,
               selectedMainText: false,
               additionalText: false
            },
            _textState: {
               bold: false,
               italic: false,
               underline:  false,
               strikethrough:  false
            },
            _fileLoader: undefined,
            _tinyIsInit: false,
            _lastSelection: undefined,
            _enabled: undefined,
            _typeInProcess: false,
            _instances: {},
            _itemsContext: undefined,
            _toolbarContainer: undefined,
            _toggleToolbarButton: undefined,
            _needPasteImage: false,
            _buttonsState: undefined,
            _clipboardText: undefined,
            _lastRng: undefined,
         },

         _modifyOptions: function(options) {
            if (options.editorConfig === undefined || Object.prototype.toString.call(options.editorConfig) !== '[object Object]') {
               options.editorConfig = {};
            }
            options.editorConfig.browser_spellcheck = options.spellcheck;
            return options;
         },

         $constructor: function() {
            var
               self = this,
               editorHeight;
            this._publish('onInitEditor');
            this._sourceContainer = this._container.find('.controls-RichEditor__SourceContainer');
            this._areaEditor = this._sourceContainer.find('.controls-RichEditor__SourceArea').bind('input', this._onChangeAreaValue.bind(this));
            this._readyContolDeffered = new $ws.proto.Deferred();
            this._dChildReady.push(this._readyContolDeffered);// не уверен что это вообще надо делать
            this._dataReview = this._container.find('.controls-RichEditor__DataReview');
            this._tinyReady = new $ws.proto.Deferred();
            this._inputControl = this._container.find('.controls-RichEditor__EditorFrame');
            this._fakeArea = this._container.find('.controls-RichEditor__FakeArea');
            this.subscribe('onFocusOut', function(){
               self.saveToHistory(self._curval);
            });

            //Расчёт высоты редактора учитывая открытую панель инструментов
            editorHeight = this._options.autoHeight ?
            this._options.maximalHeight || this._options.minimalHeight :
               this._container.height();
            //Конфигурирование высоты редактора
            if (this._options.autoHeight) {
               //Если задана минимальная высота
               if (this._options.minimalHeight) {
                  //Если задана максимальная высота и она меньше, чем минимальная, то задаем её равную минимальной
                  if (this._options.maximalHeight) {
                     if (this._options.minimalHeight > this._options.maximalHeight) {
                        this._options.maximalHeight = this._options.minimalHeight;
                     }
                  } else {
                     //Если не задана максимальная высота, то сбрасываем её в '' (чтобы css применился)
                     this._options.maximalHeight = '';
                  }
               } else { //Иначе (если минимальная высота не задана)
                  //Сбрасываем минимальную высоту в '' (чтобы css применился)
                  this._options.minimalHeight = '';
                  //Если не задана максимальная высота, то сбрасываем её в '' (чтобы css применился)
                  if (!this._options.maximalHeight) {
                     this._options.maximalHeight = '';
                  }
               }
               this._container.css('height', 'auto');
               this._inputControl.css({
                  'max-height': this._options.maximalHeight,
                  'min-height': this._options.minimalHeight
               });
            } else {
               this._inputControl.css('height',  editorHeight + 'px');
            }
            this._options.editorConfig.selector = '#' + this.getId() + ' .controls-RichEditor__EditorFrame';
            if (!this._options.editorConfig.height) {
               this._options.editorConfig.height =  editorHeight;
            }
            this._options.editorConfig.setup = function(editor) {
               self._tinyEditor = editor;
               self._bindEvents();
            };


            // Наш чудо-платформенный механизм установки состояния задизабленности отрабатывает не в то время.
            // Для того, чтобы отловить реальное состояние задизабленности нужно дожидаться события onInit.
            this.once('onInit', function() {
               //вешать обработчик copy/paste надо в любом случае, тк редактор может менять состояние Enabled
               RichUtil.markRichContentOnCopy(this._dataReview);
               if (!this.isEnabled()) {
                  this._readyContolDeffered.callback();
                  this._notify('onReady');
               }
               this._updateDataReview(this.getText());
            }.bind(this));

            this._togglePlaceholder();
            if (this._options.toolbar) {
               this._toolbarContainer = this._container.find('.controls-RichEditor__Toolbar');
               //Находим кнопку переключения видимости тулбара и биндим на неё клик
               this._toggleToolbarButton = this._container.find('.controls-RichEditor__ToolbarToggleButton').bind('click', this._onClickToggleButton.bind(this));

               if (!this._options.toolbarVisible) {
                  this._toolbarContainer.css('height', 0);
                  this._container.addClass('controls-RichEditor__HideToolbar');
               }
            }
         },
         /*БЛОК ПУБЛИЧНЫХ МЕТОДОВ*/

         /**
          * Добавить youtube видео
          * @param {String} link Ссылка на youtube видео.
          * @return {Boolean} Результат добавления видео (true - добавилось, false - не добавилось).
          * @example
          * Добавить в богатый редактор youtube видео по ссылке
          * <pre>
          *     richEditor.subscribe('onReady', function() {
         *        richEditor.addYouTubeVideo('http://www.youtube.com/watch?v=...');
         *     });
          * </pre>
          */
         addYouTubeVideo: function(link) {
            var result = false,
               content,
               id;

            if (typeof link !== 'string') {
               return result;
            }

            if ((id = this._getYouTubeVideoId($ws.helpers.escapeTagsFromStr(link, [])))) {
               content = [
                  '<iframe',
                  ' width="' + constants.defaultYoutubeWidth + '"',
                  ' height="' + constants.defaultYoutubeHeight + '"',
                  ' style="min-width:' + constants.minYoutubeWidth + 'px; min-height:' + constants.minYoutubeHeight + 'px;"',
                  ' src="' + '//www.youtube.com/embed/' + id + '"',
                  ' frameborder="0"',
                  ' allowfullscreen>',
                  '</iframe>'
               ].join('');
               this.insertHtml(content);
               result = true;
            }

            return result;
         },

         /**
          * Устанавливает минимальную высоту текстового поля редактора
          * @param {Number} value Минимальная высота поля редактора
          */
         setMinimalHeight: function(value) {
            var changeBlock =  this._options.editorConfig.inline ? this._inputControl : $(this._tinyEditor.iframeElement);
            if (this._options.autoHeight && typeof value === 'number') {
               this._options.minimalHeight = value;
               if (this._options.minimalHeight) {
                  if (this._options.maximalHeight && this._options.maximalHeight < value) {
                     this._options.maximalHeight = value;
                  }
               } else {
                  this._options.minimalHeight = '';
               }
               changeBlock.css({
                  'max-height': this._options.maximalHeight,
                  'min-height': this._options.minimalHeight
               });
            }
         },

         /**
          * Устанавливает максимальную высоту текстового поля редактора
          * @param {Number} value Максимальная высота поля редактора
          */
         setMaximalHeight: function(value) {
            var changeBlock =  this._options.editorConfig.inline ? this._inputControl : $(this._tinyEditor.iframeElement);
            if (this._options.autoHeight && typeof value === 'number') {
               this._options.maximalHeight = value;
               if (this._options.maximalHeight) {
                  if (this._options.minimalHeight && this._options.maximalHeight < this._options.minimalHeight) {
                     this._options.minimalHeight = value;
                  }
               } else {
                  this._options.maximalHeight = '';
               }
               changeBlock.css({
                  'max-height': this._options.maximalHeight,
                  'min-height': this._options.minimalHeight
               });
            }
         },

         /**
          * <wiTag group="Управление">
          * Добавить в текущую позицию указанный html-код
          * @param {String} html Добавляемый html
          * @example
          * Вставить цитату
          * <pre>
          *    tinyEditor.insertHtml('<blockquote>Текст цитаты</blockquote>');
          * </pre>
          */
         insertHtml: function(html) {
            if (typeof html === 'string' && this._tinyEditor) {
               this._changeValueFromSetText = false;
               this._performByReady(function() {
                  this._tinyEditor.insertContent(html);
               }.bind(this));
            }
         },

         /**
          * Возвращает минимальную высоту текстового поля редактора
          * @returns {Number}
          */
         getMinimalHeight: function() {
            if (this._options.autoHeight) {
               return this._options.minimalHeight;
            }
         },

         /**
          * Возвращает максимальную высоту текстового поля редактора
          * @returns {Number}
          */
         getMaximalHeight: function() {
            if (this._options.autoHeight) {
               return this._options.maximalHeight;
            }
         },

         setText: function(ctxVal) {
            var autoFormat = true;
            if (!this._typeInProcess && !$ws.helpers.compareValues(ctxVal, this._curValue()) && ctxVal !== undefined) {
               //Подготовка значения если пришло не в html формате
               if (ctxVal && ctxVal[0] !== '<') {
                  ctxVal = '<p>' + ctxVal.replace(/\n/gi, '<br/>') + '</p>';
                  autoFormat = false;
               }
               ctxVal = this._replaceWhitespaces(ctxVal);
               this._changeValueFromSetText = true;

               if (this.isEnabled() && this._tinyReady.isReady()) {
                  this._tinyEditor.setContent(this._prepareContent(ctxVal), autoFormat ? undefined : {format: 'raw'});
                  this._tinyEditor.undoManager.add();
                  if (this.isActive() && !this._sourceContainerIsActive() && !!ctxVal) {
                     this.setCursorToTheEnd();
                  }
                  this._curval = this._getTinyEditorValue();
               } else {
                  this._curval = ctxVal || '';
                  this._inputControl.html(Sanitize(this._curval));
               }
               this._options.text = this._curval;
               this._notify('onTextChange', this._curval);
               this._notifyOnPropertyChanged('text');
               this._updateDataReview(this._curval);
               if (this.isMarked()) {
                  this.validate();
               }
            }
         },

         setActive: function(active) {
            //если тини еще не готов а мы передадим setActive родителю то потом у тини буддет баг с потерей ренжа,
            //поэтому если isEnabled то нужно передавать setActive родителю только по готовности тини
            var args = [].slice.call(arguments);
            if (active && this._needFocusOnActivated() && this.isEnabled()) {
               this._performByReady(function() {
                  this._tinyEditor.focus();
                  RichEditor.superclass.setActive.apply(this, args);
               }.bind(this));
            } else {
               RichEditor.superclass.setActive.apply(this, args);
            }
         },

         destroy: function() {
            $ws._const.$win.unbind('beforeunload', this._saveBeforeWindowClose);
            this.saveToHistory(this._curval);
            RichUtil.unmarkRichContentOnCopy(this._dataReview);
            RichUtil.unmarkRichContentOnCopy(this._inputControl);
            //проверка на то созадвался ли tinyEditor
            if (this._tinyEditor && this._tinyReady.isReady()) {
               this._tinyEditor.remove();
               this._tinyEditor.destroy();
               if (this._tinyEditor.theme ) {
                  if (this._tinyEditor.theme.panel) {
                     this._tinyEditor.theme.panel._elmCache = null;
                     this._tinyEditor.theme.panel.$el = null;
                  }
                  this._tinyEditor.theme.panel = null;
               }
               this._tinyEditor.theme = null;
            }
            $ws.helpers.trackElement(this._container, false);
            this._container.unbind('keydown keyup');
            this._areaEditor.unbind('input');
            this._tinyEditor = null;
            this._sourceContainer  = null;
            this._fakeArea = null;
            this._areaEditor = null;
            this._dataReview = null;
            this._options.editorConfig.setup = null;
            if (!this._readyContolDeffered.isReady()) {
               this._readyContolDeffered.errback();
            }
            for (var i in this._instances) {
               this._instances[i].destroy instanceof Function && this._instances[i].destroy();
            }
            if (this._options.toolbar) {
               this._toggleToolbarButton.unbind('click');
               this._toggleToolbarButton = null;
            }
            this._instances = null;
            this._buttonsState = null;
            this._options.userItems = null;
            this._toolbarContainer  = null;
            RichEditor.superclass.destroy.apply(this, arguments);
         },

         /**
          * <wiTag group="Управление">
          * Сохранить в историю.
          * Сохраняет на бизнес логику, в пользовательский конфиг, строку прявязывая её к имени контрола.
          * В памяти истории может хранится до 10 значений.
          * @param valParam {String} строковое значение
          * @see userItems
          * @public
          */
         pasteFromBufferWithStyles: function(onAfterCloseHandler, target) {
            var
               self = this,
               dialog,
               eventResult,
               onPaste = function(event) {
                  var data = event.clipboardData.getData ? event.clipboardData.getData('text/html') : '';
                  if (!data) {
                     data = event.clipboardData.getData ? event.clipboardData.getData('text/plain') : window.clipboardData.getData('Text');
                  }
                  //получение результата из события  BeforePastePreProcess тини потому что оно возвращает контент чистым от тегов Ворда,
                  //withStyles: true нужно чтобы в нашем обработчике BeforePastePreProcess мы не обрабатывали а прокинули результат в обработчик тини
                  eventResult= self.getTinyEditor().fire('BeforePastePreProcess', {content: data, withStyles: true});
                  data = eventResult.content;
                  self.insertHtml(data);
                  dialog.close();
                  event.stopPropagation();
                  event.preventDefault();
                  return false;
               },
               createDialog = function() {
                  $ws.single.Indicator.hide();
                  require(['js!SBIS3.CORE.Dialog'], function(Dialog) {
                     dialog = new Dialog({
                        resizable: false,
                        width: 348,
                        border: false,
                        top: target && target.offset().top + target.height(),
                        left: target && target.offset().left - (348 - target.width()),
                        autoHeight: true,
                        keepSize: false,
                        opener: self._options.fieldRichEditor,
                        handlers: {
                           onReady: function () {
                              var
                                 container = this.getContainer(),
                                 label = $('<div class="controls-RichEditor__PasteWithStylesLabel">Нажмите CTRL + V для вставки текста из буфера обмена с сохранением стилей</div>');
                              container.append(label)
                                 .addClass('controls-RichEditor__PasteWithStyles');
                              new Button({
                                 caption: rk('Отменить'),
                                 tabindex: -1,
                                 className: 'controls-Button__light',
                                 element: $('<div class="controls-RichEditor__PasteWithStylesButton">').appendTo(container),
                                 handlers: {
                                    onActivated: function () {
                                       dialog.close();
                                    }
                                 }
                              });
                              document.addEventListener('paste', onPaste, true);
                           },
                           onAfterClose: function () {
                              document.removeEventListener('paste', onPaste, true);
                              if (typeof onAfterCloseHandler === 'function') {
                                 onAfterCloseHandler();
                              }
                           }
                        }
                     });
                  });
               };
            this._tinyEditor.selection.lastFocusBookmark = null;
            $ws.single.Indicator.show();
            PluginManager.getPlugin('Clipboard', '1.0.1.0', {silent: true}).addCallback(function(clipboard) {
               if (clipboard.getContentType && clipboard.getHtml) {
                  clipboard.getContentType().addCallback(function(ContentType) {
                     clipboard[ContentType === 'Text/Html' || ContentType === 'Text/Rtf' || ContentType === 'Html' || ContentType === 'Rtf' ? 'getHtml' : 'getText']()
                        .addCallback(function(html) {
                           $ws.single.Indicator.hide();
                           //получение результата из события  BeforePastePreProcess тини потому что оно возвращает контент чистым от тегов Ворда,
                           //withStyles: true нужно чтобы в нашем обработчике BeforePastePreProcess мы не обрабатывали а прокинули результат в обработчик тини
                           eventResult = self.getTinyEditor().fire('BeforePastePreProcess', {content: html, withStyles: true});
                           html = eventResult.content;
                           self.insertHtml(html);
                           if (typeof onAfterCloseHandler === 'function') {
                              onAfterCloseHandler();
                           }
                        }).addErrback(function() {
                           createDialog();
                        });
                  }).addErrback(function() {
                     createDialog();
                  });
               } else {
                  createDialog();
               }
            }).addErrback(function() {
               createDialog();
            });
         },

         saveToHistory: function(valParam) {
            var
               self = this,
               isDublicate = false;
            if (valParam && typeof valParam === 'string' && self._changeValueFromSetText === false) {
               this.getHistory().addCallback(function(arrBL){
                  if( typeof arrBL  === 'object') {
                     $ws.helpers.forEach(arrBL, function (valBL, keyBL) {
                        if (valParam === valBL) {
                           isDublicate = true;
                        }
                     });
                  }
                  if (!isDublicate) {
                     self._addToHistory(valParam);
                  }
               });
            }
         },

         /**
          * <wiTag group="Управление">
          * Получить историю ввода.
          * Вовзращает деферред истории ввода вводимых значений.
          * @return {$ws.proto.Deferred} в случае успеха, дефферед врнет массив данных
          * @example
          * <pre>
          *    fre.getHistory().addCallback(function(arrBL){
          *       var historyData = Array();
          *       $ws.helpers.forEach(arrBL, function(valBL, keyBL){
          *          historyData.push({key: keyBL, value: valBL});
          *          FieldDropdown.setData(historyData);
          *       });
          *    }).addErrback(function(){
          *       $ws.helpers.alert('Не данных!');
          *    });
          * </pre>
          * @see saveToHistory
          * @public
          */
         getHistory: function() {
            return $ws.single.UserConfig.getParamValues(this._getNameForHistory());
         },

         /**
          * Установить стиль для выделенного текста
          * @param {Object} style Объект, содержащий устанавливаемый стиль текста
          * @private
          */
         setFontStyle: function(style) {
            this._checkFocus();
            this.setActive(true);
            if (style !== 'mainText') {
               this._tinyEditor.formatter.apply(style);
               this._textFormats[style] = true;
            }
            for (var stl in constants.styles) {
               if (style !== stl) {
                  this._tinyEditor.formatter.remove(stl);
                  this._textFormats[stl] = false;
               }
            }
            this._tinyEditor.focus();
            //при установке стиля(через форматтер) не стреляет change
            this._onValueChangeHandler();
         },

         /**
          * Установить цвет для выделенного текста
          * @param {Object} color Объект, содержащий устанавливаемый цвет текста
          * @private
          */
         setFontColor: function(color) {
            //setActive в ie перестаёт работать применение цвета к выделенному тексту
            if (!$ws._const.browser.isIE) {
               this.setActive(true);
            }
            this._checkFocus();
            this._tinyEditor.formatter.apply('forecolor', {value: color});
            this._tinyEditor.focus();
            //при установке стиля(через форматтер) не стреляет change
            this._onValueChangeHandler();
         },

         /**
          * Получить  текущие значения стилей под курсором
          */
         getTextStyles: function(){
            var
               styles = {};
            styles.textAlign = this._textAlignState;
            styles.textFormat = this._textFormats;
            styles.textState = this._textState;
            styles.textColor = tinyMCE.DOM.getStyle(this._tinyEditor.selection.getNode(), 'color', true);
            return styles;
         },

         getTinyEditor: function() {
            return this._tinyEditor;
         },

         /**
          * Возращает элемент тулбара с указанным именем или false (если он отсутствует)
          * @param {String} name Имя элемента
          * @returns {$ws.proto.Button|$ws.proto.MenuButton|Boolean}
          */
         getToolbarItem: function(name) {
            return (typeof name === 'string' && this._instances && this._instances[name]) || false;
         },

         /**
          * <wiTag group="Отображение">
          * Скрыть/отобразить панель инструментов.
          * При скрытии панели инструментов работа в текстовом редакторе будет осуществляться только с клавиатуры.
          * @param visible {Boolean} Возможные значения:
          * <ol>
          *    <li>true - показать панель инструментов;</li>
          *    <li>false - скрыть.</li>
          * </ol>
          * @see toolbarVisible
          */
         toggleToolbar: function(visible) {
            var
               self = this,
               newHeight;
            if (this._options.toolbarVisible !== visible) {
               newHeight = this._inputControl.outerHeight();
               this._options.toolbarVisible = visible === true ? true : visible === false ? false : !this._options.toolbarVisible;
               newHeight += this._options.toolbarVisible ? -constants.toolbarHeight : constants.toolbarHeight;

               if (this._options.toolbarVisible) {
                  this._container.removeClass('controls-RichEditor__HideToolbar');
               }

               this._toolbarContainer.animate(
                  {
                     height: this._options.toolbarVisible ? constants.toolbarHeight : 0
                  },
                  'fast',
                  function() {
                     self._doAnimate = false;
                     if (!self._options.toolbarVisible) {
                        self._container.addClass('controls-RichEditor__HideToolbar');
                     }
                  }
               );

               if (!this._options.autoHeight) {
                  this._inputControl.animate(
                     {
                        height: newHeight
                     },
                     'fast'
                  );
               }
            }
         },

         insertSmile: function(smile) {
            var smiles;
            if (typeof smile === 'string') {
               smiles = this._defaultItems.smile.config.items;
               $.each(smiles, function(i, obj) {
                  if (obj.key === smile) {
                     smile = obj;
                     return false;
                  }
               });
               if (typeof smile === 'object') {
                  this._checkFocus();
                  this.insertHtml(this._smileHtml(smile.key, smile.value));
               }
            }
         },

         /**
          * <wiTag group="Управление">
          * Выполнить команду.
          * @param {String} command передаваемая в качестве строки команда
          * @example
          * <pre>
          *    fre.setValue('Случайно написал эту фразу');
          *    fre.execCommand('undo'); // отменить последнее действие
          * </pre>
          * @public
          */
         execCommand: function(command) {
            //TODO: избавиться от this._lastRng
            if (!$ws._const.browser.isMobilePlatform) {
               this._tinyEditor.selection.lastFocusBookmark = null;
            } else {
               this._lastRng && this._tinyEditor.selection.setRng(this._lastRng);
            }
            this._changeValueFromSetText = false;
            this._tinyEditor.execCommand(command);
            this._checkFocus();
         },

         /**
          * Метод открывает диалог, позволяющий вставить ссылку
          * @param onAfterCloseHandler Функция, вызываемая после закрытия диалога
          */
         insertLink: function(onAfterCloseHandler, target) {
            var
               editor = this._tinyEditor,
               selection = editor.selection,
               range = $ws.core.clone(selection.getRng()),
               element = selection.getNode(),
               anchor = editor.dom.getParent(element, 'a[href]'),
               href = anchor ? editor.dom.getAttrib(anchor, 'href') : '',
               fre = this,
               context = new $ws.proto.Context(),
               dom = editor.dom,
               protocol = /(https?|ftp|file):\/\//gi,
               dialogWidth = 440;
            require(['js!SBIS3.CORE.Dialog'], function(Dialog) {
               new Dialog({
                  title: rk('Вставить/редактировать ссылку'),
                  disableActions: true,
                  resizable: false,
                  width: dialogWidth,
                  height: 48,
                  autoHeight: false,
                  keepSize: false,
                  opener: fre,
                  context: context,
                  top: target && target.offset().top + target.height() - $(window).scrollTop(),
                  left: target && target.offset().left - (dialogWidth - target.width()),
                  handlers: {
                     onReady: function () {
                        var
                           self = this,
                           hrefLabel = $('<div class="controls-RichEditor__InsertLinkHrefLabel">Адрес</div>'),
                           okButton = $('<div class="controls-RichEditor__InsertLinkButton"></div>'),
                           linkAttrs = {
                              target: '_blank',
                              rel: null,
                              'class': null,
                              title: null
                           };
                        this._fieldHref = $('<div class="controls-RichEditor__InsertLinkHref"></div>');
                        this.getContainer()
                           .append(hrefLabel)
                           .append(this._fieldHref);
                        //TODO: перевечсти поле ввода на SBIS3.CONTROLS.TextBoxтк в нём нет доскрола при активации
                        this._fieldHref = new FieldString({
                           value: href,
                           parent: this,
                           element: this._fieldHref,
                           linkedContext: context,
                           name: 'fre_link_href'
                        });
                        this._titleBar
                           .prepend($('<a href="javascript:void(0)"></a>')
                              .addClass('ws-window-titlebar-action close')
                              .click(function () {
                                 self.close();
                                 return false;
                              }))
                           .append(okButton);
                        if ($ws._const.browser.isMobileIOS) {
                           fre.setActive(false);
                        }
                        new Button({
                           caption: 'ОК',
                           defaultButton: true,
                           parent: this,
                           handlers: {
                              onActivated: function () {
                                 href = this.getParent()._fieldHref.getValue();
                                 fre._changeValueFromSetText = false;
                                 if (href && href.search(protocol) === -1) {
                                    href = 'http://' + href;
                                 }
                                 if (element && element.nodeName === 'A' && element.className.indexOf('ws-focus-out') < 0) {
                                    if (href) {
                                       dom.setAttribs(element, {
                                          target: '_blank',
                                          href: $ws.helpers.escapeHtml(href)
                                       });
                                    } else {
                                       editor.execCommand('unlink');
                                    }
                                    editor.undoManager.add();
                                 } else if (href) {
                                    linkAttrs.href = href;
                                    editor.selection.setRng(range);
                                    if (editor.selection.getContent() === '') {
                                       editor.insertContent(dom.createHTML('a', linkAttrs, dom.encode(href)));
                                    } else {
                                       editor.execCommand('mceInsertLink', false, linkAttrs);
                                    }
                                    editor.undoManager.add();
                                 }
                                 self.close();
                              }
                           },
                           element: okButton
                        });
                     },
                     onAfterClose: function() {
                        if (typeof onAfterCloseHandler === 'function') {
                           onAfterCloseHandler();
                        }
                     }
                  }
               });
            });
         },

         /**
          * Установить курсор в конец контента.
          * @private
          */
         setCursorToTheEnd: function() {
            var
               editor = this._tinyEditor,
               nodeForSelect = editor.getBody(),
               root = editor.dom.getRoot();
            // But firefox places the selection outside of that tag, so we need to go one level deeper:
            if (editor.isGecko) {
               nodeForSelect = root.childNodes[root.childNodes.length-1];
               nodeForSelect = nodeForSelect.childNodes[nodeForSelect.childNodes.length-1];
            }
            editor.selection.select(nodeForSelect, true);
            editor.selection.collapse(false);
         },

         /*БЛОК ПУБЛИЧНЫХ МЕТОДОВ*/

         /*БЛОК ПРИВАТНЫХ МЕТОДОВ*/
         _drawAndBindItems: function(){
            this._drawItems();
            if (this._tinyEditor.initialized) {
               this._bindChangeButtonsState();
            }
            else {
               this._tinyEditor.once('init',  this._bindChangeButtonsState.bind(this));
            }
         },

         _showImagePropertiesDialog: function(target) {
            var
               $image = $(target),
               editor = this._tinyEditor;
            require(['js!SBIS3.CORE.Dialog'], function(Dialog) {
               new Dialog({
                  name: 'imagePropertiesDialog',
                  template: 'js!SBIS3.CONTROLS.RichEditor.ImagePropertiesDialog',
                  selectedImage: $image,
                  handlers: {
                     onBeforeShow: function () {
                        $ws.single.CommandDispatcher.declareCommand(this, 'saveImage', function () {
                           var
                              dataMceStyle = '',
                              percentSizes = this.getChildControlByName('valueType').getValue() === 'per',
                              width = this.getChildControlByName('imageWidth').getValue(),
                              height = this.getChildControlByName('imageHeight').getValue();
                           width = width !== null ? width + (percentSizes ? '%' : 'px') : '';
                           height = height !== null ? height + (percentSizes ? '%' : 'px') : '';
                           $image.css({
                              width: width,
                              height: height
                           });
                           dataMceStyle += width ? 'width: ' + width + ';' : '';
                           dataMceStyle += height ? 'height: ' + height + ';' : '';
                           $image.attr('data-mce-style', dataMceStyle);
                           editor.undoManager.add();
                        }.bind(this));
                     }
                  }
               });
            });
         },

         _smileHtml: function(smile, name) {
            return '<img class="ws-fre__smile smile'+smile+'" data-mce-resize="false" unselectable ="on" src="'+constants.blankImgPath+'" ' + (name ? ' title="' + name + '"' : '') + ' />';
         },

         /**
          * JavaScript function to match (and return) the video Id
          * of any valid Youtube Url, given as input string.
          * @author: Stephan Schmitz <eyecatchup@gmail.com>
          * @url: http://stackoverflow.com/a/10315969/624466
          */
         _getYouTubeVideoId: function(link) {
            var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
            return link.match(p) ? RegExp.$1 : false;
         },

         /**
          * Обработчик клика по кнопке переключения видимости тулбара
          * @private
          */
         _onClickToggleButton: function() {
            //Обрабатываем клик только в том случае, если не выполняется анимация и контрол активен
            if (!this._doAnimate && this.isEnabled()) {
               this._doAnimate = true;
               this.toggleToolbar();
               this._tinyEditor.selection.lastFocusBookmark = null;
               this._tinyEditor.focus();
            }
         },

         _scrollEventHandler: function(event) {
            if (event.type === 'scroll') {
               if (this._hideFocusOnScroll) {
                  this._container.focus();
               }
            } else {
               this._hideFocusOnScroll = event.type === 'touchstart';
            }
         },

         _bindEvents: function() {
            var
               self = this,
               editor = this._tinyEditor;

            //По инициализации tinyMCE
            editor.on('init', function(){
               var
                  toolbarHeight = this._options.toolbar && this._options.toolbarVisible ? constants.toolbarHeight : 0,
                  editorHeight =  this._inputControl.height();

               //По двойному клику на изображение внутри редактора - отображаем диалог редактирования размеров изображения
               this._inputControl.bind('dblclick', function(e) {
                  if (this._inputControl.attr('contenteditable') !== 'false') {
                     var target = e.target;
                     if (target.nodeName === 'IMG' && target.className.indexOf('mce-object-iframe') === -1 && target.className.indexOf('ws-fre__smile') === -1) {
                        this._showImagePropertiesDialog(target);
                     }
                  }
               }.bind(this));

               //меняем размер если отображается тулбар
               if (!this._options.autoHeight){
                  this._inputControl.height(editorHeight - toolbarHeight);
               }

               if (this._options.toolbar ) {
                  this._drawAndBindItems();
               }

               if (self._options.uploadImageOnDrop) {
                  self._getFileLoader();
               }

               this._inputControl.attr('tabindex', 1);
               //Хак для хрома и safari на ios( не работало событие 'click' )

               if ($ws._const.browser.isMobilePlatform) {
                  this._inputControl.bind('scroll touchstart touchend', this._scrollEventHandler.bind(this));
                  this._container.bind('touchstart', this._onClickHandler.bind(this));
               }

               this._notifyOnSizeChanged();

               if (!self._readyContolDeffered.isReady()) {
                  self._tinyReady.addCallback(function() {
                     //Стреляем готовность ws-контрола только в том случае, если раньше не стреляли
                     self._readyContolDeffered.addCallback(function () {
                        self._notify('onReady');
                        self._notify('onInitEditor');
                     });
                     self._readyContolDeffered.callback();
                  });
               }
               //уменьшаем высоту на разность в outerHeight editor`а и height контейнера
               if (!this._options.editorConfig.inline && !this._options.autoHeight) {
                  editor.theme.resizeTo(
                     $(editor.getContainer()).width(),
                     $(editor.getContentAreaContainer()).height() + this._container.height() - $(editor.getContainer()).outerHeight()
                  );
               }
               this._bindChangeState();
               this._inputControl = $(editor.getBody());
               RichUtil.markRichContentOnCopy(this._inputControl);
               self._tinyReady.callback();
            }.bind(this));

            //БИНДЫ НА ВСТАВКУ КОНТЕНТА И ДРОП
            editor.on('onBeforePaste', function(e) {
               var image;
               if (e.content.indexOf('<img') === 0) {
                  image = $('<div>' + e.content + '</div>').find('img:first');
                  if (image.length) {
                     self._needPasteImage = image.get(0).outerHTML;
                     return false;
                  }
               } else {
                  self._needPasteImage = false;
               }
            });

            editor.on('Paste', function(e) {
               self._clipboardText = e.clipboardData ?
                  $ws._const.browser.isMobileIOS ? e.clipboardData.getData('text/plain') : e.clipboardData.getData('text') :
                  window.clipboardData.getData('text');
               editor.plugins.paste.clipboard.pasteFormat = 'html';
            });

            //Обработка вставки контента
            editor.on('BeforePastePreProcess', function(e) {
               var
                  isYouTubeReady,
                  isRichContent = e.content.indexOf('content=SBIS.FRE') !== -1,
                  content = e.content;
               // при форматной вставке по кнопке мы обрабаотываем контент через событие tinyMCE
               // и послыаем метку форматной вставки, если метка присутствует не надо обрабатывать событие
               // нашим обработчиком, а просто прокинуть его в дальше
               if (e.withStyles) {
                  return e;
               }
               if (isRichContent && $ws._const.browser.isIE8) {
                  //в IE8 оборачиваем контент в div  надо его вырезать
                  //потому что в контент летит еще и внешняя дивка с -99999 и absolute
                  content = content.substring(content.indexOf('<DIV>') + 5, content.length - 11);
                  if (content.indexOf('&nbsp;') === 0) {
                     content = content.substring(6);
                  }
                  e.content =  content.replace('<!--content=SBIS.FRE-->','');
               }
               if (!isRichContent) {
                  if (self._options.editorConfig.paste_as_text) {
                     //если данные не из БТР и не из word`a, то вставляем как текст
                     //В Костроме юзают БТР с другим конфигом, у них всегда форматная вставка
                     if (self._needPasteImage) {
                        self.insertHtml(self._needPasteImage);
                        e.content = '';
                     } else if (self._clipboardText !== false) {
                        //взял строку из метода pasteText, благодаря ей вставка сохраняет спецсимволы
                        e.content = $ws.helpers.escapeHtml(editor.dom.encode(self._clipboardText).replace(/\r\n/g, '\n'));
                     }
                  }
               }
               isYouTubeReady = self.addYouTubeVideo(e.content);
               if (isYouTubeReady) {
                  self._changeValueFromSetText = false;
                  self._tinyEditor.fire('change');
               }
               return isYouTubeReady ? false : e;
            });

            //при вырезании текста мышкой тоже должен срабатывать обработчик
            editor.on( 'cut',function(){
               setTimeout(function() {
                  self._onValueChangeHandler();
               }, 1);
            });

            editor.on('PastePostProcess', function(event){
               var
                  maximalWidth,
                  content = event.node,
                  $images = $(content).find('img:not(.ws-fre__smile)'),
                  width,
                  currentWidth,
                  naturalSizes;
               $(content).find('[unselectable ="on"]').attr('data-mce-resize','false');
               if ($images.length) {
                  if (/data:image/gi.test(content.innerHTML)) {
                     return false;
                  }
                  maximalWidth = this._inputControl.width() - $ws._const.FieldRichEditor.imageOffset;
                  for (var i = 0; i < $images.length; i++) {
                     naturalSizes = ImageUtil.getNaturalSizes($images[i]);
                     currentWidth = $($images[i]).width();
                     width = currentWidth > maximalWidth ? maximalWidth : currentWidth === 0 ? naturalSizes.width > maximalWidth ? maximalWidth : naturalSizes.width : currentWidth;
                     $($images[i]).css({
                        'width': width,
                        'height': 'auto'
                     });
                  }
               }
               this._changeValueFromSetText = false;
               //Замена переносов строк на <br>
               event.node.innerHTML = event.node.innerHTML.replace(/([^>])\n([^<])/gi, '$1<br />$2');
               // Замена отступов после переноса строки и в первой строке
               // пробелы заменяются с чередованием '&nbsp;' + ' '
               event.node.innerHTML = this._replaceWhitespaces(event.node.innerHTML);

            }.bind(this));

            editor.on('drop', function() {
               //при дропе тоже заходит в BeforePastePreProcess надо обнулять  _needPasteImage и  _clipboardTex
               self._needPasteImage = false;
               self._clipboardText = false;
            });

            //БИНДЫ НА СОБЫТИЯ КЛАВИАТУРЫ (ВВОД)
            if ($ws._const.browser.isMobileIOS || $ws._const.browser.isMobileAndroid) {
               //TODO: https://github.com/tinymce/tinymce/issues/2533
               this._inputControl.on('input', function() {
                  self._onValueChangeHandler();
               });
            }

            //Передаём на контейнер нажатие ctrl+enter и escape
            this._container.bind('keydown', function(e) {
               if (!(e.which === $ws._const.key.enter && e.ctrlKey) && e.which !== $ws._const.key.esc) {
                  e.stopPropagation();
               }
            });

            //Запрещаем всплытие Enter
            this._container.bind('keyup', function(e) {
               if (e.which === $ws._const.key.enter) {
                  e.stopPropagation();
                  e.preventDefault();
               }
            });

            editor.on('keyup', function(e) {
               self._typeInProcess = false;
               self._onValueChangeHandler();
            });

            editor.on('keydown', function(e) {
               var
                  selection,
                  node,
                  offset;
               self._typeInProcess = true;
               if (e.which === $ws._const.key.pageDown || e.which === $ws._const.key.pageUp || (e.which === $ws._const.key.insert && !e.shiftKey && !e.ctrlKey)) {
                  e.stopPropagation();
                  e.preventDefault();
               }
               if (e.keyCode == $ws._const.key.tab) {
                  var
                     area = self.getParent(),
                     nextControl = area.getNextActiveChildControl(e.shiftKey);
                  if (nextControl) {
                     self._fakeArea.focus();
                     nextControl.setActive(true, e.shiftKey);
                  }
                  e.stopImmediatePropagation();
                  e.preventDefault();
                  return false;
               } else if (e.which === $ws._const.key.space) {
                  selection = editor.selection.getSel();
                  node = selection.anchorNode;
                  offset = selection.anchorOffset;
                  /* Невероятный костыль, направленный на сохранение ВСЕХ добавляемых пользователем пробелов.
                   Будет жить до тех пор, пока TinyMCE в одной из версий не сделают нормальный парсер пробельных символов с чередованием nbsp и пробелов.
                   Описание: добавляем &nbsp; в следующих случаях:
                   1. Если каретка находится в начале строки и это верхний DOM-элемент строки (предыдущего сиблинка либо нет, либо его родитель - inputControl
                   2. Если предыдущий или следующий символ - пробел */
                  if (offset === 0 && (node.previousSibling === null || node.previousSibling.parentElement == self._inputControl[0]) ||
                     node.nodeValue && (node.nodeValue[offset - 1] === ' ' || node.nodeValue[offset + 1] === ' ')) {
                     editor.insertContent('&nbsp;');
                     e.stopImmediatePropagation();
                     e.preventDefault();
                     return false;
                  }
               } else if (e.which === $ws._const.key.enter && e.ctrlKey) {
                  self._container.trigger(e);
                  e.stopImmediatePropagation();
                  e.preventDefault();
                  return false;
               }
               self._updateHeight();
            });

            // Обработка изменения содержимого редактора.
            // Событие keypress возникает сразу после keydown, если нажата символьная клавиша, т.е. нажатие приводит к появлению символа.
            // Любые буквы, цифры генерируют keypress. Управляющие клавиши, такие как Ctrl, Shift, F1, F2.. — keypress не генерируют.
            editor.on('keypress', function(e) {
               // <проблема>
               //    Если в редакторе написать более одного абзаца, выделить, и нажать любую символьную клавишу,
               //    то, он оставит сверху один пустой абзац, который не удалить через визуальный режим, и будет писать в новом
               // </проблема>
               if (!editor.selection.isCollapsed()) {
                  if (editor.selection.getContent() == self._getTinyEditorValue()) {
                     if (!e.ctrlKey && e.charCode !== 0) {
                        editor.bodyElement.innerHTML = '';
                     }
                  }
               }
               setTimeout(function() {
                  self._togglePlaceholder(self._curValue());
               }, 1);
            });

            editor.on('change', function(e) {
               if (self._changeValueFromSetText) {
                  self._changeValueFromSetText = false;
               } else {
                  self._onValueChangeHandler();
               }
            });

            //НА мобильных устройствах при потере фокуса не запоминается последнее выделение(tinymce tnx)
            //запоминаем сами выделение
            //TODO: ИЗбавиться от  _lastRng
            if ($ws._const.browser.isMobilePlatform) {
               editor.on('focusout', function () {
                  self._lastRng = editor.selection.getRng();
               });
            }

            //Сообщаем компоненту об изменении размеров редактора
            editor.on('resizeEditor', function() {
               self._notifyOnSizeChanged();
            });

            //реагируем на то что редактор изменился при undo/redo
            editor.on('undo', function() {
               self._onValueChangeHandler();
            });

            editor.on('redo', function() {
               self._onValueChangeHandler();
            });

            //сохранение истории при закрытии окна
            this._saveBeforeWindowClose  =  function() {
               this.saveToHistory(this._curval);
            }.bind(this);
            $ws._const.$win.bind('beforeunload', this._saveBeforeWindowClose);
         },

         _bindChangeButtonsState: function() {
            var
               editor = this._tinyEditor,
               self = this;
            editor.on('TypingUndo AddUndo ClearUndos', function() {
               self._buttonSetEnabled(self._tinyEditor.undoManager.hasUndo(), 'undo');
               self._buttonSetEnabled(self._tinyEditor.undoManager.hasRedo(), 'redo');
            });
            editor.on('undo', function() {
               self._buttonSetEnabled(self._tinyEditor.undoManager.hasUndo(), 'undo');
               self._buttonSetEnabled(self._tinyEditor.undoManager.hasRedo(), 'redo');
            });
            editor.on('redo', function() {
               self._buttonSetEnabled(self._tinyEditor.undoManager.hasUndo(), 'undo');
               self._buttonSetEnabled(self._tinyEditor.undoManager.hasRedo(), 'redo');
            });
            editor.on('NodeChange', function(e) {
               self._buttonSetEnabled(e.element.nodeName === 'A', 'unlink');
            });
         },
         //установка активности кнопки по её имени
         _buttonSetEnabled: function(enabled, buttonName){
            this._instances && this._instances[buttonName].setEnabled(enabled);
         },

         _replaceWhitespaces: function(text) {
            var
               out = '',
               lastIdx = null,
               nbsp = false;
            if (typeof text !== 'string') {
               return text;
            }
            for (var i = 0; i < text.length; i++) {
               if (text[i] !== ' ') {
                  out += text[i];
               } else {
                  if (text.substr(i - 6, 6) === '&nbsp;') {
                     nbsp = false;
                  } else {
                     if (i === 0 || text[i - 1] === '\n' || text[i - 1] === '>') {
                        nbsp = true;
                     } else {
                        if (lastIdx !== i - 1) {
                           nbsp = text[i + 1] === ' ';
                        } else {
                           nbsp = !nbsp;
                        }
                     }
                  }
                  if (nbsp) {
                     out += '&nbsp;';
                  } else {
                     out += ' ';
                  }
                  lastIdx = i;
               }
            }
            return out;
         },

         _performByReady: function(callback) {
            if (this._tinyReady.isReady()) {
               callback();
            } else {
               this._tinyReady.addCallback(callback);
            }
         },

         _getElementToFocus: function() {
            return this._inputControl || false;
         },

         _setEnabled: function(enabled) {
            this._enabled = enabled;
            if (!this._tinyReady.isReady() && enabled) {
               this._tinyReady.addCallback(function() {
                  this._applyEnabledState(this._enabled);
               }.bind(this));
               this._initTiny();
            } else {
               this._applyEnabledState(enabled);
            }

         },

         _applyEnabledState: function(enabled) {
            var
               container = this._tinyEditor ? this._tinyEditor.getContainer() ? $(this._tinyEditor.getContainer()) : this._inputControl : this._inputControl;
            if (this._dataReview) {
               if (this._options.autoHeight) {
                  this._dataReview.css({
                     'max-height': this._options.maximalHeight,
                     'min-height': this._options.minimalHeight
                  });
               } else {
                  this._dataReview.height(this._container.height());
               }
               this._dataReview.toggleClass('ws-hidden', enabled);
            }

            container.toggleClass('ws-hidden', !enabled);
            this._inputControl.toggleClass('ws-hidden', !enabled);
            //Требуем в будущем пересчитать размеры контрола
            this._notifyOnSizeChanged();

            RichEditor.superclass._setEnabled.apply(this, arguments);
         },

         _initTiny: function() {
            var
               self = this;
            if (!this._tinyEditor && !this._tinyIsInit) {
               this._tinyIsInit = true;
               require(['css!SBIS3.CONTROLS.RichEditor/resources/tinymce/skins/lightgray/skin.min',
                  'css!SBIS3.CONTROLS.RichEditor/resources/tinymce/skins/lightgray/content.inline.min',
                  'js!SBIS3.CONTROLS.RichEditor/resources/tinymce/tinymce'],function(){
                  tinyMCE.init(self._options.editorConfig);
               });
            }
            this._tinyReady.addCallback(function () {
               this._tinyEditor.setContent(this._prepareContent(this.getText()));
               this._tinyEditor.undoManager.add();
            }.bind(this));
         },

         /**
          * Получить текущее содержимое редактора
          * Вынесено в метод так как no_events: true нужно в методе getContent,
          * но также не нужно в _tinyEditor.serializer.serialize.
          * Данный метод это метод getContent TinyMce без предсобытий вызываемых в нём
          * @returns {*} Текущее значение (в формате html-кода)
          */
         _getTinyEditorValue: function(){
            var
               trim = function(str) {
                  var
                     beginReg = new RegExp('^<p>(&nbsp; *)*</p>'),// регулярка начала строки
                     endReg = new RegExp('<p>(&nbsp; *)*</p>$'),// регулярка начала строки
                     regResult;
                  while ((regResult = beginReg.exec(str)) !== null)
                  {
                     str = str.substr(regResult[0].length + 1);
                  }
                  while ((regResult = endReg.exec(str)) !== null)
                  {
                     str = str.substr(0, str.length - regResult[0].length - 1);
                  }
                  return (str === null || str === undefined) ? '' : ('' + str).replace(/^\s*|\s*$/g, '');
               };

            return trim(this._tinyEditor.serializer.serialize(this._tinyEditor.getBody(), {format: 'html', get: true, getInner: true}));
         },

         /**
          * Получить текущее значение
          * @returns {*} Текущее значение (в формате html-кода)
          */

         _curValue: function() {
            return this._tinyEditor && this._tinyEditor.initialized ? this._getTinyEditorValue() : this._curval;
         },

         _prepareContent: function(value) {
            return typeof value === 'string' ? value : value === null || value === undefined ? '' : value + '';
         },


         //метод показа плейсхолдера по значению//
         //TODO: ждать пока решится задача в самом tinyMCE  https://github.com/tinymce/tinymce/issues/2588
         _togglePlaceholder:function(value){
            var
               curValue = value || this.getText();
            this.getContainer().toggleClass('fre-empty', (curValue === '' || curValue === undefined || curValue === null) && this._inputControl.html().indexOf('</li>') < 0 && this._inputControl.html().indexOf('<p>&nbsp;') < 0);
         },

         _addToHistory: function(valParam) {
            var
               self = this;
            return $ws.single.UserConfig.setParamValue(this._getNameForHistory(), valParam).addCallback(function(isSave){
               if (isSave) {
                  self._fillHistory();
               }
            });
         },

         _getNameForHistory: function() {
            return this.getName().replace('/', '#') + 'ИсторияИзменений';
         },

         _insertImg: function(path, name) {
            var
               self = this,
               img =  $('<img src="' + path + '"></img>').css({
                  visibility: 'hidden',
                  position: 'absolute',
                  bottom: 0,
                  left: 0
               });
            //тоже самое что при execCommand
            this._tinyEditor.selection.lastFocusBookmark = null;
            img.on('load', function() {
               var
                  isIEMore8 = $ws._const.browser.isIE && !$ws._const.browser.isIE8,
               // naturalWidth и naturalHeight - html5, работают IE9+
                  imgWidth =  isIEMore8 ? this.naturalWidth : this.width,
                  imgHeight =  isIEMore8 ? this.naturalHeight : this.height,
                  maxSide = imgWidth > imgHeight ? ['width', imgWidth] : ['height' , imgHeight],
                  style = '';
               if (maxSide[1] > constants.maximalPictureSize) {
                  style = ' style="'+ maxSide[0] +': ' + constants.maximalPictureSize + 'px;"';
               }
               if ($ws._const.browser.isIE8) {
                  img.remove();
               }
               self.insertHtml('<img src="' + path + '"' + style + ' alt="' + name + '"></img>');
            });
            if ($ws._const.browser.isIE8) {
               $('body').append(img);
            }
         },

         /**
          * Установить выравнивание текста для активной строки
          * @param {String} align Устанавливаемое выравнивание
          * @private
          */
         _setTextAlign: function(align) {
            var
            // выбираем ноду из выделения
               $selectionContent = $(this._tinyEditor.selection.getNode()),
            // ищем в ней списки
               $list = $selectionContent.find('ol,ul');
            if (!$list.length) {
               // если списков не нашлось внутри, может нода и есть сам список
               $list = $selectionContent.closest('ol,ul');
            }
            if ($list.length) {
               // для того чтобы список выравнивался вместе с маркерами нужно проставлять ему
               // свойство list-style-position: inline, и, также, убирать его при возврате назад,
               // так как это влечет к дополнительным отступам
               $list.css('list-style-position', align === 'alignjustify' || align === 'alignleft' ? '' : 'inside');
            }
            this._tinyEditor.formatter.apply(align, true);
            //если смена стиля будет сразу после setValue то контент не установится,
            //так как через форматттер не стреляет change
            this._onValueChangeHandler();
         },

         _checkFocus: function() {
            var tinyEditor = this._tinyEditor;
            if (tinyEditor.lastRng) {
               tinyEditor.selection.setRng(tinyEditor.lastRng);
            } else {
               tinyEditor.focus();
            }
         },

         _setButtonsState: function(state, ignoreSourceButton) {
            var
               buttons = this._instances;
            if (state && !this._buttonsState) {
               this._buttonsState = {};
               for (var i in buttons) {
                  if (!ignoreSourceButton || i !== 'source') {
                     this._buttonsState[i] = buttons[i].isEnabled();
                     buttons[i].setEnabled(false);
                  }
               }
            } else if (this._buttonsState) {
               for (var j in this._buttonsState) {
                  if (!ignoreSourceButton || j !== 'source') {
                     buttons[j].setEnabled(this._buttonsState[j]);
                  }
               }
               this._buttonsState = undefined;
            }
         },

         _toggleContentSource: function(visible) {
            var
               sourceVisible = visible !== undefined ? !!visible : this._sourceContainer.hasClass('ws-hidden'),
               container = this._tinyEditor.getContainer() ? $(this._tinyEditor.getContainer()) : this._inputControl;
            if (sourceVisible) {
               this._sourceContainer.css({
                  'height' : container.outerHeight(),
                  'width' : container.outerWidth()
               });
               this._areaEditor.val(this.getText());
            }
            this._sourceContainer.toggleClass('ws-hidden', !sourceVisible);
            container.toggleClass('ws-hidden', sourceVisible);
            this._setButtonsState(sourceVisible, true);
         },

         _drawItems: function() {
            var itemsArray = this._prepareItems(),
               result = this._instances;
            this._itemsContext = new $ws.proto.Context({ isGlobal: true });
            for (var i in itemsArray) {
               if (itemsArray.hasOwnProperty(i)) {
                  var div = $('<div class="controls-RichEditor__ToolbarItem"></div>').appendTo(this._toolbarContainer),
                     item = itemsArray[i],
                     type = item.type,
                     isButton = type === 'button' || type === 'ToggleButton',
                     itemCfg = $ws.core.merge({
                        name: i,
                        element: div,
                        fieldRichEditor: this,
                        cssClassName: 'controls-RichEditor__ToolbarItem mce-',
                        linkedContext: this._itemsContext,
                        renderStyle: isButton ? 'asLink' : 'hover'
                     }, itemsArray[i].config);
                  if (isButton) {
                     //поддержка старой версии на Button(image), переход на новую на Link(icon)
                     itemCfg.className = itemCfg.className + ' mce-';
                     if (!itemCfg.icon) {
                        itemCfg.icon = itemCfg.image;
                     }
                     if (type === 'button') {
                        result[i] = new Button(itemCfg);
                     } else {
                        result[i] = new ToggleButton(itemCfg);
                     }
                  } else if (type ==='MenuButton') {
                     itemCfg.opener = this;
                     itemCfg.keyField = 'key';
                     result[i] = new MenuButton(itemCfg);
                  }
                  else if (type === 'dropdown') {
                     itemCfg.flipVertical = true;
                     result[i] = new Dropdown(itemCfg);
                  }
                  result[i].getContainer().attr('tabindex', '-1');
                  result[i].getOwner = function() {
                     return this._options.fieldRichEditor;
                  };
                  result[i].setActive = this._setActiveControlsButton;
               }
            }
         },

         _setActiveControlsButton: function() {
            //Заглушка, чтобы кнопки не забирали на себя фокус, так как у них нет перента, и фокус уйдёт отовсюду.
            //Например из DialogRecord и тот станет закрываться.
         },

         _onChangeAreaValue: function() {
            if (this._sourceContainerIsActive()) {
               this.setText(this._areaEditor.val());
            }
         },

         _prepareItems: function () {
            var items = $ws.core.clone(this._defaultItems),
               userItems = this._options.userItems;
            if (!Object.isEmpty(userItems)) {
               for (var i in userItems) {
                  if (userItems.hasOwnProperty(i)) {
                     if (items.hasOwnProperty(i)) {
                        if (userItems[i].config) {
                           if (userItems[i].config.visible !== undefined) {
                              items[i].config.visible = !!userItems[i].config.visible;
                           }
                           if (userItems[i].config.enabled !== undefined) {
                              items[i].config.enabled = !!userItems[i].config.enabled;
                           }
                        }
                     } else {
                        items[i] = userItems[i];
                     }
                  }
               }
            }
            return items;
         },

         /**
          * Создание загрузчика файлов
          * @private
          */
         _createFileLoader: function(){
            var
               self = this,
               imgName,
               cont = $('<div class="ws-field-rich-editor-file-loader"></div>');
            this._container.append(cont);
            this._fileLoader = new FileLoader({
               fileStorage: true,
               extensions: ['image'],
               element: cont,
               dropElement: self._inputControl,
               linkedContext: self.getLinkedContext(),
               handlers: {
                  onLoaded: function(e, json) {
                     if (json.result && json.result.code === 201) {
                        self._insertImg(json.result.filePath, imgName);
                     } else {
                        $ws.helpers.alert(decodeURIComponent(json.result ? json.result.message : json.error ? json.error.message : ''));
                     }
                  },
                  onChange: function(e, filePath) {
                     imgName = filePath.substring(filePath.lastIndexOf('\\') + 1, filePath.length);
                  }
               }
            });
         },

         _getFileLoader: function() {
            if (!this._fileLoader) {
               this._createFileLoader();
            }
            return this._fileLoader;
         },

         /**
          * Проверка активен ли режим кода
          * @private
          */
         _sourceContainerIsActive: function(){
            return !this._sourceContainer.hasClass('ws-hidden');
         },

         _updateHeight: function() {
            var curHeight;
            if (this.isVisible()) {
               curHeight = this._container.height();
               if (curHeight !== this._lastHeight) {
                  this._lastHeight = curHeight;
                  this._notifyOnSizeChanged();
               }
            }
         },

         _updateDataReview: function(value) {
            if (this._dataReview) {
               if (value && value[0] !== '<') {
                  value = '<p>' + value.replace(/\n/gi, '<br/>') + '</p>';
               }
               value = Sanitize(value);
               this._dataReview.html(this._options.highlightLinks ? $ws.helpers.wrapURLs($ws.helpers.wrapFiles(value), true) : value);
            }
         },

         _onValueChangeHandler: function(noAutoComplete, onKeyUp) {
            this._curval = this._curValue();
            var
               notFormattedValue = this._curValue(undefined, onKeyUp),
               currentContextValue = this.getText(),
               comparisonResult = notFormattedValue && notFormattedValue.equals ?
                  notFormattedValue.equals(currentContextValue)
                  : notFormattedValue == currentContextValue;
            if (!comparisonResult){
               this._options.text = this._curval;
               this._notify('onTextChange', this._curval);
               this._notifyOnPropertyChanged('text');
               this._updateHeight();
               this.clearMark();
               this._updateDataReview(this._getTinyEditorValue());
            }
            this._togglePlaceholder();
         },

         _fillHistory: function() {
            var
               historyDropdown = this.getToolbarItem('history'),
               self= this,
               historyData;
            if (historyDropdown && historyDropdown.isVisible()) {
               historyData = Array();
               this.getHistory().addCallback(function(arrBL){
                  $ws.helpers.forEach(arrBL, function(valBL, keyBL){
                     historyData.push({key: keyBL, value: valBL, title: self._renderDropdownValueHistory(keyBL, valBL)});
                  });
                  if ((arrBL && arrBL.length) && !historyDropdown.isEnabled()) {
                     historyDropdown.setEnabled(true);
                  }
                  historyDropdown.setItems(historyData);
               }).addErrback(function(){
                  historyDropdown.setEnabled(false);
               });
            }
         },

         //функция для построения ячейки в истории
         _renderDropdownValueHistory: function(key, value) {
            var
               stripText, title,
               $tmpDiv = $('<div/>').append(value);
            $tmpDiv.find('.ws-fre__smile').each(function(){
               var smileName = $(this).attr('title');
               $(this).replaceWith('[' + (smileName ? smileName : rk('смайл')) +']');
            });
            stripText = title = $ws.helpers.escapeHtml($tmpDiv.text());
            stripText = stripText.replace('/\n/gi', '');
            if (!stripText && value) {
               title = rk('Контент содержит только html-разметку, без текста.');
               stripText = '<i>'+title+'</i>';
            } else if (stripText && stripText.length > 140) { // обрезаем контент, если больше 140 символов
               stripText = stripText.substr(0, 140) + ' ...';
            }
            return '<div class="controls-RichEditor__HistoryText" title="'+title+'"  value="' + key + '">' + stripText + '</div>';
         },

         _bindChangeState: function(){
            var
               editor = this._tinyEditor,
               self = this;
            editor.formatter.formatChanged('bold', function(state, obj) {
               self._toggleState(state, obj);
            });
            editor.formatter.formatChanged('italic', function(state, obj) {
               self._toggleState(state, obj);
            });
            editor.formatter.formatChanged('underline', function(state, obj) {
               self._toggleState(state, obj);
            });
            editor.formatter.formatChanged('strikethrough', function(state, obj) {
               self._toggleState(state, obj);
            });
            editor.formatter.formatChanged('alignleft', function(state) {
               self._updateTextAlignButtons(state, 'left');
            });
            editor.formatter.formatChanged('aligncenter', function(state) {
               self._updateTextAlignButtons(state, 'center');
            });
            editor.formatter.formatChanged('alignright', function(state) {
               self._updateTextAlignButtons(state, 'right');
            });
            editor.formatter.formatChanged('alignjustify', function(state) {
               self._updateTextAlignButtons(state, 'justify');
            });
            editor.formatter.formatChanged('title', function(state, obj) {
               self._updateTextFormat(state, obj);
            });
            editor.formatter.formatChanged('subTitle', function(state, obj) {
               self._updateTextFormat(state, obj);
            });
            editor.formatter.formatChanged('selectedMainText', function(state, obj) {
               self._updateTextFormat(state, obj);
            });
            editor.formatter.formatChanged('additionalText', function(state, obj) {
               self._updateTextFormat(state, obj);
            });
         },

         _toggleState: function(state, obj) {
            var
               selectors = {
                  'bold':  'strong',
                  'italic':  'em',
                  'underline':  'span[style*="decoration: underline"]',
                  'strikethrough':  'span[style*="decoration: line-through"]'
               };
            if (!state && $(obj.node).closest(selectors[obj.format]).length) {
               state = true;
            }
            this._textState[obj.format] = state;
            if (this._instances[obj.format] && obj.node && $(obj.node).closest('.ws-field-rich-editor').length) {
               this._instances[obj.format].setChecked(this._textState[obj.format]);
            }
         },

         _updateTextAlignButtons: function(state, format) {
            this._textAlignState[format] = state;
            if (this._instances.justify) {
               var
                  align = this._textAlignState.right ? 'alignright' :
                     this._textAlignState.center ? 'aligncenter' :
                        this._textAlignState.justify ? 'alignjustify' : 'alignleft';

               this._instances.justify.setValue(align);
            }
         },

         _updateTextFormat: function(state, obj) {
            this._textFormats[obj.format] = state;
            if (this._instances.style) {
               var
                  textFormat = 'mainText';
               for (var tf in this._textFormats) {
                  if (this._textFormats[tf]) {
                     textFormat = tf;
                  }
               }
               this._instances.style.setValue(textFormat);
            }
         },

         _focusOutHandler: function(){}
      });

      return RichEditor;
   });
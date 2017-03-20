/**
 * Created by ps.borisov on 21.05.2016.
 */
define('js!SBIS3.CONTROLS.RichTextArea',
   [
   "Core/UserConfig",
   "Core/pathResolver",
   "Core/Context",
   "Core/Indicator",
   "Core/core-functions",
   "Core/CommandDispatcher",
   "Core/constants",
   "Core/Deferred",
   "js!SBIS3.CONTROLS.TextBoxBase",
   "html!SBIS3.CONTROLS.RichTextArea",
   "js!SBIS3.CONTROLS.Utils.RichTextAreaUtil",
   "js!SBIS3.CONTROLS.RichTextArea/resources/smiles",
   'js!WS.Data/Di',
   "js!SBIS3.CONTROLS.Utils.ImageUtil",
   "Core/Sanitize",
   "Core/helpers/collection-helpers",
   "Core/helpers/fast-control-helpers",
   "Core/helpers/string-helpers",
   "Core/helpers/dom&controls-helpers",
   'js!SBIS3.CONTROLS.RichEditor.ImageOptionsPanel',
   'Core/EventBus',
   "css!SBIS3.CORE.RichContentStyles",
   "i18n!SBIS3.CONTROLS.RichEditor",
   'css!SBIS3.CONTROLS.RichTextArea'
], function( UserConfig, cPathResolver, cContext, cIndicator, cFunctions, CommandDispatcher, cConstants, Deferred,TextBoxBase, dotTplFn, RichUtil, smiles, Di, ImageUtil, Sanitize, colHelpers, fcHelpers, strHelpers, dcHelpers, ImageOptionsPanel, EventBus) {
      'use strict';
      //TODO: ПЕРЕПИСАТЬ НА НОРМАЛЬНЫЙ КОД РАБОТУ С ИЗОБРАЖЕНИЯМИ
      var
         constants = {
            maximalPictureSize: 120,
            imageOffset: 40, //16 слева +  24 справа
            defaultYoutubeHeight: 300,
            minYoutubeHeight: 214,
            defaultYoutubeWidth: 430,
            minYoutubeWidth: 350,
            dataReviewPaddings: 8,
            styles: {
               title: {inline: 'span', classes: 'titleText'},
               subTitle: {inline: 'span', classes: 'subTitleText'},
               selectedMainText: {inline: 'span', classes: 'selectedMainText'},
               additionalText: {inline: 'span', classes: 'additionalText'}
            },
            ipadCoefficient: {
               top: {
                  vertical: 0.65,
                  horizontal:0.39
               },
               bottom: {
                  vertical: 0.7,
                  horizontal:0.44
               }
            }
         },
         /**
          * Поле ввода для богатого текстового редактора. Чтобы связать с ним тулбар {@link SBIS3.CONTROLS.RichEditorToolbar}, используйте метод {@link SBIS3.CONTROLS.RichEditorToolbarBase#setLinkedEditor}.
          * @class SBIS3.CONTROLS.RichTextArea
          * @extends SBIS3.CONTROLS.TextBoxBase
          * @author Борисов Петр Сергеевич
          * @public
          * @control
          */
         RichTextArea = TextBoxBase.extend(/** @lends SBIS3.CONTROLS.RichTextArea.prototype */{
         _dotTplFn: dotTplFn,
         $protected : {
            _options : {
               /**
                * @cfg {Boolean} Включение режима автовысоты
                * <wiTag group="Управление">
                * Режим автовысоты текстового редактора.
                * @example
                * <pre>
                *     <option name="autoHeight">true</option>
                * </pre>
                */
               autoHeight: false,
               /**
                * @cfg {Number} Минимальная высота (в пикселях)
                * <wiTag group="Управление">
                * Минимальная высота текстового поля (для режима с автовысотой).
                * @example
                * <pre>
                *     <option name="autoHeight">true</option>
                *     <option name="minimalHeight">100</option>
                * </pre>
                */
               minimalHeight: 200,
               /**
                * @cfg {Number} Максимальная высота (в пикселях)
                * <wiTag group="Управление">
                * Максимальная высота текстового поля (для режима с автовысотой).
                * Для задания неограниченной высоты необходимо выставить в значении опции 0.
                * @example
                * <pre>
                *     <option name="autoHeight">true</option>
                *     <option name="maximalHeight">0</option>
                * </pre>
                */
               maximalHeight: 300,
               /**
                * @cfg {Object} Объект с настройками для tinyMCE
                * <wiTag group="Управление">
                *
                */
               editorConfig: {
                  plugins: 'media,paste,lists,noneditable',
                  inline: true,
                  fixed_toolbar_container: '.controls-RichEditor__fakeArea',
                  relative_urls: false,
                  convert_urls: false,
                  formats: constants.styles,
                  paste_webkit_styles: 'color font-size text-align text-decoration width height max-width padding padding-left padding-right padding-top padding-bottom',
                  paste_retain_style_properties: 'color font-size text-align text-decoration width height max-width padding padding-left padding-right padding-top padding-bottom',
                  paste_as_text: true,
                  extended_valid_elements: 'div[class|onclick|style|id],img[unselectable|class|src|alt|title|width|height|align|name|style]',
                  body_class: 'ws-basic-style',
                  invalid_elements: 'script',
                  paste_data_images: false,
                  paste_convert_word_fake_lists: false, //TODO: убрать когда починят https://github.com/tinymce/tinymce/issues/2933
                  statusbar: false,
                  toolbar: false,
                  menubar: false,
                  browser_spellcheck: true,
                  smart_paste: true,
                  noneditable_noneditable_class: "controls-RichEditor__noneditable",
                  object_resizing: false
               },
               /**
                * @cfg {String} Значение Placeholder`а
                * При пустом значении редактора отображается placeholder
                * @translatable
                */
               placeholder: '',
               /**
                * Позволяет в задизабленном режиме подсвечивать ссылки на файлы и URL
                * @cfg {Boolean} Подсвечивать ссылки
                * <wiTag group="Управление">
                */
               highlightLinks: false,
               /**
                * Позволяет при вставке контента распознавать ссылки и декорировать их в отдельные блоки
                * @cfg {Boolean} декорировать ссылки ссылки
                */
               decorateLinks: false,
               /**
                * Имя декоратора, ккоторый зарегистирован в системе, с помощью которого декорировать ссылки
                * Если декоратор не укзан, то сыылки будут оборачиваться в <a>
                * @cfg {String} имя декоратора
                */
               decoratorName: '', // engine - 'linkDecorator',
               /**
                * Имя каталога, в который будут загружаться изображения
                * @cfg {String} имя декоратора
                */
               imageFolder: 'images'
            },
            _fakeArea: undefined, //textarea для перехода фкуса по табу
            _tinyEditor: undefined, //экземпляр tinyMCE
            _lastHeight: undefined, //последняявысота для UpdateHeight
            _tinyReady: null, //deferred готовности tinyMCE
            _readyContolDeffered: null, //deferred Готовности контрола
            _saveBeforeWindowClose: null,
            _sourceArea: undefined,
            _sourceContainer: undefined, //TODO: избавиться от _sourceContainer
            _tinyIsInit: false,//TODO: избьавиться от этого флага через  _tinyReady
            _enabled: undefined, //TODO: подумать как избавиться от этого
            _typeInProcess: false,
            _clipboardText: undefined,
            _mouseIsPressed: false, //Флаг того что мышь была зажата в редакторе
            _imageOptionsPanel: undefined,
            _lastReview: undefined,
            _fromTouch: false
         },

         _modifyOptions: function(options) {
            options = RichTextArea.superclass._modifyOptions.apply(this, arguments);
            options._prepareReviewContent = this._prepareReviewContent.bind(this);
            options._prepareContent = this._prepareContent.bind(this);
            return options;
         },

         $constructor: function() {
            var
               self = this;
            this._publish('onInitEditor', 'onUndoRedoChange','onNodeChange', 'onFormatChange', 'onToggleContentSource');
            this._sourceContainer = this._container.find('.controls-RichEditor__sourceContainer');
            this._sourceArea = this._sourceContainer.find('.controls-RichEditor__sourceArea').bind('input', this._onChangeAreaValue.bind(this));
            this._readyContolDeffered = new Deferred().addCallbacks(function(){
               this._notify('onReady');
            }.bind(this), function (e) {
               return e;
            });
            this._dChildReady.push(this._readyContolDeffered);
            this._dataReview = this._container.find('.controls-RichEditor__dataReview');
            this._tinyReady = new Deferred();
            this._inputControl = this._container.find('.controls-RichEditor__editorFrame');
            this._fakeArea = this._container.find('.controls-RichEditor__fakeArea');
            this._initInputHeight();
            this._options.editorConfig.selector = '#' + this.getId() + ' > .controls-RichEditor__editorFrame';
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
               }
               this._updateDataReview(this.getText());
            }.bind(this));

            this._togglePlaceholder();
            if (cConstants.browser.isMobileAndroid) {
               this._notifyTextChanged = this._notifyTextChanged.debounce(300);
            }
            this._lastReview = this.isEnabled() ? undefined : this.getText();
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

            if ((id = this._getYouTubeVideoId(strHelpers.escapeTagsFromStr(link, [])))) {
               content = [
                  '<iframe',
                  ' width="' + constants.defaultYoutubeWidth + '"',
                  ' height="' + constants.defaultYoutubeHeight + '"',
                  ' style="min-width:' + constants.minYoutubeWidth + 'px; min-height:' + constants.minYoutubeHeight + 'px;"',
                  ' src="' + '//www.youtube.com/embed/' + id + '"',
                  ' frameborder="0" >',
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
               this._performByReady(function() {
                  html = this._prepareContent(html);
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

         /**
          * Устанавливает текстовое значение внутри поля ввода.
          * @param {String} text Текстовое значение, которое будет установлено в поле ввода.
          * @example
          * <pre>
          *     if (control.getText() == "Введите ФИО") {
          *        control.setText("");
          *     }
          * </pre>
          * @see text
          * @see getText
          */
         setText: function(text) {
            if (text !== this._curValue()) {
               this._drawText(text);
            }
            this._setText(text);
         },

         setActive: function(active) {
            //если тини еще не готов а мы передадим setActive родителю то потом у тини буддет баг с потерей ренжа,
            //поэтому если isEnabled то нужно передавать setActive родителю только по готовности тини
            var args = [].slice.call(arguments);
            if (active && this._needFocusOnActivated() && this.isEnabled()) {
               this._performByReady(function() {
                  this._tinyEditor.focus();
                  if (cConstants.browser.isMobileAndroid) {
                     // на android устройствах не происходит подскролла нативного
                     // наш функционал тестируется на планшете фирмы MI на котором клавиатура появляется долго ввиду анимации =>
                     // => сразу сделать подскролл нельзя
                     // появление клавиатуры стрельнет resize у window в этот момент можно осуществить подскролл до элемента ввода текста
                     var
                        resizeHandler = function(){
                           this._inputControl[0].scrollIntoView(false);
                           $(window).off('resize', resizeHandler);
                        }.bind(this);
                     $(window).on('resize', resizeHandler);
                  } else if (cConstants.browser.isMobileIOS) {
                     this._scrollTo(this._inputControl[0], 'top');
                  }

                  RichTextArea.superclass.setActive.apply(this, args);
               }.bind(this));
            } else {
               RichTextArea.superclass.setActive.apply(this, args);
            }
         },

         destroy: function() {
            cConstants.$win.unbind('beforeunload', this._saveBeforeWindowClose);
            this.saveToHistory(this.getText());
            RichUtil.unmarkRichContentOnCopy(this._dataReview);
            RichUtil.unmarkRichContentOnCopy(this._inputControl);
            //Проблема утечки памяти через tinyMCE
            //Проверка на то созадвался ли tinyEditor
            if (this._tinyEditor && this._tinyReady.isReady()) {
               this._tinyEditor.destroy();
               if (this._tinyEditor.theme ) {
                  if (this._tinyEditor.theme.panel) {
                     this._tinyEditor.theme.panel._elmCache = null;
                     this._tinyEditor.theme.panel.$el = null;
                  }
                  this._tinyEditor.theme.panel = null;
               }
               for (var key in this._tinyEditor) {
                  if (this._tinyEditor.hasOwnProperty(key)) {
                     this._tinyEditor[key] = null;
                  }
               }
               this._tinyEditor.destroyed = true;
            }
            dcHelpers.trackElement(this._container, false);
            this._container.unbind('keydown keyup');
            this._sourceArea.unbind('input');
            this._tinyEditor = null;
            this._sourceContainer  = null;
            this._fakeArea = null;
            this._sourceArea = null;
            this._dataReview = null;
            this._options.editorConfig.setup = null;
            if (!this._readyContolDeffered.isReady()) {
               this._readyContolDeffered.errback();
            }
            this._inputControl.unbind('mouseup dblclick click mousedown touchstart scroll');
            if (this._imageOptionsPanel) {
               this._imageOptionsPanel.destroy();
            }
            RichTextArea.superclass.destroy.apply(this, arguments);
         },

         /**
          * Метод открывает диалог, позволяющий добавлять контент с учетом стилей
          * @param onAfterCloseHandler Функция, вызываемая после закрытия диалога
          * @param target объект рядом с которым будет позиционироваться  диалог если нотификатор отсутствует
          */
         pasteFromBufferWithStyles: function(onAfterCloseHandler, target) {
            var
               self = this,
               dialog,
               eventResult,
               prepareAndInsertContent = function(content) {
                  //Вычищаем все ненужные теги, т.к. они в конечном счёте превращаютя в <p>
                  content = content.replace(new RegExp('<!--StartFragment-->|<!--EndFragment-->|<html>|<body>|</html>|</body>', 'img'), '').trim();
                  //получение результата из события  BeforePastePreProcess тини потому что оно возвращает контент чистым от тегов Ворда,
                  //withStyles: true нужно чтобы в нашем обработчике BeforePastePreProcess мы не обрабатывали а прокинули результат в обработчик тини
                  eventResult = self.getTinyEditor().fire('BeforePastePreProcess', {content: content, withStyles: true});
                  self.insertHtml(eventResult.content);
                  self._setTrimmedText(self._getTinyEditorValue());
               },
               onPaste = function(event) {
                  var content = event.clipboardData.getData ? event.clipboardData.getData('text/html') : '';
                  if (!content) {
                     content = event.clipboardData.getData ? event.clipboardData.getData('text/plain') : window.clipboardData.getData('Text');
                  }
                  prepareAndInsertContent(content);
                  dialog.close();
                  event.stopPropagation();
                  event.preventDefault();
                  return false;
               },
               service = {
                  destroy: function(){}
               },
               createDialog = function() {
                  cIndicator.hide();
                  require(['js!SBIS3.CORE.Dialog', 'js!SBIS3.CONTROLS.Button'], function(Dialog, Button) {
                     dialog = new Dialog({
                        resizable: false,
                        width: 348,
                        border: false,
                        top: target && target.offset().top + target.height(),
                        left: target && target.offset().left - (348 - target.width()),
                        autoHeight: true,
                        keepSize: false,
                        opener: self._options.richEditor,
                        handlers: {
                           onReady: function () {
                              var
                                 container = this.getContainer(),
                                 label = $('<div class="controls-RichEditor__pasteWithStylesLabel">Нажмите CTRL + V для вставки текста из буфера обмена с сохранением стилей</div>');
                              container.append(label)
                                 .addClass('controls-RichEditor__pasteWithStyles');
                              new Button({
                                 caption: rk('Отменить'),
                                 tabindex: -1,
                                 className: 'controls-Button__light',
                                 element: $('<div class="controls-RichEditor__pasteWithStylesButton">').appendTo(container),
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
                  service.destroy();
               };

            cIndicator.show();
            if (Di.isRegistered('SBIS3.Plugin.Source.LocalService')) {
               //service создаётся каждый раз и destroy`тся каждый раз тк плагин может перезагрузиться и сервис протухнет
               //см прохождение по задаче:https://inside.tensor.ru/opendoc.html?guid=c3362ff8-4a31-4caf-a284-c0832c4ac4d5&des=
               service = Di.resolve('SBIS3.Plugin.Source.LocalService',{
                  endpoint: {
                     address: 'Clipboard-1.0.1.0',
                     contract: 'Clipboard'
                  },
                  options: { mode: 'silent' }
               });
               service.isReady().addCallback(function() {
                  service.call("getContentType", {}).addCallback(function (ContentType) {
                     service.call(ContentType === 'Text/Html' || ContentType === 'Text/Rtf' || ContentType === 'Html' || ContentType === 'Rtf' ? 'getHtml' : 'getText', {}).addCallback(function (content) {
                        cIndicator.hide();
                        prepareAndInsertContent(content);
                        if (typeof onAfterCloseHandler === 'function') {
                           onAfterCloseHandler();
                        }
                        service.destroy();
                     }).addErrback(function () {
                        createDialog();
                     });
                  }).addErrback(function () {
                     createDialog();
                  });
               }).addErrback(function () {
                  createDialog();
               });
            } else {
               createDialog();
            }
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
         saveToHistory: function(valParam) {
            var
               self = this,
               isDublicate = false;
            if (valParam && typeof valParam === 'string' && self._textChanged) {
               this.getHistory().addCallback(function(arrBL){
                  if( typeof arrBL  === 'object') {
                     colHelpers.forEach(arrBL, function (valBL, keyBL) {
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
          * @return {Deferred} в случае успеха, дефферед врнет массив данных
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
            return UserConfig.getParamValues(this._getNameForHistory()).addCallback(function(arrBL) {
               if( typeof arrBL  === 'string') {
                  arrBL = [arrBL];
               }
               return arrBL;
            })
         },

         /**
          * Установить стиль для выделенного текста
          * @param {Object} style Объект, содержащий устанавливаемый стиль текста
          * @private
          */
         setFontStyle: function(style) {
            //TinyMCE использует для определения положения каретки <br data-mce-bogus="1">.
            //При смене формата содаётся новый <span class='classFormat'>.
            //В FF в некторых случаях символ каретки не удаляется из предыдущего <span> блока при смене формата
            //из за-чего происход разрыв строки.
            if (cConstants.browser.firefox &&  $(this._tinyEditor.selection.getNode()).find('br').attr('data-mce-bogus') == '1') {
               $(this._tinyEditor.selection.getNode()).find('br').remove();
            }
            for (var stl in constants.styles) {
               if (style !== stl) {
                  this._removeFormat(stl);
               }
            }
            if (style !== 'mainText') {
               this._applyFormat(style, true);
            }
            this._tinyEditor.execCommand('');
            //при установке стиля(через форматтер) не стреляет change
            this._setTrimmedText(this._getTinyEditorValue());
         },

         /**
          * Установить цвет для выделенного текста
          * @param {Object} color Объект, содержащий устанавливаемый цвет текста
          * @private
          */
         setFontColor: function(color) {
            this._applyFormat('forecolor', color);
            this._tinyEditor.execCommand('');
            //при установке стиля(через форматтер) не стреляет change
            this._setTrimmedText(this._getTinyEditorValue());
         },
         /**
          * Установить размер для выделенного текста
          * @param {Object} size Объект, содержащий устанавливаемый размер текста
          * @private
          */
         setFontSize: function(size) {
            size = size + 'px';
            //необходимо удалять текущий формат(размер шрифта) чтобы правльно создавались span
            this._removeFormat('fontsize', size);
            this._tinyEditor.execCommand('FontSize', false,  size);
            this._tinyEditor.execCommand('');
            //при установке стиля(через форматтер) не стреляет change
            this._setTrimmedText(this._getTinyEditorValue());
         },

         /**
          * Получить экземпляр редактора tinyMCE
          */
         getTinyEditor: function() {
            return this._tinyEditor;
         },

         /**
          * <wiTag group="Управление">
          * Вставить смайл.
          * Вставляет смайл по его строковому соответствию^
          * <ul>
          *    <li>Smile - улыбка;</li>
          *    <li>Nerd - умник;</li>
          *    <li>Angry - злой;</li>
          *    <li>Annoyed - раздраженный;</li>
          *    <li>Blind - слепой;</li>
          *    <li>Cool - крутой;</li>
          *    <li>Cry - плачет;</li>
          *    <li>Devil - дьявол;</li>
          *    <li>Dumb - тупица;</li>
          *    <li>Inlove - влюблен;</li>
          *    <li>Kiss - поцелуй;</li>
          *    <li>Laugh - смеётся;</li>
          *    <li>Money - алчный;</li>
          *    <li>Neutral - нейтральный;</li>
          *    <li>Puzzled - недоумевает;</li>
          *    <li>Rofl - подстолом;</li>
          *    <li>Sad - расстроен;</li>
          *    <li>Shocked - шокирован;</li>
          *    <li>Snooze - дремлет;</li>
          *    <li>Tongue - дразнит;</li>
          *    <li>Wink - подмигивает;</li>
          *    <li>Yawn - зевает;</li>
          * </ul>
          * @public
          * @example
          * <pre>
          *    fre.insertSmile('Angry')
          * </pre>
          * @param {String} smile название смайла
          */
         insertSmile: function(smile) {
            if (typeof smile === 'string') {
               $.each(smiles, function(i, obj) {
                  if (obj.key === smile) {
                     smile = obj;
                     return false;
                  }
               });
               if (typeof smile === 'object') {
                  this.insertHtml(this._smileHtml(smile));
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
            this._tinyEditor.execCommand(command);
            //TODO:https://github.com/tinymce/tinymce/issues/3104, восстанавливаю выделение тк оно теряется если после нжатия кнопки назад редактор стал пустым
            if ((cConstants.browser.firefox || cConstants.browser.isIE) && command == 'undo' && this._getTinyEditorValue() == '') {
               this._tinyEditor.selection.select(this._tinyEditor.getBody(), true);
            }
         },

         /**
          * Метод открывает диалог, позволяющий вставить ссылку
          * @param onAfterCloseHandler Функция, вызываемая после закрытия диалога
          * @param target объект рядом с которым будет позиционироваться  диалог вставки ссылки
          */
         insertLink: function(onAfterCloseHandler, target) {
            var
               editor = this._tinyEditor,
               selection = editor.selection,
               range = cFunctions.clone(selection.getRng()),
               element = selection.getNode(),
               anchor = editor.dom.getParent(element, 'a[href]'),
               href = anchor ? editor.dom.getAttrib(anchor, 'href') : '',
               fre = this,
               context = new cContext(),
               dom = editor.dom,
               protocol = /(https?|ftp|file):\/\//gi,
               dialogWidth = 440;
            require(['js!SBIS3.CORE.Dialog', 'js!SBIS3.CORE.FieldString', 'js!SBIS3.CONTROLS.Button'], function(Dialog, FieldString, Button) {
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
                           hrefLabel = $('<div class="controls-RichEditor__insertLinkHrefLabel">Адрес</div>'),
                           okButton = $('<div class="controls-RichEditor__insertLinkButton"></div>'),
                           linkAttrs = {
                              target: '_blank',
                              rel: null,
                              'class': null,
                              title: null
                           };
                        this._fieldHref = $('<div class="controls-RichEditor__insertLinkHref"></div>');
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
                        new Button({
                           caption: 'ОК',
                           defaultButton: true,
                           parent: this,
                           handlers: {
                              onActivated: function () {
                                 href = this.getParent()._fieldHref.getValue();
                                 if (href && href.search(protocol) === -1) {
                                    href = 'http://' + href;
                                 }
                                 if (element && element.nodeName === 'A' && element.className.indexOf('ws-focus-out') < 0) {
                                    if (href) {
                                       dom.setAttribs(element, {
                                          target: '_blank',
                                          href: strHelpers.escapeHtml(href)
                                       });
                                    } else {
                                       editor.execCommand('unlink');
                                    }
                                    editor.undoManager.add();
                                 } else if (href) {
                                    linkAttrs.href = href;
                                    editor.selection.setRng(range);
                                    if (editor.selection.getContent() === '' || (fre._isOnlyTextSelected()) && cConstants.browser.firefox) {
                                       var
                                          linkText = selection.getContent({format: 'text'}) || href;
                                       editor.insertContent(dom.createHTML('a', linkAttrs, dom.encode(linkText)));
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
                        if (cConstants.browser.isMobileIOS) {
                           //финт ушами, тк фокус с редактора убрать никак нельзя
                           //тк кнопки на которую нажали у нас в обработчике тоже нет
                           //ставим фокус на любой блок внутри нового диалогового окна, например на контейнер кнопки
                           okButton.focus();
                        }
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
          */
         setCursorToTheEnd: function() {
            var
               editor, nodeForSelect, root;
            if (this._tinyEditor) {
               editor = this._tinyEditor,
               nodeForSelect = editor.getBody(),
               root = editor.dom.getRoot();
               // But firefox places the selection outside of that tag, so we need to go one level deeper:
               if (editor.isGecko) {
                  nodeForSelect = root.childNodes[root.childNodes.length - 1];
                  nodeForSelect = nodeForSelect.childNodes[nodeForSelect.childNodes.length - 1];
               }
               editor.selection.select(nodeForSelect, true);
               editor.selection.collapse(false);
            }
         },

         /**
          * Возвращает контейнер, используемый компонентом для ввода данных
          * @returns {*|jQuery|HTMLElement}
          * @deprecated
          */
         //TODO:придумать дургое решение: https://inside.tensor.ru/opendoc.html?guid=c7676fdd-b4de-4ac6-95f5-ab28d4816c27&description=
         getInputContainer: function() {
            return this._inputControl;
         },

         /**
          * Установить выравнивание текста для активной строки
          * @param {String} align Устанавливаемое выравнивание
          * @private
          */
         setTextAlign: function(align) {
            //TODO: перейти на  this.execCommand('JustifyRight'), http://archive.tinymce.com/wiki.php/Tutorials:Command_identifiers
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
            this._setTrimmedText(this._getTinyEditorValue());
         },

         toggleContentSource: function(visible) {
            var
               sourceVisible = visible !== undefined ? !!visible : this._sourceContainer.hasClass('ws-hidden'),
               container = this._tinyEditor.getContainer() ? $(this._tinyEditor.getContainer()) : this._inputControl;
            if (sourceVisible) {
               this._sourceContainer.css({
                  'height' : container.outerHeight(),
                  'width' : container.outerWidth()
               });
               this._sourceArea.val(this.getText());
            }
            this._sourceContainer.toggleClass('ws-hidden', !sourceVisible);
            container.toggleClass('ws-hidden', sourceVisible);
            this._notify('onToggleContentSource', sourceVisible);
         },

         insertImageTemplate: function(key, fileobj) {
            var
               meta = fileobj.id || '',
               URL = this._prepareImageURL(fileobj);
            //TODO: придумтаь как сделать без without-margin
            switch (key) {
               case "1":
                  //необходимо вставлять пустой абзац с кареткой, чтобы пользователь понимал куда будет производиться ввод
                  this._insertImg(URL, 'image-template-left', meta, '<p class="without-margin">', '</p><p>{$caret}</p>');
                  break;
               case "2":
                  this._insertImg(URL, '', meta, '<p class="controls-RichEditor__noneditable" style="text-align: center;">', '</p><p></p>');
                  break;
               case "3":
                  //необходимо вставлять пустой абзац с кареткой, чтобы пользователь понимал куда будет производиться ввод
                  this._insertImg(URL, 'image-template-right ', meta, '<p class="without-margin">', '</p><p>{$caret}</p>');
                  break;
               case "4":
                  //todo: сделать коллаж
                  break;
               case "6":
                  this._insertImg(URL, '', meta);
                  break;
            }
         },
         /*БЛОК ПУБЛИЧНЫХ МЕТОДОВ*/

         /*БЛОК ПРИВАТНЫХ МЕТОДОВ*/
         _setTrimmedText: function(text) {
            this._setText(this._trimText(text));
         },

         _setText: function(text) {
            if (text !== this.getText()) {
               if (!this._isEmptyValue(text) && !this._isEmptyValue(this._options.text)) {
                  this._textChanged = true;
               }
               this._options.text = text;
               this._notify('onTextChange', text);
               this._notifyTextChanged();
               this._updateDataReview(text);
               this.clearMark();
            }
            //При нажатии enter передаётся trimmedText поэтому updateHeight text === this.getText() и updateHeight не зовётся
            this._updateHeight();
            this._togglePlaceholder(text);
         },
         _notifyTextChanged: function() {
            this._notifyOnPropertyChanged('text');
         },
         _showImagePropertiesDialog: function(target) {
            var
               $image = $(target),
               editor = this._tinyEditor,
               self = this;
            require(['js!SBIS3.CORE.Dialog'], function(Dialog) {
               new Dialog({
                  name: 'imagePropertiesDialog',
                  template: 'js!SBIS3.CONTROLS.RichEditor.ImagePropertiesDialog',
                  selectedImage: $image,
                  editorWidth: self._inputControl.width(),
                  handlers: {
                     onBeforeShow: function () {
                        CommandDispatcher.declareCommand(this, 'saveImage', function () {
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

         _smileHtml: function(smile) {
            return '&#' + smile.code + ';';
         },

         /**
          * JavaScript function to match (and return) the video Id
          * of any valid Youtube URL, given as input string.
          * @author: Stephan Schmitz <eyecatchup@gmail.com>
          * @url: http://stackoverflow.com/a/10315969/624466
          */
         _getYouTubeVideoId: function(link) {
            var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
            return link.match(p) ? RegExp.$1 : false;
         },

         _bindEvents: function() {
            var
               self = this,
               editor = this._tinyEditor;

            //По инициализации tinyMCE
            editor.on('initContentBody', function(){
               var
                  bindImageEvent = function(event, callback) {
                     self._inputControl.bind(event, function(e){
                        if (self._inputControl.attr('contenteditable') !== 'false') {
                           var
                              target = e.target;
                           if (target.nodeName === 'IMG' && target.className.indexOf('mce-object-iframe') === -1) {
                              callback(target);
                           }
                        }
                     });
                  };
               //По двойному клику на изображение показывать диалог редактирования размеров
               bindImageEvent('dblclick', function(target) {
                  self._showImagePropertiesDialog(target);
               });
               //По нажатию на изображения показывать панель редактирования самого изображения
               bindImageEvent('mousedown touchstart', function(target) {
                  self._showImageOptionsPanel($(target));
               });
               //При клике на изображение снять с него выделение
               bindImageEvent('click', function() {
                  var
                     selection = window.getSelection ? window.getSelection() : null;
                  if (selection) {
                     selection.removeAllRanges();
                  }
               });
               this._inputControl.bind('scroll', function(e) {
                  if (this._imageOptionsPanel) {
                     this._imageOptionsPanel.hide();
                  }
               }.bind(this));

               this._inputControl.attr('tabindex', 1);

               if (!cConstants.browser.firefox) { //в firefox работает нативно
                  this._inputControl.bind('mouseup', function (e) { //в ie криво отрабатывает клик
                     if (e.ctrlKey) {
                         //По ctrl+click по ссылке внутри редктора открывается ссылка в новой вкладке
                         //если перед этим текст делали зеленым то выходит вёрстка
                         //<a><span green>text</span></a>
                         //в момент ctrl+click необходимо смотреть на тег и на его родителя
                        var
                           target = e.target.nodeName === 'A' ? e.target :$(e.target).parent('a')[0]; //ccылка может быть отформатирована
                        if (target && target.nodeName === 'A' && target.href) {
                           window.open(target.href, '_blank');
                        }
                     }
                  });
               }
               this._notifyOnSizeChanged();

               if (!self._readyContolDeffered.isReady()) {
                  self._tinyReady.addCallback(function() {
                     self._readyContolDeffered.callback();
                  });
               }

               this._inputControl = $(editor.getBody());
               RichUtil.markRichContentOnCopy(this._inputControl);
               self._tinyReady.callback();
               /*НОТИФИКАЦИЯ О ТОМ ЧТО В РЕДАКТОРЕ ПОМЕНЯЛСЯ ФОРМАТ ПОД КУРСОРОМ*/
               //formatter есть только после инита поэтому подписка осуществляется здесь
               editor.formatter.formatChanged('bold,italic,underline,strikethrough,alignleft,aligncenter,alignright,alignjustify,title,subTitle,selectedMainText,additionalText', function(state, obj) {
                  self._notify('onFormatChange', obj, state)
               });
               self._notify('onInitEditor');
            }.bind(this));

            //БИНДЫ НА ВСТАВКУ КОНТЕНТА И ДРОП
            editor.on('onBeforePaste', function(e) {
               var
                  regexp =  new RegExp('(https?|ftp|file):\/\/[-A-Za-zА-ЯЁа-яё0-9.]+(?::[0-9]+)?(\/[-A-Za-zА-ЯЁа-яё0-9+&@#$/%№=~_{|}!?:,.;()]*)*');
               if (self.addYouTubeVideo(e.content)) {
                  return false;
               }
            });

            editor.on('Paste', function(e) {
               self._clipboardText = e.clipboardData ?
                  cConstants.browser.isMobileIOS ? e.clipboardData.getData('text/plain') : e.clipboardData.getData('text') :
                  window.clipboardData.getData('text');
               editor.plugins.paste.clipboard.pasteFormat = 'html';
            });

            //Обработка вставки контента
            editor.on('BeforePastePreProcess', function(e) {
               var
                  isRichContent = e.content.indexOf('orphans: 31415;') !== -1,
                  content = e.content;
               e.content =  content.replace('orphans: 31415;','');
               //Необходимо заменять декорированные ссылки обратно на url
               //TODO: временное решение для 230. удалить в 240 когда сделают ошибку https://inside.tensor.ru/opendoc.html?guid=dbaac53f-1608-42fa-9714-d8c3a1959f17
               e.content = self._prepareContent( e.content);
               //Парсер TinyMCE неправльно распознаёт стили из за - &quot;TensorFont Regular&quot;
               e.content = e. content.replace(/&quot;TensorFont Regular&quot;/gi,'\'TensorFont Regular\'');
               //_mouseIsPressed - флаг того что мышь была зажата в редакторе и не отпускалась
               //равносильно тому что d&d совершается внутри редактора => не надо обрезать изображение
               if (!self._mouseIsPressed) {
                  e.content = Sanitize(e.content, {validNodes: {img: false}, checkDataAttribute: false});
               }
               // при форматной вставке по кнопке мы обрабаотываем контент через событие tinyMCE
               // и послыаем метку форматной вставки, если метка присутствует не надо обрабатывать событие
               // нашим обработчиком, а просто прокинуть его в дальше
               if (e.withStyles) {
                  return e;
               }
               if (!isRichContent) {
                  if (self._options.editorConfig.paste_as_text) {
                     //если данные не из БТР и не из word`a, то вставляем как текст
                     //В Костроме юзают БТР с другим конфигом, у них всегда форматная вставка
                     if (self._clipboardText !== false) {
                        e.content = self._getTextBeforePaste();
                     }
                  }
               }
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
                  maximalWidth = this._inputControl.width() - constants.imageOffset;
                  for (var i = 0; i < $images.length; i++) {
                     naturalSizes = ImageUtil.getNaturalSizes($images[i]);
                     currentWidth = $($images[i]).width();
                     width = currentWidth > maximalWidth ? maximalWidth : currentWidth === 0 ? naturalSizes.width > maximalWidth ? maximalWidth : naturalSizes.width : currentWidth;
                     if (!$images[i].style || ((!$images[i].style.width || $images[i].style.width.indexOf('%') < 0)) && (naturalSizes.width > naturalSizes.height) ) {
                        $($images[i]).css({
                           'width': width,
                           'height': 'auto'
                        });
                     }
                  }
               }
               //Замена переносов строк на <br>
               event.node.innerHTML = event.node.innerHTML.replace(/([^>])\n(?!<)/gi, '$1<br />');
               // Замена отступов после переноса строки и в первой строке
               // пробелы заменяются с чередованием '&nbsp;' + ' '
               event.node.innerHTML = this._replaceWhitespaces(event.node.innerHTML);

            }.bind(this));

            editor.on('drop', function() {
               //при дропе тоже заходит в BeforePastePreProcess надо обнулять _clipboardTex
               self._clipboardText = false;
            });

            editor.on('dragstart', function(event) {
               //Youtube iframe не отдаёт mouseup => окошко с видеороликом таскается за курсором
               //запрещаем D&D iframe элементов
               if (event.target && $(event.target).hasClass('mce-object-iframe')) {
                  event.preventDefault();
               }
             });

            //БИНДЫ НА СОБЫТИЯ КЛАВИАТУРЫ (ВВОД)
            if (cConstants.browser.isMobileIOS || cConstants.browser.isMobileAndroid) {
               //TODO: https://github.com/tinymce/tinymce/issues/2533
               this._inputControl.on('input', function() {
                  self._setTrimmedText(self._getTinyEditorValue());
               });
            }

            //Передаём на контейнер нажатие ctrl+enter и escape
            this._container.bind('keydown', function(e) {
               if (!(e.which === cConstants.key.enter && e.ctrlKey) && e.which !== cConstants.key.esc) {
                  e.stopPropagation();
               }
            });

            //Запрещаем всплытие Enter, Up и Down
            this._container.bind('keyup', function(e) {
               if ((e.which === cConstants.key.enter && !e.ctrlKey)|| e.which === cConstants.key.up || e.which === cConstants.key.down) {
                  e.stopPropagation();
                  e.preventDefault();
               }
            });

            editor.on('keyup', function(e) {
               self._typeInProcess = false;
               if (!(e.keyCode === cConstants.key.enter && e.ctrlKey)) { // Не нужно обрабатывать ctrl+enter, т.к. это сочетание для дефолтной кнопки
                  self._setTrimmedText(self._getTinyEditorValue());
               }
            });

            editor.on('keydown', function(e) {
               self._typeInProcess = true;

               if (e.which === cConstants.key.pageDown || e.which === cConstants.key.pageUp || (e.which === cConstants.key.insert && !e.shiftKey && !e.ctrlKey)) {
                  e.stopPropagation();
                  e.preventDefault();
               }
               if (e.keyCode == cConstants.key.tab) {
                  var
                     area = self.getParent(),
                     nextControl = area.getNextActiveChildControl(e.shiftKey);
                  if (nextControl) {
                     self._fakeArea.focus();
                     nextControl.setActive(true, e.shiftKey);
                  }
                  e.stopImmediatePropagation();
                  e.preventDefault();
                  //после tab не происходит keyup => необходимо сбрасывать флаг нажатой кнопки
                  self._typeInProcess = false;
                  return false;
               } else if (e.which === cConstants.key.enter && e.ctrlKey) {
                  e.preventDefault();//по ctrl+enter отменяем дефолтное(чтобы не было перевода строки лишнего), разрешаем всплытие
                  //по ctrl+enter может произойти перехват события( например главная кнопка) и keyup может не сработать
                  //необходимо сбрасывать флаг зажатой кнопки, чтобы шло обновление опции text (сейчас обновление опции text не идёт при зажатаой клавише, чтобы не тормозило)
                  self._typeInProcess = false;
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
                     if (!e.ctrlKey && !(e.metaKey && cConstants.browser.isMacOSDesktop) && e.charCode !== 0) {
                        editor.bodyElement.innerHTML = '';
                     }
                  }
               }
               setTimeout(function() {
                  self._togglePlaceholder(self._getTinyEditorValue());
               }, 1);
            });

            editor.on('change', function(e) {
               self._setTrimmedText(self._getTinyEditorValue());
            });

            editor.on( 'cut',function(e){
               setTimeout(function() {
                  self._setTrimmedText(self._getTinyEditorValue());
               }, 1);
            });
            //Сообщаем компоненту об изменении размеров редактора
            editor.on('resizeEditor', function() {
               self._notifyOnSizeChanged();
            });

            //реагируем на то что редактор изменился при undo/redo
            editor.on('undo', function() {
               self._setTrimmedText(self._getTinyEditorValue());
            });

            editor.on('redo', function() {
               self._setTrimmedText(self._getTinyEditorValue());
            });
            //Уличная магия в чистом виде (на мобильных устройствах просто не повторить) :
            //Если начать выделять текст в редакторе и увести мышь за его границы и продолжить печатать падают ошибки:
            //Клик окончится на каком то элементе, listview например стрельнет фокусом на себе
            //если  есть активный редактор то запомнится выделение(lastFocusBookmark) и прежде чем
            //введется символ сработает focusin(который не перебить непонятно почему)
            //в нём сработает восстановление выделения, а выделенного уже и нет => error
            //Решение: в mouseLeave смотреть зажата ли мышь, и если зажата убирать activeEditor
            //тк activeEditor будет пустой не запомнится LastFocusBookmark и не будет восстановления выделения
            //activeEditor восстановится сразу после ввода символа а может и раньше, главное что восстновления выделения не будет
            if (!cConstants.browser.isMobileIOS && !cConstants.browser.isMobileAndroid) {
               editor.on('mousedown', function(e) {
                  self._mouseIsPressed = true;
               });
               editor.on('mouseup', function(e) {
                  self._mouseIsPressed = false;
               });
               editor.on('focusout', function(e) {
                  if (self._mouseIsPressed){
                     editor.editorManager.activeEditor = false;
                  }
                  self._mouseIsPressed = false;
               });
            }

            //сохранение истории при закрытии окна
            this._saveBeforeWindowClose  =  function() {
               this.saveToHistory(this.getText());
            }.bind(this);
            cConstants.$win.bind('beforeunload', this._saveBeforeWindowClose);

            /*НОТИФИКАЦИЯ О ТОМ ЧТО В РЕДАКТОРЕ ПОМЕНЯЛСЯ UNDOMANAGER*/
            editor.on('TypingUndo AddUndo ClearUndos redo undo', function() {
               self._notify('onUndoRedoChange', {
                  hasRedo: self._tinyEditor.undoManager.hasRedo(),
                  hasUndo: self._tinyEditor.undoManager.hasUndo()
               });
            });
            /*НОТИФИКАЦИЯ О ТОМ ЧТО В РЕДАКТОРЕ ПОМЕНЯЛСЯ NODE ПОД КУРСОРОМ*/
            editor.on('NodeChange', function(e) {
               self._notify('onNodeChange', e)
            });
            editor.on('focusin', function(e) {
               if (self._fromTouch){
                  EventBus.globalChannel().notify('MobileInputFocus');
               }
            });
            editor.on('focusout', function(e) {
               if (self._fromTouch){
                  EventBus.globalChannel().notify('MobileInputFocusOut');
                  self._fromTouch = false;
               }
            });
            editor.on('touchstart', function(e) {
               self._fromTouch = true;
            });

         },

         _showImageOptionsPanel: function(target) {
            var
               imageOptionsPanel = this._getImageOptionsPanel(target);
            imageOptionsPanel.show();
         },

         _getImageOptionsPanel: function(target){
            var
               self = this;
            if (!this._imageOptionsPanel) {
               this._imageOptionsPanel = new ImageOptionsPanel({
                  parent: self,
                  target: target,
                  targetPart: true,
                  corner: 'bl',
                  closeByExternalClick: true,
                  element: $('<div></div>'),
                  imageFolder: self._options.imageFolder,
                  verticalAlign: {
                     side: 'top'
                  },
                  horizontalAlign: {
                     side: 'left'
                  }
               });
               this._imageOptionsPanel.subscribe('onImageChange', function(event, fileobj){
                  var
                     URL = self._prepareImageURL(fileobj);
                  this.getTarget().attr('src', URL);
                  this.getTarget().attr('data-mce-src', URL);
                  this.getTarget().attr('alt', fileobj.id);
                  self._tinyEditor.undoManager.add();
                  self._setTrimmedText(self._getTinyEditorValue());
               });
               this._imageOptionsPanel.subscribe('onImageDelete', function(){
                  var
                     $image = this.getTarget(),
                     nodeForSelect = $image.parent()[0];
                  $image.remove();
                  //Проблема:
                  //          После удаления изображения необходимо вернуть фокус в редактор,
                  //          но тк выделение было на изображении при фокусе оно пытаетсыя восстановиться.
                  //          Допустим в редакторе было только изображение, тогда выделение было вида:
                  //             start/endContainer = <p>, endOffset = 1.
                  //          После удаления <p>.childNodes.length = 0, попытается восстановиться 1 => ошибка
                  //Решение:
                  //          После удаления изображения ставить каретку в конец родительского для изображения блока
                  self._tinyEditor.selection.select(nodeForSelect, false);
                  self._tinyEditor.selection.collapse();
                  self._tinyEditor.undoManager.add();
                  self._setTrimmedText(self._getTinyEditorValue());
               });
            } else {
               this._imageOptionsPanel.setTarget(target);
            }
            return this._imageOptionsPanel;
         },
            
         _prepareImageURL: function(fileobj) {
            return'/previewer' + (fileobj.filePath ? fileobj.filePath : fileobj.url);
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
                     'max-height': this._options.maximalHeight ? this._options.maximalHeight : '',
                     'min-height': this._options.minimalHeight
                  });
               } else {
                  this._dataReview.height(this._container.height()  - constants.dataReviewPaddings);//тк у dataReview box-sizing: borderBox высоту надо ставить меньше на падддинг и бордер
               }
               this._updateDataReview(this.getText() || '');
               this._dataReview.toggleClass('ws-hidden', enabled);
            }

            container.toggleClass('ws-hidden', !enabled);
            this._inputControl.toggleClass('ws-hidden', !enabled);
            //Требуем в будущем пересчитать размеры контрола
            this._notifyOnSizeChanged();

            RichTextArea.superclass._setEnabled.apply(this, arguments);
         },

         _initTiny: function() {
            var
               self = this;
            if (!this._tinyEditor && !this._tinyIsInit) {
               this._tinyIsInit = true;
               require(['css!SBIS3.CONTROLS.RichTextArea/resources/tinymce/skins/lightgray/skin.min',
                  'css!SBIS3.CONTROLS.RichTextArea/resources/tinymce/skins/lightgray/content.inline.min',
                  'js!SBIS3.CONTROLS.RichTextArea/resources/tinymce/tinymce'],function(){
                  tinyMCE.baseURL = cPathResolver.resolveComponentPath('SBIS3.CONTROLS.RichTextArea') + 'resources/tinymce';
                  tinyMCE.init(self._options.editorConfig);
               });
            }
            this._tinyReady.addCallback(function () {
               this._tinyEditor.setContent(this._prepareContent(this.getText()));
               //Проблема:
               //          1) При инициализации тини в историю действий добавляет контент блока на котором он построился
               //                (если пусто то <p><br data-mce-bogus="1"><p>)
               //          2) При открытиии задачи мы добавляем в историю действий текущий контент
               //          После выполнения пункта 2 редактор стреляет 'change'(тк история не пустая(1) и в неё добавляют(2))
               //          Далее мы стреляем изменением в контекст
               //             а тк мы могли раздекорировать ссылку то портим значение в контексте
               //Правильное решение:
               //          В методе _setText сранивать текщуее значение опции и значение в редакторе
               //          предварительно подготовив их через _prepareContent
               //          N.B!  Данное решение не подходит тк заход в _setText идёт при каждом символе
               //                и каждый раз разбирать контент на DOM-дерево не быстро =>
               //                => будет тормозить ввод в редактор
               //Решение:
               //          Очистить историю редактора (clear) после его построения, чтобы пункт 2 был
               //          первым в истории изщменений и редактор не стрелял 'change'
               this._tinyEditor.undoManager.clear();
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
               content = this._tinyEditor.getContent({no_events: true}),
               args = this._tinyEditor.fire('PostProcess', {content: content});
            return args.content;
         },

         /**
          * Убрать пустые строки из начала и конца текста
          * @returns {*} текст без пустх строк вначале и конце
          */
         _trimText: function(text) {
            var
               beginReg = new RegExp('^<p>(&nbsp; *)*</p>'),// регулярка начала строки
               endReg = new RegExp('<p>(&nbsp; *)*</p>$'),// регулярка начала строки
               regResult;
            text = this._removeEmptyTags(text);
            while ((regResult = beginReg.exec(text)) !== null)
            {
               text = text.substr(regResult[0].length + 1);
            }
            while ((regResult = endReg.exec(text)) !== null)
            {
               text = text.substr(0, text.length - regResult[0].length - 1);
            }
            return (text === null || text === undefined) ? '' : ('' + text).replace(/^\s*|\s*$/g, '');
         },
         /**
          * Проблема:
          *          при нажатии клавиши установки формата( полужирный/курсив и тд) генерируется пустой тег (strong,em и тд)
          *          опция text при этом перестает быть пустой
          * Решение:
          *          убирать пустые теги перед тем как отдать значение опции text
          * @param text
          * @returns {String}
          * @private
          */
         _removeEmptyTags: function(text) {
            var
               temp = $('<div>' + text + '</div>');
            while ( temp.find(':empty:not(img, iframe, br)').length) {
               temp.find(':empty:not(img, iframe)').remove();
            }
            return temp.html();
         },

         /**
          * Получить текущее значение
          * @returns {*} Текущее значение (в формате html-кода)
          */
         _curValue: function() {
            return this._tinyEditor && this._tinyEditor.initialized && this.isEnabled() ? this._getTinyEditorValue() : this.getText();
         },

         _prepareContent: function(text) {
            text = typeof text === 'string' ? text : text === null || text === undefined ? '' : text + '';
            //TODO: временное решение для 230. удалить в 240 когда сделают ошибку https://inside.tensor.ru/opendoc.html?guid=dbaac53f-1608-42fa-9714-d8c3a1959f17
            return RichUtil.unDecorateLinks(text);
         },

         //метод показа плейсхолдера по значению//
         //TODO: ждать пока решится задача в самом tinyMCE  https://github.com/tinymce/tinymce/issues/2588
         _togglePlaceholder:function(value){
            var
               curValue = value || this.getText();
            this.getContainer().toggleClass('controls-RichEditor__empty', (curValue === '' || curValue === undefined || curValue === null) && this._inputControl.html().indexOf('</li>') < 0 && this._inputControl.html().indexOf('<p>&nbsp;') < 0);
         },

         _addToHistory: function(valParam) {
            return UserConfig.setParamValue(this._getNameForHistory(), valParam);
         },

         _getNameForHistory: function() {
            return this.getName().replace('/', '#') + 'ИсторияИзменений';
         },

         _insertImg: function(path, className, meta,  before, after) {
            var
               self = this,
               img =  $('<img src="' + path + '"></img>').css({
                  visibility: 'hidden',
                  position: 'absolute',
                  bottom: 0,
                  left: 0
               });
            className = className ? className: '';
            before = before ? before: '';
            after = after ? after: '';
            img.on('load', function() {
               var
                  isIEMore8 = cConstants.browser.isIE && !cConstants.browser.isIE8,
               // naturalWidth и naturalHeight - html5, работают IE9+
                  imgWidth =  isIEMore8 ? this.naturalWidth : this.width,
                  imgHeight =  isIEMore8 ? this.naturalHeight : this.height,
                  maxSide = imgWidth > imgHeight ? ['width', imgWidth] : ['height' , imgHeight],
                  style = ' style="width: 25%"';
               self.insertHtml(before + '<img class="' + className + '" src="' + path + '"' + style + ' alt="' + meta + '"></img>'+ after);
            });
            if (cConstants.browser.isIE8) {
               $('body').append(img);
            }
         },

         _onChangeAreaValue: function() {
            if (this._sourceContainerIsActive()) {
               this.setText(this._sourceArea.val());
            }
         },

         /**
          * Проверка активен ли режим кода
          * @private
          */
         _sourceContainerIsActive: function(){
            return !this._sourceContainer.hasClass('ws-hidden');
         },

         _updateHeight: function() {
            var
               curHeight,
               closestParagraph;
            if (this.isVisible()) {
               curHeight = this._container.height();
               //Производим подкрутку вверх если курсор провалился под клавиатуру на iPad
               //Делаем проверку на ipad сразу тк на остальный устройствах приводит к тормозам getBoundingClientRect в методе _elementIsUnderKeyboard
               if (cConstants.browser.isMobileIOS) {
                  this._backspinForIpad();
               }
               if (curHeight !== this._lastHeight) {
                  this._lastHeight = curHeight;
                  this._notifyOnSizeChanged();
               }
            }
         },
         //Метод проверяет положение элемента отпосительно клавитуры на ipad (true - под клавитурой, false - над)
         _elementIsUnderKeyboard: function(target, side){
            var
               targetOffset = target.getBoundingClientRect(),
               keyboardCoef = (window.innerHeight > window.innerWidth) ? constants.ipadCoefficient[side].vertical : constants.ipadCoefficient[side].horizontal; //Для альбома и портрета коэффициенты разные.
            return cConstants.browser.isMobileIOS && this.isEnabled() && targetOffset[side] > window.innerHeight * keyboardCoef;
         },

         _scrollTo: function(target, side){
            if (this._elementIsUnderKeyboard(target, side)) {
               target.scrollIntoView(true);
            }
         },
         //метод осушествляет подрутку до места ввода ( параграфа) если его нижний край находится под клавитурой
         _backspinForIpad: function() {
            if (this._tinyEditor && this._tinyEditor.initialized && this._tinyEditor.selection && this._textChanged && (this._inputControl[0] === document.activeElement)) {
               var
                  closestParagraph = $(this._tinyEditor.selection.getNode()).closest('p')[0];
               if (closestParagraph) {
                  //Необходимо осуществлять подскролл к предыдущему узлу если текущий под клавиатурой
                  if (closestParagraph.previousSibling && this._elementIsUnderKeyboard(closestParagraph, 'bottom')) {
                     closestParagraph.previousSibling.scrollIntoView(true);
                  }
                  //Если после подскрола к предыдущему узлу текущий узел всё еще под клавиатурой, то осуществляется подскролл к текущему
                  this._scrollTo(closestParagraph, 'bottom');
               }
            }
         },

         //Метод обновляющий значение редактора в задизабленом состоянии
         //В данном методе происходит оборачивание ссылок в <a> или их декорирование, если указана декоратор
         _updateDataReview: function(text) {
            if (this._dataReview && !this.isEnabled() &&  this._lastReview != text) {
               this._lastReview = text;
               this._dataReview.html(this._prepareReviewContent(text));
            }
         },

         _prepareReviewContent: function(text, it) {
            if (text && text[0] !== '<') {
               text = '<p>' + text.replace(/\n/gi, '<br/>') + '</p>';
            }
            text = Sanitize(text, {
               checkDataAttribute: false,
               validNodes: {
                  embed: {
                     type: true,
                     src: true
                  }
               }
            });
            return (this._options || it).highlightLinks ? strHelpers.wrapURLs(strHelpers.wrapFiles(text), true) : text;
         },

         //установка значения в редактор
         _drawText: function(text) {
            var
               autoFormat = true;
            text =  this._prepareContent(text);
            if (!this._typeInProcess && text != this._curValue()) {
               //Подготовка значения если пришло не в html формате
               if (text && text[0] !== '<') {
                  text = '<p>' + text.replace(/\n/gi, '<br/>') + '</p>';
                  autoFormat = false;
               }
               text = this._replaceWhitespaces(text);
               if (this.isEnabled() && this._tinyReady.isReady()) {
                  this._tinyEditor.setContent(text, autoFormat ? undefined : {format: 'raw'});
                  this._tinyEditor.undoManager.add();
                  if (this.isActive() && !this._sourceContainerIsActive() && !!text) {
                     this.setCursorToTheEnd();
                  }
               } else {
                  text = text || '';
                  if (this._tinyReady.isReady()) {
                     this._tinyEditor.setContent(text);
                  } else {
                     this._inputControl.html(Sanitize(text, {checkDataAttribute: false}));
                  }
               }
            }
         },

         /**
          * Применить формат к выделенному текст
          * @param {string} format  имя формата
          * @param {string} value  значение формата
          * @private
          * функция взята из textColor плагина для tinyMCE:
          * https://github.com/tinymce/tinymce/commit/2adfc8dc5467c4af77ff0e5403d00ae33298ed52
          */
         _applyFormat : function(format, value) {
            this._tinyEditor.focus();
            this._tinyEditor.formatter.apply(format, {value: value});
            this._tinyEditor.nodeChanged();
            //тк на кнопках не случается focusout не происходит добавления состояния в историю
            this._tinyEditor.undoManager.add();
         },
         /**
          * Убрать формат выделенного текста
          * @param {string} format  имя формата
          * @private
          * функция взята из textColor плагина для tinyMCE:
          * https://github.com/tinymce/tinymce/commit/2adfc8dc5467c4af77ff0e5403d00ae33298ed52
          */
         _removeFormat : function(format, value) {
            this._tinyEditor.focus();
            this._tinyEditor.formatter.remove(format, {value: value}, null, true);
            this._tinyEditor.nodeChanged();
         },

         _focusOutHandler: function(){
            this.saveToHistory(this.getText());
            RichTextArea.superclass._focusOutHandler.apply(this, arguments);
         },

         _initInputHeight: function() {
            if (!this._options.autoHeight) {
               this._inputControl.css('height', this._container.height());
            }
         },
         //метод взят из link плагина тини
         _isOnlyTextSelected: function() {
            var
               html = this._tinyEditor.selection.getContent();
            if (/</.test(html) && (!/^<a [^>]+>[^<]+<\/a>$/.test(html) || html.indexOf('href=') == -1)) {
               return false;
            }
            return true;
         },
         _getTextBeforePaste: function(){
            //Проблема:
            //          после вставки текста могут возникать пробелы после <br> в начале строки
            //Решение:
            //          разбить метод _tinyEditor.plugins.paste.clipboard.pasteText:
            //             a)Подготовка текста
            //             b)Вставка текста
            //          использовать метод подготовки текста - _tinyEditor.plugins.paste.clipboard.prepareTextBeforePaste
            var
               text = this._tinyEditor.plugins.paste.clipboard.prepareTextBeforePaste(this._clipboardText);
            return text;
         }

      });

      return RichTextArea;
   });
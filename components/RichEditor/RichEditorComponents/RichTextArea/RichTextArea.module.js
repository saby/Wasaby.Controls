/**
 * Created by ps.borisov on 21.05.2016.
 */
define('js!SBIS3.CONTROLS.RichTextArea',
   [
   "Core/UserConfig",
   "Core/pathResolver",
   "Core/Context",
   "Core/Indicator",
   "Core/core-clone",
   "Core/CommandDispatcher",
   "Core/constants",
   "Core/Deferred",
   "js!SBIS3.CONTROLS.TextBoxBase",
   "tmpl!SBIS3.CONTROLS.RichTextArea",
   "js!SBIS3.CONTROLS.Utils.RichTextAreaUtil",
   "js!SBIS3.CONTROLS.RichTextArea/resources/smiles",
   'WS.Data/Di',
   "js!SBIS3.CONTROLS.Utils.ImageUtil",
   "Core/Sanitize",
   'Core/helpers/String/escapeTagsFromStr',
   'Core/helpers/String/escapeHtml',
   'Core/helpers/String/linkWrap',
   'js!SBIS3.CONTROLS.RichEditor.ImageOptionsPanel',
   'js!SBIS3.CONTROLS.RichEditor.CodeSampleDialog',
   'Core/EventBus',
   "css!SBIS3.CORE.RichContentStyles",
   "i18n!SBIS3.CONTROLS.RichEditor",
   'css!SBIS3.CONTROLS.RichTextArea'
], function (
      UserConfig,
      cPathResolver,
      cContext,
      cIndicator,
      coreClone,
      CommandDispatcher,
      cConstants,
      Deferred,
      TextBoxBase,
      dotTplFn,
      RichUtil,
      smiles,
      Di,
      ImageUtil,
      Sanitize,
      escapeTagsFromStr,
      escapeHtml,
      LinkWrap,
      ImageOptionsPanel,
      CodeSampleDialog,
      EventBus
   ) {
      'use strict';
      //TODO: ПЕРЕПИСАТЬ НА НОРМАЛЬНЫЙ КОД РАБОТУ С ИЗОБРАЖЕНИЯМИ
      var
         EDITOR_MODULES = ['css!SBIS3.CONTROLS.RichTextArea/resources/tinymce/skins/lightgray/skin.min',
            'css!SBIS3.CONTROLS.RichTextArea/resources/tinymce/skins/lightgray/content.inline.min',
            'js!SBIS3.CONTROLS.RichTextArea/resources/tinymce/tinymce'],
         constants = {
            baseAreaWidth: 768,//726
            defaultImagePercentSize: 25,// Начальный размер картинки (в процентах)
            defaultPreviewerSize: 768,//512
            //maximalPictureSize: 120,
            imageOffset: 40, //16 слева +  24 справа
            defaultYoutubeHeight: 300,
            minYoutubeHeight: 214,
            defaultYoutubeWidth: 430,
            minYoutubeWidth: 350,
            dataReviewPaddings: 8,
            styles: {
               title: {inline: 'span', classes: 'titleText'},
               subTitle: {inline: 'span', classes: 'subTitleText'},
               additionalText: {inline: 'span', classes: 'additionalText'}
            },
            colorsMap: {
               'rgb(0, 0, 0)': 'black',
               'rgb(255, 0, 0)': 'red',
               'rgb(0, 128, 0)': 'green',
               'rgb(0, 0, 255)': 'blue',
               'rgb(128, 0, 128)': 'purple',
               'rgb(128, 128, 128)': 'grey'
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
          * @author Спирин Виктор Алексеевич
          * @public
          * @control
          */
         RichTextArea = TextBoxBase.extend(/** @lends SBIS3.CONTROLS.RichTextArea.prototype */{
         _dotTplFn: dotTplFn,
         $protected : {
            _options : {
               /**
                * @cfg {Boolean} Поддержка смены шаблонов для изображений
                *     <option name="templates">true</option>
                * </pre>
                */
               templates: true,
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
                  className: null,
                  plugins: 'media,paste,lists,noneditable,codesample',
                  inline: true,
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
               imageFolder: 'images',
               /**
                * позволяет сохранять историю ввода
                * @cfg {boolean} Сохранять ли историю ввода
                */
               saveHistory: true,
                /**
                 * @cfg {function} функция проверки валидности класса
                 */
               validateClass: undefined
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
            _fromTouch: false,
            _codeSampleDialog: undefined,
            _beforeFocusOutRng: undefined,
            _images: {},
            _lastSavedText: undefined
         },

         _modifyOptions: function(options) {
            options = RichTextArea.superclass._modifyOptions.apply(this, arguments);
            options._prepareReviewContent = this._prepareReviewContent.bind({_options: options});
            options._prepareContent = this._prepareContent.bind(this);
            options._sanitizeClasses = this._sanitizeClasses.bind(this);
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
            this._options.editorConfig.fixed_toolbar_container = '#' + this.getId() + ' > .controls-RichEditor__fakeArea';
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
            this._needDebounceTextChanged().addCallback(function (need) {
               if (need) {
                  self._notifyTextChanged = self._notifyTextChanged.debounce(500);
               }
            });
            this._fillImages(false);
         },

         /**
          * Определить, нужно ли группировать события при изменении текста
          * @protected
          * @return {Core/Deferred}
          */
         _needDebounceTextChanged: function () {
            var b = cConstants.browser;
            if (b.isMobileAndroid) {
               return Deferred.success(true);
            }
            if (!b.isWin10 || typeof TouchEvent === 'undefined') {
               return Deferred.success(false);
            }
            /*if (b.isWPMobilePlatform) {
               return Deferred.success(true);
            }*/
            var o = window.screen.orientation || window.screen.mozOrientation || window.screen.msOrientation;
            if (!(o && o.type && o.lock && o.unlock)) {
               return Deferred.success(false);
            }
            var promise = new Deferred();
            o.lock(o.type).then(
               function () {
                  o.unlock();
                  promise.callback(true);
               },
               function (ex) {
                  var msg = ex.message.toLowerCase();
                  promise.callback(false/*msg.indexOf('is not available') === -1 && msg.indexOf('is not supported') === -1*/);
               }
            );
            return promise;
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

            if ((id = this._getYouTubeVideoId(escapeTagsFromStr(link, [])))) {
               var
                  protocol = /https?:/.test(link) ? link.replace(/.*(https?:).*/gi, '$1') : '';
               content = [
                  '<iframe',
                  ' width="' + constants.defaultYoutubeWidth + '"',
                  ' height="' + constants.defaultYoutubeHeight + '"',
                  ' style="min-width:' + constants.minYoutubeWidth + 'px; min-height:' + constants.minYoutubeHeight + 'px;"',
                  ' src="' + protocol + '//www.youtube.com/embed/' + id + '"',
                  ' allowfullscreen',
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
                  //вставка контента может быть инициирована любым контролом,
                  //необходимо нотифицировать о появлении клавиатуры в любом случае
                  if (cConstants.browser.isMobilePlatform) {
                     this._notifyMobileInputFocus();
                  }
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
                  }
                  else
                  if (cConstants.browser.isMobileIOS) {
                     this._scrollTo(this._inputControl[0], 'top');
                  }
                  if (cConstants.browser.isMobilePlatform) {
                     this._notifyMobileInputFocus();
                  }
                  RichTextArea.superclass.setActive.apply(this, args);
               }.bind(this));
            }
            else {
               if (!active) {
                  var editor = this._tinyEditor;
                  var manager = editor.editorManager;
                  // Если компонент должен стать неактивным - нужно сбросить фокусированный редактор (Аналогично обработчику 'focusout' в TinyMCE в строке 40891)
                  if (manager && manager.focusedEditor === editor) {
                     manager.focusedEditor = null;
                  }
               }
               if (cConstants.browser.isMobilePlatform) {
                  EventBus.globalChannel().notify('MobileInputFocusOut');
               }
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
         pasteFromBufferWithStyles: function(onAfterCloseHandler, target, saveStyles) {
            var
               save = typeof saveStyles === 'undefined' ? true : saveStyles,
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
                  self._updateTextByTiny();
               },
               onPaste = function(event) {
                  var content = event.clipboardData.getData ? event.clipboardData.getData('text/html') : '';
                  if (!content || !save) {
                     content = event.clipboardData.getData ? event.clipboardData.getData('text/plain') : window.clipboardData.getData('Text');
                     content.replace('data-ws-is-rich-text="true"', '');
                  }
                  prepareAndInsertContent(content);
                  dialog.close();
                  onClose();
                  event.stopPropagation();
                  event.preventDefault();
                  return false;
               },
               onClose = function () {
                  document.removeEventListener('paste', onPaste, true);
                  if (typeof onAfterCloseHandler === 'function') {
                     onAfterCloseHandler();
                  }
               },
               service = {
                  destroy: function(){}
               },
               createDialog = function() {
                  cIndicator.hide();
                  require(['js!SBIS3.CONTROLS.Utils.InformationPopupManager'], function (InformationPopupManager) {
                     document.addEventListener('paste', onPaste, true);
                     dialog = InformationPopupManager.showMessageDialog({
                           className: 'controls-RichEditor__pasteWithStyles-alert',
                           message: rk('Нажмите CTRL + V для вставки текста из буфера обмена с сохранением стилей'),
                           details: null,
                           submitButton: {caption:rk('Отменить')},
                           isModal: true,
                           closeByExternalClick: true,
                           opener: self
                        },
                        onClose
                     );
                  });
                  service.destroy();
               };

            cIndicator.show();
            if (Di.isRegistered('SBIS3.Plugin/Source/LocalService')) {
               //service создаётся каждый раз и destroy`тся каждый раз тк плагин может перезагрузиться и сервис протухнет
               //см прохождение по задаче:https://inside.tensor.ru/opendoc.html?guid=c3362ff8-4a31-4caf-a284-c0832c4ac4d5&des=
               service = Di.resolve('SBIS3.Plugin/Source/LocalService',{
                  endpoint: {
                     address: 'Clipboard-1.0.1.0',
                     contract: 'Clipboard'
                  },
                  options: { mode: 'silent' }
               });
               service.isReady().addCallback(function() {
                  service.call("getContentType", {}).addCallback(function (ContentType) {
                     service.call((ContentType === 'Text/Html' || ContentType === 'Text/Rtf' || ContentType === 'Html' || ContentType === 'Rtf') && save ? 'getHtml' : 'getText', {}).addCallback(function (content) {
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
            if (valParam && typeof valParam === 'string' && self._textChanged && self._options.saveHistory && this._lastSavedText !== valParam) {
               this._lastSavedText = valParam;
               this.getHistory().addCallback(function(arrBL){
                  arrBL.forEach(function (valBL) {
                     if (valParam === valBL) {
                        isDublicate = true;
                     }
                  });
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
               arrBL.forEach(function(text,index) {
                  arrBL[index] = this._replaceCodesToSmile(text);
               }, this);
               return arrBL;
            }.bind(this))
         },

         /**
          * Установить стиль для выделенного текста
          * @param {Object} style Объект, содержащий устанавливаемый стиль текста
          * @private
          */
         setFontStyle: function(style) {
            //TinyMCE использует для определения положения каретки(курсора ввода) <br data-mce-bogus="1">.
            //При смене формата содаётся новый <span class='classFormat'>.
            //В FF в некторых случаях символ каретки(курсора ввода) не удаляется из предыдущего <span> блока при смене формата
            //из за-чего происход разрыв строки.
            if (cConstants.browser.firefox &&  $(this._tinyEditor.selection.getNode()).find('br').attr('data-mce-bogus') == '1') {
               $(this._tinyEditor.selection.getNode()).find('br').remove();
            }
            //Удаление текущего форматирования под курсором перед установкой определенного стиля
            ['fontsize', 'forecolor', 'bold', 'italic', 'underline', 'strikethrough'].forEach(function(stl){
               this._removeFormat(stl);
            }, this);
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
            this._updateTextByTiny();
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
            this._updateTextByTiny();
         },
         /**
          * Установить размер для выделенного текста
          * @param {Object} size Объект, содержащий устанавливаемый размер текста
          * @private
          */
         setFontSize: function(size) {
            //необходимо удалять текущий формат(размер шрифта) чтобы правльно создавались span
            this._removeFormat('fontsize');
            if (size) {
               this._tinyEditor.execCommand('FontSize', false,  size + 'px');
            }
            this._tinyEditor.execCommand('');
            //при установке стиля(через форматтер) не стреляет change
            this._updateTextByTiny();
         },

         /**
          * Получить свойства форматирования текущего выделения
          * @return {object}
          */
         getCurrentFormats: function () {
            var editor = this._tinyEditor;
            if (editor) {
               var selNode = editor.selection.getNode();
               var $selNode = $(selNode);
               var color = editor.dom.getStyle(selNode, 'color', true);
               return {
                  fontsize: +editor.dom.getStyle(selNode, 'font-size', true).replace('px', ''),
                  color: constants.colorsMap[color] || color,
                  bold: !!$selNode.closest('strong').length,
                  italic: !!$selNode.closest('em').length,
                  underline: !!$selNode.closest('span[style*="decoration: underline"]').length,
                  strikethrough: !!$selNode.closest('span[style*="decoration: line-through"]').length
               };
            }
         },

         /**
          * Получить свойства форматирования по-умолчанию - определяется по свойствам форматирования контейнера редактора, (то, как видно в редакторе без форматирования)
          * @return {object}
          */
         getDefaultFormats: function () {
            if (!this._defaultFormats) {
               var $root = $(this._inputControl);
               var color = $root.css('color');
               this._defaultFormats = {
                  fontsize : +$root.css('font-size').replace('px', ''),
                  color: constants.colorsMap[color] || color
               };
            }
            return this._defaultFormats;
         },

         /**
          * Применить свойства форматирования к текущему выделению
          * @param {object} formats Свойства форматирования
          */
         applyFormats: function (formats) {
            // Отбросить все свойства форматирования, тождественные форматированию по-умолчанию
            var defaults = this.getDefaultFormats();
            for (var prop in defaults) {
               if (prop in formats && formats[prop] ==/* Не "==="! */ defaults[prop]) {
                  delete formats[prop];
               }
            }
            // Применить новое форматирование
            if (formats.id) {
               this.setFontStyle(formats.id);
            }
            else {
               for (var i = 0, names = ['title', 'subTitle', 'additionalText', 'forecolor']; i < names.length; i++) {
                  this._removeFormat(names[i]);
               }
               var previous = this.getCurrentFormats();
               var sameFont = formats.fontsize && formats.fontsize === previous.fontsize;
               //необходимо сначала ставить размер шрифта, тк это сбивает каретку
               if (!sameFont) {
                  this.setFontSize(formats.fontsize);
               }
               var hasOther;
               for (var i = 0, names = ['bold', 'italic', 'underline', 'strikethrough']; i < names.length; i++) {
                  var name = names[i];
                  if (name in formats && formats[name] !== previous[name]) {
                     this.execCommand(name);
                     hasOther = true;
                  }
               }
               if (formats.color && formats.color !== previous.color) {
                  this.setFontColor(formats.color);
                  hasOther = true;
               }
               if (sameFont && !hasOther) {
                  // Если указан тот же размер шрифта (и это не размер по умолчанию), и нет других изменений - нужно чтобы были правильно
                  // созданы окружающие span-ы (например https://online.sbis.ru/opendoc.html?guid=5f4b9308-ec3e-49b7-934c-d64deaf556dc)
                  // в настоящий момент работает и без этого кода, но если не будет работать, но нужно использовать modify, т.к. expand помечен deprecated.
                  //this._tinyEditor.selection.getSel().modify();//.getRng().expand()
                  this.setFontSize(formats.fontsize);
               }
            }
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
            //Если редактор не был активным контролом необходимо вначале проставить активность
            //поле связи если было активно при потере фокуса дестроит содержимое саггеста
            //если в нем был какой либо контрол, то он вызывает onBringToFront, который в свою очередь вернет фокус в поле связи
            //после чего смайл вставится в поле связи
            if (!this.isActive()) {
               this.setActive(true);
            }
            if (typeof smile === 'string') {
               smiles.forEach(function(obj) {
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
            //TODO: переписать этот метод на отдельный компонент
            var
               editor = this._tinyEditor,
               selection = editor.selection,
               range = coreClone(selection.getRng()),
               element = selection.getNode(),
               anchor = editor.dom.getParent(element, 'a[href]'),
               href = anchor ? editor.dom.getAttrib(anchor, 'href') : '',
               fre = this,
               context = cContext.createContext(this),
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
                           hrefLabel = $('<div class="controls-RichEditor__insertLinkHrefLabel">' + rk('Адрес') + '</div>'),
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
                        this._fieldHref.getContainer().on('keydown', function(e) {
                           if (e.which == cConstants.key.enter) {
                              e.preventDefault();
                              e.stopPropagation();
                              return false;
                           }
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
                           primary: true,
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
                                          href: escapeHtml(href)
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
                                       if (cConstants.browser.firefox) {
                                          // В firefox каретка(курсор ввода) остаётся (и просачивается) внутрь элемента A, нужно принудительно вывести её наружу, поэтому:
                                          var r = editor.selection.getRng();
                                          var a = r.endContainer;
                                          for (; a && a.nodeName !== 'A'; a = a.parentNode) {}
                                          if (a) {
                                             editor.selection.select(a);
                                             editor.selection.collapse(false);
                                             fre.insertHtml('&#65279;');
                                             editor.selection.setRng(r);
                                          }
                                       }
                                    }
                                    editor.undoManager.add();
                                 }
                                 self.close();
                              }
                           },
                           element: okButton
                        });

                     },
                     onAfterShow: function(){
                        if (cConstants.browser.isMobileIOS) {
                           //финт ушами, тк фокус с редактора убрать никак нельзя
                           //тк кнопки на которую нажали у нас в обработчике тоже нет
                           //ставим фокус на любой блок внутри нового диалогового окна, например на контейнер кнопки
                           this._fieldHref.getContainer().focus(); //убираем фокус с редактора
                           $('.controls-RichEditor__insertLinkButton').focus();//убираем клавиатуру
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
               //code from tinyMCE.init method
               try {
                  editor.lastRng = editor.selection.getRng();
               } catch (ex) {
                  // IE throws "Unexcpected call to method or property access" some times so lets ignore it
               }
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
            this._updateTextByTiny();
         },

         toggleContentSource: function(visible) {
            var
               sourceVisible = visible !== undefined ? !!visible : this._sourceContainer.hasClass('ws-hidden'),
               container = this._tinyEditor.getContainer() ? $(this._tinyEditor.getContainer()) : this._inputControl,
               focusContainer = sourceVisible ? this._sourceArea : container;
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
            //установка фокуса в поле ввода на которое происходит переключение
            focusContainer.focus();
         },

         insertImageTemplate: function(key, fileobj) {
            var className, before, after;
            //TODO: придумтаь как сделать без without-margin
            switch (key) {
               case '1':
                  className = 'image-template-left';
                  before = '<p class="without-margin">';
                  //необходимо вставлять пустой абзац с кареткой(курсором ввода), чтобы пользователь понимал куда будет производиться ввод
                  after = '</p><p>{$caret}</p>';
                  break;
               case '2':
                  before = '<p class="controls-RichEditor__noneditable image-template-center">';
                  after = '</p><p></p>';
                  break;
               case '3':
                  className = 'image-template-right';
                  before = '<p class="without-margin">';
                  //необходимо вставлять пустой абзац с кареткой(курсором ввода), чтобы пользователь понимал куда будет производиться ввод
                  after = '</p><p>{$caret}</p>';
                  break;
               case '6':
                  if (cConstants.browser.chrome || cConstants.browser.firefox) {
                     after = '&#xFEFF;{$caret}';
                  }
                  break;
               case '4':
                  //todo: сделать коллаж
               default:
                  // Неизвестный тип
                  return;
            }
            var size = constants.defaultImagePercentSize;
            this._makeImgPreviewerUrl(fileobj, size, null, false).addCallback(function (url) {
               var uuid = fileobj.id;
               if (uuid) {
                  this._images[uuid] = false;
               }
               this._insertImg(url, size + '%', null, className, null, before, after, uuid);
            }.bind(this));
         },
         codeSample: function(text, language) {
            if (this._beforeFocusOutRng) {
               this._tinyEditor.selection.setRng(this._beforeFocusOutRng);
            }
            var
               wasClear = !this._tinyEditor.plugins.codesample.getCurrentCode(this._tinyEditor);
            this._tinyEditor.plugins.codesample.insertCodeSample( this._tinyEditor, language, text);
            if (wasClear) {
               this._tinyEditor.selection.collapse();
               this.insertHtml('<p>{$caret}</p>')
            }
            this._beforeFocusOutRng = false;
         },
         getCodeSampleDialog: function(){
            var
               self = this;
            if (!this._codeSampleDialog) {
               this._codeSampleDialog = new CodeSampleDialog({
                  parent: this,
                  element: $('<div></div>')
               });
               this._codeSampleDialog.subscribe('onApply', function(event, text, language) {
                  self.codeSample(text, language);
               })
            }
            return this._codeSampleDialog;
         },
         showCodeSample: function() {
            var
               editor = this._tinyEditor,
               codeDialog = this.getCodeSampleDialog();
               this._beforeFocusOutRng = editor.selection.getRng(); // необходимо запоминать выделение пред открытием ддиалога, тк оно собьется при переходе в textarea
            codeDialog.setText(editor.plugins.codesample.getCurrentCode(editor) || '');
            codeDialog.show();
         },
         getImages: function() {
            return this._fillImages(true);
         },
         /*БЛОК ПУБЛИЧНЫХ МЕТОДОВ*/

         /*БЛОК ПРИВАТНЫХ МЕТОДОВ*/
         _updateTextByTiny: function () {
            this._setTrimmedText(this._getTinyEditorValue());
         },

         _setTrimmedText: function(text) {
            this._setText(this._trimText(text));
         },

         _setText: function(text) {
            if (text !== this.getText()) {
               if (!this._isEmptyValue(text)) {
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
               scrollTop = this._inputControl.scrollTop(),
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
                           var promise = self._changeImgSize($image, this.getChildControlByName('imageWidth').getValue(), this.getChildControlByName('imageHeight').getValue(), this.getChildControlByName('valueType').getValue() !== 'per');
                           if (scrollTop) {
                              promise.addCallback(function () {
                                 setTimeout(function () {
                                    self._inputControl.scrollTop(scrollTop)
                                 }, 1);
                              });
                           }
                           editor.undoManager.add();
                        }.bind(this));
                     }
                  }
               });
            });
         },

         _changeImgSize: function ($img, width, height, isPixels) {
            var size = {width:'', height:''};
            var css = [];
            if (0 < width) {
               size.width = width + (isPixels ? 'px' : '%');
               css.push('width:' + size.width);
            }
            //не проставляем высоту если процентые размеры
            if (0 < height && isPixels) {
               size.height = height + 'px';
               css.push('height:' + size.height);
            }
            $img.css(size);
            $img.attr('data-mce-style', css.join('; '));
            var prevSrc = $img.attr('src');
            var promise = this._makeImgPreviewerUrl($img, 0 < width ? width : null, 0 < height ? height : null, isPixels);
            return promise.addCallback(function (url) {
               if (prevSrc !== url) {
                  $img.attr('src', url);
                  $img.attr('data-mce-src', url);
               }
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
                              callback(e, target);
                           }
                        }
                     });
                  };
               //По двойному клику на изображение показывать диалог редактирования размеров
               bindImageEvent('dblclick', function(event, target) {
                  self._showImagePropertiesDialog(target);
               });
               //По нажатию на изображения показывать панель редактирования самого изображения
               bindImageEvent('mouseup touchstart', function(event, target) {
                  self._showImageOptionsPanel($(target));
               });

               //Проблема:
               //    При клике на изображение в ie появляются квадраты ресайза
               //Решение:
               //    отменять дефолтное действие
               if(cConstants.browser.isIE) {
                  bindImageEvent('mousedown', function(event) {
                     event.preventDefault();
                  });
               }

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
               // в tinyMCE предустановлены сочетания клавиш на alt+shift+number
               // данные сочетания ставят формат выделенному тексту (h1 - h6, p , div, address)
               // необходимо отключать эти сочетания, чтобы нельзя было как либо создать такие форматы
               for (var i = 1; i <= 9; i++) {
                  editor.shortcuts.remove('access+' + i);
               }
               this._inputControl = $(editor.getBody());
               RichUtil.markRichContentOnCopy(this._inputControl);
               self._tinyReady.callback();
               /*НОТИФИКАЦИЯ О ТОМ ЧТО В РЕДАКТОРЕ ПОМЕНЯЛСЯ ФОРМАТ ПОД КУРСОРОМ*/
               //formatter есть только после инита поэтому подписка осуществляется здесь
               editor.formatter.formatChanged('bold,italic,underline,strikethrough,alignleft,aligncenter,alignright,alignjustify,title,subTitle,additionalText,blockquote', function(state, obj) {
                  self._notify('onFormatChange', obj, state)
               });
               self._notify('onInitEditor');
            }.bind(this));

            //БИНДЫ НА ВСТАВКУ КОНТЕНТА И ДРОП
            editor.on('onBeforePaste', function(e) {
               if (self.addYouTubeVideo(e.content)) {
                  return false;
               }
            });

            editor.on('Paste', function(e) {
               self._clipboardText = e.clipboardData ?
                  e.clipboardData.getData(cConstants.browser.isMobileIOS ? 'text/plain' : 'text') :
                  window.clipboardData.getData('text');
               editor.plugins.paste.clipboard.pasteFormat = 'html';
            });

            //Обработка вставки контента
            editor.on('BeforePastePreProcess', function(e) {
               var isRichContent = e.content.indexOf('data-ws-is-rich-text="true"') !== -1;
               e.content = e.content.replace('data-ws-is-rich-text="true"', '');
               //Необходимо заменять декорированные ссылки обратно на url
               //TODO: временное решение для 230. удалить в 240 когда сделают ошибку https://inside.tensor.ru/opendoc.html?guid=dbaac53f-1608-42fa-9714-d8c3a1959f17
               e.content = self._prepareContent(e.content);
               //Парсер TinyMCE неправльно распознаёт стили из за - &quot;TensorFont Regular&quot;
               e.content = e.content.replace(/&quot;TensorFont Regular&quot;/gi,'\'TensorFont Regular\'');
               //_mouseIsPressed - флаг того что мышь была зажата в редакторе и не отпускалась
               //равносильно тому что d&d совершается внутри редактора => не надо обрезать изображение
               //upd: в костроме форматная вставка, не нужно вырезать лишние теги
               if (!self._mouseIsPressed && self._options.editorConfig.paste_as_text) {
                  e.content = self._options._sanitizeClasses(e.content, false);
               }
               self._mouseIsPressed = false;
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
                  content = event.node,
                  $content = $(content),
                  $images = $content.find('img:not(.ws-fre__smile)');
               $content.find('[unselectable ="on"]').attr('data-mce-resize', 'false');
               if ($images.length) {
                  if (/data:image/gi.test(content.innerHTML)) {
                     return false;
                  }
                  var
                     maximalWidth,
                     width,
                     currentWidth,
                     naturalSizes;
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
               var html = content.innerHTML;
               //Замена переносов строк на <br>
               html = html.replace(/([^>])\n(?!<)/gi, '$1<br />');
               // Замена отступов после переноса строки и в первой строке
               // пробелы заменяются с чередованием '&nbsp;' + ' '
               html = this._replaceWhitespaces(html);
               // И теперь (только один раз) вставим в DOM
               content.innerHTML = html;
            }.bind(this));

            if (this._options.editorConfig.browser_spellcheck && (cConstants.browser.chrome || cConstants.browser.safari)) {
               // Если включена проверка правописания, нужно при исправлениях обновлять принудительно text
               var _onSelectionChange1 = function (evt) {
                  if (evt.target === document) {
                     editor.off('SelectionChange', _onSelectionChange1);
                     if (editor.selection.getContent()) {
                        editor.once('SelectionChange', _onSelectionChange2);
                        // Хотя цепляемся на один раз, но всё же отцепим через пару минут, если ничего не случится за это время
                        setTimeout(editor.off.bind(editor, 'SelectionChange', _onSelectionChange2), 120000);
                     }
                  }
               }.bind(this);

               var _onSelectionChange2 = function (evt) {
                  if (evt.target === document) {
                     this._updateTextByTiny();
                  }
               }.bind(this);

               editor.on('contextmenu', function (evt) {
                  if (evt.currentTarget === this._inputControl[0] && (evt.target === evt.currentTarget || $.contains(event.currentTarget, evt.target))) {
                     editor.off('SelectionChange', _onSelectionChange2);
                     if (cConstants.browser.safari) {
                        // Для safari обязательно нужно отложить подписку на событие (потому что safari в тот момент, когда делается эта подписка
                        // меняет выделение, и потом меняет его в момент вставки. Чтобы первое не ловить - отложить)
                        setTimeout(editor.on.bind(editor, 'SelectionChange', _onSelectionChange1), 1);
                     }
                     else {
                        editor.on('SelectionChange', _onSelectionChange1);
                     }
                  }
               }.bind(this));
            }

            editor.on('drop', function(event) {
               //при дропе тоже заходит в BeforePastePreProcess надо обнулять _clipboardTex
               self._clipboardText = false;
               if (!self._mouseIsPressed && !cConstants.browser.isIE && (!event.targetClone || !$(event.targetClone).hasClass('controls-RichEditor__noneditable')))  {
                  event.preventDefault();
               }
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
                  self._updateTextByTiny();
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
                  self._updateTextByTiny();
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
               } else if (e.ctrlKey || (e.which >= cConstants.key.f1 && e.which <= cConstants.key.f12 ) ) {
                  //сбрасываем флаг при любом горячем сочетании
                  if (e.which === cConstants.key.enter) {
                     e.preventDefault();//по ctrl+enter отменяем дефолтное(чтобы не было перевода строки лишнего), разрешаем всплытие
                     //по ctrl+enter может произойти перехват события( например главная кнопка) и keyup может не сработать
                     //необходимо сбрасывать флаг зажатой кнопки, чтобы шло обновление опции text (сейчас обновление опции text не идёт при зажатаой клавише, чтобы не тормозило)
                  }
                  self._typeInProcess = false;
               }
               self._updateHeight();
            });

            // Если редактируется ссылка, у которой текст точно соответсвовал урлу, то при редактировании текста должен изменяться и её урл.
            // Особенно актуально, когда на тулбаре кнопки редактирования ссылки нет
            var _linkEditStart = function () {
               var a = editor.selection.getNode();
               if (a.nodeName === 'A' && a.hasChildNodes() && !a.children.length) {
                  var url = a.href;
                  var text = a.innerHTML;
                  var isCoupled = text === url;
                  var prefix, suffix;
                  if (!isCoupled) {
                     prefix = url.substring(0, url.indexOf('://') + 3);
                     text = prefix + text;
                     isCoupled = url === text;
                     if (!isCoupled) {
                        suffix = '/';
                        isCoupled =  url === text + suffix;
                     }
                  }
                  if (isCoupled) {
                     if (!a.dataset) {
                        // В MSIE нет свойства dataset, но достаточно просто довить его
                        a.dataset = {};
                     }
                     a.dataset.wsPrev = JSON.stringify({url:url, prefix:prefix || '', suffix:suffix || ''});
                  }
               }
            };

            var _linkEditEnd = function () {
               var a = editor.selection.getNode();
               if (a.nodeName === 'A' && a.dataset && 'wsPrev' in a.dataset) {
                  if (a.hasChildNodes() && !a.children.length) {
                     var prev = JSON.parse(a.dataset.wsPrev);
                     var url = a.href;
                     var text = a.innerHTML;
                     if (prev.url === url) {
                        url = prev.prefix + text + prev.suffix;
                        a.href = url;
                        // Опять же - в MSIE нет свойства dataset, поэтому по-старинке
                        a.setAttribute('data-mce-href', url);
                     }
                  }
                  delete a.dataset.wsPrev;
               }
            };

            // Обработка изменения содержимого редактора.
            editor.on('keydown', function(e) {
               if (e.key && 1 < e.key.length) {
                  _linkEditStart();
                  setTimeout(function() {
                     //Возможно, мы уже закрыты
                     if(!self.isDestroyed()){
                        _linkEditEnd();
                     }
                  }, 1);
               }
            });

            // Обработка изменения содержимого редактора.
            // Событие keypress возникает сразу после keydown, если нажата символьная клавиша, т.е. нажатие приводит к появлению символа.
            // Любые буквы, цифры генерируют keypress. Управляющие клавиши, такие как Ctrl, Shift, F1, F2.. — keypress не генерируют.
            editor.on('keypress', function(e) {
               _linkEditStart();
               // <проблема>
               //    Если в редакторе написать более одного абзаца, выделить, и нажать любую символьную клавишу,
               //    то, он оставит сверху один пустой абзац, который не удалить через визуальный режим, и будет писать в новом
               // </проблема>
               if (!e.ctrlKey && !(e.metaKey && cConstants.browser.isMacOSDesktop) && e.charCode !== 0) {
                  if (!editor.selection.isCollapsed()) {
                     if (editor.selection.getContent() == self._getTinyEditorValue()) {
                        editor.bodyElement.innerHTML = '';
                     }
                  }
               }
               setTimeout(function() {
                  if(!self.isDestroyed()){
                     _linkEditEnd();
                  }
                  self._togglePlaceholder(self._getTinyEditorValue());
               }, 1);
            });
            editor.on('change', function(e) {
               self._updateTextByTiny();
            });
            editor.on('cut',function(e){
               setTimeout(function() {
                  self._updateTextByTiny();
               }, 1);
            });
            //Сообщаем компоненту об изменении размеров редактора
            editor.on('resizeEditor', function() {
               self._notifyOnSizeChanged();
            });

            //реагируем на то что редактор изменился при undo/redo
            editor.on('undo', function() {
               self._updateTextByTiny();
            });

            editor.on('redo', function() {
               self._updateTextByTiny();
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
                  self._notifyMobileInputFocus();
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

         _notifyMobileInputFocus: function () {
            EventBus.globalChannel().notify('MobileInputFocus');
         },

         _showImageOptionsPanel: function(target) {
            var
               imageOptionsPanel = this._getImageOptionsPanel(target);
            imageOptionsPanel.show();
         },

         _changeImageTemplate: function(target, template) {
            var
               parent = target.parent();
            parent.removeClass();
            parent.removeAttr ('contenteditable');
            target.removeClass();

            switch (template) {
               case "1":
                  target.addClass('image-template-left');
                  parent.addClass('without-margin');
                  break;
               case "2":
                  var
                     //todo: go to tmpl
                     width = target[0].style.width || (target.width() + 'px'),
                     imageParagraph = '<p class="controls-RichEditor__noneditable image-template-center" contenteditable="false">' + //tinyMCE не проставляет contenteditable если изменение происходит  через dom.replace
                        '<img' +
                        ' src="' + target.attr('src') + '"' +
                        ' style="width:' + (width ? width : constants.defaultImagePercentSize + '%') + '"' +
                        ' alt="' + target.attr('alt') + '"' +
                        '></img>' +
                     '</p>';
                  this._tinyEditor.dom.replace($(imageParagraph)[0],target[0],false);
                  break;
               case "3":
                  target.addClass('image-template-right');
                  parent.addClass('without-margin');
                  break;
            };
            this._updateTextByTiny();
         },

         _getImageOptionsPanel: function(target){
            var
               self = this,
               uuid = this.checkImageUuid(target[0]);
            if (!this._imageOptionsPanel) {
               this._imageOptionsPanel = new ImageOptionsPanel({
                  templates: self._options.templates,
                  parent: self,
                  target: target,
                  imageUuid: uuid,
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
                  var $img = this.getTarget();
                  var width = $img[0].style.width || ($img.width() + 'px');
                  var isPixels = width.charAt(width.length - 1) !== '%';
                  self._makeImgPreviewerUrl(fileobj, +width.substring(0, width.length - (isPixels ? 2 : 1)), null, isPixels).addCallback(function (url) {
                     $img.attr('src', url);
                     $img.attr('data-mce-src', url);
                     var uuid = fileobj.id;
                     // TODO: 20170913 Также убрать атрибуты с uuid, как и в методе _insertImg
                     $img.attr('data-img-uuid', uuid);
                     $img.attr('alt', uuid);
                     self._tinyEditor.undoManager.add();
                     self._updateTextByTiny();
                     if (uuid) {
                        self._images[uuid] = false;
                     }
                  });
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
                  //          После удаления изображения ставить каретку(курсор ввода) в конец родительского для изображения блока
                  self._tinyEditor.selection.select(nodeForSelect, false);
                  self._tinyEditor.selection.collapse();
                  self._tinyEditor.undoManager.add();
                  self._updateTextByTiny();
               });
               this._imageOptionsPanel.subscribe('onTemplateChange', function(event, template){
                  self._changeImageTemplate(this.getTarget(), template);
               });
               this._imageOptionsPanel.subscribe('onImageSizeChange', function(){
                  self._showImagePropertiesDialog(this.getTarget());
               });
            } else {
               this._imageOptionsPanel.setTarget(target);
               this._imageOptionsPanel.setImageUuid(uuid);
            }
            return this._imageOptionsPanel;
         },

         /**
          * Получить идентификатор изображения
          * @public
          * @param {Element} img Элемент IMG
          * @return {string}
          */
         checkImageUuid: function (img) {
            // html, содержащий в себе изображения, может попасть в редактор откуда угодно (старые или проблемные документы и т.д.), нет строгой
            // гарантии, что в атрибуте alt содержится именно uuid изображения, так что пробуем извлечь его откуда найдётся (и поправить если придётся)
            var REs = [
               /(?:\?|&)id=([0-9a-f]{8}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{12})(?:&|$)/i,
               /\/disk\/api\/v[0-9\.]+\/([0-9a-f]{8}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{12})(?:_|$)/i
            ];
            var url = img.src;
            for (var i = 0; i < REs.length; i++) {
               var ms = url.match(REs[i]);
               if (ms) {
                  return ms[1];
               }
            }
         },

         /**
          * Создать урл изображения через previewer-сервис с необходимым масштабированием
          * @protected
          * @param {jQuery|object} imgInfo Источник информации об изображении
          * @param {number} width Визуальная ширина изображения
          * @param {number} height Визуальная высота изображения
          * @param {boolean} isPixels Размеры указаны в пикселах (иначе в процентах)
          * @return {Core/Deferred}
          */
         _makeImgPreviewerUrl: function (imgInfo, width, height, isPixels) {
            if (!(0 < width)) {
               throw new Error('Size is not specified');
            }
            var promise = new Deferred();
            var url;
            // Либо это jQuery-оболочка над IMG
            if (imgInfo.jquery) {
               url = imgInfo.attr('src');
               if (!/\/disk\/api\/v[0-9\.]+\//i.test(url)) {
                  // Это не файл, хранящийся на СбисДиск, вернуть как есть
                  promise.callback(url);
                  return promise;
               }
               url = url.replace(/^\/previewer(?:\/r\/[0-9]+\/[0-9]+)?/i, '');
            }
            // Либо это fileobj из события загрузки файла
            else {
               url = (imgInfo.filePath || imgInfo.url);
            }
            promise = promise.addCallback(function (size) {
               return '/previewer' + (size ?  '/r/' + size + '/' + size : '') + url;
            });
            if (0 < width) {
               var w = isPixels ? width : width*constants.baseAreaWidth/100;//this.getContainer().width()
               if (0 < height) {
                  promise.callback(Math.round(width < height ? w*height/width : w));
               }
               else
               if (!imgInfo.jquery && 0 < imgInfo.width && 0 < imgInfo.height) {
                  promise.callback(Math.round(imgInfo.width < imgInfo.height ? w*imgInfo.height/imgInfo.width : w));
               }
               else {
                  var img = new Image();
                  img.onload = function () {
                     promise.callback(Math.round(img.width < img.height ? w*img.height/img.width : w));
                  };
                  img.onerror = function () {
                     promise.callback(constants.defaultPreviewerSize);
                  };
                  img.src = url;
               }
            }
            else {
               promise.callback(constants.defaultPreviewerSize);
            }
            return promise;
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

         _requireTinyMCE: function() {
            var
               notDefined = false,
               result = new Deferred();
            // Реквайрим модули только если они не были загружены ранее, т.к. require отрабатывает асинхронно и на ipad это
            // недопустимо (клавиатуру можно показывать синхронно), да и в целом можно считать это оптимизацией.
            EDITOR_MODULES.forEach(function(module) {
               if (!require.defined(module)) {
                  notDefined = true;
               }
            });
            if (notDefined) {
               require(EDITOR_MODULES, function() {
                  result.callback();
               });
            } else {
               result.callback();
            }
            return result;
         },

         _initTiny: function() {
            var
               self = this;
            if (!this._tinyEditor && !this._tinyIsInit) {
               this._tinyIsInit = true;
               this._requireTinyMCE().addCallback(function() {
                  tinyMCE.baseURL = cPathResolver.resolveComponentPath('SBIS3.CONTROLS.RichTextArea') + 'resources/tinymce';
                  tinyMCE.init(self._options.editorConfig);
               });
            }
            this._tinyReady.addCallback(function () {
               // Если начальный контент пуст, то за счёт неправильного положения каретки(курсора ввода) в MSIE при начале ввода в конце добавится
               // лишний параграф. Чтобы этого избежать - добавим символ "не символ"
               this._tinyEditor.setContent(this._prepareContent(this.getText()) || (cConstants.browser.isIE ? '&#65279;' : ''));
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
               beginReg = new RegExp('^<p> *(&nbsp; *)*(&nbsp;)?</p>'),// регулярка начала строки
               endReg = new RegExp('<p> *(&nbsp; *)*(&nbsp;)?</p>$'),// регулярка конца строки
               regShiftLine1 = new RegExp('<p>(<br( ?/)?>)+(&nbsp;)?'),// регулярка пустой строки через shift+ enter и space
               regShiftLine2 = new RegExp('(&nbsp;)?(<br( ?/)?>)+</p>'),// регулярка пустой строки через space и shift+ enter
               regResult;
            text = this._removeEmptyTags(text);
            while (regShiftLine1.test(text)) {
               text = text.replace(regShiftLine1, '<p>');
            }
            while (regShiftLine2.test(text)) {
               text = text.replace(regShiftLine2, '</p>');
            }
            while ((regResult = beginReg.exec(text)) !== null) {
               text = text.substr(regResult[0].length + 1);
            }
            while ((regResult = endReg.exec(text)) !== null) {
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
            this.getContainer().toggleClass('controls-RichEditor__empty', (curValue === '' || curValue === undefined || curValue === null) &&
               this._inputControl.html().indexOf('</li>') < 0 &&
               this._inputControl.html().indexOf('<p>&nbsp;') < 0 &&
               this._inputControl.html().indexOf('<p><br>&nbsp;') < 0 &&
               this._inputControl.html().indexOf('<blockquote>') < 0
            );
         },

         _replaceSmilesToCode: function(text) {
            smiles.forEach(function(smile){
               text = text.replace(new RegExp(String.fromCodePoint(smile.code), 'gi'), smile.title);
            });
            return text;
         },

         _replaceCodesToSmile: function(text) {
            smiles.forEach(function(smile) {
               text = text.replace(new RegExp(smile.title, 'gi'), String.fromCodePoint(smile.code));
            });
            return text;
         },

         _addToHistory: function(text) {
            return UserConfig.setParamValue(this._getNameForHistory(), this._replaceSmilesToCode(text));
         },

         _getNameForHistory: function() {
            return this.getName().replace('/', '#') + 'ИсторияИзменений';
         },

         _insertImg: function (src, width, height, className, alt, before, after, uuid) {
            var
               def = new Deferred(),
               self = this,
               //^^^ Почему так сложно???
               $img = $('<img src="' + src + '"></img>').css({
                  visibility: 'hidden',
                  position: 'absolute',
                  bottom: 0,
                  left: 0
               });
            $img.on('load', function () {
               // TODO: 20170913 Здесь в атрибуты, сохранность которых не гарантируется ввиду свободного редактирования пользователями, помещается значение uuid - Для обратной совместимости
               // После задач https://online.sbis.ru/opendoc.html?guid=6bb150eb-4973-4770-b7da-865789355916 и https://online.sbis.ru/opendoc.html?guid=a56c487d-6e1d-47bc-bdf6-06a0cd7aa57a
               // Убрать по мере переделки стороннего кода, используещего эти атрибуты.
               // Для пролучения uuid правильно использовать метод getImageUuid
               self.insertHtml(
                  (before || '') + '<img' +
                  (className ? ' class="' + className + '"' : '') +
                  ' src="' + src + '"' +
                  (width || height ? ' style="' + (width ? 'width:' + width + ';' : '') + (height ? 'height:' + height + ';' : '') + '"' : '') +
                  /*(alt ? ' alt="' + alt.replace('"', '&quot;') + '"' : '') +*/
                  ' data-img-uuid="' + uuid + '" alt="' + uuid + '"' +
                  '></img>' + (after || '')
               );
               def.callback();
            });
            return def;
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
               curHeight;
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
            if (this._dataReview && !this.isEnabled() && (this._lastReview ==/*Не ===*/ null || this._lastReview !== text)) {
               // _lastReview Можно устанавливать только здесь, когда он реально помещается в DOM, (а не в конструкторе, не в init и не в onInit)
               // иначе проверку строкой выше не пройти. (И устанавливаем всегда строкой, даже если пришли null или undefined)
               this._lastReview = text || '';
               this._dataReview.html(this._prepareReviewContent(text));
            }
         },

         _prepareReviewContent: function(text) {
            if (text && text[0] !== '<') {
               text = '<p>' + text.replace(/\n/gi, '<br/>') + '</p>';
            }
            text = this._options._sanitizeClasses(text, true);
            return this._options.highlightLinks ? LinkWrap.wrapURLs(LinkWrap.wrapFiles(text), true) : text;
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
                     this._inputControl.html(this._options._sanitizeClasses(text, true));
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
            var html = this._tinyEditor.selection.getContent();
            return html.indexOf('<') === -1 || (html.indexOf('href=') !== -1 && /^<a [^>]+>[^<]+<\/a>$/.test(html));
            /*if (/</.test(html) && (!/^<a [^>]+>[^<]+<\/a>$/.test(html) || html.indexOf('href=') == -1)) {
               return false;
            }
            return true;*/
         },
         _sanitizeClasses: function(text, images) {
            var
                self = this;
            return Sanitize(text,
               {
                  validNodes: {
                     img: images
                  },
                  validAttributes: {
                     'class' : function(content, attributeName) {
                        var
                           //проверка this._options для юнит тестов, тк там метод зовётся на прототипе
                           validateIsFunction = this._options && typeof this._options.validateClass === 'function',
                           currentValue = content.attributes[attributeName].value,
                           classes = currentValue.split(' '),
                           whiteList =  [
                              'titleText',
                              'subTitleText',
                              'additionalText',
                              'controls-RichEditor__noneditable',
                              'without-margin',
                              'image-template-left',
                              'image-template-center',
                              'image-template-right',
                              'mce-object-iframe',
                              'ws-hidden',
                              'language-javascript',
                              'language-css',
                              'language-markup',
                              'language-php',
                              'token',
                              'comment',
                              'prolog',
                              'doctype',
                              'cdata',
                              'punctuation',
                              'namespace',
                              'property',
                              'tag',
                              'boolean',
                              'number',
                              'constant',
                              'symbol',
                              'deleted',
                              'selector',
                              'attr-name',
                              'string',
                              'char',
                              'builtin',
                              'inserted',
                              'operator',
                              'entity',
                              'url',
                              'style',
                              'attr-value',
                              'keyword',
                              'function',
                              'regex',
                              'important',
                              'variable',
                              'bold',
                              'italic',
                              'LinkDecorator__link',
                              'LinkDecorator',
                              'LinkDecorator__simpleLink',
                              'LinkDecorator__linkWrap',
                              'LinkDecorator__decoratedLink',
                              'LinkDecorator__wrap',
                              'LinkDecorator__image'
                           ],
                           index = classes.length - 1;

                        while (index >= 0) {
                           if (!~whiteList.indexOf(classes[index]) && (!validateIsFunction || !this._options.validateClass(classes[index]))) {
                              classes.splice(index, 1);
                           }
                           index -= 1;
                        }
                        currentValue = classes.join(' ');
                        if (currentValue) {
                           content.attributes[attributeName].value = currentValue;
                        } else {
                           delete content.attributes[attributeName];
                        }

                     }.bind(self)
                  },
                  checkDataAttribute: false,
                  escapeInvalidTags: false
               });
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
         },
         _fillImages: function(state) {
            var
               temp = $('<div>' + this.getText() + '</div>');
            temp.find('img').toArray().forEach(function(image){
               var
                  uuid = this.checkImageUuid(image);
               if (uuid) {
                  this._images[uuid] = state;
               }
            }, this);
            return this._images;
         }

      });

      RichTextArea.EDITOR_MODULES = EDITOR_MODULES;

      return RichTextArea;
   });
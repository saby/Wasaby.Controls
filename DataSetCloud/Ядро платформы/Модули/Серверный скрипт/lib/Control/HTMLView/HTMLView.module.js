/**
 * Модуль "Компонент подсказка. По show показывает подсказку, по hide - скрывает".
 *
 * @description
 */
define('js!SBIS3.CORE.HTMLView', ['js!SBIS3.CORE.TemplatedAreaAbstract', 'js!SBIS3.CORE.LoadingIndicator', 'css!SBIS3.CORE.HTMLView'], function(TemplatedAreaAbstract, LoadingIndicator) {

   'use strict';

   function imageLoaded(img) {
      //проверяем complete и при наличии naturalWidth ещё и его (это для хак для вебкита)
      return (img.complete && ((typeof img.naturalWidth === 'undefined') || img.naturalWidth > 0));
   }

   /**
    * Класс, используемый для просмотра HTML с возможностью последующей печати содержимого (<br>print()</b>).
    * Размещает содержимое внутри iframe. Соответственно, внутри него невидны ни стили, ни скрипты с основного окна.
    * Для подключения стилей используйте метод <b>addStyle</b>.
    *
    * @class $ws.proto.HTMLView
    * @extends $ws.proto.TemplatedAreaAbstract
    * @cfgOld {String} docType тип документа
    *    - string       использует в качестве источника для данных content
    *    - url          использует в качестве источника для данных url
    *    - template     использует в качестве источника для данных template
    * @cfgOld {String}  string   используется при docType == 'string'
    * @cfgOld {String}  url      используется при docType == 'url'
    * @cfgOld {String}  template используется при docType == 'template'
    * @control
    * @category Decorate
    * @initial
    * <component data-component='SBIS3.CORE.HTMLView' style='width: 400px; height: 300px'>
    *    <option name='docType'>url</option>
    *    <option name='url' value='/'></option>
    * </component>
    */
   $ws.proto.HTMLView = TemplatedAreaAbstract.extend(/** @lends $ws.proto.HTMLView.prototype */{
      /**
       * @event onContentSet событие при установке контента (в конструкторе тоже происходит)
       * @param {Object} eventObject описание в классе $ws.proto.Abstract
       * @param {String} str тип контента, аналогично docType
       * @param {String} html контент Html код
       */
      /**
       * @event onBeforePrint событие перед началом печати
       * @param {Object} eventObject описание в классе $ws.proto.Abstract
       * @param {Object} iframe element, который печатается
       */
      $protected: {
         _width: '',
         _height: '',
         _options: {
            docType: 'string',
            url: '',
            string: '',
            hidden: false
         },
         _iframeReady: undefined,      //Деферред готовности iFrame'а
         _dReady: undefined,           //Деферред готовности контрола
         _iframe: undefined,           //Элемент-iframe
         _iframeContainer: undefined,  //Элемент, содержащий в себе iframe
         _loaded: true,                //Загружен ли элемент
         _iframeId: ''
      },
      $constructor: function(){
         this._publish('onContentSet', 'onContentReady', 'onBeforePrint');
         this.getContainer().addClass('ws-HTMLView');
         this._redraw();
      },

      _removeLoadingIndicator: function() {
         var indicator = this._getIndicator();
         if (indicator) {
            indicator.destroy();
         }
      },

      _createLoadingIndicator: function() {
         new LoadingIndicator({
            showInWindow: false,
            element: $('<div />', {
               'class': 'ws-HTMLView__loadingIndicator'
            }).appendTo(this._container)
         });
      },

      _redraw: function() {
         var self = this;
         this._dReady = new $ws.proto.Deferred();
         this._iframeReady = new $ws.proto.Deferred();

         if (this._options.maxWidth === undefined) {
            this._options.maxWidth = Infinity;
         }

         if (this._options.maxHeight === undefined) {
            this._options.maxHeight = Infinity;
         }

         switch(this._options.docType){
            case 'string':
               if (this._options.string) {
                  this.setHTML(this._options.string);
               } else {
                  this._dReady.callback();
               }
               break;

            case 'url':
               if (this._options.url) {
                  this.setUrl(this._options.url);
               } else {
                  this._dReady.callback();
               }
               break;

            case 'template':
               this.setTemplate(this._options.template);
               break;

            default:
               throw new Error('HTMLView does not support this docType');
         }
         this._dReady.addCallback(function() {
            self._dChildReady.done();
            self._isReady = true;
         });
      },

      _getIndicator: function() {
         return this.getContainer().find('.ws-HTMLView__loadingIndicator').wsControl();
      },

      /**
      * Находит все изображения и дожидается их загрузки, запускает пересчёт авторазмеров
      * @private
      */
      _waitResources: function() {

         var document = this.getIframeDocument(),
             parallelDeferred = new $ws.proto.ParallelDeferred(),
             iframeBody, images, haveLinks, styles, earlyResult

         if (document) {
            iframeBody = document.body;
            images = $('img', iframeBody),
            // В тэгах style могут быть @import
            styles = $('link, style', document);

            if (images.length) {
               images.each(function() {
                  var deferred;
                  if (!imageLoaded(this)) {
                     deferred = new $ws.proto.Deferred();
                     parallelDeferred.push(deferred);
                     $(this).bind('load', deferred.callback.bind(deferred)).bind('error', deferred.errback.bind(deferred));
                  }
               });
            }

            //Файлы с css-стилями могут быть ещё не загружены, так что надо их подождать
            if (styles.length) {
               parallelDeferred.push($ws.proto.Deferred.fromTimer(500));
            }
         }

         earlyResult = $ws.proto.Deferred.nearestOf([
            parallelDeferred.done().getResult().addBoth(function(){
               if (earlyResult && earlyResult.isReady()) {
                  this.setAutoSize();
               }
            }.bind(this)),
            $ws.proto.Deferred.fromTimer(5000)
         ]).addBoth(function(){
            this._notify('onContentReady');
            this.showIframeContainer();
            this._removeLoadingIndicator();
            this.setAutoSize();
         }.bind(this));

      },

      _contentLoaded: function() {
         if(!this._dReady.isReady()){
            this._dReady.callback();
         }

         $ws.helpers.dispatchIframeWheelEventsToParentDocument(this._iframe);
         //Дожидаемся загрузки всех картинок и css-файлов
         this._waitResources();
      },

      _getIframeBodySize:function(iframeElem, autoWidth, autoHeight){
         var
            body = $('body', iframeElem.contents()),
            html = $('html', iframeElem.contents()),
            height, width;

         if (body.size() > 0 && (autoWidth || autoHeight)) {
            //делаю сброс размеров ифрейма на расчёте - иначе body.prop('scrollWidth/Height') не может быть меньше размеров ифрейма,
            //даже если body пустое
            if(autoWidth){
               iframeElem.css('width', 0);
            }

            if(autoHeight){
               iframeElem.css('height', 0);
            }

            html.css('margin', '0');
            body.css('margin', '0');
            body.css('position', 'absolute');

            if (!autoWidth) {
               body.css('width', '100%');//и ещё нужно body растянуть по ширине родителя, чтобы правильно посчиталась высота
            }

            // посчитали все отступы в документе.
            var bodyPaddings = {
               width: body.outerWidth(true) - body.innerWidth() +
                      html.outerWidth(true) - html.innerWidth(),
               height: body.outerHeight(true) - body.innerHeight() +
                       html.outerHeight(true) - html.innerHeight()
            };

            if (autoWidth) {
               width = Math.max(parseInt(body.prop('scrollWidth'), 10),
                                body.outerWidth(true) + bodyPaddings.width,
                                this._options.minWidth);
            }
            else {
               //если выравнивание Stretch, запретим iframе растягиваться за пределы родителя, для корректной работы скроллов
               width = 0;
            }

            if (autoHeight) {
               height = Math.max(parseInt(body.prop('scrollHeight'), 10),
                                 body.outerHeight(true) + bodyPaddings.height);
            } else {
               //если выравнивание Stretch, запретим iframе растягиваться за пределы родителя, для корректной работы скроллов
               height = 0;
            }

            if (autoHeight && !autoWidth && $ws.helpers.hasHorizontalScrollbar(body)) {
               height += $ws.helpers.getScrollWidth();
            }

            if (autoWidth && !autoHeight && $ws.helpers.hasVerticalScrollbar(body)) {
               width += $ws.helpers.getScrollWidth();
            }

            body.css('width', '');
            body.css('position', '');
         } else {
            height = autoHeight ? this._options.minHeight : 0;
            width = autoWidth ? this._options.minWidth : 0;
         }

         return { height: height, width: width};
      },
      /**
       * Обновляет ресайзер
       */
      _updateResizer: function(){
         function setDimensions(bodySize) {
            var iframeHeight, iframeWidth,
               resizerHeight, resizerWidth;

            if (this._options.autoHeight) {
               if (this._verticalAlignment == 'Stretch') {
                  iframeHeight = '100%';
               } else {
                  iframeHeight = bodySize.height;
               }
            } else {
               iframeHeight = this._container.height();
            }

            if (this._options.autoWidth) {
               if (this._horizontalAlignment == 'Stretch') {
                  iframeWidth = '100%';
               } else {
                  iframeWidth = bodySize.width;
               }
            } else {
               iframeWidth = this._container.width();
            }

            if(iframeWidth !== '100%'){
               iframeWidth = Math.max(Math.min(parseInt(iframeWidth, 10),
                                      this._options.maxWidth),
                                      this._options.minWidth);
               resizerWidth = iframeWidth;
            } else {
               resizerWidth = 0;
            }

            if(iframeHeight !== '100%'){
               iframeHeight = Math.max(Math.min(parseInt(iframeHeight, 10),
                                       this._options.maxHeight),
                                       this._options.minHeight);
               resizerHeight = iframeHeight;
            } else {
               resizerHeight = 0;
            }

            //TODO: хак: почему-то иногда не хватает нескольких пикселей, и появляется прокрутка. приходится прятать прокрутку
            var html = $('html', iframe.contents());
            if (autoHeight && autoWidth) {
               html.css('overflow', 'hidden');
            } else if (autoWidth) {
               html.css('overflow-x', 'hidden');
            } else if (autoHeight) {
               html.css('overflow-y', 'hidden');
            }

            if (autoWidth) {
               this._container.width(iframeWidth);
            }

            //фиксим высоту iframe, resizer-а и контейнера, если есть горизонтальный скролл и автовысота.
            if (this._options.autoHeight && iframeHeight !== '100%' && (this._container.width() < bodySize.width)) {
               iframeHeight += $ws.helpers.getScrollWidth();
               resizerHeight = iframeHeight;
            }

            if (autoHeight) {
               this._container.height(iframeHeight);
            }

            iframe.width(iframeWidth).height(iframeHeight);

            $ws.helpers.setElementCachedSize(this._resizer, {width: resizerWidth, height: resizerHeight});

            return {width: resizerWidth, height: resizerHeight};
         }

         if(this._options.docType == 'template'){
            $ws.proto.HTMLView.superclass._updateResizer();
         }else{
            var iframe = this._getCurrIframeCtrl();
            if(!iframe) {
               return;
            }
            var autoWidth = this._options.autoWidth && this._horizontalAlignment !== 'Stretch',
                autoHeight = this._options.autoHeight && this._verticalAlignment !== 'Stretch',
                bodySize = this._getIframeBodySize(iframe, autoWidth, autoHeight);

            bodySize = setDimensions.call(this, bodySize);

            //TODO: хак: в IE8 и иногда IE7 может неправильно определяться высота/ширина содержимого фрейма
            //надо это проверить и подправить
            if ($ws._const.browser.isIE && (autoWidth || autoHeight)) {
               var contents = iframe.contents(),
                   body = $('body', contents), html;

               if (body.size() > 0) {
                  html = $('html', contents);
                  if (autoWidth) {
                     var scrollW = body.prop('scrollWidth');
                     if (scrollW > bodySize.width) {
                        bodySize.width = scrollW + 1;//TODO: IE9 IE8 - хак: в IE9/8 надо добавлять ещё один пиксель, чтоб прокрутки не появлялись во фрейме
                        bodySize = setDimensions.call(this, bodySize);
                     }
                  }

                  if (autoHeight) {
                     var scrollH = body.prop('scrollHeight');
                     if (scrollH > bodySize.height) {
                        bodySize.height = scrollH + 1;//TODO: IE9 IE8 - хак: в IE9/8 надо добавлять ещё один пиксель, чтоб прокрутки не появлялись во фрейме
                        setDimensions.call(this, bodySize);
                     }
                  }
               }
            }
         }
      },
      /**
       * устанавливает авторазмеры iframe-а
       */
      setAutoSize:function () {
         var iframe = this._getCurrIframeCtrl();
         if(!iframe) {
            return;
         }

         this._initResizers();
         this._notifyOnSizeChanged(this, this);
      },

      _loadDescendents: function() {},

      _createIFrame: function(attributes, onLoad) {

         var name = this._createFrameId();

		   //При втором и следующих вызовах setHTML нужно пересоздать _iframeReady
		   //чтобы дожидаться готовности ифрейма
         if (this._iframeReady.isReady()) {
            this._iframeReady = new $ws.proto.Deferred();
         }

         if (typeof attributes == 'function' && typeof onLoad == 'undefined') {
            onLoad = attributes;
            attributes = {};
         }

         this._removeLoadingIndicator();
         this._container.empty();
         this._createLoadingIndicator();
         this._iframeContainer = $('<div />', { id: 'htmlview_' + this.getId() }).appendTo(this._container);

         var patt = /%/,
            width = this._options.autoWidth? 'auto': patt.test(this._options.width) ? this._options.width : this._options.width + "px",
            height = this._options.autoHeight? 'auto': patt.test(this._options.height) ? this._options.height : this._options.height + "px",
            css = {
               'position': 'absolute',
               'left': 0,
               'top': 0,
               'width'  : (this._options.autoWidth && this._horizontalAlignment != 'Stretch'? width : "100%"),
               'height' : (this._options.autoHeight && this._verticalAlignment != 'Stretch'? height : "100%")
            };

         // Хак для айпадов и айфонов - оборачивающему блоку нужно прописать эти стили, чтоб работала прокрутка в ифрейме
         if ($ws._const.browser.isMobileSafari) {
            css['-webkit-overflow-scrolling'] = 'touch';
            css.overflow = 'auto';
         }

         if( $ws._const.browser.isIE ) {
            css.overflow = 'visible';
         }

         this._iframeContainer.css(css);

         this.hideIframeContainer();

         var iframe = $('<iframe>iFrame not supported!</iframe>');
         iframe.attr({
            id: name,
            name: name,
            frameborder: 0
         }).css({
            width: '100%',
            height: '100%'
         });

         return iframe.load(onLoad).attr(attributes).appendTo(this._iframeContainer);
      },

      /**
       * Устанавливает хтмл-контент контрола
       * @param {String} html
       */
      setHTML: function(html){
         var self = this;
         this._options.docType = 'string';
         this._loaded = false;

         this._createIFrame(function(){
            if(!self._loaded){
               self._loaded = true;
               self._iframe = this;

               var elem = self._container.get(0);
               var visibility = (elem && elem.style.visibility) || '';

               self._container.css('visibility', 'visible');

               var doc = self.getIframeDocument(),
                   win = self.getIframeWindow();
               doc.open();
               doc.write(html);
               doc.close();

               self._container.css('visibility', visibility);

               $(doc).ready(function() {
                  var head = $(doc).find('head');
                  head.append('<meta name="format-detection" content="telephone=no">');
                  head.append('<style media="screen, print">body { margin: 0; } a[href^="tel:"] { text-decoration: none; color: inherit; }</style>');
                  head.append('<style media="print">html { overflow: auto !important; }</style>');

                  //Добавляем функцию через eval, потому что добавление тега <script> тут почему-то не срабатывает, хотя документ и готов.
                  //Добавлять же до готовности документа или через doc.write вперемешку с входным html как-то стрёмно
                  var script = 'window.printPage = function printPage() {window.print();};';
                  if (win['eval']) { //в IE8 в ифреймах у окна нет функции eval, а есть execScript
                     win.eval(script);
                  } else {
                     win.execScript(script)
                  }

                  self._iframeReady.addCallback(function() {
                     self._contentLoaded();
                     self._notify('onContentSet', 'string', html);
                  });

                  self._iframeReady.callback();
               });
            }
         });
      },
      /**
       * Возвращает текущее содержимое body iframe'а
       * @return {String}
       */
      getHTML: function(){
         return this.getIframeDocument().body.innerHTML;
      },
      /**
       * Устанавливает шаблон для контрола
       * @param {String} templateName
       * @deprecated Не использовать. Без замены. Удаляется с 3.8
       */
      setTemplate: function(templateName){
         BOOMR.plugins.WS.reportEvent("control.HTMLView", "setTemplate");
         var self = this;
         this._options.template = templateName; // Может быть Deferred
         this._options.docType = 'template';
         this._iframe = undefined;

         return this._runInBatchUpdate('setTemplate', function() {
            return self._loadTemplate().addCallback(function(){
               self._notify('onContentSet', 'template', templateName);
            });
         });
      },
      /**
       * Устанавливает адрес страницы, которая будет загружена
       * @param {String} url
       */
      setUrl: function(url){
         var self = this;

         this._loaded = false;

         this._createIFrame({ src: url }, function(){
            self._iframe = this;
            self._loaded = true;

            var doc = self.getIframeDocument();

            $(doc).ready(function() {

               self._iframeReady.addCallback(function() {
                  self._contentLoaded();
                  self._notify('onContentSet', 'url', url);
               });

               self._iframeReady.callback();
            });
         });
      },
      /**
       * Вызывает печать контрола
       */
      print: function(){
         if(this._iframe){
            if(this._notify('onBeforePrint', this._iframe) !== false){
               var w = this.getIframeWindow(),
                  self = this;
               if($.browser.opera){
                  var clone = this.getIframeDocument().documentElement,
                     oldDocument = window.document.documentElement,
                     css = $('<style type="text/css">' +
                     '@media screen{' +
                     'body > *, body {display: none !important;}' +
                     '}' +
                     '</style>');
                  window.document.replaceChild(clone, window.document.documentElement);
                  $('head').append(css);
                  setTimeout(function(){
                     window.focus();
                     window.print();
                     setTimeout(function(){
                        window.document.replaceChild(oldDocument, window.document.documentElement);
                        var iframeDocument = self.getIframeDocument();
                        iframeDocument.replaceChild(clone, iframeDocument.documentElement);
                        setTimeout(function(){
                           css.remove();
                        }, 100);
                     }, 100);
                  }, 500);
               }
               else{
                  var ieHiddenPrintFix = false,       //Если мы печатаем в ие ифрейм, который скрыт сам или находится в блоке с visibility: hidden
                     iframe = $(this._iframe),        //То будет печататься вся страница, а не только ифрейм
                     opacity;                        //Для решения этой проблемы перемещаю ифрейм в боди и делаю видимым, уменьшая прозрачность до 0
                  if($ws._const.browser.isIE && !iframe.is(':visible')){
                     ieHiddenPrintFix = true;
                     iframe.parents().andSelf().each(function(){
                        var $this = $(this);
                        $this.data('display', $this.css('display'));
                        $this.data('visibility', $this.css('visibility'));
                        $this.data('ws-hidden', $this.hasClass('ws-hidden'));
                        $this.css({
                           'display': 'block',
                           'visibility': 'visible'
                        });
                        $this.removeClass('ws-hidden');
                     });
                     opacity = iframe.css('opacity');
                     iframe.css({
                        opacity: 0
                     });
                  }
                  setTimeout(function(){
                     (self._iframe.contentWindow || w).focus();
                     setTimeout(function(){
                        if ($ws._const.browser.chrome && window.opener) {
                           /*TODO убрать это условие после выхода 36 хрома
                           http://stackoverflow.com/questions/23071291/javascript-window-print-in-chrome-closing-new-window-or-tab-instead-of-cancel*/
                           var incorrectClosingHandler = function () {
                              return 'Покидая эту страницу, вы заблокируете родительское окно!\n' +
                                     'Пожалуйста, выберите "Остаться на этой странице" и используйте кнопку' +
                                     '"Отмена" перед закрытием вкладки.\n';
                           };
                           $ws._const.$win.bind('beforeunload', incorrectClosingHandler);
                           w.printPage();
                           $ws._const.$win.unbind('beforeunload', incorrectClosingHandler);
                        }
                        else {
                           w.printPage();
                        }
                        if(ieHiddenPrintFix){
                           iframe.css('opacity', opacity)
                              .parents().andSelf().each(function(){
                              var $this = $(this);
                              $this.data('display', $this.css('display'));
                              $this.data('visibility', $this.css('visibility'));
                              $this.css({
                                 'display': $this.data('display'),
                                 'visibility': $this.data('visibility')
                              });
                              if($this.data('ws-hidden')){
                                 $this.addClass('ws-hidden');
                              }
                           });
                        }
                     }, 0);
                  }, 100);
               }
            }
         }
      },
      _createFrameId: function() {
         return this._iframeId || (this._iframeId = $ws.helpers.randomId('ws-htmlview-frame-'));
      },
      _getCurrIframeCtrl: function(){
         var iframe = $('#' + this._createFrameId());
         if(!(iframe || iframe.get(0).contentDocument || iframe.get(0).contentWindow)) {
            return false;
         } else {
            return iframe;
         }
      },
      /**
       * Возвращает document текущего iframe'а
       * @returns {Document}
       */
      getIframeDocument: function(){
         if($ws._const.browser.isIE){
            return window.frames[this._createFrameId()].document;
         }
         return this._iframe.contentDocument;
      },
      /**
       * Возвращает window текущего iframe'а
       * @returns {Window}
       */
      getIframeWindow: function(){
         if($ws._const.browser.isIE){
            return window.frames[this._createFrameId()];
         }
         return this._iframe.contentWindow;
      },
      /**
       * Возвращает деферред с моментом, когда контрол готов
       * @returns {$ws.proto.Deferred}
       */
      getReadyDeferred: function(){
         return this._dReady;
      },
      /**
       * Добавляет стиль с указанным адресом в iframe
       * @param {String} path Путь (url)
       * @return {$ws.proto.Deferred}
       */
      addStyle: function(path){
         if (this._options.docType === 'template') {
            throw new Error('Функцию $ws.proto.HTMLView.addStyle нельзя использовать при опции docType === "template"');
         }

         var self = this;
         return this._iframeReady.addCallback(function(){
            var styleTag = self.getIframeDocument().createElement('link'),
                  deferred = new $ws.proto.Deferred(),
                  doc = self.getIframeDocument();
            path = path.substr(0, 1) == '/' ? $ws.core.urlWithHost(path) : $ws.core.urlWithHost($ws._const.wsRoot + path);
            styleTag.setAttribute('rel', 'stylesheet');
            styleTag.setAttribute('type', 'text/css');
            styleTag.setAttribute('href', path);
            $(doc).find('head').append(styleTag);

            var img = $('<img />', {style: 'position: absolute; visibility: hidden; left: 0; top: 0; display: block;'});
            img.error(function() {
               // Сначала удалим лишний элемент, а уж потом начнем колбечить
               img.remove();
               deferred.callback();
            }).appendTo(doc.body).prop('src', path);

            return deferred;
         });
      },
      /**
       * Возвращает iframe-объект
       * @returns {HTMLIFrameElement}
       */
      getIframe: function(){
         return this._iframe;
      },
      /**
       * Возвращает контейнер, который содержит в себе iframe
       */
      getIframeContainer: function(){
         return this._iframeContainer;
      },
      /**
       * Прячет контейнер с iframe'ом от чужих глаз
       */
      hideIframeContainer: function(){
         if($ws._const.browser.isIE){
            this._iframeContainer.css('opacity', 0);
         }
         else if($.browser.opera){
            this._iframeContainer.css('display', 'none');
         }
         else{
            this._iframeContainer.css('visibility', 'hidden');
         }
      },
      showIframeContainer: function(){
         if($.browser.msie){
            this._iframeContainer.css('opacity', 1);
         }
         else if($.browser.opera){
            this._iframeContainer.css('display', 'block');
         }
         else{
            this._iframeContainer.css('visibility', 'visible');
         }
      }
   });


   return $ws.proto.HTMLView;
});

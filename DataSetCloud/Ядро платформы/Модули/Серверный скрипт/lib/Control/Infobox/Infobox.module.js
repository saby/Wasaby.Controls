/**
 * Модуль "Компонент подсказка. По show показывает подсказку, по hide - скрывает".
 *
 * @description
 */
define('js!SBIS3.CORE.Infobox',
   [
      'html!SBIS3.CORE.Infobox',
      'css!SBIS3.CORE.Infobox',
      'is!browser?js!Ext/jquery-ui/jquery-ui-position'
   ],
   function(dotTplFn) {

   'use strict';

   var INFOBOX_MIN_WIDTH = 100,
       MAX_WIDTH_TO_SCREEN_RATIO = 1/2,
       MIN_INFOBOX_TARGET_CONTAINER_WIDTH = 40,
       INFOBOX_HIDE_DELAY = 300,
       INFOBOX_BALOON_VERTICAL_PADDING = 14,
       INFOBOX_BALOON_HEIGHT = 8,
       // Отступ подсказки от блока-хозяина
       INFOBOX_OFFSET_TOP = 4;

   function setGlobalConstants(){
      $ws.single.Infobox.HIDE_TIMEOUT = 500;
      $ws.single.Infobox.SHOW_TIMEOUT = 500;
      $ws.single.Infobox.ACT_CTRL_HIDE_TIMEOUT = 10000;
   }
   /**
    * Класс-подсказка. По "show" показывает подсказку, по "hide" - скрывает.
    * Стандарт: http://axure.tensor.ru/standarts/%D0%92%D1%81%D0%BF%D0%BB%D1%8B%D0%B2%D0%B0%D1%8E%D1%89%D0%B8%D0%B5_%D0%BF%D0%BE%D0%B4%D1%81%D0%BA%D0%B0%D0%B7%D0%BA%D0%B8.html
    *
    * DOM-элемент подсказки размещается в body. Если требуется обрабатывать какие-либо действия с элементами внутри подсказки
    * (например клики по ссылкам), разумно повесить обработку на body через $.delegate, а на активные элемент внутри подсказки
    * разместить класс-маркер, по которому и ловить события.
    * @example
    * При клике на все DOM-элементы внутри body, которые отнесены к css-классу "load-more-link", вешаем функцию:
    * <pre>
    *    $('body').delegate('.load-more-link', 'click', function() { ... });
    * </pre>
    * Тело этой функции может быть таким:
    * <pre>
    *    var target = $(...); // this.getContainer(), для отображения рядом с контролом
    *    $ws.single.Infobox.show(target, "<p>some text <a href='#' class='load-more-link'>read more</a></p>");
    * </pre>
    *
    * @singleton
    * @class $ws.single.Infobox
    * @extends $ws.proto.Abstract
    */
   $ws.single.Infobox = new ($ws.proto.Abstract.extend(/** @lends $ws.single.Infobox.prototype */{
      /**
       *
       * @event onShow При открытии подсказки
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {jQuery} element DOM-элемент, возле которого запрошено отображение подсказки.
       * @memberOf $ws.single.Infobox.prototype
       * @see onHide
       */
      /**
       *
       * @event onHide  При скрытии подсказки
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @memberOf $ws.single.Infobox.prototype
       * @see onShow
       */
      /**
       *
       * @event onChangeTarget  При смене элемента, обладающего подсказкой
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {Element} previous DOM-элемент, с которого подсказка уходит. Если подсказка была ранее невидима, то параметр будет равен null.
       * @param {Element} next DOM-элемент, на который уходит подсказка. Если подсказка скрывается, параметр будет равен null.
       * @memberOf $ws.single.Infobox.prototype
       */
      /**
       *
       * @event onBeforeShow Перед показом инфобокса
       * — Обработка результата: Результат не обрабатывается
       * @param {$ws.proto.EventObject} event Дескриптор события.
       * @param {jQuery} element DOM-элемент, возле которого запрошено отображение подсказки.
       * @return При возврате false показ инфобокса будет отменён. 
       * @memberOf $ws.single.Infobox.prototype
       * @example
       * <pre>
       *    $ws.single.Infobox.subscribe('onBeforeShow',function(event,element){
       *       if(control.getContainer() === element) {
       *          event.setResult(false);
       *       }
       *    });
       * </pre>
       */      
      $protected: {
         _box: undefined,
         _content: undefined,
         _hideTimer: undefined,
         _showTimer: undefined,
         _currentTarget: null,
         _closeBtn : null,
         _message : '',
         _width: 'auto',
         _watchTimer: undefined,
         _measureText: null
      },
      _dotTplFn: dotTplFn,
      $constructor: function(){
         this._publish('onShow', 'onHide', 'onChangeTarget', 'onBeforeShow');
      },
      _build: function(){
         var self = this,
            activeWindow = $ws.single.WindowManager.getLastActiveWindow() && $ws.single.WindowManager.getLastActiveWindow().getTopParent();
         this._box = $(this._dotTplFn(this))
            .bind('mouseenter', function(){
               if(self._hideTimer){
                  clearTimeout(self._hideTimer);
               }
            })
            .bind('mouseleave', this.hide.bind(this));
         this._closeBtn = this._box.find('.ws-info-box-close-button');
         this._content = this._box.find('.ws-infobox-content');
         //так как у инфобокса нет парента, он просто лежит в body, то проверим по последнему активному окну
         //выезжающая панель ли это, и если так, то подпишемся на скролл выезжающей панели
         if(activeWindow && $ws.helpers.instanceOfModule(activeWindow, 'SBIS3.CORE.FloatArea')) {
            activeWindow.subscribe('onScroll', function(){
               self.hide(0);
            });
            }
         $(window).bind('scroll', function(){
                        self.hide(0);
                     });
         this._closeBtn.click(function(e){
            self.hide(0);
            e.stopPropagation();
            return false;
         });
         $('body').append(this._box);
      },
      /**
       * <wiTag group='Управление'>
       * Привязан ли инфобокс к переданному DOM-элементу.
       * @param {jQuery|Element} element DOM-элемент.
       * @returns {Boolean} Признак: привязан (true) или нет (false).
       * @see getCurrentTarget
       * @see hasTarget
       */
      isCurrentTarget: function(element) {
         if(this._currentTarget && element) {
            return this._currentTarget == (element.get ? element.get(0) : element);
         } else {
            return false;
         }
      },
      /**
       * <wiTag group='Управление'>
       * Получить DOM-элемент, к которому привязана подсказка
       * @returns {Element|null} Текущий DOM-элемент, возле которого открыт инфобокс.
       * Если он ещё не открыт ни на одним из контролов или других элементов, то возвращается null.
       * @see isCurrentTarget
       * @see hasTarget
       */
      getCurrentTarget: function() {
         return this._currentTarget;
      },
      /**
       * <wiTag group='Управление'>
       * Установить текст инфобокса.
       * @param {String} text
       * @example
       * В зависимости от значения флага изменять текст инфобокса.
       * <pre>
       *    var message1,
       *        message2;
       *    fieldCheckbox.subscribe('onChange', function(eventObject, value) {
       *       $ws.single.Infobox.setText(value ? message1 : message2);
       *    });
       * </pre>
       * @see show
       */
      setText: function(text) {
         this._message = '' + text;
         if(this._content) {
            this._content.empty().html($ws.helpers.escapeTagsFromStr(this._message, ['script']).replace(/\n/g, '<br>'));
         }
         this._resizeBox();
      },
      _clearShowTimer: function() {
         if(this._showTimer) {
            clearTimeout(this._showTimer);
            this._showTimer = undefined;
         }
      },
      _clearHideTimer: function() {
         if(this._hideTimer){
            clearTimeout(this._hideTimer);
            this._hideTimer = undefined;
         }
      },
      _clearWatchTimer: function() {
         if(this._watchTimer){
            clearTimeout(this._watchTimer);
            this._watchTimer = undefined;
         }
      },
      /**
       * Сбрасывает таймеры
       * @private
       */
      _clearTimers: function(){
         this._clearShowTimer();
         this._clearHideTimer();
      },
       /**
        * <wiTag group='Управление'>
        * Открыт ли инфобокс над каким-либо элементом или контролом.
        * @returns {Boolean} Признак: открыт (true) или нет (false).
        * @example
        * При готовности контрола открыть над ним инфобокс.
        * <pre>
        *    //текст, отображаемый инфобоксом
        *    var message;
        *    control.subscribe('onReady', function() {
        *       if (!$ws.single.Infobox.hasTarget()) {
        *          $ws.single.Infobox.show(this.getContainer(), message);
        *       }
        *    });
        * </pre>
        * @see getCurrentTarget
        * @see isCurrentTarget
        * @see show
        * @see setText
        */
      hasTarget: function() {
			return !!this._currentTarget;
      },
      /**
       * Смотрит за тем, что элемент, к которому привязана подсказка
       * 1. Находится в DOM (у него есть родитель 'html')
       * 2. У него нет невидимых родителей
       *
       * Иначе инициирует скрытие подсказки
       *
       * Этот метод выполняется по таймеру каждые 100мс
       * @private
       */
      _watchTargetPresent: function() {
         var
            $target = $(this.getCurrentTarget());
         if ($target.length && !$ws.helpers.isElementVisible($target)) {
            this.hide(0);
         }
      },
      /**
       * Открыть инфобокс.
       * <wiTag group='Управление'>
       * @param {Object|HTMLElement|jQuery} control|options Объект с параметрами-аргументами или DOM-элемент,
       *    около которого будет открыт инфобокс. Если DOM-элемент не задан - ничего не произойдет.
       *    Если этот параметр единственный, и является простым js-объектом (не HTML-элементом), то в нём указан набор именованных аргументов,
       *    с такими же именами, как и у остальных аргументов метода.
       *    Вот структура этого объекта:
       *    {
       *      control: HTMLElement|jQuery,  //см. аргумент control
       *      message: String,              //текст, отображаемый инфобоксом
       *      width: [Number|String],       //ширина инфобокса
       *      delay: [Number],              //задержка в миллисекундах перед открытием инфобокса
       *      hideDelay: [Number],          //задержка в миллисекундах перед закрытием инфобокса
       *      needToShow: [Function]        //функция, в которой выполняется проверка необходимости открытия инфобокса. Если возвращает true, то инфобокс откроется
       *      offset: [Number]              //явно указанная позиция, на которой нужно показывать подсказку.
       *                                    //если этот параметр не указан, то позиция подсказки будет рассчитана исходя из позиции DOM-элемента, указанного в параметре control
       *                                    //если же указан, то позиция подсказки будет взята из него.
       *     }
       *     Параметры, соответствующие необязательным аргументам, можно не учитывать.
       *
       * @param {String}         message                 Текст, отображаемый в инфобоксе. Если он не задан - инфобокс не будет отображен.
       * @param {Number|String}  [width      = 'auto' ]  Ширина блока с подсказкой. Если она не задана - будет автоширина в диапазоне [ 185px, ширинаЭкрана * 1/2 ].
       * @param {Number}         [delay      =    200 ]  Задержка перед show.
       * @param {Number}         [hideDelay  =      0 ]  Через какое время скрыться инфобоксу после открытия. Значение устанавливается в мс. По умолчанию подсказка автоматически не скрывается.
       * @param {Function}       [needToShow          ]  Функция, определяющая надобность вызова подсказки. Если она не задана, то подсказка открывается всегда.
       * Если функция возвращает true, то это значит, что подсказка откроется. Если она вернёт false - значит подсказка не откроется.
       * @example
       * Конфигурация инфобокса через единственный объект. При переходе фокуса на поле ввода (fieldString) открыть инфобокс.
       * <pre>
       *    fieldString.subscribe('onFocusIn', function() {
       *       //получаем контейнер контрола
       *       var target = this.getContainer(),
       *           options = {
       *              control: target,
       *              message: 'Пароль должен состоять из символов латинского алфавита и цифр',
       *              width: 400,
       *              hideDelay: 5000
       *           };
       *       $ws.single.Infobox.show(options);
       *    });
       * </pre>
       * @see hide
       */
      show : function(control, message, width, delay, hideDelay, needToShow){
         if (arguments.length === 1 && $.isPlainObject(arguments[0])) {
            var options = arguments[0];
            control = options.control;
            message = options.message;
            width = options.width;
            delay = options.delay;
            hideDelay = options.hideDelay;
            needToShow = options.needToShow;
            this._currentShowOffset = options.offset || null;
         } else {
            this._currentShowOffset = null;
         }

         if(!$(control)[0] || !$(control).is(":visible") || !message || (typeof needToShow === 'function' && !needToShow())){
            return;
         }

			this._message = message;
         this._width = width === undefined ? 'auto' : width;
         if(!this._box) {
            this._build();
         }
         this._clearShowTimer();
         var
            showDelay = (delay === undefined || typeof(delay) !== 'number') ? 200 : delay,
            self = this,
            ctrl = $(control),
            showCtrl = ctrl.get(0),
            fShow = function(){
               if(self._notify('onBeforeShow', ctrl) === false) {
                  return;
               }
               self._clearHideTimer();
               self._clearWatchTimer();
               // Если целевой элемент не является частью документа
               if(!ctrl.closest('html').size()){
                  return;
               }

               //бывает такое что infobox показывается не у того контрола,
               // пробуем полечить это, ещё раз присваивая currentTarget перед показом
               if(!self._currentTarget) {
                  self._currentTarget = showCtrl;
               }
               self._notify('onChangeTarget', self._currentTarget, showCtrl);

               self.setText(self._message);
               self._box.stop().css('opacity', 1).show();
               self._watchTimer = setInterval(self._watchTargetPresent.bind(self), 100);
               self._notify('onShow', ctrl);
               if (hideDelay) {
                  self.hide(hideDelay);
               }
            };
         if(this.isCurrentTarget(control)) {
            // Если мы уже на этом контроле - просто поменяем текст
            // Для этого скинем все задержки в 0,
            // это приведет к тому что подсказка поменяет текст и спозиционируется, если не влезла
            showDelay = 0;
            hideDelay = 0;
         }
         self._currentTarget = showCtrl;
         if(showDelay) {
            this._showTimer = setTimeout(fShow, showDelay);
         }
         else {
            fShow();
         }
      },
      _resizeBox : function(){
         var
            $box = this._box,
            ctrl = $(this._currentTarget),
            css = this._currentShowOffset ? this._currentShowOffset : ctrl.offset(),
            windowWidth = $ws._const.$win.width(),
            ctrlWidth = ctrl.width(),
            newWidth = this._width,
            boxWidth;

         $box.width(newWidth);
         boxWidth = $box.outerWidth();

         // При автоширине ограничим ширину диапазоном [ INFOBOX_MIN_WIDTH, windowWidth * MAX_WIDTH_TO_SCREEN_RATIO ]
         if(newWidth == 'auto') {
            // Посчитаем новую ширину
            boxWidth = Math.max(INFOBOX_MIN_WIDTH, Math.min(boxWidth, windowWidth * MAX_WIDTH_TO_SCREEN_RATIO));

            var messageText = this._message.replace(/<\/?[^>]+>/g,' '),
                messageWidth = this.getTextWidth(messageText),
                messageWords, s, e, m;

            if (boxWidth < messageWidth) {
               messageWords = messageText.split(' ');
               s = 0, e = messageWords.length;

               //Находим первую подстроку, которая будет длиннее, чем boxWidth
               while (s < e) {
                  m = (s + e) >> 1;
                  messageWidth = this.getTextWidth(messageWords.slice(0, m + 1).join(' '));
                  if (messageWidth < boxWidth) {
                     s = m + 1;
                  } else {
                     e = m;
                  }
               }

               //Сейчас длина подстроки в s слов больше или равна boxWidth, а все подстроки в s-1 и менее слов короче её
               //Получим подстроку, меньшую boxWidth, если это возможно
               if (s > 0) {
                  messageWidth = this.getTextWidth(messageWords.slice(0, s).join(' '));
               }
               boxWidth = messageWidth;
            }

            // применим ее
            $box.width(boxWidth);
         }

         $box
            .css({
               display: 'block',
               // Теперь z-index считается правильно, но есть случаи, когда он не должен показываться поверх SimpleDialogAbstract
               zIndex: this._highZIndex() + ($('body').find('.ws-smp-dlg').length === 0 ? 1 : -1)
            })
            .position({
               my: 'left bottom',
               at: 'left top-' + (INFOBOX_OFFSET_TOP + INFOBOX_BALOON_HEIGHT).toString(),
               collision: 'flip',
               of: ctrl,
               using: function(pos) {
                  var
                     leftTurned = boxWidth > $ws._const.$win.get(0).outerWidth - Math.round(css.left) - ctrlWidth, //Был ли разворот по горизонтали?
                     topTurned = pos.top > Math.round(css.top), //Был ли разворот по вертикали?
                     horizontalOffset = ctrlWidth <= MIN_INFOBOX_TARGET_CONTAINER_WIDTH ? (ctrlWidth / 2) - INFOBOX_BALOON_VERTICAL_PADDING : 0;
                  $box
                     .toggleClass('ws-infobox-direction-top', topTurned)
                     .toggleClass('ws-infobox-direction-bottom', !topTurned)
                     .toggleClass('ws-infobox-direction-right', leftTurned)
                     .toggleClass('ws-infobox-direction-left', !leftTurned)
                     .css({ //Позиционируем контейнер подсказки
                        top: pos.top,
                        left: pos.left + (leftTurned ? -horizontalOffset : horizontalOffset)
                     });
               }
            });
      },


      getTextWidth : function(text){
         if (!this._measureText) {
            this._measureText = $('<div/>');
            this._measureText.css({
               height: 'auto',
               width: 'auto',
               position: 'fixed',
               left: 0,
               top: 0
            });
            this._measureText.html(text);
            this._measureText.appendTo($('body'));
         } else {
            this._measureText.html(text);
            this._measureText.show();
         }

         var rect = this._measureText.get(0).clientWidth;
         this._measureText.hide();
         return rect;
      },
      _hide: function() {
         this._clearWatchTimer();
         this._box.stop().css('opacity', 1).fadeOut('fast', function(){
            this._notify('onChangeTarget', this._currentTarget, null);
            this._currentTarget = null;
            this._notify('onHide');
         }.bind(this));
      },
      /**
       * <wiTag group='Управление'>
       * Скрыть инфобокс.
       * @cfg {Number} [delay = 300] Задержка в миллисекундах перед скрытием инфобокса.
       * @example
       * При уходе фокуса с контрола скрыть инфобокс через 2 секунды.
       * <pre>
       *    control.subscribe('onFocusOut', function() {
       *       $ws.single.Infobox.hide(2000);
       *    });
       * </pre>
       * @see show
       */
      hide : function(delay){
         this._clearTimers();
         if(this._box){
            if(delay === 0){
               this._hide();
            }
            else{
               var self = this;
               this._hideTimer = setTimeout(function(){
                  self._hide();
               }, ((delay === undefined || typeof(delay) !== 'number') ? INFOBOX_HIDE_DELAY : delay));
            }
         }
      },

      /**
       * Находит максимальный z-index
       * @param [parent] - элемент, с которого необходимо считать z-index
       * @param [limit] - максимальный лимит z-index
       * @returns {number}
       * @private
       *
       * @description
       * Метод считает z-index по стандарту W3C. Учитывает контекст позиций и свойство opacity
       * Более подробно: http://habrahabr.ru/post/166435/
       * (C)копипащено отсюда: http://stackoverflow.com/questions/4503969/how-do-i-get-the-element-with-the-highest-css-z-index-in-a-document/5439622#5439622
       * Проблемы:
       *  - Не учитывается transform (ведет себя аналогично opacity)
       *  - В IE 9-10 (11?) может вести себя не верно, из за того, что браузер наклал на стандарты и iframe и selection считает по своему,
       *    плюс opacity и transform не формируют новый контекст, если position = absolute/fixed
       */
      _highZIndex: function(parent, limit) {
         limit = limit || Infinity;
         parent = parent || document.body;

         var who, temp, max= 1, opacity, i= 0;
         var children = parent.childNodes, length = children.length;

         while(i < length) {
            who = children[i++];
            if (who.nodeType != 1 || this._deepCss(who, 'display') === 'none' || this._deepCss(who, 'visibility') === 'hidden') {
               // element nodes only
               continue;
            }
            opacity = this._deepCss(who, 'opacity');
            if (this._deepCss(who, 'position') !== 'static') {
               temp = this._deepCss(who, 'z-index');
               if (temp == 'auto') {
                  // positioned and z-index is auto, a new stacking context for opacity < 0. Further When z-index is auto ,it shall be treated as z-index = 0 within stacking context.
                  temp = (opacity < 1) ? 0 : this._highZIndex(who);
               } else {
                  temp = parseInt(temp, 10) || 0;
               }
            } else {
               // non-positioned element, a new stacking context for opacity < 1 and z-index shall be treated as if 0
               temp = (opacity < 1) ? 0 : this._highZIndex(who);
            }
            if (temp > max && temp <= limit) {
               max = temp;
            }
         }
         return max;
      },

      _deepCss: function(who, css) {
         var sty, val, dv= document.defaultView || window;
         if (who.nodeType == 1) {
            sty = css.replace(/\-([a-z])/g, function(a, b) {
               return b.toUpperCase();
            });
            val = who.style[sty];
            if (!val) {
               if (who.currentStyle) {
                  val= who.currentStyle[sty];
               } else if (dv.getComputedStyle) {
                  val= dv.getComputedStyle(who, '').getPropertyValue(css);
               }
            }
         }
         return val || '';
      }
   }))();

   setGlobalConstants();
   return $ws.single.Infobox;
});

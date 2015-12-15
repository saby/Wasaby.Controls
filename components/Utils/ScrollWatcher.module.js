/**
 * Created by ad.chistyakova on 12.11.2015.
 */
define('js!SBIS3.CONTROLS.ScrollWatcher', [], function() {
   'use strict';
   var SCROLL_INDICATOR_HEIGHT = 32;
   if (typeof(jQuery) !== 'undefined') {
      (function( $ ) {
         $.fn.wsScrollWatcher = function() {
            var scrollWatcher = null;
            try {
               scrollWatcher = this[0].wsScrollWatcher;
            }
            catch(e) {}
            return scrollWatcher;
         };

      })( jQuery );
   }
   $ws.proto.ScrollWatcher = $ws.proto.Abstract.extend(/** @lends SBIS3.CONTROLS.ScrollWatcher.prototype */{
      /**
       * @event onScroll Событие проиходит, когда срабатывает проверка на скроллею Например, когда достигли низа страницы
       * @remark
       *
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String} type - какое именно событие произошло. Достигли дна окна, контейнера, всплывающей панели.
       * Или это Пользовательская проверка ('userCheck')
       * @param {Object} result - то, что возвращает функция проверки положения скролла. В общем случае true || false, но
       * пользователь может вернуть что угодно.
       * @example
       * <pre>
       *     ScrollWatcher.subscribe('onScroll', function(event, type) {
       *        if (type === 'windowBottom') {
       *          $ws.core.alert('Вы достигли дна');
       *        }
       *     });
       * </pre>
       */
      $protected: {
         _options: {
            /**
             * @cfg {jQuery} 
             */
            element : undefined,
            /**
             * @cfg{String}
             * Тип "Отслеживателя": container, window, floatArea
             * @remark если тип === 'container', то необходимо самостоятельно определить функцию проверки scrollCheck
             */
            type : 'container',
            /**
             * @cfg {Control} Контрол, от которого отслеживается скролл.
             * @remark
             * От него будем искать контейнер, если задан по классу, по нему будем искать находимся ли мы на floatArea
             *
             */
            opener: undefined,
            /**
             * Если нужно отслеживать скролл во FloatArea, то ее нужно передать
             */
            floatArea: undefined,
            /**
             * @cfg {{}} Набор пользовательский функций-проверок
             * @remark
             * Объект вида {checkName : function} , где function - пользовательская функция, которая будет вызвана по событию скролла.
             * checkName - уникальное имя, оно будет передано как имя проверки в событии onScroll, если функция вернет true
             * В функцию будет передан jQuery event
             * Здесь можно написать какую-то свою проверку. Например, что мы доскроллили вверх по контейнеру
             *
             */
            scrollCheck: {},
            /**
             * @cfg {Number} Определитель нижней границы. Если передать число > 0 то событие с типом "Достигли дна(до скроллили до низа\верха страницы)"
             * будет срабатывать на checkOffset px раньше
             */
            checkOffset : 0
         },
         _isScrollUp: false,                       //Проверка, в какую сторону scroll. Первый скролл вверх не может быть.
         _lastScrollTop: 0,                        //Последний сохраненный скролл
         _onWindowScrollHandler : undefined,
         _floatAreaScrollHandler : undefined,
         _onContainerScrollHandler: undefined
      },

      $constructor: function() {
         var self = this;
         this._publish('onScroll');
         if (this._inContainer()) {
            this._options.element.wsScrollWatcher = this;
            this._options.element.addClass('ws-ScrollWatcher');
         }

         var topParent = this._options.floatArea;

         //В зависимости от настроек высоты подписываемся либо на скролл у окна, либо у контейнера
         if (this._inContainer() && this._options.element) {
            this._onContainerScrollHandler =  this._onContainerScroll.bind(this);
            this._options.element.bind('scroll.wsScrollWatcher', this._onContainerScrollHandler);
         } else if (this._inWindow()) {
            this._onWindowScrollHandler = this._onWindowScroll.bind(this);
            $(window).bind('scroll.wsScrollWatcher', this._onWindowScrollHandler);
         } else if (this._inFloatArea() && $ws.helpers.instanceOfModule(topParent, 'SBIS3.CORE.FloatArea')) {
            //Если браузер лежит на всплывающей панели и имеет автовысоту, то скролл появляется у контейнера всплывашки (.parent())
            this._floatAreaScrollHandler = this._onFAScroll.bind(this);
            topParent.subscribe('onScroll', this._floatAreaScrollHandler);
            topParent.subscribe('onDestroy', function(){
               self.destroy();
            });
         }
      },
      getOpener : function(){
         return this._options.opener;
      },
      _inFloatArea: function(){
         return this._options.type === 'floatArea';
      },
      _inContainer: function(){
         return this._options.type === 'container';
      },
      _inWindow: function(){
         return this._options.type === 'window';
      },
      /**
       * Точка соприкосновения всех подписанных скроллов
       * Здесь проиходяит проверки - куда поскроллили, вызываются пользовательские функции проверки
       * @param type
       * @param result
       * @param event
       * @private
       */
      _processScrollEvent: function (type, result, event) {
         var scrollCheck = this._options.scrollCheck,
               curScrollTop = $(event.target).scrollTop(),
               userResult;
         this._isScrollUp = this._lastScrollTop > curScrollTop;
         this._lastScrollTop = curScrollTop;

         //Если была пройдена пользовательская проверка, то оповестим пользователя.
         if (!Object.isEmpty(scrollCheck)) {
            for (var i in scrollCheck) {
               if (scrollCheck.hasOwnProperty(i) && typeof scrollCheck[i] === 'function') {
                  userResult = scrollCheck[i](event);
                  if (userResult) {
                     this._notify('onScroll', i, userResult);
                  }
               }
            }

         }
         if (result) {
            this._notify('onScroll', type, result);
         } else if (this._checkTop(event)) {
            this._notify('onScroll', 'top', true);
         }
      },
      _onWindowScroll: function (event) {
         this._processScrollEvent('bottom', this._isBottomOfPage(), event);
      },
      _onFAScroll: function(event, scrollOptions) {
         this._processScrollEvent('bottom', scrollOptions.clientHeight + scrollOptions.scrollTop  >= scrollOptions.scrollHeight - SCROLL_INDICATOR_HEIGHT - this._options.checkOffset, event);
      },
      _onContainerScroll: function (event) {
         //TODO может здесь сможет появится какая-нибудь проверка...
         this._processScrollEvent('bottom', false, event);
      },
      _checkTop : function(event){
         return event && this._isScrollUp && (this._lastScrollTop < this._options.checkOffset);
      },
      /**
       * Добавить функцию проверки по событию скролла в контейнере. Важно -
       * будьте внимательны от какого контекста выполняется функция!
       * @param {String} checkName - уникальное имя проверки скролла
       * @param {function} func - функция проверки события scroll
       */
      addScrollCheckFunction: function(checkName, func){
         this._options.scrollCheck[checkName] = func;
      },
      _isBottomOfPage: function () {
         var docBody = document.body,
            docElem = document.documentElement,
            clientHeight = Math.min(docBody.clientHeight, docElem.clientHeight),
            scrollTop = Math.max(docBody.scrollTop, docElem.scrollTop),
            scrollHeight = Math.max(docBody.scrollHeight, docElem.scrollHeight);
         return (clientHeight + scrollTop  >= scrollHeight - SCROLL_INDICATOR_HEIGHT - this._options.checkOffset);//Учитываем отступ снизу на высоту картинки индикатора загрузки
      },
      //TODO есть вариант, когда захотят останавливать и запускать отслеживание скролла. Как понадобится сделаем.
      //start : function(){},
      //stop : function(){},
      destroy: function(){
         if (this._inWindow()) {
            $(window).unbind('scroll.wsScrollWatcher', this._onWindowScrollHandler);
            this._onWindowScrollHandler = undefined;
         }
         $ws.proto.ScrollWatcher.superclass.destroy.call(this);
      }

   });
   return  $ws.proto.ScrollWatcher;
});
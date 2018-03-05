define('SBIS3.CONTROLS/ScrollContainer/ScrollWidthController', [
   'Core/detection'
], function(
   cDetection
) {
   'use strict';

   /**
    * Синглтон для вычисления и обновления ширины нативного скролбара
    * @class SBIS3.CONTROLS/ScrollContainer/ScrollWidthController
    * @author Крайнов Д.О.
    * @private
    * @singleton
    */
   var BrowserScrollbarWidthController = {
      /** Ширина нативного скролбара
       * @type {?number}
       * @private
       */
      _width: null,
      /**
       * Количество ссылок на синглтон
       * @type {number}
       * @private
       */
      _count: 0,
      /**
       * Флаг обозначающий, что ширину нужно перерасчитывать при зуме
       * @type {boolean}
       */
      needHandle: false,
      /**
       * Получение ширины скрола
       * @param {?boolean} force Принудительное обновление значения
       * @return {number}
       */
      width: function(force) {
         if (this._width === null || force) {
            this._update();
         }
         return this._width;
      },
      /**
       * Добавляем обработчик. Обязательно прописываем в init-е экземпляра класса использующий этот контролер
       * @param {Function} handler Обработчик изменения ширины скрола
       */
      add: function(handler) {
         if (this.width === null) {
            this.update();
         }
         if (this.needHandle) {
            if (this._count++ === 0) {
               $(window).on('resize', this.update);
            }
            $(window).on('resize', handler);
         }
      },
      /**
       * Удалям обработчик. Обязательно прописываем в destroy-е экземпляра класса использующий этот контролер
       * @param {Function} handler Обработчик изменения ширины скрола
       */
      remove: function(handler) {
         if (this.needHandle) {
            if (--this._count === 0) {
               $(window).off('resize', this.update);
            }
            $(window).off('resize', handler);
         }
      },
      /**
       * Обновление значения ширины
       */
      update: function() {
         BrowserScrollbarWidthController._update();
      },
      /**
       * Обновление значения ширины
       * @private
       */
      _update: function() {
         this._width = this._getBrowserScrollbarWidth();
      },
      /**
       * Получение значения ширины
       * @returns {number}
       * @private
       */
      _getBrowserScrollbarWidth: function() {
         var scrollbarWidth = null, outer, outerStyle;
         /**
          * В браузерах с поддержкой ::-webkit-scrollbar установлена ширини 0.
          * Определяем не с помощью Core/detection, потому что в нем считается, что chrome не на WebKit.
          */
         if (/AppleWebKit/.test(navigator.userAgent)) {
            scrollbarWidth = 0;
         } else {
            // На Mac ширина всегда 15, за исключением браузеров с поддержкой ::-webkit-scrollbar.
            if (cDetection.isMac) {
               scrollbarWidth = 15;
            }
         }
         if (cDetection.isIE12) {
            scrollbarWidth = 16;
         }
         if (cDetection.isIE10 || cDetection.isIE11) {
            scrollbarWidth = 17;
         }
         if (scrollbarWidth === null) {
            outer = document.createElement('div');
            outerStyle = outer.style;
            outerStyle.position = 'absolute';
            outerStyle.width = '100px';
            outerStyle.height = '100px';
            outerStyle.overflow = 'scroll';
            outerStyle.top = '-9999px';
            document.body.appendChild(outer);
            scrollbarWidth = outer.offsetWidth - outer.clientWidth;
            document.body.removeChild(outer);

            // значение ширины валидно только при текущем зуме и его нужно перерасчитывать
            this.needHandle = true;
         }

         return scrollbarWidth;
      }
   };

   return BrowserScrollbarWidthController;
});

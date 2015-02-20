/**
 * Модуль "Компонент SimpleDialogAbstract".
 *
 * @description
 */
define("js!SBIS3.CORE.ModalOverlay", function( ) {

   "use strict";

   /**
    * Задний фон (overlay) для модального диалога.
    *
    * @singleton
    * @class $ws.single.ModalOverlay
    * @extends $ws.proto.Abstract
    */
   $ws.single.ModalOverlay = new ($ws.proto.Abstract.extend(/** @lends $ws.single.ModalOverlay.prototype */{
      /**
       * @event onOverlayToggle Событие, происходящее при смене состояния оверлея (показан/скрыт)
       * @param {Boolean} state Текущее состояние, true = показан, false = скрыт
       */
      /**
       * @event onClick Событие на клик по оверлею
       */
      $protected: {
         _overlay : undefined,
         _overlayState : false
      },
      $constructor: function() {
         this._publish('onOverlayToggle', 'onClick');
      },
      _createOverlay: function() {
         if (this._overlay === undefined) {
            this._overlay = $('<div></div>')
               .appendTo(document.body)
               .hide()
               .addClass('ws-window-overlay');

            this._overlay.click(function(e){
               var window = $ws.single.WindowManager.getActiveWindow();
               if(window){
                  window.onBringToFront(); //возвращаем курсор в активный диалог
               }

               var res = this._notify('onClick');
               if (res) {
                  e.stopPropagation();
               }
            }.bind(this));
         }
      },
      /**
       * Показать оверлей
       * @param {Number} maxZ z-index оверлея
       * @deprecated Будет удален полностью в 3.7, используйте {@link $ws.single.ModalOverlay#adjust}
       */
      show : function(maxZ) {
         $ws.single.ioc.resolve('ILogger').log("ModalOverlay", "Использование метода show недопустимо, используйте adjust");
         if(maxZ !== undefined) {
            $ws.single.ioc.resolve('ILogger').log("ModalOverlay", "Параметр метода show() не учитывается c версии 3.6, используйте $ws.single.WindowManager.acquireZIndex() для регистрации модального элемента");
         }
         this.adjust();
      },
      /**
       * Изменить z-index оверлея
       * @param {Number} index z-index
       * @deprecated Будет удален полностью в 3.7, используйте {@link $ws.single.ModalOverlay#adjust}
       */
      zIndex : function(index) {
         $ws.single.ioc.resolve('ILogger').log("ModalOverlay", "Использование метода zIndex недопустимо, используйте adjust");
         this._setZIndex(index);
      },
      _setZIndex: function(index) {
         if (this._overlay !== undefined) {
            this._overlay.css('z-index', index);
         }
      },
      getZIndex: function () {
         return (this._overlay && this._overlay.css('z-index')) || 0;
      },

      /**
       * Определяет, показан ли модальный оверлей для окна ("принадлежит" ему).
       * Это значит, что он лежит точно под этим окном (его z-index меньше z-index окна на единицу).
       * @param $ws.proto.AreaAbstract win
       * @returns {boolean}
       */
      isShownForWindow: function(win) {
         return (win.getZIndex() - this.getZIndex()) === 1;
      },

      /**
       * @deprecated Полностью удалено с 3.7 без замены. Используйте {@link $ws.single.ModalOverlay#adjust}
       */
      hide: function() {
         $ws.single.ioc.resolve('ILogger').log("ModalOverlay", "Использование метода hide недопустимо, используйте adjust");
         this._hide();
      },
      _show: function() {
         if(this._overlayState !== true) {
            this._createOverlay();
            this._overlay.show();
            this._notify('onOverlayToggle', this._overlayState = true);
         }
      },
      /**
       * Скрыть оверлей. При этом  оверлей не уничтожается, чтобы в следующий раз быстреть отобразиться
       */
      _hide : function() {
         if (this._overlay !== undefined) {
            if(this._overlayState !== false) {
               this._overlay.hide();
               this._notify('onOverlayToggle', this._overlayState = false);
            }
         }
      },
      /**
       * Передвигает оверлей под самое верхнее модальное окно
       *
       * Для управления уровнем оверлея
       * используйте {@link $ws.single.WindowManager#acquireZIndex} и {@link $ws.single.WindowManager#releaseZIndex}
       *
       * @returns {Boolean} true если оверлей остался видимым, false - если скрыт
       */
      adjust: function() {
         var modalIndex = $ws.single.WindowManager.getMaxVisibleZIndex();
         if(modalIndex > 0) {
            this._show();
            this._setZIndex(modalIndex - 1);
            return true;
         } else {
            this._hide();
            return false;
         }
      },
      /**
       * Метод для получения текущегно состояния оверлея
       * @returns {Boolean}
       */
      getState: function() {
         return this._overlayState;
      },
      /**
       * @deprecated Используйте {@link $ws.single.ModalOverlay#adjust}. Будет удалено с 3.7
       */
      moveDown: function(){
         $ws.single.ioc.resolve('ILogger').log("ModalOverlay", "Использование метода moveDown недопустимо, используйте adjust");
         this.adjust();
      }
   }))();

   return $ws.single.ModalOverlay;

});
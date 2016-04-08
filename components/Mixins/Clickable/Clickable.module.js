define('js!SBIS3.CONTROLS.Clickable', [], function() {

   if (typeof window !== 'undefined') {
      $(document).mouseup(function () {
         $('.controls-Click__active').removeClass('controls-Click__active');
      });
   }

   /**
    * Миксин, добавляющий поведение хранения выбранного элемента. Всегда только одного
    * @mixin SBIS3.CONTROLS.Clickable
    * @public
    * @author Крайнов Дмитрий Олегович
    */

   var Clickable = /**@lends SBIS3.CONTROLS.Clickable.prototype  */{
      /**
       * @event onActivated При активации кнопки (клик мышкой, кнопки клавиатуры)
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @example
       * <pre>
       *    onActivated: function(event){
       *       $ws.helpers.question('Продолжить?');
       *    }
       * </pre>
       */
      $protected: {
         _options: {
            /**
             * @cfg {String}  Команда
             */
            command: ''
         },
         _keysWeHandle: [
            $ws._const.key.enter,
            $ws._const.key.space
         ]
      },

      $constructor: function() {
         this._publish('onActivated');
         var self = this;

         this._container.mousedown(function (e) {
            if (e.which == 1 && self.isEnabled()) {
               self._container.addClass('controls-Click__active');
            }
            //return false;
         });
      },

      _notifyOnActivated : function(originalEvent) {
         this._notify('onActivated', originalEvent);
      },

      _keyboardHover: function(event){
         if (this.isEnabled()) {
            this._clickHandler(event);
            this._notifyOnActivated(event);
            return true;
         }
      },

      /*В корешке закладки (TabButton) нужно что бы клик по ней работал вне зависимости от ее состояния, для этого определен
      этот метод, который позволяет сделать контрол и его детей (например редактирование по месту в закладке) disabled 
      но клик по самому контролу будет обрабатываться*/
      _checkEnabledByClick: function(){
         return this.isEnabled();
      },

      before : {
         _clickHandler: function() {
            if (!!this._options.command) {
               this.sendCommand(this._options.command);
            }
         }
      },

      instead : {
         //TODO сделано через onClickHandler WS в базовом контроле
         _onClickHandler: function(e) {
            if (this._checkEnabledByClick()) {
               this._container.removeClass('controls-Click__active');
               //Установим фокус в контрол, чтобы у него стрельнул onFocusIn и у контрола с которого уходит фокус, стрельнул onFocusOut.
               //Такое поведение необходимо например в редактировании по месту, которое закрывается, когда у дочернего контрола стрельнул onFocusOut.
               if (!this._isControlActive && this._options.activableByClick) {
                  this.setActive(true);
               }
               this._clickHandler(e);
               this._notifyOnActivated(e);
            }
            e.stopImmediatePropagation();
         }
      }
   };

   return Clickable;

});/**
 * Created by kraynovdo on 27.10.2014.
 */

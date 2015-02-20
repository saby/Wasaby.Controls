/**
 * Модуль "Компонент кнопка".
 *
 * @description
 */
define("js!SBIS3.CORE.PushButton", ["js!SBIS3.CORE.Button", "css!SBIS3.CORE.PushButton"], function( Button ) {

   "use strict";

   /**
    * Кнопка
    *
    * @class $ws.proto.PushButton
    * @extends $ws.proto.Button
    * @control
    * @category Button
    * @initial
    * <component data-component='SBIS3.CORE.PushButton'>
    *    <option name='caption'>PushButton</option>
    * </component>
    */
   $ws.proto.PushButton = Button.extend(/** @lends $ws.proto.PushButton.prototype */{
      $protected:{
         _pressed : false
      },
      /**
       * Происходит при активации кнопки - сообщает о нажатии на кнопку, выполняет необходимые действия
       * @private
       */
      _activate: function(){

         var self = this;

         this.togglePress();
         var result = this._notify('onActivated', this._pressed);
         if(result instanceof $ws.proto.Deferred){
            this._toggleProcess(true);
            result.addBoth(function(result) {
               self._toggleProcess(false);
               return result;
            });
         }
      },
      /**
       * <wiTag group="Управление">
       * Переключить состояние двухпозиционной кнопки.
       * @param {Boolean} [val] Ожидаемое состояние, если не указан переключается в противоположное от текущего
       * @example
       * <pre>
       *    var btn = this.getTopParent().getChildControlByName("myButton");
       *    btn.togglePress(false);
       * </pre>
       * @see isPressed
       */
      togglePress : function(val){
         this._pressed = val !== undefined ? !!val : !this._pressed;
         this._container.toggleClass('ws-button-pressed', this._pressed);
         if(this._isSpriteImage && this._options.image){
            this._applyImageChange();
         }
      },
      /**
       * <wiTag group="Управление">
       * Получить признак нажатия кнопки.
       * @return {Boolean} Возвращает состояние кнопки, нажата кнопка или нет.
       * @example
       * <pre>
       *    var btn = this.getTopParent().getChildControlByName("myButton");
       *    if (btn.isPressed()){
       *       btn.togglePress(false);
       *    }
       * </pre>
       * @see togglePress
       */
      isPressed : function(){
         return this._pressed;
      },
      _setRedIcon : function(spriteClasses){
         if(this._pressed){
            return spriteClasses.replace('icon-primary', 'icon-error');
         }
         return spriteClasses;
      }
   });


   return $ws.proto.PushButton;

});

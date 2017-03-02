/**
 * Утилита рассчета высоты клавиатуры на тач устройствах
 */
define('js!SBIS3.CONTROLS.TouchKeyboardHelper', [
   "Core/constants",
   "Core/EventBus"
], function( constants, EventBus) {
   /*Коэфицент Борисова*/
   var ipadCoefficient = {
      portrait: 0.3,
      landscape: 0.56
   };

   var TouchKeyboardHelper = {
      _keyboardVisible: false,

      _keyboardShowHandler: function(){
         this._keyboardVisible = true;
      },

      _keyboardHideHandler: function(){
         this._keyboardVisible = false;
      },

      isPortrait: function(){
         return window.innerHeight > window.innerWidth;
      },

      getKeyboardHeight: function(){
         if (this.isKeyboardVisible()){
            if (constants.browser.isMobileIOS){
               return $(window).height() * (this.isPortrait() ? ipadCoefficient.portrait : ipadCoefficient.landscape);
            }
         }
         return 0;
      },

      isKeyboardVisible: function(){
         return this._keyboardVisible;
      }
   };

   if (constants.compatibility.touch){
      EventBus.globalChannel().subscribe('MobileInputFocus', TouchKeyboardHelper._keyboardShowHandler.bind(TouchKeyboardHelper));
      EventBus.globalChannel().subscribe('MobileInputFocusOut', TouchKeyboardHelper._keyboardHideHandler.bind(TouchKeyboardHelper));
   }

   return TouchKeyboardHelper;
});
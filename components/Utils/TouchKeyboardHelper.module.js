/**
 * Утилита рассчета высоты клавиатуры на тач устройствах
 */
define('js!SBIS3.CONTROLS.TouchKeyboardHelper', [], function() {

   var ipadCoefficient = {
      portrait: 0.7,
      landscape: 0.44
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
            if ($ws._const.browser.isMobileIOS){
               return window.innerHeight * (this.isPortrait() ? ipadCoefficient.portrait : ipadCoefficient.landscape);
            }
         } else {
            return 0;
         }
      },

      isKeyboardVisible: function(){
         return this._keyboardVisible;
      }
   };

   if ($ws._const.compatibility.touch){
      $ws.single.EventBus.globalChannel().subscribe('MobileInputFocus', TouchKeyboardHelper._keyboardShowHandler);
      $ws.single.EventBus.globalChannel().subscribe('MobileInputFocusOut', TouchKeyboardHelper._keyboardHideHandler);
   }

   return TouchKeyboardHelper;
});
/**
 * Утилита рассчета высоты клавиатуры на тач устройствах
 * @author Зайцев А.С.
 */
define('SBIS3.CONTROLS/Utils/TouchKeyboardHelper', [
   "Core/constants",
   "Core/EventBus"
], function( constants, EventBus) {

   var ipadCoefficient = {
      portrait: 0.3,
      landscape: 0.56
   };

   var TouchKeyboardHelper = {
      _keyboardVisible: false,
      _keyboardAnimation: false,

      _keyboardShowHandler: function(){
         this._keyboardVisible = true;
         this._keyboardHandler();
      },

      _keyboardHideHandler: function(){
         this._keyboardVisible = false;
         this._keyboardHandler();
      },

      _keyboardHandler: function() {
         var self = this;
         if(!this._keyboardAnimation){
            // из-за анимации клавиатуры на мобильных устройствах происходит сдвиг контента
            // что приводит к скрытие меню. делаем задержку и на время анимации меню не закрываем
            // увеличили время с 300мс до 350мс, т.к. на ipad мини клавиутаура анимируется дольше чем 300мс
            this._keyboardAnimation = setTimeout(function(){
               self._keyboardAnimation = null;
            }, 350);
         }
      },

      isPortrait: function(){
         return window.innerHeight > window.innerWidth;
      },

      getKeyboardAnimation: function(){
         return this._keyboardAnimation;
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
         var isVisible = this._keyboardVisible;

         // Отдельно проверяем, есть ли фокус в полях ввода, т.к. клавиатура показана только в этом случае.
         // Можно обкатать механизм на этих правках и впоследствии избавиться от нотифая глобального события в полях ввода.
         // Для определения того, что клавиатура показалась и нужно на это отреагировать, в application можно проверять,
         // Куда пришел фокус, если это input/textarea (и возможно еще div с contenteditable), то через emitter/listener сообщать
         // об этом дочерним компонентам.
         if (!isVisible && document.activeElement) {
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
               isVisible = true;
            }
         }
         return isVisible;
      }
   };

   if (constants.compatibility.touch){
      EventBus.globalChannel().subscribe('MobileInputFocus', TouchKeyboardHelper._keyboardShowHandler.bind(TouchKeyboardHelper));
      EventBus.globalChannel().subscribe('MobileInputFocusOut', TouchKeyboardHelper._keyboardHideHandler.bind(TouchKeyboardHelper));
   }

   return TouchKeyboardHelper;
});
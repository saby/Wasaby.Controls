/**
 * Утилита рассчета высоты клавиатуры на тач устройствах
 */
define('Controls/Utils/TouchKeyboardHelper', ['Env/Env', 'Env/Event', 'Core/helpers/isNewEnvironment'], function(Env, EnvEvent, isNewEnvironment) {
   var ipadCoefficient = {
      portrait: 0.3,
      landscape: 0.53
   };

   var TouchKeyboardHelper = {
      _keyboardVisible: false,
      _keyboardAnimation: false,

      _keyboardShowHandler: function() {
         this._keyboardVisible = true;
         this._keyboardHandler();
      },

      _keyboardHideHandler: function() {
         this._keyboardVisible = false;
         this._keyboardHandler();
      },

      _keyboardHandler: function() {
         var self = this;
         if (!this._keyboardAnimation) {
            // из-за анимации клавиатуры на мобильных устройствах происходит сдвиг контента
            // что приводит к скрытие меню. делаем задержку и на время анимации меню не закрываем
            // увеличили время с 300мс до 350мс, т.к. на ipad мини клавиутаура анимируется дольше чем 300мс
            this._keyboardAnimation = setTimeout(function() {
               self._keyboardAnimation = null;
            }, 350);
         }
      },

      isPortrait: function() {
         // Высота экрана может уменьшиться на высоту клавиатуры. Для точного определения ориентации учитываю скроллY.
         return (window.innerHeight + window.scrollY) > window.innerWidth;
      },

      getKeyboardAnimation: function() {
         return this._keyboardAnimation;
      },

      getKeyboardHeight: function() {
         if (this.isKeyboardVisible()) {
            if (Env.detection.isMobileIOS) {
               // на новых версиях ios(12.1.3/12.1.4), в горизонтальной ориентации иногда(!!!) клавиатура при своем показе
               // уменьшает высоту экрана(как это и должно быть). в этом случае хэлпер должен вернуть высоту 0, чтобы
               // окна не вычитали высоту клавиатуры из высоты страницы. P.S. Если открыть клаву в вертикальной ориентации
               // и не закрывая ее поменять ориантацию, этот хак не поможет, код будет работать по старой логике.м
               if (!this.isPortrait() && window.screen.availHeight / window.innerHeight > 2) {
                  return 0;
               }
               return window.innerHeight * (this.isPortrait() ? ipadCoefficient.portrait : ipadCoefficient.landscape);
            }
         }
         return 0;
      },

      isKeyboardVisible: function() {
         var isVisible = this._keyboardVisible;

         // Отдельно проверяем, есть ли фокус в полях ввода, т.к. клавиатура показана только в этом случае.
         // Можно обкатать механизм на этих правках и впоследствии избавиться от нотифая глобального события в полях ввода.
         // Для определения того, что клавиатура показалась и нужно на это отреагировать, в application можно проверять,
         // Куда пришел фокус, если это input/textarea/contenteditable, то через emitter/listener сообщать
         // об этом дочерним компонентам. Костыль актуален только для старой страницы, на вдом отключил.
         if (!isNewEnvironment() && !isVisible && document && document.activeElement) {
            var isInput = document.activeElement.tagName === 'INPUT';
            var isTextArea = document.activeElement.tagName === 'TEXTAREA';
            var isContentEditable = document.activeElement.getAttribute('contenteditable') === 'true';

            if (isInput || isTextArea || isContentEditable) {
               isVisible = true;
            }
         }
         return isVisible;
      }
   };

   if (Env.constants.compatibility.touch) {
      EnvEvent.Bus.globalChannel().subscribe('MobileInputFocus', TouchKeyboardHelper._keyboardShowHandler.bind(TouchKeyboardHelper));
      EnvEvent.Bus.globalChannel().subscribe('MobileInputFocusOut', TouchKeyboardHelper._keyboardHideHandler.bind(TouchKeyboardHelper));
   }

   return TouchKeyboardHelper;
});

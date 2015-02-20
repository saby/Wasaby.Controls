/**
 * Created by elifantievon on 20.06.14.
 */
define('js!SBIS3.CORE.CloseButton', [ 'js!SBIS3.CORE.Button', 'css!SBIS3.CORE.CloseButton' ], function(button){

   var CloseButtonConfig = {
      $protected: {
         _options: {
            allowChangeEnable: false,
               enabled: true,
               caption: '',
               image: 'ws:/titlebar-close.png',
               cssClass: 'sbisname-window-title-close'
         }
      }
   };

   if ($ws._const.browser.isMacOSDesktop) {
      //Стандартную обработку события "click" нужно выключить. См. комментарий в конструкторе.
      CloseButtonConfig._onClickHandler = $ws.helpers.nop;

      CloseButtonConfig.$constructor = function () {
         //Хак для Сафари на Маке: в нём после прокрутки плав. панели вертикальная крутилка пропадает, но
         //клик сквозь только что пропавшую полосу прокрутки не доходит, а mouseup доходит.
         //Поэтому для этой кнопки мы эмулируем клик через mouseup, а обработку клика выключаем
         this.getContainer().bind('mouseup', $ws.proto.CloseButton.superclass._onClickHandler.bind(this));
      };
   }

   return $ws.proto.CloseButton = button.extend(CloseButtonConfig);

});

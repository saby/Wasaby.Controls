/**
 * Created by as.avramenko on 09.08.2016.
 */
define('SBIS3.CONTROLS/Utils/ImitateEvents', ['Core/detection'], function(CoreDetection) {

   'use strict';

   /**
    * Модуль, реализующий имитацию различных DOM-событий
    * @class SBIS3.CONTROLS/Utils/ImitateEvents
    * @public
    * @author Авраменко А.С.
    */
   return /** @lends SBIS3.CONTROLS/Utils/ImitateEvents.prototype */{
      /**
       * Имитирует фокусировку для элемента по переданным координатам.
       * Если по переданным координатам находится wsControl, то ему вызывается метод setActive(true). Если просто DOM-элемент, то ему вызывается .focus()
       * @param {Integer} clientX x-координата для поиска элемента
       * @param {Integer} clientY y-координата для поиска элемента
       */
      imitateFocus: function (clientX, clientY) {
         var
            $target = $(document.elementFromPoint(clientX, clientY)),
            wsControl = $target.wsControl();
         if (wsControl) {
            wsControl.setActive(true);
            // На мобильных устройствах клавиатура отображается только если синхронно установить фокус в поле ввода
            // ControlBatchUpdate делает setActive асинхронно и в итоге клавиатура так и не отобразится
            if (CoreDetection.isMobilePlatform) {
               $target.focus();
            }
         } else {
            $target.focus();
         }
      }
   };
});
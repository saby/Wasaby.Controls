/**
 * @author Быканов А.А.
 */
define('js!SBIS3.DOCS.SelectorButtonSingle',
   [
      'js!SBIS3.CORE.CompoundControl',
      'html!SBIS3.DOCS.SelectorButtonSingle',
      'js!WS.Data/Source/SbisService',
      'css!SBIS3.DOCS.SelectorButtonSingle',
      'js!SBIS3.CONTROLS.SelectorButton' // Подключаем контрол Кнопка выбора
   ],
   function(CompoundControl, dotTplFn) {
      var moduleClass = CompoundControl.extend({
         _dotTplFn: dotTplFn,
         init: function() {
            moduleClass.superclass.init.call(this);
            $ws.helpers.message('Кнопка связи в режиме единичного выбора записей. Выбранная запись отобразится текстом на кнопке.');
         }
      });
      return moduleClass;
   }
);
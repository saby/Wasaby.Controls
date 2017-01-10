/**
 * @author Быканов А.А.
 */
define('js!SBIS3.DOCS.SelectorButtonLink',
   [
      'js!SBIS3.CORE.CompoundControl',
      'html!SBIS3.DOCS.SelectorButtonLink',
       'js!WS.Data/Source/SbisService',
      'css!SBIS3.DOCS.SelectorButtonLink',
      'js!SBIS3.CONTROLS.SelectorButton' // Подключаем контрол Кнопка выбора
   ],
   function(CompoundControl, dotTplFn) {
      var moduleClass = CompoundControl.extend({
         _dotTplFn: dotTplFn,
         init: function() {
            moduleClass.superclass.init.call(this);
            $ws.helpers.message('Кнопка связи в режиме множественного выбора записей. Выбранные записи отображаются текстом на кнопке, перечисленные через запятую.'); // Устанавливаем подсказку для правильного использования демо-примера
         }
      });
      return moduleClass;
   }
);
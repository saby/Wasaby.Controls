/**
 * Created by tm.baeva on 09.12.13.
 */
/**
 * Created by tm.baeva on 04.12.13.
 */
define('js!SBIS3.CORE.FloatAreaSelector', ['js!SBIS3.CORE.Selector', 'js!SBIS3.CORE.FloatArea'],
   function( selectorConfig, FloatArea ) {

   'use strict';

   /**
    * Выезжающая панель выбора из справочника
    *
    * Нужна для осуществления выбора связанной записи(используется полем связи).
    * В шаблоне этого диалога должен быть браузер - выборка из которой задаем связь.
    * Желательно, чтобы браузер был только один. Если их будет несколько то все нижеописанное применится только к первому.
    * Диалог переводит браузер в режим выбора. В таком режиме по нажатию Enter или ctrl + Enter отмеченные записи или в случае их отсутствия текущая запись уходят в поле связи.
    *
    * @class $ws.proto.FloatAreaSelector
    * @extends $ws.proto.FloatArea
    * @control
    *
    * @cfgOld {Boolean} multiSelect Возможен ли выбор нескольких значений
    * @cfgOld {String} selectionType Тип записей, которые можно выбирать в браузере
    * -'node'    только узлы,
    * -'leaf'    только листья,
    * -'all'     любые, по-умолчанию
    */
    /**
     * @event onChange событие, происходящее при выборе значения в браузере
     * @param {Object} eventObject описание в классе $ws.proto.Abstract
     * @param {Array} records Массив выбраных записей
     */
   $ws.proto.FloatAreaSelector = $ws.core.mixin(FloatArea, selectorConfig);

   return $ws.proto.FloatAreaSelector;
});

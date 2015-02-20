/**
 * Created by tm.baeva on 04.12.13.
 */
/**
 * Created with JetBrains PhpStorm.
 * User: tm.baeva
 * Date: 21.04.13
 * Time: 21:59
 * To change this template use File | Settings | File Templates.
 */
define('js!SBIS3.CORE.DialogSelector', ['js!SBIS3.CORE.Selector', 'js!SBIS3.CORE.Dialog'],
   function( selectorConfig, Dialog ) {

   'use strict';

   /**
    * Модальный диалог выбора из справочника
    *
    * Нужен для осуществления выбора связанной записи(используется полем связи).
    * В шаблоне этого диалога должен быть браузер - выборка из которой задаем связь.
    * Желательно, чтобы браузер был только один. Если их будет несколько то все нижеописанное применится только к первому.
    * Диалог переводит браузер в режим выбора. В таком режиме по нажатию Enter или ctrl + Enter отмеченные записи или в случае их отсутствия текущая запись уходят в поле связи.
    *
    * @class $ws.proto.DialogSelector
    * @extends $ws.proto.Dialog
    * @control
    *
    * @cfgOld {Boolean} multiSelect Возможен ли выбор нескольких значений
    * @cfgOld {String} selectionType Тип записей, которые можно выбирать в браузере
    * -'node'    только узлы,
    * -'leaf'    только листья,
    * -'all'     любые, по-умолчанию
    */
   /**
    * @lends $ws.proto.DialogSelector.prototype
    */
   /**
    * @event onChange событие, происходящее при выборе значения в браузере
    * @param {Object} eventObject описание в классе $ws.proto.Abstract
    * @param {Array} records Массив выбраных записей
    */
   $ws.proto.DialogSelector = $ws.core.mixin(Dialog, selectorConfig);
   return $ws.proto.DialogSelector;
});

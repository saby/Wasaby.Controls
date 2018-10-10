/**
 * Created by as.krasilnikov on 10.09.2018.
 */
define('Controls/Utils/isVDOMTemplate', [], function() {

   'use strict';

   /**
    * Модуль возвращает функцию, которая проверяет, совместим ли класс компонента с веб-фреймворком WaSaby.
    *
    * <h2>Аргумент функции</h2>
    *
    * Прототип класса компонента.
    *
    * <h2>Критерий проверки</h2>
    *
    * Класс наследуется от класса Core/Control.
    *
    * <h2>Возвращает</h2>
    *
    * <ul>
    *     <li><b>true</b> - класс совместим с Wasaby (наследуется от Core/Control)</li>
    *     <li><b>false</b> {Function} -  класс не совместим с Wasaby</li>
    * </ul>
    *
    * <h2>Пример использования</h2>
    * <pre>
    * require(
    * ['Controls/Button', 'SBIS3.CONTROLS/Button', 'Controls/Utils/isVDOMTemplate'],
    * function(VDOMButton, WS3Button, isVDOMTemplate) {
    *
    *   // true
    *   isVDOMTemplate(VDOMButton);
    *
    *   // false.
    *   isVDOMTemplate(WS3Button);
    *  });
    * </pre>
    *
    * @class Controls/Utils/isVDOMTemplate
    * @public
    * @author Красильников А.С.
    */

   return function isVDOMTemplate(templateClass) {
      // на VDOM классах есть св-во _template.
      // Если его нет, но есть _stable, значит это функция от tmpl файла
      var isVDOM = templateClass && (templateClass.prototype && templateClass.prototype._template || templateClass.stable);
      return !!isVDOM;
   };
});

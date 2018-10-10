/**
 * Created by as.krasilnikov on 10.09.2018.
 */
define('Controls/Utils/isVDOMTemplate', [], function() {

   'use strict';

   /**
    * Модуль возвращает функцию, которая проверяет, совместим ли класс компонента с веб-фреймворком WaSaby.
    * Аргумент функции - прототип класса компонента.
    * Критерий проверки: класс наследуется от класса Core/Control.
    * Возвращает: true - класс совместим с Wasaby (наследуется от Core/Control), иначе - false.
    * @example
    * <pre>
    *    var myClass = require('myClass');
    *    if (Controls / Utils / isVDOMTemplate(myClass)) {
    *       console.log('myClass is vdom component')
    *    }
    * </pre>
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

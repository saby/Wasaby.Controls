/**
 * Created by as.krasilnikov on 10.09.2018.
 */
define('Controls/Utils/isVDOMTemplate', [], function() {

   'use strict';

   /**
    * Возвращает информацию о том, является ли компонент наследником Core/Control.
    * @example
    * <pre>
    *    var myClass = require('myClass');
    *    if (Controls / Utils / isVDOMTemplate(myClass)) {
    *       console.log('myClass is vdom component')
    *    }
    * </pre>
    * @class Controls/Utils/isVDOMTemplate
    * @public
    * @author Крайнов Д.О.
    */

   return function isVDOMTemplate(templateClass) {
      // на VDOM классах есть св-во _template.
      // Если его нет, но есть _stable, значит это функция от tmpl файла
      var isVDOM = templateClass && (templateClass.prototype && templateClass.prototype._template || templateClass.stable);
      return !!isVDOM;
   };
});

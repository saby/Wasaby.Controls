/**
 * Вспомогательный класс для изменения имён свойств (простых) объектов.
 *
 * @public
 * @class SBIS3.CONTROLS/Utils/ImportExport/PropertyNames
 * @author Спирин В.А.
 */
define('SBIS3.CONTROLS/Utils/ImportExport/PropertyNames',
   [
   ],

   function () {
      'use strict';

      var PropertyNames = function () {};

      /**
       * @name SBIS3.CONTROLS/Utils/ImportExport/PropertyNames#camelCaseToLowDash
       * @function
       * @description Перевести имена всех свойств объекта, включая вложенные, из стиля <a href="https://ru.wikipedia.org/wiki/CamelCase">CamelCase</a> в нижнее подчёркивание.
       * @param {Object} obj Объект, у которого свойства названы в стиле CamelCase.
       * @return {Object} Объект, у которого имена свойств приведены к стилю с разделением через символ нижнего подчеркивания.
       * @throws {Error} Если не передан аргумент или тип аргумент не Object, возвращается объект Error с сообщением "No arguments".
       * @see SBIS3.CONTROLS/Utils/ImportExport/PropertyNames#lowDashToCamelCase
       */
      PropertyNames.camelCaseToLowDash = function (obj) {
         if (!obj || typeof obj !== 'object') {
            throw new Error('No arguments');
         }
         return _changeNames(_camelCaseToLowDash, obj);
      };

      /**
       * @name SBIS3.CONTROLS/Utils/ImportExport/PropertyNames#lowDashToCamelCase
       * @function
       * @description Перевести имена всех свойств объекта, включая вложенные, из нижнего подчёркивания в стиль <a href="https://ru.wikipedia.org/wiki/CamelCase">CamelCase</a>.
       * @param {object} obj Объект, у которого имена свойств названы в стиле, при котором слова разделяются через символ нижнего подчеркивания.
       * @return {object} Объект, у которого свойства названы в стиле CamelCase.
       * @throws {Error} Если не передан аргумент или тип аргумент не Object, возвращается объект Error с сообщением "No arguments".
       * @see SBIS3.CONTROLS/Utils/ImportExport/PropertyNames#camelCaseToLowDash
       */
      PropertyNames.lowDashToCamelCase = function (obj) {
         if (!obj || typeof obj !== 'object') {
            throw new Error('No arguments');
         }
         return _changeNames(_lowDashToCamelCase, obj);
      };

      // Private methods:

      var _changeNames = function (changer, values) {
         if (!values || typeof values !== 'object') {
            return values;
         }
         if (Array.isArray(values)) {
            return values.length ? values.map(_changeNames.bind(null, changer)) : [];
         }
         var o = {};
         for (var name in values) {
            var value = values[name];
            var n = changer(name);
            o[n] = value && typeof value === 'object' ? _changeNames(changer, value) : value;
         }
         return o;
      };

      var _CC2LD_RE = /(?!^)([A-Z])/g;
      var _camelCaseToLowDash = function (name) {
         return name.replace(_CC2LD_RE, '_$1').toLowerCase();
      };

      var _LD2CC_RE_1 = /(?:^_+|_+$)/;
      var _LD2CC_RE_2 = /_+([a-z0-9])/g;
      var _ld2ccReplacer2 = function ($0, $1/*, i, str*/) { return $1.toUpperCase(); };
      var _lowDashToCamelCase = function (name) {
         return name.indexOf('_') === -1 ? name : name.replace(_LD2CC_RE_1, '').toLowerCase().replace(_LD2CC_RE_2, _ld2ccReplacer2);
      };

      return PropertyNames;
   }
);

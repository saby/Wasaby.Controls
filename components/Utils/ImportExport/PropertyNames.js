/**
 * Вспомогательный класс для изменения имён свойсв (простых) объектов
 *
 * @public
 * @class SBIS3.CONTROLS/Utils/ImportExport/PropertyNames
 */
define('SBIS3.CONTROLS/Utils/ImportExport/PropertyNames',
   [
   ],

   function () {
      'use strict';

      var PropertyNames = function () {};

      /**
       * Перевести имена всех свойств объекта (включая вложенные) из верблюжей натации в нижнее подчёркивание
       *
       * @public
       * @static
       * @param {object} obj Объект
       * return {object}
       */
      PropertyNames.camelCaseToLowDash = function (obj) {
         if (!obj || typeof obj !== 'object') {
            throw new Error('No arguments');
         }
         return _changeNames(_camelCaseToLowDash, obj);
      };

      /**
       * Перевести имена всех свойств объекта (включая вложенные) из нижнего подчёркивания в верблюжью натацию
       *
       * @public
       * @static
       * @param {object} obj Объект
       * return {object}
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

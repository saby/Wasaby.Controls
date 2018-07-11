/**
 * Вспомогательный класс для работы с опциями компонента
 *
 * @public
 * @class SBIS3.CONTROLS/Utils/ImportExport/OptionsTool
 */
define('SBIS3.CONTROLS/Utils/ImportExport/OptionsTool',
   [
   ],

   function () {
      'use strict';

      /**
       * Вспомогательный класс для работы с опциями компонента
       *
       * @public
       * @constructor
       * @param {object} types Набор функций проверки для опций (в форме "имя опции" - "фунция проверки")
       * @param {object} defaults Набор значений по умолчанию для опций (в форме "имя опции" - "значение по умолчанию") (опционально)
       * @param {Array<string>} skipList Список имён опций из присутствующих в наборе функций проверки, которые не должны присутствовать среди "собственных"^^^ (опционально)
       */
      function OptionsTool(types, defaults, skipList) {
         if (!types || typeof types !== 'object') {
            throw new Error('Types must be an object');
         }
         var props = Object.keys(types);
         if (!props.length || !props.every(function (v) { return typeof types[v] === 'function'; })) {
            throw new Error('Types must contains a functions');
         }
         if (defaults && typeof defaults !== 'object') {
            throw new Error('Defaults must be an object');
         }
         if (skipList && !(Array.isArray(skipList) && skipList.every(function (v) { return typeof v === 'string'; }))) {
            throw new Error('Defaults must be an array of strings');
         }
         this._types = types;
         this._defaults = defaults || null;
         this._skipList = skipList && skipList.length ? skipList : null;
      };

      OptionsTool.prototype = /**@lends SBIS3.CONTROLS/Utils/ImportExport/OptionsTool.prototype*/ {
         /**
          * Получить проверочную информацию о типах данных опций
          *
          * @public
          * @static
          * @return {object}
          */
         getOptionTypes: function () {
            return this._types;
         },

         /**
          * Получить опции по умолчанию
          *
          * @public
          * @static
          * @return {object}
          */
         getDefaultOptions: function () {
            return this._defaults;
         },

         /**
          * Получить список имён всех собственных опций компонента
          *
          * @public
          * @static
          * @return {Array<string>}
          */
         getOwnOptionNames: function () {
            var names = Object.keys(this._types);
            var skipList = this._skipList;
            if (skipList) {
               for (var i = 0; i < skipList.length; i++) {
                  var name = skipList[i];
                  var j = names.indexOf(name);
                  if (j !== -1) {
                     names.splice(j, 1);
                  }
               }
            }
            return names;
         },

         /**
          * Разрешить неустановленные собственные опции компонента их значениями по умолчанию
          * @protected
          * @param {object} options Опции компонента
          * @param {boolean} replaceNulls Заменять значениями по умолчанию не только отсутствующие (undefined) опции, но и опции со значением null
          */
         resolveOptions: function (options, replaceNulls) {
            if (!options || typeof options !== 'object') {
               throw new Error('Options must be an object');
            }
            if (replaceNulls && typeof replaceNulls !== 'boolean') {
               throw new Error('ReplaceNulls must be a boolean');
            }
            var defaults = this._defaults;
            if (defaults) {
               for (var name in defaults) {
                  var value = options[name];
                  if (value === undefined || (replaceNulls && value === null)) {
                     options[name] = defaults[name];
                  }
               }
            }
         },

         /**
          * Проверить собственные опции компонента на допустимость их значений
          * @protected
          * @param {object} options Опции компонента
          * @param {function(Array<string>, object):Array<string>} [namesFilter] Фильт имён опций, которые подлежат проверке. Применяется при необходимости варьировать проверку в зависимости от значений других опций (опционально)
          */
         validateOptions: function (options, namesFilter) {
            if (!options || typeof options !== 'object') {
               throw new Error('Options must be an object');
            }
            if (namesFilter && typeof namesFilter !== 'function') {
               throw new Error('NamesFilter must be a function');
            }
            var types = this._types;
            var names = Object.keys(types);
            if (namesFilter) {
               names = namesFilter.call(null, names, options);
            }
            if (names && names.length) {
               for (var i = 0; i < names.length; i++) {
                  var name = names[i];
                  var validator = types[name];
                  if (validator) {
                     var err = validator(options[name]);
                     if (err instanceof Error) {
                        throw new Error('Wrong option "' + name + '": ' + err.message);
                     }
                  }
               }
            }
         }
      };

      return OptionsTool;
   }
);

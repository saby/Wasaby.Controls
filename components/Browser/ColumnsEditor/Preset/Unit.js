/**
 * Класс пресета редактора колонок
 *
 * @class SBIS3.CONTROLS/Browser/ColumnsEditor/Preset/Unit
 * @author Спирин В.А.
 * @public
 */
define('SBIS3.CONTROLS/Browser/ColumnsEditor/Preset/Unit',
   [],

   function () {
      'use strict';



      /**
       * Конструктор
       * @public
       * @param {object} options Параметры конструктора
       * @param {string|number}     options.id Идентификатор пресета (обязательный)
       * @param {string}            options.title Название пресета (обязательный)
       * @param {(string|number)[]} [options.selectedColumns] Список идентификаторов выбранных колонок (опциональный)
       * @param {(string|number)[]} [options.expandedGroups] Список идентификаторов распахнутых групп (опциональный)
       * @param {boolean}           options.isStorable Пресет является статическим (не сохраняемым) (опциональный)
       */
      var PresetUnit = function (options) {
         if (!options || typeof options !== 'object') {
            throw new Error('Object required');
         }
         Object.defineProperty(this, 'id', {enumerable:true, set:_setId, get:_getId});
         Object.defineProperty(this, 'title', {enumerable:true, set:_setTitle, get:_getTitle});
         this.id = options.id;
         this.title = options.title;
         this.selectedColumns = options.selectedColumns;
         this.expandedGroups = options.expandedGroups;
         this.isStorable = options.isStorable;
      };

      PresetUnit.prototype = /**@lends SBIS3.CONTROLS/Browser/ColumnsEditor/Preset/Unit.prototype*/ {
         /**
          * Идентификатор пресета
          * @type {string|number}
          * @name SBIS3.CONTROLS/Browser/ColumnsEditor/Preset/Unit#id
          */

         /**
          * Название пресета
          * @type {string}
          * @name SBIS3.CONTROLS/Browser/ColumnsEditor/Preset/Unit#title
          */

         /**
          * Список идентификаторов выбранных колонок
          * @type {(string|number)[]}
          */
         set selectedColumns (value) {
            this._selectedColumns = _check(value);
         },
         get selectedColumns () {
            return this._selectedColumns;
         },

         /**
          * Список идентификаторов распахнутых групп
          * @type {(string|number)[]}
          */
         set expandedGroups (value) {
            this._expandedGroups = _check(value);
         },
         get expandedGroups () {
            return this._expandedGroups;
         },

         /**
          * Пресет является сохраняемым
          * @type {boolean}
          */
         set isStorable (value) {
            if (value && typeof value !== 'boolean') {
               throw new Error('Boolean required');
            }
            this._isStorable = value || undefined;
         },
         get isStorable () {
            return this._isStorable;
         }
      };

      PresetUnit.prototype.constructor = PresetUnit;



      // Приватные методы

      var _setId = function (value) {
         if (!value || !(typeof value === 'string' || typeof value === 'number')) {
            throw new Error('None empty string or number required');
         }
         this._id = value;
      };
      var _getId = function () {
         return this._id;
      };

      var _setTitle = function (value) {
         // Аргумент может быть как нативной строкой, так и наследником String
         // 1174997532 https://online.sbis.ru/opendoc.html?guid=7ba8f75b-62d9-4f6f-bc0f-d7d7ffd21e3a
         if (!value || !(typeof value === 'string' || value instanceof String)) {
            throw new Error('None empty string required');
         }
         this._title = value.toString();
      };
      var _getTitle = function () {
         return this._title;
      };

      var _check = function (value) {
         if (value && !Array.isArray(value)) {
            throw new Error('Array of none empty sting or numbers required');
         }
         var has = value && value.length;
         if (has) {
            for (var i = 0; i < value.length; i++) {
               var v = value[i];
               if (!v || !(typeof v === 'string' || typeof v === 'number')) {
                  throw new Error('Array of none empty sting or numbers required');
               }
            }
         }
         return has ? value.slice() : [];
      };



      return PresetUnit;
   }
);

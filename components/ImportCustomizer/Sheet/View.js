/**
 * Контрол "Выбор области данных для импортирования настройщика импорта"
 *
 * @public
 * @class SBIS3.CONTROLS/ImportCustomizer/Sheet/View
 * @extends SBIS3.CONTROLS/CompoundControl
 */
define('SBIS3.CONTROLS/ImportCustomizer/Sheet/View',
   [
      'SBIS3.CONTROLS/CompoundControl',
      'tmpl!SBIS3.CONTROLS/ImportCustomizer/Sheet/View'/*,
      'css!SBIS3.CONTROLS/ImportCustomizer/Sheet/View'*/
   ],

   function (CompoundControl, dotTplFn) {
      'use strict';

      var View = CompoundControl.extend(/**@lends SBIS3.CONTROLS/ImportCustomizer/Sheet/View.prototype*/ {

         /**
          * @typedef {object} ExportSheetResult Тип, описывающий возвращаемые настраиваемые значения компонента
          * @property {number} sheetIndex Индекс выбранной области данных для импортирования
          *
          * @see sheetIndex
          */

         _dotTplFn: dotTplFn,
         $protected: {
            _options: {
               /**
                * @cfg {string} Название опции для выбора одинаковых настроек для всех листов файла
                */
               allSheetsTitle: rk('Все листы настраиваются одинаково', 'НастройщикИмпорта'),
               /**
                * @cfg {Array<string>} Список областей данных для импортирования
                */
               sheetTitles: [],
               /**
                * @cfg {number} Индекс выбранной области данных для импортирования
                */
               sheetIndex: -1
            },
            // Контрол выбора области данных для импортирования
            _view: null
         },

         _modifyOptions: function () {
            var options = View.superclass._modifyOptions.apply(this, arguments);
            var sheetTitles = options.sheetTitles;
            options._items = [{id:'', title:options.allSheetsTitle}].concat(sheetTitles.map(function (v, i) { return {id:i + 1, title:v}; }));
            var sheetIndex = options.sheetIndex;
            options._selectedKey = sheetIndex !=/*Не !==*/ null && 0 <= sheetIndex && sheetIndex < sheetTitles.length ? sheetIndex + 1 : null;
            return options;
         },

         /*$constructor: function () {
         },*/

         init: function () {
            View.superclass.init.apply(this, arguments);
            this._view = this.getChildControlByName('controls-ImportCustomizer-Sheet-View__sheetTitle');
            this._bindEvents();
         },

         _bindEvents: function () {
            this.subscribeTo(this._view, 'onSelectedItemsChange', function (evtName, selecteds, changes) {
               var id = selecteds[0];
               this._options.sheetIndex = id ? id - 1 : -1;
               this.sendCommand('subviewChanged');
            }.bind(this));
         },

         /**
          * Установить указанные настраиваемые значения компонента
          *
          * @public
          * @param {object} values Набор из нескольких значений, которые необходимо изменить
          */
         setValues: function (values) {
            if (!values || typeof values !== 'object') {
               throw new Error('Object required');
            }
            var options = this._options;
            if ('sheetIndex' in values && values.sheetIndex !== options.sheetIndex) {
               options.sheetIndex = values.sheetIndex;
               this._view.setSelectedKeys(values.sheetIndex && values.sheetIndex !== -1 ? [values.sheetIndex] : []);
            }
         },

         /**
          * Получить все настраиваемые значения компонента
          *
          * @public
          * @return {ExportSheetResult}
          */
         getValues: function () {
            return {
               sheetIndex: this._options.sheetIndex
            };
         }
      });

      return View;
   }
);

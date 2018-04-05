/**
 * Контрол "Настройка соответствия соответствия/мэпинга значений настройщика импорта"
 *
 * @public
 * @class SBIS3.CONTROLS/ImportCustomizer/Mapper/View
 * @extends SBIS3.CONTROLS/CompoundControl
 */
define('SBIS3.CONTROLS/ImportCustomizer/Mapper/View',
   [
      'SBIS3.CONTROLS/CompoundControl',
      'tmpl!SBIS3.CONTROLS/ImportCustomizer/Mapper/View',
      'tmpl!SBIS3.CONTROLS/ImportCustomizer/Mapper/tmpl/head',
      'tmpl!SBIS3.CONTROLS/ImportCustomizer/Mapper/tmpl/cell',
      'css!SBIS3.CONTROLS/ImportCustomizer/Mapper/View'
   ],

   function (CompoundControl, dotTplFn) {
      'use strict';

      var View = CompoundControl.extend(/**@lends SBIS3.CONTROLS/ImportCustomizer/Mapper/View.prototype*/ {

         /**
          * @event change Происходит при измении настраиваемые значения компонента
          * @param {Core/EventObject} evtName Дескриптор события
          * @param {object} values Настраиваемые значения компонента:
          * @param {number} values.@@@ @@@
          */

         _dotTplFn: dotTplFn,
         $protected: {
            _options: {
               /**
                * @cfg {string} @@@
                */
               itemColumnTitle: rk('Вид цены в каталоге', 'НастройщикИмпорта'),
               /**
                * @cfg {string} @@@
                */
               variantColumnTitle: rk('Вид цены в файле', 'НастройщикИмпорта'),
               /**
                * @cfg {Array<object>} Список значений для установления соответствия (мэпинга)
                */
               items: [],
               /**
                * @cfg {Array<object>} Список вариантов сопоставления
                */
               variants: []
            },
            _grid: null
         },

         _modifyOptions: function () {
            var options = View.superclass._modifyOptions.apply(this, arguments);
            var inf = this._makeUpdateInfo(options);
            options._columns = inf.columns;
            options._items = inf.items;
            return options;
         },

         $constructor: function () {
            this._publish('change');
         },

         init: function () {
            View.superclass.init.apply(this, arguments);
            this._grid = this.getChildControlByName('controls-ImportCustomizer-Mapper-View__grid');
            this._bindEvents();
         },

         _bindEvents: function () {
            /*^^^this.subscribeTo(this._view, 'onSelectedItemsChange', function (evtName, selecteds, changes) {
               var id = selecteds[0];
               this._options.sheetIndex = id ? id - 1 : -1;
               this._notify('change', this.getValues());
            }.bind(this));*/
         },

         /**
          * Подготовить данные в таблице компонента
          *
          * @protected
          * @param {object} options Опции
          */
         _makeUpdateInfo: function (options) {
            //////////////////////////////////////////////////
            console.log('DBG: IC_Map._makeUpdateInfo: options.items=', options.items, '; options.variants=', options.variants, ';');
            //////////////////////////////////////////////////
            var headTmpl = 'tmpl!SBIS3.CONTROLS/ImportCustomizer/Mapper/tmpl/head';
            var cellTmpl = 'tmpl!SBIS3.CONTROLS/ImportCustomizer/Mapper/tmpl/cell';
            var columns = [
               {field:'num', title:''},
               {field:'item', title:options.itemColumnTitle, headTemplate:headTmpl, cellTemplate:cellTmpl},
               {field:'variant', title:options.variantColumnTitle, headTemplate:headTmpl, cellTemplate:cellTmpl}
            ];
            var items = [
               {num:1, item:'1', variant:'1'},
               {num:2, item:'2', variant:'2'},
               {num:3, item:'3', variant:'3'}
            ];
            return {columns:columns, items:items};
         },

         /**
          * Получить все настраиваемые значения компонента
          *
          * @public
          * @return {object}
          */
         getValues: function () {
            return {
               /*^^^@@@: this._options.@@@*/
            };
         }
      });

      return View;
   }
);

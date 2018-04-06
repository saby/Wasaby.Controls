/**
 * Контрол "Настройка соответствия соответствия/мэпинга значений настройщика импорта"
 *
 * @public
 * @class SBIS3.CONTROLS/ImportCustomizer/Mapper/View
 * @extends SBIS3.CONTROLS/CompoundControl
 */
define('SBIS3.CONTROLS/ImportCustomizer/Mapper/View',
   [
      'Core/helpers/Object/isEqual',
      'SBIS3.CONTROLS/CompoundControl',
      'tmpl!SBIS3.CONTROLS/ImportCustomizer/Mapper/View',
      'tmpl!SBIS3.CONTROLS/ImportCustomizer/Mapper/tmpl/head',
      'tmpl!SBIS3.CONTROLS/ImportCustomizer/Mapper/tmpl/cell',
      'css!SBIS3.CONTROLS/ImportCustomizer/Mapper/View'
   ],

   function (cObjectIsEqual, CompoundControl, dotTplFn) {
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
                * @cfg {object} Набор значений для установления соответствия (мэпинга)
                */
               items: {},
               /**
                * @cfg {object} Набор вариантов сопоставления
                */
               variants: {},
               /**
                * @cfg {ImportTargetFields} ^^^
                */
               fields: null,
               /**
                * @cfg {string} ^^^
                */
               fieldProperty: null
            },
            _grid: null
         },

         _modifyOptions: function () {
            var options = View.superclass._modifyOptions.apply(this, arguments);
            var inf = this._makeUpdateInfo(options);
            options._columns = inf.columns;
            options._rows = inf.rows;
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
          * Подготовить данные ^^^
          *
          * @protected
          * @param {object} options Опции
          * @return {object}
          */
         _makeUpdateInfo: function (options) {
            var headTmpl = 'tmpl!SBIS3.CONTROLS/ImportCustomizer/Mapper/tmpl/head';
            var cellTmpl = 'tmpl!SBIS3.CONTROLS/ImportCustomizer/Mapper/tmpl/cell';
            var menuConf;
            var variants = options.variants;
            if (variants) {
               var variantIds = Object.keys(variants);
               if (variantIds.length) {
                  var menuItems = variantIds.map(function (v) { return {id:v, title:variants[v] || rk('(Без названия)', 'НастройщикИмпорта')}; });
                  menuItems.unshift();
                  menuConf = {
                     namePrefix: 'controls-ImportCustomizer-Mapper-View__grid__item__menu__',
                     items: menuItems
                  };
               }
            }
            var columns = [
               {field:'num', title:''},
               {field:'title', title:options.itemColumnTitle, headTemplate:headTmpl},
               {field:'variant', title:options.variantColumnTitle, headTemplate:headTmpl, cellTemplate:cellTmpl, menuConf:menuConf}
            ];
            var rows = [];
            var fields = options.fields;
            if (fields) {
               var accordances = options.items;
               var hasAccordances = accordances && Object.keys(accordances).length;
               // TODO: fields.items Может быть рекордсетом
               var displayProperty = fields.displayProperty;
               // TODO: options.fieldProperty Может не быть
               var fieldProperty = options.fieldProperty;
               var counter = 0;
               rows = fields.items.reduce(function (r, v) { var id = v[fieldProperty]; if (id) { r.push({num:++counter, id:id, title:v[displayProperty], variant:hasAccordances ? (accordances[id] || null) : null}); }; return r; }, []);
            }
            return {columns:columns, rows:rows};
         },

         /**
          * Установить указанные настраиваемые значения компонента
          *
          * @public
          * @param {object} values Набор из нескольких значений, которые необходимо изменить
          * @param {object} [values.items] ^^^ (опционально)
          * @param {object} [values.variants] ^^^ (опционально)
          * @param {ImportTargetFields} [values.fields] ^^^ (опционально)
          * @param {string} [values.fieldProperty] ^^^ (опционально)
          */
         setValues: function (values) {
            if (!values || typeof values !== 'object') {
               throw new Error('Object required');
            }
            var options = this._options;
            var has = {};
            for (var name in values) {
               switch (name) {
                  case 'items':
                  case 'variants':
                  case 'fields':
                  case 'fieldProperty':
                     break;
                  default:
                     continue;
               }
               var value = values[name];
               if (name === 'fieldProperty' ? value !== options[name] : !cObjectIsEqual(value, options[name])) {
                  has[name] = true;
                  options[name] = value;
               }
            }
            if (has.items || has.variants || has.fields) {
               var inf = this._makeUpdateInfo(options);
               var grid = this._grid;
               grid.setColumns(inf.columns);
               grid.setItems(inf.rows);
            }
         },

         /**
          * Получить все настраиваемые значения компонента
          *
          * @public
          * @return {object}
          */
         getValues: function () {
            var options = this._options;
            return {
               items: options.items/*^^^,
               variants: options.variants,
               fields: options.fields,
               fieldProperty: options.fieldProperty*/
            };
         }
      });

      return View;
   }
);

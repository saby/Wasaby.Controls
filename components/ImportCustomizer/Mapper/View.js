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
          * @typedef {object} ImportMapperItem Тип, содержащий информацию об элементе сопоставления
          * @property {string|number} id Идентификатор элемента
          * @property {string} title Название элемента
          */

         /**
          * @event change Происходит при измении настраиваемые значения компонента
          * @param {Core/EventObject} evtName Дескриптор события
          * @param {object} values Настраиваемые значения компонента:
          * @param {ImportTargetFields} [values.fields]  Полный список полей (опционально)
          * @param {function(object):ImportMapperItem} [values.fieldFilter] Фильтр полей (опционально)
          * @param {string} [values.fieldProperty] Имя специального ключевого свойства (опционально)
          * @param {object} [values.variants] Набор вариантов сопоставления (опционально)
          * @param {object} [values.accordances] Перечень соответствий специальный ключ поля - идентификатор варианта (опционально)
          *
          * @see fields
          * @see fieldFilter
          * @see fieldProperty
          * @see variants
          * @see accordances
          */
         _dotTplFn: dotTplFn,
         $protected: {
            _options: {
               /**
                * @cfg {string} Заголовок колонки целевых элементов сопоставления
                */
               fieldColumnTitle: rk('Вид цены в каталоге', 'НастройщикИмпорта'),
               /**
                * @cfg {string} Заголовок колонки вариантов сопоставления
                */
               variantColumnTitle: rk('Вид цены в файле', 'НастройщикИмпорта'),
               /**
                * @cfg {ImportTargetFields} Полный список полей, из которых будут отбираться нужные, то есть поля, для которых будет проводится сопоставление. Сам отбор определяется опциями {@link fieldFilter} или {@link fieldProperty}
                */
               fields: null,
               /**
                * @cfg {function(object):ImportMapperItem} Фильтр полей, с помощью которого из общего списка полей {@link fields} отбираются нужные. Фильтр принимает объект поля и, если оно нужное, возвращает объект вида {@link ImportMapperItem}. Упрощённый способ отбора предоставляется опцией {@link fieldProperty}
                */
               fieldFilter: null,
               /**
                * @cfg {string} Имя специального ключевого свойства, с помощью которого из общего списка полей {@link fields} отбираются нужные. Каждое нужное поле должно иметь свойство с таким именем. Более комплексный способ отбора предоставляется опцией {@link fieldFilter}
                */
               fieldProperty: null,
               /**
                * @cfg {object} Набор вариантов сопоставления
                */
               variants: {},
               /**
                * @cfg {object} Перечень соответствий специальный ключ поля - идентификатор варианта
                */
               accordances: {}
            },
            _grid: null
         },

         _modifyOptions: function () {
            var options = View.superclass._modifyOptions.apply(this, arguments);
            options._columns = this._makeColumnsInfo(options);
            options._rows = this._makeRowsInfo(options);
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
          * Подготовить данные для построения компонента
          *
          * @protected
          * @param {object} options Опции
          * @return {Array<object>}
          */
         _makeColumnsInfo: function (options) {
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
            return [
               {field:'num', title:''},
               {field:'title', title:options.fieldColumnTitle, headTemplate:headTmpl},
               {field:'variant', title:options.variantColumnTitle, headTemplate:headTmpl, cellTemplate:cellTmpl, menuConf:menuConf}
            ];
         },

         /**
          * Подготовить данные для построения компонента
          *
          * @protected
          * @param {object} options Опции
          * @return {Array<object>}
          */
         _makeRowsInfo: function (options) {
            var rows = [];
            var fields = options.fields;
            if (fields) {
               var accordances = options.accordances;
               var hasAccordances = accordances && Object.keys(accordances).length;
               // TODO: fields.items Может быть рекордсетом
               var displayProperty = fields.displayProperty;
               // TODO: Использовать options.fieldFilter
               // TODO: options.fieldProperty Может не быть
               var fieldProperty = options.fieldProperty;
               var counter = 0;
               rows = fields.items.reduce(function (r, v) { var id = v[fieldProperty]; if (id) { r.push({num:++counter, id:id, title:v[displayProperty], variant:hasAccordances ? (accordances[id] || null) : null}); }; return r; }, []);
            }
            return rows;
         },

         /**
          * Установить указанные настраиваемые значения компонента
          *
          * @public
          * @param {object} values Набор из нескольких значений, которые необходимо изменить
          * @param {ImportTargetFields} [values.fields]  Полный список полей (опционально)
          * @param {function(object):ImportMapperItem} [values.fieldFilter] Фильтр полей (опционально)
          * @param {string} [values.fieldProperty] Имя специального ключевого свойства (опционально)
          * @param {object} [values.variants] Набор вариантов сопоставления (опционально)
          * @param {object} [values.accordances] Перечень соответствий специальный ключ поля - идентификатор варианта (опционально)
          *
          * @see fields
          * @see fieldFilter
          * @see fieldProperty
          * @see variants
          * @see accordances
          */
         setValues: function (values) {
            if (!values || typeof values !== 'object') {
               throw new Error('Object required');
            }
            var options = this._options;
            var has = {};
            for (var name in values) {
               switch (name) {
                  case 'fields':
                  case 'fieldFilter':
                  case 'fieldProperty':
                  case 'variants':
                  case 'accordances':
                     break;
                  default:
                     continue;
               }
               var value = values[name];
               if (name === 'fieldFilter' || name === 'fieldProperty' ? value !== options[name] : !cObjectIsEqual(value, options[name])) {
                  has[name] = true;
                  options[name] = value;
               }
            }
            if (has.fields || has.fieldFilter || has.fieldProperty || has.variants || has.accordances) {
               var grid = this._grid;
               if (has.variants) {
                  grid.setColumns(this._makeColumnsInfo(options));
               }
               grid.setItems(this._makeRowsInfo(options));
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
               fields: options.fields,
               fieldFilter: options.fieldFilter,
               fieldProperty: options.fieldProperty,
               variants: options.variants,
               accordances: options.accordances
            };
         }
      });

      return View;
   }
);

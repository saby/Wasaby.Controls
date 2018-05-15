/**
 * Контрол "Настройка соответствия/мэпинга значений настройщика импорта"
 *
 * @public
 * @class SBIS3.CONTROLS/ImportCustomizer/Mapper/View
 * @extends SBIS3.CONTROLS/CompoundControl
 */
define('SBIS3.CONTROLS/ImportCustomizer/Mapper/View',
   [
      'Core/helpers/Object/isEqual',
      'SBIS3.CONTROLS/CompoundControl',
      'WS.Data/Collection/RecordSet',
      'tmpl!SBIS3.CONTROLS/ImportCustomizer/Mapper/View',
      'tmpl!SBIS3.CONTROLS/ImportCustomizer/Mapper/tmpl/head',
      'tmpl!SBIS3.CONTROLS/ImportCustomizer/Mapper/tmpl/cell',
      'css!SBIS3.CONTROLS/ImportCustomizer/Mapper/View'
   ],

   function (cObjectIsEqual, CompoundControl, RecordSet, dotTplFn) {
      'use strict';

      /**
       * Константа (как бы) префикс имён дропдаунов для выбора вариантов
       * @type {string}
       * @private
       */
      var _PREFIX_VARIANT_NAME = 'controls-ImportCustomizer-Mapper-View__grid__item__menu__';

      var View = CompoundControl.extend(/**@lends SBIS3.CONTROLS/ImportCustomizer/Mapper/View.prototype*/ {

         /**
          * @typedef {object} ImportSimpleItem Тип, содержащий информацию об элементе сопоставления
          * @property {string|number} id Идентификатор элемента
          * @property {string} title Название элемента
          */

         /**
          * @typedef {object} ExportMapperResult Тип, описывающий возвращаемые настраиваемые значения компонента
          * @property {ImportTargetFields} [fields]  Полный список полей (опционально)
          * @property {function(object|WS.Data/Entity/Record):ImportSimpleItem} [fieldFilter] Фильтр полей (опционально)
          * @property {string} [fieldProperty] Имя специального ключевого свойства (опционально)
          * @property {object} [variants] Набор вариантов сопоставления (опционально)
          * @property {object} [mapping] Перечень соответствий специальный ключ поля - идентификатор варианта (опционально)
          *
          * @see fields
          * @see fieldFilter
          * @see fieldProperty
          * @see variants
          * @see mapping
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
                * @cfg {function(object|WS.Data/Entity/Record):ImportSimpleItem} Фильтр полей, с помощью которого из общего списка полей {@link fields} отбираются нужные. Фильтр принимает объект поля и, если оно нужное, возвращает объект вида {@link ImportSimpleItem}. Упрощённый способ отбора предоставляется опцией {@link fieldProperty}
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
               mapping: {}
            },
            _grid: null
         },

         _modifyOptions: function () {
            var options = View.superclass._modifyOptions.apply(this, arguments);
            options._columns = this._makeColumnsInfo(options);
            options._rows = this._makeRowsInfo(options);
            return options;
         },

         /*$constructor: function () {
         },*/

         init: function () {
            View.superclass.init.apply(this, arguments);
            this._grid = this.getChildControlByName('controls-ImportCustomizer-Mapper-View__grid');
            this._bindEvents();
         },

         _bindEvents: function () {
            for (var i = 0, list = this.getChildControls(), handler; i < list.length; i++) {
               var cmp = list[i];
               if (cmp.getName().substring(0, _PREFIX_VARIANT_NAME.length) === _PREFIX_VARIANT_NAME) {
                  this.subscribeTo(cmp, 'onSelectedItemsChange', handler = handler || this._onChangeVariant.bind(this));
               }
            }
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
                  var self = this;
                  menuConf = {
                     namePrefix: _PREFIX_VARIANT_NAME,
                     items: menuItems,
                     handlers: this._options ? {
                        onSelectedItemsChange: this._onChangeVariant.bind(this)
                     } : null
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
               var isRecordset = fields.items instanceof RecordSet;
               var mapping = options.mapping;
               var hasMapping = mapping && Object.keys(mapping).length;
               var displayProperty = fields.displayProperty;
               var fieldFilter = options.fieldFilter;
               if (!fieldFilter) {
                  var fieldProperty = options.fieldProperty;
                  if (!fieldProperty) {
                     throw new Error('No fieldFilter and no fieldProperty');
                  }
                  fieldFilter = _defaultFieldFilter.bind(null, fieldProperty, fields.displayProperty, isRecordset);
               }
               var counter = 0;
               fields.items[isRecordset ? 'each' : 'forEach'](function (value) {
                  var item = fieldFilter(value);
                  if (item) {
                     item.num = ++counter;
                     item.variant = hasMapping ? (mapping[item.id] || null) : null;
                     rows.push(item);
                  };
               });
            }
            return rows;
         },

         /**
          * Константа (как бы) префикс имён дропдаунов для выбора вариантов
          *
          * @protected
          * @param {Core/EventObject} evtName Дескриптор события
          * @param {Array<string|number>} selectedIds Список выбранных идентификаторов
          * @param {object} changes Дескриптор Подробные данные об изменениях
          */
         _onChangeVariant: function (evtName, selectedIds, changes) {
            var variantId = selectedIds[0];
            var fieldId = evtName.getTarget().getName().substring(_PREFIX_VARIANT_NAME.length);
            var options = this._options;
            var mapping = options.mapping;
            if (variantId) {
               mapping[fieldId] = variantId;
            }
            else {
               delete mapping[fieldId];
            }
            this.sendCommand('subviewChanged');
         },

         /**
          * Установить указанные настраиваемые значения компонента
          *
          * @public
          * @param {object} values Набор из нескольких значений, которые необходимо изменить
          * @param {ImportTargetFields} [values.fields]  Полный список полей (опционально)
          * @param {function(object|WS.Data/Entity/Record):ImportSimpleItem} [values.fieldFilter] Фильтр полей (опционально)
          * @param {string} [values.fieldProperty] Имя специального ключевого свойства (опционально)
          * @param {object} [values.variants] Набор вариантов сопоставления (опционально)
          * @param {object} [values.mapping] Перечень соответствий специальный ключ поля - идентификатор варианта (опционально)
          *
          * @see fields
          * @see fieldFilter
          * @see fieldProperty
          * @see variants
          * @see mapping
          */
         setValues: function (values) {
            if (!values || typeof values !== 'object') {
               throw new Error('Object required');
            }
            var options = this._options;
            var fieldsBefore = !!options.fields;
            var waited = {fields:true, fieldFilter:false, fieldProperty:false, variants:true, mapping:true};
            var has = {};
            for (var name in values) {
               if (name in waited) {
                  var value = values[name];
                  if (waited[name] ? !cObjectIsEqual(value, options[name]) : value !== options[name]) {
                     has[name] = true;
                     options[name] = value;
                  }
               }
            }
            if (has.fields || has.fieldFilter || has.fieldProperty || has.variants || has.mapping) {
               var grid = this._grid;
               if (has.variants || !fieldsBefore) {
                  grid.setColumns(this._makeColumnsInfo(options));
               }
               grid.setItems(this._makeRowsInfo(options));
            }
         },

         /**
          * Получить все настраиваемые значения компонента
          *
          * @public
          * @return {ExportMapperResult}
          */
         getValues: function () {
            var options = this._options;
            return {
               fields: options.fields,
               fieldFilter: options.fieldFilter,
               fieldProperty: options.fieldProperty,
               variants: options.variants,
               mapping: options.mapping
            };
         }
      });



      // Private methods

      /**
       * Функция, порождающая фильтр полей по умолчанию (после привязки первых аргументов)
       *
       * @private
       * @param {string} fieldProperty Имя специального ключевого свойства поля
       * @param {string} displayProperty Имя свойства поля для отображения
       * @param {boolean} isRecord Значение value является рекордсетом
       * @param {object|WS.Data/Entity/Record} value Поле для фильтрации
       * @return {ImportSimpleItem}
       */
      var _defaultFieldFilter = function (fieldProperty, displayProperty, isRecord, value) {
         var id = isRecord ? value.get(fieldProperty) : value[fieldProperty];
         return id ? {id:id, title:isRecord ? value.get(displayProperty) : value[displayProperty]} : null;
      };



      return View;
   }
);

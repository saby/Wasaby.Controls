/**
 * Контрол "Настройка параметров провайдера парсинга настройщика импорта"
 *
 * @public
 * @class SBIS3.CONTROLS/ImportCustomizer/ProviderArgs/View
 * @extends SBIS3.CONTROLS/CompoundControl
 */
define('SBIS3.CONTROLS/ImportCustomizer/ProviderArgs/View',
   [
      'Core/helpers/Object/isEqual',
      'SBIS3.CONTROLS/CompoundControl',
      'tmpl!SBIS3.CONTROLS/ImportCustomizer/ProviderArgs/View',
      'css!SBIS3.CONTROLS/ImportCustomizer/ProviderArgs/View'
   ],

   function (cObjectIsEqual, CompoundControl, dotTplFn) {
      'use strict';

      var View = CompoundControl.extend(/**@lends SBIS3.CONTROLS/ImportCustomizer/ProviderArgs/View.prototype*/ {

         /**
          * @typedef {object} ExportProviderArgsResult Тип, описывающий возвращаемые настраиваемые значения компонента
          * @property {number} columnCount Количество имеющихся колонок
          * @property {Array<number>} columns Список индексов колонок, задающих иерархию разделов импортируемых данных
          * @property {string} hierarchyName Имя поля, хранящего иерархию
          * @property {string} hierarchyField Имя поля, хранящего иерархию
          *
          * @see columnCount
          * @see columns
          * @see hierarchyName
          * @see hierarchyField
          */

         _dotTplFn: dotTplFn,
         $protected: {
            _options: {
               /**
                * @cfg {number} Количество имеющихся колонок
                */
               columnCount: 0,
               /**
                * @cfg {Array<number>} Список индексов колонок, задающих иерархию разделов импортируемых данных
                */
               columns: [],
               /**
                * @cfg {string} Имя поля, хранящего иерархию
                */
               hierarchyName: null,
               /**
                * @cfg {string} Имя поля, хранящего иерархию
                */
               hierarchyField: null
            },
            // Ссылки на вложенные компоненты
            _views: []
         },

         _modifyOptions: function () {
            var options = View.superclass._modifyOptions.apply(this, arguments);
            var inf = this._makeDropdownInfo(options);
            options._items = inf.items;
            options._selectedIds = inf.selectedIds;
            return options;
         },

         /*$constructor: function () {
         },*/

         init: function () {
            View.superclass.init.apply(this, arguments);
            var prefix = 'controls-ImportCustomizer-ProviderArgs-View__column__dropdown__c';
            for (var i = 0, len = this._options.columnCount; i < len; i++) {
               this._views.push(this.getChildControlByName(prefix + (i + 1)));
            }
            this._bindEvents();
         },

         _bindEvents: function () {
            for (var i = 0, views = this._views; i < views.length; i++) {
               this.subscribeTo(views[i], 'onSelectedItemsChange', this._onMenu.bind(this, i));
            }
         },

         /**
          * Подготовить данные для дропдаунов выбора разделов
          *
          * @protected
          * @param {object} options Опции
          * @return {object}
          */
         _makeDropdownInfo: function (options) {
            var items = [];
            var selectedIds = [];
            var columnCount = options.columnCount;
            var sectionColumns = options.columns;
            if (0 < columnCount) {
               items.push({id:'', title:rk('Не задано', 'НастройщикИмпорта')});
               var title1 = rk('Раздел', 'НастройщикИмпорта') + ' ';
               var title2 = rk('Подраздел', 'НастройщикИмпорта') + ' ';
               var title3 = rk('Подраздел (ур. %d)', 'НастройщикИмпорта') + ' ';
               var has = !!sectionColumns.length;
               for (var i = 0; i < columnCount - 1; i++) {
                  items.push({id:i + 1, title:i == 0 ? title1 : (i == 1 ? title2 : title3.replace('%d', i))});
                  if (has) {
                     var j = sectionColumns.indexOf(i);
                     selectedIds.push(j !== -1 ? [j + 1] : undefined);
                  }
               }
            }
            return {items:items, selectedIds:selectedIds};
         },

         /**
          * Обработчик события при выборе разделов
          *
          * @protected
          * @param {number} columnIndex Индекс колонки
          * @param {Core/EventObject} evtName Денскриптор события
          * @param {Array<string>} selecteds Список идентификаторов выбранных значений
          * @param {object} changes Информация об изменениях
          */
         _onMenu: function (columnIndex, evtName, selecteds, changes) {
            var id = selecteds[0];
            var cols = this._options.columns;
            // Если текущая колонка уже была представлена в списке разделов
            var prevLevel = cols.indexOf(columnIndex);
            if (prevLevel !== -1) {
               // то убрать её из списка
               cols[prevLevel] = undefined;
            }
            if (id) {
               // Выбраный уровень раздела
               var level = id - 1;
               // Если этот уровень разделов уже занят другой колонкой
               var prevColumnIndex = cols[level];
               if (prevColumnIndex !== undefined) {
                  // то сбросить выделение у дропдауна этой колонки
                  this._views[prevColumnIndex].setSelectedKeys([]);
               }
               // И зафиксировать текущую колонку на данном уровне разделов
               cols[level] = columnIndex;
               if (level < prevLevel) {
                  // Если предыдущий уровнеь был больще текущего, то при очистке в конце списка накопились значения undefined - убрать их
                  for (var last = cols.length - 1, i = last; 0 <= i; i--) {
                     if (cols[i] !== undefined) {
                        if (i !== last) {
                           cols.splice(i + 1, last - i);
                        }
                        break;
                     }
                  }
               }
            }
            this.sendCommand('subviewChanged');
         },

         /**
          * Установить указанные настраиваемые значения компонента
          *
          * @public
          * @param {object} values Набор из нескольких значений, которые необходимо изменить
          * @param {number} [values.columnCount] Количество имеющихся колонок (опционально)
          * @param {Array<number>} [values.columns] Список индексов колонок, задающих иерархию импортируемых данных (опционально)
          * @param {string} [values.hierarchyName] Имя поля, хранящего иерархию (опционально)
          * @param {string} [values.hierarchyField] Имя поля, хранящего иерархию (опционально)
          */
         setValues: function (values) {
            if (!values || typeof values !== 'object') {
               throw new Error('Object required');
            }
            var options = this._options;
            var waited = {columnCount:false, columns:true, hierarchyName:false, hierarchyField:false};
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
            if (has.columnCount) {
               //^^^var inf = this._makeDropdownInfo(options);
            }
            else
            if (has.columns) {
               for (var i = 0, len = options.columnCount, cols = options.columns; i < len; i++) {
                  var j = cols.indexOf(i);
                  this._views[i].setSelectedKeys(j !== -1 ? [j + 1] : []);
               }
            }
         },

         /**
          * Получить все настраиваемые значения компонента
          *
          * @public
          * @return {ExportProviderArgsResult}
          */
         getValues: function () {
            var options = this._options;
            return {
               columnCount: options.columnCount,
               columns: options.columns.slice(),
               hierarchyName: options.hierarchyName,
               hierarchyField: options.hierarchyField
            };
         }
      });

      return View;
   }
);

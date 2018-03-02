/**
 * Контрол "Привязка колонок настройщика импорта"
 *
 * @public
 * @class SBIS3.CONTROLS/ImportCustomizer/ColumnBinding/View
 * @extends SBIS3.CONTROLS/CompoundControl
 */
define('SBIS3.CONTROLS/ImportCustomizer/ColumnBinding/View',
   [
      'Core/helpers/Object/isEqual',
      'SBIS3.CONTROLS/CompoundControl',
      'WS.Data/Collection/RecordSet',
      'tmpl!SBIS3.CONTROLS/ImportCustomizer/ColumnBinding/View',
      'tmpl!SBIS3.CONTROLS/ImportCustomizer/ColumnBinding/tmpl/head',
      'tmpl!SBIS3.CONTROLS/ImportCustomizer/ColumnBinding/tmpl/cell',
      'css!SBIS3.CONTROLS/ImportCustomizer/ColumnBinding/View'
   ],

   function (cObjectIsEqual, CompoundControl, RecordSet, dotTplFn) {
      'use strict';

      /**
       * Константа (как бы) префикс для формирования свойства field колонок
       * @type {string}
       * @private
       */
      var _PREFIX_COLUMN_FIELD = 'c';
      /**
       * Константа (как бы) префиксов для формирования имён контролов в колонках (для выбора соответсвия колонок полям)
       * @type {string}
       * @private
       */
      var _PREFIX_COLUMN_NAME = 'controls-ImportCustomizer-ColumnBinding-View__grid__column__menu__';
      /**
       * Константа (как бы) имя css-класса для осветлённых (неимпортируемых) рядов данных
       * @type {string}
       * @private
       */
      var _CLASS_LIGHT_ROW = 'controls-ImportCustomizer-ColumnBinding-View__grid__item-light';



      var View = CompoundControl.extend(/**@lends SBIS3.CONTROLS/ImportCustomizer/ColumnBinding/View.prototype*/ {

         /**
          * @typedef {object} ImportTargetFields Тип, описывающий целевые поля для привязки импортируемых данных
          * @property {object[]|WS.Data/Collection/RecordSet} items Список объектов, представляющих данные об одном поле. Каждый из них должен
          *                            содержать идентификатор поля, отображаемое наименование поля и идентификатор родителя, если необходимо. Имена
          *                            свойств задаются явно в этом же определинии типе
          * @property {string} [idProperty] Имя свойства, содержащего идентификатор (опционально, если items представлен рекордсетом)
          * @property {string} displayProperty Имя свойства, содержащего отображаемое наименование
          * @property {string} [parentProperty] Имя свойства, содержащего идентификатор родителя (опционально)
          */

         /**
          * @event change Происходит при измении настраиваемые значения компонента
          * @param {Core/EventObject} evtName Дескриптор события
          * @param {object} values Настраиваемые значения компонента:
          * @param {object} values.accordances Перечень соответствий идентификатор поля - индекс колонки
          * @param {number} values.skippedRows Количество пропускаемых строк в начале
          */

         _dotTplFn: dotTplFn,
         $protected: {
            _options: {
               /**
                * @cfg {string} Заголовок для меню выбора соответсвия в колонках
                */
               columnCaption: rk('Не используется', 'НастройщикИмпорта'),
               /**
                * @cfg {string} Всплывающая подсказака в заголовке колонки
                */
               columnTitle: rk('Колонка', 'НастройщикИмпорта'),
               /**
                * @cfg {any[][]} Данные таблицы, массив массивов равной длины (по количеству столбцов)
                */
               rows: [],
               /**
                * @cfg {ImportTargetFields} Полный список полей, к которым должны быть привязаны импортируемые данные
                */
               fields: null,
               /**
                * @cfg {number} Количество пропускаемых строк в начале
                */
               skippedRows: 0
            },
            _grid: null,
            // Перечень соответствий идентификатор поля - индекс колонки
            _accordances: null
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
            this._grid = this.getChildControlByName('controls-ImportCustomizer-ColumnBinding-View__grid');
            this._accordances = {};
            this._bindEvents();
         },

         _bindEvents: function () {
            this.subscribeTo(this._grid, 'onItemClick'/*onItemActivate*/, function (evtName, id, model) {
               this._options.skippedRows = this._grid.getItems().getIndex(model);
               this._updateSkippedRows();
               this._notify('change', this.getValues());
            }.bind(this));

            for (var i = 0, list = this._grid.getChildControls(), prefix = _PREFIX_COLUMN_NAME + _PREFIX_COLUMN_FIELD; i < list.length; i++) {
               var cmp = list[i];
               if (cmp.getName().substring(0, prefix.length) === prefix) {
                  //this.subscribeTo(cmp, 'onActivated', this._onColumnMenu.bind(this));
                  this.subscribeTo(cmp, 'onMenuItemActivate', this._onColumnMenu.bind(this));
               }
            }
         },

         /**
          * Обновить отображение пропущенных строк в таблице
          *
          * @protected
          */
         _updateSkippedRows: function () {
            var $items = this._grid.getContainer().find('.controls-ListView__item');
            var index = this._options.skippedRows;
            var selector = '.controls-ImportCustomizer-ColumnBinding-View__grid__item__cell';
            $items.slice(index).find(selector).removeClass(_CLASS_LIGHT_ROW);
            $items.slice(0, index).find(selector).addClass(_CLASS_LIGHT_ROW);
         },

         /**
          * Установить указанные настраиваемые значения компонента
          *
          * @public
          * @param {object} values Набор из нескольких значений, которые необходимо изменить
          * @param {any[][]} [values.rows] Данные таблицы, массив массивов равной длины (по количеству столбцов) (опционально)
          * @param {ImportTargetFields} [values.fields] Полный список полей, к которым должны быть привязаны импортируемые данные (опционально)
          * @param {number} [values.skippedRows] Количество пропускаемых строк в начале (опционально)
          * @param {object} [values.accordances] Перечень соответствий идентификатор поля - индекс колонки (опционально)
          */
         setValues: function (values) {
            if (!values || typeof values !== 'object') {
               throw new Error('Object required');
            }
            var has = {};
            var options = this._options;
            for (var name in values) {
               switch (name) {
                  case 'rows':
                  case 'fields':
                  case 'skippedRows':
                  case 'accordances':
                     break;
                  default:
                     continue;
               }
               var value = values[name];
               if (name === 'skippedRows' ? value !== options[name] : !cObjectIsEqual(value, options[name])) {
                  has[name] = true;
                  options[name] = value;
               }
            }
            if (has.rows || has.fields) {
               var inf = this._makeUpdateInfo(options);
               this._grid.setColumns(inf.columns);
               this._grid.setItems(inf.items);
               this._accordances = {};//^^^
            }
            else
            if (has.skippedRows) {
               this._updateSkippedRows();
            }
         },

         /**
          * Подготовить данные в таблице компонента
          *
          * @protected
          * @param {object} options Опции
          */
         _makeUpdateInfo: function (options) {
            // Метод может вызывается из _modifyOptions, когда компонент ещё не инициализирован, поэтому требует опции в явном виде. Также,
            // использование this возможно только после инициализации компонента
            var rows = options.rows;
            if (!Array.isArray(rows) || (rows.length && rows.some(function (v) { return !Array.isArray(v) || !v.length; }))) {
               throw new Error('Array of rows required');
            }
            if (rows.length) {
               var len = rows[0].length;
               if (rows.some(function (v) { return v.length !== len; })) {
                  throw new Error('Not equals row lengths');
               }
            }
            //TODO: А хорошо бы проверить options.fields на соответсвие ImportTargetFields...
            var rowItems = [];
            if (rows.length) {
               var headTmpl = 'tmpl!SBIS3.CONTROLS/ImportCustomizer/ColumnBinding/tmpl/head';
               var cellTmpl = 'tmpl!SBIS3.CONTROLS/ImportCustomizer/ColumnBinding/tmpl/cell';
               var fields = options.fields;
               var isRecordSet = fields.items instanceof RecordSet;
               var idProperty = fields.idProperty || (isRecordSet ? fields.items.getIdProperty() : undefined);
               var displayProperty = fields.displayProperty;
               var parentProperty = fields.parentProperty;
               var menuItems;
               if (parentProperty) {
                  // Если поля организованы иерархически, то нужно создать новые данные для пунктов меню и пометить наличие подпунктов
                  var props = [idProperty, displayProperty, parentProperty];
                  if (isRecordSet) {
                     menuItems = [];
                     fields.items.each(function (record) {
                        menuItems.push(props.reduce(function (r, p) { r[p] = record.get(p); return r; }, {}));
                     });
                  }
                  else {
                     menuItems = fields.items.map(function (field) {
                        return props.reduce(function (r, p) { r[p] = field[p]; return r; }, {});
                     });
                  }
                  var parents = [];
                  for (var i = 0; i < menuItems.length; i++) {
                     var p = menuItems[i][parentProperty];
                     if (p && parents.indexOf(p) === -1) {
                        parents.push(p);
                     }
                  }
                  for (var i = 0; i < menuItems.length; i++) {
                     var item = menuItems[i];
                     if (parents.indexOf(item[idProperty]) !== -1) {
                        item.hasSub = true;
                     }
                  }
               }
               else {
                  // А если поля организованы плоско, то возьмём их как есть
                  menuItems = fields.items
               }
               var menuConf = {
                  items: menuItems,
                  idProperty: idProperty,
                  displayProperty: displayProperty,
                  parentProperty: parentProperty,
                  namePrefix: _PREFIX_COLUMN_NAME,
                  caption: options.columnCaption
               };
               // Если компонентр уже инициализирован, то можно задать обработчики событий прямо здесь
               if (this.isInitialized()) {
                  menuConf.handlers = {
                     //onActivated: this._onColumnMenu.bind(this),
                     onMenuItemActivate: this._onColumnMenu.bind(this)
                  }
               }
               var title = options.columnTitle;
               var skippedRows = 0 < options.skippedRows ? options.skippedRows : 0;
               var columns = rows[0].map(function (v, i) { return {field:_PREFIX_COLUMN_FIELD + (i + 1), title:title + ' ' + (i + 1), headTemplate:headTmpl, cellTemplate:cellTmpl, menuConf:menuConf}; });
               columns.unshift({field:'id', title:''});
               for (var j = 0; j < rows.length; j++) {
                  rowItems.push(rows[j].reduce(function (r, v, i) { r[_PREFIX_COLUMN_FIELD + (i + 1)] = v; return r; }, {id:j + 1, className:j < skippedRows ? _CLASS_LIGHT_ROW : undefined}));
               }
            }
            return {columns:columns, items:rowItems};
         },

         /**
          * Обработчик события
          *
          * @protected
          * @param {Core/EventObject} evtName Денскриптор события
          * @param {string|number} selectedField Идентификатор выбранного пункта
          */
         _onColumnMenu: function (evtName, selectedField) {
            var menu = evtName.getTarget();
            var hasSub = menu.getItems().getRecordById(selectedField).get('hasSub');
            // Только если это не пункт, имеющий вложенные подпункты
            if (!hasSub) {
               var cssClass = 'controls-ImportCustomizer-ColumnBinding-View__grid__column__menu__picker__selected';
               var picker = menu.getPicker();
               var columnIndex = +menu.getName().substring(_PREFIX_COLUMN_NAME.length + _PREFIX_COLUMN_FIELD.length) - 1;
               var accordances = this._accordances;
               var prevIndex = accordances[selectedField];
               // Если это поле уже было выбрано в другом столбце
               if (0 <= prevIndex) {
                  // Получить предыдущее меню
                  var prevMenu = this.getChildControlByName(_PREFIX_COLUMN_NAME + _PREFIX_COLUMN_FIELD + (prevIndex + 1));
                  // Убрать класс выделения и сбросить заголовок
                  prevMenu.getPicker().getItemInstance(selectedField).getContainer().removeClass(cssClass);
                  prevMenu.setCaption(this._options.columnCaption);
               }
               var prevField; Object.keys(accordances).some(function (v) { if (accordances[v] === columnIndex) { prevField = v; return true; } }.bind(this));
               // Если в этом столбце уже было выбрано поле
               if (prevField) {
                  // Убрать класс выделения
                  picker.getItemInstance(prevField).getContainer().removeClass(cssClass);
                  // Сбросить соответсвие поля колонке
                  delete accordances[prevField];
               }
               // Добавить класс выделения, установить заголовок
               var menuItemInstance = picker.getItemInstance(selectedField);
               menuItemInstance.getContainer().addClass(cssClass);
               menu.setCaption(menuItemInstance.getCaption());
               // Зафиксировать соответсвие поля колонке
               accordances[selectedField] = columnIndex;
               this._notify('change', this.getValues());
            }
         },

         /**
          * Получить все настраиваемые значения компонента
          *
          * @public
          * @return {object}
          */
         getValues: function () {
            return {
               accordances: ObjectAssign({}, this._accordances),
               skippedRows: this._options.skippedRows
            };
         }
      });

      var ObjectAssign = Object.assign || function(d){return[].slice.call(arguments,1).reduce(function(r,s){return Object.keys(s).reduce(function(o,n){o[n]=s[n];return o},r)},d)};

      return View;
   }
);

/**
 * Контрол "Привязка колонок настройщика импорта"
 *
 * @public
 * @class SBIS3.CONTROLS/ImportCustomizer/ColumnBinding/View
 * @extends SBIS3.CONTROLS/CompoundControl
 */
define('SBIS3.CONTROLS/ImportCustomizer/ColumnBinding/View',
   [
      'Core/core-merge',
      'SBIS3.CONTROLS/CompoundControl',
      'SBIS3.CONTROLS/Utils/ObjectChange',
      'WS.Data/Collection/RecordSet',
      'tmpl!SBIS3.CONTROLS/ImportCustomizer/ColumnBinding/View',
      'tmpl!SBIS3.CONTROLS/ImportCustomizer/ColumnBinding/tmpl/head',
      'tmpl!SBIS3.CONTROLS/ImportCustomizer/ColumnBinding/tmpl/cell',
      'css!SBIS3.CONTROLS/ImportCustomizer/ColumnBinding/View'
   ],

   function (cMerge, CompoundControl, objectChange, RecordSet, dotTplFn) {
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
       * Константа (как бы) имя css-класса для осветлённых (неимпортируемых) колонок данных (будет установлен непосредственно на td таблицы)
       * @type {string}
       * @private
       */
      var _CLASS_LIGHT_COLUMN = 'controls-ImportCustomizer-ColumnBinding-View__grid__column-light';
      /**
       * Константа (как бы) имя css-класса для осветлённых (неимпортируемых) рядов данных (будет установлен на элементе td > div > span в таблице)
       * @type {string}
       * @private
       */
      var _CLASS_LIGHT_ROW = 'controls-ImportCustomizer-ColumnBinding-View__grid__item-light';
      /**
       * Константа (как бы) имя css-класса для маркирования выделенных пунктов дропдаунов колонок
       * @type {string}
       * @private
       */
      var _CLASS_MENU_SELECTED = 'controls-ImportCustomizer-ColumnBinding-View__grid__column__menu__picker__selected';
      /**
       * Константа (как бы) имя css-класса для маркирования пустых пунктов дропдаунов колонок
       * @type {string}
       * @private
       */
      var _CLASS_MENU_EMPTY = 'controls-ImportCustomizer-ColumnBinding-View__grid__column__menu__picker__empty';
      /**
       * Константа (как бы) идентификатор для пустых пунктов дропдаунов колонок
       * @type {string}
       * @private
       */
      var _ID_MENU_EMPTY = ':';



      var View = CompoundControl.extend(/**@lends SBIS3.CONTROLS/ImportCustomizer/ColumnBinding/View.prototype*/ {

         /**
          * @typedef {object} ImportTargetFields Тип, описывающий целевые поля для привязки импортируемых данных
          * @property {Array<object>|WS.Data/Collection/RecordSet} items Список объектов, представляющих данные об одном поле. Каждый из них должен
          *                            содержать идентификатор поля, отображаемое наименование поля и идентификатор родителя, если необходимо. Имена
          *                            свойств задаются явно в этом же определинии типе
          * @property {string} [idProperty] Имя свойства, содержащего идентификатор (опционально, если items представлен рекордсетом)
          * @property {string} displayProperty Имя свойства, содержащего отображаемое наименование
          * @property {string} [parentProperty] Имя свойства, содержащего идентификатор родителя (опционально)
          */

         /**
          * @typedef {object} ExportColumnBindingResult Тип, описывающий возвращаемые настраиваемые значения компонента
          * @property {object} mapping Перечень соответствий идентификатор поля - индекс колонки
          * @property {number} skippedRows Количество пропускаемых строк в начале
          *
          * @see mapping
          * @see skippedRows
          */

         _dotTplFn: dotTplFn,
         $protected: {
            _options: {
               /**
                * @cfg {string} Заголовок для меню выбора соответсвия в колонках
                */
               menuTitle: rk('Не используется', 'НастройщикИмпорта'),
               /**
                * @cfg {string} Всплывающая подсказака в заголовке колонки
                */
               headTitle: rk('Колонка', 'НастройщикИмпорта'),
               /**
                * @cfg {Array<Array<string>>} Данные таблицы, массив массивов равной длины (по количеству колонок)
                */
               rows: [],
               /**
                * @cfg {ImportTargetFields} Полный список полей, к которым должны быть привязаны импортируемые данные
                */
               fields: null,
               /**
                * @cfg {object} Перечень соответствий идентификатор поля - индекс колонки
                */
               mapping: {},
               /**
                * @cfg {number} Количество пропускаемых строк в начале
                */
               skippedRows: 0
            },
            _grid: null
         },

         _modifyOptions: function () {
            var options = View.superclass._modifyOptions.apply(this, arguments);
            options.mapping = options.mapping || {};
            options.skippedRows = 0 < options.skippedRows ? options.skippedRows : 0;
            var inf = this._makeUpdateInfo(options);
            options._columns = inf.columns;
            options._rows = inf.rows;
            return options;
         },

         /*$constructor: function () {
         },*/

         init: function () {
            View.superclass.init.apply(this, arguments);
            this._grid = this.getChildControlByName('controls-ImportCustomizer-ColumnBinding-View__grid');
            this._bindEvents();
         },

         _bindEvents: function () {
            this.subscribeTo(this._grid, 'onItemClick'/*onItemActivate*/, function (evtName, id, model) {
               this._options.skippedRows = this._grid.getItems().getIndex(model);
               this._updateSkippedRows();
               this.sendCommand('subviewChanged');
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
          * @param {Array<Array<string>>} [values.rows] Данные таблицы, массив массивов равной длины (по количеству колонок) (опционально)
          * @param {ImportTargetFields} [values.fields] Полный список полей, к которым должны быть привязаны импортируемые данные (опционально)
          * @param {number} [values.skippedRows] Количество пропускаемых строк в начале (опционально)
          * @param {object} [values.mapping] Перечень соответствий идентификатор поля - индекс колонки (опционально)
          */
         setValues: function (values) {
            if (!values || typeof values !== 'object') {
               throw new Error('Object required');
            }
            if ('mapping' in values && !values.mapping) {
               values.mapping = {};
            }
            if ('skippedRows' in values && !(0 < values.skippedRows)) {
               values.skippedRows = 0;
            }
            var options = this._options;
            var changes = objectChange(options, values, {rows:true, fields:true, mapping:true, skippedRows:false});
            if (changes) {
               var grid = this._grid;
               if ('rows' in changes || 'fields' in changes) {
                  if (!('mapping' in changes) && !('mapping' in values)) {
                     options.mapping = {};
                  }
                  var inf = this._makeUpdateInfo(options);
                  grid.setColumns(inf.columns);
                  grid.setItems(inf.rows);
               }
               else {
                  if (!('mapping' in changes)) {
                     options.mapping = {};
                  }
                  if ('skippedRows' in changes) {
                     this._updateSkippedRows();
                  }
                  if ('mapping' in changes && options.fields) {
                     var rows = options.rows;
                     var len = rows && rows.length ? rows[0].length : 0;
                     if (len) {
                        var mapping = options.mapping;
                        var prevMenuIds = Object.keys(prevMapping).reduce(function (r, v) { r[prevMapping[v]] = v; return r; }, []);
                        var menuIds = Object.keys(mapping).reduce(function (r, v) { r[mapping[v]] = v; return r; }, []);
                        for (var i = 0; i < len; i++) {
                           this._changeMenuSelection(grid.getChildControlByName(_PREFIX_COLUMN_NAME + _PREFIX_COLUMN_FIELD + (i + 1)), menuIds[i] || _ID_MENU_EMPTY, prevMenuIds[i] || _ID_MENU_EMPTY);
                        }
                     }
                  }
               }
            }
         },

         /**
          * Подготовить данные в таблице компонента
          *
          * @protected
          * @param {object} options Опции
          * @return {object}
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
            var rowItems = [];
            if (rows.length) {
               var headTmpl = 'tmpl!SBIS3.CONTROLS/ImportCustomizer/ColumnBinding/tmpl/head';
               var cellTmpl = 'tmpl!SBIS3.CONTROLS/ImportCustomizer/ColumnBinding/tmpl/cell';
               var menuConf;
               var menuCaptions;
               var menuIds;
               var menuItems;
               var fields = options.fields;
               if (fields) {
                  var isRecordSet = fields.items instanceof RecordSet;
                  var idProperty = fields.idProperty || (isRecordSet ? fields.items.getIdProperty() : undefined);
                  var displayProperty = fields.displayProperty;
                  var parentProperty = fields.parentProperty;
                  var mapping = options.mapping;
                  menuIds = Object.keys(mapping).reduce(function (r, v) { r[mapping[v]] = v; return r; }, []);
                  var commonMenuItems;
                  if (parentProperty) {
                     // Если поля организованы иерархически, то нужно создать новые данные для пунктов меню и пометить наличие подпунктов
                     var props = [idProperty, displayProperty, parentProperty];
                     if (isRecordSet) {
                        commonMenuItems = [];
                        fields.items.each(function (record) {
                           commonMenuItems.push(props.reduce(function (r, p) { r[p] = record.get(p); return r; }, {}));
                        });
                     }
                     else {
                        commonMenuItems = fields.items.map(function (field) {
                           return props.reduce(function (r, p) { var v = field[p]; r[p] = v !== undefined ? v : null; return r; }, {});
                        });
                     }
                     var parents = [];
                     for (var i = 0; i < commonMenuItems.length; i++) {
                        var p = commonMenuItems[i][parentProperty];
                        if (p && parents.indexOf(p) === -1) {
                           parents.push(p);
                        }
                     }
                     for (var i = 0; i < commonMenuItems.length; i++) {
                        var item = commonMenuItems[i];
                        if (parents.indexOf(item[idProperty]) !== -1) {
                           item.hasSub = true;
                        }
                     }
                  }
                  else {
                     // А если поля организованы плоско, то возьмём их как есть
                     commonMenuItems = fields.items.slice();
                  }
                  var firstItem = {className:_CLASS_MENU_EMPTY};
                  firstItem[idProperty] = _ID_MENU_EMPTY;
                  firstItem[displayProperty] = options.menuTitle;
                  firstItem[parentProperty] = null;
                  commonMenuItems.unshift(firstItem);
                  // Размножим commonMenuItems для каждого меню отдельно (чтобы можно было задачть индивидуальные свойства)
                  menuItems = [];
                  menuCaptions = [];
                  var indexes = commonMenuItems.reduce(function (r, v, i) { r[v[idProperty]] = i; return r; }, {});
                  for (var i = 0, len = rows[0].length; i < len; i++) {
                     var items = commonMenuItems.slice().map(function (v) { return cMerge({}, v); });
                     var selectedItem = items[indexes[menuIds[i]] || 0];
                     selectedItem.className = _CLASS_MENU_SELECTED;
                     menuItems[i] = items;
                     menuCaptions[i] = selectedItem[displayProperty];
                  }
                  menuConf = {
                     idProperty: idProperty,
                     displayProperty: displayProperty,
                     parentProperty: parentProperty,
                     namePrefix: _PREFIX_COLUMN_NAME
                  };
                  // Если компонент уже инициализирован, то можно задать обработчики событий прямо здесь
                  if (this.isInitialized()) {
                     menuConf.handlers = {
                        //onActivated: this._onColumnMenu.bind(this),
                        onMenuItemActivate: this._onColumnMenu.bind(this)
                     }
                  }
               }
               var title = options.headTitle;
               var skippedRows = 0 < options.skippedRows ? options.skippedRows : 0;
               var columns = rows[0].map(function (v, i) { return {
                  field: _PREFIX_COLUMN_FIELD + (i + 1),
                  title: title + ' ' + (i + 1),
                  headTemplate: headTmpl,
                  cellTemplate: cellTmpl,
                  menuConf: menuConf,
                  menuItems: menuConf ? menuItems[i] : undefined,
                  menuCaption: menuConf ? menuCaptions[i] : undefined,
                  className: !(menuIds && i in menuIds) ? _CLASS_LIGHT_COLUMN : undefined
               }; });
               columns.unshift({field:'id', title:''});
               for (var j = 0; j < rows.length; j++) {
                  rowItems.push(rows[j].reduce(function (r, v, i) { r[_PREFIX_COLUMN_FIELD + (i + 1)] = v; return r; }, {id:j + 1, className:j < skippedRows ? _CLASS_LIGHT_ROW : undefined}));
               }
            }
            return {columns:columns, rows:rowItems};
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
            var notEmpty = selectedField !== _ID_MENU_EMPTY;
            var hasSub = notEmpty && menu.getItems().getRecordById(selectedField).get('hasSub');
            // Только если это не пункт, имеющий вложенные подпункты
            if (!hasSub) {
               var options = this._options;
               var picker = menu.getPicker();
               var columnIndex = +menu.getName().substring(_PREFIX_COLUMN_NAME.length + _PREFIX_COLUMN_FIELD.length) - 1;
               var mapping = options.mapping;
               var prevIndex = notEmpty ? mapping[selectedField] : undefined;
               // Если это поле уже было выбрано в другой колнке
               if (0 <= prevIndex) {
                  // Снять выделение в предыдущем меню
                  this._setMenuSelection(this.getChildControlByName(_PREFIX_COLUMN_NAME + _PREFIX_COLUMN_FIELD + (prevIndex + 1)), selectedField, false, true);
               }
               var prevField; Object.keys(mapping).some(function (v) { if (mapping[v] === columnIndex) { prevField = v; return true; } }.bind(this));
               // Если в этой колонке уже было выбрано поле
               if (prevField) {
                  // Сбросить предыдущее соответсвие поля колонке
                  delete mapping[prevField];
                  this._changeColumnHighlighting(prevIndex, false);
               }
               // Изменить выделение в меню
               this._changeMenuSelection(menu, selectedField, prevField || _ID_MENU_EMPTY);
               // Зафиксировать новое соответсвие поля колонке
               if (notEmpty) {
                  mapping[selectedField] = columnIndex;
                  this._changeColumnHighlighting(columnIndex, true);
               }
               this.sendCommand('subviewChanged');
            }
         },

         /**
          * Изменить выделение колонки цветом
          *
          * @protected
          * @param {number} columnIndex Индекс колонки
          * @param {boolean} isSelected Выделить ли колонку
          */
         _changeColumnHighlighting: function (columnIndex, isSelected) {
            var $cells = this._grid.getContainer().find('.controls-DataGridView__tr').find('.controls-DataGridView__td:eq(' + (columnIndex + 1) + ')');
            $cells[isSelected ? 'removeClass' : 'addClass'](_CLASS_LIGHT_COLUMN);
         },

         /**
          * Выделеить указанный пункт меню, снять выделение с предыдущего (если указан)
          *
          * @protected
          * @param {SBIS3.CONTROLS/WSControls/Buttons/MenuButton} menu Компонент меню
          * @param {string|number} selectedField Идентификатор выбранного пункта
          * @param {string|number} prevSelectedField Идентификатор предыдущего выбранного пункта
          */
         _changeMenuSelection: function (menu, selectedField, prevSelectedField) {
            if (selectedField !== prevSelectedField) {
               if (prevSelectedField) {
                  this._setMenuSelection(menu, prevSelectedField, false, false);
               }
               this._setMenuSelection(menu, selectedField, true, true);
            }
         },

         /**
          * Выделеить пункт меню (маркировать выделенный пункт классом, установить заголовок меню)
          *
          * @protected
          * @param {SBIS3.CONTROLS/WSControls/Buttons/MenuButton} menu Компонент меню
          * @param {string|number} itemId Идентификатор пункта меню
          * @param {boolean} isSeelcted Становится ли пункт выделенным
          * @param {boolean} updateCaption Обновить также заголовок меню
          */
         _setMenuSelection: function (menu, itemId, isSeelcted, updateCaption) {
            var picker = menu.getPicker();
            var item = picker.getItemInstance(itemId);
            if (item.isVisible()) {
               item.getContainer()[isSeelcted ? 'addClass' : 'removeClass'](_CLASS_MENU_SELECTED);
            }
            else {
               item.setProperty('className', isSeelcted ? _CLASS_MENU_SELECTED : undefined);
            }
            if (updateCaption) {
               menu.setCaption(isSeelcted ? item.getCaption() : this._options.menuTitle);
            }
         },

         /**
          * Получить все настраиваемые значения компонента
          *
          * @public
          * @return {ExportColumnBindingResult}
          */
         getValues: function () {
            var options = this._options;
            return {
               mapping: cMerge({}, options.mapping),
               skippedRows: options.skippedRows
            };
         }
      });

      return View;
   }
);

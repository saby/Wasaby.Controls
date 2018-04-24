/**
 * Контрол "Привязки колонок файла к полям данных настройщика экспорта"
 *
 * @public
 * @class SBIS3.CONTROLS/ExportCustomizer/_ColumnBinder/View
 * @extends SBIS3.CONTROLS/CompoundControl
 */
define('SBIS3.CONTROLS/ExportCustomizer/_ColumnBinder/View',
   [
      'Core/CommandDispatcher',
      'Core/helpers/Object/isEqual',
      'SBIS3.CONTROLS/CompoundControl',
      'tmpl!SBIS3.CONTROLS/ExportCustomizer/_ColumnBinder/View',
      'css!SBIS3.CONTROLS/ExportCustomizer/_ColumnBinder/View'
   ],

   function (CommandDispatcher, cObjectIsEqual, CompoundControl, dotTplFn) {
      'use strict';

      var View = CompoundControl.extend(/**@lends SBIS3.CONTROLS/ExportCustomizer/_ColumnBinder/View.prototype*/ {

         /**
          * @typedef {object} ExportField Тип, описывающий целевое поле при привязке колонок файла к полям данных
          * @property {string} filed Идентификатор поля
          * @property {string} title Отображаемое наименование поля
          */

         /**
          * @typedef {object} ExportColumnBinderResult Тип, описывающий возвращаемые настраиваемые значения компонента
          * @property {Array<string>} fields Список привязки колонок файла к полям данных
          *
          * @see fields
          */

         _dotTplFn: dotTplFn,
         $protected: {
            _options: {
               /**
                * @cfg {string} Заголовок компонента
                */
               title: null,//Определено в шаблоне
               /**
                * @cfg {string} Заголовок столбца колонок файла в таблице соответствия
                */
               columnsTitle: rk('Столбец', 'НастройщикЭкспорта'),
               /**
                * @cfg {string} Заголовок столбца полей данных в таблице соответствия
                */
               fieldsTitle: rk('Поле данных', 'НастройщикЭкспорта'),
               /**
                * @cfg {string} Отображаемый текст при пустом списке соответствий
                */
               emptyTitle: rk('Не задано', 'НастройщикЭкспорта'),
               /**
                * @cfg {Array<ExportField>} Список соответствий колонок файла и полей данных
                */
               filelds: []
            },
            // Контрол списка соответствий колонок файла и полей данных
            _grid: null
         },

         _modifyOptions: function () {
            var options = View.superclass._modifyOptions.apply(this, arguments);
            var filelds = options.filelds;
            options._rows = (filelds && filelds.length ? filelds : [{field:'', title:emptyTitle}]).map(function (v, i) { return {id:v.field, column:_toLetter(i), field:v.title}; });
            options._columns = [
               {field:'column', title:options.columnsTitle},
               {field:'field', title:options.fieldsTitle}
            ];
            options._rowActions = this._makeRowActions();
            return options;
         },

         /*$constructor: function () {
         },*/

         init: function () {
            //При клике по кнопке добавления колонок
            CommandDispatcher.declareCommand(this, 'addRows', this._onAdd.bind(this));
            View.superclass.init.apply(this, arguments);
            this._grid = this.getChildControlByName('controls-ExportCustomizer-ColumnBinder-View__grid');
            this._bindEvents();
         },

         _bindEvents: function () {
            //При клике по строке списка колонок
            this.subscribeTo(this._grid, 'onItemActivate', this._onEdit.bind(this));
         },

         /**
          * Приготовить список доступных действий для строки списка колонок
          * @protected
          * @return {Array<object>}
          */
         _makeRowActions: function () {
            var title = rk('Удалить', 'НастройщикЭкспорта');
            return [{
               name: 'delete',
               icon: 'sprite:icon-16 icon-Erase icon-error',
               caption: title,
               tooltip: title,
               isMainAction: true,
               onActivated: this._onDelete.bind(this)
            }];
         },

         /**
          * Обработчик команды при клике по кнопке добавления колонок
          * @protected
          */
         _onAdd: function () {
            // Открыть редактор колонок
            //^^^this._options.^^^ = ^^^;
            //^^^this.sendCommand('subviewChanged');
         },

         /**
          * Обработчик события при клике по строке списка колонок
          * @protected
          * @param {Core/EventObject} evtName Дескриптор события
          * @param {object} meta ^^^
          */
         _onEdit: function (evtName, meta) {
            // Открыть редактор колонок
            //^^^this._options.^^^ = ^^^;
            //^^^this.sendCommand('subviewChanged');
         },

         /**
          * Обработчик события при удалении строки списка колонок
          * @protected
          * @param {Core/EventObject} evtName Дескриптор события
          * @param {string|number} id Идентификатор пункта списка колонок
          * @param {object} model Модель пункта списка колонок
          * @param {string} action Название действия
          */
         _onDelete: function (evtName, id, model/*, action*/) {
            //^^^this._options.^^^ = ^^^;
            //^^^this.sendCommand('subviewChanged');
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
            if ('fields' in values) {
               var fields = values.fields;
               var has = fields && fields.length ? !cObjectIsEqual(fields, options.fields) : !!(options.fields && options.fields.length);
               if (has) {
                  options.fields = fields || [];
                  this._grid.setItems(this._getRows());
               }
            }
         },

         /**
          * Получить все настраиваемые значения компонента
          *
          * @public
          * @return {ExportColumnBinderResult}
          */
         getValues: function () {
            return {
               fields: this._options.fields
            };
         }
      });



      // Private methods:

      /**
       * Создать буквенное обозначение для числа
       *
       * @private
       * @param {number} index Неотрицательное число
       * @return {string}
       */
      var _toLetter = function (index) {
         return '' + (index + 1);//^^^
      };



      return View;
   }
);

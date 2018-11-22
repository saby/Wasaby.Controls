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
      'SBIS3.CONTROLS/Browser/ColumnsEditor/Editor',
      'SBIS3.CONTROLS/CompoundControl',
      'SBIS3.CONTROLS/Controllers/ItemsMoveController',
      'SBIS3.CONTROLS/Utils/ObjectChange',
      'WS.Data/Collection/RecordSet',
      'tmpl!SBIS3.CONTROLS/ExportCustomizer/_ColumnBinder/View',
      'css!SBIS3.CONTROLS/ExportCustomizer/_ColumnBinder/View'
   ],

   function (CommandDispatcher, ColumnsEditor, CompoundControl, ItemsMoveController, objectChange, RecordSet, dotTplFn) {
      'use strict';

      var View = CompoundControl.extend(/**@lends SBIS3.CONTROLS/ExportCustomizer/_ColumnBinder/View.prototype*/ {

         /**
          * @typedef {object} BrowserColumnInfo Тип, содержащий информацию о колонке браузера
          * @property {string} id Идентификатор колонки (как правило, имя поля в базе данных или БЛ)
          * @property {string} title Отображаемое название колонки
          * @property {string} [group] Идентификатор или название группы, к которой относится колонка (опционально)
          * @property {boolean} [fixed] Обязательная колонка (опционально)
          * @property {object} columnConfig Конфигурация колонки в формате, используемом компонентом SBIS3.CONTROLS:DataGridView
          */

         /**
          * @typedef {object} ExportColumnBinderResult Тип, описывающий возвращаемые настраиваемые значения компонента
          * @property {Array<string>} fieldIds Список привязки колонок в экспортируемом файле к полям данных
          */

         _dotTplFn: dotTplFn,
         $protected: {
            _options: {
               /**
                * @cfg {string} Заголовок компонента
                */
               title: null,//Определено в шаблоне
               /**
                * @cfg {string} Отображаемый текст при пустом списке соответствий
                */
               emptyHTML: rk('Список колонок пуст.', 'НастройщикЭкспорта') + '<br/>' + rk('Вы должны добавить хотя бы одну колонку для выгрузки.', 'НастройщикЭкспорта'),
               /**
                * @cfg {Array<BrowserColumnInfo>|WS.Data/Collection/RecordSet<BrowserColumnInfo>} Список объектов с информацией о всех колонках в формате, используемом в браузере
                */
               allFields: null,
               /**
                * @cfg {Array<string>} Список привязки колонок в экспортируемом файле к полям данных
                */
               fieldIds: null,
               /**
                * @cfg {object} Список отображаемых названий групп полей (если используются идентификаторы групп)
                */
               fieldGroupTitles: null,
               /**
                * @cfg {bolean} Допускаются ли изменения
                */
               readOnly: null
            },
            // Контрол списка соответствий колонок файла и полей данных
            _grid: null,
            // Редактор колонок
            _columnsEditor: null
         },

         _modifyOptions: function () {
            var options = View.superclass._modifyOptions.apply(this, arguments);
            options.fieldIds = options.fieldIds || [];
            options._columns = [
               {field:'column'},
               {field:'field'}
            ];
            options._rows = this._makeRows(options);
            return options;
         },

         /*$constructor: function () {
         },*/

         init: function () {
            var readOnly = this._options.readOnly;
            if (!readOnly) {
               //При клике по кнопке добавления колонок
               CommandDispatcher.declareCommand(this, 'addRows', this._onAdd.bind(this));
            }
            View.superclass.init.apply(this, arguments);
            var grid = this._grid = this.getChildControlByName('controls-ExportCustomizer-ColumnBinder-View__grid');
            grid.setItemsActions(!readOnly ? this._makeRowActions() : []);
            if (!readOnly) {
               this._gridMoveController = new ItemsMoveController({
                  linkedView: grid
               });
            }
            this._bindEvents();
         },

         _bindEvents: function () {
            var options = this._options;
            var grid = this._grid;
            if (!options.readOnly) {
               //При изменении порядка строк в списке колонок
               this.subscribeTo(grid, 'onEndMove', function (evtName, dragObject) {
                  var items = grid.getItems();
                  if (items && 1 < items.getCount()) {
                     var fieldIds = []; items.each(function (v) { fieldIds.push(v.getId()); });
                     options.fieldIds = fieldIds;
                     this._redraw();
                     this.sendCommand('subviewChanged');
                  }
               }.bind(this));
            }
         },

         /**
          * Приготовить строки списка колонок
          * @protected
          * @param {object} options Опции компонента
          * @return {WS.Data/Collection/RecordSet}
          */
         _makeRows: function (options) {
            var fieldIds = options.fieldIds;
            var rows;
            if (fieldIds && fieldIds.length) {
               var allFields = options.allFields;
               var isRecordSet = allFields instanceof RecordSet;
               rows = fieldIds.map(function (id, i) {
                     var field;
                     if (!isRecordSet) {
                        allFields.some(function (v) { if (v.id === id) { field = v; return true; } });
                     }
                     else {
                        var model = allFields.getRecordById(id);
                        if (model) {
                           field = model.getRawData();
                        }
                     }
                     if (!field) {
                        throw new Error('Unknown field: ' + id);
                     }
                     return {id:id, column:_toLetters(i), field:field.title};
                  });
            }
            else {
               rows = [];
            }
            // В реализации DataGridView нет полной эквивалентности установки списка его элементов простым массивом объектов и RecordSet-ом с этими
            // объектами. Например, при задании массивом,  "замерзает" и не обновляется его MemorySource, что приводит к ошибке при перетаскивании
            // элементов списка. Поэтому возвращаем именно RecordSet:
            return new RecordSet({
               rawData: rows,
               idProperty: 'id'
            });
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
          * Открыть редактор колонок
          * @protected
          * @param {Array<string>} fieldIds Список идентификаторов выбранных полей
          * @param {boolean} singleMode Открывать редактор колонок без возможности множественного выделения
          * @return {Core/Deferred<Array<string>>}
          */
         _openColumnsEditor: function (fieldIds, singleMode) {
            if (!this._columnsEditor) {
               this._columnsEditor = new ColumnsEditor();
            }
            var options = this._options;
            //////////////////////////////////////////////////
            // Это временная затычка до тех пор, пока не реализована опция ignoreFixed в редакторе колонок
            // TODO: Убрать это
            options.allFields = new RecordSet({
               rawData: options.allFields.getRawData().map(function (v) { return {id:v.id, title:v.title, group:v.group, columnConfig:v.columnConfig}; }),
               idProperty: options.allFields.getIdProperty()
            });
            //////////////////////////////////////////////////
            return this._columnsEditor.open(
               {
                  opener: this,
                  columns: options.allFields,
                  selectedColumns: fieldIds || []
               },
               {
                  title: singleMode ? rk('Выберите поле данных', 'НастройщикЭкспорта') : rk('Выбор полей данных', 'НастройщикЭкспорта'),
                  applyButtonTitle: rk('Выбрать', 'НастройщикЭкспорта'),
                  width: this._container.width(),
                  groupTitles: options.fieldGroupTitles,
                  preserveOrder: true,
                  multiselect: !singleMode,
                  autoApply: !!singleMode,
                  moveColumns: false,
                  ignoreFixed: true// TODO: Добавить в редактор колонок опцию ignoreFixed
               }
            ).addCallback(function (resultColumnsConfig) {
               if (resultColumnsConfig) {
                  return resultColumnsConfig.selectedColumns;
               }
            });
         },

         /**
          * Обработчик команды при клике по кнопке добавления колонок
          * @protected
          */
         _onAdd: function () {
            this._openColumnsEditor(this._options.fieldIds, false).addCallback(this._replaceFields.bind(this));
         },

         /**
          * Обработчик события при удалении строки списка колонок
          * @protected
          * @param {Core/EventObject} evtName Дескриптор события
          * @param {string|number} id Идентификатор элемента списка колонок
          * @param {object} model Модель элемента списка колонок
          * @param {string} action Название действия
          */
         _onDelete: function (evtName, id/*, model, action*/) {
            var fieldIds = this._options.fieldIds;
            var index = fieldIds.indexOf(id);
            if (index !== -1) {
               fieldIds.splice(index, 1);
            }
            this._redraw();
            this.sendCommand('subviewChanged');
         },

         /**
          * Заменить поля в списке полей на новые. Если поле из списка полей отсутствует среди новых - оно будет удалено. Если новое поле уже присутствует в списке полей - оно останется на своём месте. Если нового поля не было в списке полей - оно будет добавлено в конец списка полей
          * @protected
          * @param {Array<string>} insertedIds Список идентификаторов новых полей
          */
         _replaceFields: function (insertedIds) {
            if (insertedIds && insertedIds.length) {
               var fieldIds = this._options.fieldIds;
               if (fieldIds.length) {
                  var lastIds = insertedIds.slice();
                  for (var i = fieldIds.length - 1; 0 <= i; i--) {
                     var j = lastIds.indexOf(fieldIds[i]);
                     if (j !== -1) {
                        lastIds.splice(j, 1);
                     }
                     else {
                        fieldIds.splice(i, 1);
                     }
                  }
                  fieldIds.push.apply(fieldIds, lastIds);
               }
               else {
                  fieldIds.push.apply(fieldIds, insertedIds);
               }
               this._redraw();
               this._grid.setSelectedKey(insertedIds[0]);
               this.sendCommand('subviewChanged');
            }
         },

         /**
          * Перероисовать список полей
          *
          * @protected
          */
         _redraw: function () {
            this._grid.setItems(this._makeRows(this._options));
         },

         /**
          * Установить указанные настраиваемые значения компонента
          *
          * @public
          * @param {object} values Набор из нескольких значений, которые необходимо изменить
          * @param {object} meta Дополнительная информация об изменении
          */
         restate: function (values, meta) {
            if (!values || typeof values !== 'object') {
               throw new Error('Object required');
            }
            var changes = objectChange(this._options, values, {fieldIds:true});
            if (changes && 'fieldIds' in changes) {
               this._redraw();
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
               fieldIds: this._options.fieldIds
            };
         },

         destroy: function () {
            if (this._gridMoveController) {
               this._gridMoveController.destroy();
            }
            View.superclass.destroy.apply(this, arguments);
         }
      });



      // Private methods:

      /**
       * Создать буквенное обозначение для числа
       *
       * @private
       * @param {number} value Неотрицательное число
       * @return {string}
       */
      var _toLetters = function (value) {
         if (typeof value === 'number' && 0 <= value) {
            var result = '';
            for ( ; 0 <= value; value = Math.floor(value/26) - 1) {
               result = String.fromCharCode(65 + value%26) + result;
            }
            return result;
         }
      };



      return View;
   }
);

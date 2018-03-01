/**
 * Контрол "Область редактирования настройщика импорта"
 *
 * @public
 * @class SBIS3.CONTROLS/ImportCustomizer/Area
 * @extends SBIS3.CONTROLS/CompoundControl
 */
define('SBIS3.CONTROLS/ImportCustomizer/Area',
   [
      'Core/CommandDispatcher',
      'Core/core-merge',
      'SBIS3.CONTROLS/CompoundControl',
      'tmpl!SBIS3.CONTROLS/ImportCustomizer/Area',
      'css!SBIS3.CONTROLS/ImportCustomizer/Area',
      'SBIS3.CONTROLS/Button',
      'SBIS3.CONTROLS/ImportCustomizer/BaseParams/View',
      'SBIS3.CONTROLS/ImportCustomizer/ProviderArgs/View',
      'SBIS3.CONTROLS/ScrollContainer'
   ],

   function (CommandDispatcher, cMerge, CompoundControl, dotTplFn) {
      'use strict';

      var Area = CompoundControl.extend(/**@lends SBIS3.CONTROLS/ImportCustomizer/Area.prototype*/ {

         /**
          * @typedef {object} ImportFile Тип, содержащий информацию об импортируемом файле
          * @property {string} name Отображаемое имя файла
          * @property {string} url Урл для скачивания файла
          * @property {string} uuid Идентификатор файла в системе хранения
          */

         /**
          * @typedef {object} ImportParser Тип, содержащий информацию о провайдере парсинга импортируемых данных
          * @property {string} name Имя(идентификатор) парсера
          * @property {string} title Отображаемое имя парсера
          * @property {string} [component] Класс компонента для настройки парсера (опционально)
          * @property {object} [args] Набор специфичных для данного парсера параметров (опционально)
          */

         /**
          * @typedef {object} ImportSheet Тип, содержащий информацию об области импортируемых данных (например, лист excel)
          * @property {string} name Отображаемое наименование области данных
          * @property {any[][]} sampleRows Образец данных в области, массив массивов равной длины
          */

         _dotTplFn: dotTplFn,
         $protected: {
            _options: {
               /**
                * @cfg {string} Заголовок настройщика импорта (опционально)
                */
               title: null,//Определено в шаблоне
               /**
                * @cfg {string} Название кнопки применения результата редактирования (опционально)
                */
               applyButtonTitle: null,//Определено в шаблоне
               /**
                * @cfg {string} Тип импортируемых данных (excel и т.д.)
                */
               dataType: null,
               /**
                * @cfg {ImportFile} Информация об импортируемом файле (обязательно)
                */
               file: null,
               /**
                * @cfg {string} Класс компонента настройки параметоров импортирования (Опционально, если не указан - используется {@link SBIS3.CONTROLS/ImportCustomizer/BaseParams/View комполнент по умолчанию})
                */
               baseParamsComponent: 'SBIS3.CONTROLS/ImportCustomizer/BaseParams/View',
               /**
                * @cfg {object} Опции компонента настройки параметоров импортирования. Состав опций определяется {@link baseParamsComponent используемым компонентом} (опционально)
                */
               baseParams: {
                  //Заменять ли импортируемыми данными предыдущее содержимое базы данных полностью или нет (только обновлять и добавлять)
                  replaceAllData: false,
                  //Место назначения для импортирования (таблица в базе данных и т.п.)
                  destination: null
               },
               /**
                * @cfg {object<ImportParser>} Список всех доступных провайдеров парсинга импортируемых данных
                */
               parsers: [],
               /**
                * @cfg {string} Выбранный провайдер парсинга импортируемых данных
                */
               parser: null,
               /**
                * @cfg {object} ^^^
                */
               fields: null,
               /**
                * @cfg {ImportSheet[]} Список объектов, представляющих имеющиеся области данных
                */
               sheets: null,
               /**
                * @cfg {number} Индекс выбранной области данных
                */
               sheetIndex: null
            },
            // Список имён вложенных компонентов
            _childViewNames: {
               sheet: 'controls-ImportCustomizer-Area__sheet',
               baseParams: 'controls-ImportCustomizer-Area__baseParams',
               provider: 'controls-ImportCustomizer-Area__provider',
               providerArgs: 'controls-ImportCustomizer-Area__providerArgs',
               columnBinding: 'controls-ImportCustomizer-Area__columnBinding'
            },
            // Ссылки на вложенные компоненты
            _views: {
               sheet: null,
               baseParams: null,
               provider: null,
               providerArgs: null,
               columnBinding: null
            }
         },

         _modifyOptions: function () {
            var options = Area.superclass._modifyOptions.apply(this, arguments);
            var sheets = options.sheets;
            var hasSheets = sheets && sheets.length;
            options._sheetsTitles = hasSheets ? sheets.map(function (v) {return v.name; }) : [];
            var parsers = options.parsers;
            var parserNames;
            if (parsers && (parserNames = Object.keys(parsers)).length) {
               var parserItems = parserNames.map(function (v) { var o = parsers[v]; return {id:v, title:o.title, order:o.order}; });
               parserItems.sort(function (v1, v2) { return v1.order - v2.order; });
               options._parserItems = parserItems;
               if (!options.parser) {
                  options.parser = parserItems[0].id;
               }
               var parser = parsers[options.parser];
               options._providerArgsComponent = parser.component || undefined;
               options._providerArgsOptions = this._getProviderArgsOptions(options, parser);
            }
            var sheetIndex = options.sheetIndex;
            options._columnsBindingRows = hasSheets ? sheets[0 < sheetIndex ? sheetIndex : 0].sampleRows : [];
            options._columnsBindingFields = options.fields;//^^^
            return options;
         },

         $constructor: function () {
            CommandDispatcher.declareCommand(this, 'complete', this._cmdComplete);
            this._publish('onComplete');
         },

         init: function () {
            Area.superclass.init.apply(this, arguments);
            for (var name in this._childViewNames) {
               this._views[name] = _getChildComponent(this, this._childViewNames[name]);
            }
            this._bindEvents();
         },

         _bindEvents: function () {
            this.subscribeTo(this._views.sheet, 'change', function (evtName, values) {
               // Изменилась область данных для импортирования
               var sheet = this._getSheet(values.sheetIndex);
               if (sheet) {
                  this._views.columnBinding.setValues({rows:sheet.sampleRows});
               }
            }.bind(this));
            /*this.subscribeTo(this._views.baseParams, 'change', function (evtName, values) {
               // Изменились параметры импортирования
            }.bind(this));*/
            this.subscribeTo(this._views.provider, 'change', function (evtName, values) {
               // Изменился выбор провайдера парсинга
               var options = this._options;
               var parser;
               var parsers = options.parsers;
               if (parsers) {
                  var name = values.parser;
                  if (name && name !== options.parser) {
                     options.parser = name;
                  }
                  parser = parsers[options.parser];
               }
               if (parser) {
                  var component = parser.component;
                  var view = this._views.providerArgs;
                  if (component) {
                     view.setTemplate(component, this._getProviderArgsOptions(options, parser));
                  }
                  else {
                     view.clearTemplate();
                  }
                  view.setVisible(!!component);
               }
               this._views.columnBinding.setValues({skippedRows:values.skippedRows});
            }.bind(this));
            /*this.subscribeTo(this._views.providerArgs, 'change', function (evtName, values) {
               // Изменились параметры провайдера парсинга
            }.bind(this));*/
            this.subscribeTo(this._views.columnBinding, 'change', function (evtName, values) {
               // Изменилась привязка данных к полям базы
               this._views.provider.setValues({skippedRows:values.skippedRows});
            }.bind(this));
         },

         /*
          * Реализация команды "complete"
          *
          * @protected
          */
         _cmdComplete: function () {
            var options = this._options;
            var file = options.file;
            var sheetIndex, sheet;
            var sheetView = this._views.sheet;
            if (sheetView) {
               sheetIndex = sheetView.getValues().sheetIndex;
               sheet = this._getSheet(sheetIndex);
            }
            var provider = this._views.provider.getValues();
            var providerArgs;
            var providerArgsView = this._views.providerArgs;
            if (providerArgsView) {
               var current = providerArgsView.getCurrentTemplateName();
               if (current) {
                  providerArgsView.getChildControls().some(function (v) { if (v._moduleName === current) { providerArgs = v.getValues(); return true; }; });
               }
            }
            var accordances = this._views.columnBinding.getValues().accordances;
            if (sheet) {
               sheet = {
                  index: sheetIndex,
                  name: sheet.name,
                  skippedRows: provider.skippedRows,
                  sampleRows: sheet.sampleRows,
                  columns: Object.keys(accordances).map(function (v) { return {index:accordances[v], field:v}; }),
                  parser: provider.parser
               };
               var separator = provider.separator;
               if (separator) {
                  sheet.separator = separator;
               }
               if (providerArgs) {
                  sheet.parserConfig = ['hierarchyField', 'columns'].reduce(function (r, v) { r[v] = providerArgs[v]; return r; }, {});
               }
            }
            var data = {
               //TODO: хорошо бы выводить file объектом
               fileName: file.name,
               fileUrl: file.url,
               fileUuid: file.uuid,
               sheetIndex: sheetIndex,
               sameSheetConfigs: !(sheetIndex !=/*Не !==*/ null && 0 <= sheetIndex),
               sheet: sheet
            };
            var baseParams = this._views.baseParams.getValues();
            for (var name in baseParams) {
               data[name] = baseParams[name];
            }
            // Собрать данные и затем...
            if (data) {
               this._notify('onComplete', data);
            }
            else {
               this._notify('onClose');
            }
         },

         /*
          * Получить область данных по её имени. Если имя не задано, то будет возвращена первая по счёту область данных. Если ничего не найдено -
          * будет возвращено undefined
          *
          * @protected
          * @param {number} sheetIndex Индекс области данных для импортирования
          * @return {object}
          */
         _getSheet: function (sheetIndex) {
            var sheets = this._options.sheets;
            if (sheets && sheets.length) {
               return sheets[sheetIndex !== -1 ? sheetIndex : 0];
            }
         },

         /*
          * Получить получить набор опций для компонента провайдера парсинга
          *
          * @protected
          * @param {object} options Опции
          * @param {string} name Имя нового выбранного парсера
          * @return {ImportParser}
          */
         _getProviderArgsOptions: function (options, parser) {
            if (parser && parser.component) {
               var sheets = options.sheets;
               var sheetIndex = options.sheetIndex;
               var values = {columnCount:sheets && sheets.length ? sheets[0 < sheetIndex ? sheetIndex : 0].sampleRows[0].length : 0};
               var args = parser.args;
               return args ? cMerge(values, args) : values;
            }
         }//,

         /*destroy: function () {
            Area.superclass.destroy.apply(this, arguments);
         }*/
      });



      // Private methods:

      var _getChildComponent = function (self, name) {
         if (self.hasChildControlByName(name)) {
            return self.getChildControlByName(name);
         }
      };



      return Area;
   }
);

/**
 * Класс контрола "Редактор колонок"
 *
 * @class SBIS3.CONTROLS.Columns.Editor
 * @public
 * @extends SBIS3.CONTROLS.CompoundControl
 */
define('js!SBIS3.CONTROLS.Columns.Editor',
   [
      'Core/core-merge',
      'Core/Deferred',
      'js!SBIS3.CONTROLS.CompoundControl',
      'js!SBIS3.CORE.FloatArea',
      'css!SBIS3.CONTROLS.Columns.Editor',
      'js!SBIS3.CONTROLS.Columns.Editing.Area'
   ],

   function (coreMerge, Deferred, CompoundControl, FloatArea) {
      'use strict';

      var Editor = CompoundControl.extend([], /**@lends SBIS3.CONTROLS.Columns.Editor.prototype*/ {
         /**
          * @typedef {Object} ColumnsConfigObject
          * @property {WS.Data/Collection/RecordSet} columns Набор записей, каждая из которых описывает элемент панели редактирования колонок. <br/>
          * Поля записи:
          * <ol>
          *    <li><b>id (String)</b> - идентификатор элемента.</li>
          *    <li><b>title (String)</b> - отображаемый текст элемента.</li>
          *    <li><b>fixed (Boolean)</b> - признак "Фиксированный". На панели редактирования колонок элементы с таким признаком выбраны и недоступны для взаимодействия, а колонки элемента, описанные в опции **columnConfig**, всегда отображены в списке.</li>
          *    <li><b>columnConfig (Array)</b> - массив с конфигурацией колонок (см. {@link SBIS3.CONTROLS.DataGridView#columns columns}).</li>
          * </ol>
          * @property {Array.<String|Number>} selectedColumns Массив идентификаторов элементов, которые будут отмечены на панели редактирования колонок. Параметр актуален для элементов с опцией *fixed=false*.
          */
         //_dotTplFn: null,
         $protected: {
            _options: {
               moveColumns: true,
               usePresets: false,// TODO: Включить после переделки дропдауна с пресетами
               newPresetTitle: rk('Новый пресет'),
               autoSaveFirstPreset: true,
               useNumberedTitle: true
            },
            _result: null
         },

         /*$constructor: function () {
            this._publish('onOpen', 'onComplete');
         },*/

         /**
          * Открыть редактор колонок. Возвращает обещание, которое будет разрешено новыми параметрами конфигурации колонок
          * @public
          * @param {object} columnsConfig Параметры конфигурации колонок
          * @param {object} [editorOptions] Дополнительные опции редактора (опционально)
          * @param {string} [editorOptions.title] Заголовок редактора колонок (опционально)
          * @param {string} [editorOptions.applyButtonTitle] Название кнопки применения результата редактирования (опционально)
          * @param {string} [editorOptions.groupTitleTpl] Шаблон имён групп (опционально)
          * @param {object} [editorOptions.groupTitles] Ассоциированый массив имён групп по идентификаторам (опционально)
          * @param {(string|number)[]} [editorOptions.expandedGroups] Список идентификаторов распахнутых групп (опционально)
          * @param {boolean} [editorOptions.usePresets] Показывает на обязательность использования пресетов (опционально)
          * @param {string} [editorOptions.presetsTitle] Заголовок дропдауна (опционально)
          * @param {SBIS3.CONTROLS.Columns.Preset.Unit[]} [editorOptions.staticPresets] Список объектов статически задаваемых пресетов (опционально)
          * @param {string} [editorOptions.presetNamespace] Пространство имён для сохранения пользовательских пресетов (опционально)
          * @param {string|number} [editorOptions.selectedPresetId] Идентификатор первоначально выбранного пресета в дропдауне (опционально)
          * @param {string} [editorOptions.newPresetTitle] Начальное название нового пользовательского пресета (опционально)
          * @param {boolean} [editorOptions.autoSaveFirstPreset] Сохранять автоматически единственный пользовательский пресет (опционально)
          * @param {boolean} [editorOptions.useNumberedTitle] При добавлении новых пользовательских пресетов строить название из предыдущего с добавлением следующего порядкового номера (опционально)
          * @param {boolean} [editorOptions.moveColumns] Указывает на необходимость включить перемещнение пользователем пунктов списка колонок (опционально)
          * @return {Deferred<object>}
          */
         open: function (columnsConfig, editorOptions) {
            if (this._result) {
               return Deferred.fail('Allready open');
            }
            this._columnsConfig = columnsConfig;
            var defaults = this._options;
            var hasEditorOptions = !!editorOptions && !!Object.keys(editorOptions).length;
            var allSources = hasEditorOptions ? [editorOptions, columnsConfig, defaults] : [columnsConfig, defaults];
            var edColfSources = hasEditorOptions ? [editorOptions, columnsConfig] : [columnsConfig];
            var edDefSources = hasEditorOptions ? [editorOptions, defaults] : [defaults];
            this._areaContainer = new FloatArea({
               opener: this,
               direction: 'left',
               animation: 'slide',
               isStack: true,
               autoCloseOnHide: true,

               //title: null,
               parent: this,
               template: 'js!SBIS3.CONTROLS.Columns.Editing.Area',
               cssClassName: 'controls-Columns-Editor__area',
               closeByExternalClick: true,
               closeButton: true,
               componentOptions: {
                  title: hasEditorOptions ? editorOptions.title : undefined,
                  applyButtonTitle: hasEditorOptions ? editorOptions.applyButtonTitle : undefined,
                  columns: columnsConfig.columns,
                  selectedColumns: columnsConfig.selectedColumns,
                  groupTitleTpl: _selectValue('groupTitleTpl', edColfSources),
                  groupTitles: _selectValue('groupTitles', edColfSources),
                  expandedGroups: _selectValue('expandedGroups', edColfSources),
                  usePresets: _selectValue('usePresets', allSources, 'boolean'),
                  presetsTitle: _selectValue('presetsTitle', edColfSources),
                  staticPresets: _selectValue('staticPresets', edColfSources),
                  presetNamespace: _selectValue('presetNamespace', edColfSources),
                  selectedPresetId: _selectValue('selectedPresetId', edColfSources),
                  newPresetTitle: _selectValue('newPresetTitle', allSources),
                  autoSaveFirstPreset: _selectValue('autoSaveFirstPreset', allSources, 'boolean'),
                  useNumberedTitle: _selectValue('useNumberedTitle', allSources, 'boolean'),
                  moveColumns: _selectValue('moveColumns', edDefSources, 'boolean'),
                  handlers: {
                     onComplete: this._onAreaComplete.bind(this)
                  }
               },
               handlers: {
                  onClose: this._onAreaClose.bind(this)
               }
            });
            this._notify('onSizeChange');
            this.subscribeOnceTo(this._areaContainer, 'onAfterClose', this._notify.bind(this, 'onSizeChange'));
            //this._notify('onOpen');
            return this._result = new Deferred();
         },

         _onAreaComplete: function (evtName, selectedColumns, expandedGroups) {
            this._areaContainer.close();
            this._sentResult({columns:this._columnsConfig.columns, selectedColumns:selectedColumns, expandedGroups:expandedGroups});
            //this._notify('onComplete');
         },

         _onAreaClose: function () {
            if (this._areaContainer) {
               this._areaContainer.destroy();
               this._areaContainer = null;
            }
            if (this._result) {
               this._sentResult(null);
            }
         },

         _sentResult: function (result) {
            this._result.callback(result || this._columnsConfig);
            this._columnsConfig = null;
            this._result = null;
         }
      });



      // Приватные свойства

      var _selectValue = function (name, sources, type) {
         var noType = !type;
         for (var i = 0; i < sources.length; i++) {
            var src = sources[i];
            if (name in src) {
               var value = src[name];
               if (noType || typeof value === type) {
                  return value;
               }
            }
         }
      };



      return Editor;
   }
);

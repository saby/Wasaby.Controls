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
               newPresetTitle: rk('Новый шаблон'),
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
          * @param {} [editorOptions.title]  (опционально)
          * @param {} [editorOptions.groupTitleTpl]  (опционально)
          * @param {} [editorOptions.groupTitles]  (опционально)
          * @param {} [editorOptions.expandedGroups]  (опционально)
          * @param {} [editorOptions.usePresets]  (опционально)
          * @param {string} [editorOptions.presetsTitle] Заголовок дропдауна (опционально)
          * @param {SBIS3.CONTROLS.Columns.Preset.Unit[]} [editorOptions.staticPresets] Список объектов статически задаваемых пресетов (опционально)
          * @param {string} [editorOptions.presetNamespace] Пространство имён для сохранения пользовательских пресетов (опционально)
          * @param {string|number} [editorOptions.selectedPresetId] Идентификатор первоначально выбранного пресета в дропдауне (опционально)
          * @param {} [editorOptions.newPresetTitle]  (опционально)
          * @param {} [editorOptions.autoSaveFirstPreset]  (опционально)
          * @param {} [editorOptions.useNumberedTitle]  (опционально)
          * @param {boolean} [editorOptions.moveColumns]  (опционально)
          * @return {Deferred<object>}
          */
         open: function (columnsConfig, editorOptions) {
            this._columnsConfig = columnsConfig;
            this._areaContainer = new FloatArea(coreMerge({
               opener: this,
               direction: 'left',
               animation: 'slide',
               //maxWidth: 388 + 2,
               isStack: true,
               autoCloseOnHide: true
            }, this._getAreaOptions(editorOptions)));
            this._notify('onSizeChange');
            this.subscribeOnceTo(this._areaContainer, 'onAfterClose', this._notify.bind(this, 'onSizeChange'));
            //this._notify('onOpen');
            return this._result = new Deferred();
         },

         _getAreaOptions: function (options) {
            options = options || {};
            var defaults = this._options;
            var columnsConfig = this._columnsConfig;
            return {
               //title: null,
               parent: this,
               template: 'js!SBIS3.CONTROLS.Columns.Editing.Area',
               cssClassName: 'controls-Columns-Editor__area',
               closeByExternalClick: true,
               closeButton: true,
               componentOptions: {
                  title: options.title || null,
                  columns: columnsConfig.columns,
                  //TODO: Для булей так нельзя, сделать фунцию
                  selectedColumns: columnsConfig.selectedColumns,
                  groupTitleTpl: columnsConfig.groupTitleTpl || options.groupTitleTpl || null,
                  groupTitles: columnsConfig.groupTitles || options.groupTitles || null,
                  expandedGroups: columnsConfig.expandedGroups || options.expandedGroups || null,
                  usePresets: columnsConfig.usePresets || options.usePresets || defaults.usePresets,
                  presetsTitle: columnsConfig.presetsTitle || options.presetsTitle || null,
                  staticPresets: columnsConfig.staticPresets || options.staticPresets || null,
                  presetNamespace: columnsConfig.presetNamespace || options.presetNamespace,
                  selectedPresetId: columnsConfig.selectedPresetId || options.selectedPresetId || null,
                  newPresetTitle: columnsConfig.newPresetTitle || options.newPresetTitle || defaults.newPresetTitle,
                  autoSaveFirstPreset: columnsConfig.autoSaveFirstPreset || options.autoSaveFirstPreset || defaults.autoSaveFirstPreset,
                  useNumberedTitle: columnsConfig.useNumberedTitle || options.useNumberedTitle || defaults.useNumberedTitle,
                  moveColumns: options.moveColumns || defaults.moveColumns,
                  handlers: {
                     onComplete: this._onAreaComplete.bind(this)
                  }
               },
               handlers: {
                  onClose: this._onAreaClose.bind(this)
               }
            };
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



      return Editor;
   }
);

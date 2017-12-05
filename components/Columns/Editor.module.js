// TODO: (+) Проработать правильное сохранение (Пресеты могут быть не только личными)
// TODO: ( ) Проработать ситуацию без сохранённых пресетов и с одним созранённым пресетом
// TODO: (+) Реализовать использование информации из пресета (колонки и группы)
// TODO: (+) Проработать правильное сочетание(совмещение) информации из пресетов и прямой информации из опций
// TODO: (+) Посмотреть опции по фазам (первичная инициализация и открытие пикера)
// TODO: ( ) Сортировать ли по группам?
// TODO: (+) Предусмотреть возможность работы без кнопки и с FloatArea
// TODO: (+) Вернуть пресеты
// TODO: (+) Проработать отсутствие групп
// TODO: (+) Вернуть сохранение в конфиг пользователя + предопределённые пресеты их опций
// TODO: ( ) Сделать классы типов (Columns.Config, Columns.ColumnInfo, Columns.Preset, ...)
// TODO: (+) Более строго провести везде опцию usePresets
// TODO: ( ) Возможно, стоит использовать SBIS3.CONTROLS.ItemsToolbar напрямую ?...
// TODO: (+) Разделить ColumnsEditor На Columns.EditorButton и Columns.Editor
// TODO: ( ) Более строго провести везде isStorable
// TODO: ( )
/**
  * Created by as.avramenko on 24.01.2017.
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

      /**
       * Класс контрола "Редактор колонок"
       *
       * @author Авраменко Алексей Сергеевич
       * @class SBIS3.CONTROLS.Columns.Editor
       * @public
       * @extends SBIS3.CONTROLS.CompoundControl
       */
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
               title: null,
               moveColumns: true,
               usePresets: false,// TODO: Включить после переделки дропдауна с пресетами

               /**
                * @cfg {string} Заголовок дропдауна
                */
               presetsTitle: null,//rk('Выберите пресет')
               /**
                * @cfg {SBIS3.CONTROLS.Columns.Preset.Unit[]} Список объектов статически задаваемых пресетов
                */
               staticPresets: null,
               /**
                * @cfg {string} Пространство имён для сохранения пользовательских пресетов
                */
               presetNamespace: 'default',// TODO: Убрать, не должно быть умолчания
               /**
                * @cfg {string|number} Идентификатор первоначально выбранного пресета в дропдауне
                */
               selectedPresetId: null,

               newPresetTitle: rk('Новый шаблон'),
               autoSaveFirstPreset: true,
               useNumberedTitle: true,
               groupTitleTpl: null,
               groupTitles: null
            },
            _result: null
         },

         $constructor: function () {
            this._publish('onOpen', 'onComplete');
         },

         /**
          * Открыть редактор колонок. Возвращает обещание, которое будет разрешено новыми параметрами конфигурации колонок
          * @public
          * @param {object} columnsConfig Параметры конфигурации колонок
          * @return {Deferred<object>}
          */
         open: function (columnsConfig) {
            this._columnsConfig = columnsConfig;
            this._areaContainer = new FloatArea(coreMerge({
               opener: this,
               direction: 'left',
               animation: 'slide',
               //maxWidth: 388 + 2,
               isStack: true,
               autoCloseOnHide: true
            }, this._getAreaOptions()));
            this._notify('onSizeChange');
            this.subscribeOnceTo(this._areaContainer, 'onAfterClose', this._notify.bind(this, 'onSizeChange'));
            this._notify('onOpen');
            return this._result = new Deferred();
         },

         _getAreaOptions: function () {
            var opts = this._options;
            var cfg = this._columnsConfig;
            return {
               //title: null,
               parent: this,
               template: 'js!SBIS3.CONTROLS.Columns.Editing.Area',
               cssClassName: 'controls-Columns-Editor__area',
               closeByExternalClick: true,
               closeButton: true,
               componentOptions: {
                  title: opts.title,
                  columns: cfg.columns,
                  selectedColumns: cfg.selectedColumns,
                  groupTitleTpl: cfg.groupTitleTpl || opts.groupTitleTpl || null,
                  groupTitles: cfg.groupTitles || opts.groupTitles || null,
                  expandedGroups: cfg.expandedGroups,
                  usePresets: opts.usePresets,
                  presetsTitle: cfg.presetsTitle,
                  staticPresets: cfg.staticPresets,
                  presetNamespace: cfg.presetNamespace || opts.presetNamespace,
                  selectedPresetId: cfg.selectedPresetId,
                  moveColumns: opts.moveColumns,
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
            this._notify('onComplete');
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

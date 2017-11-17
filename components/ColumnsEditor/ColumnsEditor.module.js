// TODO: (+) Проработать правильное сохранение (Пресеты могут быть не только личными)
// TODO: ( ) Проработать ситуацию без сохранённых пресетов и с одним созранённым пресетом
// TODO: (+) Реализовать использование информации из пресета (колонки и группы)
// TODO: (+) Проработать правильное сочетание(совмещение) информации из пресетов и прямой информации из опций
// TODO: (+) Посмотреть опции по фазам (первичная инициализация и открытие пикера)
// TODO: ( ) Сортировать ли по группам?
// TODO: (+) Предусмотреть возможность работы без кнопки и с FloatArea
// TODO: ( )
/**
 * Created by as.avramenko on 24.01.2017.
 */

define('js!SBIS3.CONTROLS.ColumnsEditor',
   [
      'js!SBIS3.CONTROLS.CompoundControl',
      'Core/CommandDispatcher',
      'Core/core-merge',
      'Core/Deferred',
      /*'js!SBIS3.CONTROLS.PickerMixin',*/
      'js!SBIS3.CORE.FloatArea',
      /*^^^'Core/tmpl/tmplstr', 'js!SBIS3.CONTROLS.Utils.TemplateUtil',*/
      'tmpl!SBIS3.CONTROLS.ColumnsEditor',
      'css!SBIS3.CONTROLS.ColumnsEditor',
      'js!SBIS3.CONTROLS.IconButton',
      'js!SBIS3.CONTROLS.ColumnsEditorArea'
   ],

   function (CompoundControl, CommandDispatcher, coreMerge, Deferred, /*PickerMixin,*/ FloatArea, dotTplFn) {
      'use strict';

      /**
       * Класс контрола "Редактор колонок".
       *
       * @author Авраменко Алексей Сергеевич
       * @class SBIS3.CONTROLS.ColumnsEditor
       * @public
       * @extends SBIS3.CONTROLS.CompoundControl
       *
       * @mixes SBIS3.CONTROLS.PickerMixin ^^^
       */
      var ColumnsEditor = CompoundControl.extend([/*PickerMixin*/], /** @lends SBIS3.CONTROLS.ColumnsEditor.prototype */{
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
         _dotTplFn: dotTplFn,
         $protected: {
            _options: {
               showButton: true,
               title: rk('Отображение колонок'),
               moveColumns: true,
               targetRegistryName: 'default',
               useNumberedTitle: true,
               groupField: 'group',
               groupTitleTpl: null,
               groupTitles: null
            },
            _userConfigName: null,
            _result: null
         },

         $constructor: function () {
            CommandDispatcher.declareCommand(this, 'openColumnsEditorArea', this._commandOpenColumnsEditorArea);
            this._publish('onColumnsEditorShow');
         },

         init: function () {
            ColumnsEditor.superclass.init.apply(this, arguments);
            this._userConfigName = 'ColumnsEditor#' + this._options.targetRegistryName;
         },

         _commandOpenColumnsEditorArea: function () {
            if (!this._areaContainer) {
               this._show(this._notify('onColumnsEditorShow', this._result = new Deferred()));
            }
         },

         /**
          * Показать редактор колонок. Возвращает обещание, которое будет разрешено списком идентификаторов выбранных колонок
          * Событие onColumnsEditorShow при этом не сформируется
          * @public
          * @param {object} columnsConfig Параметры открыттия
          * @return {Deferred<string[]>}
          */
         show: function (columnsConfig) {
            this._show(columnsConfig);
            return this._result = new Deferred();
         },

         /**
          * @protected
          * @param {object} columnsConfig Параметры открыттия
          */
         _show: function (columnsConfig) {
            this._columnsConfig = columnsConfig;
            /*this.showPicker();*/
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
         },

         /*_setPickerConfig: function () {
            return coreMerge(this._getAreaOptions(), {
               corner: 'tr',
               horizontalAlign: {
                  side: 'right'
               },
               verticalAlign: {
                  side: 'top'
               },
               target: this.getContainer(),
               handlers: {
                  onClose: function () {
                     // Разрушаем панель при закрытии
                     if (this._picker) {
                        this._picker.destroy();
                        this._picker = null;
                     }
                  }.bind(this)
               }
            });
         },*/

         _getAreaOptions: function () {
            var opts = this._options;
            var cfg = this._columnsConfig;
            return {
               //title: null,
               parent: this,
               template: 'js!SBIS3.CONTROLS.ColumnsEditorArea',
               cssClassName: 'controls-ColumnsEditor-area',
               closeByExternalClick: true,
               closeButton: true,
               componentOptions: {
                  title: opts.title,
                  columns: cfg.columns,
                  groupField: cfg.groupField || opts.groupField,
                  groupTitleTpl: cfg.groupTitleTpl || opts.groupTitleTpl || null,
                  groupTitles: cfg.groupTitles || opts.groupTitles || null,
                  selectedColumns: cfg.selectedColumns,
                  expandedGroups: cfg.expandedGroups,
                  moveColumns: opts.moveColumns,
                  handlers: {
                     onComplete/*^^^onSelectedColumnsChange*/: this._onAreaComplete.bind(this)
                  }
               },
               handlers: {
                  onClose: this._onAreaClose.bind(this)
               }
            };
         },

         _onAreaComplete: function (evtName, selectedColumns, expandedGroups) {
            /*this._picker.hide();*/
            this._areaContainer.close();
            this._sentResult({columns:this._columnsConfig.columns, selectedColumns:selectedColumns, expandedGroups:expandedGroups});
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



      return ColumnsEditor;
   }
);

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
            _userConfigName: null
         },

         $constructor: function () {
            CommandDispatcher.declareCommand(this, 'showColumnsEditor', this._commandShowColumnsEditor);
            this._publish('onColumnsEditorShow', 'onColumnsEditorComplete', 'onSelectedColumnsChange');
         },

         init: function () {
            ColumnsEditor.superclass.init.apply(this, arguments);
            this._userConfigName = 'ColumnsEditor#' + this._options.targetRegistryName;
         },

         _commandShowColumnsEditor: function () {
            if (this._areaContainer) {
               return;
            }
            this._columnsEditorConfig = this._notify('onColumnsEditorShow');
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
            var cfg = this._columnsEditorConfig;
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
                     onComplete/*^^^onSelectedColumnsChange*/: function (evtName, selectedColumns, expandedGroups) {
                        /*this._picker.hide();*/
                        this._areaContainer.close();
                        this._notify('onColumnsEditorComplete', selectedColumns);
                        this._notify('onSelectedColumnsChange', selectedColumns);// TODO: Нужно это убрать, но провести через браузер
                     }.bind(this)
                  }
               },
               handlers: {
                  onClose: function () {
                     if (this._areaContainer) {
                        this._areaContainer.destroy();
                        this._areaContainer = null;
                     }
                     this._notify('onColumnsEditorComplete', null);
                  }.bind(this)
               }
            };
         }
      });



      return ColumnsEditor;
   }
);

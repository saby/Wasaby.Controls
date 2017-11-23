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
      'Core/ClientsGlobalConfig',
      /*'Core/UserConfig',*/
      'WS.Data/Collection/RecordSet',
      /*'js!SBIS3.CONTROLS.PickerMixin',*/
      'js!SBIS3.CORE.FloatArea',
      /*^^^'Core/tmpl/tmplstr', 'js!SBIS3.CONTROLS.Utils.TemplateUtil',*/
      'tmpl!SBIS3.CONTROLS.ColumnsEditor',
      'css!SBIS3.CONTROLS.ColumnsEditor',
      'js!SBIS3.CONTROLS.IconButton',
      'js!SBIS3.CONTROLS.ColumnsEditorArea'
   ],

   function (CompoundControl, CommandDispatcher, coreMerge, Deferred, ClientsGlobalConfig, /*UserConfig,*/ RecordSet, /*PickerMixin,*/ FloatArea, dotTplFn) {
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
               defaultPreset: null,
               newPresetTitle: rk('Новый шаблон'),
               autoSaveFirstPreset: true,
               useNumberedTitle: true,
               groupField: 'group',
               groupTitleTpl: null,
               groupTitles: null,

               _presets: null,
               _selectedPreset: null
            },
            _userConfigName: null,
            _result: null,
            _presetDropdown: null
         },

         $constructor: function () {
            CommandDispatcher.declareCommand(this, 'openColumnsEditorArea', this._commandOpenColumnsEditorArea);
            CommandDispatcher.declareCommand(this, 'selectPreset', this._commandSelectPreset);
            CommandDispatcher.declareCommand(this, 'changePreset', this._commandChangePreset);
            CommandDispatcher.declareCommand(this, 'clonePreset', this._commandClonePreset);
            CommandDispatcher.declareCommand(this, 'deletePreset', this._commandDeletePreset);
            this._publish('onColumnsEditorShow');
         },

         init: function () {
            ColumnsEditor.superclass.init.apply(this, arguments);
            this._userConfigName = 'ColumnsEditor#' + this._options.targetRegistryName;
            this._options._presets = new RecordSet({rawData:[], idProperty:'title'});
            this._presetDropdown = this._options.showButton ? this.getChildControlByName('controls-ColumnsEditor__preset') : null;

            ClientsGlobalConfig/*UserConfig*/.getParam(this._userConfigName).addCallback(function (data) {
               this._onLoadPresets(data);
               if (this._presetDropdown) {
                  this.subscribeTo(this._presetDropdown, 'onSelectedItemsChange', function (evtName, selected, changes) {
                     this._setSelectedPreset(selected[0]);
                     this.sendCommand('showColumnsEditor');
                  }.bind(this));
               }
            }.bind(this));
         },

         _getPresets: function () {
            return this._options._presets;
         },

         _onLoadPresets: function (data) {
            var values = data && typeof data === 'string' ? JSON.parse(data) : data || [];
            var recordset = this._options._presets;
            //recordset.clear();
            recordset.setRawData(values);
            recordset.acceptChanges();
            var selected = null;
            if (values.length) {
               selected = this._options.defaultPreset;
               selected = selected && values.map(function (v) { return v.title; }).indexOf(selected) !== -1 ? selected : values[0].title;
            }
            this._options._selectedPreset = selected;
            _updateDropdown(this);
         },

         _getSelectedPreset: function () {
            return this._options._selectedPreset;
         },

         _setSelectedPreset: function (title) {
            this._options._selectedPreset = title;
         },

         _commandSelectPreset: function (title) {
            this._setSelectedPreset(title);
            if (this._presetDropdown) {
               this._presetDropdown.setSelectedKeys([title]);
            }
         },

         _commandChangePreset: function (title) {
            var recordset = this._options._presets;
            if (!recordset.getCount()) {
               throw new Error('Nothing to change');
            }
            recordset.getRecordById(this._options._selectedPreset).set('title', title);
            return _completeChangePresetsAndSave(this, title);
         },

         _commandClonePreset: function () {
            var recordset = this._options._presets;
            if (!recordset.getCount()) {
               throw new Error('Nothing to clone');
            }
            var record = recordset.getRecordById(this._options._selectedPreset);
            var i = recordset.getIndex(record);
            var newRec = record.clone();
            var newTitle = this._options.newPresetTitle;// TODO: Возможно, лучше сделать старый заголовок с цифрой в конце - this._options.useNumberedTitle
            newRec.set('title', newTitle);
            recordset.add(newRec, i + 1);
            return _completeChangePresetsAndSave(this, newTitle);
         },

         _commandDeletePreset: function () {
            var recordset = this._options._presets;
            var count = recordset.getCount();
            if (!count) {
               throw new Error('Nothing to delete');
            }
            var record = recordset.getRecordById(this._options._selectedPreset);
            var i = 1 < count ? recordset.getIndex(record) : null;
            recordset.remove(record);
            return _completeChangePresetsAndSave(this, 1 < count ? recordset.at(i).get('title') : null);
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
                  _getPresets: this._getPresets.bind(this),//^^^
                  _getSelectedPreset: this._getSelectedPreset.bind(this),//^^^
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
            var recordset = this._options._presets;
            var isColumnsChanged;
            var isAnyChanged;
            if (recordset.getCount()) {
               var record = recordset.getRecordById(this._options._selectedPreset);
               record.set('selectedColumns', selectedColumns);
               isColumnsChanged = record.isChanged();
               record.set('expandedGroups', expandedGroups);
               isAnyChanged = record.isChanged();
               recordset.acceptChanges();
            }
            else
            if (this._options.autoSaveFirstPreset) {
               var title = this._options.newPresetTitle;
               //recordset.clear();
               recordset.setRawData([{title:title, selectedColumns:selectedColumns, expandedGroups:expandedGroups}]);
               _completeChangePresets(this, title);
               isAnyChanged = isColumnsChanged = true;
            }
            else {
               isColumnsChanged = true;
            }
            if (isAnyChanged) {
               _save(this);
            }
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



      // Private methods:

      var _completeChangePresetsAndSave = function (self, title) {
         _completeChangePresets(self, title);
         return _save(self);
      };

      var _completeChangePresets = function (self, title) {
         self._options._selectedPreset = title;
         self._options._presets.acceptChanges();
         _updateDropdown(self);
      };

      var _updateDropdown = function (self) {
         var dropdown = self._presetDropdown;
         if (dropdown) {
            var presets = self._options._presets;
            dropdown.setItems(presets);
            var selected = self._options._selectedPreset;
            dropdown.setSelectedKeys(selected ? [selected] : []);
            dropdown.setEnabled(1 < presets.getCount());
         }
      };

      var _save = function (self) {
         var promise = new Deferred();
         ClientsGlobalConfig/*UserConfig*/.setParam(self._userConfigName, JSON.stringify(self._options._presets.getRawData())).addCallbacks(
            promise.callback.bind(promise, true),
            function (err) {
               // TODO: Изменение не сохранено - откатится назад если пикер ещё открыт
               promise.callback(false);
            }
         );
         return promise;
      };



      return ColumnsEditor;
   }
);

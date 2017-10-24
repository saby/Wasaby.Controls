// TODO: Проработать правильное сохранение (Пресеты могут быть не только личными)
// TODO: Проработать ситуацию без созранённых пресетов и с одним созранённым пресетом
// TODO: Реализовать использование информации из пресета (колонки и группы)
// TODO: Проработать правильное сочетание(совмещение) информации из пресетов и прямой информации из опций
// TODO:
/**
 * Created by as.avramenko on 24.01.2017.
 */

define('js!SBIS3.CONTROLS.ColumnsEditor',
   [
      'js!SBIS3.CONTROLS.CompoundControl',
      'Core/CommandDispatcher',
      'Core/Deferred',
      'Core/UserConfig',
      'WS.Data/Collection/RecordSet',
      'js!SBIS3.CONTROLS.PickerMixin',
      /*'Core/tmpl/tmplstr', 'js!SBIS3.CONTROLS.Utils.TemplateUtil',*/
      'tmpl!SBIS3.CONTROLS.ColumnsEditor',
      'css!SBIS3.CONTROLS.ColumnsEditor',
      'js!SBIS3.CONTROLS.IconButton',
      'js!SBIS3.CONTROLS.ColumnsEditorArea'
   ],

   function (CompoundControl, CommandDispatcher, Deferred, UserConfig, RecordSet, PickerMixin, dotTplFn) {
      'use strict';

      /**
       * Класс контрола "Редактор колонок".
       *
       * @author Авраменко Алексей Сергеевич
       * @class SBIS3.CONTROLS.ColumnsEditor
       * @public
       * @extends SBIS3.CONTROLS.CompoundControl
       *
       * @mixes SBIS3.CONTROLS.PickerMixin
       */
      var ColumnsEditor = CompoundControl.extend([PickerMixin],/** @lends SBIS3.CONTROLS.ColumnsEditor.prototype */ {
         _dotTplFn: dotTplFn,
         $protected: {
            _options: {
               title: 'Отображение колонок',
               moveColumns: true,
               targetRegistryName: 'default',
               defaultPreset: null,

               _presets: null,
               _selectedPreset: null
            },
            _userConfigName: null,
            _presetDropdown: null
         },

         $constructor: function () {
            CommandDispatcher.declareCommand(this, 'showEditorArea', this._commandShowColumnsEditor);
            CommandDispatcher.declareCommand(this, 'selectPreset', this._commandSelectPreset);
            CommandDispatcher.declareCommand(this, 'changePreset', this._commandChangePreset);
            CommandDispatcher.declareCommand(this, 'clonePreset', this._commandClonePreset);
            CommandDispatcher.declareCommand(this, 'deletePreset', this._commandDeletePreset);
            this._publish('onSelectedColumnsChange', 'onColumnsEditorShow');
         },

         init: function () {
            ColumnsEditor.superclass.init.apply(this, arguments);
            this._userConfigName = 'ColumnsEditor#' + this._options.targetRegistryName;
            this._options._presets = new RecordSet({rawData:[], idProperty:'title'});
            this._presetDropdown = this.getChildControlByName('controls-ColumnsEditor__preset');

            this.subscribeTo(this._presetDropdown, 'onSelectedItemsChange', function (evtName, selected, changes) {
               this._setSelectedPreset(selected[0]);
            }.bind(this));

            UserConfig.getParam(this._userConfigName).addCallback(this._setPresets.bind(this));
         },

         _getPresets: function () {
            return this._options._presets;
         },

         _setPresets: function (data) {
            var values = data && typeof data === 'string' ? JSON.parse(data) : data || [];
            //////////////////////////////////////////////////
            if (!values.length) {
               values.push({
                  title: 'Пробный шаблон 1',
                  selectedColumns: [],
                  collapsedGroups: ['2']
               }, {
                  title: 'Пробный шаблон 2',
                  selectedColumns: [],
                  collapsedGroups: ['2']
               }, {
                  title: 'Пробный шаблон 3',
                  selectedColumns: [],
                  collapsedGroups: ['2']
               });
            }
            //////////////////////////////////////////////////
            var recordset = this._options._presets;
            //recordset.clear();
            recordset.setRawData(values);
            recordset.acceptChanges();
            var selected = this._options.defaultPreset;
            selected = selected && values.map(function (v) { return v.title; }).indexOf(selected) !== -1 ? selected : values[0].title;
            this._options._selectedPreset = selected;
            this._updateDropdown();
         },

         _updateDropdown: function () {
            this._presetDropdown.setItems(this._options._presets);
            this._presetDropdown.setSelectedKeys([this._options._selectedPreset]);
         },

         _getSelectedPreset: function () {
            return this._options._selectedPreset;
         },

         _setSelectedPreset: function (title) {
            this._options._selectedPreset = title;
         },

         _commandSelectPreset: function (title) {
            this._setSelectedPreset(title);
            this._presetDropdown.setSelectedKeys([title]);
         },

         _commandChangePreset: function (title) {
            var recordset = this._options._presets;
            recordset.getRecordById(this._options._selectedPreset).set('title', title);
            return this._completeCmdAndSave(title);
         },

         _commandClonePreset: function () {
            var recordset = this._options._presets;
            var record = recordset.getRecordById(this._options._selectedPreset);
            var i = recordset.getIndex(record);
            var newRec = record.clone();
            var newTitle = 'Новый шаблон';// TODO: Возможно, лучше сделать старый заголовок с цифрой в конце
            newRec.set('title', newTitle);
            recordset.add(newRec, i + 1);
            return this._completeCmdAndSave(newTitle);
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
            return this._completeCmdAndSave(1 < count ? recordset.at(i).get('title') : null);
         },

         _completeCmdAndSave: function (title) {
            this._options._selectedPreset = title;
            this._options._presets.acceptChanges();
            this._updateDropdown();
            return this._save();
         },

         _commandShowColumnsEditor: function () {
            this._columnsEditorConfig = this._notify('onColumnsEditorShow');
            this.showPicker();
         },

         _save: function () {
            var promise = new Deferred();
            UserConfig.setParam(this._userConfigName, JSON.stringify(this._options._presets.getRawData())).addCallbacks(
               promise.callback.bind(promise, true),
               function (err) {
                  // TODO: Изменение не сохранено - откатится назад
                  promise.callback(false);
               }
            );
            return promise;
         },

         _setPickerConfig: function () {
            var cfg = this._columnsEditorConfig;
            //////////////////////////////////////////////////^^^
            if (cfg.columns && cfg.columns.getCount()) {
               cfg.columns.each(function (column) {
                  column.set('group', Math.ceil(3*Math.random()));
               });
            }
            cfg.groupTitleTpl = '{{?it.group == 1}}Группа: a1{{??it.group == 2}}Группа: a2{{??it.group == 3}}Группа: a3{{??}}Группа: a{{=it.group}}{{?}}';//<ws:if data="{{groupId == 1}}">Группа: a1</ws:if><ws:else data="{{groupId == 2}}">Группа: a2</ws:else><ws:else data="{{groupId == 3}}">Группа: a3</ws:else><ws:else>Группа: a{{groupId}}</ws:else>
            cfg.groupTitles = {'1':'Группа: b1', '2':'Группа: b2', '3':'Группа: b3'};
            cfg.groupCollapsing = {'2':true};
            cfg.moveColumns = false;//^^^true
            //////////////////////////////////////////////////
            return {
               corner: 'tr',
               horizontalAlign: {
                  side: 'right'
               },
               verticalAlign: {
                  side: 'top'
               },
               template: 'js!SBIS3.CONTROLS.ColumnsEditorArea',
               closeByExternalClick: true,
               closeButton: true,
               parent: this,
               target: this.getContainer(),
               cssClassName: 'controls-ColumnsEditorArea-picker',
               componentOptions: {
                  columns: cfg.columns,
                  selectedColumns: cfg.selectedColumns,
                  getPresets: this._getPresets.bind(this),//^^^
                  getSelectedPreset: this._getSelectedPreset.bind(this),//^^^
                  groupTitleTpl: cfg.groupTitleTpl && (typeof cfg.groupTitleTpl === 'function' || typeof cfg.groupTitleTpl === 'string') ? cfg.groupTitleTpl : null,
                  groupTitles: typeof cfg.groupTitles === 'object' ? cfg.groupTitles : null,
                  groupCollapsing: typeof cfg.groupCollapsing === 'object' ? cfg.groupCollapsing : null,
                  title: this._options.title,
                  moveColumns: this._options.moveColumns,
                  handlers: {
                     onSelectedColumnsChange: function (event, selectedColumns) {
                        this._notify('onSelectedColumnsChange', selectedColumns);
                        this._picker.hide();
                     }.bind(this)
                  }
               },
               handlers: {
                  onClose: function () {
                     // Разрушаем панель при закрытии
                     if (this._picker) {
                        this._picker.destroy();
                        this._picker = null;
                     }
                  }.bind(this)
               }
            };
         }
      });

      return ColumnsEditor;
   }
);

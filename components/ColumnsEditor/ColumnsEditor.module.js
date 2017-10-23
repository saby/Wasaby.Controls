/**
 * Created by as.avramenko on 24.01.2017.
 */

define('js!SBIS3.CONTROLS.ColumnsEditor',
   [
      'js!SBIS3.CONTROLS.CompoundControl',
      'Core/CommandDispatcher',
      'Core/UserConfig',
      'WS.Data/Collection/RecordSet',
      'js!SBIS3.CONTROLS.PickerMixin',
      /*'Core/tmpl/tmplstr', 'js!SBIS3.CONTROLS.Utils.TemplateUtil',*/
      'tmpl!SBIS3.CONTROLS.ColumnsEditor',
      'css!SBIS3.CONTROLS.ColumnsEditor',
      'js!SBIS3.CONTROLS.IconButton',
      'js!SBIS3.CONTROLS.ColumnsEditorArea'
   ],

   function (CompoundControl, CommandDispatcher, UserConfig, RecordSet, PickerMixin, dotTplFn) {
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
               _preferences: null
            },
            _userConfigName: null,
            _preferencesDropdown: null
         },

         $constructor: function () {
            CommandDispatcher.declareCommand(this, 'showEditorArea', this._showColumnsEditor);
            this._publish('onSelectedColumnsChange', 'onColumnsEditorShow');
         },

         init: function () {
            ColumnsEditor.superclass.init.apply(this, arguments);
            this._userConfigName = 'ColumnsEditor#' + (this._options._columnsEditorConfig || 'default');
            UserConfig.getParamValues(this._userConfigName).addCallback(this._setPreferences.bind(this));
            this._preferencesDropdown = this.getChildControlByName('controls-ColumnsEditor__preferences');

            this.subscribeTo(this._preferencesDropdown, 'onSelectedItemsChange', function (evtName, selected, changes) {
               this._setSelectedPreference(selected[0], true);
            }.bind(this));
         },

         _getPreferences: function () {
            return this._options._preferences;
         },

         _setPreferences: function (values) {
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
            var recordset = new RecordSet({
               rawData: values,
               idProperty: 'title'
            });
            this._options._preferences = recordset;
            this._preferencesDropdown.setItems(recordset);
         },

         _getSelectedPreference: function () {
            return this._options._selectedPreference;
         },

         _setSelectedPreference: function (preference, dontReset) {
            this._options._selectedPreference = preference;
            if (!dontReset) {
               this._preferencesDropdown.setSelectedKeys([preference]);
            }
         },

         _showColumnsEditor: function () {
            this._columnsEditorConfig = this._notify('onColumnsEditorShow');
            this.showPicker();
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
                  getPreferences: this._getPreferences.bind(this),
                  getSelectedPreference: this._getSelectedPreference.bind(this),
                  setSelectedPreference: this._setSelectedPreference.bind(this),
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

define('js!SBIS3.CONTROLS.Columns.EditorButton',
   [
      'js!SBIS3.CONTROLS.CompoundControl',
      'Core/CommandDispatcher',
      'Core/Deferred',
      'Core/ClientsGlobalConfig',
      /*'Core/UserConfig',*/
      'WS.Data/Collection/RecordSet',
      'tmpl!SBIS3.CONTROLS.Columns.EditorButton',
      'css!SBIS3.CONTROLS.Columns.EditorButton',
      'js!SBIS3.CONTROLS.IconButton'
   ],

   function (CompoundControl, CommandDispatcher, Deferred, ClientsGlobalConfig, /*UserConfig,*/ RecordSet, dotTplFn) {
      'use strict';

      /**
       * Класс контрола "Редактор колонок".
       *
       * @author Авраменко Алексей Сергеевич
       * @class SBIS3.CONTROLS.Columns.EditorButton
       * @public
       * @extends SBIS3.CONTROLS.CompoundControl
       */
      var EditorButton = CompoundControl.extend([], /** @lends SBIS3.CONTROLS.Columns.EditorButton.prototype */{
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
               title: rk('Отображение колонок'),
               moveColumns: true,
               usePresets: true,
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
            _presetDropdown: null,
            _button: null
         },

         $constructor: function () {
            CommandDispatcher.declareCommand(this, 'selectPreset', this._commandSelectPreset);
            CommandDispatcher.declareCommand(this, 'changePreset', this._commandChangePreset);
            CommandDispatcher.declareCommand(this, 'clonePreset', this._commandClonePreset);
            CommandDispatcher.declareCommand(this, 'deletePreset', this._commandDeletePreset);
            this._publish('onColumnsEditorButtonActivate');
         },

         init: function () {
            EditorButton.superclass.init.apply(this, arguments);
            this._userConfigName = 'ColumnsEditor#' + this._options.targetRegistryName;
            this._options._presets = new RecordSet({rawData:[], idProperty:'title'});
            this._presetDropdown = this._options.usePresets ? this.getChildControlByName('controls-Columns-EditorButton__preset') : null;
            this._button = this.getChildControlByName('controls-Columns-EditorButton__button');

            this.subscribeTo(this._button, 'onActivate', this._notify.bind(this, 'onColumnsEditorButtonActivate'));

            ClientsGlobalConfig/*UserConfig*/.getParam(this._userConfigName).addCallback(function (data) {
               this._onLoadPresets(data);
               if (this._presetDropdown) {
                  this.subscribeTo(this._presetDropdown, 'onSelectedItemsChange', function (evtName, selected, changes) {
                     this._setSelectedPreset(selected[0]);
                     this._notify('onColumnsEditorButtonActivate');
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



      return EditorButton;
   }
);

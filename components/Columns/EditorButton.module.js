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
               usePresets: false,// TODO: Включить после переделки дропдауна с пресетами
               targetRegistryName: 'default',
               defaultPreset: null,

               _presets: null,
               _selectedPreset: null
            },
            _userConfigName: null,
            _presetDropdown: null,
            _button: null
         },

         $constructor: function () {
            this._publish('onActivated');
         },

         init: function () {
            EditorButton.superclass.init.apply(this, arguments);
            this._userConfigName = 'ColumnsEditor#' + this._options.targetRegistryName;
            this._options._presets = new RecordSet({rawData:[], idProperty:'title'});
            this._presetDropdown = this._options.usePresets ? this.getChildControlByName('controls-Columns-EditorButton__preset') : null;
            this._button = this.getChildControlByName('controls-Columns-EditorButton__button');

            this.subscribeTo(this._button, 'onActivated', this._notify.bind(this, 'onActivated'));

            ClientsGlobalConfig/*UserConfig*/.getParam(this._userConfigName).addCallback(function (data) {
               this._onLoadPresets(data);
               if (this._presetDropdown) {
                  this.subscribeTo(this._presetDropdown, 'onSelectedItemsChange', function (evtName, selected, changes) {
                     this._setSelectedPreset(selected[0]);
                     this._notify('onActivated');
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
         }
      });



      // Private methods:

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



      return EditorButton;
   }
);

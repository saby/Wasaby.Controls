/**
 * Класс контрола "Выпадающий список пресетов/шаблонов редактора колонок"
 *
 * @public
 * @class SBIS3.CONTROLS.Columns.PresetsList
 * @extends SBIS3.CONTROLS.CompoundControl
 */
define('js!SBIS3.CONTROLS.Columns.PresetsList',
   [
      'Core/CommandDispatcher',
      'Core/Deferred',
      'Core/ClientsGlobalConfig',
      /*'Core/UserConfig',*/
      'WS.Data/Collection/RecordSet',
      'js!SBIS3.CONTROLS.Columns.Preset',
      'js!SBIS3.CONTROLS.CompoundControl',
      'tmpl!SBIS3.CONTROLS.Columns.PresetsList',
      'css!SBIS3.CONTROLS.Columns.PresetsList'
   ],

   function (CommandDispatcher, Deferred, ClientsGlobalConfig, /*UserConfig,*/ RecordSet, Preset, CompoundControl, dotTplFn) {
      'use strict';



      var PresetsList = CompoundControl.extend([], /**@lends SBIS3.CONTROLS.Columns.PresetsList.prototype*/ {
         _dotTplFn: dotTplFn,
         $protected: {
            _options: {
               targetRegistryName: 'default',
               defaultPreset: null,

               _presets: null,
               _selectedPreset: null
            },
            _userConfigName: null,
            _dropdown: null
         },

         $constructor: function () {
            this._publish('onChange');
         },

         init: function () {
            PresetsList.superclass.init.apply(this, arguments);
            this._userConfigName = 'ColumnsEditor#' + this._options.targetRegistryName;
            this._options._presets = new RecordSet({rawData:[], idProperty:'title'});
            this._dropdown = this.getChildControlByName('controls-Columns-PresetsList__dropdown');

            ClientsGlobalConfig/*UserConfig*/.getParam(this._userConfigName).addCallback(function (data) {
               _onLoadPresets(this, data);
               this.subscribeTo(this._dropdown, 'onSelectedItemsChange', function (evtName, selected, changes) {
                  this._setSelectedPreset(selected[0]);
                  this._notify('onChange');
               }.bind(this));
            }.bind(this));
         },

         getPresets: function () {
            return this._options._presets;
         },

         getSelectedPreset: function () {
            return this._options._selectedPreset;
         },

         setSelectedPreset: function (title) {
            this._options._selectedPreset = title;
         }
      });



      // Private methods:

      var _onLoadPresets = function (self, data) {
         var values = data && typeof data === 'string' ? JSON.parse(data) : data || [];
         var recordset = self._options._presets;
         //recordset.clear();
         recordset.setRawData(values.map(function (value) { return new Preset(value); }));
         recordset.acceptChanges();
         var selected = null;
         if (values.length) {
            selected = self._options.defaultPreset;
            selected = selected && values.map(function (v) { return v.title; }).indexOf(selected) !== -1 ? selected : values[0].title;
         }
         self._options._selectedPreset = selected;
         _update(self);
      };

      var _update = function (self) {
         var dropdown = self._presetDropdown;
         var presets = self._options._presets;
         dropdown.setItems(presets);
         var selected = self._options._selectedPreset;
         dropdown.setSelectedKeys(selected ? [selected] : []);
         dropdown.setEnabled(1 < presets.getCount());
      };



      return PresetsList;
   }
);

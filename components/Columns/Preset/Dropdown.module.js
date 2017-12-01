/**
 * Контрол "Выпадающий список пресетов редактора колонок"
 *
 * @public
 * @class SBIS3.CONTROLS.Columns.Preset.Dropdown
 * @extends SBIS3.CONTROLS.CompoundControl
 */
define('js!SBIS3.CONTROLS.Columns.Preset.Dropdown',
   [
      'Core/EventBus',
      'js!SBIS3.CONTROLS.Columns.Preset.Cache',
      'js!SBIS3.CONTROLS.Columns.Preset.Unit',
      'js!SBIS3.CONTROLS.CompoundControl',
      'tmpl!SBIS3.CONTROLS.Columns.Preset.Dropdown',
      'css!SBIS3.CONTROLS.Columns.Preset.Dropdown'
   ],

   function (EventBus, PresetCache, PresetUnit, CompoundControl, dotTplFn) {
      'use strict';



      /**
       * Канал событий
       * @private
       * @type {Core/EventBusChannel}
       */
      var _channel = EventBus.channel();



      var PresetDropdown = CompoundControl.extend([], /**@lends SBIS3.CONTROLS.Columns.Preset.Dropdown.prototype*/ {
         _dotTplFn: dotTplFn,
         $protected: {
            _options: {
               presets: null,
               presetNamespace: null,
               defaultPreset: null,
            },
            _dropdown: null,
            _selectedPreset: null
         },

         $constructor: function () {
            this._publish('onChange');
         },

         init: function () {
            PresetDropdown.superclass.init.apply(this, arguments);
            this._dropdown = this.getChildControlByName('controls-Columns-Preset-Dropdown__dropdown');
            var namespace = this._options.presetNamespace;
            if (namespace) {
               this._cacheHandler = this._updateDropdown.bind(this);
               PresetCache.subscribe(namespace, 'onCacheChanged', this._cacheHandler);

               PresetCache.list(namespace).addCallback(this._updateDropdown.bind(this));

               this.subscribeTo(this._dropdown, 'onSelectedItemsChange', function (evtName, selecteds, changes) {
                  this._selectedPreset = selecteds[0];
                  this._notify('onChange', selecteds[0]);
                  _channel.notifyWithTarget('onChangeSelectedPreset', this, selecteds[0]);
               }.bind(this));

               this._publish('onChange');
            }
            else {
               this._updateDropdown();
            }

            this._channelHandler = this._onChannel.bind(this);
            _channel.subscribe('onChangeSelectedPreset', this._channelHandler);
         },

         destroy: function () {
            PresetDropdown.superclass.destroy.apply(this, arguments);
            if (this._cacheHandler) {
               PresetCache.unsubscribe(this._options.presetNamespace, 'onCacheChanged', this._cacheHandler);
            }
            _channel.unsubscribe('onChangeSelectedPreset', this._channelHandler);
         },

         /**
          * Получить идентификатор выбранного пресета редактора колонок
          * @public
          * @return {string|number}
          */
         getSelectedPreset: function () {
            return this._selectedPreset;
         },

         /**
          * Обновить дропдаун
          * @protected
          * @param {SBIS3.CONTROLS.Columns.Preset.Unit} units Список пресетов редактора колонок
          */
         _updateDropdown: function (units) {
            var presets = self._options.presets || [];
            if (units && units.length) {
               presets.concat(units);
            }
            var dropdown = this._dropdown;
            dropdown.setItems(presets);
            var selected = this._selectedPreset;
            if (!selected) {
               var defSelected = this._options.defaultPreset;
               if (defSelected && unis.map(function (v) { return v.id; }).indexOf(defSelected) !== -1) {
                  selected = defSelected;
               }
               else
               if (presets.length) {
                  selected = presets[0].id;
               }
               this._selectedPreset = selected;
            }
            dropdown.setSelectedKeys(selected ? [selected] : []);
            dropdown.setEnabled(1 < presets.getCount());
         },

         /**
          * Обработчик события
          * @protected
          * @param {Core/EventObject} evtName Идентификатор события
          * @param {string} selectedPreset Идентификатор пресета редактора колонок
          */
         _onChannel: function (evtName, selectedPreset) {
            if (evtName.getTarget() !== this) {
               this._selectedPreset = selectedPreset;
               this._dropdown.setSelectedKeys([selectedPreset]);
               //this._notify('onChange', selecteds[0]);
            }
         }
      });

      return PresetDropdown;
   }
);

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

      /**
       * Текущий выбранный пресет
       * @private
       * @type {string|number}
       */
      var _lastSelected;



      var PresetDropdown = CompoundControl.extend([], /**@lends SBIS3.CONTROLS.Columns.Preset.Dropdown.prototype*/ {
         _dotTplFn: dotTplFn,
         $protected: {
            _options: {
               /**
                * @cfg {string} Заголовок дропдауна
                */
               title: null,//Определено в шаблоне
               /**
                * @cfg {SBIS3.CONTROLS.Columns.Preset.Unit[]} Список объектов статически задаваемых пресетов
                */
               staticPresets: null,
               /**
                * @cfg {string} Пространство имён для сохранения пользовательских пресетов
                */
               presetNamespace: null,
               /**
                * @cfg {string|number} Идентификатор первоначально выбранного пресета в дропдауне
                */
               selectedPresetId: null
            },
            _dropdown: null,
            _selectedPresetId: null
         },

         $constructor: function () {
            this._publish('onChange');
         },

         init: function () {
            PresetDropdown.superclass.init.apply(this, arguments);
            this._dropdown = this.getChildControlByName('controls-Columns-Preset-Dropdown__dropdown');
            this._selectedPresetId = _lastSelected || this._options.selectedPresetId;
            var namespace = this._options.presetNamespace;
            if (namespace) {
               this._cacheHandler = this._updateDropdown.bind(this);
               PresetCache.subscribe(namespace, 'onCacheChanged', this._cacheHandler);

               PresetCache.list(namespace).addCallback(this._updateDropdown.bind(this));

               this.subscribeTo(this._dropdown, 'onSelectedItemsChange', function (evtName, selecteds, changes) {
                  var selectedId = selecteds[0];
                  if (selectedId !== this._selectedPresetId) {
                     this._selectedPresetId = selectedId;
                     _lastSelected = selectedId;
                     if (this._isDropdownReady) {
                        this._notify('onChange', selectedId);
                        _channel.notifyWithTarget('onChangeSelectedPreset', this, selectedId);
                     }
                  }
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
          * Установить идентификатор выбранного пресета редактора колонок
          * @public
          * @param {string|number} selectedPresetId Идентификатор пресета редактора колонок
          */
         setSelectedPresetId: function (selectedPresetId) {
            if (selectedPresetId !== this._selectedPresetId) {
               this._selectedPresetId = selectedPresetId;
               _lastSelected = selectedPresetId;
               this._dropdown.setSelectedKeys([selectedPresetId]);
            }
         },

         /**
          * Получить идентификатор выбранного пресета редактора колонок
          * @public
          * @return {string|number}
          */
         getSelectedPresetId: function () {
            return this._selectedPresetId;
         },

         /**
          * Обновить дропдаун
          * @protected
          * @param {SBIS3.CONTROLS.Columns.Preset.Unit} units Список пресетов редактора колонок
          */
         _updateDropdown: function (units) {
            var presets = this._options.staticPresets || [];
            if (units && units.length) {
               presets = presets.concat(units);
               // TODO: Нужна ли общая сортировка ? Если да, то как пользователь будет различить статические и пользовательские пресеты ?
            }
            var dropdown = this._dropdown;
            dropdown.setItems(presets);
            var selectedId = this._selectedPresetId;
            if (selectedId && (!presets.length || presets.map(function (v) { return v.id; }).indexOf(selectedId) === -1)) {
               selectedId = null;
            }
            if (!selectedId && presets.length) {
               selectedId = presets[0].id;
            }
            this._selectedPresetId = selectedId;
            dropdown.setSelectedKeys(selectedId ? [selectedId] : []);
            dropdown.setEnabled(1 < presets.length);
            this._isDropdownReady = 0 < presets.length;
            dropdown.setVisible(this._isDropdownReady);
         },

         /**
          * Обработчик события
          * @protected
          * @param {Core/EventObject} evtName Идентификатор события
          * @param {string} selectedPresetId Идентификатор пресета редактора колонок
          */
         _onChannel: function (evtName, selectedPresetId) {
            if (evtName.getTarget() !== this && selectedPresetId !== this._selectedPresetId) {
               this._selectedPresetId = selectedPresetId;
               this._dropdown.setSelectedKeys([selectedPresetId]);
               //this._notify('onChange', selecteds[0]);
            }
         }
      });

      return PresetDropdown;
   }
);

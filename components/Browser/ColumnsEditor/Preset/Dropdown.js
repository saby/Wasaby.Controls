/**
 * Контрол "Выпадающий список пресетов редактора колонок"
 *
 * @class SBIS3.CONTROLS/Browser/ColumnsEditor/Preset/Dropdown
 * @extends SBIS3.CONTROLS/CompoundControl
 * @author Спирин В.А.
 * @public
 */
define('SBIS3.CONTROLS/Browser/ColumnsEditor/Preset/Dropdown',
   [
      'Core/EventBus',
      'SBIS3.CONTROLS/Browser/ColumnsEditor/Preset/Cache',
      'SBIS3.CONTROLS/CompoundControl',
      'tmpl!SBIS3.CONTROLS/Browser/ColumnsEditor/Preset/Dropdown',
      'css!SBIS3.CONTROLS/Browser/ColumnsEditor/Preset/Dropdown',
      'SBIS3.CONTROLS/Browser/ColumnsEditor/Preset/Unit'
   ],

   function (EventBus, PresetCache, CompoundControl, dotTplFn) {
      'use strict';



      /**
       * Канал событий
       * @private
       * @type {Core/EventBusChannel}
       */
      var _channel = EventBus.channel();

      /**
       * Текущие идентификаторы выбранных пресетов (раздельно по нэмспейсам)
       * @private
       * @type {object}
       */
      var _lastSelecteds = {};



      var PresetDropdown = CompoundControl.extend([], /**@lends SBIS3.CONTROLS/Browser/ColumnsEditor/Preset/Dropdown.prototype*/ {
         _dotTplFn: dotTplFn,
         $protected: {
            _options: {
               /**
                * @cfg {string} Заголовок дропдауна
                */
               title: null,//Определено в шаблоне
               /**
                * @cfg {SBIS3.CONTROLS/Browser/ColumnsEditor/Preset/Unit[]} Список объектов статически задаваемых пресетов
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
            this._dropdown = this.getChildControlByName('controls-Browser-ColumnsEditor-Preset-Dropdown__dropdown');
            var options = this._options;
            var namespace = options.presetNamespace || '';
            this._selectedPresetId = options.selectedPresetId || _lastSelecteds[namespace];
            if (namespace) {
               this._cacheHandler = this._onCache.bind(this);
               PresetCache.subscribe(namespace, 'onCacheChanged', this._cacheHandler);

               PresetCache.list(namespace).addCallback(this._updateDropdown.bind(this));
            }
            else {
               this._updateDropdown();
            }

            this.subscribeTo(this._dropdown, 'onSelectedItemsChange', function (evtName, selecteds, changes) {
               var selectedId = selecteds[0];
               var isChangedCurrent = selectedId !== this._selectedPresetId;
               if (isChangedCurrent) {
                  this._selectedPresetId = selectedId;
               }
               var isChangedLast = selectedId !== _lastSelecteds[namespace];
               if (isChangedLast) {
                  _lastSelecteds[namespace] = selectedId;
               }
               if (isChangedCurrent && this._isDropdownReady) {
                  this._notify('onChange', selectedId);
               }
               if (isChangedLast) {
                  _channel.notifyWithTarget('onChangeSelectedPreset', this, selectedId);
               }
            }.bind(this));

            this._channelHandler = this._onChannel.bind(this);
            _channel.subscribe('onChangeSelectedPreset', this._channelHandler);
         },

         setEnabled: function (enabled) {
            PresetDropdown.superclass.setEnabled.apply(this, arguments);
            var dropdown = this._dropdown;
            if (dropdown) {
               var items;
               dropdown.setEnabled(enabled && (items = dropdown.getItems()) && 1 < items.getCount())
            }
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
               this._setSelectedPresetId(selectedPresetId);
               _lastSelecteds[this._options.presetNamespace || ''] = selectedPresetId;
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
          * Получить выбранный пресет редактора колонок
          * @public
          * @return {SBIS3.CONTROLS/Browser/ColumnsEditor/Preset/Unit}
          */
         getSelectedPreset: function () {
            if (this._selectedPresetId) {
               var presetId = this._selectedPresetId;
               var preset; this.getPresets().some(function (v) { if (v.id === presetId) { preset = v; return true; } });
               return preset;
            }
         },

         /**
          * Получить список всех отображаемых пресетов редактора колонок
          * @public
          * @return {SBIS3.CONTROLS/Browser/ColumnsEditor/Preset/Unit[]}
          */
         getPresets: function () {
            return this._dropdown.getItems().getRawData();
         },

         /**
          * Установить идентификатор выбранного пресета редактора колонок
          * @protected
          * @param {string|number} selectedPresetId Идентификатор пресета редактора колонок
          */
         _setSelectedPresetId: function (selectedPresetId) {
            // Если указанный идентификатор пустой или есть в списке
            if (!selectedPresetId || this.getPresets().some(function (v) { return v.id === selectedPresetId; })) {
               this._selectedPresetId = selectedPresetId;
               this._dropdown.setSelectedKeys(selectedPresetId ? [selectedPresetId] : []);
            }
         },

         /**
          * Обновить дропдаун
          * @protected
          * @param {SBIS3.CONTROLS/Browser/ColumnsEditor/Preset/Unit} units Список пресетов редактора колонок
          */
         _updateDropdown: function (units) {
            var presets = this._options.staticPresets || [];
            if (units && units.length) {
               presets = presets.concat(units);
               // TODO: Нужна ли общая сортировка ? Если да, то как пользователь будет различить статические и пользовательские пресеты ?
            }
            var selectedId = this._selectedPresetId;
            if (selectedId && (!presets.length || !presets.some(function (v) { return v.id === selectedId; }))) {
               selectedId = null;
            }
            if (!selectedId && presets.length) {
               selectedId = presets[0].id;
            }
            var dropdown = this._dropdown;
            dropdown.setItems(presets);
            this._setSelectedPresetId(selectedId);
            dropdown.setEnabled(this.isEnabled() && 1 < presets.length);
            this._isDropdownReady = 0 < presets.length;
            dropdown.setVisible(this._isDropdownReady);
         },

         /**
          * Обработчик события
          * @protected
          * @param {Core/EventObject} evtName Идентификатор события
          * @param {SBIS3.CONTROLS/Browser/ColumnsEditor/Preset/Unit} units Список пресетов редактора колонок
          */
         _onCache: function (evtName, units) {
            this._updateDropdown(units);
         },

         /**
          * Обработчик события
          * @protected
          * @param {Core/EventObject} evtName Идентификатор события
          * @param {string} selectedPresetId Идентификатор пресета редактора колонок
          */
         _onChannel: function (evtName, selectedPresetId) {
            if (evtName.getTarget() !== this && selectedPresetId !== this._selectedPresetId) {
               this._setSelectedPresetId(selectedPresetId);
               //this._notify('onChange', selecteds[0]);
            }
         }
      });

      /**
       * Получить идентификатор последнего выбранного пресета редактора колонок
       * @public
       * @static
       * @param {string} namespace Пространство имён для сохранения пользовательских пресетов
       * @return {string|number}
       */
      PresetDropdown.getLastSelected = function (namespace) {
         return _lastSelecteds[namespace || ''];
      };



      return PresetDropdown;
   }
);

/**
 * Класс контрола "Кнопка открытия редактора колонок"
 *
 * @public
 * @class SBIS3.CONTROLS.Columns.EditorButton
 * @extends SBIS3.CONTROLS.CompoundControl
 */
define('js!SBIS3.CONTROLS.Columns.EditorButton',
   [
      'Core/core-merge',
      'js!SBIS3.CONTROLS.Columns.Preset.Dropdown',
      'js!SBIS3.CONTROLS.CompoundControl',
      'tmpl!SBIS3.CONTROLS.Columns.EditorButton',
      'css!SBIS3.CONTROLS.Columns.EditorButton',
      'js!SBIS3.CONTROLS.IconButton'
   ],

   function (coreMerge, PresetDropdown, CompoundControl, dotTplFn) {
      'use strict';

      var EditorButton = CompoundControl.extend([], /**@lends SBIS3.CONTROLS.Columns.EditorButton.prototype*/ {
         _dotTplFn: dotTplFn,
         $protected: {
            _options: {
               /**
                * @cfg {boolean} Показывать дропдаун с выбором пресета рядом с кнопкой
                */
               usePresets: true/*^^^*/,// TODO: Включить после переделки дропдауна с пресетами
               /**
                * @cfg {string} Заголовок дропдауна
                */
               presetsTitle: null,
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
               selectedPresetId: null,
               /**
                * @cfg {object} Дополнительные опции редактора колонок, например moveColumns и т.д.
                */
               editorOptions: null
            },
            _presetDropdown: null,
            _button: null
         },

         init: function () {
            EditorButton.superclass.init.apply(this, arguments);
            this._presetDropdown = this._options.usePresets ? this.getChildControlByName('controls-Columns-EditorButton__presetDropdown') : null;
            this._button = this.getChildControlByName('controls-Columns-EditorButton__button');

            var editorOptions = this._options.editorOptions;
            if (this._presetDropdown) {
               this.subscribeTo(this._presetDropdown, 'onChange', function (evtName, selectedPresetId) {
                  this.sendCommand('showColumnsEditor', _makeArgs(editorOptions, selectedPresetId));
               }.bind(this));
            }
            this.subscribeTo(this._button, 'onActivated', this.sendCommand.bind(this, 'showColumnsEditor', _makeArgs(editorOptions)));
         }
      });

      var _makeArgs = function (editorOptions, selectedPresetId) {
         var args = {applyToSelf:true};
         if (editorOptions) {
            args.editorOptions = coreMerge({}, editorOptions);
         }
         if (selectedPresetId) {
            (args.editorOptions = args.editorOptions || {}).selectedPresetId = selectedPresetId;
         }
         return args;
      };

      return EditorButton;
   }
);

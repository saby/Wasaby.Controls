/**
 * Класс контрола "Кнопка открытия редактора колонок"
 *
 * @public
 * @class SBIS3.CONTROLS.Columns.EditorButton
 * @extends SBIS3.CONTROLS.CompoundControl
 */
define('js!SBIS3.CONTROLS.Columns.EditorButton',
   [
      'js!SBIS3.CONTROLS.Columns.Preset.Dropdown',
      'js!SBIS3.CONTROLS.CompoundControl',
      'tmpl!SBIS3.CONTROLS.Columns.EditorButton',
      'css!SBIS3.CONTROLS.Columns.EditorButton',
      'js!SBIS3.CONTROLS.IconButton'
   ],

   function (PresetDropdown, CompoundControl, dotTplFn) {
      'use strict';

      var EditorButton = CompoundControl.extend([], /**@lends SBIS3.CONTROLS.Columns.EditorButton.prototype*/ {
         _dotTplFn: dotTplFn,
         $protected: {
            _options: {
               usePresets: false,// TODO: Включить после переделки дропдауна с пресетами
               presetsTitle: null,
               staticPresets: null,
               presetNamespace: 'default',// TODO: Убрать, не должно быть умолчания
               selectedPresetId: null
            },
            _presetDropdown: null,
            _button: null
         },

         $constructor: function () {
            this._publish('onActivated');
         },

         init: function () {
            EditorButton.superclass.init.apply(this, arguments);
            this._presetDropdown = this._options.usePresets ? this.getChildControlByName('controls-Columns-EditorButton__presetDropdown') : null;
            this._button = this.getChildControlByName('controls-Columns-EditorButton__button');

            if (this._presetDropdown) {
               this.subscribeTo(this._presetDropdown, 'onChange', function () {
                  this._notify('onActivated');
               }.bind(this));
            }
            this.subscribeTo(this._button, 'onActivated', function () {
               this._notify('onActivated');
            }.bind(this));
         }
      });

      return EditorButton;
   }
);

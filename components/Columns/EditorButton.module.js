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
               presetNamespace: 'default',// TODO: Убрать, не должно быть умолчания
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

            var handler = this.sendCommand.bind(this, 'showColumnsEditor', {editorOptions:this._options.editorOptions, applyToSelf:true});
            if (this._presetDropdown) {
               this.subscribeTo(this._presetDropdown, 'onChange', handler);
            }
            this.subscribeTo(this._button, 'onActivated', handler);
         }
      });

      return EditorButton;
   }
);

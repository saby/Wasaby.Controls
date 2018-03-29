/**
 * Класс контрола "Кнопка открытия редактора колонок"
 *
 * @class SBIS3.CONTROLS/Browser/ColumnsEditor/EditorButton
 * @extends SBIS3.CONTROLS/CompoundControl
 * @author Спирин В.А.
 * @public
 */
define('SBIS3.CONTROLS/Browser/ColumnsEditor/EditorButton',
   [
      'Core/core-merge',
      'SBIS3.CONTROLS/CompoundControl',
      'tmpl!SBIS3.CONTROLS/Browser/ColumnsEditor/EditorButton',
      'css!SBIS3.CONTROLS/Browser/ColumnsEditor/EditorButton',
      'SBIS3.CONTROLS/Browser/ColumnsEditor/Preset/Dropdown',
      'SBIS3.CONTROLS/Button/IconButton'
   ],

   function (coreMerge, CompoundControl, dotTplFn) {
      'use strict';

      var EditorButton = CompoundControl.extend([], /**@lends SBIS3.CONTROLS/Browser/ColumnsEditor/EditorButton.prototype*/ {
         _dotTplFn: dotTplFn,
         $protected: {
            _options: {
               /**
                * @cfg {string} Текст всплывающей подсказки у иконки шестерёнки
                */
               tooltip: null,
               /**
                * @cfg {boolean} Показывать дропдаун с выбором пресета рядом с кнопкой
                */
               usePresets: false,
               /**
                * @cfg {string} Заголовок дропдауна
                */
               presetsTitle: null,
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
            this._presetDropdown = this._options.usePresets ? this.getChildControlByName('controls-Browser-ColumnsEditor-EditorButton__presetDropdown') : null;
            this._button = this.getChildControlByName('controls-Browser-ColumnsEditor-EditorButton__button');

            var handler = _handler.bind(null, this);
            if (this._presetDropdown) {
               this.subscribeTo(this._presetDropdown, 'onChange', handler);
            }
            this.subscribeTo(this._button, 'onActivated', handler);
         }
      });

      var _handler = function (self) {
         var args = {applyToSelf:true};
         var options = self._options.editorOptions;
         if (options) {
            args.editorOptions = coreMerge({}, options);
         }
         if (self._presetDropdown) {
            var selected = self._presetDropdown.getSelectedPresetId();
            if (selected) {
               (args.editorOptions = args.editorOptions || {}).selectedPresetId = selected;
            }
         }
         self.sendCommand('showColumnsEditor', args);
      };

      return EditorButton;
   }
);

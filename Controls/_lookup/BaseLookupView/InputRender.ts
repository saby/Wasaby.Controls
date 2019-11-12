import input = require('Controls/input');
import template = require('wml!Controls/_lookup/BaseLookupView/InputRender/InputRender');


   var InputRenderLookup = input.Text.extend({
      _template: template,
      _defaultInput: null,

      _beforeUnmount: function() {
         this._defaultInput = null;
      },

      _getField: function() {
         if (this._options.isInputVisible) {
            return InputRenderLookup.superclass._getField.call(this);
         } else {
            // В поле связи с единичным выбором после выбора записи
            // скрывается инпут (технически он в шаблоне создаётся под if'ом),
            // но базовый input:Text ожидает, что input в вёрстке есть всегда.
            // Для корректной работы создаём виртуальный input.
            // Если его скрывать через display: none, то начинаются проблемы с фокусом,
            // поэтому данный способ нам не подходит.
            return this._getDefaultInput();
         }
      },

      _getReadOnlyField: function() {
         return this._getField();
      },

      _getDefaultInput: function() {
         if (!this._defaultInput) {
            this._defaultInput = document.createElement('input');
         }

         return this._defaultInput;
      },

      _keyDownInput: function(event) {
         this._notify('keyDownInput', [event]);
      }
   });

   export = InputRenderLookup;


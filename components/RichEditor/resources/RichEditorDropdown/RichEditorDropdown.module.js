
define('js!SBIS3.CONTROLS.RichEditor.RichEditorDropdown', ['js!SBIS3.CORE.FieldDropdown'], function(Dropdown) {
   'use strict';
   var
      RichEditorDropdown = Dropdown.extend({
      $constructor: function() {
         if (this._options.handlers && this._options.handlers.onChangeItem) {
            this.subscribe('onChangeItem', this._options.handlers.onChangeItem.bind(this));
         }
      },
      _fillDropdown: function() { //Переопределение функции заполнения DropDown (специальный hover-режим для FieldRichEditor)
         var data = this._options.data;
         if (!data) {
            return;
         }
         var
            keys = data.k,
            values = data.v,
            rendered = data.r,
            visual;
         this._optCont
            .attr('tabindex', '-1')
            .find('.custom-select-option')
            .unbind('click')
            .remove();
         for (var i = 0, l = keys.length; i < l; i++) { //Бежим по массиву ключей
            visual = rendered[i] || values[i]; //Что отображаем визуально
            if (!this._options.required || !this._isEmptyOption(keys[i], visual)){ //Если необязательно выбирать значение или не пустой итем
               var row = this._createCustomRow(keys[i], visual).appendTo(this._optContList); //Создаем div с выбранной записью
               if (this._valuesAreEqual(keys[i])) { //Если рендерим заголовок
                  this._textSelectedRow = values[i];
                  if (this._options.titleRender) {
                     row = this._options.titleRender.apply(this, [keys[i], values[i]]);
                     row = this._createCustomRow(keys[i], row);
                  } else {
                     row = row.clone();
                  }
                  row
                     .addClass('ws-field-dropdown-current')
                     .append(this._optArrow.clone().addClass('custom-select-arrow-open'))
                     .appendTo(this._optContHead);
               }
            }
         }
      },
      _selectingEvent: function(e) {
         var
            $target = $(e.target),
            valEquals;
         this._curval = $target.closest('.custom-select-option').attr('value');
         valEquals = this._inputControl.val() === this._curval;
         // Для режима hover не надо обрабатывать клик, если значения одинаковые - иначе слетает max-width
         if (!valEquals || !$target.hasClass('controls-RichEditor__DropdownText')) {
            this._hideOptions();
            if (!valEquals) {
               this._inputControl.val(this._curval);
               this._inputControl.change();
            }
            this._inputControl.focus();
            this._notify('onChangeItem', this._curval, valEquals, $target.parent());
         }
         this._notify('onRowClick', e);
         e.stopImmediatePropagation();
      },
      _getMinWidth: function(selectedOpt, hasScrollbar, scrollWidth) {
         return selectedOpt.parent().width() - ((hasScrollbar && this._isSubtractingScrollWidth()) ? scrollWidth : 0) - 2;
      }
   });
   return RichEditorDropdown;
});
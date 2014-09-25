define('js!SBIS3.CONTROLS.FormattedTextBox', ['js!SBIS3.CORE.Control', '!html!SBIS3.CONTROLS.FormattedTextBox', 'css!SBIS3.CONTROLS.FormattedTextBox'], function (Control, dotTplFn) {

   'use strict';

   /**
    * Можно вводить только значения особого формата (например телефон).
    * В поле ввода уже заранее будут введены символы из формата (например скобки и тире для телефона) и останется ввести только недостающие символы
    * @class SBIS3.CONTROLS.FormattedTextBox
    * @extends SBIS3.CORE.Control
    * @control
    */

   var FormattedTextBox = Control.Control.extend(/** @lends SBIS3.CONTROLS.FormattedTextBox.prototype */{
      $protected: {
         _dotTplFn: dotTplFn,
         _inputField: null,
         _mask: '',
         _options: {
            /**
             * @cfg {RegExp} формат ввода, всё что не подходит нельзя ввести
             */
            pattern: ''
         }
      },

      $constructor: function () {
         var self = this;
         this._mask = this._options.pattern;
         this._inputField = $('.controls-FormattedTextBox__field', this.getContainer().get(0));
         this._inputField.html(this._getHtmlMask());
         this._inputField.keypress(function(e){
            self._keyPressHandler(e);
            //self._setCaretPosition(window.getSelection().focusNode.parentElement,0);
         });
         this._inputField.keyup(function() {

         });
      },

      _keyPressHandler: function(e){
         var key = e.which,
             self = this,
             currentNode = window.getSelection().focusNode.parentElement;
      },

      // Получить положение каретки в элементе el
      _getCaret: function (el) {
         var element = el;
         element.focus();
         if (document.selection) {
            var sel = document.selection.createRange();
            var clone = sel.duplicate();
            sel.collapse(true);
            clone.moveToElementText(element);
            clone.setEndPoint('EndToEnd', sel);
            return clone.text.length;
         } else {
            return window.getSelection().getRangeAt(0).startOffset;
         }
      },

      _getAbsoluteCaret: function(){

      },

      // Установить каретку в положение pos элемента el
      _setCaretPosition : function(el, pos){
         var element = el;
         var range = document.createRange();
         var sel = window.getSelection();
         range.setStart(element, pos);
         range.collapse(true);
         sel.removeAllRanges();
         sel.addRange(range);
         el.focus();
      },

      /**
       * Конвертирует символ маски в regExp
       * @param {String} c символ маски
       * @return {RegExp}
       * @private
       */
      _charToRegExp : function(c){
         var regexp;
         switch(c) {
            case 'd':
               regexp = /\d/;
               break;
            case 'L':
            case 'l':
               regexp = /[А-ЯA-Zа-яa-zёЁ]/;
               break;
            case 'x':
            default:
               regexp = /[А-ЯA-Zа-яa-z0-9ёЁ]/;
               break;
         }
         return regexp;
      },

      _getHtmlMask: function(){
         var len = this._options.pattern.length,
             part= '', i = 0,
             mask = this._mask.replace(/d/g,'_'),
             htmlMask='';

         while (i<len){
            while (mask[i] != '_'){
               part += mask[i];
               i++;
            }
            htmlMask += (part != 0) ?'<em>'+ part +'</em>' : '';
            part = '';

            while (mask[i] == '_'){
               part += mask[i];
               i++;
            }
            htmlMask += (part != 0) ? '<em class="controls-FormattedTextBox__field-cont">'+ part +'</em>' : '';
            part = '';
         }
         return htmlMask;
      }

});

   return FormattedTextBox;

});
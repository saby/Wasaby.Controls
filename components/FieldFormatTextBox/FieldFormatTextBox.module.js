define('js!SBIS3.CONTROLS.FieldFormatTextBox', ['js!SBIS3.CONTROLS.FieldFormatBase', '!html!SBIS3.CONTROLS.FieldFormatTextBox', 'css!SBIS3.CONTROLS.FieldFormatTextBox'], function (FieldFormatBase, dotTplFn) {

   'use strict';

   /**
    * Можно вводить только значения особого формата (например телефон).
    * В поле ввода уже заранее будут введены символы из формата (например скобки и тире для телефона) и останется ввести только недостающие символы
    * @class SBIS3.CONTROLS.FormattedTextBox
    * @extends SBIS3.CORE.Control
    * @control
    */

   var FieldFormatTextBox = FieldFormatBase.extend(/** @lends SBIS3.CONTROLS.FieldFormatTextBox.prototype */{
      $protected: {
         _dotTplFn: dotTplFn,
         /**
          * Опции создаваемого контролла
          */
         _options: {
            /**
             * @cfg {RegExp} Маска, на базе которой будет создана html-разметка и в соответствии с которой
             * будет определён весь функционал
             */
            mask: 'd(ddd)ddd-dd-dd'
         },

         _KEYS: {
            DELETE: 46,
            TAB: 9,
            BACKSPACE: 8
         }
      },

      $constructor: function () {
         var self = this;

         this._initializeComponents();

         this._inputField = $('.controls-FieldFormatTextBox__field', this.getContainer().get(0));
         this._inputField.html(this._htmlMask);

         //var rng = document.createRange();
         //rng.selectNode(document.getElementsByClassName('controls-FieldFormatTextBox__field')[0]);

         //console.log('typeof window.getSelection().focusNode -> ', window.getSelection().focusNode );

         //this._inputField.unbind('keypress');
         //this._inputField.unbind('focus');

         this._inputField.focus(function(){
            self._focusHandler(self._inputField.get(0));
         });
         //this._inputField.keypress(function(event){
         //   event.preventDefault();
         //   var key = event.which;
         //   self._keyPressHandler(key, 'character');
         //});
         this._inputField.keypress(function(event){ event.preventDefault();});
         this._inputField.keyup(function(event){ event.preventDefault();});

         this._inputField.keydown(function(event){
            event.preventDefault();
            var
               key = event.which,
               type = '';

            if (!event.ctrlKey && key != self._KEYS.DELETE && key != self._KEYS.BACKSPACE){
               type = event.shiftKey ? 'shift_character' : 'character';
               self._keyPressHandler(key, type);
            }
            else if (key == self._KEYS.DELETE) {
               self._keyPressHandler(key, 'delete');
            }
            else if (key == self._KEYS.BACKSPACE){
               self._keyPressHandler(key, 'backspace');
            }
         });

         // DEBUGGING
         this._inputField.mouseup(function(){
            console.log(self._getCursor(true));
         });

         // DEBUGGING
         //this._getHtmlMask2();
         //var firstNeeded = this._isSeparatorContainerFirst ? 1 : 0;
         //this._moveCursor(this._getContainerByIndex(firstNeeded), 0);

      }
});

   return FieldFormatTextBox;
});
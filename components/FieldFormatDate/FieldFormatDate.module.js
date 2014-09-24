define('js!SBIS3.CONTROLS.FieldFormatDate', ['js!SBIS3.CONTROLS.FieldFormatBase', '!html!SBIS3.CONTROLS.FieldFormatDate', 'css!SBIS3.CONTROLS.FieldFormatDate'], function (FieldFormatBase, dotTplFn) {

   'use strict';

   /**
    * Можно вводить только значения особого формата (например телефон).
    * В поле ввода уже заранее будут введены символы из формата (например скобки и тире для телефона) и останется ввести только недостающие символы
    * @class SBIS3.CONTROLS.FieldFormatDate
    * @extends SBIS3.CORE.Control
    * @control
    */

   var FieldFormatDate = FieldFormatBase.extend(/** @lends SBIS3.CONTROLS.FieldFormatDate.prototype */{
      $protected: {
         _dotTplFn: dotTplFn,
         /**
          * Допустимые управляющие символы в маске.
          * Условные обозначения:
          *     1. D(day) -  Календарный день
          *     2. M(month) - Месяц
          *     3. Y(year) - Год
          *     4. H(hour) - Час
          *     5. I - Минута
          *     6. S(second) - Секунда
          *     7. U - Доля секунды
          */
         _controlCharacters: 'DMYHISU',
         /**
          * Символ, на который замещаются все управляющие символы в маске для последующего отображения на странице
          */
         _placeholder: '_',
         /**
          * Опции создаваемого контролла
          */
         _options: {
            /**
             * @cfg {RegExp} Маска, на базе которой будет создана html-разметка и в соответствии с которой
             * будет определён весь функционал
             */
            mask: 'DD:MM:YY'
         },

         _KEYS: {
            DELETE: 46,
            TAB: 9,
            BACKSPACE: 8
         }
      },

      $constructor: function () {
         var self = this;

         this._primalMask = this._options.mask;
         this._clearMask = this._getClearMask();
         this._isSeparatorContainerFirst = this._getTypeOfFirstContainer();
         this._htmlMask = this._getHtmlMask();

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

            //switch (key){
            //   case self._KEYS.DELETE:
            //      self._keyPressHandler(key, 'delete');
            //      break;
            //   case self._KEYS.BACKSPACE:
            //      self._keyPressHandler(key, 'backspace');
            //      break;
            //   default:
            //      type = event.shiftKey ? 'UpperCaseCharacter' : 'character';
            //      if ( key > 41 && event.shiftKey ) { alert(event.shiftKey);}
            //      self._keyPressHandler(key, type);
            //}
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

   return FieldFormatDate;
});
/**
 * Created by iv.cheremushkin on 28.08.2014.
 */

define('js!SBIS3.CONTROLS.NumberTextBox', ['js!SBIS3.CONTROLS.TextBox', 'html!SBIS3.CONTROLS.NumberTextBox/resources/NumberTextBoxArrows'], function (TextBox, arrowTpl) {

   'use strict';
   /**
    * Поле ввода, куда можно вводить только числовые значения
    * @class SBIS3.CONTROLS.NumberTextBox
    * @extends SBIS3.CONTROLS.TextBox
    */

   var NumberTextBox;
   NumberTextBox = TextBox.extend(/** @lends SBIS3.CONTROLS.NumberTextBox.prototype */ {
      $protected: {
         _inputField: null,
         _options: {
            afterFieldWrapper: arrowTpl,
            /**
             * @cfg {Boolean} Признак ввода только положительных чисел
             * Возможные значения:
             * <ul>
             *    <li>true - ввод только положительных чисел;</li>
             *    <li>false - нет ограничения на знак вводимых чисел.</li>
             * </ul>
             */
            onlyPositive: false,
            /**
             * @cfg {Boolean} Признак ввода только целых чисел
             * Возможные значения:
             * <ul>
             *    <li>true - ввод только целых чисел;</li>
             *    <li>false - возможен ввод дробных чисел.</li>
             * </ul>
             */
            onlyInteger: false,
            /**
             * @cfg {Number} Количество знаков после запятой
             * @noShow
             */
            numberFractDigits: null
         }
      },

      $constructor: function () {
         var self = this;
         this._publish('onChangeText');
         this.getContainer().addClass('controls-NumberTextBox');
         $('.js-controls-NumberTextBox__arrowDown', this.getContainer().get(0)).click(function () {
            if (self.isEnabled()) {
               self._arrowUpClick();
            }
         });

         $('.js-controls-NumberTextBox__arrowUp', this.getContainer().get(0)).click(function () {
            if (self.isEnabled()) {
               self._arrowDownClick();
            }
         });
      },

      setText: function (text) {
         var self = this;
         if (self._options.numberFractDigits && !self._options.onlyInteger) {
            text = parseFloat(text).toFixed(self._options.numberFractDigits);
         }
         NumberTextBox.superclass.setText.call(self, text);
      },

      _arrowUpClick: function(){
         this.setText(this._getSibling(this.getText(),-1));
      },

      _arrowDownClick: function(){
         this.setText(this._getSibling(this.getText(),1));
      },

      _keyPressBind: function (e) {
         var self = this,
             symbol = String.fromCharCode(e.which);

         if (/[0-9e]/.test(symbol)){
            return true;
         }

         if(/[.]/.test(symbol) && !self._options.onlyInteger){
            return true;
         }

         if(/[-]/.test(symbol) && !self._options.onlyPositive){
            return true;
         }

         e.preventDefault();
      },

      _getSibling: function ( val, a) {
         var self = this,
             value = val;
         if (value === '') {
            value = '0';
         }
         if (a == 1) {
            value = parseFloat(value) + 1;
         }
         if (a == -1 && !(self._options.onlyPositive && parseFloat(value) < 1 )) {
            value = parseFloat(value) - 1;
         }
         if (self._options.numberFractDigits && !self._options.onlyInteger) {
            return(parseFloat(value).toFixed(self._options.numberFractDigits));
         } else {
            return(value.toString());
         }
      }
   });

   return NumberTextBox;

});
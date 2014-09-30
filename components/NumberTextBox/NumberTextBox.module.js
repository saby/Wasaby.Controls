/**
 * Created by iv.cheremushkin on 28.08.2014.
 */

define('js!SBIS3.CONTROLS.NumberTextBox', ['js!SBIS3.CONTROLS.TextBox', 'html!SBIS3.CONTROLS.NumberTextBox/resources/NumberTextBoxArrows'], function (TextBox, arrowTpl) {

   'use strict';
   /**
    * Поле ввода, куда можно вводить только числовые значения
    * @class SBIS3.CONTROLS.NumberTextBox
    * @extends SBIS3.CONTROLS.TextBox
    * @control
    */

   var NumberTextBox;
   NumberTextBox = TextBox.extend(/** @lends SBIS3.CONTROLS.NumberTextBox.prototype */ {
      $protected: {
         _inputField: null,
         _options: {
            afterFieldWrapper: arrowTpl,
            /**
             * @cfg {Boolean} Можно вводить только положительыне
             */
            onlyPositive: false,
            /**
             * @cfg {Boolean} Можно вводить только целые
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
         $('.js-controls-NumberTextBox__arrowDown', this.getContainer().get(0)).click(function () {
            self._arrowUpClick();
         });

         $('.js-controls-NumberTextBox__arrowUp', this.getContainer().get(0)).click(function () {
            self._arrowDownClick();
         });
      },

      _arrowUpClick: function(){
         this._changeNumberByOne(-1);
      },

      _arrowDownClick: function(){
         this._changeNumberByOne(1);
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

      _changeNumberByOne: function (a) {
         var self = this,
             value = this.getText();
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
            self.setText(parseFloat(value).toFixed(self._options.numberFractDigits));
         } else {
            self.setText(value.toString());
         }
      }
   });

   return NumberTextBox;

});
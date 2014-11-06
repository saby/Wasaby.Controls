define('js!SBIS3.CONTROLS.DatePicker', ['js!SBIS3.CONTROLS.FormattedTextBoxBase', '!html!SBIS3.CONTROLS.DatePicker'], function (FormattedTextBoxBase, dotTplFn) {

   'use strict';

   /**
    * Можно вводить только значения особого формата даты.
    * @class SBIS3.CONTROLS.DatePicker
    * @extends SBIS3.CONTROLS.FormattedTextBoxBase
    */

   var DatePicker = FormattedTextBoxBase.extend(/** @lends SBIS3.CONTROLS.DatePicker.prototype */{
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
         _controlCharactersSet: {
            'D' : 'd',
            'M' : 'd',
            'Y' : 'd',
            'H' : 'd',
            'I' : 'd',
            'S' : 'd',
            'U' : 'd'
         },
         /**
          * Допустимые при создании контролла маски.
          * I. Маски для отображения даты:
          *     1. DD.MM.YYYY
          *     2. DD.MM
          *     3. DD.MM.YY
          *     4. YY-MM-DD
          *     5. YYYY-MM-DD
          */
         _possibleMasks: [
            'DD.MM.YY',
            'DD.MM.YYYY',
            'DD.MM',
            'YY-MM-DD',
            'YYYY-MM-DD'
         ],
         /**
          * Дата
          */
         _date:null,
         /**
          * Опции создаваемого контролла
          */
         _options: {
            /**
             * @cfg {String} Формат отображения даты, на базе которой будет создана html-разметка и в соответствии с которой
             * будет определён весь функционал
             * <wiTag group="Отображение" page=1>
             * @variant 'DD.MM.YY'
             * @variant 'DD.MM.YYYY'
             * @variant 'DD.MM'
             * @variant 'YY-MM-DD'
             * @variant 'YYYY-MM-DD'
             */
            mask: 'DD.MM.YY'
         }
      },

      $constructor: function () {
      },

      _getMask: function () {
         this._checkPossibleMask();
         return this._options.mask;
      },

      _checkPossibleMask: function(){
         if (this._possibleMasks.length !== 0){
            if (Array.indexOf(this._possibleMasks, this._options.mask) == -1){
               throw new Error('Маска не удовлетворяет ни одной допустимой маске данного контролла');
            }
         }
      },

      setText: function (text) {
         this._date = Date.fromSQL(text);
         this._drawDate();
         FormattedTextBoxBase.superclass.setText.call(this, text);
      },

      setDate: function (date) {
         if (date instanceof Date) {
            this._date = date;
            this._options.text = date.toSQL();
            this._drawDate();
         }
      },

      getDate:function(){
        return this._date;
      },

      _drawDate:function(){
         var self = this,
            newText = '';
         var
            regexp = new RegExp('[' + self._controlCharacters + ']+', 'g'),
            availCharsArray = self._primalMask.match(regexp);

         for(var i=0;i<availCharsArray.length;i++){
            switch (availCharsArray[i]){
               case 'YY' :newText+=(''+this._date.getFullYear()).slice(-2);break;
               case 'YYYY' :newText+=this._date.getFullYear();break;
               case 'MM' :newText+=('0'+(this._date.getMonth() + 1)).slice(-2);break;
               case 'DD' :newText+=('0' + this._date.getDate()).slice(-2);break;
            }
         }
         this._inputField.html(this._getHtmlMask(newText));
      },

      _updateText:function(){
         var text = '';
         $('.controls-FormattedTextBox__field-placeholder', this.getContainer()).each(function () {
            text += $(this).text();
         });
         var expr = new RegExp('(' + this._placeholder + ')', 'ig');
         // если есть плейсхолдеры, то значит опция text=null
         if (expr.test(text)) {
            this._options.text = null;
         } else {
            var date = new Date();
            var
               regexp = new RegExp('[' + this._controlCharacters + ']+', 'g'),
               availCharsArray = this._primalMask.match(regexp);

            for (var i = 0; i < availCharsArray.length; i++) {
               switch (availCharsArray[i]) {
                  case 'YY' :
                     date.setYear('20' + text.substr(0, 2));
                     text = text.substr(2);
                     break;
                  case 'YYYY' :
                     date.setYear(text.substr(0, 4));
                     text = text.substr(4);
                     break;
                  case 'MM' :
                     date.setMonth(text.substr(0, 2)-1);
                     text = text.substr(2);
                     break;
                  case 'DD' :
                     date.setDate(text.substr(0, 2));
                     text = text.substr(2);
                     break;
               }
            }
            this._date = date;
            this._options.text = date.toSQL();
         }
      }

   });

   return DatePicker;
});
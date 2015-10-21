define(['js!SBIS3.CONTROLS.Utils.HtmlDecorators/AbstractDecorator'], function (AbstractDecorator) {
   'use strict';

   /**
    * Декоратор текста, обеспечивающий построение лесенки
    * @class SBIS3.CONTROLS.Utils.HtmlDecorators/LadderDecorator
    * @public
    * @author Красильников Андрей Сергеевич
    */
   var LadderDecorator = AbstractDecorator.extend(/** @lends SBIS3.CONTROLS.Utils.HtmlDecorators/LadderDecorator.prototype */{
      $protected: {
         _options: {
            wordsLadderCount: 0,
            ladder: undefined
         },
         _ladderLastWords: {},
         _column: undefined
      },

      $constructor: function () {
      },

      checkCondition: function(obj) {
         if (obj.hasOwnProperty('ladderDecorator')) {
            this._column = obj['ladderDecorator'];
         }
      },
      /**
       * Применяет декоратор
       * @param {Object} text Текст для декорирования
       * @returns {*}
       */
      apply: function (text) {
         return this.setLadder(text);
      },

      /**
       * Обновляет настройки декоратора
       * @param {Object} control Экземпляр контрола
       */
      update: function (control) {
         LadderDecorator.superclass.update.apply(this, arguments);
         this._options.ladder = control._options.ladder;
         this._options.wordsLadderCount = control._options.wordsLadderCount;
      },

      _isLadderColumn: function(){
         return this._options.ladder && Array.indexOf(this._options.ladder, this._column.field) > -1;
      },

      /**
       * Вставляет в текст разметку, отображающую фразу подсвеченной
       * @param {*} text Текст
       * @returns {String}
       */
      setLadder: function (text) {
         if (!this._isLadderColumn()){
            return text;
         }
         if (this._options.wordsLadderCount) {
            var curLadderTextArray = text.split(' ');
            if (!this._ladderLastWords[this._column.field]) {
               this._ladderLastWords[this._column.field] = curLadderTextArray;
               return text;
            }
            var curLadderTextArrayCopy = $ws.core.clone(curLadderTextArray);
            for (var i = 0; i < this._options.wordsLadderCount && i < curLadderTextArray.length; i++) {
               if (curLadderTextArray[i] == this._ladderLastWords[this._column.field][i]) {
                  curLadderTextArray[i] = '<span class="ws-invisible">' + curLadderTextArray[i] + '</span>';
               }
               else {
                  break;
               }
            }
            this._ladderLastWords[this._column.field] = curLadderTextArrayCopy;
            return curLadderTextArray.join(' ');
         }

         if (this._ladderLastWords[this._column.field] == text) {
            return '<span class="ws-invisible">' + text + '</span>';
         }
         else {
            this._ladderLastWords[this._column.field] = text;
         }
         return text;
      }
   });

   return LadderDecorator;
});

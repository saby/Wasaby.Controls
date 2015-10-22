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
            ladder: undefined
         },
         _ladderLastWords: {},
         _columnName: undefined
      },

      $constructor: function () {
      },

      checkCondition: function(obj) {
         if (obj.hasOwnProperty('ladderDecorator')) {
            this._columnName = obj['ladderDecorator'];
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
      },

      _isLadderColumn: function(){
         return this._options.ladder && Array.indexOf(this._options.ladder, this._columnName) > -1;
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

         if (this._ladderLastWords[this._columnName] == text) {
            return '<span class="ws-invisible">' + text + '</span>';
         }

         this._ladderLastWords[this._columnName] = text;
         return text;
      }
   });

   return LadderDecorator;
});

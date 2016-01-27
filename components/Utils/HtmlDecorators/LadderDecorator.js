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
         _name: 'ladder',
         _options: {
            ladder: undefined
         },
         _ladderLastWords: {},
         _columnName: undefined,
         _parentId: undefined,
         _isCheckCondition: false
      },

      $constructor: function () {
      },
      /**
       * @param {Object|String} data либо передаем имя колонки, либо объект
       * Структура объекта:
       *    {
       *      column: String,               //имя колонки
       *      parentId: String,             //id родительского узла
       *    }
       */
      checkCondition: function(data) {
         var ladderData = data.hasOwnProperty('ladder') && data['ladder'],
            ladderDataType = typeof ladderData;
         this._parentId = 'null';
         if (!ladderData){
            this._columnName = undefined;
         }
         else if (ladderData && ladderDataType == 'object') {
            this._columnName = ladderData.column;
            this._parentId = ladderData.parentId || 'null';
         }
         else if (ladderDataType == 'string'){
            this._columnName = ladderData;
         }
         this._isCheckCondition = true;
         return true;
      },
      /**
       * Применяет декоратор
       * @param {Object} text Текст для декорирования
       * @returns {*}
       */
      apply: function (text) {
         if (!this._isCheckCondition){
            return text;
         }
         this._isCheckCondition = false;
         return this.setLadder(text);
      },

      /**
       * Обновляет настройки декоратора
       * @param {Object} control Экземпляр контрола
       */
      update: function (control) {
         LadderDecorator.superclass.update.apply(this, arguments);
         this._options.ladder = control._options.ladder;
         this._ladderLastWords = {};
      },

      removeNodeData: function(key){
         this._ladderLastWords[key] = {};
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

         if (!this._ladderLastWords[this._parentId]) {
            this._ladderLastWords[this._parentId] = {};
         }
         else if (this._ladderLastWords[this._parentId][this._columnName] == text) {
            return '<span class="controls-ladder ws-invisible">' + text + '</span>';
         }
         this._ladderLastWords[this._parentId][this._columnName] = text;

         return '<span class="controls-ladder">' + text + '</span>';
      }
   });

   return LadderDecorator;
});

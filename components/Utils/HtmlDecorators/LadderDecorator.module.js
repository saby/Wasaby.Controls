define('js!SBIS3.CONTROLS.Utils.HtmlDecorators.LadderDecorator', [
   'js!SBIS3.CONTROLS.Utils.HtmlDecorators.AbstractDecorator',
   'Core/IoC'
], function (AbstractDecorator, IoC) {
   'use strict';

   /**
    * Декоратор текста, обеспечивающий построение лесенки
    * @class SBIS3.CONTROLS.Utils.HtmlDecorators.LadderDecorator
    * @public
    * @author Крайнов Дмитрий Олегович
    * @deprecated Модуль будет удален в 3.7.5 используйте {@link WS.Data/Display/Ladder}
    */
   var LadderDecorator = AbstractDecorator.extend(/** @lends SBIS3.CONTROLS.Utils.HtmlDecorators.LadderDecorator.prototype */{
      $protected: {
         _name: 'ladder',
         _options: {
            ladder: undefined,
            ladderInstance: null
         },
         _record: null,
         _columnName: undefined,
         _isCheckCondition: false,
         _markLadderColumn: false,
         _ignoreEnabled: false
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
         if (!ladderData){
            this._columnName = undefined;
         }
         else if (ladderData && ladderDataType == 'object') {
            this._columnName = ladderData.column;
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
         if (!this._isCheckCondition || !this._columnName) {
            return text;
         }
         this._isCheckCondition = false;
         this._notifyDeprecated();
         return this.setLadder(text);
      },

      setRecord: function (record) {
         this._record = record;
      },

      /**
       * Обновляет настройки декоратора
       * @param {Object} control Экземпляр контрола
       */
      update: function (control) {
         LadderDecorator.superclass.update.apply(this, arguments);
         this._options.ladder = control._options.ladder;
      },

      /**
       * Вставляет в текст разметку, отображающую фразу подсвеченной
       * @param {*} text Текст
       * @returns {String}
       */
      setLadder: function (text) {
         var ladder = this._options.ladderInstance,
            record = this._record,
            column = this._columnName;

         if (!record || ladder.isPrimary(record, column)) {
            return '<span class="controls-ladder">' + text + '</span>';
         } else {
            return '<span class="controls-ladder ws-invisible">' + text + '</span>';
         }
      },

      reset: function(){},

      setMarkLadderColumn: function(enable){
         this._markLadderColumn = !!enable;
      },

      isMarkLadderColumn: function(){
         return this._markLadderColumn;
      },

      removeNodeData: function(key){},

      isIgnoreEnabled: function(){
         return this._ignoreEnabled;
      },

      setIgnoreEnabled: function(ignore){
        this._ignoreEnabled = !!ignore;
      },

      getIgnoreEnabled: function(){
         return this._ignoreEnabled;
      },

      _isLadderColumn: function(){
         return this._options.ladder && Array.indexOf(this._options.ladder, this._columnName) > -1;
      },

      _notifyDeprecated: function() {
         IoC.resolve('ILogger').info('LadderDecorator:', 'module SBIS3.CONTROLS.Utils.HtmlDecorators.LadderDecorator is deprecated and will be removed in 3.7.5. Use "it.ladder.get(it.item, it.field)" in your template instead. See https://wi.sbis.ru/docs/WS/Data/Display/Ladder/ for details.');
         this._notifyDeprecated = function(){};
      }
   });

   return LadderDecorator;
});

/**
 * Created by cheremushkin iv on 19.01.2015.
 */
define('js!SBIS3.CONTROLS.SearchMixin', [], function() {

   /**
    * Миксин, добавляющий иконку
    * @mixin SBIS3.CONTROLS.SearchMixin
    * @public
    * @author Крайнов Дмитрий Олегович
    */

   var SearchMixin = /**@lends SBIS3.CONTROLS.SearchMixin.prototype  */{
      /**
       * @event onSearch При поиске
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String} text Текст введенный в поле поиска
       */
      /**
       * @event onReset При нажатии кнопки отмена (крестик)
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       */
      $protected: {
         _curText: '',
         //Чтобы событие onReset не отправлялось непрерывно
         _onResetIsFired: true,
         _options: {
            /**
             * @cfg {Number|null} количество символов, которые нужно ввести, чтоб начать поиск.
             * @remark
             * Если установить опцию в null, то поиск не будет запускаться автоматически.
             */
            startCharacter : 3,
            /**
             * @cfg {Number} временной интервал, который показывает с какой частотой бросать событие поиска
             */
            searchDelay : 300
         }
      },

      $constructor: function() {
         this._publish('onSearch','onReset');
      },

      after : {
         _setTextByKeyboard : function(text) {
            this._startSearch(text);
         }
      },

      _startSearch: function(text) {
         var self = this;
         this._curText = text;
         window.setTimeout(function(){
            if (text == self._curText) {
               self._applySearch(text, false);
            }
         }, this._options.searchDelay);
      },

      _applySearch : function(text, force) {
         var hasStartCharacter = this._options.startCharacter !== null;

         if (text) {
            text = text.replace(/[<>]/g, '');
            if ( (hasStartCharacter && String.trim(text).length >= this._options.startCharacter) || force ) {
               this._notify('onSearch', text);
               this._onResetIsFired = false;
            } else if (hasStartCharacter) {
               this._notifyOnReset();
            }
         }
         else {
            this._notifyOnReset();
         }
      },

      _notifyOnReset: function() {
         if(!this._onResetIsFired) {
            this._notify('onReset');
            this._onResetIsFired = true;
         }
      }


   };

   return SearchMixin;

});
define('js!SBIS3.CONTROLS.SearchForm', [
   'js!SBIS3.CONTROLS.TextBox',
   'js!SBIS3.CONTROLS.SearchMixin',
   'html!SBIS3.CONTROLS.SearchForm',
   'html!SBIS3.CONTROLS.SearchForm/resources/SearchFormButtons'
], function (TextBox, SearchMixin, dotTplFn, buttonsTpl) {

   'use strict';

   /**
    * Cтрока поиска, поле ввода + кнопка поиска.
    * @class SBIS3.CONTROLS.SearchForm
    * @extends SBIS3.CONTROLS.TextBox
    * @mixes SBIS3.CONTROLS.SearchMixin
    * @public
    * @control
    * @demo SBIS3.CONTROLS.Demo.MySearchForm
    * @author Крайнов Дмитрий Олегович
    */

   var SearchForm = TextBox.extend([SearchMixin],/** @lends SBIS3.CONTROLS.SearchForm.prototype */ {
      /**
       * @event onSearch При нажатии кнопки поиска
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       * @param {String} text Текст введенный в поле поиска
       */
      /**
       * @event onReset При нажатии кнопки отмена (крестик)
       * @param {$ws.proto.EventObject} eventObject Дескриптор события.
       */
      _dotTplFn : dotTplFn,
      $protected: {
         _options: {
            afterFieldWrapper: buttonsTpl,
            /**
             * @cfg {String} Текст на кнопке поиска
             * @example
             * <pre>
             *     <option name="btnCaption">Найти</option>
             * </pre>
             */
            btnCaption: '',
            /**
             * @cfg {String} Подсказка в поле ввода
             * @example
             * <pre>
             *     <option name="placeholder">Введите ФИО полностью</option>
             * </pre>
             */
            placeholder: ''
         }
      },

      $constructor: function () {
         var self = this;

         this.subscribe('onTextChange', function(e, text) {
            $('.js-controls-SearchForm__reset', self.getContainer().get(0)).toggleClass('ws-hidden', text == '');
         });

         $('.js-controls-SearchForm__reset', this.getContainer().get(0)).click(function() {
            self.resetSearch();
         });

         $('.js-controls-SearchForm__search', this.getContainer().get(0)).click(function() {
            self._applySearch(self.getText());
         });
      },

      /**
       * Обработчик поднятия клавиши
       * @private
       */
      _keyUpBind:function(event) {
         SearchForm.superclass._keyUpBind.apply(this, arguments);
         if (event.which === $ws._const.key.enter) {
            this._applySearch(this.getText());
            event.stopPropagation();
         }
      },

      /**
       * Обработчик нажатия клавиши
       * @private
       */
      _keyDownBind: function(e) {
         SearchForm.superclass._keyDownBind.apply(this, arguments);
         e.stopPropagation();
      },

      /**
       * Сбросить поиск
       * @see applySearch
       */
      resetSearch: function(){
         $('.js-controls-SearchForm__reset', this.getContainer().get(0)).addClass('ws-hidden');
         this.setText('');
      }
   });

   return SearchForm;
});
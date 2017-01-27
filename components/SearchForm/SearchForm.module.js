define('js!SBIS3.CONTROLS.SearchForm', [
   "Core/constants",
   "js!SBIS3.CONTROLS.TextBox",
   "js!SBIS3.CONTROLS.SearchMixin",
   "js!SBIS3.CONTROLS.SuggestMixin",
   "js!SBIS3.CONTROLS.SuggestTextBoxMixin",
   "js!SBIS3.CONTROLS.ChooserMixin",
   "js!SBIS3.CONTROLS.PickerMixin",
   "html!SBIS3.CONTROLS.SearchForm",
   "html!SBIS3.CONTROLS.SearchForm/resources/SearchFormButtons",
   'css!SBIS3.CONTROLS.SearchForm'
], function ( constants,TextBox, SearchMixin, SuggestMixin, SuggestTextBoxMixin, ChooserMixin, PickerMixin, dotTplFn, buttonsTpl) {

   'use strict';

   /**
    * Cтрока поиска, поле ввода + кнопка поиска.
    * Подробнее конфигурирование контрола описано в разделе <a href="https://wi.sbis.ru/doc/platform/developmentapl/interfacedev/components/list/list-settings/filtering/list-search/">Строка поиска</a>.
    * @class SBIS3.CONTROLS.SearchForm
    * @extends SBIS3.CONTROLS.TextBox
    * @mixes SBIS3.CONTROLS.SearchMixin
    * @demo SBIS3.CONTROLS.Demo.MySearchForm
    * @author Крайнов Дмитрий Олегович
    *
    * @public
    * @control
    * @category Search
    */

   var SearchForm = TextBox.extend([SearchMixin, PickerMixin, SuggestMixin, SuggestTextBoxMixin, ChooserMixin],/** @lends SBIS3.CONTROLS.SearchForm.prototype */ {
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
             * @translatable
             */
            btnCaption: '',
            usePicker: false
         }
      },

      $constructor:function () {
         var self = this,
             afterFieldWrapper = this._getAfterFieldWrapper();

         this.subscribe('onTextChange', function(e, text) {
            $('.js-controls-SearchForm__reset', afterFieldWrapper).toggleClass('ws-hidden', text == '');
         });

         afterFieldWrapper.on('click', '.js-controls-SearchForm__reset', function() {
            self.resetSearch()
         });

         afterFieldWrapper.on('click', '.js-controls-SearchForm__search', function() {
            if(self.isEnabled()) {
               self.hidePicker();
               self.applySearch(true);
            }
         });
      },

      /**
       * Обработчик поднятия клавиши
       * @private
       */
      _keyUpBind:function(event) {
         if (event.which === constants.key.enter) {
            if (this._options.usePicker && this.isPickerVisible()) {
               SearchForm.superclass._keyUpBind.apply(this, arguments);
            } else {
               this._checkInputVal();
               this.applySearch(true);
            }
            event.stopPropagation();
         } else {
            SearchForm.superclass._keyUpBind.apply(this, arguments);
         }
      },

      _chooseCallback: function(result) {
         var item = result && result[0];
         if(item) {
            this._onListItemSelect(item.getId(), item);
         }
      },

      _onListItemSelect: function() {
         SearchForm.superclass._onListItemSelect.apply(this, arguments);
         this.applySearch(true);
      },

      /**
       * Обработчик нажатия клавиши
       * @private
       */
      _keyDownBind: function(e) {
         SearchForm.superclass._keyDownBind.apply(this, arguments);
         if (e.which === constants.key.enter) {
            e.stopPropagation();
            e.preventDefault();
         }
      }
   });

   return SearchForm;
});
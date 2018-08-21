define('SBIS3.CONTROLS/SearchForm', [
   "Core/constants",
   "SBIS3.CONTROLS/TextBox",
   "SBIS3.CONTROLS/Mixins/SearchMixin",
   "SBIS3.CONTROLS/Mixins/SuggestMixin",
   "SBIS3.CONTROLS/Mixins/SuggestTextBoxMixin",
   "SBIS3.CONTROLS/Mixins/ChooserMixin",
   "SBIS3.CONTROLS/Mixins/PickerMixin",
   "tmpl!SBIS3.CONTROLS/SearchForm/resources/SearchFormButtons",
   'css!SBIS3.CONTROLS/SearchForm/SearchForm',
   'css!SBIS3.CONTROLS/Suggest/Suggest'
], function ( constants,TextBox, SearchMixin, SuggestMixin, SuggestTextBoxMixin, ChooserMixin, PickerMixin, buttonsTpl) {

   'use strict';

   /**
    * Cтрока поиска, поле ввода + кнопка поиска.
    * Подробнее конфигурирование контрола описано в разделе <a href="/doc/platform/developmentapl/interface-development/components/list/list-settings/filtering/list-search/">Строка поиска</a>.
    * @class SBIS3.CONTROLS/SearchForm
    * @extends SBIS3.CONTROLS/TextBox
    *
    * @mixes SBIS3.CONTROLS/Mixins/SearchMixin
    * @mixes SBIS3.CONTROLS/Mixins/SuggestMixin
    * @mixes SBIS3.CONTROLS/Mixins/SuggestTextBoxMixin
    * @mixes SBIS3.CONTROLS/Mixins/ChooserMixin
    * @mixes SBIS3.CONTROLS/Mixins/PickerMixin
    *
    * @demo Examples/SearchForm/MySearchForm/MySearchForm
    * @author Крайнов Д.О.
    *
    * @public
    * @control
    * @category Search
    */

   var SearchForm = TextBox.extend([SearchMixin, PickerMixin, SuggestMixin, SuggestTextBoxMixin, ChooserMixin],/** @lends SBIS3.CONTROLS/SearchForm.prototype */ {
      /**
       * @event onSearch Происходит при нажатии кнопки поиска.
       * @param {Core/EventObject} eventObject Дескриптор события.
       * @param {String} text Поисковый запрос.
       */
      /**
       * @event onReset Происходит при нажатии кнопки отмена (крестик).
       * @param {Core/EventObject} eventObject Дескриптор события.
       */
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
            usePicker: false,
            _paddingClass: 'controls-SearchForm_padding'
         }
      },

      $constructor:function () {
         var self = this;

         this.subscribe('onTextChange', function(e, text) {
            $('.js-controls-SearchForm__reset', self.getContainer()).toggleClass('ws-hidden', text === '');
         });

         this.getContainer().on('click', '.js-controls-SearchForm__reset', function() {
            self.resetSearch();
            self._applyTooltip();
         });

         this.getContainer().on('click', '.js-controls-SearchForm__search', function() {
            if(self.isEnabled()) {
               self.hidePicker();
               if (self._options.trim) {
                  var text = self.getText();
                  if (text) {
                     text = text.trim();
                     if (text !== self._options.text) {
                        //безопасная установка текста без событий
                        self._drawText(text);
                        self._options.text = text;
                     }

                  }
               }
               self.applySearch(true);
            }
         });
      },
      
      _modifyOptions: function () {
         var opts = SearchForm.superclass._modifyOptions.apply(this, arguments);
         opts.className += ' controls-SearchForm';
         return opts;
      },

      /**
       * Обработчик поднятия клавиши
       * @private
       */
      _keyUpBind:function(event) {
         if (event.which === constants.key.enter) {
            /* Реагируем на нажатие enter'a, только если в списке автодополнения есть записи */
            if (this._options.usePicker && this.isPickerVisible() && this.getList().getItems().getCount()) {
               SearchForm.superclass._keyUpBind.apply(this, arguments);
            } else {
               if (this.isPickerVisible()) {
                  this.hidePicker();
               }
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
   
      _setPickerConfig: function() {
         var config =  SearchForm.superclass._setPickerConfig.apply(this, arguments),
             container = this.getContainer(),
             inputField = this._getInputField(),
             self = this;
      
         config.parentContainer = this.getContainer().parent();
         config.className = 'controls-searchForm__suggest';
         config.closeButton = true;
         config.handlers = {
            onShow: function() {
               container.css('z-index', parseInt(self._picker.getContainer().css('z-index'), 10) + 1)
                        .addClass('controls-searchForm__suggest-shown');
               inputField.addClass('controls-searchForm__field-suggest-shown');
            },
            onClose: function() {
               container.css('z-index', '')
                        .removeClass('controls-searchForm__suggest-shown');
               inputField.removeClass('controls-searchForm__field-suggest-shown');
            }
         };
         return config;
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
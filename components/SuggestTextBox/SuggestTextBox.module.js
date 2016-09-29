define('js!SBIS3.CONTROLS.SuggestTextBox', [
   'js!SBIS3.CONTROLS.TextBox',
   'js!SBIS3.CONTROLS.PickerMixin',
   'js!SBIS3.CONTROLS.SuggestMixin',
   'js!SBIS3.CONTROLS.ChooserMixin',
   'js!SBIS3.CONTROLS.SuggestTextBoxMixin',
   'js!SBIS3.CONTROLS.SearchMixin',
   'js!SBIS3.CONTROLS.ComponentBinder'
], function (TextBox, PickerMixin, SuggestMixin, ChooserMixin, SuggestTextBoxMixin, SearchMixin, ComponentBinder) {
   'use strict';

   /**
    * Поле ввода с автодополнением
    * @class SBIS3.CONTROLS.SuggestTextBox
    * @extends SBIS3.CONTROLS.TextBox
    * @mixes SBIS3.CONTROLS.PickerMixin
    * @mixes SBIS3.CONTROLS.SuggestMixin
    * @mixes SBIS3.CONTROLS.ChooserMixin
    * @demo SBIS3.CONTROLS.Demo.MySuggestTextBox Поле ввода с автодополнением
    * @author Крайнов Дмитрий Олегович
    *
    * @control
    * @public
    * @category Inputs
    */
   var SuggestTextBox = TextBox.extend([PickerMixin, SuggestMixin, ChooserMixin, SuggestTextBoxMixin, SearchMixin], {
      $protected: {
         _options: {
            /**
             * @cfg {String} Имя параметр фильтрации для поиска
             */
            searchParam : ''
         }
      },
      $constructor: function() {
         /* Если передали параметр поиска, то поиск производим через ComponentBinder */
         if(this._options.searchParam) {
            this.once('onSearch', function () {
               var componentBinder = new ComponentBinder({
                      view: this.getList(),
                      searchForm: this
                   }),
                   undefinedArg;

               /* Биндим suggestTextBox и список с помощью биндера,
                  передаём параметр, чтобы биндер не реагировал на сброс,
                  т.к. список просто скрывается по сбросу, и лишний запрос делать не надо */
               componentBinder.bindSearchGrid(this._options.searchParam, undefinedArg, undefinedArg, undefinedArg, true);

               /* Поднимем событие onSearch ещё раз,
                  чтобы componentBinder начал поиск в гриде */
               this._applySearch(this.getText(), true);
            });

            this.subscribe('onSearch', function() {
               this._showLoadingIndicator();
               this.hidePicker();
            });

            this.subscribe('onReset', this._resetSearch.bind(this));
         }
      },

      _onListDataLoad: function() {
         SuggestTextBox.superclass._onListDataLoad.apply(this, arguments);

         if(this._options.searchParam) {
            /* В событии onDataLoad момент нельзя показывать пикер т.к. :
               1) Могут возникнуть проблемы, когда после отрисовки пикер меняет своё положение.
               2) Данных в рекордсете ещё нет.
               3) В onDataLoad приклданые программисты могу менять загруженный рекордсет.
               Поэтому в этом событии просто одинарно подпишемся на событие отрисовки данных и покажем автодополнение (если требуется). */
            this.subscribeOnceTo(this.getList(), 'onDrawItems', function() {
               if(this._checkPickerState(false)) {
                  this.showPicker();
               }
            }.bind(this));
         }
      },

      showPicker: function() {
         SuggestTextBox.superclass.showPicker.apply(this, arguments);
         this._setEqualPickerWidth();
      },

      _setEqualPickerWidth: function() {
         var textBoxWidth = this.getContainer()[0].clientWidth,
             pickerContainer = this._picker.getContainer()[0];

         if (this._picker && textBoxWidth !== pickerContainer.clientWidth) {
            pickerContainer.style.width = textBoxWidth + 'px';
         }
      }
   });

   return SuggestTextBox;
});

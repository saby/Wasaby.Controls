/**
 * Created by am.gerasimov on 16.09.2016.
 */
define('js!SBIS3.CONTROLS.Utils.KbLayoutRevertObserver',
    [
       'js!SBIS3.CONTROLS.Utils.KbLayoutRevertUtil'
    ],
    function (KbLayoutRevertUtil) {
   'use strict';

   var KbLayoutRevertObserver = $ws.core.extend({}, {
      $protected: {
         _options: {
            /**
             * Текстовое поле
             * @param {SBIS3.CONTROLS.TextBoxBase} textBox
             */
            textBox: null,
            /**
             * Представление, в котором надо отслеживать параметр фильтрации
             * @param {SBIS3.CONTROLS.TextBoxBase} view
             */
            view: null,
            /**
             * Параметр, который надо отслеживать в фильтре представления
             * @param {String} param
             */
            param: null
         },
         _textBeforeTranslate: null,
         _onViewDataLoadHandler: null,
         _observed: false
      },

      $constructor: function() {
         this._onViewDataLoadHandler = this._onViewDataLoad.bind(this);
      },

      startObserve: function() {
         if(!this._observed) {
            this._options.view.subscribe('onDataLoad', this._onViewDataLoadHandler);
            this._observed = true;
         }
      },

      stopObserve: function() {
         if(this._observed) {
            this._options.view.unsubscribe('onDataLoad', this._onViewDataLoadHandler);
            this._textBeforeTranslate = null;
            this._observed = false;
         }
      },

      _onViewDataLoad: function(event, data) {
         var view = this._options.view;
         var viewFilter = view.getFilter();
         var searchValue = viewFilter[this._options.param];
         var revertedSearchValue = KbLayoutRevertUtil.process(searchValue);

         /* Не производим смену раскладки если:
            1) Нет поискового значения.
            2) После смены раскладки поисковое значения не меняется. */
         if(!searchValue || searchValue === revertedSearchValue) {
            return;
         }

         if(data.getCount()) {
            /* Есть данные и раскладка менялась - > просто меняем текст в строке поиска */
            if(this._textBeforeTranslate) {
               this._options.textBox.setText(searchValue);
               this._textBeforeTranslate = null;
            }
         } else {
            /* Если данных нет, то обработаем два случая:
               1) Была сменена раскладка - просто возвращаем фильтр в исходное состояние,
                  текст в строке поиска не меняем
               2) Смены раскладки не было, то транслитизируем текст поиска, и поищем ещё раз   */
            if(this._textBeforeTranslate) {
               viewFilter[this._options.param] = this._textBeforeTranslate;
               view.setFilter(viewFilter, true);
               this._textBeforeTranslate = null;
            } else {
               this._textBeforeTranslate = searchValue;
               viewFilter[this._options.param] = revertedSearchValue;
               view.setFilter(viewFilter);
            }
         }
      },

      destroy: function() {
         this._onViewDataLoadHandler = null;
         KbLayoutRevertObserver.superclass.destroy.call(this);
      }
   });

   return KbLayoutRevertObserver;
});

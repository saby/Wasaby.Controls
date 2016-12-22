/**
 * Created by am.gerasimov on 16.09.2016.
 */
define('js!SBIS3.CONTROLS.Utils.KbLayoutRevertObserver',
    [
   "Core/core-extend",
   "Core/helpers/string-helpers",
   "Core/core-functions",
   "js!SBIS3.CONTROLS.Utils.KbLayoutRevertUtil"
],
    function (cExtend, strHelpers, cFunctions, KbLayoutRevertUtil) {
   'use strict';

   var KbLayoutRevertObserver = cExtend({}, {
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
         _observed: false,
         _oldSearchValue: ''
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
            this._oldSearchValue = '';
         }
      },

      _onViewDataLoad: function(event, data) {
         var view = this._options.view,
             viewFilter = cFunctions.clone(view.getFilter()),
             searchValue = viewFilter[this.getParam()],
             viewItems = view.getItems(),
             revertedSearchValue, symbolsDifference;
         /* Не производим смену раскладки если:
            1) Нет поискового значения.
            2) После смены раскладки поисковое значения не меняется. */
         if(!searchValue || searchValue === revertedSearchValue) {
            return;
         }

         /* Требуется отключать обработку событий проекции при поиске со сменой раскладки,
            чтобы избежать моргания данных, обработка событий включается,
            когда поиск точно закончен (уже была сменена раскладка, если требуется) */
         function toggleItemsEventRaising(enable) {
            if(viewItems) {
               var isEqual = viewItems.isEventRaising() === enable;

               if(!isEqual) {
                  viewItems.setEventRaising(enable, true);
               }
            }
         }

         /* Смену раскладки делаем после проверок,
            т.к. значения в фильтре уже может не быть */
         revertedSearchValue = KbLayoutRevertUtil.process(searchValue);

         if(data.getCount()) {
            /* Есть данные и раскладка менялась - > просто меняем текст в строке поиска */
            if(this._textBeforeTranslate) {
               this._options.textBox.setText(searchValue);
               this._textBeforeTranslate = null;
               toggleItemsEventRaising(true);
            }
            // если поиск произошел то запоминаем текущее значение
            this._oldSearchValue = searchValue;
         } else {
            /* Если данных нет, то обработаем два случая:
               1) Была сменена раскладка - просто возвращаем фильтр в исходное состояние,
                  текст в строке поиска не меняем
               2) Смены раскладки не было, то транслитизируем текст поиска, и поищем ещё раз   */
            if(this._textBeforeTranslate) {
               viewFilter[this.getParam()] = this._textBeforeTranslate;
               view.setFilter(viewFilter, true);
               this._textBeforeTranslate = null;
               toggleItemsEventRaising(true);
            } else {
               /* Если количество символов в поисковом значении уменьшилось,
                  значит поисковое значение либо полностью изменилось, либо удалили часть символов,
                  в таком случае не надо искать/менять добавленную часть символов */
               if(searchValue.length > this._oldSearchValue) {
                  // ищем разницу между старым и текущим значением поискового запроса
                  symbolsDifference = strHelpers.searchSymbolsDifference(searchValue, this._oldSearchValue);
               }

               /* 1) Между запросами есть разница, тогда
                     а) Если есть общая часть, то значит пользователь
                        продолжил ввод запроса и нужно транслитизировать добавленную часть
                     б) Общей части нет, значит запрос изменился и нужно транслитизировать новое значение

                  2) Если пользователь захотел искать один и тот же запрос дважды, то транслитизируем текущее значение
                */
               if(symbolsDifference) {
                  if (symbolsDifference[0].length) {
                     // будем транслитизировать только добавленную часть
                     revertedSearchValue = this._oldSearchValue + KbLayoutRevertUtil.process(symbolsDifference[1]);
                  } else {
                     // если совпадений нет, то значит нужно транслитизировать новое значение
                     revertedSearchValue = KbLayoutRevertUtil.process(searchValue);
                  }
               } else {
                  // если новый запрос такой же как и старый, то транслитизируем и попытаемся найти данные
                  revertedSearchValue = KbLayoutRevertUtil.process(searchValue);
               }


               this._textBeforeTranslate = searchValue;
               viewFilter[this.getParam()] = revertedSearchValue;
               toggleItemsEventRaising(false);
               view.setFilter(viewFilter);
            }
         }
      },

      setParam: function(param) {
         this._options.param = param
      },

      getParam: function() {
         return this._options.param;
      },

      destroy: function() {
         this._onViewDataLoadHandler = null;
         KbLayoutRevertObserver.superclass.destroy.call(this);
      }
   });

   return KbLayoutRevertObserver;
});
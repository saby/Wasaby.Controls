/**
 * Created by am.gerasimov on 16.09.2016.
 */
define('js!SBIS3.CONTROLS.Utils.KbLayoutRevertObserver',
   [
      "Core/core-extend",
      "Core/helpers/string-helpers",
      "Core/core-functions",
      "js!SBIS3.CONTROLS.Utils.KbLayoutRevertUtil",
      "js!SBIS3.CONTROLS.MissSpell"
   ],
   function (cExtend, strHelpers, cFunctions, KbLayoutRevertUtil, MissSpell) {
      'use strict';

      /* Вспомогательный класс, для посчёта времени запроса.
       Нужен, чтобы понять, требуется ли скрывать/отображать индикатор  */
      function Timer(){
         this.startTime = null;
         this.stared = false;

         this.start = function() {
            this.startTime = new Date();
            this.stared = true;
         };
         this.stop = function() {
            this.startTime = null;
            this.stared = false;
         };
         this.getTime = function() {
            /* Возвращаем время в мс */
            return this.startTime ? new Date().getTime() - this.startTime.getTime() : 0; //startTime может не быть, если memory source
         };
      }

      /* Обобщение механизма ожидания делается по задаче
       https://inside.tensor.ru/opendoc.html?guid=7ef15c0d-c70e-4956-ba97-7f9e6d0d4f15&des=
       Задача в разработку 25.03.2016 нужно обобщить появление ромашки ожидания. в FormController, в ListView логика ожидания должна быть … */
      var INDICATOR_DELAY = 750;

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
                * @param {SBIS3.CONTROLS.ListView} view
                */
               view: null,
               /**
                * Параметр, который надо отслеживать в фильтре представления
                * @param {String} param
                */
               param: null,
               /**
                * Включить смену раскладки по новому стандарту
                */
               newStandart: false
            },
            _textBeforeTranslate: null,
            _itemsBeforeTranslate: null,
            _onViewDataLoadHandler: null,
            _observed: false,
            _oldSearchValue: '',
            _timer: null,
            _missSpell: null,
            _missSpellUsed: false
         },

         $constructor: function() {
            this._onViewDataLoadHandler = this._onViewDataLoad.bind(this);
            this._onBeforeDataLoadHandler = this._onBeforeDataLoad.bind(this);
         },

         startObserve: function() {
            if(!this._observed) {
               this._toggleViewEvents(true);
               this._observed = true;
            }
         },

         stopObserve: function() {
            if(this._observed) {
               this._toggleViewEvents(false);
               this._textBeforeTranslate = null;
               this._observed = false;
               this._oldSearchValue = '';
               this._hideMissSpell();
               this._toggleItemsEventRising(true, true);
            }
         },

         _toggleViewEvents: function (toggle) {
            var view = this._options.view,
                method = toggle ? 'subscribeTo' : 'unsubscribeFrom';
            if(view.getDataSource()) {
               view[method](view.getDataSource(), 'onBeforeProviderCall', this._onBeforeDataLoadHandler);
            }
            view[method](view, 'onDataLoad', this._onViewDataLoadHandler);
         },

         _onBeforeDataLoad: function() {
            var timer = this._getTimer();

            if(!timer.stared) {
               timer.start();
            }
         },

         _getTimer: function() {
            if(!this._timer) {
               this._timer = new Timer();
            }
            return this._timer;
         },

         _onViewDataLoad: function(event, data) {
            var view = this._options.view,
               viewFilter = cFunctions.clone(view.getFilter()),
               searchParam = this._options.param,
               searchValue = viewFilter[searchParam],
               textBox = this._options.textBox,
               self = this;

            function reloadWithRevert() {
               var revertedSearchValue = changeStringLayout(searchValue, self._oldSearchValue);

               if(revertedSearchValue !== searchValue) {
                  self._textBeforeTranslate = searchValue;
                  viewFilter[searchParam] = revertedSearchValue;
                  self._toggleItemsEventRising(false, false);
                  /* Для того, чтобы индикатор не моргал между запросами, если запрос работает > INDICATOR_DELAY */
                  if (self._getTimer().getTime() > INDICATOR_DELAY) {
                     view.getContainer().find('.controls-AjaxLoader').eq(0).removeClass('ws-hidden');
                  }
                  self._getTimer().stop();
                  view.setFilter(viewFilter);
               }
            }

            function backOldSearchValue() {
               viewFilter[searchParam] = self._textBeforeTranslate;
               view.setFilter(viewFilter, true);
               self._itemsBeforeTranslate = null;
               self._textBeforeTranslate = null;
            }

            function showMissSpellValue(value) {
               self._showMissSpell(value);
               self._toggleItemsEventRising(true, true);
            }

            function successSearch() {
               self._oldSearchValue = searchValue;
               /* 1) Вернём старые данные, если есть и выведем сообщение
                2) Если старых данных нет, то просто установим новые */
               if(self._textBeforeTranslate) {
                  /* Прошлый поиск был успешен -> вернём данные с прошлого поиска,
                   но отобразим сообщение */
                  if(self._options.newStandart) {
                     if (self._itemsBeforeTranslate && self._itemsBeforeTranslate.getCount()) {
                        data.prepend(self._itemsBeforeTranslate);
                        backOldSearchValue();
                        showMissSpellValue(searchValue)
                     } else {
                        /* Прошлый поиск был не успешен -> отображаем данные и выводим сообщение */
                        showMissSpellValue(searchValue);
                        self._textBeforeTranslate = null;
                     }
                  } else {
                     /* Могут изменить введённый текст в промежуток между событием onSearch (500мс задержка) и прошлым вводом,
                      проверим это */
                     if(textBox.getText().length === searchValue.length) {
                        textBox.setText(searchValue);
                        view.setHighlightText(searchValue, false);
                     }
                     self._textBeforeTranslate = null;
                     self._toggleItemsEventRising(true, true);
                  }
               } else {
                  if(self._options.newStandart) {
                     /* Данные есть, но в другой раскладке не искали -> запоминаем данные и ищем */
                     self._itemsBeforeTranslate = data;
                     reloadWithRevert();
                  }
               }
            }

            function failureSearch()  {
               /* Данных нет и не меняли раскладку -> меняем, ищем */
               if(self._textBeforeTranslate) {
                  if(self._options.newStandart) {
                     /* Раскладку меняли, но новых данных нет ->
                      возвращаем старые, сообщение не выводим */
                     if (self._itemsBeforeTranslate) {
                        data.assign(self._itemsBeforeTranslate);
                     }
                     backOldSearchValue();
                     self._toggleItemsEventRising(true, true);
                     self._hideMissSpell();
                  } else {
                     viewFilter[searchParam] = self._textBeforeTranslate;
                     view.setFilter(viewFilter, true);
                     self._textBeforeTranslate = null;
                     self._toggleItemsEventRising(true, true);
                  }
               } else {
                  reloadWithRevert();
               }
            }

            if(!searchValue || this._missSpellUsed) {
               this._missSpellUsed = false;
               return;
            }

            if(data.getCount()) {
               successSearch();
            } else {
               failureSearch();
            }
         },


         /* Требуется отключать обработку событий проекции при поиске со сменой раскладки,
          чтобы избежать моргания данных, обработка событий включается,
          когда поиск точно закончен (уже была сменена раскладка, если требуется) */
         _toggleItemsEventRising: function(enable, analyze) {
            var items = this._options.view.getItems();

            if(items) {
               var isEqual = items.isEventRaising() === enable;

               if(!isEqual) {
                  items.setEventRaising(enable, analyze);
               }
            }
         },

         _showMissSpell: function(caption) {
            var missSpell = this._getMissSpell();
            missSpell.setCaption(caption);
            missSpell.show();
         },

         _hideMissSpell: function() {
            if(this._missSpell) {
               this._getMissSpell().hide();
            }
         },

         _getMissSpell: function() {
            if(!this._missSpell) {
               var self = this;
               this._missSpell = new MissSpell({
                  element: document.createElement('div'), //Делается через виртуальную ноду, чтобы была только одна вставка в DOM
                  parent: this._options.view,
                  handlers: {
                     onReady: function () {
                        this._container.insertBefore(self._options.view.getContainer())
                     },
                     onActivated: function (event, caption) {
                        self._missSpellUsed = true;
                        self._missSpell.hide();
                        self._options.textBox.setText(caption);
                        self._options.textBox.applySearch();
                     }
                  }
               });
            }

            return this._missSpell;
         },

         destroy: function() {
            if(this._timer) {
               this._timer.stop();
               this._timer = null;
            }
            if(this._missSpell) {
               this._missSpell.destroy();
               this._missSpell = null;
            }
            this._toggleViewEvents(false);
            this._onViewDataLoadHandler = null;
            this._onBeforeDataLoadHandler = null;
            KbLayoutRevertObserver.superclass.destroy.call(this);
         }
      });

      function changeStringLayout(searchValue, oldSearchValue) {
         var result, symbolsDifference;

         if(searchValue && oldSearchValue) {
            if (searchValue.length > oldSearchValue.length) {
               // ищем разницу между старым и текущим значением поискового запроса
               symbolsDifference = strHelpers.searchSymbolsDifference(searchValue, self._oldSearchValue);
            }
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
               result = oldSearchValue + KbLayoutRevertUtil.process(symbolsDifference[1]);
            } else {
               // если совпадений нет, то значит нужно транслитизировать новое значение
               result = KbLayoutRevertUtil.process(searchValue);
            }
         } else {
            // если новый запрос такой же как и старый, то транслитизируем и попытаемся найти данные
            result = KbLayoutRevertUtil.process(searchValue);
         }

         return result;
      }

      return KbLayoutRevertObserver;
   });